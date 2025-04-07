"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  priceMarginPct: string;
  action: string;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          ID
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Họ tên
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "priceMarginPct",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Percent
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("priceMarginPct")}</div>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Trash color="red" />
        <Link href={`/admin/manage/category/update/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
