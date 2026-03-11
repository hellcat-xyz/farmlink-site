import iconFarmer from "@/assets/icon-farmer.png";
import iconShop from "@/assets/icon-shop.png";
import iconConsumer from "@/assets/icon-consumer.png";

const steps = [
  {
    icon: iconFarmer,
    title: "Farmer Uploads Crops",
    description: "Upload vegetable type, quantity, price and harvest date. Example: Tomato – ₹18/kg – 500kg",
    step: "1",
  },
  {
    icon: iconShop,
    title: "Shops Find Nearby Farmers",
    description: "See nearby farmers, compare prices, check freshness ratings. Order directly!",
    step: "2",
  },
  {
    icon: iconConsumer,
    title: "Fresh Delivery",
    description: "Pick up from local points, shared delivery van, or local logistics. Fresh from farm to table!",
    step: "3",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-card">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps. No middlemen. Better prices for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative bg-background rounded-2xl p-8 text-center shadow-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-xl group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                {step.step}
              </div>
              <img
                src={step.icon}
                alt={step.title}
                className="w-24 h-24 mx-auto mt-4 mb-4 object-contain group-hover:scale-110 transition-transform"
              />
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;