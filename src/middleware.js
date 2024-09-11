import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("user");
  const isAdmin = req.cookies.get("admin");
  if (pathname === "/verify-email") {
    return NextResponse.next();
  }
  if (!isAdmin && !isLoggedIn && pathname !== "/") {
    const loginUrl = new URL("/", req.url);
    console.log("Please login first");
    loginUrl.searchParams.set("loginAlert", "true");
    return NextResponse.redirect(loginUrl);
  }
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (isAdmin && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  if (!isLoggedIn && pathname.startsWith("/api")) {
    return NextResponse.json(
      { message: "Unauthorized Access" },
      { status: 401 }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
//// restrict api route
// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
//       ],
// };
