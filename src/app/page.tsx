"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleConfirm = () => {
    console.log("확인 버튼 클릭됨");
    router.push("table01");
    // 여기에 확인 시 실행할 로직 추가
  };

  return (
    <div>
      <Button onClick={handleConfirm}>기본 그리드</Button>
      <Link href={"/table01"}>
        <h4>table01</h4>
      </Link>
    </div>
  );
}
