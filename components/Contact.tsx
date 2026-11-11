"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Mail,
} from "lucide-react";
import { SITE } from "@/data/site";
import { useT } from "@/i18n/LocaleProvider";
import { useContactSubmit } from "./useContactSubmit";
import { Reveal } from "./motion/Reveal";

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

/**
 * Contact — one column of ask, one card of compose.
 * Name, email, message; optional project details one click away.
 */
const Contact: React.FC = () => {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [showDetails, setShowDetails] = useState(false);
  const [projectType, setProjectType] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
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

  const loading = status === "loading";

  const sendAnother = () => {
    setForm({ name: "", email: "", message: "" });
    setProjectType(null);
    setTimeline(null);
    setBudget(null);
    setHoneypot("");
    setShowDetails(false);
    reset();
  };

  const rateLimited = serverError?.startsWith("rate:");
  const errorText = rateLimited
    ? t("contact.rateLimited")
    : serverError === "slow"
      ? t("contact.form.validation.tooFast")
      : serverError === "csrf"
        ? t("contact.form.validation.csrfError")
        : serverError && !serverError.startsWith("rate:")
          ? serverError
          : t("contact.form.error");

  const chip = (pressed: boolean) =>
    `interactive-btn rounded-full border px-3 py-1.5 text-[11px] leading-none transition-colors ${
      pressed
        ? "border-[var(--accent)] text-[var(--accent-contrast)]"
        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
    }`;

  const chipStyle = (pressed: boolean): React.CSSProperties => ({
    background: pressed ? "var(--accent)" : "transparent",
    borderColor: pressed ? "var(--accent)" : undefined,
  });

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t px-5 sm:px-8 py-16 sm:py-24"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12">
        {/* The ask */}
        <div className="lg:col-span-6 flex flex-col">
          <Reveal
            as="p"
            variant="rise"
            className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[var(--accent)]"
          >
            {t("contact.title")}
          </Reveal>
          <h2
            id="contact-heading"
            className="font-display mt-4 text-5xl sm:text-7xl font-semibold leading-[0.98] tracking-[-0.02em] text-[var(--text-primary)]"
          >
            <Reveal as="span" variant="mask" delay={80}>
              {t("contact.subtitle")}
            </Reveal>
          </h2>
          <Reveal
            as="p"
            variant="rise"
            delay={160}
            className="mt-6 max-w-md text-[15px] sm:text-lg leading-snug"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("contact.description")}
          </Reveal>
          <a
            href={`mailto:${SITE.email}`}
            className="interactive-btn group mt-8 inline-flex w-fit items-center gap-2 break-all font-display text-lg sm:text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          >
            <Mail
              size={18}
              strokeWidth={1.75}
              aria-hidden
              style={{ color: "var(--accent)" }}
            />
            <span className="underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors group-hover:text-[var(--accent)]">
              {SITE.email}
            </span>
          </a>
        </div>

        {/* The compose card */}
        <Reveal variant="rise" delay={220} className="lg:col-span-6">
          <div
            className="border p-5 sm:p-7"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-card)",
              boxShadow: "0 24px 70px rgba(28, 26, 23, 0.10)",
            }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2
                  size={40}
                  strokeWidth={1.5}
                  style={{ color: "var(--accent)" }}
                  aria-hidden
                />
                <h3 className="font-display mt-4 text-2xl font-semibold text-[var(--text-primary)]">
                  {t("contact.form.successTitle")}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-[var(--text-secondary)]">
                  {t("contact.form.success")}
                </p>
                {referenceId && (
                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    {t("contact.reference")} #{referenceId.slice(0, 8)}
                  </p>
                )}
                <button
                  type="button"
                  onClick={sendAnother}
                  className="interactive-btn mt-6 border px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-primary)] transition-colors hover:bg-[var(--pill-bg)]"
                  style={{ borderColor: "var(--border-hover)" }}
                >
                  {t("contact.form.sendAnother")}
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onFocus={markFocused}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (honeypot) return;
                  void submit({
                    ...form,
                    projectType:
                      showDetails && projectType ? projectType : undefined,
                    timeline: showDetails && timeline ? timeline : undefined,
                    budget: showDetails && budget ? budget : undefined,
                    subject:
                      showDetails && projectType
                        ? `Project: ${projectType}`
                        : undefined,
                    source:
                      showDetails && (projectType || timeline || budget)
                        ? "hire-me"
                        : "mail",
                  });
                }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="os-label">
                      {t("contact.form.name")}
                    </label>
                    <input
                      id="c-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      minLength={3}
                      maxLength={80}
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder={t("contact.form.namePlaceholder")}
                      aria-invalid={fieldErrors.name ? "true" : undefined}
                      className="os-field"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[var(--text-primary)]">
                        <AlertCircle size={10} aria-hidden /> {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="os-label">
                      {t("contact.form.email")}
                    </label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={120}
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder={t("contact.form.emailPlaceholder")}
                      aria-invalid={fieldErrors.email ? "true" : undefined}
                      className="os-field"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[var(--text-primary)]">
                        <AlertCircle size={10} aria-hidden />{" "}
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="c-message" className="os-label">
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    minLength={20}
                    maxLength={4000}
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder={t("contact.form.messagePlaceholder")}
                    aria-invalid={fieldErrors.message ? "true" : undefined}
                    className="os-field resize-y leading-relaxed"
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-[var(--text-primary)]">
                      <AlertCircle size={10} aria-hidden />{" "}
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Optional project details — closed by default */}
                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  aria-expanded={showDetails}
                  className="interactive-btn flex items-center gap-1.5 self-start font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {t("contact.detailsToggle")}
                  <ChevronDown
                    size={12}
                    aria-hidden
                    className={`transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
                  />
                </button>
                {showDetails && (
                  <fieldset
                    className="flex flex-col gap-3 border-t pt-4"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <legend className="sr-only">
                      {t("hire.qualifierLegend")}
                    </legend>
                    <div>
                      <span className="os-label" id="q-type">
                        {t("hire.q1")}
                      </span>
                      <div
                        role="group"
                        aria-labelledby="q-type"
                        className="flex flex-wrap gap-1.5"
                      >
                        {PROJECT_TYPES.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={projectType === opt}
                            onClick={() =>
                              setProjectType((v) => (v === opt ? null : opt))
                            }
                            className={chip(projectType === opt)}
                            style={chipStyle(projectType === opt)}
                          >
                            {t(`hire.projects.${opt}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="os-label" id="q-time">
                        {t("hire.q2")}
                      </span>
                      <div
                        role="group"
                        aria-labelledby="q-time"
                        className="flex flex-wrap gap-1.5"
                      >
                        {TIMELINES.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={timeline === opt}
                            onClick={() =>
                              setTimeline((v) => (v === opt ? null : opt))
                            }
                            className={chip(timeline === opt)}
                            style={chipStyle(timeline === opt)}
                          >
                            {t(`hire.timelines.${opt}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="os-label" id="q-budget">
                        {t("hire.q3")}
                      </span>
                      <div
                        role="group"
                        aria-labelledby="q-budget"
                        className="flex flex-wrap gap-1.5"
                      >
                        {BUDGETS.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={budget === opt}
                            onClick={() =>
                              setBudget((v) => (v === opt ? null : opt))
                            }
                            className={chip(budget === opt)}
                            style={chipStyle(budget === opt)}
                          >
                            {t(`hire.budgets.${opt}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </fieldset>
                )}

                {/* Honeypot */}
                <div
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="c-company">{t("contact.form.company")}</label>
                  <input
                    id="c-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {status === "error" && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 text-[11px] leading-snug text-[var(--text-secondary)]"
                  >
                    <AlertCircle
                      size={13}
                      aria-hidden
                      className="mt-0.5 shrink-0"
                    />
                    <span>
                      {errorText}{" "}
                      <a
                        className="font-semibold underline underline-offset-2"
                        href={`mailto:${SITE.email}`}
                      >
                        {SITE.email}
                      </a>
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="interactive-btn btn-lift mt-1 inline-flex w-fit items-center gap-2 rounded-full px-7 py-3.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[var(--bg-primary)] transition-opacity disabled:opacity-50"
                  style={{ background: "var(--text-primary)" }}
                >
                  {loading ? t("contact.form.sending") : t("contact.form.send")}
                  <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
