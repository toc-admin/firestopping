import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container } from "@/components/site/tokens";
import { getAllBlogPosts, getBlogCategories } from "@/lib/content";

// Locale-bound UI copy for the K1 layout.
const L10N = {
  en: { archive: "Article archive", records: "records" },
  de: { archive: "Artikelarchiv", records: "Einträge" },
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
    title: dict.metadata.blog.title,
    description: dict.metadata.blog.description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        'en': '/en/blog',
        'de': '/de/blog',
      },
    },
  };
}

// Blog as numbered catalog rows — K1 direction.
export default async function BlogPage({
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
  const posts = await getAllBlogPosts(loc);
  const categories = await getBlogCategories(loc);

  const dateLocale = loc === "de" ? "de-DE" : "en-US";

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.blog.title}
        subtitle={dict.blog.subtitle}
        description={dict.blog.description}
      />

      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="1.0"
            title={t.archive}
            note={`${posts.length} ${t.records}`}
          />
        </Reveal>

        {/* Category chips — static index (no filtering logic existed before) */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10 font-mono text-[11px] uppercase tracking-[0.12em]">
            {categories.map((category) => (
              <span key={category} className="px-3 py-1.5 border border-hairline text-neutral-500">
                {category}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Posts as catalog rows */}
        <div className="border-t border-hairline">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 4) * 0.05}>
              <Link
                href={`/${loc}/blog/${post.slug}`}
                className="group grid grid-cols-12 gap-x-4 gap-y-3 items-center border-b border-hairline py-6 transition-colors hover:bg-white"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-[12px] text-red">
                  B.{String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative col-span-10 md:col-span-2 aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="220px"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                </div>
                <div className="col-span-10 col-start-3 md:col-span-6 md:col-start-auto md:pl-2">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]">
                    <span className="text-red">{post.category}</span>
                    <span className="text-neutral-400">
                      {new Date(post.date).toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-neutral-400">
                      {post.readTime} {dict.blog.readTime}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl md:text-2xl font-bold tracking-tight group-hover:text-red transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <span className="hidden md:flex md:col-span-3 items-center justify-end gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400 group-hover:text-ink transition-colors">
                  {dict.common.readMore}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
