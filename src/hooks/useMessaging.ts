import { useState, useCallback } from "react";
import { ref, push, onValue, update, get } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { realtimeDb, db } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

// Helper function to remove undefined values for Firebase
const removeUndefinedValues = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const cleaned: Record<string, unknown> = {};
  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        const nestedCleaned = removeUndefinedValues(
          obj[key] as Record<string, unknown>
        );
        if (Object.keys(nestedCleaned).length > 0) {
          cleaned[key] = nestedCleaned;
        }
      } else {
        cleaned[key] = obj[key];
      }
    }
  }
  return cleaned as Partial<T>;
};

// Enhanced interfaces for better CRM functionality
interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: "organizer" | "sponsor";
  avatar?: string;
  companyName?: string;
  lastSeen?: number;
  isOnline?: boolean;
}

interface ChatMetadata {
  participants: { [userId: string]: UserInfo };
  lastMessage: {
    text: string;
    timestamp: number;
    senderId: string;
    senderName: string;
    messageType: "text" | "system" | "file";
  };
  enquiryId?: string;
  eventTitle?: string;
  eventId?: string;
  sponsorshipStatus?: "pending" | "active" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  tags: string[];
  createdAt: number;
  updatedAt: number;
  unreadCount: { [userId: string]: number };
  archived: { [userId: string]: boolean };
}

export interface MessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "organizer" | "sponsor";
  text: string;
  timestamp: number;
  type: "text" | "system" | "file";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  edited?: boolean;
  editedAt?: number;
  readBy?: { [userId: string]: number };
}

export interface Chat {
  id: string;
  metadata: ChatMetadata;
}

