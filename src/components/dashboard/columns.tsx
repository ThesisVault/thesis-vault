"use client";

import { ProfileSheet } from "@/components/admin/user/ProfileSheet";
import type { IUserJSONData } from "@/modules/user/src/domain/models/user/constant";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, Copy, EllipsisVertical, Trash, UserCog, X } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const columns: ColumnDef<IUserJSONData>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const user = row.original;
			return <ProfileSheet name={user.name} image={user.image} />;
		},
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => {
			return <h1>{row.original.email}</h1>;
		},
	},
	{
		accessorKey: "superAdmin",
		header: "Super Admin",
		cell: ({ row }) => {
			return row.original.isSuperAdmin ? <Check /> : <X />;
		},
	},
	{
		accessorKey: "createdAt",
		header: () => <h1>Created Date</h1>,
		cell: ({ row }) => {
			const formatted = new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				weekday: "long"
			}).format(row.getValue("createdAt"));

			return <h1 className="font-medium">{formatted}</h1>;
		},
	},
	{
		accessorKey: "updatedAt",
		header: () => <h1>Last Updated</h1>,
		cell: ({ row }) => {
			const formatted = new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				weekday: "long"
			}).format(row.getValue("updatedAt"));

			return <h1 className="font-medium">{formatted}</h1>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const userID = row.original;

			return (
				<div className="flex justify-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open Menu</span>
								<EllipsisVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(userID.id)}>
								{" "}
								<Copy />
								Copy ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								{" "}
								<UserCog />
								Manage Permission
							</DropdownMenuItem>
							<DropdownMenuItem className="bg-red-500 text-white">
								{" "}
								<Trash />
								Delete User
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
