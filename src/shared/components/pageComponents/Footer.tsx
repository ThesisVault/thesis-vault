import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

function Footer() {
  return (
    <div>
      <Card className="flex justify-between w-full bg-[rgba(34,139,34,1)] rounded-none">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-gray-100 group"
          >
            <Globe className="text-black group-hover:text-[rgba(34,139,34,1)]" />
            <span className="text-black group-hover:text-[rgba(34,139,34,1)]">EN</span>
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-gray-100 group"
          >
            <span className="text-black group-hover:text-[rgba(34,139,34,1)]">Privacy</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-gray-100 group"
          >
            <span className="text-black group-hover:text-[rgba(34,139,34,1)]">Terms</span>
          </Button>
          <Button
            variant="ghost"
            className="gap-1 m-0 transition-colors duration-300 hover:bg-gray-100 group"
          >
            <span className="text-black group-hover:text-[rgba(34,139,34,1)]">Help</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Footer;
