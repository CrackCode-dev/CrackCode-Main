import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";


// ─── SETUP MOCKS FIRST (Before any dynamic imports) ───────────────────────────

// Mock bcryptjs
const mockBcryptHash = jest.fn();
const mockBcryptCompare = jest.fn();
jest.unstable_mockModule("bcryptjs", () => ({
  default: { hash: mockBcryptHash, compare: mockBcryptCompare },
}));

// Mock jsonwebtoken
const mockJwtSign = jest.fn().mockReturnValue("mock-jwt-token");
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: { sign: mockJwtSign },
}));

// Mock nodemailer transporter
const mockSendMail = jest.fn();
jest.unstable_mockModule("../src/modules/auth/nodemailer.config.js", () => ({
  default: { sendMail: mockSendMail },
}));

// Mock User model
const mockUserFindOne = jest.fn();
const mockUserExists = jest.fn();
const mockUserSave = jest.fn();
let mockUserInstance = { save: mockUserSave };

jest.unstable_mockModule("../src/modules/auth/User.model.js", () => {
  const MockUser = jest.fn(() => mockUserInstance);
  MockUser.findOne = mockUserFindOne;
  MockUser.exists = mockUserExists;
  return { default: MockUser };
});

// Mock PendingRegistration model
const mockPendingFindOne = jest.fn();
const mockPendingDeleteMany = jest.fn();
const mockPendingFindByIdAndDelete = jest.fn();
const mockPendingSave = jest.fn();
let mockPendingInstance = { save: mockPendingSave };

jest.unstable_mockModule("../src/modules/auth/PendingRegistration.model.js", () => {
  const MockPending = jest.fn(() => mockPendingInstance);
  MockPending.findOne = mockPendingFindOne;
  MockPending.deleteMany = mockPendingDeleteMany;
  MockPending.findByIdAndDelete = mockPendingFindByIdAndDelete;
  return { default: MockPending };
});

// Mock session service
const mockCreateSession = jest.fn();
const mockInvalidateSession = jest.fn();
const mockInvalidateAllUserSessions = jest.fn();
jest.unstable_mockModule("../src/modules/session/session.service.js", () => ({
  createSession: mockCreateSession,
  invalidateSession: mockInvalidateSession,
  invalidateAllUserSessions: mockInvalidateAllUserSessions,
}));

// Mock session controller
const mockSetSessionCookies = jest.fn();
const mockClearSessionCookies = jest.fn();
jest.unstable_mockModule("../src/modules/session/session.controller.js", () => ({
  setSessionCookies: mockSetSessionCookies,
  clearSessionCookies: mockClearSessionCookies,
}));

// Mock Session model (imported by controller but not directly exercised in auth logic)
jest.unstable_mockModule("../src/modules/session/Session.model.js", () => ({
  default: {},
}));

// Mock badge service
const mockCheckAndUnlockBadge = jest.fn();
jest.unstable_mockModule("../src/modules/badges/badge.service.js", () => ({
  checkAndUnlockBadge: mockCheckAndUnlockBadge,
}));

// Mock Auth Middleware — injects user, userId, and sessionId into req for protected routes
jest.unstable_mockModule("../src/modules/auth/middleware.js", () => ({
  default: (req, res, next) => {
    req.user = {
      _id: "testUserId",
      id: "testUserId",
      name: "Test User",
      email: "test@example.com",
      username: "testuser",
      isAccountVerified: true,
      accountStatus: "active",
    };
    req.userId = "testUserId";
    req.sessionId = "testSessionId";
    next();
  },
}));


// ─── Import routes AFTER mocks are registered ─────────────────────────────────

const { default: authRoutes } = await import("../src/modules/auth/routes.js");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);


// ─── Register API Tests ────────────────────────────────────────────────────────

describe("Register API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and tempId when registration succeeds", async () => {
    mockUserFindOne.mockResolvedValue(null);
    mockPendingDeleteMany.mockResolvedValue({});
    mockBcryptHash.mockResolvedValue("hashed-password");
    mockPendingInstance = { _id: "pendingId123", save: mockPendingSave };
    mockPendingSave.mockResolvedValue({});
    mockSendMail.mockResolvedValue({});

    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.tempId).toBeDefined();
  });

  it("should return 400 if name, email, or password is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if passwords do not match", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      confirmPassword: "different",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/do not match/i);
  });

  it("should return 400 if terms and conditions are not accepted", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      acceptedTC: false,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/terms/i);
  });

  it("should return 400 if user with that email already exists", async () => {
    mockUserFindOne.mockResolvedValue({ _id: "existingId", email: "alice@example.com" });

    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already exists/i);
  });
});


