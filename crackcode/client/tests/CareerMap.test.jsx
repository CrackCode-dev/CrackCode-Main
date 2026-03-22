import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi } from "vitest";

// ── Hoisted mocks ─────────────────────────────────────────────────────────────
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

// ── Module mocks ──────────────────────────────────────────────────────────────
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../src/services/api/careermapService", () => ({
  fetchProgress: vi.fn(),
  fetchChapterQuestionCount: vi.fn(),
  fetchChapterQuestions: vi.fn(),
  updateProgress: vi.fn(),
  toBackendCareerId: vi.fn((id) =>
    ({ "Software-Engineer": "SoftwareEngineer", "ML-Engineer": "MLEngineer", "Data-Scientist": "DataScientist" }[id] || id)
  ),
}));

vi.mock("../src/pages/careermap/CareerChapters", () => ({
  getChapterByCareerId: vi.fn(),
}));

// Stub layout/nav components that need auth or theme context
vi.mock("../src/components/common/Footer", () => ({ default: () => <div data-testid="footer" /> }));
vi.mock("../src/components/common/HQBtn",   () => ({ default: () => <button data-testid="hq-btn">HQ</button> }));
vi.mock("../src/components/common/Header",  () => ({ default: () => <header data-testid="header" /> }));

// ── Component / data imports ──────────────────────────────────────────────────
import CareermapMain              from "../src/pages/careermap/CareermapMain";
import CareerChapterSelectionPage from "../src/pages/careermap/CareerChapterSelection";
import ResultsPage                from "../src/pages/careermap/Results";
import {
  careers,
  getCareerById,
  getCareersByDifficulty,
  getCareersByCategory,
  getUnlockedCareers,
  getLockedCareers,
  getDifficultyLabel,
} from "../src/pages/careermap/careers";
import { fetchProgress, fetchChapterQuestionCount } from "../src/services/api/careermapService";
import { getChapterByCareerId } from "../src/pages/careermap/CareerChapters";

// ── Shared test data ──────────────────────────────────────────────────────────
const mockChapters = [
  {
    id: "oop",
    title: "Object Oriented Programming",
    description: "Core OOP concepts",
    icon: "oop-icon",
    categories: ["General Programming"],
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "DSA essentials",
    icon: "dsa-icon",
    categories: ["Data Structures"],
  },
];

// ── Render helpers ────────────────────────────────────────────────────────────
const renderInRouter = (ui, route = "/") =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);

/** Renders a component inside Routes so useParams() is populated. */
const renderChapterPage = (careerId = "Software-Engineer", state = null) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: `/careermap/${careerId}`, state }]}>
      <Routes>
        <Route path="/careermap/:careerId" element={<CareerChapterSelectionPage />} />
      </Routes>
    </MemoryRouter>
  );

// =============================================================================
// 1. careers.jsx — Pure utility functions
// =============================================================================
describe("careers.jsx – Utility Functions", () => {
  test("exports exactly 6 career entries", () => {
    expect(careers).toHaveLength(6);
  });

  test("every career has required fields", () => {
    careers.forEach((c) => {
      expect(c).toHaveProperty("id");
      expect(c).toHaveProperty("title");
      expect(c).toHaveProperty("difficulty");
      expect(typeof c.locked).toBe("boolean");
      expect(Array.isArray(c.focus)).toBe(true);
    });
  });

  test("getCareerById returns the matching career", () => {
    const se = getCareerById("Software-Engineer");
    expect(se).toBeDefined();
    expect(se.title).toBe("Software Engineer");
  });

  test("getCareerById returns undefined for unknown id", () => {
    expect(getCareerById("nonexistent-id")).toBeUndefined();
  });

  test("getCareersByDifficulty returns only careers of that difficulty", () => {
    const easy = getCareersByDifficulty("easy");
    expect(easy.length).toBeGreaterThan(0);
    expect(easy.every((c) => c.difficulty === "easy")).toBe(true);

    const hard = getCareersByDifficulty("hard");
    expect(hard.every((c) => c.difficulty === "hard")).toBe(true);
  });

  test("getCareersByCategory returns only careers of that category", () => {
    const software = getCareersByCategory("software");
    expect(software.length).toBeGreaterThan(0);
    expect(software.every((c) => c.category === "software")).toBe(true);
  });

  test("getUnlockedCareers returns only unlocked careers", () => {
    const unlocked = getUnlockedCareers();
    expect(unlocked.length).toBeGreaterThan(0);
    expect(unlocked.every((c) => !c.locked)).toBe(true);
  });

  test("getLockedCareers returns only locked careers", () => {
    const locked = getLockedCareers();
    expect(locked.length).toBeGreaterThan(0);
    expect(locked.every((c) => c.locked)).toBe(true);
  });

  test("unlocked + locked counts equal total careers", () => {
    expect(getUnlockedCareers().length + getLockedCareers().length).toBe(careers.length);
  });

  test.each([
    ["easy",    "BEGINNER"],
    ["medium",  "INTERMEDIATE"],
    ["hard",    "ADVANCED"],
    ["unknown", "BEGINNER"], // fallback
  ])("getDifficultyLabel('%s') returns '%s'", (input, expected) => {
    expect(getDifficultyLabel(input)).toBe(expected);
  });
});

