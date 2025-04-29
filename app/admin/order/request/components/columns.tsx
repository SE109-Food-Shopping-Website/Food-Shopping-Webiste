"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Category {
  id: string;
  created_at: string;
  user_id: string;
  totalPrice: number;
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
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày đặt
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at");
      const date =
        typeof rawDate === "string" || typeof rawDate === "number"
          ? new Date(rawDate)
          : null;

      return <div>{date ? date.toLocaleDateString("vi-VN") : ""}</div>;
    },
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Mã khách hàng
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("user_id")}</div>,
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
      const rawStatus = row.getValue("status") as string;
      const status = rawStatus.toLowerCase(); // chuyển về lowercase

      const statusLabel =
        {
          pending: "Đang chờ",
          processing: "Đang xử lý",
          shipping: "Đang giao",
          completed: "Hoàn tất",
          request: "Yêu cầu",
          return: "Trả hàng",
          cancelled: "Đã huỷ",
        }[status] ?? rawStatus;

      return (
        <Badge
          variant={
            status as
              | "default"
              | "destructive"
              | "outline"
              | "secondary"
              | "completed"
              | "processing"
              | "pending"
              | "cancelled"
              | "return"
              | "request"
              | "shipping"
          }
        >
          {statusLabel}
        </Badge>
      );
    },
  },

  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Link href={`/admin/order/request/detail/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
