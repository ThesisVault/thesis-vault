import { UserProfileBreadcrumbs } from "@/components/admin/user/profile/UserProfileBreadcrumbs";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function userProfile() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16  items-center gap-2 px-10">
					<UserProfileBreadcrumbs id={"123123"} />
				</header>
				<div>
					<div className="flex items-center px-10">
						<Avatar className="h-40 w-40">
							<AvatarImage src="https://avatars.githubusercontent.com/u/45273374" alt="" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="px-10">
							<h1 className="font-sans text-2xl font-medium">Melanie O'Kon</h1>
							<p className="text-sm">melaine.O'kon@me.com</p>
							<Badge>Admin</Badge>
						</div>
					</div>
					<div className="px-10 py-10">
						<h1 className="font-semibold text-2xl">Permissions</h1>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
