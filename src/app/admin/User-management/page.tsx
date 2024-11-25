import { type User, columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

async function getData(): Promise<User[]> {
	// Fetch data from your API here.
	return [
		{
			id: "2315afa",
			name: "Melanie O'Kon",
			image: "https://avatars.githubusercontent.com/u/45273374",
			role: "admin",
			date: "2024-02-04T02:15:52.696Z",
		},
		{
			id: "adafgas11",
			name: "Mrs. Viola Stark Jr.",
			image: "https://avatars.githubusercontent.com/u/35010772",
			role: "student",
			date: "2024-10-15T19:23:11.165Z",
		},
		{
			id: "afafa1",
			name: "Ms. Verna Blick",
			image: "https://avatars.githubusercontent.com/u/38996051",
			role: "librarian",
			date: "2024-02-29T03:03:23.862Z",
		},
		// ...
	];
}

export default async function userMangementPage() {
	const data = await getData();
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div>
					<div className="p-8">
						<DataTable columns={columns} data={data} />
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
