import { useState, useCallback } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceButtonProps {
  onResult?: (text: string) => void;
  textToSpeak?: string;
  className?: string;
}

const LANG_MAP: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  pa: "pa-IN",
  or: "or-IN",
  as: "as-IN",
  ur: "ur-IN",
};

const getSelectedLanguage = (): string => {
  // Read language from Google Translate cookie
  const match = document.cookie.match(/googtrans=\/[^/]*\/([a-z]+)/);
  const lang = match ? match[1] : "en";
  return LANG_MAP[lang] || "en-US";
};

const VoiceButton = ({ onResult, textToSpeak, className }: VoiceButtonProps) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSelectedLanguage();
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult?.(text);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  }, [onResult]);

  const speak = useCallback(() => {
    if (!textToSpeak) return;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getSelectedLanguage();
    speechSynthesis.speak(utterance);
  }, [textToSpeak]);

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant={isListening ? "destructive" : "default"}
        size="lg"
        onClick={startListening}
        className="min-h-[56px] min-w-[56px] rounded-full text-lg"
        aria-label="Voice input"
      >
        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
      </Button>
      {textToSpeak && (
        <Button
          variant="outline"
          size="lg"
          onClick={speak}
          className="min-h-[56px] min-w-[56px] rounded-full text-lg border-2 border-primary"
          aria-label="Listen"
        >
          <Volume2 className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default VoiceButton;