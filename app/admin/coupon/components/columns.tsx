"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { Badge } from "@/components/ui/badge";

export interface Coupon {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  discount_percent: number;
  action: string;
}

export const columns: ColumnDef<Coupon>[] = [
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
          Tên mã giảm giá
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "start_at",
    header: ({ column }) => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Ngày nhập
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("start_at") as string;
      const timeZone = "Asia/Ho_Chi_Minh";
      const date = toZonedTime(new Date(rawDate), timeZone);
      const formatted = format(date, "dd/MM/yyyy HH:mm", { timeZone });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "end_at",
    header: ({ column }) => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Ngày nhập
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("end_at") as string;
      const timeZone = "Asia/Ho_Chi_Minh";
      const date = toZonedTime(new Date(rawDate), timeZone);
      const formatted = format(date, "dd/MM/yyyy HH:mm", { timeZone });
      return <div>{formatted}</div>;
    },
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
          Percent
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("discount_percent")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Hoạt động
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");

      return (
        <Badge status={status ? "active" : "inactive"}>
          {status ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Trash color="red" />
        <Link href={`/admin/coupon/update/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
