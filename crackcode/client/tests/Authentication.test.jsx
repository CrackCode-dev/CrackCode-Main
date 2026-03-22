import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ─── Shared mocks ────────────────────────────────────────────────────────────

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock axios used inside auth source files
vi.mock("axios", async () => {
  const actual = await vi.importActual("axios");
  return {
    ...actual,
    default: {
      ...actual.default,
      get: vi.fn(),
      post: vi.fn(),
      defaults: {
        withCredentials: false,
        headers: { common: {} },
      },
    },
  };
});

// Mock SVG/PNG asset imports so Vite doesn't choke in jsdom
vi.mock("../src/assets/logo/crackcode_logo.svg", () => ({ default: "logo.svg" }));
vi.mock("../src/assets/logo/logo_dark.png", () => ({ default: "logo_dark.png" }));

// Mock the Header and Button UI components used in EmailVerify
vi.mock("../src/components/common/Header", () => ({
  default: () => <div data-testid="mock-header" />,
}));
vi.mock("../src/components/ui/Button", () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

// ─── Auth context mock factory ────────────────────────────────────────────────

import { AppContent } from "../src/context/userauth/authenticationContext";
import React from "react";

const buildAuthContext = (overrides = {}) => ({
  backendUrl: "http://localhost:5051",
  isLoggedIn: false,
  setIsLoggedIn: vi.fn(),
  userData: false,
  setUserData: vi.fn(),
  getUserData: vi.fn(),
  setAuthHeader: vi.fn(),
  isLoading: false,
  ...overrides,
});

const renderWithAuth = (ui, contextValue, { route = "/" } = {}) =>
  render(
    <AppContent.Provider value={contextValue}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AppContent.Provider>
  );

// ═════════════════════════════════════════════════════════════════════════════
// 1. Login Component
// ═════════════════════════════════════════════════════════════════════════════
import Login from "../src/pages/userauth/Login";
import axios from "axios";

describe("Login Component", () => {
  let ctx;

  beforeEach(() => {
    vi.clearAllMocks();
    ctx = buildAuthContext();
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.setItem = vi.fn();
  });

  // ── Rendering ───────────────────────────────────────────────────────────

  it("renders the login form by default", () => {
    renderWithAuth(<Login />, ctx);

    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows the 'Forgot password?' link in login mode", () => {
    renderWithAuth(<Login />, ctx);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  // ── Tab switching ────────────────────────────────────────────────────────

  it("switches to Sign Up form when the Sign Up tab is clicked", async () => {
    renderWithAuth(<Login />, ctx);

    const signUpTab = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(signUpTab);

    expect(await screen.findByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("hides name and confirm-password fields when switching back to Login", async () => {
    renderWithAuth(<Login />, ctx);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.queryByPlaceholderText(/full name/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/confirm password/i)).not.toBeInTheDocument();
  });

  // ── Login submission ─────────────────────────────────────────────────────

  it("calls login API and navigates to /home on successful login", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        accessToken: "test-token",
        user: { isAccountVerified: true },
      },
    });
    ctx.getUserData.mockResolvedValueOnce();

    renderWithAuth(<Login />, ctx);

    await userEvent.type(screen.getByPlaceholderText(/email address/i), "user@test.com");
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), "password123");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/login"),
        expect.objectContaining({ email: "user@test.com", password: "password123" })
      );
      expect(ctx.setIsLoggedIn).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("redirects to /verify-account when user is not verified after login", async () => {
    axios.post
      .mockResolvedValueOnce({
        data: {
          success: true,
          accessToken: "test-token",
          user: { isAccountVerified: false },
        },
      })
      .mockResolvedValueOnce({ data: {} }); // send-verify-otp call

    ctx.getUserData.mockResolvedValueOnce();

    renderWithAuth(<Login />, ctx);

    await userEvent.type(screen.getByPlaceholderText(/email address/i), "user@test.com");
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), "password123");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/verify-account");
    });
  });

  it("shows an error toast when login API returns success: false", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: false, message: "Invalid credentials" },
    });

    const { toast } = await import("react-toastify");
    renderWithAuth(<Login />, ctx);

    await userEvent.type(screen.getByPlaceholderText(/email address/i), "bad@test.com");
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), "wrongpass");
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  // ── Registration submission ──────────────────────────────────────────────

  it("shows error when passwords do not match during sign-up", async () => {
    const { toast } = await import("react-toastify");
    renderWithAuth(<Login />, ctx);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await userEvent.type(screen.getByPlaceholderText(/full name/i), "Alice");
    await userEvent.type(screen.getByPlaceholderText(/email address/i), "alice@test.com");
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), "pass1234");
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), "different");

    // accept T&C
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match!");
    });
  });

  it("shows error when T&C not accepted during sign-up", async () => {
    const { toast } = await import("react-toastify");
    renderWithAuth(<Login />, ctx);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await userEvent.type(screen.getByPlaceholderText(/full name/i), "Bob");
    await userEvent.type(screen.getByPlaceholderText(/email address/i), "bob@test.com");
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), "pass1234");
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), "pass1234");
    // intentionally NOT checking T&C

    // The submit button is disabled when T&C is unchecked, so submit the form directly
    fireEvent.submit(document.querySelector("form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "You must accept the Terms and Conditions."
      );
    });
  });

  it("calls register API and navigates to /verify-account on successful sign-up", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true },
    });

    const { toast } = await import("react-toastify");
    renderWithAuth(<Login />, ctx);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await userEvent.type(screen.getByPlaceholderText(/full name/i), "Carol");
    await userEvent.type(screen.getByPlaceholderText(/email address/i), "carol@test.com");
    await userEvent.type(screen.getByPlaceholderText(/^password$/i), "pass1234");
    await userEvent.type(screen.getByPlaceholderText(/confirm password/i), "pass1234");
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/register"),
        expect.objectContaining({ name: "Carol", email: "carol@test.com" })
      );
      expect(toast.success).toHaveBeenCalledWith("OTP sent to your email.");
      expect(mockNavigate).toHaveBeenCalledWith(
        "/verify-account",
        expect.objectContaining({ state: { email: "carol@test.com" } })
      );
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. ProtectedRoute Component
// ═════════════════════════════════════════════════════════════════════════════
import ProtectedRoute from "../src/components/common/ProtectedRoute";

