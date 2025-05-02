"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  images: string;
};

type OrderDetail = {
  id: string;
  quantity: number;
  product: Product;
};

type Order = {
  id: string;
  orderDetails: OrderDetail[];
};

type Feedback = {
  id: number;
  rating: number;
  comment: string;
  images?: string;
  created_at: string;
  order: Order;
};

export default function PageAllRatings() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const averageRating = feedbacks.length
  ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
  : "0.0";

  useEffect(() => {
    fetch("/api/order/feedback/all")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const filteredFeedbacks = selectedRating
    ? feedbacks.filter((fb) => fb.rating === selectedRating)
    : feedbacks;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-center">
        Tất cả đánh giá của khách hàng
      </h1>
      {/* Bộ lọc rating */}
      <div className="flex flex-col items-center gap-2 mb-2">
      {feedbacks.length > 0 && (
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center text-yellow-400 text-xl mb-1">
            {Array.from({ length: 5 }, (_, i) => {
              if (parseFloat(averageRating) >= i + 1) {
                return <span key={i}>★</span>; 
              } else if (parseFloat(averageRating) > i && parseFloat(averageRating) < i + 1) {
                return <span key={i}>☆</span>; 
              } else {
                return <span key={i} className="text-gray-300">★</span>; 
              }
            })}
          </div>
          <div className="flex items-baseline justify-center text-primary font-bold">
            <span className="text-4xl leading-none">{averageRating}</span>
            <span className="text-base text-gray-700 font-medium ml-2">trên 5</span>
          </div>
        </div>
      )}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedRating(null)}
            className={`px-3 py-1 border rounded ${
              selectedRating === null
                ? "bg-primary text-white"
                : "bg-white text-base text-foreground"
            }`}
          >
            Tất cả đánh giá
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setSelectedRating(rating === selectedRating ? null : rating)
              }
              className={`px-3 py-1 border rounded flex items-center gap-1 ${
                selectedRating === rating
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <span>{rating}</span>
              <span className="text-yellow-500">⭐</span>
            </button>
          ))}
        </div>
      </div>
      {/* Hiển thị feedback */}
      {filteredFeedbacks.length > 0 ? (
        filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="border p-4 mb-4 rounded bg-yellow-50 shadow-sm"
          >
            <div className="mb-2 text-sm text-gray-700">
            <b>Đơn hàng:</b> #{String(fb.order.id).slice(0, 8)} 
            </div>
            <div className="text-yellow-600 mb-2">
              <b>Đánh giá:</b> {fb.rating}/5
            </div>
            <div className="mb-2">
              <div className="flex items-center gap-1S">
                <b>Bình luận:</b>
                <span className="text-gray-700">{fb.comment || "Không có nội dung"}</span>
                <span className="text-sm text-gray-400 ml-1">
                  {new Date(fb.created_at).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
            {fb.images && (
              <div className="flex gap-2 mt-2">
                {(() => {
                  try {
                    const imgs = JSON.parse(fb.images);
                    if (Array.isArray(imgs)) {
                      return imgs.map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          className="w-[60px] h-[60px] object-cover rounded"
                          alt={`feedback-img-${i}`}
                        />
                      ));
                    }
                  } catch {}
                  return null;
                })()}
              </div>
            )}
            {/* Sản phẩm liên quan */}
            <div className="flex flex-col gap-3 mt-3">
              {fb.order.orderDetails.map((detail) => {
                let imageSrc = "/ava.png";
                try {
                  const parsedImages = JSON.parse(detail.product.images);
                  if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                    imageSrc = parsedImages[0];
                  }
                } catch {}

                return (
                  <div key={detail.id} className="flex gap-2 items-center">
                    <img
                      src={imageSrc}
                      className="w-[40px] h-[40px] object-cover rounded"
                      alt={detail.product.name}
                    />
                    <span className="text-sm text-gray-700">
                      {detail.product.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">Chưa có đánh giá</div>
      )}
    </div>
  );
}