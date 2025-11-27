import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { UserProfile } from "@/types";
import {
  onAuthStateChange,
  signInWithEmailAndPassword,
  signUpWithEmailAndPassword,
  signInWithGoogle as firebaseGoogleSignIn,
  signOutUser,
  updateUserPassword,
} from "@/lib/firebase/auth";
import { getDocument, setDocument } from "@/lib/firebase/firestore";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  changePassword: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (
    firebaseUser: User,
    additionalData?: Partial<UserProfile>
  ) => {
    const userRef = await getDocument("users", firebaseUser.uid);

    if (!userRef.data) {
      const userData: UserProfile = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName:
          additionalData && additionalData.firstName
            ? additionalData.firstName
            : "",
        lastName:
          additionalData && additionalData.lastName
            ? additionalData.lastName
            : "",
        companyName:
          additionalData && additionalData.companyName
            ? additionalData.companyName
            : "",
        contactNumber:
          additionalData && additionalData.contactNumber
            ? additionalData.contactNumber
            : "",
        userType:
          additionalData && additionalData.userType
            ? additionalData.userType
            : "organizer",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        profileImage: firebaseUser.photoURL || "",
        // Add verification fields with default values
        isActive: true,
        isVerified: false,
        verificationStatus: "not_requested",
        permissions: [],
        ...additionalData,
      };

      await setDocument(
        "users",
        firebaseUser.uid,
        userData as unknown as Record<string, unknown>
      );
      return userData;
    } else {
      return userRef.data as UserProfile;
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(email, password);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<UserProfile>
  ) => {
    const displayName =
      userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : "";

    const result = await signUpWithEmailAndPassword(
      email,
      password,
      displayName
    );
    if (result.error) {
      throw new Error(result.error);
    }

    if (result.user) {
      await createUserProfile(result.user, userData);
    }
  };

  const signInWithGoogle = async () => {
    const result = await firebaseGoogleSignIn();
    if (result.error) {
      throw new Error(result.error);
    }

    if (result.user) {
      const names = result.user.displayName
        ? result.user.displayName.split(" ")
        : [];
      await createUserProfile(result.user, {
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        companyName: "", // Will need to be filled later
        contactNumber: "", // Will need to be filled later
        userType: "organizer", // Default type
      });
    }
  };

  const signOut = async () => {
    const result = await signOutUser();
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    const result = await updateUserPassword(currentPassword, newPassword);
    if (result.error) {
      throw new Error(result.error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const { data: profile } = await getDocument(
            "users",
            firebaseUser.uid
          );
          setUserProfile(profile as UserProfile);
        } catch (error) {
          console.error("Error loading user profile:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
