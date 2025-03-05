"use client";

import { useState } from "react";
import { supabase, SupabaseAuthError } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ILoginData, setLogin } from "./LoginProc";
import { ApiResponse, xfetch } from "@/procx/XFetch";

import { useUserStore } from "@/store/useUserStore"; 
import { userInfo } from "@/types/userInfo"; 

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Correct way to use zustand hooks
  const saveUser = useUserStore((state) => state.saveUser);

  const isLogin = useUserStore((state) => state.isLogin);
  const token = useUserStore((state) => state.user?.token);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
/*
      // Example API login
      const result = await setLogin(email, password);

      if (!result) {
        setError("통신 에러가 발생했습니다.");
        return;
      }

      if (result.code !== "0000") {
        setError(`오류: ${result?.message || "알 수 없는 오류"}`);
        return;
      }
*/
      // Save user data to Zustand store
//      const userData = result.data;
      const user: userInfo = {
        id: 'aa',
        email: 'bb',
        name: 'cc',
        role: 'dd',
        token: '1234-token',
      };
      saveUser(user);

      // Optional: Use Supabase for session management if needed
      /*
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      */

//      router.push("/"); // Redirect to home page after login

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLoginInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("isLogin: ", isLogin);
    console.log("token: ", token);

  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-between">
        <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            onClick={handleGetLoginInfo}
          >
            {"로그인 정보"}
          </button>
        </div>
      </form>
    </div>
  );
}
