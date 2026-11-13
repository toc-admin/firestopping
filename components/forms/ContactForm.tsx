"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { type Locale } from "@/i18n/config";

interface ContactFormProps {
  locale: Locale;
  dict: {
    contact: {
      form: {
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        company: string;
        companyPlaceholder: string;
        message: string;
        messagePlaceholder: string;
        submit: string;
        sending: string;
        success: string;
        error: string;
      };
    };
  };
}

// K1 form idiom: numbered mono labels, square white fields, hairline borders.
const inputClass =
  "w-full px-4 py-3 bg-white border border-hairline focus:border-red outline-none transition-colors";

function FieldLabel({
  htmlFor,
  index,
  children,
  required,
}: {
  htmlFor: string;
  index: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500"
    >
      <span className="text-red">{index}</span> / {children}
      {required && " *"}
    </label>
  );
}

export default function ContactForm({ locale, dict }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate form submission
    // In production, this would send to an API endpoint or email service
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const successMessage = locale === 'de'
    ? { title: "Nachricht gesendet!", description: "Vielen Dank fuer Ihre Anfrage. Wir werden uns so schnell wie moeglich bei Ihnen melden.", button: "Neue Nachricht senden" }
    : { title: "Message sent!", description: "Thank you for your inquiry. We will get back to you as soon as possible.", button: "Send another message" };

  if (status === "success") {
    return (
      <div className="border border-ink bg-white p-8">
        <span className="font-mono text-[12px] text-red">✓</span>
        <h3 className="mt-2 text-xl font-bold tracking-tight">{successMessage.title}</h3>
        <p className="mt-2 text-neutral-600 leading-relaxed">{successMessage.description}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-red hover:underline underline-offset-4"
        >
          {successMessage.button} →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="name" index="01" required>
            {dict.contact.form.name}
          </FieldLabel>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
            placeholder={dict.contact.form.namePlaceholder}
          />
        </div>
        <div>
          <FieldLabel htmlFor="email" index="02" required>
            {dict.contact.form.email}
          </FieldLabel>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            placeholder={dict.contact.form.emailPlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FieldLabel htmlFor="phone" index="03">
            {dict.contact.form.phone}
          </FieldLabel>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
            placeholder={dict.contact.form.phonePlaceholder}
          />
        </div>
        <div>
          <FieldLabel htmlFor="company" index="04">
            {dict.contact.form.company}
          </FieldLabel>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClass}
            placeholder={dict.contact.form.companyPlaceholder}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="message" index="05" required>
          {dict.contact.form.message}
        </FieldLabel>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder={dict.contact.form.messagePlaceholder}
        />
      </div>

      {status === "error" && (
        <div className="border border-red bg-white p-4 font-mono text-[12px] text-red">
          {dict.contact.form.error}
        </div>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? dict.contact.form.sending : dict.contact.form.submit}
      </Button>
    </form>
  );
}
