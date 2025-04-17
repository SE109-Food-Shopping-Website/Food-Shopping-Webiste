// lib/session.ts
import { SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "default-secret-1234567890123456",
  cookieName: "simple-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Secure cookie if in production
  },
};

export async function getSession() {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get(sessionOptions.cookieName);

  // Nếu cookie không tồn tại, trả về null
  if (!sessionCookie) return null;

  try {
    // Parse giá trị cookie thành đối tượng
    const data = JSON.parse(sessionCookie.value);
    return data;
  } catch (error) {
    return null;
  }
}

export async function setSession(data: any) {
  const cookieStore = cookies();
  // Set giá trị cookie với dữ liệu đã serialize
  (await
        // Set giá trị cookie với dữ liệu đã serialize
        cookieStore).set(
    sessionOptions.cookieName,
    JSON.stringify(data),
    sessionOptions.cookieOptions
  );
}
