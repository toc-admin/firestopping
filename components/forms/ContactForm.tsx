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
        subject: string;
        subjectPlaceholder: string;
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

export default function ContactForm({ locale, dict }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
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
        subject: "",
        message: "",
      });
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const subjectOptions = locale === 'de'
    ? [
        { value: "implementation", label: "Ausfuehrung von Arbeiten" },
        { value: "optimization", label: "Kostenoptimierung" },
        { value: "education", label: "Schulung" },
        { value: "laboratory", label: "Laborpruefung" },
        { value: "products", label: "Produkte" },
        { value: "other", label: "Sonstiges" },
      ]
    : [
        { value: "implementation", label: "Implementation work" },
        { value: "optimization", label: "Cost optimization" },
        { value: "education", label: "Training" },
        { value: "laboratory", label: "Laboratory testing" },
        { value: "products", label: "Products" },
        { value: "other", label: "Other" },
      ];

  const successMessage = locale === 'de'
    ? { title: "Nachricht gesendet!", description: "Vielen Dank fuer Ihre Anfrage. Wir werden uns so schnell wie moeglich bei Ihnen melden.", button: "Neue Nachricht senden" }
    : { title: "Message sent!", description: "Thank you for your inquiry. We will get back to you as soon as possible.", button: "Send another message" };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">{successMessage.title}</h3>
        <p className="text-green-700">
          {successMessage.description}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-green-600 font-medium hover:text-green-700"
        >
          {successMessage.button}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
            {dict.contact.form.name} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            placeholder={dict.contact.form.namePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
            {dict.contact.form.email} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            placeholder={dict.contact.form.emailPlaceholder}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
            {dict.contact.form.phone}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            placeholder={dict.contact.form.phonePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
            {dict.contact.form.company}
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            placeholder={dict.contact.form.companyPlaceholder}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
          {dict.contact.form.subject} *
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
        >
          <option value="">{dict.contact.form.subjectPlaceholder}</option>
          {subjectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
          {dict.contact.form.message} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-neutral-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none"
          placeholder={dict.contact.form.messagePlaceholder}
        />
      </div>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {dict.contact.form.error}
        </div>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? dict.contact.form.sending : dict.contact.form.submit}
      </Button>
    </form>
  );
}
