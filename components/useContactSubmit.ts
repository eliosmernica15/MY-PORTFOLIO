"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { submitContact, getCsrfTokenAction } from "../app/actions/contact";

export type SubmitStatus = "idle" | "loading" | "success" | "error";

export interface ContactFields {
  name: string;
  email: string;
  message: string;
  subject?: string;
  projectType?: string;
  timeline?: string;
  budget?: string;
  source: "mail" | "hire-me";
}

/**
 * Shared submission plumbing for the contact form.
 * Fetches a CSRF token on mount, enforces the behavioral min-2000ms
 * rule, and maps server results onto local state — including the
 * formTime/csrf rejections, mapped to localized, visible messages.
 */
export function useContactSubmit() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const csrfTokenRef = useRef<string>("");
  const focusedAtRef = useRef<number | null>(null);

  useEffect(() => {
    getCsrfTokenAction()
      .then((token) => {
        csrfTokenRef.current = token;
      })
      .catch(() => {
        csrfTokenRef.current = "";
      });
  }, []);

  const markFocused = useCallback(() => {
    if (focusedAtRef.current == null) focusedAtRef.current = Date.now();
  }, []);

  const submit = useCallback(async (fields: ContactFields) => {
    if (focusedAtRef.current == null) focusedAtRef.current = Date.now();
    if (Date.now() - focusedAtRef.current < 2100) {
      setServerError("slow");
      setStatus("error");
      return false;
    }
    setStatus("loading");
    setServerError(null);
    setFieldErrors({});

    const fd = new FormData();
    fd.set("name", fields.name);
    fd.set("email", fields.email);
    fd.set("message", fields.message);
    if (fields.subject) fd.set("subject", fields.subject);
    if (fields.projectType) fd.set("projectType", fields.projectType);
    if (fields.timeline) fd.set("timeline", fields.timeline);
    if (fields.budget) fd.set("budget", fields.budget);
    fd.set("source", fields.source);
    fd.set("company", ""); // honeypot
    fd.set("csrf_token", csrfTokenRef.current);
    fd.set("formTime", String(Date.now() - focusedAtRef.current));

    try {
      const result = await submitContact(fd);
      if (result.ok) {
        setStatus("success");
        setReferenceId(result.id);
        focusedAtRef.current = null;
        return true;
      }
      if (result.error === "validation") {
        if (result.fieldErrors?.formTime) {
          setServerError("slow");
          setStatus("error");
          return false;
        }
        if (result.fieldErrors?.csrf) {
          setServerError("csrf");
          setStatus("error");
          return false;
        }
        setFieldErrors(result.fieldErrors);
        setStatus("idle");
        return false;
      }
      if (result.error === "rate_limited") {
        setServerError(`rate:${result.retryAfterMs}`);
        setStatus("error");
        return false;
      }
      setServerError(result.error === "delivery" ? result.message : null);
      setStatus("error");
      return false;
    } catch (err) {
      console.error("[contact] submit failed", err);
      setServerError(null);
      setStatus("error");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setFieldErrors({});
    setServerError(null);
    setReferenceId(null);
    focusedAtRef.current = null;
  }, []);

  return {
    status,
    fieldErrors,
    serverError,
    referenceId,
    markFocused,
    submit,
    reset,
  };
}
