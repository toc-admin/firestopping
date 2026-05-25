"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

interface StatsProps {
  locale: Locale;
  dict: {
    stats: {
      yearsExperience: string;
      projects: string;
      experts: string;
      quality: string;
    };
  };
  variant?: "default" | "dark";
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="text-5xl md:text-6xl font-bold text-white">
      {count}
      {suffix}
    </div>
  );
}

export default function Stats({ locale, dict, variant = "default" }: StatsProps) {
  const stats = [
    {
      value: 30,
      suffix: "+",
      label: dict.stats.yearsExperience,
    },
    {
      value: 300,
      suffix: "+",
      label: dict.stats.projects,
    },
    {
      value: 10,
      suffix: "+",
      label: dict.stats.experts,
    },
    {
      value: 100,
      suffix: "%",
      label: dict.stats.quality,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-brand-500 to-brand-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-white/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
