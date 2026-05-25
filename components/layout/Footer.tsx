import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n/config";

interface FooterProps {
  locale: Locale;
  dict: {
    navigation: {
      about: string;
      services: string;
      solutions: string;
      projects: string;
      products: string;
      blog: string;
      contact: string;
      careers: string;
    };
    services: {
      items: {
        implementation: { title: string };
        optimization: { title: string };
        education: { title: string };
        testing: { title: string };
      };
    };
    products: {
      categories: {
        sealing: string;
        coatings: string;
        boards: string;
        modules: string;
      };
    };
    footer: {
      description: string;
      servicesTitle: string;
      productsTitle: string;
      companyTitle: string;
      partnerTitle: string;
      workingHours: string;
      copyright: string;
      privacyPolicy: string;
      termsOfUse: string;
    };
    common: {
      companyName: string;
    };
  };
}

export default function Footer({ locale, dict }: FooterProps) {
  const footerNavigation = {
    services: [
      { name: dict.services.items.implementation.title, href: `/${locale}/services/fire-protection-implementation` },
      { name: dict.services.items.optimization.title, href: `/${locale}/services/cost-optimization` },
      { name: dict.services.items.education.title, href: `/${locale}/services/education` },
      { name: dict.services.items.testing.title, href: `/${locale}/services/laboratory-testing` },
    ],
    products: [
      { name: dict.products.categories.sealing, href: `/${locale}/products/fire-sealing` },
      { name: dict.products.categories.coatings, href: `/${locale}/products/fire-coatings` },
      { name: dict.products.categories.boards, href: `/${locale}/products/fire-boards` },
      { name: dict.products.categories.modules, href: `/${locale}/products/fire-modules` },
    ],
    company: [
      { name: dict.navigation.about, href: `/${locale}/about` },
      { name: dict.navigation.projects, href: `/${locale}/projects` },
      { name: dict.navigation.solutions, href: `/${locale}/solutions` },
      { name: dict.navigation.blog, href: `/${locale}/blog` },
      { name: dict.navigation.careers, href: `/${locale}/careers` },
      { name: dict.navigation.contact, href: `/${locale}/contact` },
    ],
    partner: [
      { name: "FSB DOORS", href: "https://www.fsb-doors.com/", external: true },
    ],
  };

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company info */}
          <div>
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/images/logo-fsb.png"
                alt={dict.common.companyName}
                width={150}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
              {dict.footer.description}
            </p>
            <div className="mt-6 space-y-3">
              <a
                href="tel:+38514878515"
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-brand-500" />
                +385 1 4878 515
              </a>
              <a
                href="mailto:info@fsb-protupozarna-zastita.hr"
                className="flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-brand-500" />
                info@fsb-protupozarna-zastita.hr
              </a>
              <div className="flex items-start gap-3 text-sm text-neutral-300">
                <MapPin className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <span>
                  Samoborska Cesta 91B<br />
                  Samoborski Odvojak 1<br />
                  10000 Zagreb, Croatia
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <Clock className="h-4 w-4 text-brand-500" />
                {dict.footer.workingHours}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.servicesTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.productsTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.products.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.companyTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Partner subsection */}
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mt-8">
              {dict.footer.partnerTitle}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNavigation.partner.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} {dict.common.companyName}. {dict.footer.copyright}
            </p>
            <div className="flex items-center gap-6">
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {dict.footer.privacyPolicy}
              </Link>
              <Link
                href={`/${locale}/terms-of-use`}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {dict.footer.termsOfUse}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
