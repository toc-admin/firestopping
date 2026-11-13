import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import {
  getAllServices,
  getAllSolutions,
  getFeaturedProjects,
  getLatestBlogPosts,
} from "@/lib/content";
import FireCurve from "@/components/site/FireCurve";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";

// Locale-bound UI copy for the K1 layout (content strings stay in messages/).
const L10N = {
  en: {
    heroTitle: "Passive fire protection",
    curveCaption: "ISO 834 · standard fire curve · T = 20 + 345·log₁₀(8t+1)",
    curveAria: "ISO 834 standard fire curve with resistance marks EI 30 to EI 120",
    norms: [
      "EN 1366-3 — penetration seals",
      "EN 13381-8 — coatings",
      "EN 16034 — doors",
      "EN 1364-1 — glazing",
      "ISO 9001 — quality",
    ],
    facts: { location: "Location", year: "Year", scope: "Scope", systems: "systems" },
    allProjects: "All projects",
    servicesNote: "From consulting to installation",
    processTitle: "The system as a whole",
    processNote: "How we run a project",
    processIntro:
      "In practice, the biggest problems don't arise in the product but in the system. That's why we take every system through all four phases — with no break in responsibility.",
    phaseLabel: "phase",
    phases: [
      ["Consulting", "Project review and cost optimization without compromising safety."],
      ["System selection", "Certified systems from proven manufacturers, matched to the project's requirements."],
      ["Installation", "Our own certified crews carry out the works according to the manufacturer's instructions."],
      ["Documentation", "Reports, declarations of performed works and complete handover documentation."],
    ],
    solutionsNote: "6 passive protection systems",
    projectsNote: "Selected references",
    ctaLabel: "Request a quote",
    ctaTitle: "Your project deserves a system that passes the test.",
  },
  de: {
    heroTitle: "Passiver Brandschutz",
    curveCaption: "ISO 834 · Einheits-Temperaturzeitkurve · T = 20 + 345·log₁₀(8t+1)",
    curveAria: "ISO 834 Einheits-Temperaturzeitkurve mit Widerstandsmarken EI 30 bis EI 120",
    norms: [
      "EN 1366-3 — Abschottungen",
      "EN 13381-8 — Beschichtungen",
      "EN 16034 — Türen",
      "EN 1364-1 — Verglasungen",
      "ISO 9001 — Qualität",
    ],
    facts: { location: "Standort", year: "Jahr", scope: "Umfang", systems: "Systeme" },
    allProjects: "Alle Projekte",
    servicesNote: "Von der Beratung bis zur Montage",
    processTitle: "Das System als Ganzes",
    processNote: "Wie wir Projekte führen",
    processIntro:
      "Die größten Probleme entstehen in der Praxis nicht im Produkt, sondern im System. Deshalb führen wir jedes System durch alle vier Phasen — ohne Unterbrechung der Verantwortung.",
    phaseLabel: "Phase",
    phases: [
      ["Beratung", "Projektprüfung und Kostenoptimierung ohne Kompromisse bei der Sicherheit."],
      ["Systemauswahl", "Zertifizierte Systeme bewährter Hersteller, abgestimmt auf die Anforderungen des Projekts."],
      ["Montage", "Eigene zertifizierte Teams führen die Arbeiten nach Herstellervorgaben aus."],
      ["Dokumentation", "Protokolle, Erklärungen über ausgeführte Arbeiten und vollständige Übergabedokumentation."],
    ],
    solutionsNote: "6 Systeme des passiven Brandschutzes",
    projectsNote: "Ausgewählte Referenzen",
    ctaLabel: "Angebot anfordern",
    ctaTitle: "Ihr Projekt verdient ein System, das den Test besteht.",
  },
} as const;

