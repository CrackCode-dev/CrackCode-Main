import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DetectiveStore from "../src/pages/shop/DetectiveStore";


// If using Vitest, use vi.fn(). If using Jest, use jest.fn()
import { vi } from "vitest"; 

// Mock Toastify so it doesn't throw errors
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// 1. Use vi.hoisted so Vitest knows about this BEFORE mocking
const { mockNavigate, mockSetTheme } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetTheme: vi.fn(),
}));

// 2. Now mock react-router-dom safely
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../src/context/theme/ThemeContext", () => ({
    useTheme: () => ({
      theme: "midnight",
      setTheme: mockSetTheme,
    }),
  }));

// Setup a helper function to wrap the component with needed Contexts
const renderWithProviders = (ui, { route = "/store" } = {}) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        {ui}
      </MemoryRouter>
    );
  };

// Mock the global fetch API
global.fetch = vi.fn();

describe("DetectiveStore Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage for the token
    Storage.prototype.getItem = vi.fn(() => "mock-token");

    // Setup default successful responses for the 3 initial API calls
    global.fetch.mockImplementation(async (url) => {
      if (url.includes("/api/profile")) {
        return { ok: true, json: async () => ({ user: { username: "Sherlock", tokens: 500 } }) };
      }
      if (url.includes("/api/shop/items")) {
        return { 
          ok: true, 
          json: async () => ([
            { _id: "item1", name: "Trench Coat", category: "avatar", pricing: { type: "tokens", amount: 100 } },
            { _id: "item2", name: "Magnifying Glass", category: "avatar", pricing: { type: "paid", amount: 5 } }
          ]) 
        };
      }
      if (url.includes("/api/shop/inventory")) {
        return { ok: true, json: async () => ([]) };
      }
      return { ok: false, status: 404 };
    });
  });

  
  // Check if the UI loads user data and items correctly
 
  it("fetches and displays the user profile and store items on load", async () => {
    renderWithProviders(<DetectiveStore />);

    // Verify it shows loading state initially
    expect(screen.getByText("Loading store items...")).toBeInTheDocument();

    // Wait for the async fetch calls to resolve and UI to update
    await waitFor(() => {
      expect(screen.queryByText("Loading store items...")).not.toBeInTheDocument();
    });

    // Check if profile loaded (500 tokens from our mock)
    expect(screen.getByText("500 Tokens")).toBeInTheDocument();
    
    // Because StoreGrid is a child component, we'll verify it received the items 
    // by checking if the item names made it to the DOM
    expect(await screen.findByText("Trench Coat")).toBeInTheDocument();
  });

  
  // TEST 2: Check token purchase interaction
  
  it("calls the purchase API when buying an item with tokens", async () => {
    renderWithProviders(<DetectiveStore />);

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByText("Loading store items...")).not.toBeInTheDocument();
    });

    screen.debug();

    // Temporarily change the fetch mock to intercept the POST request for purchasing
    global.fetch.mockImplementationOnce(async (url, options) => {
      if (url.includes("/api/shop/purchase") && options.method === "POST") {
        return { ok: true, json: async () => ({ success: true, message: "Purchase successful!" }) };
      }
    });

    
    // If your button just says "Buy", change this to match

    const buyButtons = await screen.findAllByText(/Buy/i);
    fireEvent.click(buyButtons[0]);

    // Verify the API was called with the correct endpoint
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/shop/purchase"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "Authorization": "Bearer mock-token"
          }),
        })
      );
    });
  });

  

  // TEST 3: Check Stripe success redirect logic
  
  it("verifies the Stripe session and updates inventory on payment=success", async () => {
    
    // 1. Intercept fetch safely, maintaining basic responses for the standard loaders
    global.fetch.mockImplementation(async (url) => {
      if (url.includes("/api/payment/verify-session")) {
        return { ok: true, json: async () => ({ success: true }) };
      }
      if (url.includes("/api/profile")) return { ok: true, json: async () => ({ user: { tokens: 500 } }) };
      if (url.includes("/api/shop/items")) return { ok: true, json: async () => ([]) };
      if (url.includes("/api/shop/inventory")) return { ok: true, json: async () => ([]) };
      return { ok: true, json: async () => ({}) }; 
    });

    const { toast } = await import("react-toastify");

    // 2. Render the component exactly as Stripe would redirect the user
    renderWithProviders(<DetectiveStore />, {
      route: "/store?payment=success&session_id=cs_test_123"
    });

    await waitFor(() => {
      // 3. Did it ask the backend to verify the Stripe session?
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/payment/verify-session?session_id=cs_test_123"),
        expect.any(Object)
      );

      // 4. Did it show the success message? (Removed the 'undefined' argument!)
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Payment successful")
      );

      // 5. Did it clean up the URL parameters?
      expect(mockNavigate).toHaveBeenCalledWith("/store", { replace: true });
    });
  });

  
  // TEST 4: Check Inventory Tab Switching
  
  it("switches to the inventory tab and displays owned items", async () => {
    // 1. Mock the API to return a specific item in the inventory
    global.fetch.mockImplementation(async (url) => {
      if (url.includes("/api/profile")) return { ok: true, json: async () => ({ user: { tokens: 500 } }) };
      if (url.includes("/api/shop/items")) return { ok: true, json: async () => ([]) };
      if (url.includes("/api/shop/inventory")) {
        return { 
          ok: true, 
          json: async () => ([
            { 
              _id: "inv1", 
              itemId: { _id: "theme1", name: "Midnight Theme", category: "theme", metadata: { themeKey: "midnight" } },
              isEquipped: false 
            }
          ]) 
        };
      }
      return { ok: true, json: async () => ({}) }; 
    });

    renderWithProviders(<DetectiveStore />);

    // Wait for initial load
    await waitFor(() => expect(screen.queryByText("Loading store items...")).not.toBeInTheDocument());

    // 2. Find and click the Inventory category button in the sidebar
    // NOTE: Update "Inventory" if your StoreSidebar uses a different label!
    const inventoryTab = await screen.findByText(/Inventory/i);
    fireEvent.click(inventoryTab);

    // 3. Verify the inventory item renders on the screen
    expect(await screen.findByText("Midnight Theme")).toBeInTheDocument();
  });

  
  // TEST 5: Check Equip Functionality & Theme Context Update
  
  it("calls the equip API and updates the theme context", async () => {
    

    // Setup the mock API to succeed when equipping
// Setup the mock API to succeed when equipping
global.fetch.mockImplementation(async (url, options) => {
  // Catch the specific equip-item POST request FIRST!
  if (url.includes("/api/profile/equip-item") && options?.method === "POST") {
    return { ok: true, json: async () => ({ success: true, message: "Equipped!" }) };
  }
  
  // THEN catch the standard loaders
  if (url.endsWith("/api/profile")) return { ok: true, json: async () => ({ user: { tokens: 500 } }) };
  if (url.includes("/api/shop/items")) return { ok: true, json: async () => ([]) };
  if (url.includes("/api/shop/inventory") && (!options || options.method === "GET")) {
    return { 
      ok: true, 
      json: async () => ([
        { 
          _id: "inv1", 
          itemId: { _id: "theme1", name: "Midnight Theme", category: "theme", metadata: { themeKey: "midnight" } },
          isEquipped: false 
        }
      ]) 
    };
  }
  return { ok: true, json: async () => ({}) }; 
});

    renderWithProviders(<DetectiveStore />);

    // Wait for load, then click Inventory tab
    await waitFor(() => expect(screen.queryByText("Loading store items...")).not.toBeInTheDocument());
    fireEvent.click(await screen.findByText(/Inventory/i));

    screen.debug();

    // 2. Find and click the Equip button
    // NOTE: Adjust "Equip" if your button says something else
    const equipButton = await screen.findByText(/Apply Theme/i);
    fireEvent.click(equipButton);

    await waitFor(() => {
      // 3. Verify the API was called with the right data
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/profile/equip-item"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ itemId: "theme1", category: "theme" })
        })
      );

      // 4. Verify the ThemeContext was updated with the new theme key!
      expect(mockSetTheme).toHaveBeenCalledWith("midnight");
    });
  });

  // TEST 6: Check Stripe Checkout Initialization
  
  it("calls the checkout API when buying a paid item", async () => {
    // 1. Setup standard load, plus a paid item in the store
    global.fetch.mockImplementation(async (url, options) => {
      if (url.includes("/api/profile")) return { ok: true, json: async () => ({ user: { tokens: 500 } }) };
      if (url.includes("/api/shop/inventory")) return { ok: true, json: async () => ([]) };
      if (url.includes("/api/shop/items")) {
        return { 
          ok: true, 
          json: async () => ([
            { _id: "paid1", name: "Pro Detective Badge", category: "title", pricing: { type: "paid", amount: 5 } }
          ]) 
        };
      }
      // Intercept the checkout POST
      if (url.includes("/api/shop/checkout") && options?.method === "POST") {
        return { ok: true, json: async () => ({ success: true, url: "https://mock-stripe.com/checkout" }) };
      }
      return { ok: true, json: async () => ({}) }; 
    });

    renderWithProviders(<DetectiveStore />);

    await waitFor(() => expect(screen.queryByText("Loading store items...")).not.toBeInTheDocument());

    // 2. Click the button to buy the paid item
    // NOTE: Change this text to match whatever your paid button says (e.g., "$5.00", "Buy for $5")
    const paidBuyButton = await screen.findByText(/Buy/i); 
    fireEvent.click(paidBuyButton);

    // 3. Verify the server was pinged to create the Stripe session
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/shop/checkout"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ itemId: "paid1" })
        })
      );
    });
  });
});