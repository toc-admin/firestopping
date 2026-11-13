import Link from "next/link";
import Image from "next/image";
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
        academy: { title: string };
      };
    };
    products: {
      categories: {
        paint: string;
        metalwork: string;
        firestopping: string;
        cladding: string;
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

const NORMS = [
  "EN 1366-3",
  "EN 13381-8",
  "EN 16034",
  "EN 1364-1",
  "ISO 9001",
];

// Footer on the anthracite surface — the site's technical colophon.
export default function Footer({ locale, dict }: FooterProps) {
  const footerNavigation = {
    services: [
      { name: dict.services.items.implementation.title, href: `/${locale}/services/fire-protection-works` },
      { name: dict.services.items.optimization.title, href: `/${locale}/services/cost-optimization` },
      { name: dict.services.items.academy.title, href: `/${locale}/services/fsb-academy` },
    ],
    products: [
      { name: dict.products.categories.paint, href: `/${locale}/products/fire-protection-paint` },
      { name: dict.products.categories.metalwork, href: `/${locale}/products/fire-doors-metalwork` },
      { name: dict.products.categories.firestopping, href: `/${locale}/products/firestopping` },
      { name: dict.products.categories.cladding, href: `/${locale}/products/fire-protection-cladding` },
    ],
    company: [
      { name: dict.navigation.about, href: `/${locale}/about` },
      { name: dict.navigation.projects, href: `/${locale}/projects` },
      { name: dict.navigation.solutions, href: `/${locale}/solutions` },
      { name: dict.navigation.blog, href: `/${locale}/blog` },
      { name: dict.navigation.careers, href: `/${locale}/careers` },
      { name: dict.navigation.contact, href: `/${locale}/contact` },
    ],
  };

  const columns = [
    ["1", dict.footer.servicesTitle, footerNavigation.services],
    ["2", dict.footer.productsTitle, footerNavigation.products],
    ["3", dict.footer.companyTitle, footerNavigation.company],
  ] as const;

  return (
    <footer className="bg-anthracite text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company + contact */}
          <div>
            <Link href={`/${locale}`} className="inline-flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-ink">
                <Image
                  src="/images/logo-fsb.png"
                  alt={dict.common.companyName}
                  width={26}
                  height={26}
                  className="w-[26px] h-[26px] object-contain"
                />
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.18em]">
                {dict.common.companyName}
              </span>
            </Link>
            <p className="mt-5 text-sm text-neutral-400 leading-relaxed">
              {dict.footer.description}
            </p>
            <address className="mt-6 flex flex-col gap-2.5 font-mono text-[12px] not-italic tracking-[0.08em] text-neutral-300">
              <a href="tel:+38513496811" className="hover:text-white transition-colors">
                +385 1 3496 811
              </a>
              <a
                href="mailto:info@fsb-zagreb.hr"
                className="hover:text-white transition-colors"
              >
                info@fsb-zagreb.hr
              </a>
              <span>
                Samoborska cesta 91
                <br />
                10000 Zagreb, {locale === "de" ? "Kroatien" : "Croatia"}
              </span>
              <span>{dict.footer.workingHours}</span>
            </address>
          </div>

          {/* Indexes */}
          {columns.map(([num, title, items]) => (
            <nav key={title} aria-label={title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                {num}.0 / {title}
              </p>
              <ul className="mt-4 border-t border-hairline-dark">
                {items.map((item) => (
                  <li key={item.name} className="border-b border-hairline-dark">
                    <Link
                      href={item.href}
                      className="block py-2.5 text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {title === dict.footer.companyTitle && (
                <>
                  <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                    {dict.footer.partnerTitle}
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li>
                      <a
                        href="https://www.fsb-doors.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-300 hover:text-white transition-colors"
                      >
                        FSB DOORS ↗
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://protupozarna-zastita.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-300 hover:text-white transition-colors"
                      >
                        FSB d.o.o. (HR) ↗
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </nav>
          ))}
        </div>

        {/* Norms strip — the technical signature */}
        <div className="mt-14 pt-6 border-t border-hairline-dark flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400">
          {NORMS.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-hairline-dark flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[11px] tracking-[0.1em] text-neutral-400">
            © {new Date().getFullYear()} {dict.common.companyName} — {dict.footer.copyright}
          </p>
          <div className="flex items-center gap-6 font-mono text-[11px] tracking-[0.1em]">
            <Link
              href={`/${locale}/privacy-policy`}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              {dict.footer.privacyPolicy}
            </Link>
            <Link
              href={`/${locale}/terms-of-use`}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              {dict.footer.termsOfUse}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
