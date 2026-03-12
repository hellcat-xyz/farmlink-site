import { ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-farmer.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Indian farmer with fresh vegetables"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
      </div>

      <div className="container relative z-10 py-16 md:py-28 px-4">
        <div className="max-w-2xl space-y-6 animate-fade-up">
          <div className="inline-block bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-full text-lg font-bold">
             Fresh From Farm | Best Prices
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-card leading-tight">
            Sell Your Crops
            <br />
            <span className="text-secondary">Directly to Buyers</span>
          </h1>

          <p className="text-xl md:text-2xl text-card/90 leading-relaxed max-w-xl">
            GreenLink connects farmers with shops and consumers. Get better prices for your harvest. Simple to use, works in your language.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth?role=farmer")}
              className="min-h-[64px] text-xl px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              I am a Farmer <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/marketplace")}
              className="min-h-[64px] text-xl px-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg"
            >
              I want to Buy <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-full px-4 py-2 border border-card/30">
              <Mic className="h-5 w-5 text-secondary" />
              <span className="text-card text-lg">Voice support available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;