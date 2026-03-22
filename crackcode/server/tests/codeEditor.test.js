import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";


// ─── SETUP MOCKS FIRST (Before any dynamic imports) ───────────────────────────

// Mock codeEditor service
const mockRunTestCases = jest.fn();
const mockExecuteCode = jest.fn();
const mockGetLanguageId = jest.fn();
jest.unstable_mockModule("../src/modules/codeEditor/codeEditor.service.js", () => ({
  runTestCases: mockRunTestCases,
  executeCode: mockExecuteCode,
  getLanguageId: mockGetLanguageId,
}));

// Mock submit service
const mockSubmitSolutionService = jest.fn();
jest.unstable_mockModule("../src/modules/codeEditor/codeEditor.submit.service.js", () => ({
  submitSolutionService: mockSubmitSolutionService,
}));

// Mock AI error agent
const mockAnalyseError = jest.fn();
const mockClassifyErrorType = jest.fn();
jest.unstable_mockModule("../src/services/aiErrorAgent.js", () => ({
  analyseError: mockAnalyseError,
  classifyErrorType: mockClassifyErrorType,
}));

// Mock error cache
const mockClearCache = jest.fn();
const mockGetCacheStats = jest.fn();
jest.unstable_mockModule("../src/services/errorCache.js", () => ({
  clearCache: mockClearCache,
  getCacheStats: mockGetCacheStats,
}));

// Mock reward service
const mockAwardReward = jest.fn();
jest.unstable_mockModule("../src/modules/rewards/reward.service.js", () => ({
  awardReward: mockAwardReward,
}));

// Mock progress service
const mockMarkQuestionSolved = jest.fn();
const mockIncrementAttempt = jest.fn();
jest.unstable_mockModule("../src/modules/progress/progress.service.js", () => ({
  markQuestionSolved: mockMarkQuestionSolved,
  incrementAttempt: mockIncrementAttempt,
}));

// Mock Question model
const mockQuestionFindOne = jest.fn();
jest.unstable_mockModule("../src/modules/learn/Question.model.js", () => ({
  default: { findOne: mockQuestionFindOne },
}));

// Mock LearnUserProgress model
const mockLearnProgressFindOneAndUpdate = jest.fn();
jest.unstable_mockModule("../src/modules/learn/UserProgress.model.js", () => ({
  default: { findOneAndUpdate: mockLearnProgressFindOneAndUpdate },
}));

// Mock session middleware — injects user into req for protected routes
jest.unstable_mockModule("../src/modules/session/session.middleware.js", () => ({
  sessionAuth: (req, res, next) => {
    req.user = { _id: "testUserId" };
    req.userId = "testUserId";
    req.sessionId = "testSessionId";
    next();
  },
}));


// ─── Import routes AFTER mocks are registered ─────────────────────────────────

const { default: codeEditorRoutes } = await import("../src/modules/codeEditor/routes.js");

const app = express();
app.use(express.json());
app.use("/api/codeEditor", codeEditorRoutes);


// ─── GET /languages Tests ──────────────────────────────────────────────────────

describe("GET /api/codeEditor/languages", () => {
  it("should return 200 with all supported languages", async () => {
    const res = await request(app).get("/api/codeEditor/languages");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("python");
    expect(res.body.data).toHaveProperty("javascript");
    expect(res.body.data).toHaveProperty("cpp");
    expect(res.body.data).toHaveProperty("java");
    expect(res.body.data).toHaveProperty("c");
    expect(res.body.data.python).toEqual({ id: 71, name: "Python 3" });
    expect(res.body.data.javascript).toEqual({ id: 63, name: "JavaScript (Node.js)" });
  });
});


// ─── POST /run Tests ───────────────────────────────────────────────────────────

