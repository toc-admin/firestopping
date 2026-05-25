import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { getLatestBlogPosts, getFeaturedProjects } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Stats from "@/components/sections/Stats";
import Products from "@/components/sections/Products";
import Projects from "@/components/sections/Projects";
import BlogSection from "@/components/sections/BlogSection";
import Certifications from "@/components/sections/Certifications";
import PartnerSection from "@/components/sections/PartnerSection";
import ContactCTA from "@/components/sections/ContactCTA";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const posts = await getLatestBlogPosts(locale as Locale, 3);
  const featuredProjects = await getFeaturedProjects(locale as Locale);

  return (
    <>
      <Hero
        locale={locale as Locale}
        dict={dict}
        backgroundImage="/images/herobg.png"
        size="large"
      />
      <Services locale={locale as Locale} dict={dict} />
      <Stats locale={locale as Locale} dict={dict} />
      <Products locale={locale as Locale} dict={dict} />
      <Projects
        locale={locale as Locale}
        dict={dict}
        featuredProjects={featuredProjects.slice(0, 3).map(p => ({
          title: p.title,
          category: p.category,
          image: p.image,
          slug: p.slug,
        }))}
      />
      <BlogSection locale={locale as Locale} dict={dict} posts={posts} />
      <Certifications locale={locale as Locale} dict={dict} />
      <PartnerSection locale={locale as Locale} dict={dict} />
      <ContactCTA locale={locale as Locale} dict={dict} />
    </>
  );
}
