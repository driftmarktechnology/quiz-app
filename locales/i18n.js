import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import ta from "./tamil.json";
import english from "./english.json";

// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: english,
  ta: ta,
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

export default i18n;
