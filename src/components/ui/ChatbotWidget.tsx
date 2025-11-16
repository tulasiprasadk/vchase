import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: number; from: string; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // optional: focus input when open
    if (open) {
      setTimeout(() => {
        boxRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      }, 0);
    }
  }, [open]);

  function sendMessage() {
    if (!input.trim()) return;
    const id = Date.now();
    setMessages((m) => [...m, { id, from: "user", text: input }]);
    setInput("");

    // fake bot reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: id + 1,
          from: "bot",
          text: "Thanks — we received your message. Someone will be in touch soon.",
        },
      ]);
    }, 800);
  }

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
      <div className="flex flex-col items-end">
        {open && (
          <div
            ref={boxRef}
            className="w-80 max-w-full bg-white rounded-2xl shadow-xl border border-slate-200 mb-3 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">Chat with VChase</span>
              </div>
              <button
                aria-label="Close chat"
                className="opacity-90 hover:opacity-100"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 h-64 overflow-y-auto bg-slate-50 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-slate-500">
                  Hi! How can we help you today?
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`text-sm max-w-full ${
                    m.from === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      m.from === "user"
                        ? "bg-purple-500 text-white"
                        : "bg-white text-slate-800 border"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-3 py-2 bg-white border-t">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-gray-700"
                />
                <button
                  onClick={sendMessage}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen((s) => !s)}
          aria-label="Open chat"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
