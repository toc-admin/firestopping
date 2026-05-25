import { notFound } from "next/navigation";
import { locales, type Locale, localeNames } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  const dict = await getDictionary(locale as Locale);
  const ogLocale = locale === 'de' ? 'de_DE' : 'en_US';

  return {
    title: {
      default: dict.metadata.home.title,
      template: `%s | ${dict.common.companyName}`,
    },
    description: dict.metadata.home.description,
    openGraph: {
      type: "website",
      locale: ogLocale,
      siteName: dict.common.companyName,
      title: dict.metadata.home.title,
      description: dict.metadata.home.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.common.companyName,
      description: dict.common.tagline,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'de': '/de',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <StructuredData locale={locale as Locale} />
        <Header locale={locale as Locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} dict={dict} />
      </body>
    </html>
  );
}
