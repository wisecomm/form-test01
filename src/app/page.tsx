"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserFormData,
  UserFormDialog,
} from "./popup/user-form/user-form-dialog";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [showUserForm, setShowUserForm] = useState(false);

  const handleConfirm = () => {
    console.log("확인 버튼 클릭됨");
    router.push("table01");
    // 여기에 확인 시 실행할 로직 추가
  };

  const handleFormResult = (
    values: UserFormData | null,
    action: "submit" | "cancel"
  ) => {
    if (action === "submit" && values) {
      // 저장 버튼을 클릭했을 때
      console.log("저장된 사용자 정보:", values);
      // 여기서 API 호출이나 다른 처리를 할 수 있습니다
      alert(`사용자 정보가 성공적으로 저장되었습니다!\n이름: ${values.name}`);
    } else {
      // 취소 버튼을 클릭했거나 다이얼로그를 닫았을 때
      console.log("사용자가 정보 입력을 취소했습니다");
    }

    // 폼 다이얼로그를 닫습니다
    setShowUserForm(false);
  };

  return (
    <div>
      <Button onClick={handleConfirm}>기본 그리드</Button>
      <Link href={"/table01"}>
        <h4>table01</h4>
      </Link>
      <Link href={"/popup/test01"}>
        <h4>팝업1</h4>
      </Link>
      {/* Link 대신 버튼으로 변경하여 클릭 시 다이얼로그를 직접 표시 */}
      <button onClick={() => setShowUserForm(true)}>
        <h4>사용자정보입력</h4>
      </button>

      {/* 조건부 렌더링으로 다이얼로그 표시 */}
      {showUserForm && <UserFormDialog onSubmit={handleFormResult} />}
    </div>
  );
}
