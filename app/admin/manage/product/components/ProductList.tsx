"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  images?: string[] | null;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const processed = data.map((item: any) => ({
          ...item,
          images: item.images ? JSON.parse(item.images) : null,
        }));
        setProducts(processed);
        // setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 p-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg text-center"
            onClick={() =>
              router.push(`/admin/manage/product/update/${product.id}`)
            }
          >
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-cover w-full h-full hover:cursor-pointer"
                />
              ) : (
                <span className="text-gray-500">Không có ảnh</span>
              )}
            </div>
            <p className="mt-2 font-semibold">{product.name}</p>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center">Không có sản phẩm nào</p>
      )}
    </div>
  );
}
