import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel, monoMeta } from "@/components/site/tokens";
import {
  getProductCategoryBySlug,
  getProductsByCategory,
  getProductWithCategory,
  getAllProductCategories,
  getAllProducts,
} from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string[] }>;
}

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    breadcrumbAria: "Breadcrumb",
    categoriesLabel: "Categories",
    inCategory: (n: number) => `${n} in category`,
    emptyCategory: "— No products in this category.",
    categoryHelpTitle: "Need advice choosing a product?",
    descriptionTitle: "Product description",
    specTag: "SPEC",
    pdfDocument: "PDF document",
    quoteLabel: "Quote",
    quoteTitle: "Request a quote",
    related: "Related products",
    detailHelpLabel: "Contact",
    detailHelpTitle: "Questions about product application?",
  },
  de: {
    breadcrumbAria: "Navigationspfad",
    categoriesLabel: "Kategorien",
    inCategory: (n: number) => `${n} in der Kategorie`,
    emptyCategory: "— Keine Produkte in dieser Kategorie.",
    categoryHelpTitle: "Benötigen Sie Beratung bei der Produktauswahl?",
    descriptionTitle: "Produktbeschreibung",
    specTag: "SPEC",
    pdfDocument: "PDF-Dokument",
    quoteLabel: "Angebot",
    quoteTitle: "Angebot anfordern",
    related: "Ähnliche Produkte",
    detailHelpLabel: "Kontakt",
    detailHelpTitle: "Haben Sie Fragen zur Anwendung des Produkts?",
  },
} as const;

export async function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];

  for (const locale of locales) {
    const categories = await getAllProductCategories(locale);
    const products = await getAllProducts(locale);

    // Category pages
    categories.forEach((category) => {
      params.push({ locale, slug: [category.slug] });
    });

    // Product pages
    products.forEach((product) => {
      params.push({ locale, slug: [product.category, product.slug] });
    });
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) return {};

  const dict = await getDictionary(locale as Locale);

  if (slug.length === 1) {
    const category = await getProductCategoryBySlug(locale as Locale, slug[0]);
    if (!category) {
      return { title: dict.common.notFound };
    }
    return {
      title: category.title,
      description: category.description,
      alternates: {
        canonical: `/${locale}/products/${slug[0]}`,
        languages: {
          'en': `/en/products/${slug[0]}`,
          'de': `/de/products/${slug[0]}`,
        },
      },
    };
  }

  if (slug.length === 2) {
    const product = await getProductWithCategory(locale as Locale, slug[0], slug[1]);
    if (!product) {
      return { title: dict.common.notFound };
    }
    return {
      title: product.title,
      description: product.description,
      alternates: {
        canonical: `/${locale}/products/${slug[0]}/${slug[1]}`,
        languages: {
          'en': `/en/products/${slug[0]}/${slug[1]}`,
          'de': `/de/products/${slug[0]}/${slug[1]}`,
        },
      },
    };
  }

  return { title: dict.common.notFound };
}

