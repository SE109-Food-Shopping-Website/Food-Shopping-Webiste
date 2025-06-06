"use client"
 
import React, {useState, useEffect}  from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from "sonner";
import { useParams, useRouter } from "next/navigation";
import {Star} from "lucide-react";

const formSchema = z.object({
    comment: z.string(),
    images: z.array(z.string()),
    rating: z.number().refine(value => value >= 1 && value <= 5, {
        message: "Vui lòng chọn số sao từ 1 đến 5.",
      }),
    });

export default function PageOrderFeedback() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
            images: [],
            rating: 0
        },
    });

    const {id} = useParams();
    const [order, setOrder] = useState<any>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const formatPrice = (price?: number) => price?.toLocaleString() ?? "0";

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        
        let newImages: File[] = [...selectedImages];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`File ${file.name} vượt quá 5MB!`);
                continue;
            }
            if (newImages.length >= 5) {
                toast.error("Chỉ được chọn tối đa 5 ảnh.");
                break;
            }
            
            newImages.push(file);
        }
        setSelectedImages(newImages);
    };
        
    const removeImage = (index: number) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!id) {
          toast.error("Thiếu order id");
          return;
        }
    
        const formData = new FormData();
        formData.append("orderId", id.toString());
        formData.append("comment", values.comment || "");
        formData.append("rating", values.rating.toString());
    
        selectedImages.forEach((image) => {
          formData.append("images", image);
        });
    
        try {
            const res = await fetch("/api/order/feedback", {
                method: "POST",
                body: formData,
            });
    
            if (!res.ok) {
                throw new Error("Lỗi từ server: " + res.statusText);
            }
    
            const data = await res.json();
            if (data.error) {
                toast.error("Lỗi: " + data.error);
            } else {
                const loadingToast = toast.loading("Đang gửi đánh giá...", {duration: 5000});
            
                setTimeout(() => {
                    toast.dismiss(loadingToast);
                    toast.success("Gửi đánh giá sản phẩm thành công!");
                    form.reset();
                    setSelectedImages([]);
                    router.push("/client/history/completed");
                }, 1500); 
            }
            
        } catch (err) {
            console.error("Lỗi:", err);
            toast.error("Đã xảy ra lỗi: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/order/${id}`);
                const json = await res.json();
                if (json.message) throw new Error(json.message);
                    setOrder(json.order);
                }   catch (error: any) {
                        console.error("Lỗi khi lấy đơn hàng:", error);
                        toast.error(error.message || "Không thể tải thông tin đơn hàng!");
                }   finally {
                    setLoading(false);
                }
            };
          
            if (id) fetchOrder();
        }, [id]);

    if (loading) {
        return <div className="w-full text-center py-10 text-gray-500">Đang tải đơn hàng...</div>;
    }

    if (!order) {
        return <div className="w-full text-center py-10 text-red-500">Không tìm thấy đơn hàng!</div>;
    }

    return (
        <div className="min-h-screen w-full flex text-black font-inter">
            <div className="w-[1240px] flex flex-col items-start gap-6">
                <div className="w-full flex flex-col items-center gap-2.5">
                    <div className="text-[25px] font-bold">Đánh giá sản phẩm</div>
                    <div className="self-stretch rounded-[5px] flex flex-col items-start justify-start px-[20px] gap-2.5">
                        {order?.orderDetails?.map((detail: any) => {
                            let imageSrc = "/ava.png";
                            try {
                                const parsedImages = JSON.parse(detail.product.images);
                                if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                                imageSrc = parsedImages[0];
                                }
                            } catch (error) {
                                console.error("Error parsing product images:", error);
                            }
                            return (
                                <div key={detail.id} className="w-full flex flex-row items-center justify-between border-b rounded-md p-3 hover:bg-gray-50">
                                <div className="flex flex-row items-center gap-5">
                                    <img className="w-[50px] h-[50px] rounded-full" src={imageSrc} alt={detail.product.name} />
                                    <div className="flex flex-col">
                                    <b className="text-[18px] text-primary">{detail.product.name}</b>
                                    <div className="text-[16px] text-foreground">Đơn vị tính: {detail.product.unit}</div>
                                    <div className="text-base text-foreground">x {detail.quantity}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end text-base">
                                    <b className="text-primary text-[18px]">{formatPrice(detail.salePrice)}đ</b>
                                </div>
                                </div>
                            );
                        })}
                        <div className="self-stretch rounded-[5px] bg-white flex flex-col items-start justify-start py-[10px] gap-2.5">
                            <div className="flex justify-between w-full text-[18px]">
                                <b>Tổng cộng</b>
                                <b className="text-primary">{formatPrice(order.totalPrice)}đ</b>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch inline-flex justify-between items-start pl-4">
                        <div className="w-30 justify-start text-black text-[18px] font-normal">Mã đơn hàng: {order.id}</div>
                        <div className="w-70 h-6 justify-start text-black text-[18px] font-normal">Mua vào ngày: {new Date(order.created_at).toLocaleString("vi-VN")}</div>
                        <div className="justify-start"><span className="text-black text-[18px] font-normal">Tên người mua:</span>
                        <span className="text-black text-[18px] font-bold"> {order.name}</span></div>
                    </div>
                </div>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-[1240px] mx-auto p-4 text-black">
                        <div className="space-y-4">
                        {/* Rating */}
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                        <div className="flex items-center gap-4">
                                            <FormLabel className="m-0 text-[16px] font-bold">
                                                Đánh giá của bạn về sản phẩm:
                                            </FormLabel>
                                            <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                key={star}
                                                type="button"
                                                onClick={() => form.setValue("rating", star)}
                                                className={`text-2xl ${
                                                    star <= form.watch("rating") ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400"
                                                }`}
                                                />
                                            ))}
                                            </div>
                                            </div>
                                    </FormControl>
                                    <FormMessage className="text-secondary font-bold"/>
                                    </FormItem>
                                )}
                            />
                            {/* Comment */}
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>                      
                                        <FormControl>
                                            <Textarea
                                            placeholder="Nhập đánh giá của bạn về sản phẩm này..."
                                            className="h-28 resize-none"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Image */}
                            <div className="w-full flex flex-col justify-start items-start mt-[10px] gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="text-sm file:text-sm file:font-medium file:bg-primary file:text-white 
                                                file:py-2 file:px-4 file:rounded-md file:border-none
                                                focus:outline-none focus:ring-0 focus:border-transparent 
                                                bg-transparent w-full"
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
                            <div className="self-stretch overflow-hidden flex flex-row items-start justify-center p-3xs text-white">
                                <Button type="submit" variant="default" className="rounded-[5px] w-[250px] h-[50px] flex items-center justify-center text-lg font-bold">
                                    GỬI ĐÁNH GIÁ
                                </Button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}