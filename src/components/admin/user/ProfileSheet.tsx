import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

interface IProfileSheet {
	name: string;
	image: string;
}

export const ProfileSheet = ({ name, image }: Readonly<IProfileSheet>) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<div className="flex gap-2 items-center group">
					<Avatar className="rounded-md">
						<AvatarImage className="h-10 w-10" src={image} alt={name} />
						<AvatarFallback className="h-10 w-10 rounded-md">
							{name.charAt(0).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<h1 className="group-hover:text-primary group-hover:underline">{name}</h1>
				</div>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>
						Make changes to your profile here. Click save when you're done.
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};
