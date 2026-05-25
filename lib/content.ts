import type { Locale } from "@/i18n/config";

// Types
export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription: string;
  image: string;
  features: string[];
  icon: string;
}

export interface Solution {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  specifications: {
    fireResistance: string;
    standard: string;
    application: string;
  };
  category: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  scope: string[];
  image: string;
  gallery: string[];
  featured: boolean;
}

export interface ProductCategory {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export interface Product {
  slug: string;
  category: string;
  title: string;
  manufacturer: string;
  description: string;
  fullDescription: string;
  specifications: Record<string, string>;
  image: string;
  datasheet?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  featured: boolean;
}

export interface Job {
  slug: string;
  title: string;
  type: string;
  location: string;
  department: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  active: boolean;
}

export interface Company {
  name: string;
  description: string;
}

// Content loaders - dynamically load based on locale
const contentLoaders = {
  services: {
    en: () => import("@/content/en/services.json").then((m) => m.default),
    de: () => import("@/content/de/services.json").then((m) => m.default),
  },
  solutions: {
    en: () => import("@/content/en/solutions.json").then((m) => m.default),
    de: () => import("@/content/de/solutions.json").then((m) => m.default),
  },
  projects: {
    en: () => import("@/content/en/projects.json").then((m) => m.default),
    de: () => import("@/content/de/projects.json").then((m) => m.default),
  },
  products: {
    en: () => import("@/content/en/products.json").then((m) => m.default),
    de: () => import("@/content/de/products.json").then((m) => m.default),
  },
  blog: {
    en: () => import("@/content/en/blog.json").then((m) => m.default),
    de: () => import("@/content/de/blog.json").then((m) => m.default),
  },
  careers: {
    en: () => import("@/content/en/careers.json").then((m) => m.default),
    de: () => import("@/content/de/careers.json").then((m) => m.default),
  },
};

// Services
export async function getAllServices(locale: Locale): Promise<Service[]> {
  const data = await contentLoaders.services[locale]();
  return data.services;
}

export async function getServiceBySlug(locale: Locale, slug: string): Promise<Service | undefined> {
  const data = await contentLoaders.services[locale]();
  return data.services.find((service: Service) => service.slug === slug);
}

export async function getServiceSlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.services[locale]();
  return data.services.map((service: Service) => service.slug);
}

// Solutions
export async function getAllSolutions(locale: Locale): Promise<Solution[]> {
  const data = await contentLoaders.solutions[locale]();
  return data.solutions;
}

export async function getSolutionBySlug(locale: Locale, slug: string): Promise<Solution | undefined> {
  const data = await contentLoaders.solutions[locale]();
  return data.solutions.find((solution: Solution) => solution.slug === slug);
}

export async function getSolutionSlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.solutions[locale]();
  return data.solutions.map((solution: Solution) => solution.slug);
}

// Projects
export async function getAllProjects(locale: Locale): Promise<Project[]> {
  const data = await contentLoaders.projects[locale]();
  return data.projects;
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  const data = await contentLoaders.projects[locale]();
  return data.projects.filter((project: Project) => project.featured);
}

export async function getProjectBySlug(locale: Locale, slug: string): Promise<Project | undefined> {
  const data = await contentLoaders.projects[locale]();
  return data.projects.find((project: Project) => project.slug === slug);
}

export async function getProjectSlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.projects[locale]();
  return data.projects.map((project: Project) => project.slug);
}

export async function getProjectCategories(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.projects[locale]();
  const categories = data.projects.map((project: Project) => project.category);
  return [...new Set(categories)];
}

// Products
export async function getAllProductCategories(locale: Locale): Promise<ProductCategory[]> {
  const data = await contentLoaders.products[locale]();
  return data.categories;
}

export async function getProductCategoryBySlug(locale: Locale, slug: string): Promise<ProductCategory | undefined> {
  const data = await contentLoaders.products[locale]();
  return data.categories.find((category: ProductCategory) => category.slug === slug);
}

export async function getProductCategorySlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.products[locale]();
  return data.categories.map((category: ProductCategory) => category.slug);
}

export async function getAllProducts(locale: Locale): Promise<Product[]> {
  const data = await contentLoaders.products[locale]();
  return data.products as unknown as Product[];
}

export async function getProductsByCategory(locale: Locale, categorySlug: string): Promise<Product[]> {
  const data = await contentLoaders.products[locale]();
  const products = data.products as unknown as Product[];
  return products.filter((product) => product.category === categorySlug);
}

export async function getProductBySlug(locale: Locale, slug: string): Promise<Product | undefined> {
  const data = await contentLoaders.products[locale]();
  const products = data.products as unknown as Product[];
  return products.find((product) => product.slug === slug);
}

export async function getProductSlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.products[locale]();
  const products = data.products as unknown as Product[];
  return products.map((product) => product.slug);
}

export async function getProductWithCategory(
  locale: Locale,
  categorySlug: string,
  productSlug: string
): Promise<Product | undefined> {
  const data = await contentLoaders.products[locale]();
  const products = data.products as unknown as Product[];
  return products.find(
    (product) => product.category === categorySlug && product.slug === productSlug
  );
}

// Blog Posts
export async function getAllBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const data = await contentLoaders.blog[locale]();
  return data.posts;
}

export async function getLatestBlogPosts(locale: Locale, count: number = 3): Promise<BlogPost[]> {
  const data = await contentLoaders.blog[locale]();
  return [...data.posts]
    .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export async function getBlogPostBySlug(locale: Locale, slug: string): Promise<BlogPost | undefined> {
  const data = await contentLoaders.blog[locale]();
  return data.posts.find((post: BlogPost) => post.slug === slug);
}

export async function getBlogPostSlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.blog[locale]();
  return data.posts.map((post: BlogPost) => post.slug);
}

export async function getBlogCategories(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.blog[locale]();
  const categories = data.posts.map((post: BlogPost) => post.category);
  return [...new Set(categories)];
}

export async function getFeaturedBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const data = await contentLoaders.blog[locale]();
  return data.posts.filter((post: BlogPost) => post.featured);
}

// Jobs / Careers
export async function getAllJobs(locale: Locale): Promise<Job[]> {
  const data = await contentLoaders.careers[locale]();
  return data.jobs;
}

export async function getActiveJobs(locale: Locale): Promise<Job[]> {
  const data = await contentLoaders.careers[locale]();
  return data.jobs.filter((job: Job) => job.active);
}

export async function getJobBySlug(locale: Locale, slug: string): Promise<Job | undefined> {
  const data = await contentLoaders.careers[locale]();
  return data.jobs.find((job: Job) => job.slug === slug);
}

export async function getJobSlugs(locale: Locale): Promise<string[]> {
  const data = await contentLoaders.careers[locale]();
  return data.jobs.map((job: Job) => job.slug);
}

export async function getCompanies(locale: Locale): Promise<Company[]> {
  const data = await contentLoaders.careers[locale]();
  return data.companies;
}

export async function getCareerContactEmail(locale: Locale): Promise<string> {
  const data = await contentLoaders.careers[locale]();
  return data.contactEmail;
}