// Main messaging hook with enhanced CRM functionality
export const useMessaging = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);

  // Get user role from Firestore with fallback
  const getUserRole = useCallback(
    async (userId: string): Promise<"organizer" | "sponsor"> => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return userData.role || "sponsor";
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
      return "sponsor"; // Default fallback
    },
    []
  );

  // Enhanced user info fetching with better data handling
  const fetchUserInfo = useCallback(
    async (userId: string): Promise<UserInfo | null> => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            id: userId,
            name:
              userData.displayName ||
              userData.name ||
              userData.email?.split("@")[0] ||
              "Unknown User",
            email: userData.email || "",
            role: userData.role || "sponsor",
            avatar: userData.photoURL || userData.avatar,
            companyName: userData.companyName,
            lastSeen: userData.lastSeen || Date.now(),
            isOnline: userData.isOnline || false,
          };
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }

      // Fallback for missing user data
      return {
        id: userId,
        name: "Unknown User",
        email: "",
        role: "sponsor",
        lastSeen: Date.now(),
        isOnline: false,
      };
    },
    []
  );

  // Find existing chat between participants
  const findExistingChat = useCallback(
    async (
      organizerId: string,
      sponsorId: string,
      enquiryId?: string
    ): Promise<string | null> => {
      try {
        const chatsRef = ref(realtimeDb, "chats");
        const snapshot = await get(chatsRef);

        if (!snapshot.exists()) return null;

        const allChats = snapshot.val();

        for (const [chatId, chatData] of Object.entries(allChats)) {
          const chat = chatData as { metadata: ChatMetadata };
          const participants = chat.metadata?.participants || {};

          // Check if both users are participants
          const hasOrganizer = participants[organizerId];
          const hasSponsor = participants[sponsorId];

          if (hasOrganizer && hasSponsor) {
            // If enquiry-specific, check for matching enquiry
            if (enquiryId && chat.metadata?.enquiryId === enquiryId) {
              return chatId;
            }
            // If no specific enquiry, return first matching chat
            if (!enquiryId) {
              return chatId;
            }
          }
        }

        return null;
      } catch (error) {
        console.error("Error finding existing chat:", error);
        return null;
      }
    },
    []
  );

  // Create new chat with enhanced metadata
  const createChat = useCallback(
    async (
      organizerId: string,
      sponsorId: string,
      options: {
        enquiryId?: string;
        eventTitle?: string;
        eventId?: string;
        priority?: "low" | "medium" | "high";
        tags?: string[];
      } = {}
    ): Promise<string> => {
      if (!user) throw new Error("User not authenticated");

      try {
        // Check if chat already exists
        const existingChatId = await findExistingChat(
          organizerId,
          sponsorId,
          options.enquiryId
        );
        if (existingChatId) return existingChatId;

        // Fetch participant information
        const [organizerInfo, sponsorInfo] = await Promise.all([
          fetchUserInfo(organizerId),
          fetchUserInfo(sponsorId),
        ]);

        if (!organizerInfo || !sponsorInfo) {
          throw new Error("Could not fetch user information");
        }

        // Create new chat with enhanced metadata
        const chatRef = ref(realtimeDb, "chats");
        const newChatRef = push(chatRef);
        const chatId = newChatRef.key!;

        const chatMetadata: ChatMetadata = {
          participants: {
            [organizerId]: organizerInfo,
            [sponsorId]: sponsorInfo,
          },
          lastMessage: {
            text: "Conversation started",
            timestamp: Date.now(),
            senderId: user.uid,
            senderName: user.displayName || "User",
            messageType: "system",
          },
          enquiryId: options.enquiryId,
          eventTitle: options.eventTitle,
          eventId: options.eventId,
          priority: options.priority || "medium",
          tags: options.tags || ["general"],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          unreadCount: {
            [organizerId]: organizerId === user.uid ? 0 : 1,
            [sponsorId]: sponsorId === user.uid ? 0 : 1,
          },
          archived: {
            [organizerId]: false,
            [sponsorId]: false,
          },
        };

        // Clean the metadata to remove undefined values
        const cleanedChatMetadata = removeUndefinedValues(
          chatMetadata as unknown as Record<string, unknown>
        );

        await update(
          ref(realtimeDb, `chats/${chatId}/metadata`),
          cleanedChatMetadata
        );

        // Send initial system message
        const messageData: MessageData = {
          id: Date.now().toString(),
          senderId: "system",
          senderName: "System",
          senderRole: "sponsor", // System messages default to sponsor role
          text: `Conversation started between ${organizerInfo.name} and ${sponsorInfo.name}`,
          timestamp: Date.now(),
          type: "system",
          readBy: { [user.uid]: Date.now() },
        };

        await update(
          ref(realtimeDb, `chats/${chatId}/messages/${messageData.id}`),
          messageData
        );

        return chatId;
      } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
      }
    },
    [user, fetchUserInfo, findExistingChat]
  );

  // Enhanced message sending
  const sendMessage = useCallback(
    async (
      chatId: string,
      text: string,
      messageType: "text" | "system" | "file" = "text"
    ): Promise<void> => {
      if (!user || !text.trim()) return;

      try {
        const userRole = await getUserRole(user.uid);
        const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
        const newMessageRef = push(messagesRef);

        const messageData: MessageData = {
          id: newMessageRef.key!,
          senderId: user.uid,
          senderName: user.displayName || "Unknown User",
          senderRole: userRole,
          text: text.trim(),
          timestamp: Date.now(),
          type: messageType,
          readBy: { [user.uid]: Date.now() },
        };

        await update(newMessageRef, messageData);

        // Update chat metadata
        const metadataUpdate = {
          lastMessage: {
            text: text.trim(),
            timestamp: Date.now(),
            senderId: user.uid,
            senderName: user.displayName || "Unknown User",
            messageType,
          },
          updatedAt: Date.now(),
        };

        await update(
          ref(realtimeDb, `chats/${chatId}/metadata`),
          metadataUpdate
        );

        // Update unread counts for other participants
        const chatSnapshot = await get(
          ref(realtimeDb, `chats/${chatId}/metadata/participants`)
        );
        if (chatSnapshot.exists()) {
          const participants = chatSnapshot.val();
          const unreadUpdates: Record<string, number> = {};

          Object.keys(participants).forEach((participantId) => {
            if (participantId !== user.uid) {
              unreadUpdates[`unreadCount/${participantId}`] = Date.now();
            }
          });

          if (Object.keys(unreadUpdates).length > 0) {
            await update(
              ref(realtimeDb, `chats/${chatId}/metadata`),
              unreadUpdates
            );
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        throw error;
      }
    },
    [user, getUserRole]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    async (chatId: string): Promise<void> => {
      if (!user) return;

      try {
        const updates = {
          [`unreadCount/${user.uid}`]: 0,
        };

        await update(ref(realtimeDb, `chats/${chatId}/metadata`), updates);
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    },
    [user]
  );

  // Subscribe to user's chats
  const subscribeToChats = useCallback(() => {
    if (!user) return () => {};

    setLoading(true);
    const chatsRef = ref(realtimeDb, "chats");

    const unsubscribe = onValue(
      chatsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setChats([]);
          setLoading(false);
          return;
        }

        const allChats = snapshot.val();
        const userChats: Chat[] = [];
        let totalUnread = 0;

        Object.entries(allChats).forEach(([chatId, chatData]) => {
          const chat = chatData as { metadata: ChatMetadata };
          const participants = chat.metadata?.participants || {};

          // Check if current user is a participant and not archived
          if (participants[user.uid] && !chat.metadata?.archived?.[user.uid]) {
            userChats.push({
              id: chatId,
              metadata: chat.metadata,
            });

            // Count unread messages
            const unreadCount = chat.metadata?.unreadCount?.[user.uid] || 0;
            totalUnread += typeof unreadCount === "number" ? unreadCount : 0;
          }
        });

        // Sort by last activity
        userChats.sort(
          (a, b) => (b.metadata.updatedAt || 0) - (a.metadata.updatedAt || 0)
        );

        setChats(userChats);
        setUnreadTotal(totalUnread);
        setLoading(false);
      },
      (error) => {
        console.error("Error subscribing to chats:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Subscribe to specific chat messages
  const subscribeToChat = useCallback((chatId: string) => {
    if (!chatId) return () => {};

    setActiveChat(chatId);
    const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);

    const unsubscribe = onValue(
      messagesRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setMessages([]);
          return;
        }

        const messagesData = snapshot.val();
        const messagesList: MessageData[] = Object.entries(messagesData)
          .map(([messageId, messageData]) => ({
            id: messageId,
            ...(messageData as Omit<MessageData, "id">),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessages(messagesList);
      },
      (error) => {
        console.error("Error subscribing to chat:", error);
      }
    );

    return unsubscribe;
  }, []);

  // Legacy support for enquiry-based chat creation
  const findOrCreateChatForEnquiry = useCallback(
    async (
      organizerId: string,
      sponsorId: string,
      organizerName: string,
      sponsorName: string,
      organizerEmail: string,
      sponsorEmail: string,
      enquiryId?: string,
      eventTitle?: string,
      eventId?: string
    ): Promise<string> => {
      return await createChat(organizerId, sponsorId, {
        enquiryId,
        eventTitle,
        eventId,
        priority: "medium",
        tags: ["enquiry", "sponsorship"],
      });
    },
    [createChat]
  );

  return {
    chats,
    messages,
    loading,
    activeChat,
    unreadTotal,
    sendMessage,
    markAsRead,
    createChat,
    subscribeToChats,
    subscribeToChat,
    findOrCreateChatForEnquiry,
    getUserRole,
  };
};
