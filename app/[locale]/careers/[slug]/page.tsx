import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";
import { getJobBySlug, getJobSlugs, getCareerContactEmail } from "@/lib/content";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getJobSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) return {};

  const job = await getJobBySlug(locale as Locale, slug);
  const dict = await getDictionary(locale as Locale);

  if (!job) {
    return { title: dict.common.notFound };
  }

  return {
    title: `${job.title} - ${dict.careers.title}`,
    description: job.description,
    alternates: {
      canonical: `/${locale}/careers/${slug}`,
      languages: {
        'en': `/en/careers/${slug}`,
        'de': `/de/careers/${slug}`,
      },
    },
  };
}

// Numbered dossier list used for responsibilities/requirements/benefits.
function DossierList({
  index,
  title,
  items,
  prefix,
}: {
  index: string;
  title: string;
  items: string[];
  prefix: string;
}) {
  return (
    <Reveal>
      <div>
        <SectionHead index={index} title={title} />
        <ul className="border-t border-hairline">
          {items.map((item, i) => (
            <li key={item} className="flex items-baseline gap-5 border-b border-hairline py-3.5">
              <span className="font-mono text-[11px] text-red">
                {prefix}.{String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-neutral-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

// Job detail as an anthracite-headed dossier — K1 direction.
export default async function JobPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const job = await getJobBySlug(loc, slug);
  const contactEmail = await getCareerContactEmail(loc);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-paper text-ink">
      {/* ── Anthracite job header ──────────────────────── */}
      <section className="bg-anthracite text-paper border-b border-hairline-dark">
        <div className={`${container} py-12 md:py-16`}>
          <Link
            href={`/${loc}/careers`}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors"
          >
            ← {dict.careers.viewAllPositions}
          </Link>
          <span className={`${monoLabel} mt-6 block`}>
            {job.department} · {job.location} · {job.type}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.02] max-w-3xl">
            {job.title}
          </h1>
          <p className="mt-5 text-lg text-neutral-300 leading-relaxed max-w-2xl">
            {job.description}
          </p>
        </div>
      </section>

      <section className={`${container} py-16 md:py-24`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-14">
            <DossierList
              index="1.0"
              title={dict.careers.jobDetails.responsibilities}
              items={job.responsibilities}
              prefix="R"
            />
            <DossierList
              index="2.0"
              title={dict.careers.jobDetails.requirements}
              items={job.requirements}
              prefix="Q"
            />
            <DossierList
              index="3.0"
              title={dict.careers.jobDetails.benefits}
              items={job.benefits}
              prefix="B"
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Reveal>
                <div className="bg-ink text-white p-5">
                  <span className={monoLabel}>{dict.careers.applyNow}</span>
                  <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                    {dict.contact.responseTime}
                  </p>
                  <a
                    href={`mailto:${contactEmail}?subject=${dict.careers.applyNow}: ${job.title}`}
                    className="mt-5 block bg-red px-4 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    {dict.careers.applyNow}
                  </a>
                  <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-neutral-500 text-center">
                    {contactEmail}
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="border border-hairline bg-white">
                  <div className="border-b border-hairline px-5 py-3.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-red">
                      {dict.careers.jobDetails.type}
                    </span>
                  </div>
                  <dl>
                    {(
                      [
                        [dict.careers.jobDetails.location, job.location],
                        [dict.careers.jobDetails.department, job.department],
                        [dict.careers.jobDetails.type, job.type],
                      ] as const
                    ).map(([label, value]) => (
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
