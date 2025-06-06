import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const staticFileExtensions = [
    ".ico",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".xml",
];

const routeConfig = {
    public: ["/", "/api/auth", "/faq", "/products", "/cart"],
    authPages: ["/account"],
    protected: ["/checkout", "/wishlist"],
    adminOnly: ["/dashboard"],
};

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    // console.log(`Middleware processing request to: ${path}`);

    // --- 1. Handle Static Files Early ---
    const isStaticFile = staticFileExtensions.some((ext) => path.endsWith(ext));
    if (isStaticFile) return NextResponse.next();

    // --- 2. Check Authentication Status ---
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;
    const userRole = token?.role as string | undefined;

    // --- 3. Handle Public Routes ---
    // TODO: is this really needed?
    const isPublicRoute = routeConfig.public.some(
        (routePath) => path === routePath || path.startsWith(`${routePath}/`)
    );
    if (isPublicRoute) return NextResponse.next();

    // --- 4. Handle Auth Pages (Redirect if Authenticated Admin) ---
    const isAuthPage = routeConfig.authPages.some(
        (routePath) => path === routePath || path.startsWith(`${routePath}/`)
    );
    if (isAuthPage && userRole === "admin") {
        const redirectPath = "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // --- 5. Handle Protected Routes (Require Authentication) ---
    const isProtected = routeConfig.protected.some(
        (routePath) => path === routePath || path.startsWith(`${routePath}/`)
    );
    if (isProtected && !isAuthenticated) {
        const accountUrl = new URL("/account", request.url);
        accountUrl.searchParams.set("redirect", path);
        return NextResponse.redirect(accountUrl);
    }

    // --- 6. Handle Admin-Only Routes (Require Admin Role) ---
    const isAdminRoute = routeConfig.adminOnly.some(
        (routePath) => path === routePath || path.startsWith(`${routePath}/`)
    );
    if (isAdminRoute) {
        if (!isAuthenticated || userRole !== "admin")
            return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        // Apply middleware to all routes except static assets
        "/((?!api/auth|_next/static|_next/image|static|public|favicon.ico).*)",
    ],
};