// ─── Login API Tests ───────────────────────────────────────────────────────────

describe("Login API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    _id: "userId123",
    name: "Alice",
    email: "alice@example.com",
    password: "hashed-password",
    username: "alice",
    isAccountVerified: true,
    accountStatus: "active",
  };

  const mockSessionData = {
    sessionId: "session123",
    accessToken: "access-token",
    refreshToken: "refresh-token",
  };

  it("should return 200 with user data and tokens on successful login", async () => {
    mockUserFindOne.mockResolvedValue(mockUser);
    mockBcryptCompare.mockResolvedValue(true);
    mockCreateSession.mockResolvedValue(mockSessionData);
    mockSetSessionCookies.mockImplementation(() => {});
    mockJwtSign.mockReturnValue("legacy-token");

    const res = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("alice@example.com");
    expect(res.body.accessToken).toBe("access-token");
    expect(mockCreateSession).toHaveBeenCalledWith("userId123", expect.any(Object));
  });

  it("should return 400 if email or password is missing", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "alice@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if no user found with given email", async () => {
    mockUserFindOne.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("should return 400 if password does not match", async () => {
    mockUserFindOne.mockResolvedValue(mockUser);
    mockBcryptCompare.mockResolvedValue(false);

    const res = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid password/i);
  });

  it("should return 403 if account is not verified", async () => {
    mockUserFindOne.mockResolvedValue({ ...mockUser, isAccountVerified: false });
    mockBcryptCompare.mockResolvedValue(true);

    const res = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/verify your email/i);
  });

  it("should return 403 if account status is not active", async () => {
    mockUserFindOne.mockResolvedValue({ ...mockUser, isAccountVerified: true, accountStatus: "suspended" });
    mockBcryptCompare.mockResolvedValue(true);

    const res = await request(app).post("/api/auth/login").send({
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not active/i);
  });
});


// ─── Logout API Tests ──────────────────────────────────────────────────────────

describe("Logout API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and invalidate the session on logout", async () => {
    mockInvalidateSession.mockResolvedValue(true);
    mockClearSessionCookies.mockImplementation(() => {});

    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/logged out/i);
    expect(mockInvalidateSession).toHaveBeenCalledWith("testSessionId");
    expect(mockClearSessionCookies).toHaveBeenCalled();
  });
});


// ─── Logout All Devices API Tests ─────────────────────────────────────────────

describe("Logout All Devices API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and terminate all sessions", async () => {
    mockInvalidateAllUserSessions.mockResolvedValue({ deletedCount: 3 });
    mockClearSessionCookies.mockImplementation(() => {});

    const res = await request(app).post("/api/auth/logout-all");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.sessionsTerminated).toBe(3);
    expect(mockInvalidateAllUserSessions).toHaveBeenCalledWith("testUserId");
  });
});


// ─── Send Verify OTP API Tests ────────────────────────────────────────────────

