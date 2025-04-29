"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, LogOut, Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Form, FormField, FormControl, FormMessage, FormLabel, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  reply: z.string().min(1, "Phản hồi không được để trống"),
});

export default function ReplyComment() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reply: feedbackData?.reply ?? "",
    },
    values: feedbackData ? { reply: feedbackData.reply ?? "" } : undefined,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleReplySubmit = useCallback(async () => {
    const values = form.getValues();
    try {
      setIsLoading(true);
      toast.loading("Đang gửi cập nhật phản hồi khách hàng...", { duration: 5000 });

      const res = await fetch(`/api/admin/comment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: values.reply }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Có lỗi xảy ra.");
      }

      toast.dismiss();
      setTimeout (() => {
        toast.success("Cập nhật phản hồi thành công!");
        setTimeout (() => {
          router.push("/admin/customer/comment");
        }, 1500);
      });
    } catch (err) {
      console.error("Lỗi khi gửi cập nhật phản hồi:", err);
      toast.error((err as Error).message || "Đã xảy ra lỗi khi gửi cập nhật phản hồi khách hàng");
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  }, [id, form, router]);
    
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch(`/api/admin/comment/${id}`);
        const data = await res.json();

        if (res.ok) {
          setFeedbackData(data.feedback);
          console.log("Feedback data:", data.feedback);
          setLoading(false);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi fetch feedback:", error);
        toast.error("Không thể tải thông tin feedback");
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [id, form]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
        <div className="relative justify-start text-black text-base">
            Góp ý / Chi tiết
        </div>
        <div className="relative justify-start text-primary text-base font-bold mt-[10px]">
            Thông tin Feedback
        </div>
        <div className="bg-white p-4 rounded-md">
            <div><b>Người gửi:</b> {feedbackData.user.name}</div>
            <div><b>Sản phẩm:</b> {feedbackData.product.name}</div>
            <div><b>Đánh giá:</b> {feedbackData.rating} ⭐</div>
            <div><b>Bình luận:</b> {feedbackData.comment || "Không có bình luận"}</div>
            <div>
            <b>Hình ảnh:</b><br />
            {feedbackData.images ? (
                JSON.parse(feedbackData.images).length > 0 ? (
                JSON.parse(feedbackData.images).map((image: string, index: number) => (
                    <img
                    key={index}
                    src={image}
                    alt={`Hình ảnh feedback ${index + 1}`}
                    className="w-40 h-auto mt-2 rounded-md"
                    />
                ))
                ) : (
                <span>Không có hình ảnh</span>
                )
            ) : (
                <span>Không có hình ảnh</span>
            )}
          </div>
        </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleReplySubmit)} className="w-full max-w-[1240px] mx-auto p-4 space-y-4 text-black">
          <FormField
            control={form.control}
            name="reply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phản hồi khách hàng</FormLabel> 
                <FormControl>
                  <Textarea
                    placeholder="Nhập phản hồi"
                    className="h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600 font-semibold mt-1 flex items-center gap-1" />
              </FormItem>
            )}
          />
          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end overflow-hidden mt-[15px]">
              <div className="inline-flex justify-start items-start gap-[20px]">
                <div className="relative">
                    <LogOut className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white" />
                    <Button variant={"secondary"} className="pl-12" type="button">
                      <Link href="/admin/customer/comment" className="text-white">
                        Thoát
                      </Link>
                    </Button>{" "}
                  </div>
                  <div className="relative">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleReplySubmit();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" />
                        Gửi phản hồi
                      </>
                    )}
                  </Button>
                  </div>
                </div>
              </div>
        </form>
      </FormProvider>
    </div>
  );
}