describe("POST /api/codeEditor/run", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with execution output on success", async () => {
    mockExecuteCode.mockResolvedValue({ success: true, output: "Hello World\n", time: "0.1", memory: 1024 });

    const res = await request(app).post("/api/codeEditor/run").send({
      sourceCode: 'print("Hello World")',
      language: "python",
      input: "",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.output).toBe("Hello World\n");
    expect(mockExecuteCode).toHaveBeenCalledWith('print("Hello World")', "python", "");
  });

  it("should default input to empty string if not provided", async () => {
    mockExecuteCode.mockResolvedValue({ success: true, output: "42\n" });

    await request(app).post("/api/codeEditor/run").send({
      sourceCode: "print(42)",
      language: "python",
    });

    expect(mockExecuteCode).toHaveBeenCalledWith("print(42)", "python", "");
  });

  it("should return 400 if sourceCode is missing", async () => {
    const res = await request(app).post("/api/codeEditor/run").send({
      language: "python",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/source code is required/i);
  });

  it("should return 400 if language is missing", async () => {
    const res = await request(app).post("/api/codeEditor/run").send({
      sourceCode: "print(1)",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/language is required/i);
  });

  it("should return 500 if executeCode throws an error", async () => {
    mockExecuteCode.mockRejectedValue(new Error("Judge0 unavailable"));

    const res = await request(app).post("/api/codeEditor/run").send({
      sourceCode: "print(1)",
      language: "python",
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Judge0 unavailable/i);
  });
});


// ─── POST /execute Tests ───────────────────────────────────────────────────────

describe("POST /api/codeEditor/execute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    sourceCode: "def solve(a, b): return a + b",
    language: "python",
    testCases: [
      { input: { a: 1, b: 2 }, expectedOutput: "3" },
    ],
    problemId: "py_fundamentals_001",
    difficulty: "Easy",
    sourceArea: "learn_page",
  };

  it("should return 200 with test results when all tests pass", async () => {
    const passedResults = [{ status: "passed", output: "3", time: "0.1", memory: 1024 }];
    mockRunTestCases.mockResolvedValue(passedResults);
    mockQuestionFindOne.mockResolvedValue({ _id: "questionMongoId" });
    mockIncrementAttempt.mockResolvedValue({});
    mockMarkQuestionSolved.mockResolvedValue({});
    mockAwardReward.mockResolvedValue({
      xpAwarded: 10,
      tokensAwarded: 6,
      alreadyRewarded: false,
      isFirstSolve: true,
      badgesUnlocked: ["beginner"],
      updatedUserStats: { totalXP: 10 },
    });
    mockLearnProgressFindOneAndUpdate.mockResolvedValue({});

    const res = await request(app).post("/api/codeEditor/execute").send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.allPassed).toBe(true);
    expect(res.body.data.summary.passed).toBe(1);
    expect(res.body.data.summary.failed).toBe(0);
    expect(res.body.data.reward.xpAwarded).toBe(10);
    expect(res.body.data.reward.badgesUnlocked).toContain("beginner");
  });

  it("should return 200 and include AI analysis when a test fails", async () => {
    const failedResults = [
      {
        status: "failed",
        output: "4",
        expectedOutput: "3",
        stderr: "",
      },
    ];
    mockRunTestCases.mockResolvedValue(failedResults);
    mockClassifyErrorType.mockReturnValue("WrongAnswer");
    mockAnalyseError.mockResolvedValue({ hint: "Check your addition logic." });
    mockQuestionFindOne.mockResolvedValue({ _id: "questionMongoId" });
    mockIncrementAttempt.mockResolvedValue({});

    const res = await request(app).post("/api/codeEditor/execute").send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.allPassed).toBe(false);
    expect(res.body.data.summary.failed).toBe(1);
    expect(res.body.data.results[0].errorType).toBe("WrongAnswer");
    expect(res.body.data.results[0].aiAnalysis.hint).toMatch(/Check your addition/i);
    expect(mockMarkQuestionSolved).not.toHaveBeenCalled();
    expect(mockAwardReward).not.toHaveBeenCalled();
  });

  it("should return 400 if sourceCode is missing", async () => {
    const { sourceCode: _, ...payload } = validPayload;

    const res = await request(app).post("/api/codeEditor/execute").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/source code is required/i);
  });

  it("should return 400 if language is missing", async () => {
    const { language: _, ...payload } = validPayload;

    const res = await request(app).post("/api/codeEditor/execute").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/language is required/i);
  });

  it("should return 400 if testCases is missing or empty", async () => {
    const res = await request(app).post("/api/codeEditor/execute").send({
      ...validPayload,
      testCases: [],
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/test cases/i);
  });

  it("should return 400 if testCases is not an array", async () => {
    const res = await request(app).post("/api/codeEditor/execute").send({
      ...validPayload,
      testCases: "not-an-array",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should skip reward system if problemId is not provided", async () => {
    const passedResults = [{ status: "passed", output: "3" }];
    mockRunTestCases.mockResolvedValue(passedResults);

    const { problemId: _, ...payload } = validPayload;
    const res = await request(app).post("/api/codeEditor/execute").send(payload);

    expect(res.status).toBe(200);
    expect(mockIncrementAttempt).not.toHaveBeenCalled();
    expect(mockAwardReward).not.toHaveBeenCalled();
    expect(res.body.data.reward).toBeUndefined();
  });

  it("should fall back to original problemId if Question.findOne returns null", async () => {
    const passedResults = [{ status: "passed", output: "3" }];
    mockRunTestCases.mockResolvedValue(passedResults);
    mockQuestionFindOne.mockResolvedValue(null);
    mockIncrementAttempt.mockResolvedValue({});
    mockMarkQuestionSolved.mockResolvedValue({});
    mockAwardReward.mockResolvedValue({
      xpAwarded: 10,
      tokensAwarded: 6,
      alreadyRewarded: false,
      isFirstSolve: true,
      badgesUnlocked: [],
    });
    mockLearnProgressFindOneAndUpdate.mockResolvedValue({});

    const res = await request(app).post("/api/codeEditor/execute").send(validPayload);

    expect(res.status).toBe(200);
    expect(mockIncrementAttempt).toHaveBeenCalledWith(
      "testUserId",
      "py_fundamentals_001",
      "coding"
    );
  });

  it("should not fail if reward system throws an internal error", async () => {
    const passedResults = [{ status: "passed", output: "3" }];
    mockRunTestCases.mockResolvedValue(passedResults);
    mockQuestionFindOne.mockResolvedValue({ _id: "questionMongoId" });
    mockIncrementAttempt.mockRejectedValue(new Error("DB error"));

    const res = await request(app).post("/api/codeEditor/execute").send(validPayload);

    // Should still return 200 — reward errors should not break test execution
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 500 if runTestCases throws an error", async () => {
    mockRunTestCases.mockRejectedValue(new Error("Judge0 connection failed"));

    const res = await request(app).post("/api/codeEditor/execute").send(validPayload);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Judge0 connection failed/i);
  });
});


