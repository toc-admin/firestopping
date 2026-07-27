import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";
import { getAllSolutions } from "@/lib/content";

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    systemsTitle: "Systems",
    systemsNote: "certified systems",
    noteLabel: "Engineering note",
    note: "Every solution is tested as a system — a seal, coating or door performs only as well as its installation.",
    ctaLabel: "Request a quote",
    ctaTitle: "Not sure which system fits your building?",
  },
  de: {
    systemsTitle: "Systeme",
    systemsNote: "zertifizierte Systeme",
    noteLabel: "Technischer Hinweis",
    note: "Jede Lösung ist als System geprüft — eine Abschottung, Beschichtung oder Tür ist nur so gut wie ihre Montage.",
    ctaLabel: "Angebot anfordern",
    ctaTitle: "Sie sind unsicher, welches System zu Ihrem Gebäude passt?",
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
    title: dict.metadata.solutions.title,
    description: dict.metadata.solutions.description,
    alternates: {
      canonical: `/${locale}/solutions`,
      languages: {
        'en': '/en/solutions',
        'de': '/de/solutions',
      },
    },
  };
}

// Solutions grid in datasheet language (SOL.01–SOL.xx) — K1 direction.
export default async function SolutionsPage({
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
  const solutions = await getAllSolutions(loc);

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.solutions.title}
        subtitle={dict.solutions.subtitle}
        description={dict.solutions.description}
      />

      {/* ── 1.0 Systems: hairline grid ─────────────────── */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="1.0"
            title={t.systemsTitle}
            note={`${solutions.length} ${t.systemsNote}`}
          />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline">
          {solutions.map((solution, i) => (
            <Reveal key={solution.slug} delay={(i % 3) * 0.08} className="bg-paper">
              <Link
                href={`/${loc}/solutions/${solution.slug}`}
                className="group flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                  <span className="absolute top-0 left-0 px-2 py-1 font-mono text-[11px] text-white bg-anthracite/90">
                    SOL.{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-bold tracking-tight group-hover:text-red transition-colors">
                      {solution.title}
                    </h2>
                    <span className="shrink-0 px-2 py-1 font-mono text-[10px] text-white bg-ink">
                      {solution.specifications.fireResistance}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                      {solution.specifications.standard}
                    </span>
                    <span className="font-mono text-[11px] text-red group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── System as a whole — anthracite inset ───────── */}
      <section className="bg-anthracite text-paper border-y border-hairline-dark">
        <div className={`${container} py-14 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline`}>
          <Reveal className="md:col-span-8">
            <span className={monoLabel}>{t.noteLabel}</span>
            <p className="mt-4 text-lg md:text-xl font-semibold leading-relaxed max-w-2xl">
              {t.note}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="md:col-span-4 md:text-right">
            <Link
              href={`/${loc}/services`}
              className="inline-block px-6 py-3 font-semibold border border-paper/40 hover:bg-white/10 transition-colors"
            >
              {dict.navigation.services} →
            </Link>
          </Reveal>
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
                href="tel:+38514878515"
                className="px-7 py-3.5 font-semibold border border-white/30 hover:bg-white/10 transition-colors"
              >
                +385 1 4878 515
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
