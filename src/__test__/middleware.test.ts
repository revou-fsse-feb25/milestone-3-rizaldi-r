import { middleware } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Mock Next.js server utilities
jest.mock("next/server", () => ({
    // Mock NextResponse methods
    NextResponse: {
        next: jest.fn(() => ({ __type: "NextResponse.next" })), // Custom type for easy assertion
        redirect: jest.fn((url: URL) => ({ __type: "NextResponse.redirect", url: url.toString() })), // Custom type with URL
    },
    // Mock NextRequest as a class (constructor function)
    NextRequest: jest.fn((url: string | URL) => {
        // Return a mock object that mimics the essential properties of NextRequest
        const parsedUrl = typeof url === "string" ? new URL(url) : url;
        return {
            nextUrl: parsedUrl,
            url: parsedUrl.toString(),
            // Add other properties that your middleware might access on the request object
            // For example, if you access headers:
            headers: new Headers(),
            cookies: {
                get: jest.fn(),
                set: jest.fn(),
                delete: jest.fn(),
            },
        };
    }),
}));

// Mock next-auth/jwt
jest.mock("next-auth/jwt", () => ({
    getToken: jest.fn(),
}));

// Helper function to create a mock NextRequest object
// This function now uses the mocked NextRequest constructor
const createMockRequest = (pathname: string, baseUrl = "http://localhost:3000/") => {
    const url = new URL(pathname, baseUrl);
    // Use the mocked NextRequest constructor directly
    const request = new NextRequest(url);
    // No need to spread and reassign nextUrl/url if the mock constructor already sets them
    return request as NextRequest;
};

describe("Middleware", () => {
    beforeEach(() => {
        // Clear all mock calls before each test to ensure test isolation
        jest.clearAllMocks();
        // Set a default mock implementation for getToken to return null (unauthenticated user)
        // Individual tests will override this as needed for specific authentication states.
        (getToken as jest.Mock).mockResolvedValue(null);
    });

    // Test Case: Static files should always pass through without authentication checks.
    it("should allow static files to pass through", async () => {
        const request = createMockRequest("/images/photo.png");
        const response = await middleware(request);
        // Expect the middleware to return a "next" response
        expect(response).toEqual({ __type: "NextResponse.next" });
        // Verify that NextResponse.next() was called
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Favicon should also pass through as a static file.
    it("should allow favicon.ico to pass through", async () => {
        const request = createMockRequest("/favicon.ico");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Public routes should be accessible to unauthenticated users.
    it("should allow unauthenticated users to access public routes (e.g., /)", async () => {
        const request = createMockRequest("/");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Public routes should also be accessible to authenticated users.
    it("should allow authenticated users to access public routes (e.g., /products)", async () => {
        // Mock getToken to simulate an authenticated user
        (getToken as jest.Mock).mockResolvedValue({ role: "user", name: "testuser" });
        const request = createMockRequest("/products/123");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Unauthenticated users should be able to access auth pages (e.g., /account).
    it("should allow unauthenticated users to access auth pages", async () => {
        const request = createMockRequest("/account");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Authenticated users with 'admin' role trying to access auth pages
    // should be redirected to the dashboard.
    it("should redirect authenticated admin from auth pages to dashboard", async () => {
        (getToken as jest.Mock).mockResolvedValue({ role: "admin", name: "adminuser" });
        const request = createMockRequest("/account");
        const response = await middleware(request);
        // Expect a redirect response to the dashboard URL
        expect(response).toEqual({
            __type: "NextResponse.redirect",
            url: "http://localhost:3000/dashboard",
        });
        // Verify that NextResponse.redirect() was called with the correct URL
        expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
        expect(NextResponse.redirect).toHaveBeenCalledWith(
            new URL("/dashboard", "http://localhost:3000/")
        );
    });

    // Test Case: Authenticated users with a non-'admin' role accessing auth pages
    // should be allowed to pass through (no redirect).
    it("should allow authenticated non-admin users to access auth pages", async () => {
        (getToken as jest.Mock).mockResolvedValue({ role: "user", name: "regularuser" });
        const request = createMockRequest("/account");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Unauthenticated users trying to access protected routes
    // should be redirected to the account page with a `redirect` query parameter.
    it("should redirect unauthenticated users from protected routes to account page with redirect param", async () => {
        const request = createMockRequest("/checkout");
        const response = await middleware(request);

        // Construct the expected URL with proper encoding, matching the middleware's behavior
        const expectedRedirectUrl = new URL("/account", request.url);
        expectedRedirectUrl.searchParams.set("redirect", "/checkout"); // This will automatically encode '/checkout' to '%2Fcheckout'

        // Expect a redirect response to the account page with the original path as a query parameter
        expect(response).toEqual({
            __type: "NextResponse.redirect",
            url: expectedRedirectUrl.toString(),
        });
        // Verify that NextResponse.redirect() was called with the correct URL object
        expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
        expect(NextResponse.redirect).toHaveBeenCalledWith(expectedRedirectUrl);
    });

    // Test Case: Authenticated users should be able to access protected routes.
    it("should allow authenticated users to access protected routes", async () => {
        (getToken as jest.Mock).mockResolvedValue({ role: "user", name: "testuser" });
        const request = createMockRequest("/wishlist");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });

    // Test Case: Unauthenticated users trying to access admin-only routes
    // should be redirected to the home page.
    it("should redirect unauthenticated users from admin-only routes to home", async () => {
        const request = createMockRequest("/dashboard");
        const response = await middleware(request);
        expect(response).toEqual({
            __type: "NextResponse.redirect",
            url: "http://localhost:3000/",
        });
        expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
        expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/", "http://localhost:3000/"));
    });

    // Test Case: Authenticated users with a non-'admin' role trying to access admin-only routes
    // should be redirected to the home page.
    it("should redirect non-admin authenticated users from admin-only routes to home", async () => {
        (getToken as jest.Mock).mockResolvedValue({ role: "user", name: "regularuser" });
        const request = createMockRequest("/dashboard");
        const response = await middleware(request);
        expect(response).toEqual({
            __type: "NextResponse.redirect",
            url: "http://localhost:3000/",
        });
        expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
        expect(NextResponse.redirect).toHaveBeenCalledWith(new URL("/", "http://localhost:3000/"));
    });

    // Test Case: Authenticated users with the 'admin' role should be able to access admin-only routes.
    it("should allow authenticated admin users to access admin-only routes", async () => {
        (getToken as jest.Mock).mockResolvedValue({ role: "admin", name: "adminuser" });
        const request = createMockRequest("/dashboard");
        const response = await middleware(request);
        expect(response).toEqual({ __type: "NextResponse.next" });
        expect(NextResponse.next).toHaveBeenCalledTimes(1);
    });
});