// Mono breadcrumb in datasheet language: a slash-separated path.
function Breadcrumb({
  items,
  ariaLabel,
}: {
  items: { label: string; href?: string }[];
  ariaLabel: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400 mb-10"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-red transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];

  // Category page
  if (slug.length === 1) {
    const category = await getProductCategoryBySlug(loc, slug[0]);
    if (!category) {
      notFound();
    }

    const products = await getProductsByCategory(loc, slug[0]);
    const allCategories = await getAllProductCategories(loc);

    return (
      <div className="bg-paper text-ink">
        <PageHeader
          title={category.title}
          subtitle={dict.products.title}
          description={category.description}
        />

        <section className={`${container} py-16 md:py-24`}>
          <Breadcrumb
            ariaLabel={t.breadcrumbAria}
            items={[
              { label: dict.products.title, href: `/${loc}/products` },
              { label: category.title },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Category side index */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <span className={monoLabel}>{t.categoriesLabel}</span>
                <ul className="mt-4 border-t border-hairline">
                  {allCategories.map((cat, i) => {
                    const active = cat.slug === slug[0];
                    return (
                      <li key={cat.slug}>
                        <Link
                          href={`/${loc}/products/${cat.slug}`}
                          className={`flex items-baseline gap-3 px-3 py-2.5 border-b border-hairline text-sm transition-colors ${
                            active
                              ? "bg-ink text-paper font-semibold"
                              : "text-neutral-600 hover:bg-white hover:text-ink"
                          }`}
                        >
                          <span
                            className={`font-mono text-[11px] ${
                              active ? "text-red" : "text-neutral-400"
                            }`}
                          >
                            P.{String(i + 1).padStart(2, "0")}
                          </span>
                          {cat.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Product grid */}
            <div className="lg:col-span-3">
              <Reveal>
                <SectionHead
                  index="1.0"
                  title={dict.products.title}
                  note={t.inCategory(products.length)}
                />
              </Reveal>
              {products.length === 0 ? (
                <p className="py-12 font-mono text-[13px] text-neutral-500">
                  {t.emptyCategory}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline">
                  {products.map((product, i) => (
                    <Reveal
                      key={product.slug}
                      delay={(i % 2) * 0.08}
                      className="bg-paper h-full"
                    >
                      <Link
                        href={`/${loc}/products/${product.category}/${product.slug}`}
                        className="group flex flex-col h-full"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            sizes="(min-width: 1024px) 38vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <span className={monoMeta}>{product.manufacturer}</span>
                          <h3 className="mt-2 font-bold tracking-tight group-hover:text-red transition-colors">
                            {product.title}
                          </h3>
                          <p className="mt-2 text-sm text-neutral-600 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                          <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-red">
                            {dict.products.datasheet} →
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Closing call — anthracite band */}
        <section className="bg-anthracite text-paper">
          <div
            className={`${container} py-14 flex flex-wrap items-center justify-between gap-6`}
          >
            <div>
              <span className={monoLabel}>{t.quoteLabel}</span>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {t.categoryHelpTitle}
              </p>
            </div>
            <Link
              href={`/${loc}/contact`}
              className="px-7 py-3.5 bg-red text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {dict.common.contactUs}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Product detail page
  if (slug.length === 2) {
    const product = await getProductWithCategory(loc, slug[0], slug[1]);
    if (!product) {
      notFound();
    }

    const category = await getProductCategoryBySlug(loc, slug[0]);
    const allRelatedProducts = await getProductsByCategory(loc, slug[0]);
    const relatedProducts = allRelatedProducts
      .filter((p) => p.slug !== slug[1])
      .slice(0, 3);

    return (
      <div className="bg-paper text-ink">
        <PageHeader
          title={product.title}
          subtitle={product.manufacturer}
          description={product.description}
        />

        <section className={`${container} py-16 md:py-24`}>
          <Breadcrumb
            ariaLabel={t.breadcrumbAria}
            items={[
              { label: dict.products.title, href: `/${loc}/products` },
              ...(category
                ? [{ label: category.title, href: `/${loc}/products/${slug[0]}` }]
                : []),
              { label: product.title },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content — the product datasheet */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="relative aspect-video overflow-hidden border border-hairline mb-10">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover grayscale-[35%]"
                  />
                </div>
              </Reveal>

              <Reveal>
                <SectionHead
                  index="1.0"
                  title={t.descriptionTitle}
                  note={product.manufacturer}
                />
                <div className="max-w-none">
                  {product.fullDescription.split("\n\n").map((paragraph, index) => {
                    if (paragraph.startsWith("- ")) {
                      const items = paragraph
                        .split("\n")
                        .filter((line) => line.startsWith("- "));
                      return (
                        <ul key={index} className="my-8 border-t border-hairline">
                          {items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-baseline gap-4 border-b border-hairline py-3"
                            >
                              <span className="shrink-0 font-mono text-[12px] text-red">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-sm md:text-base text-neutral-700 leading-relaxed">
                                {item.substring(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p
                        key={index}
                        className="mb-5 text-base md:text-lg text-neutral-600 leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            {/* Sidebar — specifications, datasheet, quote */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Specifications — bordered dl table */}
                <Reveal>
                  <div className="border border-hairline bg-white">
                    <div className="flex items-baseline justify-between gap-3 px-5 py-3.5 border-b border-hairline">
                      <h3 className="font-bold tracking-tight">
                        {dict.products.specifications}
                      </h3>
                      <span className="font-mono text-[11px] text-neutral-400">
                        {t.specTag}
                      </span>
                    </div>
                    <dl>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="grid grid-cols-5 gap-3 px-5 py-3 border-b border-hairline last:border-b-0"
                        >
                          <dt className="col-span-2 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-500 pt-0.5">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </dt>
                          <dd className="col-span-3 font-mono text-[13px] text-ink">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>

                {/* Datasheet (PDF) */}
                {product.datasheet && (
                  <Reveal>
                    <a
                      href={product.datasheet}
                      className="group flex items-center justify-between gap-4 border border-hairline px-5 py-4 bg-paper hover:border-ink transition-colors"
                    >
                      <div>
                        <p className="font-semibold group-hover:text-red transition-colors">
                          {dict.products.downloadDatasheet}
                        </p>
                        <p className={`mt-1 ${monoMeta}`}>{t.pdfDocument}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[12px] text-red">
                        ↓ PDF
                      </span>
                    </a>
                  </Reveal>
                )}

                {/* Quote call — anthracite card */}
                <Reveal>
                  <div className="bg-anthracite text-paper p-6">
                    <span className={monoLabel}>{t.quoteLabel}</span>
                    <h3 className="mt-3 text-lg font-bold tracking-tight">
                      {dict.cta.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                      {dict.cta.description}
                    </p>
                    <Button href={`/${loc}/contact`} className="mt-5 w-full">
                      {dict.common.contactUs}
                    </Button>
                  </div>
                </Reveal>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                  <Reveal>
                    <div>
                      <span className={monoLabel}>{t.related}</span>
                      <ul className="mt-4 border-t border-hairline">
                        {relatedProducts.map((p, i) => (
                          <li key={p.slug}>
                            <Link
                              href={`/${loc}/products/${p.category}/${p.slug}`}
                              className="group flex items-baseline gap-3 py-3 border-b border-hairline text-sm text-neutral-600 hover:text-red transition-colors"
                            >
                              <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* Closing call — anthracite band */}
        <section className="bg-anthracite text-paper">
          <div
            className={`${container} py-14 flex flex-wrap items-center justify-between gap-6`}
          >
            <div>
              <span className={monoLabel}>{t.detailHelpLabel}</span>
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {t.detailHelpTitle}
              </p>
            </div>
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
        </section>
      </div>
    );
  }

  notFound();
}
