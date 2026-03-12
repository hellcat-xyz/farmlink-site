import { TrendingUp, MapPin, Calculator, Star, Mic, Globe } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "AI Price Recommendation(In progress)",
    description: "Get fair price suggestions based on real market data. No more guessing!",
    color: "bg-primary",
  },
  {
    icon: MapPin,
    title: "Nearby Buyer Matching(In progress)",
    description: "Find restaurants, shops and consumers near you automatically.",
    color: "bg-secondary",
  },
  {
    icon: Calculator,
    title: "Profit Calculator (In progress)",
    description: "Know your production cost, expected profit, and best selling price.",
    color: "bg-primary",
  },
  {
    icon: Star,
    title: "Trust & Ratings",
    description: "Buyers rate farmers. Farmers rate buyers. Build trust together.",
    color: "bg-secondary",
  },
  {
    icon: Mic,
    title: "Voice Support",
    description: "Speak in your language. No typing needed. Works even on basic phones.",
    color: "bg-primary",
  },
  {
    icon: Globe,
    title: "All Indian Languages",
    description: "Tamil, Hindi, Telugu, Kannada, Bengali, Marathi and more. Use in your mother tongue.",
    color: "bg-secondary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            Made for Indian Farmers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, powerful features designed for rural accessibility
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-xl transition-all group cursor-default"
            >
              <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;