import { Menu, X, LogIn, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b-2 border-primary/20 shadow-sm">
      <div className="container flex items-center justify-between py-3">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          {/* Replaced Sprout icon with your JPG */}
          <img
            src="../public/logo.jpg"
            alt="GreenLink Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-extrabold text-primary">GreenLink</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">

        <Link
          to="/marketplace"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          Marketplace
        </Link>

        {user && (
          <Link
            to="/dashboard"
            className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
          >
            My Crops
          </Link>
        )}

        <a
          href="/#how-it-works"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
        >
          How It Works
        </a>

        <LanguageSelector />

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {user ? (
          <Button
            variant="outline"
            onClick={signOut}
            className="h-12 text-base font-semibold gap-2"
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        ) : (
          <Link to="/auth">
            <Button className="h-12 text-base font-semibold gap-2">
              <LogIn className="h-5 w-5" /> Sign In
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 rounded-lg text-foreground"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        {menuOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <Menu className="h-7 w-7" />
        )}
      </button>
    </div>

      {/* Mobile menu */ }
  {
    menuOpen && (
      <div className="md:hidden bg-card border-t border-border p-4 space-y-4">

        <Link
          to="/marketplace"
          className="block text-xl font-semibold py-3 text-foreground"
          onClick={() => setMenuOpen(false)}
        >
          Marketplace
        </Link>

        {user && (
          <Link
            to="/dashboard"
            className="block text-xl font-semibold py-3 text-foreground"
            onClick={() => setMenuOpen(false)}
          >
            My Crops
          </Link>
        )}

        <a
          href="/#how-it-works"
          className="block text-xl font-semibold py-3 text-foreground"
          onClick={() => setMenuOpen(false)}
        >
          How It Works
        </a>

        <LanguageSelector />

        {/* Theme Toggle Mobile */}
        <Button
          variant="outline"
          onClick={toggleTheme}
          className="w-full h-14 text-lg font-semibold gap-2"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" /> Dark Mode
            </>
          )}
        </Button>

        {user ? (
          <Button
            variant="outline"
            onClick={() => {
              signOut();
              setMenuOpen(false);
            }}
            className="w-full h-14 text-lg font-semibold gap-2"
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        ) : (
          <Link to="/auth" onClick={() => setMenuOpen(false)}>
            <Button className="w-full h-14 text-lg font-semibold gap-2">
              <LogIn className="h-5 w-5" /> Sign In
            </Button>
          </Link>
        )}
      </div>
    )
  }
    </nav >
  );
};

export default Navbar;