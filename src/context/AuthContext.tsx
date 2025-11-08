import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { UserProfile } from "@/types";
import {
  onAuthStateChange,
  signInWithEmailAndPassword,
  signInWithGoogle as firebaseSignInWithGoogle,
  signOutUser,
  signUpWithEmailAndPassword,
} from "@/lib/firebase/auth";
import { getDocument, setDocument, updateDocument } from "@/lib/firebase/firestore";

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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: false,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
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

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(email, password);
    if (result.error) {
      setLoading(false);
      throw new Error(result.error);
    }
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      userData: Partial<UserProfile>
    ) => {
      setLoading(true);
      const displayName = `${userData.firstName ?? ""} ${
        userData.lastName ?? ""
      }`.trim();
      const result = await signUpWithEmailAndPassword(
        email,
        password,
        displayName || undefined
      );
      if (result.error) {
        setLoading(false);
        throw new Error(result.error);
      }

      if (result.user) {
        const { error } = await setDocument("users", result.user.uid, {
          ...userData,
          email,
          userType: userData.userType ?? "organizer",
          isActive: true,
        });
        if (error) {
          setLoading(false);
          throw new Error(error);
        }
      }
      setLoading(false);
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    const result = await firebaseSignInWithGoogle();
    if (result.error) {
      setLoading(false);
      throw new Error(result.error);
    }

    if (result.user) {
      const { data, error } = await getDocument<UserProfile>(
        "users",
        result.user.uid
      );
      if (error) {
        setLoading(false);
        throw new Error(error);
      }
      if (!data) {
        const displayName = result.user.displayName ?? "";
        const [firstName = "", ...rest] = displayName.split(" ");
        const { error: profileError } = await setDocument(
          "users",
          result.user.uid,
          {
            email: result.user.email ?? "",
            firstName,
            lastName: rest.join(" "),
            userType: "sponsor",
            isActive: true,
          }
        );
        if (profileError) {
          setLoading(false);
          throw new Error(profileError);
        }
      }
    }
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    const result = await signOutUser();
    if (result.error) {
      throw new Error(result.error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const { data, error } = await getDocument<UserProfile>(
          "users",
          firebaseUser.uid
        );
        if (!error && data) {
          setUserProfile({ ...data, id: firebaseUser.uid });
          const { error: updateError } = await updateDocument(
            "users",
            firebaseUser.uid,
            {
              lastLoginAt: new Date().toISOString(),
            }
          );
          if (updateError) {
            console.warn("Failed to update last login timestamp:", updateError);
          }
        } else if (error) {
          console.error("Failed to load user profile:", error);
          setUserProfile(null);
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }),
    [loading, signIn, signUp, signInWithGoogle, signOut, user, userProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
