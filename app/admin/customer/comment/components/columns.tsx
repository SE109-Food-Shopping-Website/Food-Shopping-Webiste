"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Pencil, Star, Eye} from "lucide-react";

export interface Comment {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  order_id: number;
  user_id: number;
  action: "";
}

export const columns: ColumnDef<Comment>[] = [
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
    accessorKey: "user_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          user_id
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("user_id")}</div>,
  },
  {
    accessorKey: "order_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          order_id
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("order_id")}</div>,
  },
  {
    accessorKey: "comment",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Lời nhận xét
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("comment")}</div>,
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <Button
        className="pl-0"
        variant="ghost"
        style={{ backgroundColor: "transparent" }}
      >
        Đánh giá
      </Button>
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number; // Lấy giá trị rating (1-5)
      return (
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${
                index < rating
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "stroke-gray-400"
              }`}
            />
          ))}
        </div>
      );
    },
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
          Thời gian gửi
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("created_at");
      const date =
        typeof rawDate === "string" || typeof rawDate === "number"
          ? new Date(rawDate)
          : null;
  
      return (
        <div>
          {date
            ? `${date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })} ${date.toLocaleDateString("vi-VN")}`
            : ""}
        </div>
      );
    },
  },  
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Link href={`/admin/customer/comment/reply/${row.getValue("id")}`}>
          <Eye color="#5cb338" />
        </Link>
        <Link href={`/admin/customer/comment/update/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
