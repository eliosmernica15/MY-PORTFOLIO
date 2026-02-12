import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, CheckCircle2, Send, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO } from '../constants';
import RevealSection from './RevealSection';
import FloatingOrbs from './FloatingOrbs';
import MagneticButton from './MagneticButton';

/*
  EmailJS Setup:
  1. Create a free account at https://www.emailjs.com/
  2. Add an Email Service (e.g. Gmail) — copy the Service ID
  3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{message}}
     — copy the Template ID
  4. Go to Account > General > copy your Public Key
  5. Create a .env file in the project root with:
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
  6. Restart the dev server — done!
*/

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const ContactForm: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
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
        await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, PUBLIC_KEY);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } catch {
        setStatus('error');
      }
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      // Demo mode — no credentials configured
      console.warn(
        'EmailJS credentials not configured. Running in demo mode. See .env.example for setup instructions.'
      );
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      }, 1500);
    }
  };

  const inputClass = (hasErr: boolean) =>
    `w-full rounded-2xl px-5 py-4 transition-all duration-300 focus:outline-none focus:border-[rgba(139,92,246,0.5)] focus:ring-1 focus:ring-[rgba(139,92,246,0.3)] focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] placeholder:opacity-40 ${
      hasErr ? 'border-red-500/50' : ''
    }`;

  return (
    <div
      className="p-8 md:p-12 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[rgba(139,92,246,0.1)] rounded-full blur-[80px] pointer-events-none" />
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={32} className="text-[var(--accent)]" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Sent!
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Thanks for reaching out. I'll be in touch soon.
          </p>
        </motion.div>
      ) : status === 'error' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <AlertCircle size={32} className="text-red-400" />
          </motion.div>
          <h3 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Oops!
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Something went wrong. Please try again or email me directly.
          </p>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Full Name
            </label>
            <input
              type="text"
              name="from_name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={inputClass(!!errors.name)}
              style={{
                backgroundColor: 'var(--input-bg)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: errors.name ? 'rgba(239,68,68,0.5)' : 'var(--border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Your Name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <motion.p
                id="name-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs"
                role="alert"
              >
                {errors.name}
              </motion.p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Email Address
            </label>
            <input
              type="email"
              name="from_email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={inputClass(!!errors.email)}
              style={{
                backgroundColor: 'var(--input-bg)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: errors.email ? 'rgba(239,68,68,0.5)' : 'var(--border)',
                color: 'var(--text-primary)',
              }}
              placeholder="your@email.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <motion.p
                id="email-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs"
                role="alert"
              >
                {errors.email}
              </motion.p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Message
            </label>
            <textarea
              rows={4}
              name="message"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className={`${inputClass(!!errors.message)} resize-none`}
              style={{
                backgroundColor: 'var(--input-bg)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: errors.message ? 'rgba(239,68,68,0.5)' : 'var(--border)',
                color: 'var(--text-primary)',
              }}
              placeholder="How can I help?"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <motion.p
                id="message-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs"
                role="alert"
              >
                {errors.message}
              </motion.p>
            )}
          </div>
          <MagneticButton strength={0.1}>
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={16} /> {status === 'loading' ? 'Sending...' : 'Send Message'}
            </motion.button>
          </MagneticButton>
        </form>
      )}
    </div>
  );
};

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 px-6 scroll-mt-24 relative overflow-hidden snap-section">
      <FloatingOrbs />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <RevealSection>
          <span
            className="font-bold text-[10px] uppercase tracking-[0.5em] mb-4 block"
            style={{ color: 'var(--accent-light)' }}
          >
            Get in Touch
          </span>
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-gradient leading-none">
            Craft the
            <br />
            Future.
          </h2>
          <p
            className="text-lg md:text-xl mb-12 max-w-md font-light leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Architecting the next generation of digital excellence. Let's build
            something remarkable together.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--accent-light)]"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Mail size={14} /> {CONTACT_INFO.email}
            </a>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--accent-light)]"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Phone size={14} /> {CONTACT_INFO.phone}
            </a>
          </div>
        </RevealSection>
        <RevealSection delay={0.2}>
          <ContactForm />
        </RevealSection>
      </div>
    </section>
  );
};

export default Contact;
