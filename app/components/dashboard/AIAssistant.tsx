"use client";

import React, { useState, useEffect } from "react";
import {
  SendIcon,
  BotIcon,
  PlusIcon,
  SmileIcon,
  ImageIcon,
  PaperclipIcon,
} from "lucide-react";
import Card from "../ui/Card";
interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}
const AIAssistant = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Aorium AI assistant. How can I help you analyze your data today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: messages.length + 2,
        text: data.reply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsTyping(false);
    }
  };
  return (
    <Card className="flex flex-col h-full" variant="highlight">
      <div className="p-4 border-b border-gold/20 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-1.5 rounded-full bg-gold/10 text-[#D4AF37] mr-3">
            <BotIcon size={18} />
          </div>
          <h3 className="font-montserrat font-semibold text-gold">
            AI Assistant
          </h3>
        </div>
        <div className="flex items-center">
          <span className="text-xs px-2 py-0.5 bg-gold/20 text-[#D4AF37] rounded-full">
            Online
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                message.isUser
                  ? "bg-gold/20 text-neutral-light rounded-tr-none"
                  : "bg-secondary/20 text-neutral-light rounded-tl-none"
              }`}
            >
              <p>{message.text}</p>
              {isMounted && (
                <div className="text-xs opacity-60 mt-1 flex justify-end">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-secondary/20 text-neutral-light rounded-tl-none">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-neutral-light/70 rounded-full animate-bounce"
                  style={{
                    animationDelay: "0ms",
                  }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral-light/70 rounded-full animate-bounce"
                  style={{
                    animationDelay: "150ms",
                  }}
                ></div>
                <div
                  className="w-2 h-2 bg-neutral-light/70 rounded-full animate-bounce"
                  style={{
                    animationDelay: "300ms",
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center">
          <div className="flex items-center space-x-2 text-neutral-light/60">
            <button className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5">
              <PlusIcon size={18} />
            </button>
            <button className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5">
              <PaperclipIcon size={18} />
            </button>
            <button className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5">
              <SmileIcon size={18} />
            </button>
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your AI assistant..."
            className="flex-1 bg-transparent border-none outline-none text-neutral-light placeholder-neutral-light/50 mx-2 py-2"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-colors ${
              inputText.trim()
                ? "bg-gold/20 text-[#D4AF37] hover:bg-gold/30"
                : "text-neutral-light/30"
            }`}
          >
            <SendIcon size={18} />
          </button>
        </div>
      </div>
    </Card>
  );
};
export default AIAssistant;
