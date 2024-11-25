"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { Copy, EllipsisVertical, Trash, UserCog } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
	id: string;
	role: "admin" | "student" | "librarian";
	date: string;
	name: string;
	image: string;
};

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const userName = row.original;

			return (
				<div className="flex space-x-4">
					<div>
						<Avatar className="">
							<AvatarImage
								className="h-7 w-7 rounded-lg"
								src={userName.image}
								alt={userName.name}
							/>
							<AvatarFallback className="rounded-lg">CN</AvatarFallback>
						</Avatar>
					</div>
					<div className="pt-2">
						<a href="/admin/User-management/profile">
							<span className="truncate">{userName.name}</span>
						</a>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const userRole = row.original;
			const color = {
				admin: "bg-red-500",
				student: "bg-blue-500",
				librarian: "bg-green-500",
			};

			return (
				<Badge variant="outline" className={`${color[userRole.role]} text-white justify-center`}>
					{userRole.role}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		accessorKey: "date",
		header: () => <div className="text-right">Date</div>,
		cell: ({ row }) => {
			const userDate = Number.parseFloat(row.getValue("date"));
			const formatted = new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			}).format(userDate);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},

	{
		id: "actions",
		cell: ({ row }) => {
			const userID = row.original;

			return (
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
			);
		},
	},
];
