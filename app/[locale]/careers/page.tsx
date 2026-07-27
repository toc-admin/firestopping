import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";
import { getActiveJobs, getCompanies, getCareerContactEmail } from "@/lib/content";

// Locale-bound UI copy for the K1 layout.
const L10N = {
  en: { position: "Position", positions: "open positions" },
  de: { position: "Stelle", positions: "offene Stellen" },
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
    title: dict.metadata.careers.title,
    description: dict.metadata.careers.description,
    alternates: {
      canonical: `/${locale}/careers`,
      languages: {
        'en': '/en/careers',
        'de': '/de/careers',
      },
    },
  };
}

// Careers: companies as index cells, jobs as dossier rows — K1 direction.
export default async function CareersPage({
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
  const jobs = await getActiveJobs(loc);
  const companies = await getCompanies(loc);
  const contactEmail = await getCareerContactEmail(loc);

  const benefits = [
    dict.about.values.expertise.title,
    dict.about.values.quality.title,
    dict.about.values.partnership.title,
    dict.about.values.reliability.title,
  ];

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.careers.title}
        subtitle={dict.careers.subtitle}
        description={dict.careers.description}
      />

      {/* ── 1.0 Companies ──────────────────────────────── */}
      <section className={`${container} py-20 md:py-24`}>
        <Reveal>
          <SectionHead index="1.0" title={dict.careers.companies.title} />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline">
          {companies.map((company, i) => (
            <Reveal key={company.name} delay={i * 0.08} className="bg-paper">
              <div className="p-7 md:p-8 h-full">
                <span className="font-mono text-[12px] text-red">
                  T.{String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">{company.name}</h3>
                <p className="mt-3 text-neutral-600 leading-relaxed">{company.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Benefits — numbered cells */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline">
          {benefits.map((label, i) => (
            <Reveal key={label} delay={i * 0.05} className="bg-white">
              <div className="p-6 h-full">
                <span className="font-mono text-[11px] text-red">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm font-semibold text-ink">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 2.0 Open positions ─────────────────────────── */}
      <section className="border-t border-hairline bg-white">
        <div className={`${container} py-20 md:py-24`}>
          <Reveal>
            <SectionHead
              index="2.0"
              title={dict.careers.openPositions}
              note={`${jobs.length} ${t.positions}`}
            />
          </Reveal>

          {jobs.length === 0 ? (
            <div className="border border-hairline bg-paper p-10">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-neutral-500">
                {dict.careers.noPositions}
              </p>
            </div>
          ) : (
            <div className="border-t border-hairline">
              {jobs.map((job, i) => (
                <Reveal key={job.slug} delay={i * 0.05}>
                  <Link
                    href={`/${loc}/careers/${job.slug}`}
                    className="group grid grid-cols-12 gap-x-4 gap-y-2 items-baseline border-b border-hairline py-6 transition-colors hover:bg-paper"
                  >
                    <span className="col-span-2 md:col-span-1 font-mono text-[12px] text-red">
                      P.{String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="col-span-10 md:col-span-4 text-xl font-bold tracking-tight group-hover:text-red transition-colors">
                      {job.title}
                    </h3>
                    <span className="col-span-10 col-start-3 md:col-span-5 md:col-start-auto font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                      {job.location} · {job.department} ·{" "}
                      <span className="text-red">{job.type}</span>
                    </span>
                    <span className="hidden md:block md:col-span-2 text-right font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400 group-hover:text-ink transition-colors">
                      {dict.common.learnMore} →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Spontaneous application — ink band ─────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-16 md:py-20`}>
          <Reveal>
            <span className={monoLabel}>{t.position} / ∗</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl leading-[1.05]">
              {dict.careers.spontaneousApplication}
            </h2>
            <p className="mt-5 max-w-xl text-neutral-300 leading-relaxed">
              {dict.careers.spontaneousDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={`mailto:${contactEmail}?subject=${dict.careers.spontaneousApplication}`}
                className="px-7 py-3.5 bg-red text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {dict.careers.applyNow}
              </a>
              <span className="font-mono text-[12px] tracking-[0.08em] text-neutral-400">
                {contactEmail}
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
