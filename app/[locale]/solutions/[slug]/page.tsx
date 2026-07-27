import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import Reveal from "@/components/site/Reveal";
import { container, monoLabel } from "@/components/site/tokens";
import { getSolutionBySlug, getSolutionSlugs, getAllSolutions } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    sheet: "Technical sheet",
    related: "Related systems",
    docTitle: "Documentation",
    ctaTitle: "Let's check if this system fits your project.",
  },
  de: {
    sheet: "Technisches Datenblatt",
    related: "Verwandte Systeme",
    docTitle: "Dokumentation",
    ctaTitle: "Prüfen wir, ob dieses System zu Ihrem Projekt passt.",
  },
} as const;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getSolutionSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) return {};

  const solution = await getSolutionBySlug(locale as Locale, slug);
  const dict = await getDictionary(locale as Locale);

  if (!solution) {
    return { title: dict.common.notFound };
  }

  return {
    title: solution.title,
    description: solution.description,
    alternates: {
      canonical: `/${locale}/solutions/${slug}`,
      languages: {
        'en': `/en/solutions/${slug}`,
        'de': `/de/solutions/${slug}`,
      },
    },
  };
}

// Solution detail as a technical sheet — K1 direction.
export default async function SolutionPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];
  const solution = await getSolutionBySlug(loc, slug);

  if (!solution) {
    notFound();
  }

  const allSolutions = await getAllSolutions(loc);
  const relatedSolutions = allSolutions
    .filter((s) => s.slug !== slug && s.category === solution.category)
    .slice(0, 3);
  const index = allSolutions.findIndex((s) => s.slug === slug) + 1;
  const code = `SOL.${String(index).padStart(2, "0")}`;

  const specs = [
    [dict.solutions.fireResistance, solution.specifications.fireResistance],
    [dict.solutions.standard, solution.specifications.standard],
    [dict.solutions.application, solution.specifications.application],
  ] as const;

  return (
    <div className="bg-paper text-ink">
      {/* ── Anthracite sheet header ────────────────────── */}
      <section className="bg-anthracite text-paper border-b border-hairline-dark">
        <div className={`${container} py-12 md:py-16`}>
          <Link
            href={`/${loc}/solutions`}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors"
          >
            ← {dict.solutions.viewAllSolutions}
          </Link>
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
            <div className="max-w-2xl">
              <span className={monoLabel}>
                {dict.solutions.title} · {code}
              </span>
              <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02]">
                {solution.title}
              </h1>
              <p className="mt-5 text-lg text-neutral-300 leading-relaxed">
                {solution.description}
              </p>
            </div>
            <span className="px-2.5 py-1.5 font-mono text-[12px] text-white bg-ink">
              {solution.specifications.fireResistance}
            </span>
          </div>
        </div>
      </section>

      {/* ── Body: datasheet layout ─────────────────────── */}
      <section className={`${container} py-16 md:py-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Reveal>
              <figure className="border border-hairline bg-white p-2 mb-10">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <figcaption className="px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  {code} / {solution.title}
                </figcaption>
              </figure>
            </Reveal>

            <Reveal>
              <div className="max-w-2xl">
                {solution.fullDescription
                  .split("\n\n")
                  .reduce<{ paragraph: string; start: number }[]>((blocks, paragraph) => {
                    const prev = blocks[blocks.length - 1];
                    const prevCount = prev?.paragraph.startsWith("- ")
                      ? prev.paragraph.split("\n").filter((l) => l.startsWith("- ")).length
                      : 0;
                    blocks.push({ paragraph, start: (prev?.start ?? 0) + prevCount });
                    return blocks;
                  }, [])
                  .map(({ paragraph, start }, i) => {
                    if (paragraph.startsWith("- ")) {
                      const items = paragraph
                        .split("\n")
                        .filter((line) => line.startsWith("- "));
                      return (
                        <ul key={i} className="my-6 border-t border-hairline">
                          {items.map((item, j) => (
                            <li
                              key={item}
                              className="flex items-baseline gap-5 border-b border-hairline py-3.5"
                            >
                              <span className="font-mono text-[11px] text-red">
                                {String(start + j + 1).padStart(2, "0")}
                              </span>
                              <span className="text-neutral-700 leading-relaxed">
                                {item.substring(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={i} className="mt-5 text-neutral-600 leading-relaxed first:mt-0">
                        {paragraph}
                      </p>
                    );
                  })}
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Specifications — bordered dl table */}
              <Reveal>
                <div className="border border-hairline bg-white">
                  <div className="flex items-baseline justify-between border-b border-hairline px-5 py-3.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-red">
                      {dict.products.specifications}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400">{code}</span>
                  </div>
                  <dl>
                    {specs.map(([label, value]) => (
                      <div key={label} className="border-b border-hairline px-5 py-3.5 last:border-b-0">
                        <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                          {label}
                        </dt>
                        <dd className="mt-1 font-semibold text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              {/* Documentation — anthracite panel */}
              <Reveal delay={0.06}>
                <div className="bg-anthracite text-paper p-5">
                  <span className={monoLabel}>{t.docTitle}</span>
                  <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                    {dict.cta.description}
                  </p>
                  <Link
                    href={`/${loc}/contact`}
                    className="mt-5 block bg-red px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    {dict.common.contactUs}
                  </Link>
                </div>
              </Reveal>

              {/* Related systems */}
              {relatedSolutions.length > 0 && (
                <Reveal delay={0.1}>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red">
                      {t.related}
                    </p>
                    <ul className="mt-3 border-t border-hairline">
                      {relatedSolutions.map((s) => {
                        const rIndex = allSolutions.findIndex((x) => x.slug === s.slug) + 1;
                        return (
                          <li key={s.slug} className="border-b border-hairline">
                            <Link
                              href={`/${loc}/solutions/${s.slug}`}
                              className="group flex items-baseline gap-4 py-3 text-sm text-neutral-600 hover:text-red transition-colors"
                            >
                              <span className="font-mono text-[11px] text-red">
                                SOL.{String(rIndex).padStart(2, "0")}
                              </span>
                              {s.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA — ink ──────────────────────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-16 md:py-20`}>
          <Reveal>
            <span className={monoLabel}>{dict.contactCta.label}</span>
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
