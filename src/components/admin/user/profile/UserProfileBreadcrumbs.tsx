import {
	Breadcrumb,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const UserProfileBreadcrumbs = ({ id }: Readonly<{ id: string }>) => {
	return (
		<header className="flex h-16 items-center gap-2">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbLink href="/admin/user">User Management</BreadcrumbLink>
					<BreadcrumbSeparator />
					<BreadcrumbLink href="#">{id}</BreadcrumbLink>
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
};
