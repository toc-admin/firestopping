import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import ContactCTA from "@/components/sections/ContactCTA";
import { getAllProjects, getProjectCategories } from "@/lib/content";

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

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const projects = await getAllProjects(locale as Locale);
  const categories = await getProjectCategories(locale as Locale);

  return (
    <>
      <PageHeader
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        description={dict.projects.description}
      />

      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium">
              {dict.common.viewAll}
            </span>
            {categories.map((category) => (
              <span
                key={category}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full text-sm font-medium hover:bg-neutral-200 cursor-pointer transition-colors"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/${locale}/projects/${project.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5]"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-brand-400 text-sm font-medium mb-2">
                    {project.category}
                  </p>
                  <h2 className="text-xl font-semibold text-white group-hover:text-brand-100 transition-colors">
                    {project.title}
                  </h2>
                  <div className="mt-3 flex items-center gap-4 text-sm text-neutral-300">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.year}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA locale={locale as Locale} dict={dict} />
    </>
  );
}
