import { NextResponse } from "next/server";

// This function runs on every request to handle authentication and authorization
export function middleware(req) {
  // Extract pathname from the request URL
  const { pathname } = req.nextUrl;

  // Retrieve cookies for user authentication status
  const isLoggedIn = req.cookies.get("user");
  const isAdmin = req.cookies.get("admin");

  // Check if the request method is GET and apply restrictions
  if (pathname.startsWith("/api")) {
    const allowedPaths = [
      "/api/users/send-verification",
      "/api/users/set-password",
      "/api/users/check-password",
      "/api/users/check-admin",
      "/api/users/login",
    ];
    if (isLoggedIn || isAdmin) {
      return NextResponse.next();
    }

    if (!isLoggedIn || !isAdmin) {
      if (req.method === "POST" && allowedPaths.includes(pathname)) {
        return NextResponse.next();
      }

      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Allow access to the email verification page without authentication
  if (pathname === "/verify-email") {
    return NextResponse.next();
  }

  // Allow access to the form page if the user is logged in or is an admin
  if (pathname === "/form") {
    if (isAdmin || isLoggedIn) {
      return NextResponse.next();
    }
  }

  // Redirect users to the login page if they are not logged in and are trying to access a restricted page
  if (!isAdmin && !isLoggedIn && pathname !== "/") {
    const loginUrl = new URL("/", req.url);
    console.log("Please login first");
    loginUrl.searchParams.set("loginAlert", "true");
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users from the home page to the dashboard
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect admins who are trying to access non-admin routes to the admin page
  if (isAdmin && !pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Define which routes should be processed by the middleware
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
//   ],
// };

// restrict api route
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
