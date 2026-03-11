import { Sprout, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-card py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold">FarmLink</span>
          </div>

          <p className="text-lg text-card/80 text-center">
            Smart marketplace connecting farmers directly with buyers
          </p>

          <p className="flex items-center gap-1 text-card/60">
            Made with <Heart className="h-4 w-4 text-secondary fill-secondary" /> for Indian Farmers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;