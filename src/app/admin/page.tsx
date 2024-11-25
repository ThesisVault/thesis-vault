import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getServerAuthSession } from "@/shared/infrastructure/authentication";
import { redirect } from "next/navigation";

export default async function adminPage() {
	const session = await getServerAuthSession();
	if (!session) {
		return redirect("/");
	}

	return (
		<SidebarProvider>
			<AdminSidebar session={session} />
			<SidebarInset>
				<h1>Overview</h1>
			</SidebarInset>
		</SidebarProvider>
	);
}
