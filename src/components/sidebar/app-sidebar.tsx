"use client";

import { Activity, BookOpen, LayoutGrid, Settings2, Shield, UserPlus } from "lucide-react";
import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarFooter,  SidebarHeader, SidebarRail } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./sidebar-menu";
import { NavTitle } from "./title-sidebar";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "",
	},
	title: {
		label: "Thesis Vault",
		icon: BookOpen
	},
	navMain: [
		{
			title: "Overview",
			url: "/admin",
			icon: LayoutGrid,
		},
		{
			title: "Roles",
			url: "#",
			icon: Shield
		},
		{
			title: "Activity",
			url: "#",
			icon: Activity
		},
		{
			title: "User Management",
			url: "/admin/User-management",
			icon: UserPlus,
		},
		{
			title: "Application Settings",
			url: "#",
			icon: Settings2,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			 <SidebarHeader>
			 	<NavTitle title={data.title}/>
      </SidebarHeader>
			<Separator/>
			<SidebarContent>
				<NavMain items={data.navMain}/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
