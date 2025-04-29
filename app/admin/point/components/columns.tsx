"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  min_point: number;
  max_promotion: number;
  discount_percent: number;
  max_discount: number;
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
          Tên hạng
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "min_point",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Điểm tối thiểu
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("min_point")}</div>,
  },
  {
    accessorKey: "max_promotion",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Số mã tối đa được giảm
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("max_promotion")}</div>,
  },
  {
    accessorKey: "discount_percent",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Phần trăm giảm giá
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("discount_percent")}</div>,
  },
  {
    accessorKey: "max_discount",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Giảm giá tối đa
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("max_discount")}</div>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Trash color="red" />
        <Link href={`/admin/point/update/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
