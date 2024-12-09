"use client";

import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/shared/infrastructure/trpc/api/client";

export default function UserManagementPage() {
	const { data, isFetching } = api.userRouter.getUserByPagination.useQuery({
		page: 1,
		perPage: 9,
	});
	if (isFetching) {
		return console.log("fetching...");
	}

	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset className="p-8">
				<DataTable columns={columns} data={data!.users} />
			</SidebarInset>
		</SidebarProvider>
	);
}
