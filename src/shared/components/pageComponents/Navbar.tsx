import { 
  Sheet, 
  SheetTrigger, 
  SheetContent,
  SheetHeader,
  SheetTitle,  
} from "../ui/sheet";
import { 
  AlignJustify, 
  BellRing, 
  Lightbulb, 
  NotebookPen, 
  Settings2, 
  Star 
} from "lucide-react";
import { 
   Avatar,
   AvatarFallback, 
   AvatarImage 
  } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

function Navbar() {
  return (
      <div className="bg-white py-2 px-4 gap-1 flex items-center justify-between mt-2">
          <div className="flex items-center">
              <Sheet>
                  <SheetTrigger>
                      <div className="hover:bg-accent hover:text-accent-foreground rounded-md
                                      h-10 w-10 mr-2 flex items-center justify-center">
                          <AlignJustify className="h-6 w-6 text-[rgba(34,139,34)]" />
                      </div>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64">
                      <div className="py-5">
                          <div className="flex flex-col gap-2">
                              <SheetHeader className="flex items-center justify-center">
                                <SheetTitle>NEU Library</SheetTitle>
                              </SheetHeader>
                              <Separator />
                              <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                  <NotebookPen className="text-[rgba(34,139,34)]" />
                                  <span className="text-black">Profile</span>
                              </Button>
                              <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                  <Star className="text-[rgba(34,139,34)]" />
                                  <span className="text-black">My Library</span>
                              </Button>
                              <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                  <BellRing className="text-[rgba(34,139,34)]" />
                                  <span className="text-black">Notifications</span>
                              </Button>
                              <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                  <Lightbulb className="text-[rgba(34,139,34)]" />
                                  <span className="text-black">Citation Insights</span>
                              </Button>
                              <Separator />
                              <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                  <Lightbulb className="text-[rgba(34,139,34)]"/>
                                  <span className="text-black">Some Options</span>
                              </Button>
                              <Separator />
                              <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                  <Settings2 className="text-[rgba(34,139,34)]"/>
                                  <span className="text-black">Settings</span>
                              </Button>
                          </div>
                      </div>
                  </SheetContent>
              </Sheet>

              <Button variant="ghost" className="ml-1 gap-2">
                  <NotebookPen className="text-[rgba(34,139,34)]" />
                  <span className="text-black">Profile</span>
              </Button>
              <Button variant="ghost" className="gap-2">
                  <Star className="text-[rgba(34,139,34)]" />
                  <span className="text-black">My Library</span>
              </Button>
          </div>

          <Avatar>
              <AvatarImage 
                  src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=740&t=st=1727684407~exp=1727685007~hmac=d94e2a5c2e158613a4c66e0b4623ffba571b35d2be28981616569d772951be60" 
              />
              <AvatarFallback>NY</AvatarFallback>
          </Avatar>
      </div>
  );
}

export default Navbar;
