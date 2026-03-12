import { useState, useEffect } from "react";
import { supabase } from "../hooks//integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Package, Calendar, Loader2, ShoppingCart, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Crop {
  id: string;
  crop_name: string;
  price_per_kg: number;
  quantity_kg: number;
  location: string;
  created_at: string;
  user_id: string;
}

interface CartItem {
  crop: Crop;
  qty: number;
}

const UPI_OPTIONS = [
  { id: "gpay", label: "Google Pay", icon: "💳" },
  { id: "phonepe", label: "PhonePe", icon: "📱" },
  { id: "paytm", label: "Paytm", icon: "💰" },
  { id: "bhim", label: "BHIM UPI", icon: "🏦" },
];

const Marketplace = () => {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const addToCart = (crop: Crop) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.crop.id === crop.id);
      if (existing) {
        return prev.map((i) => i.crop.id === crop.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { crop, qty: 1 }];
    });
    toast.success(`${crop.crop_name} added to cart`);
  };

  const removeFromCart = (cropId: string) => {
    setCart((prev) => prev.filter((i) => i.crop.id !== cropId));
  };

  const updateQty = (cropId: string, qty: number) => {
    if (qty < 1) return removeFromCart(cropId);
    setCart((prev) => prev.map((i) => i.crop.id === cropId ? { ...i, qty } : i));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.crop.price_per_kg * i.qty, 0);

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      return;
    }
    if (cart.length === 0) return;

    setPlacingOrder(true);
    const orders = cart.map((item) => ({
      user_id: user.id,
      crop_id: item.crop.id,
      crop_name: item.crop.crop_name,
      quantity_kg: item.qty,
      total_price: item.crop.price_per_kg * item.qty,
      payment_method: selectedUpi,
      status: "placed",
    }));

    const { error } = await supabase.from("orders").insert(orders);
    setPlacingOrder(false);

    if (error) {
      toast.error("Failed to place order. Please try again.");
      return;
    }

    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCart(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Floating Cart Button */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:bg-primary/90 transition-all"
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cart.reduce((s, i) => s + i.qty, 0)}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="bg-black/40 flex-1" onClick={() => setShowCart(false)} />
          <div className="w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Your Cart
              </h2>
              <button onClick={() => setShowCart(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {orderPlaced ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <CheckCircle className="h-16 w-16 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Order Placed! 🎉</h3>
                <p className="text-muted-foreground text-center">
                  Your order has been placed successfully via {UPI_OPTIONS.find(u => u.id === selectedUpi)?.label}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.crop.id} className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.crop.crop_name}</h4>
                          <p className="text-sm text-muted-foreground">₹{item.crop.price_per_kg}/kg</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateQty(item.crop.id, item.qty - 1)}>-</Button>
                          <span className="w-8 text-center font-semibold text-foreground">{item.qty}</span>
                          <Button size="sm" variant="outline" onClick={() => updateQty(item.crop.id, item.qty + 1)}>+</Button>
                        </div>
                        <button onClick={() => removeFromCart(item.crop.id)}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-border p-4 space-y-4">
                    {/* UPI Payment Selection */}
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">Pay via UPI</p>
                      <div className="grid grid-cols-2 gap-2">
                        {UPI_OPTIONS.map((upi) => (
                          <button
                            key={upi.id}
                            onClick={() => setSelectedUpi(upi.id)}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                              selectedUpi === upi.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <span>{upi.icon}</span>
                            <span>{upi.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total & Place Order */}
                    <div className="flex items-center justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full h-12 text-base font-semibold rounded-xl"
                      onClick={placeOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Placing Order...</>
                      ) : (
                        "✅ Place Order"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
                  <Button
                    className="w-full mt-4 h-12 text-base font-semibold rounded-xl"
                    onClick={() => addToCart(crop)}
                  >
                    🛒 Add to Cart
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