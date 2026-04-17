"use client";
import { buildClient } from "@/api/build-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface CurrentUser {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  currentUser: CurrentUser | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const client = buildClient({});
      const { data } = await client.get("/api/users/currentuser");
      setCurrentUser(data.currentUser);
    } catch (error) {
      setCurrentUser(null);
      console.log("Error fetching current user:", error);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ currentUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
