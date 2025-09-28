import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useMessaging, Chat } from "../../hooks/useMessaging";
import toast from "react-hot-toast";
import {
  Send,
  Search,
  MessageCircle,
  Users,
  Building,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
  Plus,
  CheckCheck,
  Check,
} from "lucide-react";

const MessagingPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { chat: chatParam } = router.query;

  const {
    chats,
    messages,
    sendMessage,
    loading,
    markAsRead,
    subscribeToChats,
    subscribeToChat,
    unreadTotal,
  } = useMessaging();

  // UI State Management
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sending, setSending] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterTags, setFilterTags] = useState<string>("all");

  // Refs for UI management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize subscriptions
  useEffect(() => {
    if (!user) return;

    const unsubscribeChats = subscribeToChats();

    return () => {
      unsubscribeChats();
    };
  }, [user, subscribeToChats]);

  // Handle chat selection from URL parameter
  useEffect(() => {
    if (chatParam && typeof chatParam === "string" && chats.length > 0) {
      const targetChat = chats.find((chat) => chat.id === chatParam);
      if (targetChat && targetChat.id !== selectedChat?.id) {
        handleSelectChat(targetChat);
      }
    }
  }, [chatParam, chats, selectedChat]);

  // Subscribe to selected chat messages
  useEffect(() => {
    if (!selectedChat) return;

    const unsubscribeChat = subscribeToChat(selectedChat.id);
    markAsRead(selectedChat.id);

    return () => {
      unsubscribeChat();
    };
  }, [selectedChat, subscribeToChat, markAsRead]);

  // Handle chat selection with mobile responsiveness
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);

    // Update URL without triggering navigation
    const newUrl = `/dashboard/messages?chat=${chat.id}`;
    window.history.replaceState(null, "", newUrl);

    // Focus message input on desktop
    if (window.innerWidth >= 768) {
      setTimeout(() => messageInputRef.current?.focus(), 100);
    }
  };

  // Handle message sending with enhanced UX
  const handleSendMessage = async () => {
    if (!selectedChat || !messageText.trim() || sending) return;

    setSending(true);
    const tempText = messageText;
    setMessageText(""); // Clear input immediately for better UX

    try {
      await sendMessage(selectedChat.id, tempText);
    } catch {
      // Restore message text on error
      setMessageText(tempText);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
      messageInputRef.current?.focus();
    }
  };

  // Handle Enter key for message sending
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Filter chats based on search and filters
  const filteredChats = chats.filter((chat) => {
    const searchMatch =
      searchTerm === "" ||
      Object.values(chat.metadata.participants).some(
        (participant) =>
          participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          participant.companyName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      ) ||
      chat.metadata.eventTitle
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      chat.metadata.lastMessage.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const priorityMatch =
      filterPriority === "all" || chat.metadata.priority === filterPriority;
    const tagsMatch =
      filterTags === "all" || chat.metadata.tags.includes(filterTags);

    return searchMatch && priorityMatch && tagsMatch;
  });

  // Get other participant info
  const getOtherParticipant = (chat: Chat) => {
    const participants = Object.values(chat.metadata.participants);
    return participants.find((p) => p.id !== user?.uid) || participants[0];
  };

  // Format timestamp for display
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Mobile back handler
  const handleMobileBack = () => {
    setShowMobileChat(false);
    setSelectedChat(null);
    const newUrl = "/dashboard/messages";
    window.history.replaceState(null, "", newUrl);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading messages...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Head>
          <title>Messages - Event Sponsor Platform</title>
        </Head>

        <div className="h-[calc(100vh-4rem)] flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Chat List Sidebar - Mobile Responsive */}
          <div
            className={`
            ${showMobileChat ? "hidden md:flex" : "flex"} 
            md:w-96 w-full flex-col border-r border-gray-200 bg-gray-50
          `}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-semibold text-gray-900">
                    Messages
                  </h1>
                  {unreadTotal > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                      {unreadTotal > 99 ? "99+" : unreadTotal}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* TODO: New chat modal */
                  }}
                  className="hidden md:flex"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters - Mobile Responsive */}
              <div className="flex space-x-2 mt-3 overflow-x-auto">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filterTags}
                  onChange={(e) => setFilterTags(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="all">All Tags</option>
                  <option value="enquiry">Enquiries</option>
                  <option value="sponsorship">Sponsorships</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto" ref={chatListRef}>
              {filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm
                      ? "No matching conversations"
                      : "No conversations yet"}
                  </h3>
                  <p className="text-gray-600 text-sm max-w-xs">
                    {searchTerm
                      ? "Try adjusting your search or filters"
                      : "Start engaging with sponsors or organizers to begin messaging"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredChats.map((chat) => {
                    const otherParticipant = getOtherParticipant(chat);
                    const unreadCount =
                      chat.metadata.unreadCount[user?.uid || ""] || 0;
                    const isSelected = selectedChat?.id === chat.id;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat)}
                        className={`
                          relative p-3 rounded-lg cursor-pointer transition-all duration-200 group
                          ${
                            isSelected
                              ? "bg-blue-50 border-blue-200 shadow-sm"
                              : "hover:bg-white hover:shadow-sm border-transparent"
                          }
                          border
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            {otherParticipant.avatar ? (
                              <img
                                src={otherParticipant.avatar}
                                alt={otherParticipant.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium
                                ${
                                  otherParticipant.role === "organizer"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }
                              `}
                              >
                                {otherParticipant.role === "organizer" ? (
                                  <Users className="w-5 h-5" />
                                ) : (
                                  <Building className="w-5 h-5" />
                                )}
                              </div>
                            )}
                            {/* Online indicator */}
                            {otherParticipant.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          {/* Chat Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3
                                className={`
                                text-sm font-medium truncate
                                ${
                                  unreadCount > 0
                                    ? "text-gray-900"
                                    : "text-gray-800"
                                }
                              `}
                              >
                                {otherParticipant.name}
                              </h3>
                              <div className="flex items-center space-x-1">
                                {/* Priority indicator */}
                                <div
                                  className={`
                                  w-2 h-2 rounded-full
                                  ${
                                    chat.metadata.priority === "high"
                                      ? "bg-red-500"
                                      : chat.metadata.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }
                                `}
                                ></div>
                                <span className="text-xs text-gray-500">
                                  {formatTime(
                                    chat.metadata.lastMessage.timestamp
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Company/Role info */}
                            <div className="flex items-center space-x-2 mb-1">
                              <span
                                className={`
                                text-xs px-2 py-0.5 rounded-full
                                ${
                                  otherParticipant.role === "organizer"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }
                              `}
                              >
                                {otherParticipant.role === "organizer"
                                  ? "Organizer"
                                  : "Sponsor"}
                              </span>
                              {otherParticipant.companyName && (
                                <span className="text-xs text-gray-500 truncate">
                                  {otherParticipant.companyName}
                                </span>
                              )}
                            </div>

                            {/* Event title if available */}
                            {chat.metadata.eventTitle && (
                              <div className="text-xs text-blue-600 mb-1 truncate">
                                📅 {chat.metadata.eventTitle}
                              </div>
                            )}

                            {/* Last message */}
                            <div className="flex items-center justify-between">
                              <p
                                className={`
                                text-sm truncate flex-1
                                ${
                                  unreadCount > 0
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-600"
                                }
                              `}
                              >
                                {chat.metadata.lastMessage.messageType ===
                                  "system" && "🔔 "}
                                {chat.metadata.lastMessage.messageType ===
                                  "file" && "📎 "}
                                {chat.metadata.lastMessage.text}
                              </p>
                              {unreadCount > 0 && (
                                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] text-center ml-2">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {chat.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {chat.metadata.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {chat.metadata.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{chat.metadata.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area - Mobile Responsive */}
          <div
            className={`
            ${showMobileChat ? "flex" : "hidden md:flex"} 
            flex-1 flex-col bg-white
          `}
          >
            {!selectedChat ? (
              // Empty state
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose a conversation from the sidebar to start messaging
                    with organizers and sponsors.
                  </p>
                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCheck className="w-4 h-4 text-green-500" />
                      <span>Real-time messaging</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>Organizer & Sponsor communication</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Building className="w-4 h-4 text-purple-500" />
                      <span>Professional CRM features</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Mobile back button */}
                      <button
                        onClick={handleMobileBack}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      {/* Participant info */}
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const otherParticipant =
                            getOtherParticipant(selectedChat);
                          return (
                            <>
                              {otherParticipant.avatar ? (
                                <img
                                  src={otherParticipant.avatar}
                                  alt={otherParticipant.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`
                                  w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium
                                  ${
                                    otherParticipant.role === "organizer"
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                                  }
                                `}
                                >
                                  {otherParticipant.role === "organizer" ? (
                                    <Users className="w-5 h-5" />
                                  ) : (
                                    <Building className="w-5 h-5" />
                                  )}
                                </div>
                              )}
                              <div>
                                <h2 className="font-semibold text-gray-900">
                                  {otherParticipant.name}
                                </h2>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`
                                    text-xs px-2 py-0.5 rounded-full
                                    ${
                                      otherParticipant.role === "organizer"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }
                                  `}
                                  >
                                    {otherParticipant.role === "organizer"
                                      ? "Event Organizer"
                                      : "Sponsor"}
                                  </span>
                                  {otherParticipant.isOnline && (
                                    <div className="flex items-center space-x-1">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-xs text-green-600">
                                        Online
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      {/* Priority indicator */}
                      <div
                        className={`
                        px-3 py-1 rounded-full text-xs font-medium border
                        ${getPriorityColor(selectedChat.metadata.priority)}
                      `}
                      >
                        {selectedChat.metadata.priority.toUpperCase()} PRIORITY
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden sm:flex"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden sm:flex"
                        >
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Event context if available */}
                  {selectedChat.metadata.eventTitle && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Event Discussion
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        📅 {selectedChat.metadata.eventTitle}
                      </p>
                      {selectedChat.metadata.tags.includes("enquiry") && (
                        <p className="text-xs text-blue-600 mt-1">
                          💼 Sponsorship Enquiry Discussion
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.senderId === user?.uid;
                      const isSystem = message.type === "system";

                      if (isSystem) {
                        return (
                          <div key={message.id} className="flex justify-center">
                            <div className="bg-gray-200 text-gray-700 text-xs px-3 py-2 rounded-full max-w-xs text-center">
                              {message.text}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md ${
                              isOwn ? "order-2" : "order-1"
                            }`}
                          >
                            <div
                              className={`
                                px-4 py-2 rounded-2xl shadow-sm
                                ${
                                  isOwn
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                                }
                              `}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.text}
                              </p>
                            </div>

                            {/* Message metadata */}
                            <div
                              className={`flex items-center space-x-2 mt-1 px-1 ${
                                isOwn ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span className="text-xs text-gray-500">
                                {formatTime(message.timestamp)}
                              </span>
                              {isOwn && (
                                <div className="text-gray-400">
                                  {message.readBy &&
                                  Object.keys(message.readBy).length > 1 ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Avatar for other participant */}
                          {!isOwn && (
                            <div className="order-0 mr-2 flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {message.senderName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <input
                        ref={messageInputRef}
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={sending}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sending}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-2xl transition-colors"
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Typing indicator area */}
                  <div className="mt-2 h-4">
                    {/* TODO: Add typing indicators */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default MessagingPage;
