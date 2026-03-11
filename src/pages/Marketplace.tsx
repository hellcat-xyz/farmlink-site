import { useState, useEffect } from "react";
import { supabase } from "../hooks/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Package, IndianRupee, Calendar, Loader2, Filter } from "lucide-react";

interface Crop {
  id: string;
  crop_name: string;
  price_per_kg: number;
  quantity_kg: number;
  location: string;
  created_at: string;
  user_id: string;
}

const Marketplace = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("crops")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setCrops(data);
    setLoading(false);
  };

  const filtered = crops.filter((c) => {
    const matchSearch = c.crop_name.toLowerCase().includes(search.toLowerCase());
    const matchLocation = !locationFilter || c.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchLocation;
  });

  const locations = [...new Set(crops.map((c) => c.location))];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-2">
            🛒 Fresh Crop Marketplace
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse fresh produce directly from farmers near you
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search crops (Tomato, Rice, Onion...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-10 h-12 text-base w-full sm:w-56"
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No crops found</h3>
            <p className="text-lg text-muted-foreground">
              {crops.length === 0
                ? "No crops have been listed yet. Be the first farmer to list!"
                : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4 text-center">{filtered.length} crop{filtered.length !== 1 ? "s" : ""} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filtered.map((crop) => (
                <div
                  key={crop.id}
                  className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-xl transition-all hover:border-primary/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-foreground">🥬 {crop.crop_name}</h3>
                    <span className="bg-primary/10 text-primary font-bold text-lg px-3 py-1 rounded-full">
                      ₹{crop.price_per_kg}/kg
                    </span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-base">{crop.quantity_kg} kg available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-base">{crop.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-base">{formatDate(crop.created_at)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 h-12 text-base font-semibold rounded-xl">
                    📞 Contact Farmer
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Marketplace;