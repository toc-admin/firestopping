import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import Reveal from "@/components/site/Reveal";
import { container, monoLabel } from "@/components/site/tokens";
import { getBlogPostBySlug, getBlogPostSlugs, getAllBlogPosts } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Locale-bound UI copy for the K1 layout.
const L10N = {
  en: { related: "Related articles" },
  de: { related: "Verwandte Artikel" },
} as const;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getBlogPostSlugs(locale as Locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) return {};

  const post = await getBlogPostBySlug(locale as Locale, slug);
  const dict = await getDictionary(locale as Locale);

  if (!post) {
    return { title: dict.common.notFound };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        'en': `/en/blog/${slug}`,
        'de': `/de/blog/${slug}`,
      },
    },
  };
}

// Article with an anthracite meta header — K1 direction.
export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];
  const post = await getBlogPostBySlug(loc, slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getAllBlogPosts(loc);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const dateLocale = loc === "de" ? "de-DE" : "en-US";
  const formattedDate = new Date(post.date).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-paper text-ink">
      {/* ── Anthracite article header ──────────────────── */}
      <section className="bg-anthracite text-paper border-b border-hairline-dark">
        <div className={`${container} py-12 md:py-16`}>
          <Link
            href={`/${loc}/blog`}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors"
          >
            ← {dict.blog.viewAllPosts}
          </Link>
          <span className={`${monoLabel} mt-6 block`}>{post.category}</span>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">
            {post.title}
          </h1>
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 border-t border-hairline-dark pt-6 font-mono text-[12px] max-w-2xl">
            <div>
              <dt className="text-neutral-400 uppercase tracking-[0.12em] text-[10px]">
                {dict.blog.author}
              </dt>
              <dd className="mt-1 text-paper">{post.author}</dd>
            </div>
            <div>
              <dt className="text-neutral-400 uppercase tracking-[0.12em] text-[10px]">
                {dict.blog.publishedOn}
              </dt>
              <dd className="mt-1 text-paper">{formattedDate}</dd>
            </div>
            <div>
              <dt className="text-neutral-400 uppercase tracking-[0.12em] text-[10px]">
                {dict.blog.category}
              </dt>
              <dd className="mt-1 text-paper">
                {post.readTime} {dict.blog.readTime}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Cover figure — full color documentary ───────── */}
      <div className={`${container} pt-10`}>
        <Reveal>
          <figure className="mx-auto max-w-3xl border border-hairline bg-white p-2">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </figure>
        </Reveal>
      </div>

      {/* ── Article body ───────────────────────────────── */}
      <section className={`${container} py-14 md:py-20`}>
        <div className="mx-auto max-w-3xl">
          <article>
            {post.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={index}
                    className="mt-10 mb-4 border-t border-hairline pt-6 text-2xl font-bold tracking-tight"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="mt-6 mb-3 text-xl font-semibold tracking-tight">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter((item) => item.startsWith("- "));
                return (
                  <ul key={index} className="my-5 border-t border-hairline">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-baseline gap-4 border-b border-hairline py-2.5"
                      >
                        <span className="font-mono text-[11px] text-red">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-neutral-600 leading-relaxed">
                          {item.replace("- ", "")}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\./.test(paragraph)) {
                const items = paragraph.split("\n").filter((item) => /^\d+\./.test(item));
                return (
                  <ol key={index} className="my-5 border-t border-hairline">
                    {items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-baseline gap-4 border-b border-hairline py-2.5"
                      >
                        <span className="font-mono text-[11px] text-red">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-neutral-600 leading-relaxed">
                          {item.replace(/^\d+\.\s*/, "")}
                        </span>
                      </li>
                    ))}
                  </ol>
                );
              }
              if (paragraph.includes("**")) {
                const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={index} className="my-4 text-neutral-600 leading-relaxed">
                    {parts.map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={i} className="text-ink">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                );
              }
              return (
                <p key={index} className="my-4 text-neutral-600 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* CTA panel */}
          <Reveal>
            <div className="mt-14 bg-anthracite text-paper p-7">
              <span className={monoLabel}>{dict.cta.title}</span>
              <p className="mt-3 text-neutral-300 leading-relaxed">{dict.cta.description}</p>
              <Link
                href={`/${loc}/contact`}
                className="mt-6 inline-block bg-red px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                {dict.common.contactUs}
              </Link>
            </div>
          </Reveal>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <Reveal>
              <div className="mt-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red">
                  {t.related}
                </p>
                <ul className="mt-3 border-t border-hairline">
                  {relatedPosts.map((p, i) => (
                    <li key={p.slug} className="border-b border-hairline">
                      <Link
                        href={`/${loc}/blog/${p.slug}`}
                        className="group flex items-baseline gap-4 py-3.5"
                      >
                        <span className="font-mono text-[11px] text-red">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-semibold text-ink group-hover:text-red transition-colors">
                          {p.title}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-400">
                          {new Date(p.date).toLocaleDateString(dateLocale, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}