// ─── POST /submit Tests ────────────────────────────────────────────────────────

describe("POST /api/codeEditor/submit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const validPayload = {
    questionId: "py_fundamentals_001",
    code: "def solve(a, b): return a + b",
    languageId: 71,
  };

  it("should return 200 with result data on successful submission", async () => {
    mockSubmitSolutionService.mockResolvedValue({
      passed: true,
      testsPassed: 3,
      testsTotal: 3,
      isFirstCompletion: true,
      xpAwarded: 10,
      tokensAwarded: 6,
      badgesUnlocked: ["beginner"],
    });

    const res = await request(app).post("/api/codeEditor/submit").send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.passed).toBe(true);
    expect(res.body.data.isFirstCompletion).toBe(true);
    expect(mockSubmitSolutionService).toHaveBeenCalledWith({
      userId: "testUserId",
      questionId: "py_fundamentals_001",
      code: "def solve(a, b): return a + b",
      languageId: 71,
    });
  });

  it("should return 400 if questionId is missing", async () => {
    const { questionId: _, ...payload } = validPayload;

    const res = await request(app).post("/api/codeEditor/submit").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/questionId is required/i);
  });

  it("should return 400 if code is missing", async () => {
    const { code: _, ...payload } = validPayload;

    const res = await request(app).post("/api/codeEditor/submit").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/code is required/i);
  });

  it("should return 400 if languageId is missing", async () => {
    const { languageId: _, ...payload } = validPayload;

    const res = await request(app).post("/api/codeEditor/submit").send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/languageId is required/i);
  });

  it("should return 500 if submitSolutionService throws an error", async () => {
    mockSubmitSolutionService.mockRejectedValue(new Error("Question not found"));

    const res = await request(app).post("/api/codeEditor/submit").send(validPayload);

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/Question not found/i);
  });

  it("should return 200 with failed result when tests do not all pass", async () => {
    mockSubmitSolutionService.mockResolvedValue({
      passed: false,
      testsPassed: 1,
      testsTotal: 3,
      isFirstCompletion: false,
    });

    const res = await request(app).post("/api/codeEditor/submit").send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.passed).toBe(false);
    expect(res.body.data.isFirstCompletion).toBe(false);
  });
});


// ─── POST /clear-ai-cache Tests ────────────────────────────────────────────────

describe("POST /api/codeEditor/clear-ai-cache", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 with cache stats before and after clearing", async () => {
    mockGetCacheStats
      .mockReturnValueOnce({ size: 5, hits: 10 })
      .mockReturnValueOnce({ size: 0, hits: 0 });
    mockClearCache.mockImplementation(() => {});

    const res = await request(app).post("/api/codeEditor/clear-ai-cache");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/cache cleared/i);
    expect(res.body.before).toEqual({ size: 5, hits: 10 });
    expect(res.body.after).toEqual({ size: 0, hits: 0 });
    expect(mockClearCache).toHaveBeenCalledTimes(1);
  });
});
