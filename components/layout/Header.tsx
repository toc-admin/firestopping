"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

interface HeaderProps {
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
    common: {
      openMenu: string;
      closeMenu: string;
      contactUs: string;
    };
  };
}

// Header in the technical-sheet idiom: paper surface, hairline, mono wordmark.
export default function Header({ locale, dict }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: dict.navigation.services, href: `/${locale}/services` },
    { name: dict.navigation.solutions, href: `/${locale}/solutions` },
    { name: dict.navigation.products, href: `/${locale}/products` },
    { name: dict.navigation.projects, href: `/${locale}/projects` },
    { name: dict.navigation.about, href: `/${locale}/about` },
    { name: dict.navigation.blog, href: `/${locale}/blog` },
  ];

  const pathWithoutLocale = pathname.replace(/^\/(en|de)/, "") || "";
  const localeSwitchHref = (target: Locale) => `/${target}${pathWithoutLocale}`;

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3"
          aria-label="FSB d.o.o. — home"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 bg-ink">
            <Image
              src="/images/logo-fsb.png"
              alt=""
              width={26}
              height={26}
              className="w-[26px] h-[26px] object-contain"
              priority
            />
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink hidden md:block">
            FSB — {locale === "de" ? "Brandschutz" : "Fire protection"}
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
          {navigation.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors hover:text-red ${
                  active ? "text-red" : "text-ink"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Language switch as a technical toggle */}
          <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] border border-hairline">
            {(["en", "de"] as const).map((l) => (
              <Link
                key={l}
                href={localeSwitchHref(l)}
                aria-current={locale === l ? "true" : undefined}
                className={`px-2 py-1.5 transition-colors ${
                  locale === l
                    ? "bg-ink text-white"
                    : "text-neutral-500 hover:text-ink"
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </span>

          <Link
            href={`/${locale}/contact`}
            className="px-4 py-2 bg-ink text-white text-sm font-semibold hover:bg-anthracite transition-colors"
          >
            {dict.navigation.contact}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
          className="flex lg:hidden h-10 w-10 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-hairline bg-paper"
        >
          <ul className="px-4 py-4 sm:px-6">
            {navigation.map((item, i) => (
              <li key={item.href} className={i > 0 ? "border-t border-hairline" : ""}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-3.5 text-sm font-medium text-ink"
                >
                  <span className="font-mono text-[10px] text-neutral-400">0{i + 1}</span>
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="border-t border-hairline">
              <Link
                href={`/${locale}/careers`}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-3.5 text-sm font-medium text-ink"
              >
                <span className="font-mono text-[10px] text-neutral-400">
                  0{navigation.length + 1}
                </span>
                {dict.navigation.careers}
              </Link>
            </li>
            <li className="border-t border-hairline py-3.5 flex items-center gap-2">
              {(["en", "de"] as const).map((l) => (
                <Link
                  key={l}
                  href={localeSwitchHref(l)}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] border ${
                    locale === l
                      ? "bg-ink text-white border-ink"
                      : "border-hairline text-neutral-500"
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </li>
            <li className="border-t border-hairline pt-4">
              <Link
                href={`/${locale}/contact`}
                onClick={() => setOpen(false)}
                className="block bg-ink px-4 py-3 text-center text-sm font-semibold text-white"
              >
                {dict.navigation.contact}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
