"use client";

import React, { useEffect, useState } from "react";
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
  provider_id: z.string().min(1, "Tên nhà cung cấp không được để trống"),
});

type Product = {
  id: number;
  product_id: number;
  price: string;
  quantity: string;
};

export default function AddImport() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider_id: "",
    },
  });

  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([
    { id: Date.now(), product_id: 0, price: "", quantity: "" },
  ]);
  const [providers, setProviders] = useState<{ id: number; name: string }[]>([]);
  const [productList, setProductList] = useState<{ id: number; name: string }[]>(
    []
  );
  const [providerId, setProviderId] = useState<string>("");

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await fetch("/api/provider");
      const data = await res.json();
      setProviders(data);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!providerId) {
        setProductList([]);
        return;
      }
      const res = await fetch(`/api/products?provider_id=${providerId}`);
      const data = await res.json();
      setProductList(data);
    };
    fetchProducts();
  }, [providerId]);

  const addProduct = () => {
    setProducts([
      ...products,
      { id: Date.now(), product_id: 0, price: "", quantity: "" },
    ]);
  };

  const updateProduct = <K extends keyof Product>(
    index: number,
    field: K,
    value: Product[K]
  ) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const calculateTotal = (price: string, quantity: string): number => {
    return price && quantity ? Number(price) * Number(quantity) : 0;
  };

  const onSubmit = async (data: { provider_id: string }) => {
    try {
      if (
        products.some(
          (p) =>
            p.product_id === 0 ||
            !p.price ||
            !p.quantity ||
            Number(p.price) <= 0 ||
            Number(p.quantity) <= 0
        )
      ) {
        alert(
          "Vui lòng điền đầy đủ và đúng thông tin sản phẩm (sản phẩm, giá > 0, số lượng > 0)!"
        );
        return;
      }

      const res = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider_id: Number(data.provider_id),
          products,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Thêm đơn nhập hàng thành công!");
        router.push("/admin/manage/import");
      } else {
        alert("Lỗi: " + result.error || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi khi thêm đơn nhập hàng!");
    }
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
          {/* Tên nhà cung cấp */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] flex flex-col gap-2">
              <FormField
                control={form.control}
                name="provider_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal">
                      Tên nhà cung cấp
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setProviderId(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhà cung cấp" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.length > 0 ? (
                            providers.map((provider) => (
                              <SelectItem
                                key={provider.id}
                                value={provider.id.toString()}
                              >
                                {provider.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Không có nhà cung cấp nào
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
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
                      updateProduct(index, "product_id", Number(value))
                    }
                    value={
                      product.product_id === 0
                        ? undefined
                        : product.product_id.toString()
                    }
                  >
                    <SelectTrigger className="w-full min-w-0">
                      <SelectValue placeholder="Chọn sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      {productList.length > 0 ? (
                        productList.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          Không có sản phẩm nào
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <div className="text-black text-base">Giá nhập</div>
                  <Input
                    type="number"
                    placeholder="Nhập giá"
                    min={1}
                    value={product.price}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateProduct(index, "price", value > 0 ? value.toString() : "1");
                    }}
                    className="w-full min-w-0"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-black text-base">Số lượng</div>
                  <Input
                    type="number"
                    placeholder="Nhập số lượng"
                    min={1}
                    value={product.quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      updateProduct(index, "quantity", value > 0 ? value.toString() : "1");
                    }}
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

            <Button
              type="button"
              onClick={addProduct}
              className="flex items-center gap-2 mt-4"
            >
              <PlusCircle className="w-5 h-5" /> Thêm sản phẩm
            </Button>

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

          <div className="w-full self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/manage/import" className="text-white">
                    Thoát
                  </Link>
                </Button>
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