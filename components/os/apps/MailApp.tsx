"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Inbox,
  CircleUserRound,
  Mail as MailIcon,
} from "lucide-react";
import { SITE } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import { useContactSubmit } from "../useContactSubmit";

/**
 * Mail — a real email composition surface for contacting Elios.
 * Wired to the same server action + CSRF + rate limiting as the
 * contact section; delivers to SITE.email with optional subject.
 */
const MailApp: React.FC = () => {
  const t = useT();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const {
    status,
    fieldErrors,
    serverError,
    referenceId,
    markFocused,
    submit,
    reset,
  } = useContactSubmit();

  const messageChars = form.message.trim().length;
  const loading = status === "loading";

  const sendAnother = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setHoneypot("");
    reset();
  };

  if (status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--glass-accent-bg)" }}
        >
          <CheckCircle2
            size={28}
            strokeWidth={1.75}
            style={{ color: "var(--accent)" }}
            aria-hidden
          />
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)]">
          {t("contact.form.successTitle")}
        </h3>
        <p className="mt-2 max-w-xs text-xs sm:text-sm text-[var(--text-secondary)]">
          {t("mail.successBody")}
        </p>
        {referenceId && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
            {t("mail.reference")}{" "}
            <span className="text-[var(--text-secondary)]">
              #{referenceId.slice(0, 8)}
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={sendAnother}
          className="interactive-btn mt-6 rounded-full border border-[var(--border-hover)] px-5 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] hover:bg-[var(--pill-bg)]"
        >
          {t("contact.form.sendAnother")}
        </button>
      </div>
    );
  }

  const rateLimited = serverError?.startsWith("rate:");
  const errorText = rateLimited
    ? t("mail.rateLimited")
    : serverError === "slow"
      ? t("contact.form.validation.tooFast")
      : serverError === "csrf"
        ? t("contact.form.validation.csrfError")
        : serverError && !serverError.startsWith("rate:")
          ? serverError
          : t("contact.form.error");

  return (
    <form
      className="flex h-full flex-col px-5 py-4 sm:px-6 sm:py-5"
      onFocus={markFocused}
      onSubmit={(e) => {
        e.preventDefault();
        if (honeypot) return; // silent drop
        void submit({ ...form, source: "mail" });
      }}
    >
      {/* Header strip */}
      <div
        className="mb-3 flex items-center justify-between gap-2 border-b pb-3"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          <Inbox size={12} aria-hidden /> {t("mail.compose")}
        </p>
        <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {t("mail.via")}{" "}
          <span className="text-[var(--text-secondary)]">
            eliosmernica.vercel.app
          </span>
        </p>
      </div>

      {/* To */}
      <div className="mb-2 flex items-center gap-2">
        <label
          htmlFor="mail-to"
          className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]"
        >
          {t("mail.to")}
        </label>
        <div
          className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border px-2.5"
          style={{ borderColor: "var(--border)", background: "var(--pill-bg)" }}
        >
          <MailIcon
            size={12}
            aria-hidden
            className="shrink-0 text-[var(--text-muted)]"
          />
          <output
            id="mail-to"
            className="truncate font-mono text-[11px] text-[var(--text-secondary)]"
          >
            {SITE.email}
          </output>
        </div>
      </div>

      {/* From */}
      <div className="mb-2 flex items-center gap-2">
        <label
          htmlFor="mail-from-name"
          className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]"
        >
          {t("mail.from")}
        </label>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="relative">
            <CircleUserRound
              size={12}
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              id="mail-from-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={3}
              maxLength={80}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={t("contact.form.namePlaceholder")}
              aria-invalid={fieldErrors.name ? "true" : undefined}
              className="os-field !h-8 !rounded-lg !pl-7 font-mono !text-[11px]"
            />
          </div>
          <input
            id="mail-from-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder={t("contact.form.emailPlaceholder")}
            aria-label={t("contact.form.email")}
            aria-invalid={fieldErrors.email ? "true" : undefined}
            className="os-field !h-8 !rounded-lg font-mono !text-[11px]"
          />
        </div>
      </div>

      {/* Subject */}
      <div className="mb-2 flex items-center gap-2">
        <label
          htmlFor="mail-subject"
          className="w-14 shrink-0 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]"
        >
          {t("mail.subject")}
        </label>
        <input
          id="mail-subject"
          name="subject"
          type="text"
          maxLength={150}
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          placeholder={t("mail.subjectPlaceholder")}
          className="os-field h-8 min-w-0 flex-1 rounded-lg font-mono !text-[11px]"
        />
      </div>

      {fieldErrors.name && (
        <p className="mb-1 flex items-center gap-1.5 text-[10px] text-[var(--text-primary)]">
          <AlertCircle size={11} aria-hidden /> {fieldErrors.name}
        </p>
      )}
      {fieldErrors.email && (
        <p className="mb-1 flex items-center gap-1.5 text-[10px] text-[var(--text-primary)]">
          <AlertCircle size={11} aria-hidden /> {fieldErrors.email}
        </p>
      )}

      {/* Message */}
      <div className="flex min-h-0 flex-1 flex-col">
        <label htmlFor="mail-message" className="sr-only">
          {t("contact.form.message")}
        </label>
        <textarea
          id="mail-message"
          name="message"
          required
          minLength={20}
          maxLength={4000}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder={t("contact.form.messagePlaceholder")}
          aria-invalid={fieldErrors.message ? "true" : undefined}
          className="os-field h-full min-h-[7rem] resize-none flex-1 leading-relaxed"
        />
        {fieldErrors.message && (
          <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--text-primary)]">
            <AlertCircle size={11} aria-hidden /> {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden, skipped by AT */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="mail-company">{t("contact.form.company")}</label>
        <input
          id="mail-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Footer */}
      <div
        className="mt-3 flex items-center justify-between gap-3 border-t pt-3"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
          {messageChars}/4000
        </p>
        <div className="flex items-center gap-2">
          {status === "error" && (
            <p
              role="alert"
              className="max-w-[45%] truncate text-[9px] sm:text-[10px] text-[var(--text-secondary)]"
              title={errorText}
            >
              {errorText}{" "}
              <a
                className="underline underline-offset-2"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="interactive-btn inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-contrast)] transition-opacity disabled:opacity-50"
          >
            {loading ? t("contact.form.sending") : t("contact.form.send")}
            <Send size={12} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
};

export default MailApp;
