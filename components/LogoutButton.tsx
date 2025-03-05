"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  
  const handleLogout = () => {
    // Clear user data from the store
    logout();
    
    // Redirect to login page
    router.push("/login");
  };
  
  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      로그아웃
    </button>
  );
}
