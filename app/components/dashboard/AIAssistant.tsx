"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  SendIcon,
  BotIcon,
  PlusIcon,
  SmileIcon,
  PaperclipIcon,
  Expand,
  Shrink,
  XIcon,
} from "lucide-react";
import Card from "../ui/Card";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  fileName?: string;
}

const Typewriter = ({ text, speed = 2.8 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return <p className="whitespace-pre-wrap">{displayedText}</p>;
};

const AIAssistant = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      textInputRef.current?.focus();
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    const newUserMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      fileName: selectedFile?.name,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");
    setIsTyping(true);
    const fileToSend = selectedFile;
    setSelectedFile(null);

    const formData = new FormData();
    formData.append("message", inputText);
    if (fileToSend) {
      formData.append("file", fileToSend);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const cleanedReply = data.reply.replace(/[^a-zA-Z0-9\s,-.]/g, "");

      // Artificial delay to ensure the typing indicator is visible
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1, // Ensure unique ID
          text: cleanedReply,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        setIsTyping(false);
      }, 1500); // 1.5-second delay
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
      setIsTyping(false);
    }
  };

  return (
    <Card
      className={`flex flex-col h-full  ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-[#071a3a]/90 backdrop-blur-sm"
          : "max-h-[600px]"
      }`}
      variant="highlight"
    >
      <div className="p-4 border-b border-[rgba(212,175,55,0.2)] flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-1.5 rounded-full bg-[rgba(212,175,55,0.1)] text-[#D4AF37] mr-3">
            <BotIcon size={18} />
          </div>
          <h3 className="font-montserrat font-semibold text-[#d4af37]">
            AI Assistant
          </h3>
        </div>
        <div className="flex items-center">
          <span className="text-xs px-2 py-0.5 bg-[rgba(212,175,55,0.2)] text-[#D4AF37] rounded-full">
            Online
          </span>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="ml-4 p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
          >
            {isFullScreen ? <Shrink size={18} /> : <Expand size={18} />}
          </button>
        </div>
      </div>
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isFullScreen ? "" : "min-h-[400px]"
        }`}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 shadow-md ${
                message.isUser
                  ? "bg-[rgba(212,175,55,0.2)] text-[#f3e9dc] rounded-tr-none"
                  : "bg-[rgba(144,177,211,0.2)] text-[#f3e9dc] rounded-tl-none"
              }`}
            >
              {message.isUser ? (
                <p className="whitespace-pre-wrap">{message.text}</p>
              ) : index === messages.length - 1 ? (
                <Typewriter text={message.text} />
              ) : (
                <p className="whitespace-pre-wrap">{message.text}</p>
              )}
              {message.fileName && (
                <div className="text-xs opacity-80 mt-2 p-2 bg-[rgba(0,0,0,0.2)] rounded-md">
                  Attached file: {message.fileName}
                </div>
              )}
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
            <div className="max-w-[80%] rounded-lg p-3 shadow-md rounded-tl-none bg-[rgba(144,177,211,0.2)]">
              <div className="flex items-center space-x-1.5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#d4af37] animate-subtle-bounce"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="px-4 pb-5 pt-2 border-t border-white/10 relative">
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-full mb-2 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        {selectedFile && (
          <div className="w-fit flex items-center justify-between px-2 py-1 bg-[rgba(0,0,0,0.2)] rounded-md mb-2">
            <span className="text-xs text-[#f3e9dc] truncate">
              {selectedFile.name}
            </span>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:text-red-500 flex-shrink-0"
            >
              <XIcon size={16} />
            </button>
          </div>
        )}
        <div className="flex items-center">
          <div className="flex items-center space-x-2 text-[rgba(243,233,220,0.6)]">
            <button className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5">
              <PlusIcon size={18} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
            >
              <PaperclipIcon size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
            >
              <SmileIcon size={18} />
            </button>
          </div>
          <input
            ref={textInputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your AI assistant..."
            className="flex-1 bg-transparent border-none outline-none text-[#f3e9dc] placeholder-[rgba(243,233,220,0.5)] mx-2 py-2"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() && !selectedFile}
            className={`p-2 rounded-full transition-colors ${
              inputText.trim() || selectedFile
                ? "bg-[rgba(212,175,55,0.2)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.3)]"
                : "text-[rgba(243,233,220,0.3)]"
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
