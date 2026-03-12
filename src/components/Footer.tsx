import { Sprout, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-card border-t border-border py-6 z-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold text-primary">
              FarmLink
            </span>
          </div>

          <p className="text-muted-foreground text-center">
            Smart marketplace (tarun) connecting farmers directly with buyers
          </p>

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