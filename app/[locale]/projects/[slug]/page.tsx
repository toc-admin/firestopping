import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";
import { getProjectBySlug, getProjectSlugs, getAllProjects } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Locale-bound UI copy for the K1 layout.
const L10N = {
  en: {
    dossier: "Project dossier",
    about: "About the project",
    facts: { location: "Location", year: "Year", category: "Category", scope: "Scope", systems: "systems" },
    fig: "Fig.",
    related: "Related projects",
  },
  de: {
    dossier: "Projektdossier",
    about: "Über das Projekt",
    facts: { location: "Standort", year: "Jahr", category: "Kategorie", scope: "Umfang", systems: "Systeme" },
    fig: "Abb.",
    related: "Verwandte Projekte",
  },
} as const;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getProjectSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) return {};

  const project = await getProjectBySlug(locale as Locale, slug);
  const dict = await getDictionary(locale as Locale);

  if (!project) {
    return { title: dict.common.notFound };
  }

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        'en': `/en/projects/${slug}`,
        'de': `/de/projects/${slug}`,
      },
    },
  };
}

// Project detail as an anthracite-headed dossier — K1 direction.
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];
  const project = await getProjectBySlug(loc, slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getAllProjects(loc);
  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug && p.category === project.category)
    .slice(0, 3);

  const facts = [
    [t.facts.location, project.location],
    [t.facts.year, project.year],
    [t.facts.category, project.category],
    [t.facts.scope, `${project.scope.length} ${t.facts.systems}`],
  ] as const;

  return (
    <div className="bg-paper text-ink">
      {/* ── Anthracite dossier header ──────────────────── */}
      <section className="bg-anthracite text-paper border-b border-hairline-dark">
        <div className={`${container} py-12 md:py-16`}>
          <Link
            href={`/${loc}/projects`}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors"
          >
            ← {dict.projects.viewAllProjects}
          </Link>
          <span className={`${monoLabel} mt-6 block`}>
            {t.dossier} · {project.category}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02] max-w-3xl">
            {project.title}
          </h1>
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3 border-t border-hairline-dark pt-6 font-mono text-[12px] max-w-3xl">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-neutral-400 uppercase tracking-[0.12em] text-[10px]">
                  {label}
                </dt>
                <dd className="mt-1 text-paper">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Full-color cover — documentary proof ───────── */}
      <div className={`${container} pt-10`}>
        <Reveal>
          <figure className="border border-hairline bg-white p-2">
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </figure>
        </Reveal>
      </div>

      <section className={`${container} py-16 md:py-20`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* 1.0 About */}
            <Reveal>
              <SectionHead index="1.0" title={t.about} />
              <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </Reveal>

            {/* 2.0 Scope — numbered rows */}
            <Reveal>
              <div className="mt-14">
                <SectionHead index="2.0" title={dict.projects.scope} />
                <ul className="border-t border-hairline">
                  {project.scope.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-5 border-b border-hairline py-4"
                    >
                      <span className="font-mono text-[11px] text-red">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-neutral-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* 3.0 Gallery — full color with mono captions */}
            {project.gallery.length > 0 && (
              <Reveal>
                <div className="mt-14">
                  <SectionHead index="3.0" title={dict.projects.gallery} />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-hairline">
                    {project.gallery.map((image, index) => (
                      <figure key={image} className="bg-paper p-2">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={image}
                            alt={`${project.title} — ${index + 1}`}
                            fill
                            sizes="(min-width: 768px) 22vw, 45vw"
                            className="object-cover"
                          />
                        </div>
                        <figcaption className="pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                          {t.fig} {String(index + 1).padStart(2, "0")}/
                          {String(project.gallery.length).padStart(2, "0")}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Reveal>
                <div className="bg-anthracite text-paper p-5">
                  <span className={monoLabel}>{dict.cta.title}</span>
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

              {relatedProjects.length > 0 && (
                <Reveal delay={0.06}>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red">
                      {t.related}
                    </p>
                    <ul className="mt-3 border-t border-hairline">
                      {relatedProjects.map((p) => (
                        <li key={p.slug} className="border-b border-hairline">
                          <Link
                            href={`/${loc}/projects/${p.slug}`}
                            className="group flex items-center gap-4 py-3"
                          >
                            <div className="relative w-16 h-12 overflow-hidden flex-shrink-0">
                              <Image
                                src={p.image}
                                alt={p.title}
                                fill
                                sizes="64px"
                                className="object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-ink group-hover:text-red transition-colors">
                                {p.title}
                              </p>
                              <p className="font-mono text-[11px] text-neutral-400">
                                {p.location}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
