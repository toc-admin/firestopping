"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { container } from "@/components/site/tokens";

// Stats band — anthracite plane, mono numerals like instrument readouts.
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
    <div
      ref={ref}
      className="font-mono text-4xl md:text-5xl font-semibold text-white"
    >
      {count}
      {suffix}
    </div>
  );
}

export default function Stats({ dict }: StatsProps) {
  const stats = [
    {
      value: 20,
      suffix: "",
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
    <section className="bg-anthracite border-y border-hairline-dark">
      <div className={`${container} grid grid-cols-2 lg:grid-cols-4`}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`py-10 px-6 ${i > 0 ? "border-l border-hairline-dark" : ""}`}
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
