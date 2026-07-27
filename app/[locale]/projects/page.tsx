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
import { getAllProjects } from "@/lib/content";

// Locale-bound UI copy for the K1 layout.
const L10N = {
  en: {
    registry: "Project registry",
    records: "records",
    facts: { location: "Location", year: "Year", scope: "Scope", systems: "systems" },
    ctaTitle: "Your project deserves a system that passes the test.",
  },
  de: {
    registry: "Projektregister",
    records: "Einträge",
    facts: { location: "Standort", year: "Jahr", scope: "Umfang", systems: "Systeme" },
    ctaTitle: "Ihr Projekt verdient ein System, das den Test besteht.",
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
    title: dict.metadata.projects.title,
    description: dict.metadata.projects.description,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: {
        'en': '/en/projects',
        'de': '/de/projects',
      },
    },
  };
}

// Projects as dossier rows — K1 direction.
export default async function ProjectsPage({
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
  const projects = await getAllProjects(loc);

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        description={dict.projects.description}
      />

      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="1.0"
            title={t.registry}
            note={`${projects.length} ${t.records}`}
          />
        </Reveal>

        <div className="space-y-px bg-hairline">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.06} className="bg-paper">
              <Link
                href={`/${loc}/projects/${project.slug}`}
                className="group grid grid-cols-1 md:grid-cols-2 gap-0"
              >
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500"
                  />
                </div>
                <div className="p-7 md:p-10 flex flex-col justify-center border border-hairline md:border-l-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className={monoLabel}>{project.category}</span>
                    <span className="font-mono text-[11px] text-neutral-400">
                      PR.{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight group-hover:text-red transition-colors">
                    {project.title}
                  </h2>
                  <dl className="mt-5 grid grid-cols-2 gap-y-1.5 font-mono text-[12px] max-w-xs">
                    <dt className="text-neutral-400 uppercase tracking-[0.1em]">
                      {t.facts.location}
                    </dt>
                    <dd>{project.location}</dd>
                    <dt className="text-neutral-400 uppercase tracking-[0.1em]">
                      {t.facts.year}
                    </dt>
                    <dd>{project.year}</dd>
                    <dt className="text-neutral-400 uppercase tracking-[0.1em]">
                      {t.facts.scope}
                    </dt>
                    <dd>
                      {project.scope.length} {t.facts.systems}
                    </dd>
                  </dl>
                  <p className="mt-5 text-sm text-neutral-600 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
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
