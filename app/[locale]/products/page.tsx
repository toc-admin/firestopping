import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoMeta } from "@/components/site/tokens";
import { getAllProductCategories } from "@/lib/content";

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    catalog: "Catalog",
    categoriesNote: (n: number) => `${n} product categories`,
    whyNote: "Promat · Rudolf Hensel",
    helpTitle: "Need help choosing the right product?",
  },
  de: {
    catalog: "Katalog",
    categoriesNote: (n: number) => `${n} Produktkategorien`,
    whyNote: "Promat · Rudolf Hensel",
    helpTitle: "Benötigen Sie Hilfe bei der Produktauswahl?",
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
    title: dict.metadata.products.title,
    description: dict.metadata.products.description,
    alternates: {
      canonical: `/${locale}/products`,
      languages: {
        'en': '/en/products',
        'de': '/de/products',
      },
    },
  };
}

export default async function ProductsPage({
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
  const categories = await getAllProductCategories(loc);

  // Anthracite "why us" arguments — content preserved from dictionaries.
  const whyItems = [
    {
      title: dict.about.values.quality.title,
      text: dict.certifications.description,
    },
    {
      title: dict.about.values.reliability.title,
      text: dict.about.values.reliability.description,
    },
    {
      title: dict.about.values.expertise.title,
      text: dict.about.values.expertise.description,
    },
  ];

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.products.title}
        subtitle={dict.products.subtitle}
        description={dict.products.description}
      />

      {/* ── 1.0 Catalog of categories ──────────────────── */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="1.0"
            title={t.catalog}
            note={t.categoriesNote(categories.length)}
          />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
          {categories.map((category, i) => (
            <Reveal key={category.slug} delay={(i % 3) * 0.08} className="bg-paper h-full">
              <Link
                href={`/${loc}/products/${category.slug}`}
                className="group flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="font-mono text-[12px] text-red">
                    P.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-2 text-lg font-bold tracking-tight group-hover:text-red transition-colors">
                    {category.title}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                  <span className={`mt-auto pt-4 ${monoMeta}`}>
                    {dict.products.viewAllProducts} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 2.0 Why our products — anthracite band ─────── */}
      <section className="bg-anthracite text-paper">
        <div className={`${container} py-20 md:py-28`}>
          <Reveal>
            <SectionHead
              dark
              index="2.0"
              title={dict.certifications.title}
              note={t.whyNote}
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-hairline-dark">
            {whyItems.map((item, i) => (
              <div
                key={item.title}
                className="pt-8 pb-6 md:pr-8 md:border-r md:border-hairline-dark last:border-r-0"
              >
                <Reveal delay={i * 0.08}>
                  <span className="font-mono text-[12px] text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                    {item.text}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>

          {/* closing call — inside the same band, no extra strip */}
          <Reveal>
            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-hairline-dark pt-8">
              <p className="text-lg font-bold tracking-tight">{t.helpTitle}</p>
              <div className="flex flex-wrap gap-3">
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
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
