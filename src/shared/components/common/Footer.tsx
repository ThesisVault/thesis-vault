import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const Footer = () => {
  return (
    <div>
      <Card className="flex justify-between w-full bg-[hsl(var(--custom-green))] rounded-none">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-[hsl(var(--white))] group"
          >
            <Globe className="text-[hsl(var(--black))] group-hover:text-[hsl(var(--custom-green))]" />
            <span className="text-[hsl(var(--black))] group-hover:text-[hsl(var(--custom-green))]">EN</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-[hsl(var(--white))] group"
          >
            <span className="text-[hsl(var(--black))] group-hover:text-[hsl(var(--custom-green))]">Privacy</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-[hsl(var(--white))] group"
          >
            <span className="text-[hsl(var(--black))] group-hover:text-[hsl(var(--custom-green))]">Terms</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-[hsl(var(--white))] group"
          >
            <span className="text-[hsl(var(--black))] group-hover:text-[hsl(var(--custom-green))]">Help</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};