export default async function Home({
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
  const solutions = await getAllSolutions(loc);
  const projects = (await getFeaturedProjects(loc)).slice(0, 3);
  const latestPost = (await getLatestBlogPosts(loc, 1))[0];

  return (
    <div className="bg-paper text-ink">
      {/* ── Hero: clear headline + ISO 834 curve ───────── */}
      <section className="border-b border-hairline">
        <div className={`${container} py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center`}>
          <div>
            <span className={monoLabel}>
              {dict.common.companyName} · Zagreb
            </span>
            <h1 className="mt-6 text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[0.98] tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-7 text-lg text-neutral-600 max-w-lg leading-relaxed">
              {dict.hero.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href={`/${loc}/solutions`}
                className="px-7 py-3.5 bg-red text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {dict.navigation.solutions}
              </Link>
              <Link
                href={`/${loc}/contact`}
                className="px-7 py-3.5 font-semibold border border-ink hover:bg-neutral-100 transition-colors"
              >
                {dict.hero.cta}
              </Link>
            </div>
          </div>
          <FireCurve caption={t.curveCaption} ariaLabel={t.curveAria} />
        </div>

        {/* norms strip — anthracite inset */}
        <div className="bg-anthracite">
          <div
            className={`${container} py-3.5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400`}
          >
            {t.norms.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1.0 Services: spec-table rows ──────────────── */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="1.0"
            title={dict.navigation.services}
            note={t.servicesNote}
          />
        </Reveal>
        <Reveal>
          <div className="border-t border-hairline">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/${loc}/services/${service.slug}`}
                className="group grid grid-cols-12 gap-4 items-baseline border-b border-hairline py-6 transition-colors hover:bg-white"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-[12px] text-red">
                  S.{String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="col-span-10 md:col-span-4 text-xl font-bold tracking-tight group-hover:text-red transition-colors">
                  {service.title}
                </h3>
                <p className="col-span-10 col-start-3 md:col-span-6 md:col-start-6 text-sm text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
                <span className="hidden md:block md:col-span-1 text-right text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── 2.0 Process — anthracite plane (thematic break) ── */}
      <section className="bg-anthracite text-paper">
        <div className={`${container} py-20 md:py-28`}>
          <Reveal>
            <SectionHead
              dark
              index="2.0"
              title={t.processTitle}
              note={t.processNote}
            />
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-lg text-neutral-300 mb-14">{t.processIntro}</p>
          </Reveal>
          <ol className="grid grid-cols-1 md:grid-cols-4 border-t border-paper/60">
            {t.phases.map(([title, text], i) => (
              <li
                key={title}
                className="relative pt-8 pb-4 pr-6 md:border-r md:border-hairline-dark last:border-r-0"
              >
                <Reveal delay={i * 0.08}>
                  <span className="absolute top-0 left-0 -translate-y-1/2 inline-block w-2.5 h-2.5 bg-red" />
                  <span className="font-mono text-[12px] text-neutral-400">
                    {t.phaseLabel} {i + 1}/4
                  </span>
                  <h3 className="mt-2 text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 3.0 Solutions ──────────────────────────────── */}
      <section className="border-t border-hairline bg-white">
        <div className={`${container} py-20 md:py-28`}>
          <Reveal>
            <SectionHead
              index="3.0"
              title={dict.navigation.solutions}
              note={t.solutionsNote}
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
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold tracking-tight group-hover:text-red transition-colors">
                        {solution.title}
                      </h3>
                      <span className="shrink-0 px-2 py-1 font-mono text-[10px] text-white bg-ink">
                        {solution.specifications.fireResistance}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                      {solution.description}
                    </p>
                    <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                      {solution.specifications.standard}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4.0 Projects ───────────────────────────────── */}
      <section className={`${container} py-20 md:py-28`}>
        <Reveal>
          <SectionHead
            index="4.0"
            title={dict.navigation.projects}
            note={t.projectsNote}
          />
        </Reveal>
        <div className="space-y-px bg-hairline">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06} className="bg-paper">
              <Link
                href={`/${loc}/projects/${project.slug}`}
                className="group grid grid-cols-1 md:grid-cols-2 gap-0"
              >
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[300px] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="p-7 md:p-10 flex flex-col justify-center border border-hairline md:border-l-0">
                  <span className={monoLabel}>{project.category}</span>
                  <h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight group-hover:text-red transition-colors">
                    {project.title}
                  </h3>
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
        <div className="mt-8">
          <Link
            href={`/${loc}/projects`}
            className="inline-block px-7 py-3.5 font-semibold border border-ink hover:bg-white transition-colors"
          >
            {t.allProjects} →
          </Link>
        </div>
      </section>

      {/* ── 4.0 Blog ───────────────────────────────────── */}
      {latestPost && (
        <section className="border-t border-hairline bg-white">
          <div className={`${container} py-16`}>
            <Reveal>
              <SectionHead
                index="5.0"
                title={dict.blog.sectionTitle}
                note={latestPost.date}
              />
              <Link
                href={`/${loc}/blog/${latestPost.slug}`}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline"
              >
                <span className="md:col-span-2 font-mono text-[11px] uppercase tracking-[0.15em] text-red">
                  {latestPost.category}
                </span>
                <h3 className="md:col-span-7 text-2xl md:text-3xl font-bold tracking-tight group-hover:text-red transition-colors">
                  {latestPost.title}
                </h3>
                <span className="md:col-span-3 md:text-right font-mono text-[12px] text-neutral-400">
                  {latestPost.readTime} {dict.blog.readTime} →
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Contact CTA — ink ──────────────────────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-20 md:py-28`}>
          <Reveal>
            <span className={monoLabel}>{t.ctaLabel}</span>
            <h2 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl leading-[1.05]">
              {t.ctaTitle}
            </h2>
            <div className="mt-9 flex flex-wrap gap-3">
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
