import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="rounded-full p-2 overflow-hidden">
              <img 
                src="/logo.jpg"
                alt="GreenLink Logo"
                className="h-6 w-6 object-contain"
              />
            </div>
            <span className="text-xl font-extrabold text-primary">
              GreenLink
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-center">
            Smart marketplace connecting farmers directly with buyers
          </p>

          {/* Credits */}
          <p className="flex items-center gap-1 text-muted-foreground">
            Made with
            <Heart className="h-4 w-4 text-secondary fill-secondary" />
            for farmers
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;