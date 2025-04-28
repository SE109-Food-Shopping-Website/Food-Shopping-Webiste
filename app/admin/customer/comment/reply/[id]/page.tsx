"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

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
      reply: "",
    },
  });

  const handleReplySubmit = useCallback(async () => {
    const values = form.getValues();

    if (window.confirm("Bạn có chắc chắn gửi phản hồi này?")) {
      try {
        const res = await fetch(`/api/admin/comment/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: values.reply }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Có lỗi xảy ra.");
        }

        alert("Phản hồi thành công!");
        router.push("/admin/customer/comment");
      } catch (err) {
        console.error("Lỗi khi gửi phản hồi:", err);
      }
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
          form.setValue("reply", data.feedback.reply || "");
          setLoading(false);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Lỗi khi fetch feedback:", error);
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

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleReplySubmit();
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="reply"
            render={({ field }) => (
              <div>
                <FormLabel>Phản hồi khách hàng</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    className="w-full h-32 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập phản hồi..."
                  />
                </FormControl>
                <FormMessage />
              </div>
            )}
          />
          {/* Button */}
          <div className="w-full self-stretch self-stretch inline-flex flex-col justify-start items-end gap-5 overflow-hidden mt-[15px]">
            <div className="inline-flex justify-start items-start gap-[29px]">
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
                >
                  <Save className="mr-2" /> Gửi phản hồi
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}