import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'edge';

interface CSPReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'blocked-uri': string;
    'line-number': number;
    'column-number': number;
    'source-file': string;
    'status-code': number;
    'script-sample': string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? '';
    let report: CSPReport;

    if (contentType.includes('application/json')) {
      report = await req.json();
    } else if (contentType.includes('application/csp-report')) {
      const text = await req.text();
      report = JSON.parse(text);
    } else {
      return new NextResponse('Unsupported Media Type', { status: 415 });
    }

    const violation = report['csp-report'];

    // In production, send to external monitoring (Sentry, Datadog, etc.)
    // For now, log to console with structured data
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'csp-violation',
      documentUri: violation['document-uri'],
      referrer: violation['referrer'],
      violatedDirective: violation['violated-directive'],
      effectiveDirective: violation['effective-directive'],
      blockedUri: violation['blocked-uri'],
      lineNumber: violation['line-number'],
      columnNumber: violation['column-number'],
      sourceFile: violation['source-file'],
      statusCode: violation['status-code'],
      scriptSample: violation['script-sample']?.substring(0, 200),
      userAgent: req.headers.get('user-agent'),
      ip: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown',
    };

    console.warn('[CSP Violation]', JSON.stringify(logEntry));

    // Return 204 No Content - browser expects this
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CSP Report Error]', error);
    return new NextResponse('Bad Request', { status: 400 });
  }
}

// Also handle GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'CSP Report endpoint ready',
    expectedContentTypes: ['application/json', 'application/csp-report'],
    exampleReport: {
      'csp-report': {
        'document-uri': 'https://example.com/',
        'referrer': '',
        'violated-directive': 'script-src',
        'effective-directive': 'script-src',
        'original-policy': "script-src 'self'; report-uri /api/csp-report",
        'blocked-uri': 'https://evil.com/script.js',
        'line-number': 0,
        'column-number': 0,
        'source-file': '',
        'status-code': 200,
        'script-sample': '',
      },
    },
  });
}