// =============================================================================
// 2. CareermapMain — Career Selection Page
// =============================================================================
describe("CareermapMain – Career Selection Page", () => {
  beforeEach(() => mockNavigate.mockClear());

  test("renders the page heading", () => {
    renderInRouter(<CareermapMain />);
    expect(screen.getByText(/Choose the best career path/i)).toBeInTheDocument();
  });

  test("renders all 6 career titles", () => {
    renderInRouter(<CareermapMain />);
    [
      "Software Engineer",
      "ML Engineer",
      "Data Scientist",
      "Backend Developer",
      "Game Developer",
      "Web Developer",
    ].forEach((title) => expect(screen.getByText(title)).toBeInTheDocument());
  });

  test("renders difficulty badges (BEGINNER, INTERMEDIATE, ADVANCED)", () => {
    renderInRouter(<CareermapMain />);
    expect(screen.getByText("BEGINNER")).toBeInTheDocument();
    expect(screen.getAllByText("INTERMEDIATE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ADVANCED").length).toBeGreaterThan(0);
  });

  test("navigates to career page when an unlocked card is clicked", () => {
    renderInRouter(<CareermapMain />);
    fireEvent.click(screen.getByText("Software Engineer"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/careermap/Software-Engineer",
      expect.objectContaining({ state: expect.any(Object) })
    );
  });

  test("does NOT navigate when a locked career card is clicked", () => {
    renderInRouter(<CareermapMain />);
    fireEvent.click(screen.getByText("Backend Developer"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("locked careers (Backend Developer, Game Developer, Web Developer) are all rendered", () => {
    renderInRouter(<CareermapMain />);
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("Game Developer")).toBeInTheDocument();
    expect(screen.getByText("Web Developer")).toBeInTheDocument();
  });

  test("renders language info for Software Engineer card", () => {
    renderInRouter(<CareermapMain />);
    expect(screen.getByText(/Python\/Java/i)).toBeInTheDocument();
  });
});

// =============================================================================
// 3. CareerChapterSelectionPage — Chapter Selection
// =============================================================================
describe("CareerChapterSelectionPage – Chapter Selection", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    getChapterByCareerId.mockReturnValue(mockChapters);
    fetchProgress.mockResolvedValue({ chapters: [] });
    fetchChapterQuestionCount.mockResolvedValue(15);
    Storage.prototype.getItem = vi.fn(() => null);
  });

  test("renders career title from navigation state", async () => {
    renderChapterPage("Software-Engineer", { title: "Software Engineer" });
    expect(await screen.findByText("Software Engineer")).toBeInTheDocument();
  });

  test("falls back to CAREER_TITLES map when no navigation state provided", async () => {
    renderChapterPage("Software-Engineer", null);
    expect(await screen.findByText("Software Engineer")).toBeInTheDocument();
  });

  test("renders all chapter titles", async () => {
    renderChapterPage();
    expect(await screen.findByText("Object Oriented Programming")).toBeInTheDocument();
    expect(await screen.findByText("Data Structures & Algorithms")).toBeInTheDocument();
  });

  test("first chapter is always unlocked (Start Quiz button visible)", async () => {
    renderChapterPage();
    const startBtns = await screen.findAllByText(/Start Quiz/i);
    expect(startBtns.length).toBeGreaterThanOrEqual(1);
  });

  test("second chapter is locked when first has not been passed", async () => {
    // fetchProgress returns no passed chapters; localStorage returns null
    renderChapterPage();
    await waitFor(() => screen.getByText("Data Structures & Algorithms"));
    expect(screen.getAllByText(/Start Quiz/i)).toHaveLength(1);
  });

  test("second chapter unlocks when first chapter is marked as passed", async () => {
    fetchProgress.mockResolvedValue({
      chapters: [{ chapterId: "oop", passed: true, easyScore: 5, mediumScore: 5, hardScore: 5 }],
    });
    renderChapterPage();
    await waitFor(() => screen.getByText("Data Structures & Algorithms"));
    expect(screen.getAllByText(/Start Quiz/i)).toHaveLength(2);
  });

  test("calls fetchProgress with the correct careerId", async () => {
    renderChapterPage("Software-Engineer");
    await waitFor(() => expect(fetchProgress).toHaveBeenCalledWith("Software-Engineer"));
  });

  test("calls fetchChapterQuestionCount for each chapter", async () => {
    renderChapterPage();
    await waitFor(() =>
      expect(fetchChapterQuestionCount).toHaveBeenCalledTimes(mockChapters.length)
    );
  });

  test("shows 'Career path not found' for an unknown careerId", async () => {
    getChapterByCareerId.mockReturnValue([]);
    renderChapterPage("unknown-career");
    expect(await screen.findByText(/Career path not found/i)).toBeInTheDocument();
  });

  test("'Back' link navigates to /careermap when career is not found", async () => {
    getChapterByCareerId.mockReturnValue([]);
    renderChapterPage("unknown-career");
    await screen.findByText(/Career path not found/i);
    fireEvent.click(screen.getByText(/← Back/i));
    expect(mockNavigate).toHaveBeenCalledWith("/careermap");
  });

  test("navigates to quiz page when an unlocked chapter is clicked", async () => {
    renderChapterPage("Software-Engineer", { title: "Software Engineer" });
    const startBtns = await screen.findAllByText(/Start Quiz/i);
    fireEvent.click(startBtns[0]);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/careermap/Software-Engineer/quiz/oop",
      expect.objectContaining({ state: expect.any(Object) })
    );
  });

  test("falls back to localStorage when fetchProgress rejects", async () => {
    fetchProgress.mockRejectedValue(new Error("Network error"));
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_oop_passed" ? "true" : null
    );
    renderChapterPage("Software-Engineer");
    // oop passed via localStorage → dsa should be unlocked
    await waitFor(() =>
      expect(screen.getAllByText(/Start Quiz/i)).toHaveLength(2)
    );
  });
});

