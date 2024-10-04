import { Globe } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const Footer = () => {
	return (
		<div>
			<Card className="flex justify-between rounded-none">
				<Button variant="ghost">
					<Globe className="group-hover:text-primary" />
					<span className="group-hover:text-primary">EN</span>
				</Button>
				<div>
					<Button variant="ghost">
						<span className="group-hover:text-primary">Privacy</span>
					</Button>
					<Button variant="ghost">
						<span className="group-hover:text-primary">Terms</span>
					</Button>
					<Button variant="ghost">
						<span className="group-hover:text-primary">Help</span>
					</Button>
				</div>
			</Card>
		</div>
	);
};
