"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle2, Send, AlertCircle } from "lucide-react";
import { CONTACT_INFO } from "@/data/contact-info";
import { submitContact, getCsrfTokenAction } from "../app/actions/contact";
import RevealSection from "./RevealSection";
import SectionHeader from "./ui/SectionHeader";
import AdvancedButton from "./ui/AdvancedButton";
import PremiumCard from "./ui/PremiumCard";
import { useT } from "@/i18n/LocaleProvider";

type Status = "idle" | "loading" | "success" | "error";

const ContactForm: React.FC = () => {
  const t = useT();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState<string>("");
  const focusedAtRef = useRef<number | null>(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    getCsrfTokenAction().then(setCsrfToken).catch(console.error);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (formData.name.trim().length < 3)
      e.name = t("contact.form.validation.nameRequired");
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        formData.email,
      )
    )
      e.email = t("contact.form.validation.emailRequired");
    if (formData.message.trim().length < 20)
      e.message = t("contact.form.validation.messageRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFocus = () => {
    if (focusedAtRef.current == null) focusedAtRef.current = Date.now();
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    const fd = new FormData();
    fd.set("name", formData.name);
    fd.set("email", formData.email);
    fd.set("message", formData.message);
    fd.set("company", formData.company);
    fd.set("csrf_token", csrfToken);
    const focusedAt = focusedAtRef.current ?? Date.now();
    fd.set("formTime", String(Date.now() - focusedAt));

    try {
      const result = await submitContact(fd);
      if (result.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "", company: "" });
        focusedAtRef.current = null;
        setTimeout(() => setStatus("idle"), 5000);
      } else if (result.error === "validation") {
        setErrors(result.fieldErrors);
        setStatus("idle");
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <PremiumCard glow padding={false}>
      <div className="p-8 md:p-12 relative overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-60"
          style={{ background: "var(--glass-accent-bg)" }}
        />
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "var(--glass-accent-bg)" }}
            >
              <CheckCircle2 size={32} className="text-[var(--accent)]" />
            </div>
            <h3
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("contact.form.successTitle")}
            </h3>
            <p style={{ color: "var(--text-secondary)" }} className="mb-6">
              {t("contact.form.success")}
            </p>
            <AdvancedButton
              variant="secondary"
              size="sm"
              onClick={() => setStatus("idle")}
            >
              {t("contact.form.sendAnother")}
            </AdvancedButton>
          </motion.div>
        ) : status === "error" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h3
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {t("contact.form.errorTitle")}
            </h3>
            <p style={{ color: "var(--text-secondary)" }} className="mb-6">
              {t("contact.form.error")}
            </p>
            <AdvancedButton
              variant="secondary"
              size="sm"
              onClick={() => setStatus("idle")}
            >
              {t("contact.form.tryAgain")}
            </AdvancedButton>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 relative z-10"
            noValidate
          >
            {/* Honeypot — must stay empty */}
            <div
              aria-hidden="true"
              className="hidden"
              style={{
                position: "absolute",
                left: "-9999px",
                top: "auto",
                width: 1,
                height: 1,
                overflow: "hidden",
              }}
            >
              <label htmlFor="company-hp">{t("contact.form.company")}</label>
              <input
                id="company-hp"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
            {[
              {
                key: "name",
                label: t("contact.form.name"),
                type: "text",
                placeholder: t("contact.form.namePlaceholder"),
                errorId: "name-error",
              },
              {
                key: "email",
                label: t("contact.form.email"),
                type: "email",
                placeholder: t("contact.form.emailPlaceholder"),
                errorId: "email-error",
              },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <label
                  htmlFor={field.key}
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key as "name" | "email"]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  onFocus={handleFocus}
                  className={`input-enterprise ${errors[field.key] ? "input-error" : ""}`}
                  placeholder={field.placeholder}
                  aria-invalid={!!errors[field.key]}
                  aria-describedby={
                    errors[field.key] ? field.errorId : undefined
                  }
                />
                {errors[field.key] && (
                  <motion.p
                    id={field.errorId}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors[field.key]}
                  </motion.p>
                )}
              </div>
            ))}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="message"
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("contact.form.message")}
                </label>
                <span
                  className="text-[10px] font-medium tabular-nums"
                  style={{ color: "var(--text-muted)" }}
                >
                  {formData.message.length} {t("contact.form.chars")}
                </span>
              </div>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                onFocus={handleFocus}
                className={`input-enterprise resize-none ${errors.message ? "input-error" : ""}`}
                placeholder={t("contact.form.messagePlaceholder")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <motion.p
                  id="message-error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.message}
                </motion.p>
              )}
            </div>
            <AdvancedButton
              type="submit"
              variant="primary"
              size="lg"
              loading={status === "loading"}
              icon={<Send size={16} />}
              className="w-full"
            >
              {status === "loading"
                ? t("contact.form.sending")
                : t("contact.form.send")}
            </AdvancedButton>
          </form>
        )}
      </div>
    </PremiumCard>
  );
};

const Contact: React.FC = () => {
  const t = useT();
  return (
    <section
      id="contact"
      className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6 relative overflow-hidden content-auto z-[1]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center relative z-10">
        <RevealSection>
          <SectionHeader
            eyebrow={t("contact.title")}
            title={t("contact.subtitle")}
            subtitle={t("contact.description")}
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