describe("Send Verify OTP API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and send OTP for a valid pending registration", async () => {
    const pendingDoc = {
      _id: "pendingId",
      email: "alice@example.com",
      otp: "123456",
      otpExpireAt: new Date(),
      save: jest.fn().mockResolvedValue({}),
    };
    mockPendingFindOne.mockResolvedValue(pendingDoc);
    mockSendMail.mockResolvedValue({});

    const res = await request(app)
      .post("/api/auth/send-verify-otp")
      .send({ email: "alice@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/otp sent/i);
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/send-verify-otp").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 if no pending registration exists for the email", async () => {
    mockPendingFindOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/send-verify-otp")
      .send({ email: "nobody@example.com" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});


// ─── Verify Account API Tests ─────────────────────────────────────────────────

describe("Verify Account API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSessionData = {
    sessionId: "session123",
    accessToken: "access-token",
    refreshToken: "refresh-token",
  };

  it("should return 200, create the user, and log them in after valid OTP", async () => {
    const pendingDoc = {
      _id: "pendingId",
      name: "Alice",
      email: "alice@example.com",
      password: "hashed-password",
      acceptedTC: true,
      otpExpireAt: new Date(Date.now() + 60000), // valid for 1 min
    };
    mockPendingFindOne.mockResolvedValue(pendingDoc);
    mockUserExists.mockResolvedValue(false);
    mockUserInstance = {
      _id: "newUserId",
      name: "Alice",
      email: "alice@example.com",
      username: "alice",
      isAccountVerified: true,
      accountStatus: "active",
      save: jest.fn().mockResolvedValue({}),
    };
    mockCheckAndUnlockBadge.mockResolvedValue({});
    mockPendingFindByIdAndDelete.mockResolvedValue({});
    mockCreateSession.mockResolvedValue(mockSessionData);
    mockSetSessionCookies.mockImplementation(() => {});
    mockJwtSign.mockReturnValue("legacy-token");

    const res = await request(app)
      .post("/api/auth/verify-account")
      .send({ email: "alice@example.com", otp: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("alice@example.com");
    expect(res.body.accessToken).toBe("access-token");
    expect(mockCheckAndUnlockBadge).toHaveBeenCalledWith("newUserId", "welcome");
    expect(mockPendingFindByIdAndDelete).toHaveBeenCalledWith("pendingId");
  });

  it("should return 400 if OTP is missing", async () => {
    const res = await request(app)
      .post("/api/auth/verify-account")
      .send({ email: "alice@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/missing otp/i);
  });

  it("should return 400 if OTP or email does not match a pending registration", async () => {
    mockPendingFindOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/verify-account")
      .send({ email: "alice@example.com", otp: "wrong-otp" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid otp/i);
  });

  it("should return 400 if the OTP has expired", async () => {
    const expiredPending = {
      _id: "pendingId",
      email: "alice@example.com",
      otpExpireAt: new Date(Date.now() - 60000), // expired 1 min ago
    };
    mockPendingFindOne.mockResolvedValue(expiredPending);

    const res = await request(app)
      .post("/api/auth/verify-account")
      .send({ email: "alice@example.com", otp: "123456" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/expired/i);
  });
});


// ─── Is-Auth API Tests ────────────────────────────────────────────────────────

describe("Is-Auth API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with current user info when authenticated", async () => {
    const res = await request(app).get("/api/auth/is-auth");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.username).toBe("testuser");
  });
});


// ─── Send Reset OTP API Tests ─────────────────────────────────────────────────

describe("Send Reset OTP API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and send a reset OTP for a registered email", async () => {
    const userDoc = {
      _id: "userId123",
      email: "alice@example.com",
      resetotp: "",
      resetotpExpireAt: null,
      save: jest.fn().mockResolvedValue({}),
    };
    mockUserFindOne.mockResolvedValue(userDoc);
    mockSendMail.mockResolvedValue({});

    const res = await request(app)
      .post("/api/auth/send-reset-otp")
      .send({ email: "alice@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/otp sent/i);
  });

  it("should return 400 if email is missing", async () => {
    const res = await request(app).post("/api/auth/send-reset-otp").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 if no user exists with the given email", async () => {
    mockUserFindOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/send-reset-otp")
      .send({ email: "nobody@example.com" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});


// ─── Reset Password API Tests ─────────────────────────────────────────────────

describe("Reset Password API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and reset the password with a valid OTP", async () => {
    const userDoc = {
      _id: "userId123",
      email: "alice@example.com",
      resetotp: "654321",
      resetotpExpireAt: new Date(Date.now() + 60000), // valid for 1 min
      save: jest.fn().mockResolvedValue({}),
    };
    mockUserFindOne.mockResolvedValue(userDoc);
    mockBcryptHash.mockResolvedValue("new-hashed-password");

    const res = await request(app).post("/api/auth/reset-password").send({
      email: "alice@example.com",
      otp: "654321",
      newPassword: "newSecurePass!",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/reset successfully/i);
    expect(mockBcryptHash).toHaveBeenCalledWith("newSecurePass!", 10);
  });

  it("should return 400 if email, OTP, or newPassword is missing", async () => {
    const res = await request(app).post("/api/auth/reset-password").send({
      email: "alice@example.com",
      otp: "654321",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 if user is not found", async () => {
    mockUserFindOne.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/reset-password").send({
      email: "nobody@example.com",
      otp: "654321",
      newPassword: "newPass",
    });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if the OTP does not match", async () => {
    mockUserFindOne.mockResolvedValue({
      _id: "userId123",
      email: "alice@example.com",
      resetotp: "correct-otp",
      resetotpExpireAt: new Date(Date.now() + 60000),
      save: jest.fn(),
    });

    const res = await request(app).post("/api/auth/reset-password").send({
      email: "alice@example.com",
      otp: "wrong-otp",
      newPassword: "newPass",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid otp/i);
  });

  it("should return 400 if the OTP has expired", async () => {
    mockUserFindOne.mockResolvedValue({
      _id: "userId123",
      email: "alice@example.com",
      resetotp: "654321",
      resetotpExpireAt: new Date(Date.now() - 60000), // expired 1 min ago
      save: jest.fn(),
    });

    const res = await request(app).post("/api/auth/reset-password").send({
      email: "alice@example.com",
      otp: "654321",
      newPassword: "newPass",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/expired/i);
  });
});
