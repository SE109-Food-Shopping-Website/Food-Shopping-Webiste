"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye, Pencil, Star, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Comment {
  id: string;
  comment: string;
  rating: number;
  product_id: string;
  user_id: string;
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
    accessorKey: "product_id",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          product_id
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("product_id")}</div>,
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
    id: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="self-stretch self-stretch inline-flex justify-center items-center gap-2.5">
        <Link href={`/admin/customer/comment/reply/${row.getValue("id")}`}>
          <Pencil color="#5cb338" />
        </Link>
      </div>
    ),
  },
];
