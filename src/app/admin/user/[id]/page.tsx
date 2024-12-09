import { UserProfileBreadcrumbs } from "@/components/admin/user/profile/UserProfileBreadcrumbs";
import { UserProfileInformation } from "@/components/admin/user/profile/UserProfileInformation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createRoleDomainObject } from "@/modules/user/tests/utils/role/createRoleDomainObject";
import { createUserDomainObject } from "@/modules/user/tests/utils/user/createUserDomainObject";

export default async function UserManagementProfile() {
	// TODO: Replace this using trpc when the backend is done
	const user = createUserDomainObject({});
	const role = createRoleDomainObject({});

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="px-10">
				<UserProfileBreadcrumbs id={"123"} />
				<UserProfileInformation name={user.nameValue} image={user.image} />
				{/*<div>*/}
				{/*	<div className="flex items-center px-10">*/}
				{/*		<Avatar className="h-40 w-40">*/}
				{/*			<AvatarImage src={user.image} alt={user.nameValue} />*/}
				{/*			<AvatarFallback>{user.nameValue.charAt(0).toUpperCase()}</AvatarFallback>*/}
				{/*		</Avatar>*/}
				{/*		<div className="px-10">*/}
				{/*			<h1 className="font-sans text-2xl font-medium">{user.nameValue}</h1>*/}
				{/*			<p className="text-sm">{user.email}</p>*/}
				{/*			<Badge*/}
				{/*				style={{ backgroundColor: role.color }}*/}
				{/*				className="capitalize text-sm rounded-full"*/}
				{/*			>*/}
				{/*				{role.nameValue}*/}
				{/*			</Badge>*/}
				{/*		</div>*/}
				{/*	</div>*/}
				{/*	<div className="px-10 py-10">*/}
				{/*		<h1 className="font-semibold text-2xl">Permissions</h1>*/}
				{/*	</div>*/}
				{/*</div>*/}
			</SidebarInset>
		</SidebarProvider>
	);
}
