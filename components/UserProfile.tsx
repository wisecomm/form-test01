"use client";

import { useUserStore } from "@/store/useUserStore";

export default function UserProfile() {
  // Get user data from store
  const user = useUserStore((state) => state.user);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">사용자 프로필</h2>
      {user?.id ? (
        <div>
          <p><strong>이름:</strong> {user.name}</p>
          <p><strong>이메일:</strong> {user.email}</p>
          <p><strong>역할:</strong> {user.role}</p>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
}
