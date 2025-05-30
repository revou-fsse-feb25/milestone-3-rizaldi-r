import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    console.log(`Middleware processing request to: ${path}`);

    const staticFileExtensions = [
        ".svg",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".webp",
        ".ico",
        ".txt",
        ".pdf",
    ];
    const isStaticFile = staticFileExtensions.some((ext) => path.endsWith(ext));
    if (isStaticFile) {
        return NextResponse.next();
    }

    const publicPaths = ["/api/auth", "/account", "/cart", "/faq", "/products", "/wishlist"];
    const isPublicPath =
        publicPaths.some((publicPath) => path.startsWith(publicPath)) ||
        path.startsWith("/api/auth") ||
        path === "/";
    const loggedUserPath = ["/checkout"];
    const isloggedUserPath = loggedUserPath.some((publicPath) => path.startsWith(publicPath));
    const isAuthPage =
        request.nextUrl.pathname.startsWith("/account") ||
        request.nextUrl.pathname.startsWith("/register");
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    // If user not logged in
    if (isloggedUserPath && !isAuthenticated) {
        const accountUrl = new URL("/account", request.url);
        accountUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(accountUrl);
    }

    // Redirect authenticated users after login
    if (isAuthPage && isAuthenticated) {
        const role = token.role as string;
        if (role === "admin") return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Handle admin routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const role = token?.role as string;
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Continue with the request if the route is public or user is authenticated
    return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        // Apply middleware to all routes except static assets
        "/((?!api/auth|_next/static|_next/image|static|favicon.ico).*)",
    ],
};
