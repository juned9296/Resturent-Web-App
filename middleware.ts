import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value; // Get auth token
  const role = req.cookies.get("user_role")?.value; // Get user role
  const path = req.nextUrl.pathname; // Get current path

  const adminRoutes = [
    "/admin", "/admin/products", "/admin/orders", 
    "/table-services", "/reservation", "/delivery", 
    "/accounting", "/settings"
  ];

  // ✅ Redirect ADMIN to /admin if they visit /
  if (token && role === "ADMIN" && path === "/") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ✅ Allow public pages (home page and non-admin routes)
  if (!adminRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 🚨 If user is NOT logged in and tries to access admin routes, redirect to /
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🚨 If user is NOT an admin and tries to access admin routes, redirect to /
  if (adminRoutes.includes(path) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // ✅ Allow access for valid admins
}

export const config = {
  matcher: [
    "/", // Home page (to handle admin redirect)
    "/admin", "/admin/products", "/admin/orders", 
    "/table-services", "/reservation", "/delivery", 
    "/accounting", "/settings" // Protect only admin routes
  ],
};
