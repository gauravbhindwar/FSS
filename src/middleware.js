import { NextResponse } from "next/server";

export function middleware(req) {
  // const { pathname } = req.nextUrl;
  // // console.log("Cookies:", req.cookies);
  // const isLoggedIn = req.cookies.get("user"); // Adjust this line based on your authentication logic
  // // console.log(isLoggedIn);
  // if (pathname === "/verify-email") {
  //   return NextResponse.next();
  // }
  // if (!isLoggedIn && pathname !== "/") {
  //   // User is not logged in and trying to access a protected route
  //   const loginUrl = new URL("/", req.url);
  //   console.log("Please login first");
  //   loginUrl.searchParams.set("loginAlert", "true");
  //   return NextResponse.redirect(loginUrl);
  // }
  // if (isLoggedIn && pathname === "/") {
  //   // User is logged in and trying to access the login page (homepage)
  //   console.log("User Logged In Successfully");
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }
  // if (!isLoggedIn && pathname.startsWith("/api")) {
  //   // User is not logged in and trying to access a protected API route
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  // // User is either logged in and accessing a protected route or not logged in and accessing the login page
  // return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)',
//       ],
// };
