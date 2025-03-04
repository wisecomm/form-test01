"use client";

import { useState } from "react";
import { supabase, SupabaseAuthError } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ILoginData, setLogin } from "./LoginProc";
import { ApiResponse, xfetch } from "@/procx/XFetch";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [logindata, setLogindata] = useState<ILoginData | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await setLogin("superadmin", "1234");
    if (!result) {
      return;
    }

    if (result.code !== "0000") {
      console.log(
        "데이터 에러 ===" +
          (result?.code || "unknown") +
          " 메시지:" +
          (result?.message || "unknown")
      );
      return;
    }
    console.log("성공 : " + JSON.stringify(result.data));
    setLogindata(result.data);
    console.log("성공 : " + logindata?.key);

    setLoading(false);
    /*
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/"); // Redirect to home page after login
      router.refresh(); // Refresh to update auth state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const authError = err as SupabaseAuthError;
      setError(authError.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
*/
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
        </div>
      </form>
    </div>
  );
}
