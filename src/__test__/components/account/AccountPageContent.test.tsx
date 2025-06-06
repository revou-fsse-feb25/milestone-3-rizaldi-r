import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPageContent from "@/components/account/AccountPageContent";

// Mock useRouter from next/navigation
// For isolating the component and preventing actual API calls or redirects.
const mockPush = jest.fn();
const mockReplace = jest.fn();
// jest.mock intercepts any import or require statements for the module and provides custom mock instead
const mockUseSearchParams = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
    useSearchParams: () => mockUseSearchParams(), // The hook returns the result of mockUseSearchParams
    redirect: jest.fn(),
}));

// Mock next-auth hooks and functions
const mockUseSession = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
jest.mock("next-auth/react", () => ({
    useSession: () => mockUseSession(),
    signIn: (...args: any[]) => mockSignIn(...args),
    signOut: (...args: any[]) => mockSignOut(...args),
}));

// Mock custom components
jest.mock("@/components/_commons/TextSubheading", () => {
    return ({ children }: any) => <h2 data-testid="text-subheading">{children}</h2>;
});
jest.mock("@/components/_commons/ButtonRegular", () => {
    return ({ children, onClickProp, type, isDisabled }: any) => (
        <button
            data-testid="button-regular"
            onClick={onClickProp}
            type={type}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
});

// ISSUE: cant mock window.location.reload
// Mock and reset window.location.reload
// const originalLocation: Location = window.location;
// const originalLocationReload: Location = window.location.reload;
beforeAll(() => {
    // Object.defineProperty(window, "location", {
    //     configurable: true,
    //     writable: true,
    //     value: { reload: jest.fn() },
    // });
    // window.location.reload = jest.fn();

    // delete global.window.location;
    // global.window = Object.create(window);
    // global.window.location = {
    //     ...originalLocation,
    //     reload: jest.fn(),
    // };

    // Object.defineProperty(window.location, 'reload', {
    //     configurable: true,
    //     writable: true,
    //     value: { reload: jest.fn() },
    // });
});
afterAll(() => {
    // window.location.reload.mockRestore();

    // global.window.location = originalLocation;

    // Object.defineProperty(window, "location", {
    //     configurable: true,
    //     writable: true,
    //     value: originalLocationReload,
    // });
});

// reset all mocks
beforeEach(() => {
    jest.clearAllMocks();

    // Set default mock implementations for useSession and useSearchParams
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    mockUseSearchParams.mockReturnValue({
        get: jest.fn(() => null), // Default: no redirect parameter
    });
});

describe("LoginPageContent", () => {
    it("renders login form when unauthenticated", () => {
        // Act
        render(<LoginPageContent />);

        // Assert that the element are present
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        // i in regex is case-insensitive
        // For an HTML <input type="submit"> element, its implicit role is button
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
        // Assert that the sign-out button is NOT present
        expect(screen.queryByRole("button", { name: /signout/i })).not.toBeInTheDocument();
    });

    it("renders sign out button when authenticated", () => {
        // Mock useSession to return an authenticated status
        // the component use useSession but we modify the mockUseSession which is used by useSession
        mockUseSession.mockReturnValue({
            data: { user: { email: "test@example.com" } },
            status: "authenticated",
        });

        // Act
        render(<LoginPageContent />);

        // Assert that the sign-out button is present
        expect(screen.getByRole("button", { name: /signout/i })).toBeInTheDocument();
        // Assert that the login input fields are NOT present
        expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    });

    it("updates form data on input change", () => {
        render(<LoginPageContent />);
        // Arrange
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        // Act: Simulate user typing into input field
        fireEvent.change(emailInput, { target: { name: "email", value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { name: "password", value: "password123" } });

        // Assert
        expect(emailInput).toHaveValue("test@example.com");
        expect(passwordInput).toHaveValue("password123");
    });

    it("calls signIn and refreshes router on successful login without redirect", async () => {
        // Arrange: Mock signIn to resolve successfully
        // https://next-auth.js.org/getting-started/client#using-the-redirect-false-option
        mockSignIn.mockResolvedValue({ error: null, ok: true, url: null });

        // Act
        render(<LoginPageContent />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        fireEvent.change(emailInput, { target: { name: "email", value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });
        fireEvent.click(loginButton);

        // Assert: Wait for asynchronous operations to complete
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                email: "user@example.com",
                password: "password",
                redirect: false,
            });
            // expect(window.location.reload).toHaveBeenCalledTimes(1);
            // no redirect
            expect(mockReplace).not.toHaveBeenCalled();
            // TODO: the button turn into logging in...
            // expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
            expect(screen.queryByText("Can't sign in, Please try again.")).not.toBeInTheDocument();
        });
    });

    it("calls signIn, refreshes router, and redirects on successful login with redirect", async () => {
        // Arrange
        // Mock useSearchParams to return a redirect URL
        mockSignIn.mockResolvedValue({ error: null, ok: true, url: null });
        mockUseSearchParams.mockReturnValue({
            get: jest.fn(() => "/checkout"),
        });

        // Act
        render(<LoginPageContent />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        fireEvent.change(emailInput, { target: { name: "email", value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });
        fireEvent.click(loginButton);

        // Assert
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                email: "user@example.com",
                password: "password",
                redirect: false,
            });
            // expect(window.location.reload).toHaveBeenCalledTimes(1);
            expect(mockReplace).toHaveBeenCalledTimes(1);
            // Expect redirection
            expect(mockReplace).toHaveBeenCalledWith("/checkout");
        });
    });

    it("displays error message on credentials error", async () => {
        // Arrange
        mockSignIn.mockResolvedValue({ error: "CredentialsSignin", ok: false, url: null });

        // Act
        render(<LoginPageContent />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        fireEvent.change(emailInput, { target: { name: "email", value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { name: "password", value: "wrongpassword" } });
        fireEvent.click(loginButton);

        // Assert
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Can't sign in, Please try again.")).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
            // no reload and redirect
            // expect(window.location.reload).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });

    it("displays generic error message on unexpected sign-in error", async () => {
        // Arrange
        mockSignIn.mockRejectedValue(new Error("Network error"));
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        // Act
        render(<LoginPageContent />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        fireEvent.change(emailInput, { target: { name: "email", value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });
        fireEvent.click(loginButton);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Registration error:", expect.any(Error));
        });
        consoleErrorSpy.mockRestore();
        expect(mockReplace).not.toHaveBeenCalled();
    });

    it("calls signOut with correct callbackUrl when SignOut button is clicked", async () => {
        // Arrange: Mock useSession to be authenticated
        mockUseSession.mockReturnValue({ data: {}, status: "authenticated" });
        mockSignOut.mockResolvedValue(undefined);

        // Act: Click the SignOut button
        render(<LoginPageContent />);
        const signOutButton = screen.getByRole("button", { name: /signout/i });
        fireEvent.click(signOutButton);

        // Assert
        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalledTimes(1);
            expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
        });
    });

    it("login button shows 'Logging in...' when loading", async () => {
        // Arrange: Mock signIn to never resolve, simulating a pending login
        mockSignIn.mockImplementation(() => new Promise(() => {}));

        // Act
        render(<LoginPageContent />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        fireEvent.change(emailInput, { target: { name: "email", value: "user@example.com" } });
        fireEvent.change(passwordInput, { target: { name: "password", value: "password" } });
        fireEvent.click(loginButton);

        // Assert
        expect(screen.getByRole("button", { name: /logging in\.\.\./i })).toBeInTheDocument();
    });
});
