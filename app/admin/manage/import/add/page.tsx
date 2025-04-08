"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, PlusCircle, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Tên loại sản phẩm không được để trống"),
});

const mockProducts = [
  { id: 1, name: "Lốc Milo" },
  { id: 2, name: "Sữa tươi Vinamilk" },
  { id: 3, name: "Bánh Oreo" },
];

export default function addImport() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();
  const [products, setProducts] = useState([
    { id: Date.now(), name: "", price: "", quantity: "" },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), name: "", price: "", quantity: "" },
    ]);
  };
  const updateProduct = (
    index: number,
    field: "name" | "price" | "quantity",
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const calculateTotal = (price: string, quantity: string): number => {
    return price && quantity ? Number(price) * Number(quantity) : 0;
  };

  const onSubmit = (data: { name: string }) => {
    console.log("Submitting form with data:", { ...data, products });
  };
  return (
    <div>
      <div className="justify-start text-black text-base font-normal font-['Inter']">
        Trung tâm / Quản lý / Nhập hàng
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin nhập hàng
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          {/* Tên Loại */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal">
                      Tên loại sản phẩm
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rau"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
            Chi tiết nhập hàng
          </div>
          <div className="relative justify-start text-black text-[14px] font-normal font-['Inter'] mt-[10px]">
            Tổng tiền
          </div>
          <div className="w-full flex flex-col gap-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="w-full grid grid-cols-4 gap-4 pb-4 border-b items-end"
              >
                <div className="flex flex-col">
                  <div className="text-black text-base">Sản phẩm</div>
                  <Select
                    onValueChange={(value) =>
                      updateProduct(index, "name", value)
                    }
                  >
                    <SelectTrigger className="w-full min-w-0">
                      <SelectValue placeholder="Chọn sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <div className="text-black text-base">Giá nhập</div>
                  <Input
                    type="number"
                    placeholder="Nhập giá"
                    value={product.price}
                    onChange={(e) =>
                      updateProduct(index, "price", e.target.value)
                    }
                    className="w-full min-w-0"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-black text-base">Số lượng</div>
                  <Input
                    type="number"
                    placeholder="Nhập số lượng"
                    value={product.quantity}
                    onChange={(e) =>
                      updateProduct(index, "quantity", e.target.value)
                    }
                    className="w-full min-w-0"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-black text-base">Tổng tiền</div>
                  <div className="p-3 border rounded-md bg-gray-100 w-full min-w-0">
                    {calculateTotal(
                      product.price,
                      product.quantity
                    ).toLocaleString()}{" "}
                    đ
                  </div>
                </div>
              </div>
            ))}

            {/* Nút Thêm Sản Phẩm luôn nằm dưới cùng */}
            <Button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 mt-4"
            >
              <PlusCircle className="w-5 h-5" /> Thêm sản phẩm
            </Button>

            {/* Tổng tiền luôn nằm dưới cùng */}
            <div className="w-full text-right mt-6 text-lg font-bold text-black">
              Tổng tiền:{" "}
              {products
                .reduce(
                  (sum, product) =>
                    sum + calculateTotal(product.price, product.quantity),
                  0
                )
                .toLocaleString()}{" "}
              đ
            </div>
          </div>

          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/manage/import" className="text-white">
                    Thoát
                  </Link>
                </Button>{" "}
              </div>
              <div className="relative">
                <Save className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button className="pl-12" type="submit">
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
