"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, Save } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Image from "next/image";

const formSchema = z.object({
  name: z.string(),
  productType_id: z.string(),
  provider_id: z.string(),
  unit: z.string(),
  description: z.string(),
});

export default function addProduct() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [providers, setProviders] = useState<{ id: number; name: string }[]>(
    []
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let newImages: File[] = [...selectedImages];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Kiểm tra dung lượng file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} vượt quá 5MB!`);
        continue;
      }

      // Giới hạn tối đa 5 ảnh
      if (newImages.length >= 5) {
        alert("Chỉ được chọn tối đa 5 ảnh.");
        break;
      }

      newImages.push(file);
    }

    setSelectedImages(newImages);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Fetch categories
  useEffect(() => {
    fetch("/api/product-types")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Fetch providers
  useEffect(() => {
    fetch("/api/provider")
      .then((res) => res.json())
      .then((data) => setProviders(data))
      .catch(() => setProviders([]));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productType_id: "",
      provider_id: "",
      unit: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("unit", values.unit);
    formData.append("description", values.description);
    formData.append("productType_id", values.productType_id);
    formData.append("provider_id", values.provider_id);

    // Thêm ảnh vào FormData
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData, // 🚀 Dùng FormData thay vì JSON
      });

      if (!res.ok) {
        throw new Error("Lỗi từ server: " + res.statusText);
      }

      const data = await res.json();
      if (data.error) {
        alert("Lỗi: " + data.error);
      } else {
        alert("Thêm thành công!");
        form.reset(); // Reset form
        setSelectedImages([]); // Reset danh sách ảnh
        router.push("/admin/manage/product");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      alert(
        "Đã xảy ra lỗi: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  }

  return (
    <div>
      <div className="relative justify-start text-black text-base font-normal font-['Inter']">
        Trung tâm / Quản lý / Sản phẩm
      </div>
      <div className="relative justify-start text-[#5cb338] text-base font-bold font-['Inter'] mt-[10px]">
        Thông tin loại sản phẩm
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          encType="multipart/form-data"
        >
          {/* Tên sản phẩm */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">Tên sản phẩm</FormLabel>
                    <FormControl>
                      <Input placeholder="Rau" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="productType_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal">Loại sản phẩm</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại sản phẩm" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              Không có danh mục nào
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

          {/* Nhà cung cấp & Đơn vị tính */}
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">Đơn vị tính</FormLabel>
                    <FormControl>
                      <Input placeholder="Quả" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="provider_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-normal">Nhà cung cấp</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
            Mô tả sản phẩm
          </div>
          {/* Thông tin sản phẩm */}
          <div className="w-full flex flex-col justify-start items-start mt-[10px] gap-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-normal">
                    Thông tin sản phẩm
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập thông tin sản phẩm..."
                      className="resize-none h-32 text-[18px] text-black"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="relative justify-start text-black text-[16px] font-normal font-['Inter'] mt-[10px]">
            Ảnh sản phẩm (tối đa 5 ảnh)
          </div>
          {/* Ảnh sản phẩm */}
          <div className="w-full flex flex-col justify-start items-start mt-[10px] gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {selectedImages.map((image, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  width={100}
                  height={100}
                />
                <button type="button" onClick={() => removeImage(index)}>
                  Xóa
                </button>
              </div>
            ))}
          </div>

          {/* Hiển thị ảnh đã chọn */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative w-24 h-24">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Selected ${index}`}
                  width={96}
                  height={96}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/manage/product" className="text-white">
                    Thoát
                  </Link>
                </Button>{" "}
              </div>
              <div className="relative">
                <Save className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button className="pl-12" type="submit">
                  Lưu
                </Button>{" "}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
