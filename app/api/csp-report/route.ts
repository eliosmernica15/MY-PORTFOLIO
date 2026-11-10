import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface CSPReport {
  "csp-report": {
    "document-uri": string;
    referrer: string;
    "violated-directive": string;
    "effective-directive": string;
    "original-policy": string;
    "blocked-uri": string;
    "line-number": number;
    "column-number": number;
    "source-file": string;
    "status-code": number;
    "script-sample": string;
  };
}

// Best-effort per-instance token bucket for the report endpoint.
// Enough to blunt naive floods/log-spam; not a strict limiter
// (edge instances don't share state).
const WINDOW_MS = 60_000;
const MAX_REPORTS_PER_WINDOW = 120;
const buckets = new Map<string, { count: number; reset: number }>();

function allowReport(ip: string): boolean {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || now > entry.reset) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REPORTS_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

const MAX_BODY_BYTES = 4096;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!allowReport(ip)) {
      return new NextResponse(null, { status: 429 });
    }

    const contentLabel = req.headers.get("content-type") ?? "";
    if (contentLabel.length > 100) {
      return new NextResponse("Unsupported Media Type", { status: 415 });
    }
    const contentLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return new NextResponse("Payload Too Large", { status: 413 });
    }

    const contentType = contentLabel;
    let text: string;
    if (contentType.includes("application/json")) {
      text = await req.text();
    } else if (contentType.includes("application/csp-report")) {
      text = await req.text();
    } else {
      return new NextResponse("Unsupported Media Type", { status: 415 });
    }
    if (text.length > MAX_BODY_BYTES) {
      return new NextResponse("Payload Too Large", { status: 413 });
    }

    let report: CSPReport;
    try {
      report = JSON.parse(text);
    } catch {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const violation = report?.["csp-report"];
    if (!violation || typeof violation !== "object") {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      type: "csp-violation",
      documentUri: String(violation["document-uri"] ?? "").slice(0, 300),
      referrer: String(violation["referrer"] ?? "").slice(0, 300),
      violatedDirective: String(violation["violated-directive"] ?? "").slice(
        0,
        120,
      ),
      effectiveDirective: String(violation["effective-directive"] ?? "").slice(
        0,
        120,
      ),
      blockedUri: String(violation["blocked-uri"] ?? "").slice(0, 300),
      sourceFile: String(violation["source-file"] ?? "").slice(0, 300),
      scriptSample: String(violation["script-sample"] ?? "").substring(0, 200),
      userAgent: (req.headers.get("user-agent") ?? "").slice(0, 200),
    };

    console.warn("[CSP Violation]", JSON.stringify(logEntry));

    // 204 No Content - browsers expect this
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CSP Report Error]", error);
    return new NextResponse("Bad Request", { status: 400 });
  }
}

// Debug helper - only available in development.
export async function GET() {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      message: "CSP Report endpoint ready (dev only)",
      expectedContentTypes: ["application/json", "application/csp-report"],
    });
  }
  return new NextResponse(null, { status: 404 });
}
