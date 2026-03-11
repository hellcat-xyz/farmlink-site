import { IndianRupee, Users, TrendingDown, Leaf } from "lucide-react";

const stats = [
  {
    icon: IndianRupee,
    value: "2x",
    label: "More earnings for farmers",
  },
  {
    icon: TrendingDown,
    value: "40%",
    label: "Cheaper for consumers",
  },
  {
    icon: Users,
    value: "0",
    label: "Middlemen needed",
  },
  {
    icon: Leaf,
    value: "100%",
    label: "Farm fresh produce",
  },
];

const ImpactSection = () => {
  return (
    <section id="impact" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Real Impact
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            When farmers sell directly, everyone wins. Similar models like Ninjacart have already proven this works.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20"
            >
              <stat.icon className="h-10 w-10 mx-auto mb-3 text-secondary" />
              <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Price comparison */}
        <div className="mt-16 max-w-2xl mx-auto bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
          <h3 className="text-2xl font-bold text-center mb-6">Price Comparison: Tomato</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xl">
              <span>Farmer sells at market</span>
              <span className="font-bold text-secondary">₹15/kg</span>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span>Retail shop sells</span>
              <span className="font-bold text-destructive-foreground">₹40/kg</span>
            </div>
            <div className="border-t border-primary-foreground/30 my-4" />
            <div className="flex justify-between items-center text-xl">
              <span className="font-bold">With FarmLink</span>
              <span className="font-extrabold text-2xl">₹25/kg ✅</span>
            </div>
            <p className="text-center opacity-80 text-lg">Farmer earns ₹10 more. Customer saves ₹15.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;