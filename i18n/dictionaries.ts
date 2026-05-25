import 'server-only';
import { Locale } from './config';

const dictionaries = {
  en: () => import('../messages/en.json').then((module) => module.default),
  de: () => import('../messages/de.json').then((module) => module.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
