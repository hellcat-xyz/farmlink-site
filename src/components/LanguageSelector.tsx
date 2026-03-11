import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "bn", name: "Bengali" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" }
];

const LanguageSelector = () => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("site_lang");
    if (savedLang) {
      setLang(savedLang);
      changeLanguage(savedLang);
    }

    const addScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false
        },
        "google_translate_element"
      );
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      addScript();
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;

    if (!select) return;

    select.value = langCode;
    select.dispatchEvent(new Event("change"));

    setLang(langCode);
    localStorage.setItem("site_lang", langCode);
  };

  return (
    <div className="flex items-center gap-2">

      <Globe className="h-5 w-5 text-primary" />

      <div className="relative">

        <select
          value={lang}
          onChange={(e) => changeLanguage(e.target.value)}
          className="
          appearance-none
          bg-card
          border
          border-border
          rounded-lg
          px-3
          pr-8
          py-1.5
          text-sm
          text-foreground
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-primary
          "
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>

        <ChevronDown
          className="
          pointer-events-none
          absolute
          right-2
          top-1/2
          -translate-y-1/2
          h-4
          w-4
          text-muted-foreground
          "
        />

      </div>

      <div id="google_translate_element" className="hidden"></div>

    </div>
  );
};

export default LanguageSelector;