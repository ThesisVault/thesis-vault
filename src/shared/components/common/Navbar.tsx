import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { AlignJustify, BellRing, Lightbulb, NotebookPen, Settings2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export const Navbar = () => {
	return (
		<div className="bg-background py-2 px-4 gap-1 flex items-center justify-between mt-2">
			<div className="flex items-center">
				<Sheet>
					<SheetTrigger>
						<div
							data-testid="sheet-trigger"
							className="hover:bg-accent rounded-md
                                    h-10 w-10 mr-2 flex items-center justify-center"
						>
							<AlignJustify className="h-6 w-6 text-primary" />
						</div>
					</SheetTrigger>
					<SheetContent side="left">
						<div className="py-5">
							<div className="flex flex-col gap-2">
								<SheetHeader className="flex items-center justify-center">
									<SheetTitle>NEU Library</SheetTitle>
								</SheetHeader>
								<Separator />
								<Button variant="ghost" className="flex items-center gap-2 justify-start">
									<NotebookPen className="text-primary" />
									<span>Profile</span>
								</Button>
								<Button variant="ghost" className="flex items-center gap-2 justify-start">
									<Star className="text-primary" />
									<span>My Library</span>
								</Button>
								<Button variant="ghost" className="flex items-center gap-2 justify-start">
									<BellRing className="text-primary" />
									<span>Notifications</span>
								</Button>
								<Button variant="ghost" className="flex items-center gap-2 justify-start">
									<Lightbulb className="text-primary" />
									<span>Citation Insights</span>
								</Button>
								<Separator />
								<Button variant="ghost" className="flex items-center gap-2 justify-start">
									<Lightbulb className="text-primary" />
									<span>Some Options</span>
								</Button>
								<Separator />
								<Button variant="ghost" className="flex items-center gap-2 justify-start">
									<Settings2 className="text-primary" />
									<span>Settings</span>
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
				<Button variant="ghost" className="gap-2">
					<NotebookPen className="text-primary" />
					<span>Profile</span>
				</Button>
				<Button variant="ghost" className="gap-2">
					<Star className="text-primary" />
					<span>My Library</span>
				</Button>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger className="rounded-full" data-testid="avatar-trigger">
					<Avatar>
						<AvatarImage src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=740&t=st=1727684407~exp=1727685007~hmac=d94e2a5c2e158613a4c66e0b4623ffba571b35d2be28981616569d772951be60" />
						<AvatarFallback>NY</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="ml-3 mt-1 w-72">
					<Button variant="ghost" size="full" className="flex justify-around">
						<Avatar className="w-20 h-20">
							<AvatarImage src="https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?w=740&t=st=1727684407~exp=1727685007~hmac=d94e2a5c2e158613a4c66e0b4623ffba571b35d2be28981616569d772951be60" />
							<AvatarFallback>NY</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start ml-4">
							<span>Username</span>
							<span>User@gmail.com</span>
							<span className="self-center mt-2 font-semibold">Account</span>
						</div>
					</Button>
					<Separator className="mt-1" />
					<div className="p-2 flex justify-between">
						<Button size="sm" variant="outline">
							Add Account
						</Button>
						<Button size="sm" variant="outline">
							Log Out
						</Button>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
