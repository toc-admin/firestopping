import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Stats from "@/components/sections/Stats";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.metadata.about.title,
    description: dict.metadata.about.description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        'en': '/en/about',
        'de': '/de/about',
      },
    },
  };
}

// About page in K1 language: paper story, anthracite stats, numbered values.
export default async function AboutPage({
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

  const values = [
    dict.about.values.expertise,
    dict.about.values.quality,
    dict.about.values.reliability,
    dict.about.values.partnership,
  ];
  const certifications = [
    dict.certifications.items.iso,
    dict.certifications.items.mup,
    dict.certifications.items.eta,
    dict.certifications.items.ce,
  ];

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.about.title}
        subtitle={dict.about.subtitle}
        description={dict.about.description}
      />

      {/* ── 1.0 Story ──────────────────────────────────── */}
      <section className={`${container} py-20 md:py-24`}>
        <Reveal>
          <SectionHead index="1.0" title={dict.about.ourStory} note={dict.about.subtitle} />
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div className="space-y-4 text-neutral-600 leading-relaxed max-w-xl">
              <p>{dict.about.storyParagraph1}</p>
              <p>{dict.about.storyParagraph2}</p>
              <p>{dict.about.storyParagraph3}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <figure className="border border-hairline bg-white p-2">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/fsb/rjesenja/parapet-1.jpg"
                  alt={dict.common.companyName}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover grayscale-[35%]"
                />
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Stats — anthracite band ────────────────────── */}
      <Stats locale={loc} dict={dict} />

      {/* ── 2.0 Mission & values ───────────────────────── */}
      <section className={`${container} py-20 md:py-24`}>
        <Reveal>
          <SectionHead index="2.0" title={dict.about.ourMission} note={dict.about.ourValues} />
          <p className="max-w-2xl text-lg text-neutral-600 mb-12">
            {dict.about.missionStatement}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 0.05} className="bg-white">
              <div className="p-6 h-full">
                <span className="font-mono text-[11px] text-red">
                  V.{String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="mt-2 font-bold tracking-tight">{value.title}</h4>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 3.0 Certifications ─────────────────────────── */}
      <section className="border-t border-hairline bg-white">
        <div className={`${container} py-20 md:py-24`}>
          <Reveal>
            <SectionHead
              index="3.0"
              title={dict.certifications.sectionTitle}
              note={dict.certifications.sectionLabel}
            />
            <p className="max-w-2xl text-neutral-600 mb-10">
              {dict.certifications.sectionDescription}
            </p>
          </Reveal>
          <div className="border-t border-hairline">
            {certifications.map((cert, i) => (
              <Reveal key={cert.title} delay={i * 0.04}>
                <div className="grid grid-cols-12 gap-4 items-baseline border-b border-hairline py-5">
                  <span className="col-span-2 md:col-span-1 font-mono text-[12px] text-red">
                    C.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="col-span-10 md:col-span-4 text-lg font-bold tracking-tight">
                    {cert.title}
                  </h4>
                  <p className="col-span-10 col-start-3 md:col-span-7 md:col-start-6 text-sm text-neutral-600">
                    {cert.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4.0 Leadership ─────────────────────────────── */}
      <section className={`${container} py-20 md:py-24`}>
        <Reveal>
          <SectionHead index="4.0" title={dict.director.label} note={dict.director.title} />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-hairline border border-hairline">
            <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[480px] bg-white">
              <Image
                src="/images/team/direktor.jpg"
                alt={dict.director.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
              <span className={monoLabel}>{dict.director.label}</span>
              <h3 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                {dict.director.name}
              </h3>
              <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.15em] text-neutral-400">
                {dict.director.title}
              </p>
              <div className="mt-6 space-y-4 text-neutral-600 leading-relaxed">
                <p>{dict.director.bio1}</p>
                <p>{dict.director.bio2}</p>
                <p>{dict.director.bio3}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Contact CTA — ink ──────────────────────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-16 md:py-20`}>
          <Reveal>
            <span className={monoLabel}>{dict.contactCta.label}</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl leading-[1.05]">
              {dict.contactCta.title}{" "}
              <span className="text-red">{dict.contactCta.titleHighlight}</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
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
