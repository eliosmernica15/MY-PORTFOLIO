"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { rateLimitAsync } from "@/lib/ratelimit";
import { validateCsrfToken, getCsrfToken } from "@/lib/csrf";

const ContactSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(80),
  email: z.string().trim().email("Please enter a valid email").max(120),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(4000),
  // Optional subject (Mail app / Hire Me app). No CRLF allowed.
  subject: z
    .string()
    .trim()
    .max(150)
    .regex(/^[^\r\n]*$/, "Subject must be a single line")
    .optional(),
  // Hire Me qualification — all optional; validated as strict enums.
  projectType: z
    .enum(["website", "webapp", "saas", "ecommerce", "ai", "custom", "other"])
    .optional(),
  timeline: z.enum(["asap", "2-4w", "1-3m", "flexible"]).optional(),
  budget: z
    .enum(["<1k", "1k-3k", "3k-5k", "5k-10k", "10k+", "prefer_not_to_say"])
    .optional(),
  source: z.enum(["mail", "hire-me"]).optional().default("mail"),
  // honeypot — must be empty
  company: z.string().max(0).optional().default(""),
  // behavioral — must be at least 2000ms after focus
  formTime: z.coerce
    .number()
    .int()
    .min(2000, "Submission too fast")
    .max(60 * 60 * 1000),
});

export type ContactResult =
  | { ok: true; id: string }
  | { ok: false; error: "validation"; fieldErrors: Record<string, string> }
  | { ok: false; error: "rate_limited"; retryAfterMs: number }
  | { ok: false; error: "spam" }
  | { ok: false; error: "delivery"; message: string };

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const escapeSmtpHeader = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function qualificationBlock(data: {
  projectType?: string;
  timeline?: string;
  budget?: string;
}): { text: string; html: string } {
  const rows: [string, string][] = [];
  if (data.projectType) rows.push(["Project", data.projectType]);
  if (data.timeline) rows.push(["Timeline", data.timeline]);
  if (data.budget) rows.push(["Budget", data.budget]);
  if (rows.length === 0) return { text: "", html: "" };
  const text =
    "— Project qualification —\n" +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    "\n— — —\n\n";
  const html =
    `<p><strong>Project qualification</strong></p><ul>` +
    rows
      .map(
        ([k, v]) =>
          `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`,
      )
      .join("") +
    `</ul><hr/>`;
  return { text, html };
}

async function sendViaSMTP(payload: {
  name: string;
  email: string;
  message: string;
  subject?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
}) {
  const host = getEnv("SMTP_HOST");
  const port = Number(getEnv("SMTP_PORT") ?? "587");
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const to = getEnv("CONTACT_TO") ?? "eliosmernica@gmail.com";
  if (!host || !user || !pass) return false;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const qualification = qualificationBlock(payload);
  const subject = payload.subject?.trim()
    ? `Portfolio: ${escapeSmtpHeader(payload.subject)}`
    : `New portfolio message from ${escapeSmtpHeader(payload.name)}`;

  await transport.sendMail({
    // Strip CRLF so a crafted name can't inject extra SMTP headers.
    from: `${escapeSmtpHeader(payload.name)} <${payload.email}>`,
    to,
    replyTo: payload.email,
    subject,
    text: qualification.text + payload.message,
    html: `<p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p>${qualification.html}<p>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>`,
  });
  return true;
}

async function sendViaEmailJS(payload: {
  name: string;
  email: string;
  message: string;
  subject?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
}) {
  const serviceId = getEnv("EMAILJS_SERVICE_ID");
  const templateId = getEnv("EMAILJS_TEMPLATE_ID");
  const publicKey = getEnv("EMAILJS_PUBLIC_KEY");
  if (!serviceId || !templateId || !publicKey) return false;

  const qualification = qualificationBlock(payload);

  // Server-side EmailJS via REST (no SDK needed)
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        name: payload.name,
        email: payload.email,
        message: qualification.text + payload.message,
        title: payload.subject?.trim()
          ? `Portfolio: ${payload.subject}`
          : `Message from ${payload.name}`,
        time: new Date().toISOString(),
        reply_to: payload.email,
      },
    }),
  });
  return res.ok;
}

export async function submitContact(
  formData: FormData,
): Promise<ContactResult> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    subject: String(formData.get("subject") ?? "") || undefined,
    projectType: String(formData.get("projectType") ?? "") || undefined,
    timeline: String(formData.get("timeline") ?? "") || undefined,
    budget: String(formData.get("budget") ?? "") || undefined,
    source: String(formData.get("source") ?? "mail") || "mail",
    company: String(formData.get("company") ?? ""),
    formTime: Number(formData.get("formTime") ?? 0),
  };

  // Honeypot
  if (raw.company.trim().length > 0) {
    return { ok: false, error: "spam" };
  }

  // CSRF Protection
  const csrfToken = formData.get("csrf_token") as string | null;
  const isValidCsrf = await validateCsrfToken(csrfToken ?? "");
  if (!isValidCsrf) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: {
        csrf: "Invalid CSRF token. Please refresh the page and try again.",
      },
    };
  }

  // Validation
  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0];
      if (typeof k === "string") fieldErrors[k] = issue.message;
    }
    return { ok: false, error: "validation", fieldErrors };
  }

  // Rate limit (1 / 30s, 5 / hour, per IP). IP is derived from trusted
  // server-side request headers only — never from client-supplied data.
  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for");
  const realIp = hdrs.get("x-real-ip");
  const clientIp =
    (forwarded?.split(",")[0] ?? realIp ?? "").trim() || "unknown";

  const fast = await rateLimitAsync(`contact:fast:${clientIp}`, {
    capacity: 1,
    refillPerSecond: 1 / 30,
  });
  if (!fast.ok)
    return {
      ok: false,
      error: "rate_limited",
      retryAfterMs: fast.retryAfterMs,
    };
  const slow = await rateLimitAsync(`contact:slow:${clientIp}`, {
    capacity: 5,
    refillPerSecond: 5 / 3600,
  });
  if (!slow.ok)
    return {
      ok: false,
      error: "rate_limited",
      retryAfterMs: slow.retryAfterMs,
    };

  // Delivery
  try {
    const ok =
      (await sendViaSMTP(parsed.data)) || (await sendViaEmailJS(parsed.data));
    if (!ok) {
      return {
        ok: false,
        error: "delivery",
        message:
          "Email service is not configured. Email me directly at eliosmernica@gmail.com.",
      };
    }
    return { ok: true, id: crypto.randomUUID() };
  } catch (e) {
    return {
      ok: false,
      error: "delivery",
      message:
        "Delivery failed. Please try again or email me directly at eliosmernica@gmail.com.",
    };
  }
}

/**
 * Get CSRF token for form submission.
 * Client components should call this on mount to get a fresh token.
 */
export async function getCsrfTokenAction(): Promise<string> {
  return getCsrfToken();
}
