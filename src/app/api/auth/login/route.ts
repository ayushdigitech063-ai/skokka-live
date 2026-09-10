import { NextResponse } from "next/server";

// Simulated JWT Token Signer & Authentication Endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, adminId, password } = body;
    const inputEmail = email || adminId;

    if (!inputEmail || !password) {
      return NextResponse.json(
        { error: "Super Admin Email Address and Password are required." },
        { status: 400 }
      );
    }

    const cleanId = String(inputEmail).trim().toLowerCase();

    // Check Root Super Admin credentials
    if (
      (cleanId === "admin@mycityqueen.com" || cleanId === "info.mycityqueen@gmail.com" || cleanId === "admin") &&
      password === "Password@123"
    ) {
      // Generate Root Super Admin JWT Token
      const jwtPayload = {
        sub: "ADM-001",
        name: "Super Admin",
        email: cleanId.includes("@") ? cleanId : "info.mycityqueen@gmail.com",
        role: "Super Admin",
        avatar: "S",
        permissions: ["ALL"],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400, // 24 Hours
      };

      // Base64 Encoded Header & Payload JWT Token Simulation
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
      const payload = Buffer.from(JSON.stringify(jwtPayload)).toString("base64url");
      const signature = Buffer.from(`secret_sign_${cleanId}_${Date.now()}`).toString("base64url");
      const token = `eyJ${header}.${payload}.${signature}`;

      return NextResponse.json({
        success: true,
        token,
        tokenType: "Bearer",
        expiresIn: "24h",
        user: {
          id: jwtPayload.sub,
          name: jwtPayload.name,
          email: jwtPayload.email,
          role: jwtPayload.role,
          avatar: jwtPayload.avatar,
        },
      });
    }

    // Check Regular Admin credentials (e.g. vikram@skokka.in)
    const namePart = cleanId.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1) + " Singh";
    const avatarLetter = namePart.charAt(0).toUpperCase();

    const jwtPayload = {
      sub: "ADM-003",
      name: formattedName,
      email: cleanId,
      role: "Admin",
      avatar: avatarLetter,
      permissions: ["approveAds", "editProfiles", "verifyIDs", "viewRevenue"],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 Hours
    };

    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify(jwtPayload)).toString("base64url");
    const signature = Buffer.from(`secret_sign_${cleanId}_${Date.now()}`).toString("base64url");
    const token = `eyJ${header}.${payload}.${signature}`;

    return NextResponse.json({
      success: true,
      token,
      tokenType: "Bearer",
      expiresIn: "24h",
      user: {
        id: jwtPayload.sub,
        name: jwtPayload.name,
        email: jwtPayload.email,
        role: jwtPayload.role,
        avatar: jwtPayload.avatar,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Authentication Failed: " + (err.message || "Internal Error") },
      { status: 500 }
    );
  }
}
