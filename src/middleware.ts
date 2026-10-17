import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // 301 Permanent Redirect www to non-www
  if (host.startsWith("www.")) {
    const nonWwwHost = host.replace(/^www\./, "");
    const destination = `https://${nonWwwHost}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(destination, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files & images:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icons, images
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)",
  ],
};
