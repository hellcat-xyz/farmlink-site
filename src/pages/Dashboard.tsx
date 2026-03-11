import { useState, useEffect } from "react";
import { supabase } from "../hooks/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit2, Plus, Package, MapPin } from "lucide-react";
import VoiceButton from "@/components/VoiceButton";

interface Crop {
  id: string;
  crop_name: string;
  price_per_kg: number;
  quantity_kg: number;
  location: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    crop_name: "",
    price_per_kg: "",
    quantity_kg: "",
    location: "",
  });

  const [showAdd, setShowAdd] = useState(false);

  const [addForm, setAddForm] = useState({
    crop_name: "",
    price_per_kg: "",
    quantity_kg: "",
    location: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?role=farmer");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchCrops();
  }, [user]);

  const fetchCrops = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("crops")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (!error && data) setCrops(data);

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("crops").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setCrops((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Crop deleted ✅" });
    }
  };

  const startEdit = (crop: Crop) => {
    setEditingId(crop.id);
    setEditForm({
      crop_name: crop.crop_name,
      price_per_kg: String(crop.price_per_kg),
      quantity_kg: String(crop.quantity_kg),
      location: crop.location,
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setSaving(true);

    const { error } = await supabase
      .from("crops")
      .update({
        crop_name: editForm.crop_name,
        price_per_kg: parseFloat(editForm.price_per_kg),
        quantity_kg: parseFloat(editForm.quantity_kg),
        location: editForm.location,
      })
      .eq("id", editingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Crop updated ✅" });
      setEditingId(null);
      fetchCrops();
    }

    setSaving(false);
  };

  const handleAdd = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase.from("crops").insert({
      user_id: user.id,
      crop_name: addForm.crop_name,
      price_per_kg: parseFloat(addForm.price_per_kg),
      quantity_kg: parseFloat(addForm.quantity_kg),
      location: addForm.location,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Crop added! 🎉" });

      setShowAdd(false);
      setAddForm({
        crop_name: "",
        price_per_kg: "",
        quantity_kg: "",
        location: "",
      });

      fetchCrops();
    }

    setSaving(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                👨‍🌾 My Crops
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your listed produce
              </p>
            </div>

            <Button
              onClick={() => setShowAdd(true)}
              className="h-12 text-base font-semibold gap-2"
            >
              <Plus className="h-5 w-5" /> Add New Crop
            </Button>
          </div>

          {showAdd && (
            <div className="max-w-lg mx-auto mb-8 bg-card rounded-2xl p-6 shadow-lg border-2 border-primary/20">
              <h3 className="text-xl font-bold mb-4">Add New Crop</h3>

              <div className="space-y-3">

                <div className="flex gap-2">
                  <Input
                    placeholder="Crop name"
                    value={addForm.crop_name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, crop_name: e.target.value })
                    }
                    className="h-12 text-base"
                  />

                  <VoiceButton
                    onResult={(text) =>
                      setAddForm({ ...addForm, crop_name: text })
                    }
                  />
                </div>

                <Input
                  type="number"
                  placeholder="Price ₹/kg"
                  value={addForm.price_per_kg}
                  onChange={(e) =>
                    setAddForm({ ...addForm, price_per_kg: e.target.value })
                  }
                  className="h-12 text-base"
                />

                <Input
                  type="number"
                  placeholder="Quantity (kg)"
                  value={addForm.quantity_kg}
                  onChange={(e) =>
                    setAddForm({ ...addForm, quantity_kg: e.target.value })
                  }
                  className="h-12 text-base"
                />

                <Input
                  placeholder="Location"
                  value={addForm.location}
                  onChange={(e) =>
                    setAddForm({ ...addForm, location: e.target.value })
                  }
                  className="h-12 text-base"
                />

                <div className="flex gap-2">

                  <Button
                    onClick={handleAdd}
                    disabled={saving || !addForm.crop_name}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Crop
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowAdd(false)}
                    className="h-12 text-base"
                  >
                    Cancel
                  </Button>

                </div>

              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : crops.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                No crops listed yet
              </h3>

              <p className="text-lg text-muted-foreground mb-6">
                Start by adding your first crop listing
              </p>

              <Button
                onClick={() => setShowAdd(true)}
                className="h-12 text-base font-semibold gap-2"
              >
                <Plus className="h-5 w-5" /> Add Your First Crop
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">

              {crops.map((crop) => (

                <div
                  key={crop.id}
                  className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-xl transition-all"
                >

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-foreground">
                      🥬 {crop.crop_name}
                    </h3>

                    <span className="bg-primary/10 text-primary font-bold text-base px-3 py-1 rounded-full">
                      ₹{crop.price_per_kg}/kg
                    </span>
                  </div>

                  <div className="space-y-2 text-muted-foreground mb-4">

                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {crop.quantity_kg} kg
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {crop.location}
                    </div>

                  </div>

                  <div className="flex gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(crop)}
                      className="flex-1 gap-1"
                    >
                      <Edit2 className="h-4 w-4" /> Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(crop.id)}
                      className="gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>
      </main>

      <Footer />

    </div>
  );
};

export default Dashboard;