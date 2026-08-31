'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';
import { rateLimit, getClientIp } from '@/lib/ratelimit';

const ContactSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters').max(80),
  email: z.string().trim().email('Please enter a valid email').max(120),
  message: z.string().trim().min(20, 'Message must be at least 20 characters').max(4000),
  // honeypot — must be empty
  company: z.string().max(0).optional().default(''),
  // behavioral — must be at least 2000ms after focus
  formTime: z.coerce.number().int().min(2000, 'Submission too fast').max(60 * 60 * 1000),
});

export type ContactResult =
  | { ok: true; id: string }
  | { ok: false; error: 'validation'; fieldErrors: Record<string, string> }
  | { ok: false; error: 'rate_limited'; retryAfterMs: number }
  | { ok: false; error: 'spam' }
  | { ok: false; error: 'delivery'; message: string };

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

async function sendViaSMTP(payload: { name: string; email: string; message: string }) {
  const host = getEnv('SMTP_HOST');
  const port = Number(getEnv('SMTP_PORT') ?? '587');
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');
  const to = getEnv('CONTACT_TO') ?? 'eliosmernica@gmail.com';
  if (!host || !user || !pass) return false;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `${payload.name} <${payload.email}>`,
    to,
    replyTo: payload.email,
    subject: `New portfolio message from ${payload.name}`,
    text: payload.message,
    html: `<p><strong>From:</strong> ${payload.name} &lt;${payload.email}&gt;</p><p>${payload.message.replace(/\n/g, '<br/>')}</p>`,
  });
  return true;
}

async function sendViaEmailJS(payload: { name: string; email: string; message: string }) {
  const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID') ?? getEnv('EMAILJS_SERVICE_ID');
  const templateId = getEnv('VITE_EMAILJS_TEMPLATE_ID') ?? getEnv('EMAILJS_TEMPLATE_ID');
  const publicKey = getEnv('VITE_EMAILJS_PUBLIC_KEY') ?? getEnv('EMAILJS_PUBLIC_KEY');
  if (!serviceId || !templateId || !publicKey) return false;

  // Server-side EmailJS via REST (no SDK needed)
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        name: payload.name,
        email: payload.email,
        message: payload.message,
        title: `Message from ${payload.name}`,
        time: new Date().toISOString(),
        reply_to: payload.email,
      },
    }),
  });
  return res.ok;
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const raw = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    company: String(formData.get('company') ?? ''),
    formTime: Number(formData.get('formTime') ?? 0),
  };

  // Honeypot
  if (raw.company.trim().length > 0) {
    return { ok: false, error: 'spam' };
  }

  // Validation
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === 'string') fieldErrors[k] = issue.message;
    }
    return { ok: false, error: 'validation', fieldErrors };
  }

  // Rate limit (1 / 30s, 5 / hour, per IP) — best-effort IP from common proxy headers
  const xff = (formData.get('_xff') as string | null) ?? 'unknown';

  const fast = rateLimit(`contact:fast:${xff}`, { capacity: 1, refillPerSecond: 1 / 30 });
  if (!fast.ok) return { ok: false, error: 'rate_limited', retryAfterMs: fast.retryAfterMs };
  const slow = rateLimit(`contact:slow:${xff}`, { capacity: 5, refillPerSecond: 5 / 3600 });
  if (!slow.ok) return { ok: false, error: 'rate_limited', retryAfterMs: slow.retryAfterMs };

  // Delivery
  try {
    const ok = (await sendViaSMTP(parsed.data)) || (await sendViaEmailJS(parsed.data));
    if (!ok) {
      return {
        ok: false,
        error: 'delivery',
        message: 'Email service is not configured. Email me directly at eliosmernica@gmail.com.',
      };
    }
    return { ok: true, id: crypto.randomUUID() };
  } catch (e) {
    return {
      ok: false,
      error: 'delivery',
      message: 'Delivery failed. Please try again or email me directly at eliosmernica@gmail.com.',
    };
  }
}
