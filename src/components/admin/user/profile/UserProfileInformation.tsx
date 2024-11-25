import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface IUserProfileInformation {
	name: string;
	image: string;
}

export const UserProfileInformation = ({ name, image }: Readonly<IUserProfileInformation>) => {
	return (
		<Card className="p-5 flex gap-5">
			<div className="flex">
				<Avatar className="h-20 w-20 rounded-lg">
					<AvatarImage src={image} alt={name} />
					<AvatarFallback className="rounded-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
				</Avatar>
			</div>
		</Card>
	);
};
