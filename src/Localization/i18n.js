import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationDeDE from "./translation-de-DE";
import translationEnEN from "./translation-en-EN";

const resources = {
    "de-DE": {translation: translationDeDE},
    "en-US": {translation: translationEnEN}
};

const lngDetectinOptions = {
    order: ["navigator", "cookie", "localStorage", "querystring", "htmlTag", "path", "subdomain"]
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        detection: lngDetectinOptions,
        fallbackLng: ["de-DE"],
        keySeparator: false,
        interpolation: {
            escapeValue: false
        }
    }, null).then(null, null);

export default i18n;
