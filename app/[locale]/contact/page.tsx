import { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import PageHeader from "@/components/sections/PageHeader";
import ContactForm from "@/components/forms/ContactForm";
import Reveal from "@/components/site/Reveal";
import SectionHead from "@/components/site/SectionHead";
import { container, monoLabel } from "@/components/site/tokens";

// Locale-bound UI copy for the K1 layout.
const L10N = {
  en: { map: "Map", locationsNote: "2 locations in Zagreb" },
  de: { map: "Karte", locationsNote: "2 Standorte in Zagreb" },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);

  return {
    title: dict.metadata.contact.title,
    description: dict.metadata.contact.description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        'en': '/en/contact',
        'de': '/de/contact',
      },
    },
  };
}

const locations = [
  {
    name: "FSB d.o.o.",
    address: "Samoborska Cesta 91B",
    city: "10000 Zagreb, Croatia",
    href: "https://maps.google.com/?q=Samoborska+Cesta+91B+Zagreb",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6438.3273898673!2d15.875223!3d45.811062!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d1a0699a9dc5%3A0xf26ff3eba66388d6!2sSamoborska%20cesta%2091B%2C%2010000%2C%20Zagreb%2C%20Croatia!5e1!3m2!1sen!2sus!4v1779105245054!5m2!1sen!2sus",
  },
  {
    name: "FSB SOLUTIONS d.o.o.",
    address: "Samoborski Odvojak 1",
    city: "10000 Zagreb, Croatia",
    href: "https://maps.google.com/?q=Samoborski+Odvojak+1+Zagreb",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6438.34565421049!2d15.875127!3d45.810904!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d1a041da1359%3A0xaf04362b9c99e403!2sSamoborski%20Cesta%20odv.%201%2C%2010000%2C%20Zagreb%2C%20Croatia!5e1!3m2!1sen!2sus!4v1779105234450!5m2!1sen!2sus",
  },
];

// Contact as numbered spec cells + framed maps — K1 direction.
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const t = L10N[loc];

  const contactInfo = [
    {
      title: dict.contact.phone,
      content: "+385 1 4878 515",
      href: "tel:+38514878515",
      description: dict.contact.weekdays,
    },
    {
      title: dict.contact.email,
      content: "info@fsb-fire-protection.com",
      href: "mailto:info@fsb-fire-protection.com",
      description: dict.contact.responseTime,
    },
    {
      title: dict.contact.workingHours,
      content: dict.contact.weekdays,
      description: dict.contact.weekend,
    },
  ];

  return (
    <div className="bg-paper text-ink">
      <PageHeader
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
        description={dict.contact.description}
      />

      <section className={`${container} py-16 md:py-24`}>
        {/* ── 1.0 Contact cells ──────────────────────────── */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-hairline mb-16">
            {contactInfo.map((item, i) => {
              const inner = (
                <div className="p-6 bg-white h-full transition-colors hover:bg-paper">
                  <span className="font-mono text-[11px] text-red">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    <span className="uppercase tracking-[0.14em]">{item.title}</span>
                  </span>
                  <p className="mt-2 font-mono text-[15px] font-semibold text-ink">
                    {item.content}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-sm text-neutral-500">{item.description}</p>
                  )}
                </div>
              );
              return item.href ? (
                <a key={item.title} href={item.href} className="block">
                  {inner}
                </a>
              ) : (
                <div key={item.title}>{inner}</div>
              );
            })}
          </div>
        </Reveal>

        {/* ── 2.0 Form + locations ───────────────────────── */}
        <Reveal>
          <SectionHead
            index="2.0"
            title={dict.contact.sendInquiry}
            note={t.locationsNote}
          />
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Reveal>
            <div>
              <p className="text-neutral-600 mb-6">{dict.contact.inquiryDescription}</p>
              <ContactForm locale={loc} dict={dict} />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <p className="text-neutral-600 mb-6">{dict.contact.locationsDescription}</p>
              <div className="space-y-8">
                {locations.map((location, i) => (
                  <figure key={location.name}>
                    <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                      <span className="text-red">L.{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-semibold text-ink normal-case tracking-normal text-[13px]">
                        {location.name}
                      </span>
                      <span className="text-neutral-400">
                        — {location.address}, {location.city}
                      </span>
                      <a
                        href={location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-neutral-400 hover:text-ink transition-colors"
                      >
                        {t.map} ↗
                      </a>
                    </figcaption>
                    <div className="relative aspect-video border border-hairline bg-white p-1">
                      <iframe
                        src={location.embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${location.name} location`}
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Emergency — ink band ───────────────────────── */}
      <section className="bg-ink text-white">
        <div className={`${container} py-16 md:py-20`}>
          <Reveal>
            <span className={monoLabel}>{dict.contact.emergency.title}</span>
            <p className="mt-5 max-w-xl text-lg text-neutral-300 leading-relaxed">
              {dict.contact.emergency.description}
            </p>
            <a
              href="tel:+38514878515"
              className="mt-8 inline-block px-7 py-3.5 bg-red text-white font-semibold hover:opacity-90 transition-opacity"
            >
              +385 1 4878 515
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
