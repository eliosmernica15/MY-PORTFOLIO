"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send, Briefcase } from "lucide-react";
import { SITE } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import { useContactSubmit } from "../useContactSubmit";

/**
 * Hire Me — optional 60-second project intake.
 * Three questions (build type required while visible, timeline/budget
 * optional). The "Skip the details" fast path hides the qualifier and
 * sends just message + contact info. Everything is validated server-side;
 * this is a real inquiry pipeline, not a booking widget.
 */

const PROJECT_TYPES = [
  "website",
  "webapp",
  "saas",
  "ecommerce",
  "ai",
  "custom",
  "other",
] as const;
const TIMELINES = ["asap", "2-4w", "1-3m", "flexible"] as const;
const BUDGETS = [
  "<1k",
  "1k-3k",
  "3k-5k",
  "5k-10k",
  "10k+",
  "prefer_not_to_say",
] as const;

const HireMeApp: React.FC = () => {
  const t = useT();
  const [showDetails, setShowDetails] = useState(true);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [qualifierError, setQualifierError] = useState(false);

  const {
    status,
    fieldErrors,
    serverError,
    referenceId,
    markFocused,
    submit,
    reset,
  } = useContactSubmit();

  const loading = status === "loading";

  const sendAnother = () => {
    setForm({ name: "", email: "", message: "" });
    setProjectType(null);
    setTimeline(null);
    setBudget(null);
    setHoneypot("");
    setQualifierError(false);
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
          {t("hire.successBody")}
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

  const fieldError = (key: string) =>
    fieldErrors[key] && (
      <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--text-primary)]">
        <AlertCircle size={11} aria-hidden /> {fieldErrors[key]}
      </p>
    );

  const chipGroup = (
    options: readonly string[],
    selected: string | null,
    onPick: (v: string) => void,
    labelPrefix: string,
  ) => (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const pressed = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={pressed}
            onClick={() => onPick(pressed ? "" : opt)}
            className="os-choice !w-auto !rounded-full !px-3 !py-1.5 !text-[11px]"
          >
            {t(`${labelPrefix}.${opt}`)}
          </button>
        );
      })}
    </div>
  );

  return (
    <form
      className="flex h-full flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5"
      onFocus={markFocused}
      onSubmit={(e) => {
        e.preventDefault();
        if (honeypot) return;
        if (showDetails && !projectType) {
          setQualifierError(true);
          return;
        }
        setQualifierError(false);
        void submit({
          ...form,
          projectType: showDetails && projectType ? projectType : undefined,
          timeline: showDetails && timeline ? timeline : undefined,
          budget: showDetails && budget ? budget : undefined,
          subject:
            showDetails && projectType ? `Project: ${projectType}` : undefined,
          source: "hire-me",
        });
      }}
    >
      {/* Header */}
      <div
        className="mb-4 flex items-start justify-between gap-3 border-b pb-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <p className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">
            <Briefcase size={12} aria-hidden /> {t("hire.eyebrow")}
          </p>
          <h2 className="font-display mt-1.5 text-xl sm:text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)]">
            {t("hire.title")}
          </h2>
          <p className="mt-1 max-w-xs text-[10px] sm:text-[11px] leading-snug text-[var(--text-secondary)]">
            {t("hire.subhead")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="interactive-btn shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
        >
          {showDetails ? t("hire.skipLink") : t("hire.addBack")}
        </button>
      </div>

      {showDetails && (
        <fieldset className="mb-4">
          <legend className="sr-only">{t("hire.qualifierLegend")}</legend>

          {/* Q1 — project type (required while visible) */}
          <div className="mb-3">
            <span className="os-label" id="hire-q1">
              {t("hire.q1")}{" "}
              <span aria-hidden className="text-[var(--text-muted)]">
                *
              </span>
            </span>
            <div
              role="group"
              aria-labelledby="hire-q1"
              aria-describedby={qualifierError ? "hire-q1-error" : undefined}
            >
              {chipGroup(
                PROJECT_TYPES,
                projectType,
                (v) => {
                  setProjectType(v || null);
                  setQualifierError(false);
                },
                "hire.projects",
              )}
            </div>
            {qualifierError && (
              <p
                id="hire-q1-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[var(--text-primary)]"
              >
                <AlertCircle size={11} aria-hidden /> {t("hire.q1Required")}
              </p>
            )}
          </div>

          {/* Q2 — timeline (optional) */}
          <div className="mb-3">
            <span className="os-label" id="hire-q2">
              {t("hire.q2")}{" "}
              <span className="normal-case text-[var(--text-muted)]">
                ({t("hire.optional")})
              </span>
            </span>
            <div role="group" aria-labelledby="hire-q2">
              {chipGroup(
                TIMELINES,
                timeline,
                (v) => setTimeline(v || null),
                "hire.timelines",
              )}
            </div>
          </div>

          {/* Q3 — budget (optional) */}
          <div>
            <span className="os-label" id="hire-q3">
              {t("hire.q3")}{" "}
              <span className="normal-case text-[var(--text-muted)]">
                ({t("hire.optional")})
              </span>
            </span>
            <div role="group" aria-labelledby="hire-q3">
              {chipGroup(
                BUDGETS,
                budget,
                (v) => setBudget(v || null),
                "hire.budgets",
              )}
            </div>
          </div>
        </fieldset>
      )}

      {/* Message + identity */}
      <label htmlFor="hire-message" className="os-label !mb-1.5">
        {t("hire.messageLabel")} <span aria-hidden>*</span>
      </label>
      <textarea
        id="hire-message"
        name="message"
        required
        minLength={20}
        maxLength={4000}
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        placeholder={t("contact.form.messagePlaceholder")}
        className="os-field min-h-[4.5rem] resize-y leading-relaxed"
      />
      {fieldError("message")}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label htmlFor="hire-name" className="sr-only">
            {t("contact.form.name")}
          </label>
          <input
            id="hire-name"
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
            className="os-field font-mono !text-[11px]"
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="hire-email" className="sr-only">
            {t("contact.form.email")}
          </label>
          <input
            id="hire-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={120}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder={t("contact.form.emailPlaceholder")}
            aria-invalid={fieldErrors.email ? "true" : undefined}
            className="os-field font-mono !text-[11px]"
          />
          {fieldError("email")}
        </div>
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="hire-company">{t("contact.form.company")}</label>
        <input
          id="hire-company"
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
        <p className="max-w-[52%] text-[8px] sm:text-[9px] leading-snug text-[var(--text-muted)]">
          {t("hire.privacyNote")}
        </p>
        <button
          type="submit"
          disabled={loading}
          className="interactive-btn inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-contrast)] disabled:opacity-50"
        >
          {loading ? t("contact.form.sending") : t("hire.sendButton")}
          <Send size={12} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
      {status === "error" && (
        <p
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)]"
        >
          <AlertCircle size={11} aria-hidden /> {errorText}{" "}
          <a
            className="underline underline-offset-2"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
        </p>
      )}
    </form>
  );
};

export default HireMeApp;
