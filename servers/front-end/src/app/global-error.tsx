"use client";

import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>에러가 발생했습니다.</h2>
        <button onClick={() => router.back()}>뒤로 가기</button>
      </body>
    </html>
  );
}
