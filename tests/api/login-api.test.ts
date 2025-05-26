import { POST } from "@/app/api/login/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/session", () => ({
  setSession: jest.fn(),
}));

function createMockRequest(body: object): NextRequest {
  return {
    json: async () => body,
  } as NextRequest;
}

describe("API /api/login", () => {
  it("should login successfully with correct credentials", async () => {
    const req = createMockRequest({
      email: "22520857@gm.uit.edu.vn",
      password: "minh111",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.role).toBeDefined();
  });

  it("should return error when email is incorrect", async () => {
    const req = createMockRequest({
      email: "22520858@gm.uit.edu.vn",
      password: "minh111",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Sai tài khoản hoặc mật khẩu");
  });

  it("should return error when password is incorrect", async () => {
    const req = createMockRequest({
      email: "22520857@gm.uit.edu.vn",
      password: "minh123",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Sai tài khoản hoặc mật khẩu");
  });

  it("should return error when missing email or password", async () => {
    const req = createMockRequest({
      email: "",
      password: "",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Sai tài khoản hoặc mật khẩu");
  });
});