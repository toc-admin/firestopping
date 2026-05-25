import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Check, Mail } from "lucide-react";
import { type Locale, locales } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import ContactCTA from "@/components/sections/ContactCTA";
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

export default async function JobPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const job = await getJobBySlug(locale as Locale, slug);
  const contactEmail = await getCareerContactEmail(locale as Locale);

  if (!job) {
    notFound();
  }

  return (
    <>
      {/* Job Hero */}
      <section className="pt-32 pb-16 bg-neutral-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/careers`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{dict.careers.viewAllPositions}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm">
              <Briefcase className="h-3.5 w-3.5" />
              {job.department}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-500 text-white rounded-full text-sm font-medium">
              {job.type}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {job.title}
          </h1>

          <p className="text-xl text-neutral-300">
            {job.description}
          </p>
        </div>
      </section>

      {/* Job Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Responsibilities */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  {dict.careers.jobDetails.responsibilities}
                </h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-brand-600" />
                      </div>
                      <span className="text-neutral-700 pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  {dict.careers.jobDetails.requirements}
                </h2>
                <ul className="space-y-4">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-neutral-600" />
                      </div>
                      <span className="text-neutral-700 pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="p-8 bg-neutral-50 rounded-2xl">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  {dict.careers.jobDetails.benefits}
                </h2>
                <ul className="space-y-4">
                  {job.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-neutral-700 pt-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Apply CTA */}
                <div className="bg-neutral-900 rounded-2xl p-6 text-white">
                  <h3 className="font-semibold text-lg mb-2">
                    {dict.careers.applyNow}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-6">
                    {dict.contact.responseTime}
                  </p>
                  <a
                    href={`mailto:${contactEmail}?subject=${dict.careers.applyNow}: ${job.title}`}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-brand-500 text-white font-medium rounded-full hover:bg-brand-600 transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{dict.careers.applyNow}</span>
                  </a>
                  <p className="mt-4 text-xs text-neutral-500 text-center">
                    {dict.contact.email}: {contactEmail}
                  </p>
                </div>

                {/* Quick info */}
                <div className="bg-neutral-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-neutral-900 mb-4">
                    {dict.careers.jobDetails.type}
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-neutral-500">{dict.careers.jobDetails.location}</dt>
                      <dd className="font-medium text-neutral-900">{job.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-neutral-500">{dict.careers.jobDetails.department}</dt>
                      <dd className="font-medium text-neutral-900">{job.department}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-neutral-500">{dict.careers.jobDetails.type}</dt>
                      <dd className="font-medium text-neutral-900">{job.type}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA locale={locale as Locale} dict={dict} />
    </>
  );
}
