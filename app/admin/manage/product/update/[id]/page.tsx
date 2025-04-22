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
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  productType_id: z.string().min(1, "Vui lòng chọn loại sản phẩm"),
  provider_id: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  quantity: z.number().min(0, "Số lượng không được âm"),
  unit: z.string().min(1, "Đơn vị tính không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

export default function UpdateProduct() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [providers, setProviders] = useState<{ id: number; name: string }[]>([]);
  const [productInfo, setProductInfo] = useState<{
    provider_name?: string;
    productType_name?: string;
  }>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productType_id: "",
      provider_id: "",
      quantity: 0,
      unit: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch(`/api/products/${id}`);
        const productData = await productRes.json();
        if (productData.error) {
          throw new Error(productData.error);
        }
        console.log("Dữ liệu sản phẩm:", productData);

        setProductInfo({
          provider_name: productData.provider_name,
          productType_name: productData.productType_name,
        });

        if (productData.images) {
          setExistingImages(productData.images);
        }

        form.reset({
          name: productData.name || "",
          productType_id: productData.productType_id?.toString() || "",
          provider_id: productData.provider_id?.toString() || "",
          quantity: productData.quantity || 0,
          unit: productData.unit || "",
          description: productData.description || "",
        });

        const [categoriesRes, providersRes] = await Promise.all([
          fetch("/api/product-types"),
          fetch("/api/provider"),
        ]);
        const [categoriesData, providersData] = await Promise.all([
          categoriesRes.json(),
          providersRes.json(),
        ]);
        setCategories(categoriesData);
        setProviders(providersData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu sản phẩm!",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: File[] = [...selectedImages];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: `File ${file.name} vượt quá 5MB!`,
          variant: "destructive",
        });
        continue;
      }

      if (newImages.length + existingImages.length >= 5) {
        toast({
          title: "Lỗi",
          description: "Chỉ được chọn tối đa 5 ảnh.",
          variant: "destructive",
        });
        break;
      }

      newImages.push(file);
    }

    setSelectedImages(newImages);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("unit", values.unit);
      formData.append("description", values.description);
      formData.append("productType_id", values.productType_id);
      formData.append("provider_id", values.provider_id);
      formData.append("quantity", values.quantity.toString());

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("existingImages", JSON.stringify(existingImages));

      console.log("Payload gửi đi:", {
        name: values.name,
        unit: values.unit,
        description: values.description,
        productType_id: values.productType_id,
        provider_id: values.provider_id,
        quantity: values.quantity,
        existingImages,
        images: selectedImages.map((img) => img.name),
      });

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Thành công",
        description: "Cập nhật sản phẩm thành công!",
      });
      router.push("/admin/manage/product");
    } catch (error: any) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật sản phẩm!",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <div>Đang tải...</div>;
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
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              productInfo.productType_name ||
                              "Chọn loại sản phẩm"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length > 0 ? (
                            categories.map((productType) => (
                              <SelectItem
                                key={productType.id}
                                value={productType.id.toString()}
                              >
                                {productType.name}
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
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              productInfo.provider_name || "Chọn nhà cung cấp"
                            }
                          />
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
          <div className="w-full self-stretch inline-flex justify-between items-center mt-[10px]">
            <div className="w-[500px] inline-flex flex-col justify-start items-start gap-5">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className="font-normal">
                      Số lượng trong kho
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
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
          <div className="w-full flex flex-col justify-start items-start mt-[10px] gap-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className="relative w-24 h-24">
                <Image
                  src={img}
                  alt={`Existing ${index}`}
                  width={96}
                  height={96}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
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
          <div className="w-full self-stretch inline-flex flex-col justify-start items-end gap-5 mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
              <div className="relative">
                <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                <Button variant={"secondary"} className="pl-12" type="button">
                  <Link href="/admin/manage/product" className="text-white">
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