import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";


// SETUP MOCKS FIRST (Before any dynamic imports)

// Mock Auth Middleware — sets both req.user.id and req.userId to cover both controllers
jest.unstable_mockModule("../src/modules/auth/middleware.js", () => ({
  default: (req, res, next) => {
    req.user = { id: "testUserId" };
    req.userId = "testUserId";
    next();
  },
}));

// Mock Question Service
const mockGetQuestionsByDifficulty = jest.fn();
const mockGetQuestionById = jest.fn();
const mockGetQuestionsByCategoryAndDifficulty = jest.fn();
const mockGetAllQuestions = jest.fn();
const mockCountQuestionsByCategories = jest.fn();

jest.unstable_mockModule("../src/modules/Career Map/questions/question.service.js", () => ({
  getQuestionsByDifficulty: mockGetQuestionsByDifficulty,
  getQuestionById: mockGetQuestionById,
  getQuestionsByCategoryAndDifficulty: mockGetQuestionsByCategoryAndDifficulty,
  getAllQuestions: mockGetAllQuestions,
  countQuestionsByCategories: mockCountQuestionsByCategories,
}));

// Mock User model
const mockUserFindByIdAndUpdate = jest.fn();
jest.unstable_mockModule("../src/modules/auth/User.model.js", () => ({
  default: { findByIdAndUpdate: mockUserFindByIdAndUpdate },
}));

// Mock UserProgress model
const mockUserProgressFindOne = jest.fn();
const mockUserProgressFindOneAndUpdate = jest.fn();
jest.unstable_mockModule("../src/modules/learn/UserProgress.model.js", () => ({
  default: {
    findOne: mockUserProgressFindOne,
    findOneAndUpdate: mockUserProgressFindOneAndUpdate,
  },
}));

// Mock Badge service
const mockCheckAndUnlockMultipleBadges = jest.fn();
jest.unstable_mockModule("../src/modules/badges/badge.service.js", () => ({
  checkAndUnlockMultipleBadges: mockCheckAndUnlockMultipleBadges,
}));

// Mock Progress model
const mockProgressFindOne = jest.fn();
const mockProgressFind = jest.fn();
const mockProgressCreate = jest.fn();
jest.unstable_mockModule("../src/modules/Career Map/progress/progress.model.js", () => ({
  default: {
    findOne: mockProgressFindOne,
    find: mockProgressFind,
    create: mockProgressCreate,
  },
}));

// Mock Progress service
const mockUpdateChapterProgress = jest.fn();
const mockResetProgressService = jest.fn();
jest.unstable_mockModule("../src/modules/Career Map/progress/progress.service.js", () => ({
  updateChapterProgress: mockUpdateChapterProgress,
  getProgressByUserId: jest.fn(),
  resetProgress: mockResetProgressService,
}));


// Import routes AFTER mocks are registered
const { default: questionRoutes } = await import("../src/modules/Career Map/questions/question.routes.js");
const { default: progressRoutes } = await import("../src/modules/Career Map/progress/progress.routes.js");

const app = express();
app.use(express.json());
app.use("/api/questions", questionRoutes);
app.use("/api/progress", progressRoutes);


// ─── Questions API Tests ──────────────────────────────────────────────────────

