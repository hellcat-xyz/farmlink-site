import { useEffect } from "react";
import { Globe } from "lucide-react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LanguageSelector = () => {
  useEffect(() => {
    // Add Google Translate script
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
          includedLanguages:
            "en,hi,ta,te,kn,ml,bn,mr,gu,pa,or,as,ur",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      addScript();
    }
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-primary" />
      <div id="google_translate_element" />
    </div>
  );
};

export default LanguageSelector;