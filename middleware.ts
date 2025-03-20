import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value; // Get the token from cookies
  const role = req.cookies.get("user_role")?.value; // Get user role from cookies

  // Define protected routes for customers and admins
  const customerRoutes = ["/", "/cart", "/profile", "/settings", "/favorites", "/orders", "/search"];
  const adminRoutes = ["/admin", "/admin/products", "/admin/orders", "/table-services", "/reservation", "/delivery", "/accounting"];

  if (!token) {
    // If not authenticated, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (customerRoutes.includes(req.nextUrl.pathname) && role !== "USER") {
    // If a non-user tries to access customer routes, redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (adminRoutes.includes(req.nextUrl.pathname) && role !== "ADMIN") {
    // If a non-admin tries to access admin routes, redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // Allow access if authenticated and authorized
}

export const config = {
  matcher: [
    "/", "/cart", "/profile", "/settings", "/favorites", "/orders", "/search", // Customer routes
    "/admin", "/admin/products", "/admin/orders", "/table-services", "/reservation", "/delivery", "/accounting" // Admin routes
  ],
};
