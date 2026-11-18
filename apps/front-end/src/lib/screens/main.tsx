import Image from "next/image";
import Link from "next/link";
import { route } from "@/lib/constants/router";

const MainView = () => (
  <main className="min-h-[calc(100vh-72px)] bg-[#f7faf8] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
    <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
        <p className="mb-4 text-sm font-bold tracking-wider text-brandDark">0군의 삶 · CHZZK SCHEDULE</p>
        <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-textMain sm:text-5xl">
          치지직 방송 일정을<br />한눈에 확인하세요
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-textNormal">
          스트리머별 예정 방송과 공식 방송을 찾아보고, 빠진 일정은 출처와 함께 제보할 수 있습니다.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={route.today} className="rounded-xl bg-brandMain px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brandMainHover">오늘 일정 보기</Link>
          <Link href={route.allCalendar} className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-textMain transition-colors hover:bg-green-50">월간 달력 보기</Link>
        </div>
      </div>
      <div className="flex min-h-64 flex-col items-center justify-center bg-gradient-to-br from-[#102d22] via-brandDark to-brandMain p-8 text-center text-white lg:min-h-[520px]">
        <Image src="/assets/images/logo-eng.png" alt="0's Life 로고" width={360} height={180} className="h-auto w-44 drop-shadow-lg sm:w-64" priority />
        <p className="mt-5 text-sm text-green-50">예정 일정 · 스트리머 · 공식 방송</p>
      </div>
    </div>
  </main>
);

export default MainView;
