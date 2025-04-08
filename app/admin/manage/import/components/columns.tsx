"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye, Pencil, Trash } from "lucide-react";

export interface Import {
  id: string;
  totalPrice: string;
  created_at: string;
  updated_at: string;
  provider_id: string;
  action: "";
}

export const columns: ColumnDef<Import>[] = [
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
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Tổng tiền
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("totalPrice")}</div>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Ngày nhập
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Ngày tạo
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("updated_at")}</div>,
  },
  {
    accessorKey: "provider_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Nhà cung cấp
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("provider_id")}</div>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Link href={`/admin/manage/import/view/${row.getValue("id")}`}>
          <Eye color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
