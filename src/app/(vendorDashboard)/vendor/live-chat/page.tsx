"use client";

import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  type: "user" | "agent";
  text: string;
}

export default function LiveChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "agent", text: "Hi there! How can we help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, type: "user", text: input.trim() },
    ]);

    setInput("");

    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "agent",
          text: "Thanks for your message! We will get back to you shortly.",
        },
      ]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <section className="min-h-screen bg-gray-900 py-16 px-4 sm:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gray-700 p-5 rounded-t-3xl">
          <MessageCircle className="w-7 h-7 text-pink-400" />
          <h2 className="text-white text-2xl font-bold">Live Chat Support</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[500px]">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.type === "user"
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 p-5 bg-gray-700 rounded-b-3xl">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-2xl bg-gray-600 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            className="p-3 bg-pink-400 hover:bg-pink-500 rounded-full transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
