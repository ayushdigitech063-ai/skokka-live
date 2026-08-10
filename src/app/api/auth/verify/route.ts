import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const body = await request.json().catch(() => ({}));
      token = body.token || "";
    }

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Authentication token missing." },
        { status: 401 }
      );
    }

    const payload = verifyJwtToken(token);

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: "Invalid or expired JWT security token." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        avatar: payload.avatar,
        permissions: payload.permissions,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, error: "Token verification failed: " + (err.message || "Unknown error") },
      { status: 500 }
    );
  }
}
