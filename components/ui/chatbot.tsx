import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }

      const result = await response.json();
      const botResponse = result.response || "Không có phản hồi từ hệ thống.";

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Đã xảy ra lỗi khi kết nối với server.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div>
      {/* Nút tròn nhỏ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-red-500 text-white rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
      >
        💬
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[400px] h-[500px] bg-white border border-primary rounded-2xl shadow-xl flex flex-col">
          {/* Nội dung chat */}
          <div className="flex-1 w-full overflow-y-auto px-4 py-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-black"
                  } max-w-[70%]`}
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                <p className="text-gray-500 text-sm">Đang phân tích...</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 flex items-center relative">
            <div className="border rounded-lg flex items-center w-full relative">
              <input
                type="text"
                placeholder="Nhập yêu cầu của bạn..."
                className="flex-1 w-full !border-none pr-4 pl-4 pt-2 pb-2 mr-2 ml-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8"
              >
                <Send className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
