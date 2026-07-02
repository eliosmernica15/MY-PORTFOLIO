import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import RevealSection from './RevealSection';
import SectionHeader from './ui/SectionHeader';
import AdvancedButton from './ui/AdvancedButton';
import PremiumCard from './ui/PremiumCard';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const e: { [key: string]: string } = {};
    if (formData.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        formData.email
      )
    )
      e.email = 'Please enter a valid email';
    if (formData.message.trim().length < 20)
      e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
      try {
        const { default: emailjs } = await import('@emailjs/browser');
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            title: `Message from ${formData.name}`,
            time: new Date().toLocaleString(),
            reply_to: formData.email,
          },
          PUBLIC_KEY
        );
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } catch (err) {
        console.error('EmailJS error:', err);
        setStatus('error');
      }
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      }, 1500);
    }
  };

  return (
    <PremiumCard glow padding={false}>
      <div className="p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-60" style={{ background: 'var(--glass-accent-bg)' }} />
        {status === 'success' ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--glass-accent-bg)' }}>
              <CheckCircle2 size={32} className="text-[var(--accent)]" />
            </div>
            <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Message sent</h3>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              Thanks for reaching out. I'll respond within 24 hours.
            </p>
            <AdvancedButton variant="secondary" size="sm" onClick={() => setStatus('idle')}>
              Send another message
            </AdvancedButton>
          </motion.div>
        ) : status === 'error' ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Something went wrong</h3>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              Please try again or email me directly.
            </p>
            <AdvancedButton variant="secondary" size="sm" onClick={() => setStatus('idle')}>
              Try again
            </AdvancedButton>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
              { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
            ].map(field => (
              <div key={field.key} className="space-y-2">
                <label htmlFor={field.key} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                  className={`input-enterprise ${errors[field.key] ? 'input-error' : ''}`}
                  placeholder={field.placeholder}
                  aria-invalid={!!errors[field.key]}
                />
                {errors[field.key] && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs" role="alert">
                    {errors[field.key]}
                  </motion.p>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Message
                </label>
                <span className="text-[10px] font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {formData.message.length} chars
                </span>
              </div>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className={`input-enterprise resize-none ${errors.message ? 'input-error' : ''}`}
                placeholder="Tell me about your project, timeline, and goals..."
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs" role="alert">
                  {errors.message}
                </motion.p>
              )}
            </div>
            <AdvancedButton
              type="submit"
              variant="primary"
              size="lg"
              loading={status === 'loading'}
              icon={<Send size={16} />}
              className="w-full"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </AdvancedButton>
          </form>
        )}
      </div>
    </PremiumCard>
  );
};

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 relative overflow-hidden content-auto z-[1]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center relative z-10">
        <RevealSection>
          <SectionHeader
            eyebrow="Get in Touch"
            title={
              <>
                Craft the
                <br />
                <span className="text-gradient">Future.</span>
              </>
            }
            subtitle="Architecting the next generation of digital excellence. Share your vision — I'll engineer the path from concept to production."
          />
          <div className="flex flex-wrap gap-3 -mt-4">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="interactive-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--accent-light)] chip-enterprise"
            >
              <Mail size={14} /> {CONTACT_INFO.email}
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="interactive-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--accent-light)] chip-enterprise"
            >
              <Phone size={14} /> {CONTACT_INFO.phone}
            </a>
          </div>
        </RevealSection>
        <RevealSection delay={0.15}>
          <ContactForm />
        </RevealSection>
      </div>
    </section>
  );
};

export default Contact;