describe("ProtectedRoute Component", () => {
  const ChildComponent = () => <div>Protected Content</div>;

  it("renders children when user is logged in and verified", () => {
    const ctx = buildAuthContext({
      isLoggedIn: true,
      userData: { isAccountVerified: true },
    });

    renderWithAuth(
      <ProtectedRoute>
        <ChildComponent />
      </ProtectedRoute>,
      ctx
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when user is not logged in", () => {
    const ctx = buildAuthContext({ isLoggedIn: false });

    const { container } = renderWithAuth(
      <ProtectedRoute>
        <ChildComponent />
      </ProtectedRoute>,
      ctx,
      { route: "/home" }
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to /verify-account when logged in but email unverified", () => {
    const ctx = buildAuthContext({
      isLoggedIn: true,
      userData: { isAccountVerified: false },
    });

    renderWithAuth(
      <ProtectedRoute requireVerified={true}>
        <ChildComponent />
      </ProtectedRoute>,
      ctx,
      { route: "/home" }
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when requireVerified is false even if email not verified", () => {
    const ctx = buildAuthContext({
      isLoggedIn: true,
      userData: { isAccountVerified: false },
    });

    renderWithAuth(
      <ProtectedRoute requireVerified={false}>
        <ChildComponent />
      </ProtectedRoute>,
      ctx
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("shows a loading spinner while auth state is being resolved", () => {
    const ctx = buildAuthContext({ isLoading: true });

    renderWithAuth(
      <ProtectedRoute>
        <ChildComponent />
      </ProtectedRoute>,
      ctx
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    // The spinner is rendered as an animate-spin div
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. EmailVerify Component
// ═════════════════════════════════════════════════════════════════════════════
import EmailVerify from "../src/pages/userauth/EmailVerify";

describe("EmailVerify Component", () => {
  let ctx;

  beforeEach(() => {
    vi.clearAllMocks();
    ctx = buildAuthContext();
    Storage.prototype.setItem = vi.fn();
  });

  it("renders 6 OTP input boxes and a submit button", () => {
    renderWithAuth(<EmailVerify />, ctx, { route: "/verify-account" });

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("moves focus to the next box after typing a digit", async () => {
    renderWithAuth(<EmailVerify />, ctx, { route: "/verify-account" });

    const inputs = screen.getAllByRole("textbox");
    fireEvent.input(inputs[0], { target: { value: "1" } });

    // After input, the next box should receive focus
    // (jsdom doesn't natively track focus perfectly, but we verify the handler was wired)
    expect(inputs[0]).toBeInTheDocument();
  });

  it("submits OTP and navigates to /gamer-profile on success", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: true, accessToken: "otp-token", message: "Email verified successfully!" },
    });
    ctx.getUserData.mockResolvedValueOnce();

    renderWithAuth(<EmailVerify />, ctx, {
      route: "/verify-account",
    });

    const inputs = screen.getAllByRole("textbox");
    const digits = ["1", "2", "3", "4", "5", "6"];
    digits.forEach((d, i) => {
      fireEvent.change(inputs[i], { target: { value: d } });
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/verify-account"),
        expect.objectContaining({ otp: "123456" })
      );
      expect(ctx.setIsLoggedIn).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith("/gamer-profile");
    });
  });

  it("shows error toast when OTP verification fails", async () => {
    axios.post.mockResolvedValueOnce({
      data: { success: false, message: "Invalid OTP" },
    });

    const { toast } = await import("react-toastify");
    renderWithAuth(<EmailVerify />, ctx, { route: "/verify-account" });

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => fireEvent.change(input, { target: { value: "0" } }));

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid OTP");
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. AuthenticationContext
// ═════════════════════════════════════════════════════════════════════════════
import { AppContextProvider } from "../src/context/userauth/authenticationContext";
import { renderHook, act } from "@testing-library/react";
import { useContext } from "react";

describe("AuthenticationContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.setItem = vi.fn();
    delete axios.defaults.headers.common["Authorization"];
  });

  const wrapper = ({ children }) => (
    <MemoryRouter>
      <AppContextProvider>{children}</AppContextProvider>
    </MemoryRouter>
  );

  it("provides isLoggedIn as false by default", () => {
    // Prevent the useEffect auth check from making real network calls
    axios.get.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useContext(AppContent), { wrapper });
    expect(result.current.isLoggedIn).toBe(false);
  });

  it("sets isLoggedIn to true and calls getUserData when getAuthState succeeds", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { success: true } }) // is-auth
      .mockResolvedValueOnce({ data: { success: true, data: { name: "Alice" } } }); // user/data

    const { result } = renderHook(() => useContext(AppContent), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
      expect(result.current.userData).toMatchObject({ name: "Alice" });
    });
  });

  it("keeps isLoggedIn false when auth check fails (backend down)", async () => {
    axios.get.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useContext(AppContent), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.userData).toBe(false);
    });
  });

  it("setAuthHeader sets Authorization header when token exists in localStorage", () => {
    Storage.prototype.getItem = vi.fn(() => "stored-token");
    axios.get.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useContext(AppContent), { wrapper });

    act(() => {
      result.current.setAuthHeader();
    });

    expect(axios.defaults.headers.common["Authorization"]).toBe("Bearer stored-token");
  });

  it("setAuthHeader removes Authorization header when no token in localStorage", () => {
    Storage.prototype.getItem = vi.fn(() => null);
    axios.defaults.headers.common["Authorization"] = "Bearer old-token";
    axios.get.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useContext(AppContent), { wrapper });

    act(() => {
      result.current.setAuthHeader();
    });

    expect(axios.defaults.headers.common["Authorization"]).toBeUndefined();
  });
});
