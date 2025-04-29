"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";
import { format, toZonedTime } from "date-fns-tz";
import { Badge } from "@/components/ui/badge";

export interface Category {
  id: string;
  name: string;
  day_start: string;
  day_end: string;
  value: number;
  order_min: number;
  discount_max: number;
  status: string;
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
          Tên khuyến mãi
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "day_start",
    header: ({ column }) => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Ngày bắt đầu
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("day_start") as string;
      const timeZone = "Asia/Ho_Chi_Minh";
      const date = toZonedTime(new Date(rawDate), timeZone);
      const formatted = format(date, "dd/MM/yyyy HH:mm", { timeZone });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "day_end",
    header: ({ column }) => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Ngày kết thúc
      </Button>
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("day_end") as string;
      const timeZone = "Asia/Ho_Chi_Minh";
      const date = toZonedTime(new Date(rawDate), timeZone);
      const formatted = format(date, "dd/MM/yyyy HH:mm", { timeZone });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Giá trị
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("value")}</div>,
  },
  {
    accessorKey: "order_min",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Đơn tối thiểu
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("order_min")}</div>,
  },
  {
    accessorKey: "discount_max",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Giảm tối đa
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("discount_max")}</div>,
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
        <Link href={`/admin/promotion/update/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
