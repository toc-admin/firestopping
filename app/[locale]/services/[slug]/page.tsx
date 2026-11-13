import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/site/Reveal";
import { container, monoLabel, monoMeta } from "@/components/site/tokens";
import { getServiceBySlug, getServiceSlugs, getAllServices } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    sheet: "Sheet",
    items: "items",
    factsLabel: "Service data",
    reference: "Reference",
    service: "Service",
    contractor: "Contractor",
    quoteLabel: "Request a quote",
    otherServices: "Other services",
    nextStep: "Next step",
    ctaTitle: "Let's discuss your project.",
  },
  de: {
    sheet: "Blatt",
    items: "Positionen",
    factsLabel: "Leistungsdaten",
    reference: "Kennung",
    service: "Leistung",
    contractor: "Auftragnehmer",
    quoteLabel: "Angebot anfordern",
    otherServices: "Weitere Leistungen",
    nextStep: "Nächster Schritt",
    ctaTitle: "Sprechen wir über Ihr Projekt.",
  },
} as const;

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

// Service datasheet: anthracite head + content in datasheet layout
// (numbered rows, mono meta, sidebar facts panel).
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];
  const service = await getServiceBySlug(loc, slug);

  if (!service) {
    notFound();
  }

  const allServices = await getAllServices(loc);
  const serviceIndex = allServices.findIndex((s) => s.slug === slug);
  const indexLabel = `S.${String(serviceIndex + 1).padStart(2, "0")}`;
  const otherServices = allServices.filter((s) => s.slug !== slug);

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={service.title}
        subtitle={`${dict.services.title} · ${indexLabel}`}
        description={service.description}
      />

      <section className={`${container} py-16 md:py-24`}>
        {/* back link + meta strip */}
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-4 mb-10">
            <Link
              href={`/${loc}/services`}
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-neutral-600 hover:text-red transition-colors"
            >
              ← {dict.services.viewAllServices}
            </Link>
            <span className={monoMeta}>
              {t.sheet} {indexLabel} / {String(allServices.length).padStart(2, "0")}
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* ── Main content ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <Reveal>
              <figure className="relative aspect-[16/9] overflow-hidden border border-hairline mb-10">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover grayscale-[35%]"
                  priority
                />
              </figure>
            </Reveal>

            <Reveal>
              <div className="max-w-none">
                {service.fullDescription.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("- ")) {
                    const items = paragraph
                      .split("\n")
                      .filter((line) => line.startsWith("- "));
                    return (
                      <ol key={index} className="my-8 border-t border-hairline">
                        {items.map((item, i) => (
                          <li
                            key={i}
                            className="grid grid-cols-12 gap-4 items-baseline border-b border-hairline py-3.5"
                          >
                            <span className="col-span-2 sm:col-span-1 font-mono text-[12px] text-red">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="col-span-10 sm:col-span-11 text-neutral-700 leading-relaxed">
                              {item.substring(2)}
                            </span>
                          </li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={index} className="mt-5 first:mt-0 text-neutral-600 leading-relaxed text-lg">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </Reveal>

            {/* Features — numbered hairline rows */}
            <Reveal>
              <div className="mt-14 border border-hairline">
                <div className="flex items-baseline justify-between gap-4 border-b border-hairline px-5 py-4 bg-white">
                  <h3 className="text-lg font-bold tracking-tight">
                    {dict.services.features}
                  </h3>
                  <span className={monoMeta}>
                    {service.features.length} {t.items}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-hairline">
                  {service.features.map((feature, i) => (
                    <div key={feature} className="bg-paper px-5 py-4 flex items-baseline gap-4">
                      <span className="font-mono text-[12px] text-red shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-px bg-hairline border border-hairline">
              {/* Service facts */}
              <div className="bg-paper p-6">
                <span className={monoLabel}>{t.factsLabel}</span>
                <dl className="mt-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3 items-baseline">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                      {t.reference}
                    </dt>
                    <dd className="col-span-2 font-mono text-[13px]">{indexLabel}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-3 items-baseline">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                      {t.service}
                    </dt>
                    <dd className="col-span-2 text-sm font-semibold">{service.shortTitle}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-3 items-baseline">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
                      {t.contractor}
                    </dt>
                    <dd className="col-span-2 text-sm">{dict.common.companyName}, Zagreb</dd>
                  </div>
                </dl>
              </div>

              {/* CTA — anthracite inset */}
              <div className="bg-anthracite text-paper p-6">
                <span className={monoLabel}>{t.quoteLabel}</span>
                <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
                  {dict.cta.description}
                </p>
                <Link
                  href={`/${loc}/contact`}
                  className="mt-6 inline-block w-full text-center px-6 py-3 bg-red text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {dict.common.contactUs}
                </Link>
              </div>

              {/* Other services */}
              <div className="bg-paper p-6">
                <span className={monoLabel}>{t.otherServices}</span>
                <ul className="mt-5">
                  {otherServices.map((s) => {
                    const i = allServices.findIndex((a) => a.slug === s.slug);
                    return (
                      <li key={s.slug} className="border-b border-hairline last:border-b-0">
                        <Link
                          href={`/${loc}/services/${s.slug}`}
                          className="group flex items-baseline gap-4 py-3"
                        >
                          <span className="font-mono text-[11px] text-red">
                            S.{String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-medium group-hover:text-red transition-colors">
                            {s.shortTitle}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA — ink ──────────────────────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-20 md:py-24`}>
          <Reveal>
            <span className={monoLabel}>{t.nextStep}</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl leading-[1.05]">
              {t.ctaTitle}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${loc}/contact`}
                className="px-7 py-3.5 bg-red text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {dict.common.contactUs}
              </Link>
              <a
                href="tel:+38513496811"
                className="px-7 py-3.5 font-semibold border border-white/30 hover:bg-white/10 transition-colors"
              >
                +385 1 3496 811
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
