"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  images?: string[] | null;
}

export default function PageSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const productType = searchParams.get("productType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?query=${query || ""}&productType=${productType || ""}`);
        const text = await res.text();
      if (!text) {
        console.warn("Response từ /api/products rỗng");
        return;
      }
        const data = JSON.parse(text);
      console.log("Products from API:", data);

      if (Array.isArray(data)) {
        const processed = data.map((item: any) => ({
          ...item,
          images: item.images ? JSON.parse(item.images) : null,
        }));
        const filtered = processed.filter((item) => {
          const matchName = query
            ? item.name.toLowerCase().includes(query.toLowerCase())
            : true;
          const matchProductType = productType
            ? item.productType?.name?.toLowerCase() === productType.toLowerCase()
            : true;
          return matchName && matchProductType;
        });
        setProducts(filtered);
      } else {
        throw new Error("Dữ liệu không hợp lệ từ API products");
      }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, productType]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="flex-1 flex flex-row items-start justify-start py-[30px] px-[100px] gap-[60px] text-left font-inter">
        <div className="p-2">
          <h1 className="text-xl font-bold mb-4">Kết quả tìm kiếm</h1>
          {loading ? (
            <p>Đang tải...</p>
          ) : products.length === 0 ? (
            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          ) : (
            <div className="flex flex-wrap gap-10 p-2">
              {products.map((product) => (
                <div key={product.id} className="w-[200px] flex flex-col">
                  <div className="w-full h-[200px] border-primary border-[3px] flex items-center justify-center rounded-md">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="object-cover"
                      />
                      ) : (
                        <span className="text-gray-500">Không có ảnh</span>
                    )}
                  </div>
                  <div className="w-full flex flex-col px-2.5 gap-2.5">
                    <span className="font-semibold truncate whitespace-nowrap overflow-hidden">{product.name}</span>
                    <b className="text-base text-primary">{product.price.toLocaleString()}đ</b>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}