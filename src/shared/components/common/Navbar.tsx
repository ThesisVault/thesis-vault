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
import {
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuSeparator,
    DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card } from "../ui/card";

export const Navbar = () => {
  return (
    <div className="bg-[hsl(var(--white))] py-2 px-4 gap-1 flex items-center justify-between mt-2">
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger>
                    <div className="hover:bg-accent hover:text-accent-foreground rounded-md
                                    h-10 w-10 mr-2 flex items-center justify-center">
                        <AlignJustify className="h-6 w-6 text-[hsl(var(--custom-green))]" />
                    </div>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-[hsl(var(--white))]">
                    <div className="py-5">
                        <div className="flex flex-col gap-2">
                            <SheetHeader className="flex items-center justify-center">
                                <SheetTitle>NEU Library</SheetTitle>
                            </SheetHeader>
                            <Separator />
                            <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                <NotebookPen className="text-[hsl(var(--custom-green))]" />
                                <span className="text-[hsl(var(--black))]">Profile</span>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                <Star className="text-[hsl(var(--custom-green))]" />
                                <span className="text-[hsl(var(--black))]">My Library</span>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                <BellRing className="text-[hsl(var(--custom-green))]" />
                                <span className="text-[hsl(var(--black))]">Notifications</span>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                <Lightbulb className="text-[hsl(var(--custom-green))]" />
                                <span className="text-[hsl(var(--black))]">Citation Insights</span>
                            </Button>
                            <Separator />
                            <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                <Lightbulb className="text-[hsl(var(--custom-green))]"/>
                                <span className="text-[hsl(var(--black))]">Some Options</span>
                            </Button>
                            <Separator />
                            <Button variant="ghost" className="flex items-center gap-2 justify-start">
                                <Settings2 className="text-[hsl(var(--custom-green))]"/>
                                <span className="text-[hsl(var(--black))]">Settings</span>
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <Button variant="ghost" className="ml-1 gap-2">
                <NotebookPen className="text-[hsl(var(--custom-green))]" />
                <span className="text-[hsl(var(--black))]">Profile</span>
            </Button>
            <Button variant="ghost" className="gap-2">
                <Star className="text-[hsl(var(--custom-green))]" />
                <span className="text-[hsl(var(--black))]">My Library</span>
            </Button>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full"> 
                <Avatar>
                    <AvatarImage 
                        src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=740&t=st=1727684407~exp=1727685007~hmac=d94e2a5c2e158613a4c66e0b4623ffba571b35d2be28981616569d772951be60" 
                    />
                    <AvatarFallback>NY</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-3 mt-2 w-72 border-[hsl(var(--custom-green))]">
                <span className="absolute mt-2 top-[-10px] right-[25px] w-0 h-0 bg-[hsl(var(--white))]
                                border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent
                                border-b-[15px] border-[hsl(var(--custom-green))]">
                </span>
                <Button variant="ghost"className="w-full h-full flex justify-around h-28">
                    <Avatar className="w-20 h-20">
                        <AvatarImage 
                            src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=740&t=st=1727684407~exp=1727685007~hmac=d94e2a5c2e158613a4c66e0b4623ffba571b35d2be28981616569d772951be60" 
                        />
                        <AvatarFallback>NY</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start ml-4">
                        <span className="text-[hsl(var(--black))]">Username</span>
                        <span className="text-[hsl(var(--black))]">User@gmail.com</span>
                        <span className="text-[hsl(var(--black))] self-center mt-2 font-semibold">Account</span>
                    </div>
                </Button>
                <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
                <Card className="p-2 border-none flex justify-between">
                    <Button size="sm" variant="outline" className="text-[hsl(var(--black))] border-[hsl(var(--border)]">
                        Add Account
                    </Button>
                    <Button size="sm" variant="outline" className="text-[hsl(var(--black))] border-[hsl(var(--border)]">
                        Log Out 
                    </Button>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
};