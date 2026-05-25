import { generateLocalBusinessSchema } from "@/lib/metadata";
import { type Locale } from "@/i18n/config";

interface StructuredDataProps {
  locale: Locale;
}

export default function StructuredData({ locale }: StructuredDataProps) {
  const localBusinessSchema = generateLocalBusinessSchema(locale);

  return (
    <script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema),
      }}
    />
  );
}
