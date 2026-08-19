import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://mycityqueen.com/x";

// Proxy GET /api/profiles → backend GET /api/escorts (APPROVED only)
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/escorts`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Backend error: ${res.status}`);
    const json = await res.json();
    return NextResponse.json(json.data || [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch profiles from backend" }, { status: 500 });
  }
}

// Proxy POST /api/profiles → backend POST /api/escorts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/escorts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