// =============================================================================
// 4. ResultsPage — Quiz Results
// =============================================================================
describe("ResultsPage – Quiz Results", () => {
  const defaultProps = {
    score: 10,
    total: 15,
    title: "Software Engineer",
    subtitle: "Object Oriented Programming",
    careerId: "Software-Engineer",
    currentChapterId: "oop",
    onRestart: vi.fn(),
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    Storage.prototype.getItem = vi.fn(() => null);
    getChapterByCareerId.mockReturnValue(mockChapters);
  });

  const renderResults = (props = {}) =>
    renderInRouter(<ResultsPage {...defaultProps} {...props} />);

  test("renders the career title and chapter subtitle", () => {
    renderResults();
    // Title may appear in both the heading and the completion banner; check at least one exists
    expect(screen.getAllByText("Software Engineer").length).toBeGreaterThan(0);
    expect(screen.getByText("Object Oriented Programming")).toBeInTheDocument();
  });

  test("renders the score in the score circle", () => {
    renderResults({ score: 10 });
    // The score circle contains the raw number
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);
  });

  test("renders correct/wrong/percentage stats", () => {
    renderResults({ score: 10, total: 15 });
    expect(screen.getByText("5")).toBeInTheDocument();    // wrong = 15 - 10
    expect(screen.getByText("67%")).toBeInTheDocument();  // Math.round(10/15*100)
    expect(screen.getByText("Correct")).toBeInTheDocument();
    expect(screen.getByText("Wrong")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();
  });

  test("shows 'Perfect Score' when score equals total", () => {
    renderResults({ score: 15, total: 15 });
    expect(screen.getByText(/Perfect Score/i)).toBeInTheDocument();
  });

  test("shows 'Well Done' when score is at least half of total", () => {
    renderResults({ score: 10, total: 15 });
    expect(screen.getByText(/Well Done/i)).toBeInTheDocument();
  });

  test("shows 'Keep Practicing' when score is below half of total", () => {
    renderResults({ score: 5, total: 15 });
    expect(screen.getByText(/Keep Practicing/i)).toBeInTheDocument();
  });

  test("always renders a 'Try Again' button", () => {
    renderResults();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  test("calls onRestart when 'Try Again' is clicked", () => {
    const onRestart = vi.fn();
    renderResults({ onRestart });
    fireEvent.click(screen.getByText("Try Again"));
    expect(onRestart).toHaveBeenCalled();
  });

  test("shows 'Back to Chapters' when score < 8", () => {
    renderResults({ score: 5 });
    expect(screen.getByText(/Back to Chapters/i)).toBeInTheDocument();
  });

  test("navigates to chapter selection on 'Back to Chapters' click", () => {
    renderResults({ score: 5 });
    fireEvent.click(screen.getByText(/Back to Chapters/i));
    expect(mockNavigate).toHaveBeenCalledWith("/careermap/Software-Engineer");
  });

  test("shows 'Chapter unlocked!' banner when chapter is passed and a next chapter exists", async () => {
    // Mark oop as passed in localStorage; mockChapters has dsa as next
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_oop_passed" ? "true" : null
    );
    renderResults({ score: 10 });
    expect(await screen.findByText("Chapter unlocked!")).toBeInTheDocument();
  });

  test("shows 'Next' button when chapter is passed and a next chapter exists", async () => {
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_oop_passed" ? "true" : null
    );
    renderResults({ score: 10 });
    expect(await screen.findByText("Next")).toBeInTheDocument();
  });

  test("navigates to next chapter quiz on 'Next' button click", async () => {
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_oop_passed" ? "true" : null
    );
    renderResults({ score: 10 });
    fireEvent.click(await screen.findByText("Next"));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/careermap/Software-Engineer/quiz/dsa",
      expect.objectContaining({ state: expect.any(Object) })
    );
  });

  test("shows 'Career Path Completed!' on the last chapter when passed", async () => {
    // Use dsa (index 1 = last in mockChapters) as current chapter
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_dsa_passed" ? "true" : null
    );
    renderResults({ score: 10, currentChapterId: "dsa" });
    expect(await screen.findByText(/Career Path Completed/i)).toBeInTheDocument();
  });

  test("shows 'Back to Career Map' on the last chapter when passed", async () => {
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_dsa_passed" ? "true" : null
    );
    renderResults({ score: 10, currentChapterId: "dsa" });
    expect(await screen.findByText("Back to Career Map")).toBeInTheDocument();
  });

  test("navigates to /careermap on 'Back to Career Map' click", async () => {
    Storage.prototype.getItem = vi.fn((key) =>
      key === "Software-Engineer_dsa_passed" ? "true" : null
    );
    renderResults({ score: 10, currentChapterId: "dsa" });
    fireEvent.click(await screen.findByText("Back to Career Map"));
    expect(mockNavigate).toHaveBeenCalledWith("/careermap");
  });
});
