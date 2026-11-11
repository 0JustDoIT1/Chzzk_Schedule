"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const cookieName = "admin_review";
const loginWindowMs = 15 * 60 * 1000;
const maxLoginFailures = 5;
let failedLogins = 0;
let blockedUntil = 0;
let firstFailureAt = 0;
const sign = (expires: string) => createHmac("sha256", process.env.ADMIN_REVIEW_PASSWORD ?? "").update(`review-session-v1:${expires}`).digest("hex");

export async function isAdminSession() {
  const password = process.env.ADMIN_REVIEW_PASSWORD;
  if (!password || password.length < 32) return false;
  const value = (await cookies()).get(cookieName)?.value ?? "";
  const [expires, signature] = value.split(".");
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  const expected = Buffer.from(sign(expires));
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function login(formData: FormData) {
  const now = Date.now();
  if (blockedUntil > now) redirect("/admin?error=locked");
  if ((blockedUntil && blockedUntil <= now) || (firstFailureAt && now - firstFailureAt > loginWindowMs)) {
    failedLogins = 0;
    blockedUntil = 0;
    firstFailureAt = 0;
  }
  const expected = process.env.ADMIN_REVIEW_PASSWORD ?? "";
  const supplied = String(formData.get("password") ?? "");
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (expected.length < 32 || a.length !== b.length || !timingSafeEqual(a, b)) {
    if (!firstFailureAt) firstFailureAt = now;
    failedLogins += 1;
    if (failedLogins >= maxLoginFailures) blockedUntil = now + loginWindowMs;
    redirect("/admin?error=1");
  }
  failedLogins = 0;
  blockedUntil = 0;
  firstFailureAt = 0;
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  (await cookies()).set(cookieName, `${expires}.${sign(expires)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(cookieName);
  redirect("/admin");
}

export async function review(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin");
  const token = process.env.ADMIN_WRITE_TOKEN;
  const baseUrl = process.env.API_URL;
  const id = String(formData.get("id") ?? "");
  const action = String(formData.get("action") ?? "");
  if (!token || !baseUrl || !/^[0-9a-f]{24}$/i.test(id) || !["approve", "reject"].includes(action)) throw new Error("검수 설정 또는 요청이 올바르지 않습니다.");
  let body: Record<string, unknown>;
  if (action === "approve") {
    let payload: Record<string, unknown>;
    try {
      const parsed = JSON.parse(String(formData.get("payload") ?? ""));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      payload = parsed;
    } catch {
      throw new Error("게시 내용 JSON 형식을 확인해 주세요.");
    }
    const kind = String(formData.get("kind") ?? "");
    if (kind === "schedule" || kind === "schedule-edit") {
      const category = String(formData.get("category") ?? "");
      payload.category = category;
      payload.isOfficial = category === "official" || category === "watch";
    } else if (kind === "streamer") {
      payload.isOfficial = formData.get("isOfficial") === "on";
    } else {
      throw new Error("제보 종류가 올바르지 않습니다.");
    }
    body = {
      payload,
      sourceUrl: String(formData.get("sourceUrl") ?? ""),
      officialConfirmed: formData.get("officialConfirmed") === "on",
    };
  } else {
    body = { reason: String(formData.get("reason") ?? "") };
  }
  const response = await fetch(`${baseUrl}/v1/submissions/${id}/${action}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("검수 처리에 실패했습니다. 입력과 서버 상태를 확인해 주세요.");
  revalidatePath("/admin");
}
