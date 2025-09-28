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
  Trash2,
  MessageSquare,
} from "lucide-react";
import Card from "../ui/Card";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useSession } from "next-auth/react";

interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: Date;
  fileName?: string;
}

interface UserData {
  name?: string;
  businessName?: string;
  businessType?: string;
  region?: string;
  industry?: string;
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
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/user");
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchChats = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/chats");
          if (response.ok) {
            const data = await response.json();
            setChats(data);
            if (data.length > 0 && !activeChatId) {
              setActiveChatId(data[0].id);
            }
          }
        } catch (error) {
          console.error("Failed to fetch chats:", error);
        }
      }
    };

    fetchChats();
  }, [session]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChatId) {
        try {
          const response = await fetch(`/api/chats/${activeChatId}/messages`);
          if (response.ok) {
            const data = await response.json();
            setMessages(data.map(m => ({...m, createdAt: new Date(m.createdAt)})));
          } else {
            setInitialMessage();
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          setInitialMessage();
        }
      }
    };

    const setInitialMessage = () => {
        setMessages([
            {
              id: "1",
              text: `Hello ${userData?.name || ''}! I'm your Aorium AI assistant. How can I help you with your ${userData?.businessType || 'business'} in the ${userData?.industry || 'industry'} today?`,
              isUser: false,
              createdAt: new Date(),
            },
          ]);
    }

    if (activeChatId) {
        fetchMessages();
    } else {
        setInitialMessage();
    }
  }, [activeChatId, userData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        chatListRef.current &&
        !chatListRef.current.contains(event.target as Node)
      ) {
        setShowChatList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNewChat = async () => {
    if (chats.length >= 8) {
      return;
    }
    setActiveChatId(null);
    setMessages([
        {
          id: "1",
          text: `Hello ${userData?.name || ''}! I'm your Aorium AI assistant. How can I help you with your ${userData?.businessType || 'business'} in the ${userData?.industry || 'industry'} today?`,
          isUser: false,
          createdAt: new Date(),
        },
      ]);
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedChats = chats.filter((chat) => chat.id !== chatId);
        setChats(updatedChats);
        if (activeChatId === chatId) {
          setActiveChatId(updatedChats.length > 0 ? updatedChats[0].id : null);
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    let currentChatId = activeChatId;
    let isNewChat = false;

    if (!currentChatId) {
        isNewChat = true;
        try {
            const response = await fetch("/api/chats", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name: "New Chat" }),
            });
            if (response.ok) {
              const newChat = await response.json();
              setChats([newChat, ...chats]);
              currentChatId = newChat.id;
              setActiveChatId(newChat.id);
            }
          } catch (error) {
            console.error("Failed to create new chat:", error);
            return;
          }
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      createdAt: new Date(),
      fileName: selectedFile?.name,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    const messageForTitle = inputText;
    setInputText("");
    setIsTyping(true);
    const fileToSend = selectedFile;
    setSelectedFile(null);

    const formData = new FormData();
    formData.append("message", messageForTitle);
    if (fileToSend) {
      formData.append("file", fileToSend);
    }

    try {
        if (isNewChat && currentChatId) {
            const titleResponse = await fetch("/api/chat", {
                method: "POST",
                body: new URLSearchParams({ message: `Generate a short, concise title (3-5 words) for a conversation that starts with: "${messageForTitle}"` }),
            });
            if (titleResponse.ok) {
                const titleData = await titleResponse.json();
                const newName = titleData.reply.replace(/[^a-zA-Z0-9\s,-.]/g, "");
                await fetch(`/api/chats/${currentChatId}/name`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: newName })
                });
                setChats(chats.map(chat => chat.id === currentChatId ? {...chat, name: newName} : chat));
            }
        }

      await fetch(`/api/chats/${currentChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: messageForTitle, isUser: true }),
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const cleanedReply = data.reply.replace(/[^a-zA-Z0-9\s,-.]/g, "");

      await fetch(`/api/chats/${currentChatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: cleanedReply, isUser: false }),
      });

      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: cleanedReply,
          isUser: false,
          createdAt: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        createdAt: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
      setIsTyping(false);
    }
  };

  return (
    <Card
      className={`flex h-full ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-[#071a3a]/90 backdrop-blur-sm"
          : "max-h-[600px]"
      }`}
      variant="highlight"
    >
        <div ref={chatListRef} className={`absolute top-0 left-0 h-full w-64 bg-[#071a3a] z-20 flex flex-col p-4 transform ${showChatList ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <h2 className="text-lg font-semibold text-[#D4AF37] mb-4">Chats</h2>
            {chats.length >= 6 && (
                <div className="bg-yellow-500/20 text-yellow-300 text-xs p-2 rounded-md mb-4">
                    You are approaching the chat limit ({chats.length}/8). Please consider deleting some old chats.
                </div>
            )}
            <button onClick={handleNewChat} className="bg-[#D4AF37] text-[#071A3A] rounded-md px-4 py-2 mb-4 font-semibold hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#a5851d] hover:scale-105">New Chat</button>
            <div className="flex-1 overflow-y-auto space-y-2">
                {chats.map(chat => (
                    <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className={`p-2 rounded-md cursor-pointer group ${activeChatId === chat.id ? 'bg-[#D4AF37]/20' : 'hover:bg-white/10'}`}>
                        <div className="flex justify-between items-center">
                            <p className="text-white truncate group-hover:text-[#D4AF37]">{chat.name}</p>
                            <button onClick={(e) => {e.stopPropagation(); handleDeleteChat(chat.id)}} className="text-red-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      <div className="flex flex-col h-full w-full">
        <div className="p-4 border-b border-[rgba(212,175,55,0.2)] flex items-center justify-between">
            <div className="flex items-center">
                <button onClick={() => setShowChatList(!showChatList)} className="p-1.5 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5 mr-2">
                    <MessageSquare size={18} />
                </button>
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
                    {new Date(message.createdAt).toLocaleTimeString([], {
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
            <div
              ref={emojiPickerRef}
              className="absolute bottom-full mb-2 z-10"
            >
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
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
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
      </div>
    </Card>
  );
};

export default AIAssistant;