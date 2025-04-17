"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye, Pencil, Trash } from "lucide-react";
import {format, toZonedTime} from "date-fns-tz";

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
    header: ({ column }) => (
      <Button className="pl-0" variant="ghost" style={{ backgroundColor: "transparent" }}>
        Ngày nhập
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at") as string;
      const timeZone = "Asia/Ho_Chi_Minh";
      const date = toZonedTime(new Date(rawDate), timeZone);
      const formatted = format(date, "dd/MM/yyyy HH:mm", { timeZone });
      return <div>{formatted}</div>;
    },
  },
  
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button className="pl-0" variant="ghost" style={{ backgroundColor: "transparent" }}>
        Ngày nhập
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("updated_at") as string;
      const timeZone = "Asia/Ho_Chi_Minh";
      const date = toZonedTime(new Date(rawDate), timeZone);
      const formatted = format(date, "dd/MM/yyyy HH:mm", { timeZone });
      return <div>{formatted}</div>;
    },
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
