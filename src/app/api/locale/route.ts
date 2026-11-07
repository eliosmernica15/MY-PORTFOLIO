/**
 * Locale Switching API Route
 *
 * Handles locale switching by setting the locale cookie
 * and returning the new locale.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidLocale } from '@/i18n/config';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locale } = body;

    if (!locale || typeof locale !== 'string') {
      return NextResponse.json(
        { error: 'Locale is required' },
        { status: 400 }
      );
    }

    // Validate locale
    if (!['en', 'sq'].includes(locale)) {
      return NextResponse.json(
        { error: 'Invalid locale' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ locale });

    // Set locale cookie
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Locale switch error:', error);
    return NextResponse.json(
      { error: 'Failed to switch locale' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Get current locale from cookie or default
  const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en';
  return NextResponse.json({ locale });
}