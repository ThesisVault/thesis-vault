import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function adminPage() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<h1> Overview </h1>
			</SidebarInset>
		</SidebarProvider>
	);
}
