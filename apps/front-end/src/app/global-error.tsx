"use client";

import { goBackRoute, route } from "@/lib/constants/router";
import { useAsPathStore } from "@/lib/providers/asPath-provider";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  const previousAsPath = useAsPathStore((state) => state.previousAsPath);

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>에러가 발생했습니다.</h2>
        <button
          onClick={() => goBackRoute(router, previousAsPath, route.index)}
        >
          뒤로 가기
        </button>
      </body>
    </html>
  );
}
