import { useState, useRef, useCallback } from "react";
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
  const match = document.cookie.match(/googtrans=\/[^/]*\/([a-z]+)/);
  const lang = match ? match[1] : "en";
  return LANG_MAP[lang] || "en-US";
};

const VoiceButton = ({ onResult, textToSpeak, className }: VoiceButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is only supported in Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();

    recognition.lang = getSelectedLanguage();
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult?.(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [onResult]);

  const speak = useCallback(() => {
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = getSelectedLanguage();
    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [textToSpeak]);

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <Button
        variant={isListening ? "destructive" : "default"}
        size="icon"
        onClick={startListening}
        className="h-12 w-12 rounded-full"
        aria-label="Voice input"
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      {textToSpeak && (
        <Button
          variant="outline"
          size="icon"
          onClick={speak}
          className="h-12 w-12 rounded-full"
          aria-label="Listen"
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default VoiceButton;