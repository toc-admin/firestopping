import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import ContactCTA from "@/components/sections/ContactCTA";
import Button from "@/components/ui/Button";
import { getServiceBySlug, getServiceSlugs, getAllServices } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getServiceSlugs(locale as Locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) return {};

  const service = await getServiceBySlug(locale as Locale, slug);
  const dict = await getDictionary(locale as Locale);

  if (!service) {
    return { title: dict.common.notFound };
  }

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `/${locale}/services/${slug}`,
      languages: {
        'en': `/en/services/${slug}`,
        'de': `/de/services/${slug}`,
      },
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const service = await getServiceBySlug(locale as Locale, slug);

  if (!service) {
    notFound();
  }

  const allServices = await getAllServices(locale as Locale);
  const otherServices = allServices.filter((s) => s.slug !== slug);

  return (
    <>
      {/* Service Hero with background image */}
      <section className="relative h-[60vh] min-h-[450px] flex items-end">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/50 to-neutral-900/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full pb-12 md:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{dict.services.viewAllServices}</span>
            </Link>

            <span className="inline-block text-brand-400 text-sm font-medium mb-3">
              {dict.services.title}
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {service.title}
            </h1>

            <p className="text-lg text-neutral-300 max-w-2xl">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Service content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                {service.fullDescription.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
                    return (
                      <ul key={index} className="space-y-3 my-6 list-none p-0">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-brand-500 mt-1 flex-shrink-0" />
                            <span className="text-neutral-700">{item.substring(2)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-neutral-600 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Features */}
              <div className="mt-12 p-8 bg-neutral-50 rounded-2xl">
                <h3 className="text-xl font-bold text-neutral-900 mb-6">
                  {dict.services.features}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-neutral-900">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* CTA */}
                <div className="bg-neutral-900 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-2">{dict.cta.title}</h3>
                  <p className="text-neutral-400 text-sm mb-6">
                    {dict.cta.description}
                  </p>
                  <Button href={`/${locale}/contact`} className="w-full">
                    {dict.common.contactUs}
                  </Button>
                </div>

                {/* Other services */}
                <div className="bg-neutral-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-neutral-900 mb-4">
                    {dict.services.title}
                  </h3>
                  <ul className="space-y-3">
                    {otherServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${locale}/services/${s.slug}`}
                          className="text-neutral-600 hover:text-brand-500 transition-colors"
                        >
                          {s.shortTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA locale={locale as Locale} dict={dict} />
    </>
  );
}
