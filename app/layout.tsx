import { NextResponse } from 'next/server';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'Elios Mernica — Software Engineer',
  description: 'Software engineer specializing in web development, system design, and network infrastructure. Based in Kosovo, available worldwide.',
};

export default function RootLayout() {
  // Redirect to default locale
  redirect(`/${defaultLocale}`);
}