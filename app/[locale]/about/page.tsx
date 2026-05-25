import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import Stats from "@/components/sections/Stats";
import Certifications from "@/components/sections/Certifications";
import Director from "@/components/sections/Director";
import ContactCTA from "@/components/sections/ContactCTA";

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <PageHeader
        title={dict.about.title}
        subtitle={dict.about.subtitle}
        description={dict.about.description}
      />

      {/* Story section with image */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                {dict.about.ourStory}
              </h2>
              <div className="space-y-4 text-neutral-600">
                <p>{dict.about.storyParagraph1}</p>
                <p>{dict.about.storyParagraph2}</p>
                <p>{dict.about.storyParagraph3}</p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/services/izvodjenje-radova.jpg"
                alt={dict.common.companyName}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Stats locale={locale as Locale} dict={dict} />

      {/* Mission & Values */}
      <section className="py-20 md:py-28 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              {dict.about.ourMission}
            </h2>
            <p className="text-lg text-neutral-600">
              {dict.about.missionStatement}
            </p>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-6">
            {dict.about.ourValues}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-2">
                {dict.about.values.expertise.title}
              </h4>
              <p className="text-sm text-neutral-600">
                {dict.about.values.expertise.description}
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-2">
                {dict.about.values.quality.title}
              </h4>
              <p className="text-sm text-neutral-600">
                {dict.about.values.quality.description}
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-2">
                {dict.about.values.reliability.title}
              </h4>
              <p className="text-sm text-neutral-600">
                {dict.about.values.reliability.description}
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-neutral-200">
              <h4 className="font-semibold text-neutral-900 mb-2">
                {dict.about.values.partnership.title}
              </h4>
              <p className="text-sm text-neutral-600">
                {dict.about.values.partnership.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Certifications locale={locale as Locale} dict={dict} />
      <Director locale={locale as Locale} dict={dict} />
      <ContactCTA locale={locale as Locale} dict={dict} />
    </>
  );
}
