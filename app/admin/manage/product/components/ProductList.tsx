"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  images?: string | null;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="border p-2 rounded-lg text-center">
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
              {product.images ? (
                <Image
                  src={product.images}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-500">Không có ảnh</span>
              )}
            </div>
            <p className="mt-2 font-semibold">{product.name}</p>
          </div>
        ))
      ) : (
        <p className="col-span-2 md:col-span-4 text-center">
          Không có sản phẩm nào
        </p>
      )}
    </div>
  );
}
