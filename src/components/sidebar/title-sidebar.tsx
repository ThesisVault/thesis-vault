"use client";

// biome-ignore lint/style/useImportType: <explanation>
import { ChevronsLeft, ChevronsRight, LucideIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";

export function NavTitle({
	title,
}: {
	title: {
		label: string;
		icon: LucideIcon;
	};
}) {
	const { state, toggleSidebar } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div>
					<div className="flex items-center justify-between pl-1">
						<span className="truncate font-semibold text-sm">{title.label}</span>
						<div className="pr-2">
							{state === "expanded" ? (
								<ChevronsLeft onClick={toggleSidebar} />
							) : (
								<ChevronsRight onClick={toggleSidebar} />
							)}
						</div>
					</div>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
