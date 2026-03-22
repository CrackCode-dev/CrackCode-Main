import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// .env variables for testing
process.env.STRIPE_SECRET_KEY = "test_stripe_secret";
process.env.STRIPE_WEBHOOK_SECRET = "test_webhook_secret";


// SETUP MOCKS FIRST (Before any dynamic imports)

// Mock Auth Middleware
jest.unstable_mockModule("../src/modules/auth/middleware.js", () => ({
  default: (req, res, next) => {
    req.user = { _id: "testUserId" };
    next();
  },
}));

// Create mock functions for the Shop Service
const mockGetShopItems = jest.fn();
const mockPurchaseItemWithTokens = jest.fn();
const mockGetMyInventory = jest.fn();
const mockCreateCheckoutSession = jest.fn();
const mockFinalizePaidPurchase = jest.fn();

// Mock the Shop Service
jest.unstable_mockModule("../src/modules/shop/Shop.service.js", () => ({
  getShopItems: mockGetShopItems,
  purchaseItemWithTokens: mockPurchaseItemWithTokens,
  getMyInventory: mockGetMyInventory,
  createCheckoutSession: mockCreateCheckoutSession,
  finalizePaidPurchase: mockFinalizePaidPurchase,
}));

// Create a mock for Stripe's constructEvent
const mockConstructEvent = jest.fn();

// Mock the Stripe library globally for ESM
jest.unstable_mockModule("stripe", () => ({
  default: jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  })),
}));


// Import the router AFTER mocks are registered
const { default: shopRoutes } = await import("../src/routes/Shop.routes.js");

const app = express();
app.use(express.json()); 
app.use("/api/shop", shopRoutes);


// 3. TEST SUITES


describe("Shop API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // GET /items
 
  it("should return shop items", async () => {
    mockGetShopItems.mockResolvedValue([
      { name: "Item 1" },
      { name: "Item 2" },
    ]);

    const res = await request(app).get("/api/shop/items");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.items.length).toBe(2);
  });

  // POST /purchase

  it("should purchase item successfully", async () => {
    mockPurchaseItemWithTokens.mockResolvedValue({
      success: true,
      remainingTokens: 100,
    });

    const res = await request(app)
      .post("/api/shop/purchase")
      .send({ itemId: "item123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should fail if itemId is missing", async () => {
    // Assuming your controller handles the missing ID and returns 400
    const res = await request(app)
      .post("/api/shop/purchase")
      .send({});

    expect(res.status).toBe(400);
  });

  // GET /inventory

  it("should return user inventory", async () => {
    mockGetMyInventory.mockResolvedValue([
      { itemId: "item1" },
    ]);

    const res = await request(app).get("/api/shop/inventory");

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
  });

  // POST /checkout

  it("should create checkout session", async () => {
    mockCreateCheckoutSession.mockResolvedValue({
      success: true,
      url: "http://checkout",
      sessionId: "sess_123",
    });

    const res = await request(app)
      .post("/api/shop/checkout")
      .send({ itemId: "item123" });

    expect(res.status).toBe(200);
    expect(res.body.url).toBe("http://checkout");
  });


  // Stripe Webhook

  it("should handle webhook successfully", async () => {
    // Setup the mocked Stripe response
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "sess_123",
          metadata: {
            userId: "user1",
            itemId: "item1",
          },
        },
      },
    });

    mockFinalizePaidPurchase.mockResolvedValue({
      success: true,
    });

    const res = await request(app)
      .post("/api/shop/webhook")
      .set("stripe-signature", "test-signature")
      .send({});

    expect(res.status).toBe(200);
    
    // Verify that the construct event was actually called
    expect(mockConstructEvent).toHaveBeenCalled();
    expect(mockFinalizePaidPurchase).toHaveBeenCalled();
  });
});