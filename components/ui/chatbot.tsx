import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mockResponses = [
    "Xin chào! Tôi có thể giúp gì cho bạn?",
    "Vui lòng cung cấp thêm thông tin.",
    "Cảm ơn bạn đã liên hệ!",
    "Tôi sẽ kiểm tra và phản hồi sớm nhất.",
    "Bạn cần hỗ trợ về sản phẩm nào?"
  ];

  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
          sender: "bot",
        },
      ]);
    }, 1500);
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
        <div className="fixed bottom-20 right-4 w-[400px] h-[500px] bg-white rounded shadow-lg flex flex-col">
          {/* Nút đóng */}
          {/* <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-primary z-10"
          >
            ✖
          </button> */}

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
                  {msg.text}
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
          <div className="p-2 border-t flex items-center relative">
            <Input
              type="text"
              placeholder="Nhập yêu cầu của bạn..."
              className="flex-1 pr-10 w-full"
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
      )}
    </div>
  );
};

export default ChatWidget;