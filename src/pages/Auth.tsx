import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../hooks/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

/* ================================
   EMAIL VERIFICATION SWITCH
================================ */
const REQUIRE_EMAIL_VERIFICATION = false;

type AppRole = "farmer" | "buyer" | "shop";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = (searchParams.get("role") as AppRole) || "farmer";

  const [isSignUp, setIsSignUp] = useState(!!searchParams.get("role"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<AppRole>(defaultRole);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({ user_id: data.user.id, role });

          if (roleError) console.error("Role insert error:", roleError);
        }

        if (REQUIRE_EMAIL_VERIFICATION) {
          toast({
            title: "Account created!",
            description: "Check your email to verify your account.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "You can now log in immediately.",
          });
        }

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        navigate("/");
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: AppRole; label: string; emoji: string }[] = [
    { value: "farmer", label: "Farmer", emoji: "👨‍🌾" },
    { value: "buyer", label: "Consumer", emoji: "🛒" },
    { value: "shop", label: "Shop Owner", emoji: "🏪" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary rounded-full p-3">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <CardTitle className="text-2xl font-extrabold text-primary">
            {isSignUp ? "Join FarmLink" : "Welcome Back"}
          </CardTitle>

          <CardDescription className="text-base">
            {isSignUp
              ? "Create your account to start trading directly"
              : "Sign in to your FarmLink account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-semibold">
                    Full Name
                  </Label>

                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    I am a...
                  </Label>

                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center ${
                          role === r.value
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <span className="text-2xl">{r.emoji}</span>
                        <span className="text-sm font-semibold">{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-semibold">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="h-12 text-base"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>

          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-semibold text-base hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;