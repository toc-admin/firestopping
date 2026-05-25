import Image from "next/image";
import type { Locale } from "@/i18n/config";

interface DirectorProps {
  locale: Locale;
  dict: {
    director: {
      label: string;
      name: string;
      title: string;
      bio1: string;
      bio2: string;
      bio3: string;
    };
  };
}

export default function Director({ locale, dict }: DirectorProps) {
  return (
    <section className="py-20 md:py-28 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-brand-500 rounded-2xl transform rotate-3" />
            <div className="relative h-full bg-neutral-200 rounded-2xl overflow-hidden">
              <Image
                src="/images/team/direktor.jpg"
                alt={dict.director.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-wider mb-2">
              {dict.director.label}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              {dict.director.name}
            </h2>
            <p className="mt-2 text-lg text-neutral-600">
              {dict.director.title}
            </p>
            <div className="mt-6 space-y-4 text-neutral-600">
              <p>{dict.director.bio1}</p>
              <p>{dict.director.bio2}</p>
              <p>{dict.director.bio3}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
