import { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import {
  getServiceSlugs,
  getSolutionSlugs,
  getProjectSlugs,
  getProductCategorySlugs,
  getAllProducts,
  getBlogPostSlugs,
  getJobSlugs,
} from "@/lib/content";

const BASE_URL = "https://www.firestopping.eu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  for (const locale of locales) {
    // Static pages
    const staticPages = [
      { path: "", priority: 1, changeFrequency: "weekly" as const },
      { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
      { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
      { path: "/solutions", priority: 0.9, changeFrequency: "weekly" as const },
      { path: "/projects", priority: 0.9, changeFrequency: "weekly" as const },
      { path: "/products", priority: 0.9, changeFrequency: "weekly" as const },
      { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
      { path: "/careers", priority: 0.7, changeFrequency: "weekly" as const },
      { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    ];

    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`])
          ),
        },
      });
    }

    // Service pages
    const serviceSlugs = await getServiceSlugs(locale as Locale);
    for (const slug of serviceSlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/services/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/services/${slug}`])
          ),
        },
      });
    }

    // Solution pages
    const solutionSlugs = await getSolutionSlugs(locale as Locale);
    for (const slug of solutionSlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/solutions/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/solutions/${slug}`])
          ),
        },
      });
    }

    // Project pages
    const projectSlugs = await getProjectSlugs(locale as Locale);
    for (const slug of projectSlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/projects/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/projects/${slug}`])
          ),
        },
      });
    }

    // Product category pages
    const categorySlugs = await getProductCategorySlugs(locale as Locale);
    for (const slug of categorySlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/products/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/products/${slug}`])
          ),
        },
      });
    }

    // Product pages
    const products = await getAllProducts(locale as Locale);
    for (const product of products) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/products/${product.category}/${product.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/products/${product.category}/${product.slug}`])
          ),
        },
      });
    }

    // Blog post pages
    const blogSlugs = await getBlogPostSlugs(locale as Locale);
    for (const slug of blogSlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/blog/${slug}`])
          ),
        },
      });
    }

    // Job pages
    const jobSlugs = await getJobSlugs(locale as Locale);
    for (const slug of jobSlugs) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/careers/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/careers/${slug}`])
          ),
        },
      });
    }
  }

  return sitemapEntries;
}
