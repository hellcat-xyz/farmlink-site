import { useState } from "react";
import { Button } from "@/components/ui/button";
import VoiceButton from "./VoiceButton";
import { MapPin, Package, IndianRupee, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../hooks/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DemoSection = () => {
  const [crop, setCrop] = useState("Tomato");
  const [price, setPrice] = useState("18");
  const [quantity, setQuantity] = useState("200");
  const [location, setLocation] = useState("Villupuram");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVoiceResult = (text: string) => {
    setCrop(text);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate("/auth?role=farmer");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("crops").insert({
        user_id: user.id,
        crop_name: crop,
        price_per_kg: parseFloat(price),
        quantity_kg: parseFloat(quantity),
        location,
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Crop listed successfully! 🎉" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Try It Now
          </h2>
          <p className="text-xl text-muted-foreground">
            {user ? "List your crops for buyers to find" : "Sign in to list your crops, or try the demo"}
          </p>
        </div>

        <div className="max-w-lg mx-auto bg-background rounded-2xl p-8 shadow-xl border-2 border-primary/20">
          {!submitted ? (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-foreground mb-2">
                  🥬 Crop Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="flex-1 min-h-[56px] text-xl px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none"
                    placeholder="Enter crop name"
                  />
                  <VoiceButton onResult={handleVoiceResult} />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold text-foreground mb-2">
                  💰 Price (₹/kg)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full min-h-[56px] text-xl px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-foreground mb-2">
                  📦 Quantity (kg)
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full min-h-[56px] text-xl px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-lg font-bold text-foreground mb-2">
                  📍 Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full min-h-[56px] text-xl px-4 rounded-xl border-2 border-input bg-background text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full min-h-[64px] text-xl rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {user ? "📤 List My Crop" : "📤 Sign In & List"}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-6xl">✅</div>
              <h3 className="text-2xl font-bold text-foreground">Crop Listed!</h3>
              <div className="bg-muted rounded-xl p-6 text-left space-y-3">
                <div className="flex items-center gap-3 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{crop}</span> – {quantity}kg
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <IndianRupee className="h-5 w-5 text-secondary" />
                  <span className="font-semibold">₹{price}/kg</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <span>Harvested today</span>
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                🔔 Your crop is now visible to nearby buyers!
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setSubmitted(false)}
                className="min-h-[56px] text-lg rounded-xl border-2 border-primary text-primary"
              >
                List Another Crop
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DemoSection;