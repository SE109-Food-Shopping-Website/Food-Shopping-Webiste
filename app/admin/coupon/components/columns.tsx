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
  product_type_id: string;
  status: string;
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
        Ngày bắt đầu
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
        Ngày kết thúc
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
          Phần trăm giảm
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("discount_percent")}</div>,
  },
  {
    accessorKey: "product_type_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Loại sản phẩm
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("product_type_id")}</div>,
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
          Trạng thái
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawEndAt = row.getValue("end_at") as string;
      const timeZone = "Asia/Ho_Chi_Minh";

      const endDate = toZonedTime(new Date(rawEndAt), timeZone);
      const now = toZonedTime(new Date(), timeZone);

      const isActive = now <= endDate;

      return (
        <Badge status={isActive ? "active" : "inactive"}>
          {isActive ? "Hoạt động" : "Hết hạn"}
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
