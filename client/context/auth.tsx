"use client";
import { adminAPI } from "@/lib/api";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Admin {
  _id: string;
  name: string;
  username: string;
  email: string;
  contact: string;
  profileURL?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  authUser: Admin | null;
  setAuthUser: (admin: Admin | null) => void;
  IsLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AuthUserContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
  IsLoading: true,
  setIsLoading: () => {},
});

function useAdminAuth() {
  const [authUser, setAuthUser] = useState<Admin | null>(null);
  const [IsLoading, setIsLoading] = useState(true);

  const getAdmin = async () => {
    try {
      const res = await adminAPI.getAdmin();
      if (res.data.success && res.data.admin?.isAdmin) {
        setAuthUser(res.data.admin);
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return { authUser, setAuthUser, setIsLoading, IsLoading };
}

export const AuthUserProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAdminAuth();
  return (
    <AuthUserContext.Provider value={auth}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuth = () => useContext(AuthUserContext);