describe("Questions API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/questions/careers

  it("should return all available career paths", async () => {
    const res = await request(app).get("/api/questions/careers");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data.map((c) => c.id)).toEqual(
      expect.arrayContaining(["MLEngineer", "DataScientist", "SoftwareEngineer"])
    );
  });

  // GET /api/questions/count

  it("should return question count for valid career and categories", async () => {
    mockCountQuestionsByCategories.mockResolvedValue(20);

    const res = await request(app)
      .get("/api/questions/count")
      .query({ career: "MLEngineer", categories: "Neural Networks,Deep Learning" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(20);
  });

  it("should return 400 if career or categories are missing from count", async () => {
    const res = await request(app)
      .get("/api/questions/count")
      .query({ career: "MLEngineer" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career in count", async () => {
    const res = await request(app)
      .get("/api/questions/count")
      .query({ career: "InvalidCareer", categories: "Algorithms" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // GET /api/questions

  it("should return questions for valid career and difficulty", async () => {
    const mockQuestions = [
      { _id: "q1", question: "What is a tensor?", difficulty: "Easy" },
      { _id: "q2", question: "Explain gradient descent.", difficulty: "Easy" },
    ];
    mockGetQuestionsByDifficulty.mockResolvedValue(mockQuestions);

    const res = await request(app)
      .get("/api/questions")
      .query({ career: "MLEngineer", difficulty: "Easy" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.data).toHaveLength(2);
  });

  it("should return questions filtered by category when provided", async () => {
    const mockQuestions = [
      { _id: "q3", question: "What is backpropagation?", category: "Neural Networks", difficulty: "Medium" },
    ];
    mockGetQuestionsByCategoryAndDifficulty.mockResolvedValue(mockQuestions);

    const res = await request(app)
      .get("/api/questions")
      .query({ career: "DataScientist", difficulty: "Medium", category: "Neural Networks" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockGetQuestionsByCategoryAndDifficulty).toHaveBeenCalledWith(
      "DataScientist",
      "Neural Networks",
      "Medium"
    );
  });

  it("should return 400 if career is missing from questions", async () => {
    const res = await request(app)
      .get("/api/questions")
      .query({ difficulty: "Easy" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if difficulty is missing from questions", async () => {
    const res = await request(app)
      .get("/api/questions")
      .query({ career: "MLEngineer" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career in questions", async () => {
    const res = await request(app)
      .get("/api/questions")
      .query({ career: "FakeCareer", difficulty: "Easy" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // GET /api/questions/:id

  it("should return a single question by id", async () => {
    const mockQuestion = {
      _id: "q1",
      question: "What is a neural network?",
      difficulty: "Easy",
      type: "mcq",
      correctAnswer: "A",
    };
    mockGetQuestionById.mockResolvedValue(mockQuestion);

    const res = await request(app)
      .get("/api/questions/q1")
      .query({ career: "MLEngineer" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe("q1");
  });

  it("should return 404 if question is not found", async () => {
    mockGetQuestionById.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/questions/nonexistent")
      .query({ career: "MLEngineer" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if career is missing when getting single question", async () => {
    const res = await request(app).get("/api/questions/q1");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career when getting single question", async () => {
    const res = await request(app)
      .get("/api/questions/q1")
      .query({ career: "InvalidCareer" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // POST /api/questions/submit

  it("should return correct: true for a correct MCQ answer (first completion)", async () => {
    mockGetQuestionById.mockResolvedValue({
      _id: "q1",
      correctAnswer: "gradient descent",
      type: "mcq",
    });
    mockUserProgressFindOne.mockResolvedValue(null); // first time
    mockUserProgressFindOneAndUpdate.mockResolvedValue({});
    mockUserFindByIdAndUpdate.mockResolvedValue({ casesSolved: 1 });
    mockCheckAndUnlockMultipleBadges.mockResolvedValue(["beginner"]);

    const res = await request(app)
      .post("/api/questions/submit")
      .send({ career: "MLEngineer", questionId: "q1", answer: "gradient descent" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.correct).toBe(true);
    expect(res.body.badgesUnlocked).toContain("beginner");
  });

  it("should return correct: false and reveal the correct answer for a wrong answer", async () => {
    mockGetQuestionById.mockResolvedValue({
      _id: "q1",
      correctAnswer: "gradient descent",
      type: "mcq",
    });

    const res = await request(app)
      .post("/api/questions/submit")
      .send({ career: "MLEngineer", questionId: "q1", answer: "wrong answer" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.correct).toBe(false);
    expect(res.body.correctAnswer).toBe("gradient descent");
  });

  it("should accept fill_blank answers that match any valid alternative", async () => {
    mockGetQuestionById.mockResolvedValue({
      _id: "q2",
      correctAnswer: "relu,ReLU,Rectified Linear Unit",
      type: "fill_blank",
    });
    mockUserProgressFindOne.mockResolvedValue({ status: "completed" }); // already completed

    const res = await request(app)
      .post("/api/questions/submit")
      .send({ career: "DataScientist", questionId: "q2", answer: "ReLU" });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
  });

  it("should return 400 if required fields are missing from submit", async () => {
    const res = await request(app)
      .post("/api/questions/submit")
      .send({ career: "MLEngineer" }); // missing questionId and answer

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career in submit", async () => {
    const res = await request(app)
      .post("/api/questions/submit")
      .send({ career: "FakeCareer", questionId: "q1", answer: "test" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 if submitted question does not exist", async () => {
    mockGetQuestionById.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/questions/submit")
      .send({ career: "MLEngineer", questionId: "nonexistent", answer: "test" });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});


// ─── Progress API Tests ───────────────────────────────────────────────────────

describe("Progress API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockProgressDoc = {
    _id: "prog1",
    userId: "testUserId",
    career: "MLEngineer",
    chapters: [],
    easyScore: 0,
    mediumScore: 0,
    hardScore: 0,
    easyCompleted: false,
    mediumCompleted: false,
    hardCompleted: false,
  };

  // GET /api/progress

  it("should return existing progress for a valid career", async () => {
    mockProgressFindOne.mockResolvedValue(mockProgressDoc);

    const res = await request(app)
      .get("/api/progress")
      .query({ career: "MLEngineer" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.career).toBe("MLEngineer");
  });

  it("should create and return new progress if none exists", async () => {
    mockProgressFindOne.mockResolvedValue(null);
    mockProgressCreate.mockResolvedValue(mockProgressDoc);

    const res = await request(app)
      .get("/api/progress")
      .query({ career: "MLEngineer" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockProgressCreate).toHaveBeenCalledWith({
      userId: "testUserId",
      career: "MLEngineer",
      chapters: [],
    });
  });

  it("should return 400 if career is missing", async () => {
    const res = await request(app).get("/api/progress");

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career", async () => {
    const res = await request(app)
      .get("/api/progress")
      .query({ career: "FakeCareer" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // GET /api/progress/all

  it("should return all career progress for the authenticated user", async () => {
    const allProgress = [
      { ...mockProgressDoc, career: "MLEngineer" },
      { ...mockProgressDoc, career: "DataScientist" },
    ];
    mockProgressFind.mockResolvedValue(allProgress);

    const res = await request(app).get("/api/progress/all");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it("should return empty array if user has no progress records", async () => {
    mockProgressFind.mockResolvedValue([]);

    const res = await request(app).get("/api/progress/all");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  // POST /api/progress/update

  it("should update chapter progress successfully", async () => {
    const updatedProgress = {
      ...mockProgressDoc,
      chapters: [{ chapterId: "ch1", easyScore: 4, mediumScore: 3, hardScore: 2, passed: true }],
      easyScore: 4,
    };
    mockUpdateChapterProgress.mockResolvedValue(updatedProgress);

    const res = await request(app)
      .post("/api/progress/update")
      .send({
        career: "MLEngineer",
        chapterId: "ch1",
        easyScore: 4,
        mediumScore: 3,
        hardScore: 2,
        passed: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockUpdateChapterProgress).toHaveBeenCalledWith(
      "testUserId",
      "MLEngineer",
      "ch1",
      4,
      3,
      2,
      true
    );
  });

  it("should default missing scores to 0 and passed to false", async () => {
    mockUpdateChapterProgress.mockResolvedValue(mockProgressDoc);

    const res = await request(app)
      .post("/api/progress/update")
      .send({ career: "SoftwareEngineer", chapterId: "ch2" });

    expect(res.status).toBe(200);
    expect(mockUpdateChapterProgress).toHaveBeenCalledWith(
      "testUserId",
      "SoftwareEngineer",
      "ch2",
      0,
      0,
      0,
      false
    );
  });

  it("should return 400 if career or chapterId is missing from update", async () => {
    const res = await request(app)
      .post("/api/progress/update")
      .send({ career: "MLEngineer" }); // missing chapterId

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career in update", async () => {
    const res = await request(app)
      .post("/api/progress/update")
      .send({ career: "FakeCareer", chapterId: "ch1" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // POST /api/progress/reset

  it("should reset progress for a valid career", async () => {
    const resetDoc = { ...mockProgressDoc, chapters: [], easyScore: 0 };
    mockResetProgressService.mockResolvedValue(resetDoc);

    const res = await request(app)
      .post("/api/progress/reset")
      .send({ career: "MLEngineer" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/reset/i);
    expect(mockResetProgressService).toHaveBeenCalledWith("testUserId", "MLEngineer");
  });

  it("should return 400 if career is missing from reset", async () => {
    const res = await request(app).post("/api/progress/reset").send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 for invalid career in reset", async () => {
    const res = await request(app)
      .post("/api/progress/reset")
      .send({ career: "InvalidCareer" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
