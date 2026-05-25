"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";

interface HeroProps {
  locale: Locale;
  dict: {
    hero: {
      subtitle: string;
      titleLine1: string;
      titleLine2: string;
      titleLine3: string;
      description: string;
      cta: string;
      learnMore: string;
    };
    stats: {
      yearsExperience: string;
      projects: string;
      certificate: string;
    };
  };
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  size?: "default" | "large";
}

export default function Hero({
  locale,
  dict,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage = "/images/herobg.png",
  size = "default",
}: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const displaySubtitle = subtitle || dict.hero.subtitle;
  const displayDescription = description || dict.hero.description;
  const displayPrimaryCta = primaryCta || {
    text: dict.hero.cta,
    href: `/${locale}/contact`,
  };
  const displaySecondaryCta = secondaryCta || {
    text: dict.hero.learnMore,
    href: `/${locale}/about`,
  };

  return (
    <section
      className={`relative overflow-hidden ${
        size === "large" ? "h-screen" : "h-[70vh] min-h-[500px]"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Fire Protection"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div
              className={`transform transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-brand-400 font-medium text-sm mb-6">
                <span className="w-2 h-2 bg-brand-500 rounded-full" />
                {displaySubtitle}
              </span>
            </div>

            <h1
              className={`font-bold text-white leading-[1.1] tracking-tight transform transition-all duration-700 delay-100 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              } text-4xl md:text-5xl lg:text-6xl`}
            >
              {dict.hero.titleLine1}
              <br />
              <span className="text-gradient">{dict.hero.titleLine2}</span>
              <br />
              {dict.hero.titleLine3}
            </h1>

            <p
              className={`mt-6 text-lg text-neutral-300 leading-relaxed max-w-lg transform transition-all duration-700 delay-200 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {displayDescription}
            </p>

            <div
              className={`mt-8 flex flex-wrap gap-4 transform transition-all duration-700 delay-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <Button href={displayPrimaryCta.href} size="lg" className="group">
                {displayPrimaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                href={displaySecondaryCta.href}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {displaySecondaryCta.text}
              </Button>
            </div>

            {/* Stats row */}
            <div
              className={`mt-12 flex flex-wrap gap-8 transform transition-all duration-700 delay-400 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <div>
                <div className="text-3xl font-bold text-white">30+</div>
                <div className="text-neutral-400 text-sm">{dict.stats.yearsExperience}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">300+</div>
                <div className="text-neutral-400 text-sm">{dict.stats.projects}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">ISO</div>
                <div className="text-neutral-400 text-sm">{dict.stats.certificate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
