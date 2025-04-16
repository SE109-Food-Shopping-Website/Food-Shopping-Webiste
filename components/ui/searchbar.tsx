"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  images?: string[] | null;
}

export default function SearchBar({ selectedCategory }: { selectedCategory: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
  function highlightKeyword(text: string, keyword: string): React.ReactNode {
    if (!keyword.trim()) return text;
    const startIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (startIndex === -1) return text;
    const endIndex = startIndex + keyword.length;
    return (
      <>
        {text.slice(0, startIndex)}
        <span className="font-semibold text-primary">
          {text.slice(startIndex, endIndex)}
        </span>
        {text.slice(endIndex)}
      </>
    );
  }
            
  // Debounce khi gõ
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setDebouncedQuery(query), 300);
    }, [query]);

    // Gọi API khi debounced query thay đổi
    useEffect(() => {
      const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length < 2) {
          setSuggestions([]);
          return;
      }
      try {
        const res = await fetch(`/api/products/suggest?query=${debouncedQuery}&productType=${encodeURIComponent(selectedCategory)}`);
        const data = await res.json();
        const parsed = Array.isArray(data)
          ? data.map((item: any) => ({
            ...item,
            images:
              typeof item.images === "string"
              ? JSON.parse(item.images)
              : item.images ?? [],
            }))
            : [];
            setSuggestions(parsed); 
        } catch (error) {
          console.error("Lỗi khi lấy gợi ý:", error);
          setSuggestions([]);
        }
        };
      fetchSuggestions();
    }, [debouncedQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/client/collection/search?query=${encodeURIComponent(query)}&productType=${encodeURIComponent(selectedCategory)}`);
      setShowSuggestions(false);
    }
  };

    const handleSuggestionClick = (product: Product) => {
      router.push(`/client/collection/search?query=${encodeURIComponent(product.name)}`);
      setQuery(product.name);
      setShowSuggestions(false);
    };

    return (
      <div className="relative flex flex-1 items-center">
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-[30px] px-2 text-[14px] text-gray-700 border-none outline-none placeholder-gray-400"
          />
          <Button
            type="submit"
            className="w-[50px] rounded-[5px] h-[30px] flex items-center justify-center"
          >
            <Search className="text-white w-5 h-5" />
          </Button>
        </form>
        {showSuggestions && (
          <ul className="absolute top-full left-0 z-[9999] w-full bg-white border border-gray-300 rounded shadow-md max-h-[300px] overflow-y-auto mt-1">
            {debouncedQuery.trim().length >= 2 && suggestions.length === 0 ? (
              <li className="px-3 py-2 text-gray-500 text-sm">
                Không có sản phẩm nào phù hợp
              </li>
            ) : (
              suggestions.map((item) => (
                <li
                  key={item.id}
                  onMouseDown={() => handleSuggestionClick(item)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      ?
                    </div>
                  )}
                  <span className="text-sm text-gray-800 truncate">
                    {highlightKeyword(item.name, query)}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    )
}