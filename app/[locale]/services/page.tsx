import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel, monoMeta } from "@/components/site/tokens";
import { getAllServices } from "@/lib/content";

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    indexTitle: "Service index",
    count: "services",
    ctaLabel: "Request a quote",
    ctaTitle: "Need one contractor accountable for the complete system?",
  },
  de: {
    indexTitle: "Leistungsverzeichnis",
    count: "Leistungen",
    ctaLabel: "Angebot anfordern",
    ctaTitle: "Sie suchen einen Partner, der das Gesamtsystem verantwortet?",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.metadata.services.title,
    description: dict.metadata.services.description,
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        'en': '/en/services',
        'de': '/de/services',
      },
    },
  };
}

// Services list as spec-table rows (S.01–S.xx) — K1 direction.
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];
  const services = await getAllServices(loc);

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.services.title}
        subtitle={dict.services.subtitle}
        description={dict.services.description}
      />

      {/* ── 1.0 Service index: spec-table rows ─────────── */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="1.0"
            title={t.indexTitle}
            note={`${services.length} ${t.count}`}
          />
        </Reveal>
        <div className="border-t border-hairline">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.08}>
              <Link
                href={`/${loc}/services/${service.slug}`}
                className="group grid grid-cols-12 gap-x-4 gap-y-3 items-start border-b border-hairline py-8 transition-colors hover:bg-white"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-[12px] text-red pt-1">
                  S.{String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative hidden md:block md:col-span-2 aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 768px) 16vw, 0vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                </div>
                <div className="col-span-10 md:col-span-4">
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight group-hover:text-red transition-colors">
                    {service.title}
                  </h2>
                  <span className={`mt-3 block ${monoMeta}`}>
                    {service.features.join(" · ")}
                  </span>
                </div>
                <p className="col-span-10 col-start-3 md:col-span-4 md:col-start-8 text-sm text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
                <span className="hidden md:block md:col-span-1 text-right text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Contact CTA — ink ──────────────────────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-20 md:py-24`}>
          <Reveal>
            <span className={monoLabel}>{t.ctaLabel}</span>
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
