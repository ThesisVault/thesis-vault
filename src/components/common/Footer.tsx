import { Globe } from "lucide-react";
import { Button } from "../ui/button";

export const Footer = () => {
	return (
		<div className="flex bg-primary justify-between rounded-none p-0 m-0 border-none">
			<Button variant="ghost" className="flex gap-0.5">
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
		</div>
	);
};
