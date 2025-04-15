"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  birthday: string;
  gender: string;
  isActive: boolean;
}

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Email
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
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
          Tên khách hàng
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Số điện thoại
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Địa chỉ
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("address")}</div>,
  },
  {
    accessorKey: "birthday",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày sinh
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("birthday");
      const date =
        typeof rawDate === "string" || typeof rawDate === "number"
          ? new Date(rawDate)
          : null;

      return <div>{date ? date.toLocaleDateString("vi-VN") : ""}</div>;
    },
  },

  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <Button
          className="pl-0"
          variant="ghost"
          style={{ backgroundColor: "transparent" }}
        >
          Giới tính
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("gender")}</div>,
  },
  {
    accessorKey: "isActive",
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
      const isActive = row.getValue("isActive");

      return (
        <Badge status={isActive ? "active" : "inactive"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Badge>
      );
    },
  },
];
