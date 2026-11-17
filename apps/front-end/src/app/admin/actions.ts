"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const cookieName = "admin_review";

export async function isAdminSession() {
  const token = (await cookies()).get(cookieName)?.value;
  const baseUrl = process.env.API_URL;
  if (!token || !baseUrl) return false;
  try {
    const response = await fetch(`${baseUrl}/v1/admin/session`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function login(formData: FormData) {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) redirect("/admin?error=1");
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/v1/admin/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: String(formData.get("username") ?? ""), password: String(formData.get("password") ?? "") }),
      cache: "no-store",
    });
  } catch {
    redirect("/admin?error=1");
  }
  if (response.status === 429) redirect("/admin?error=locked");
  if (!response.ok) redirect("/admin?error=1");
  const { token } = await response.json() as { token: string };
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(cookieName);
  redirect("/admin");
}

export async function review(formData: FormData) {
  if (!(await isAdminSession())) redirect("/admin");
  const token = (await cookies()).get(cookieName)?.value;
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
      payload.status = String(formData.get("status") ?? "scheduled");
    } else if (kind === "streamer") {
      payload.isOfficial = formData.get("isOfficial") === "on";
    } else {
      throw new Error("제보 종류가 올바르지 않습니다.");
    }
    body = {
      payload,
      sourceUrl: String(formData.get("sourceUrl") ?? ""),
      officialConfirmed: formData.get("officialConfirmed") === "on",
      changeNote: String(formData.get("changeNote") ?? ""),
    };
  } else {
    body = {
      rejectionCode: String(formData.get("rejectionCode") ?? ""),
      reason: String(formData.get("reason") ?? ""),
    };
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
