import { jest } from '@jest/globals';

// ─── MOCK DEPENDENCIES BEFORE IMPORTS ─────────────────────────────────────────

// Mock aiConfig — mutate properties directly so the imported reference stays live
const mockAiConfig = {
  enabled: true,
  errorDiagnosisEnabled: true,
  model: 'gemini-2.5-flash',
  errorDiagnosisLimitPerMinute: 8,
};
jest.unstable_mockModule('../src/services/aiConfig.js', () => ({
  aiConfig: mockAiConfig,
}));

// Mock rate limiter
const mockCheckRateLimit = jest.fn();
jest.unstable_mockModule('../src/services/aiRateLimiter.js', () => ({
  checkRateLimit: mockCheckRateLimit,
}));

// Mock error cache
const mockGenerateCacheKey = jest.fn();
const mockGetFromCache = jest.fn();
const mockSaveToCache = jest.fn();
jest.unstable_mockModule('../src/services/errorCache.js', () => ({
  generateCacheKey: mockGenerateCacheKey,
  getFromCache: mockGetFromCache,
  saveToCache: mockSaveToCache,
}));

// Mock prompt builder
const mockBuildSystemInstruction = jest.fn();
const mockBuildAnalysisPrompt = jest.fn();
jest.unstable_mockModule('../src/services/promptBuilder.js', () => ({
  buildSystemInstruction: mockBuildSystemInstruction,
  buildAnalysisPrompt: mockBuildAnalysisPrompt,
}));

// Mock Gemini model
const mockGenerateContent = jest.fn();
const mockGetGeminiModel = jest.fn();
jest.unstable_mockModule('../src/services/aiModel.js', () => ({
  getGeminiModel: mockGetGeminiModel,
}));

// Mock JSON parser
const mockSafeParseJSON = jest.fn();
jest.unstable_mockModule('../src/services/aiJson.js', () => ({
  safeParseJSON: mockSafeParseJSON,
}));

// ─── IMPORT AFTER MOCKS ────────────────────────────────────────────────────────

const { classifyErrorType, analyseError } = await import('../src/services/aiErrorAgent.js');

// ─── TEST DATA ─────────────────────────────────────────────────────────────────

const baseInput = {
  userId: 'user-123',
  sessionId: 'session-abc',
  code: 'def add(a, b):\n  return a + b',
  language: 'python',
  testResult: {
    status: 'failed',
    error: 'TypeError: unsupported operand type(s)',
    expected: '5',
    actual: 'None',
  },
  previousErrors: [],
};

const mockAnalysis = {
  errorType: 'Type Error',
  simplifiedMessage: 'Officer, there is a type mismatch.',
  whatWentWrong: 'Python cannot add these types.',
  affectedLines: [2],
  actionableSteps: ['Step 1: Check types', 'Step 2: Fix it', 'Step 3: Re-run'],
  conceptTitle: 'Type Errors',
  conceptLesson: 'Types must match.',
  severity: 'error',
};

// ─── classifyErrorType ─────────────────────────────────────────────────────────

describe('classifyErrorType', () => {
  const cases = [
    ['SyntaxError: invalid syntax',    'Syntax Error'],
    ['NameError: name x is not defined','Name Error'],
    ['TypeError: unsupported operand',  'Type Error'],
    ['IndexError: list index out of range', 'Index Error'],
    ['ZeroDivisionError: division by zero', 'Zero Division Error'],
    ['IndentationError: unexpected indent','Indentation Error'],
    ['ValueError: invalid literal',     'Value Error'],
    ['AttributeError: has no attribute','Attribute Error'],
    ['ImportError: No module named',    'Import Error'],
  ];

  test.each(cases)('classifies "%s" as "%s"', (errorMsg, expected) => {
    expect(classifyErrorType({ error: errorMsg })).toBe(expected);
  });

  test('classifies Compilation Error from message field', () => {
    expect(classifyErrorType({ error: '', message: 'Compilation failed' })).toBe('Compilation Error');
  });

  test('classifies failed test with no error as Wrong Answer', () => {
    expect(classifyErrorType({ status: 'failed', error: '' })).toBe('Wrong Answer');
  });

  test('defaults to Runtime Error for unrecognised error', () => {
    expect(classifyErrorType({ error: 'some unknown error' })).toBe('Runtime Error');
  });

  test('handles missing error field gracefully', () => {
    // No error, no matching status — falls through to Runtime Error
    expect(classifyErrorType({})).toBe('Runtime Error');
  });
});

// ─── analyseError ──────────────────────────────────────────────────────────────

describe('analyseError', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset config to enabled defaults before each test
    mockAiConfig.enabled = true;
    mockAiConfig.errorDiagnosisEnabled = true;
    mockAiConfig.model = 'gemini-2.5-flash';
    mockAiConfig.errorDiagnosisLimitPerMinute = 8;

    mockCheckRateLimit.mockReturnValue({ allowed: true, used: 1, remaining: 7, resetAt: Date.now() + 60000 });
    mockGenerateCacheKey.mockReturnValue('cache-key-123');
    mockGetFromCache.mockReturnValue(null);
    mockSaveToCache.mockReturnValue(undefined);
    mockBuildSystemInstruction.mockReturnValue('system instruction');
    mockBuildAnalysisPrompt.mockReturnValue('analysis prompt');
    mockGenerateContent.mockResolvedValue({ response: { text: () => JSON.stringify(mockAnalysis) } });
    mockGetGeminiModel.mockReturnValue({ generateContent: mockGenerateContent });
    mockSafeParseJSON.mockReturnValue(mockAnalysis);
  });

  // ── Feature flag checks ────────────────────────────────────────────────────

  test('returns null when master AI switch is disabled', async () => {
    mockAiConfig.enabled = false;
    const result = await analyseError(baseInput);
    expect(result).toBeNull();
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('returns null when errorDiagnosisEnabled is false', async () => {
    mockAiConfig.errorDiagnosisEnabled = false;
    const result = await analyseError(baseInput);
    expect(result).toBeNull();
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  // ── Non-failed test ────────────────────────────────────────────────────────

  test('returns null for passing test result', async () => {
    const input = { ...baseInput, testResult: { status: 'passed' } };
    const result = await analyseError(input);
    expect(result).toBeNull();
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('returns null for test with status other than failed', async () => {
    const input = { ...baseInput, testResult: { status: 'error' } };
    const result = await analyseError(input);
    expect(result).toBeNull();
  });

  // ── Rate limiting ──────────────────────────────────────────────────────────

  test('returns rate limit object when limit is exceeded', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, used: 9, remaining: 0, resetAt: Date.now() + 30000 });
    const result = await analyseError(baseInput);
    expect(result).not.toBeNull();
    expect(result.rateLimited).toBe(true);
    expect(result.errorType).toBe('Rate Limit');
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('rate limit response includes remaining and resetAt', async () => {
    const resetAt = Date.now() + 30000;
    mockCheckRateLimit.mockReturnValue({ allowed: false, used: 9, remaining: 0, resetAt });
    const result = await analyseError(baseInput);
    expect(result.remaining).toBe(0);
    expect(result.resetAt).toBe(resetAt);
  });

  test('uses userId as rate limit key when provided', async () => {
    await analyseError(baseInput);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ userKey: 'user-123' }));
  });

  test('falls back to sessionId when userId is absent', async () => {
    const input = { ...baseInput, userId: undefined };
    await analyseError(input);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ userKey: 'session-abc' }));
  });

  test('falls back to "anonymous" when both userId and sessionId are absent', async () => {
    const input = { ...baseInput, userId: undefined, sessionId: undefined };
    await analyseError(input);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ userKey: 'anonymous' }));
  });

  // ── Cache ──────────────────────────────────────────────────────────────────

  test('returns cached result without calling Gemini', async () => {
    mockGetFromCache.mockReturnValue(mockAnalysis);
    const result = await analyseError(baseInput);
    expect(result).toEqual(mockAnalysis);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('saves result to cache after successful Gemini call', async () => {
    const result = await analyseError(baseInput);
    expect(result).toEqual(mockAnalysis);
    expect(mockSaveToCache).toHaveBeenCalledWith('cache-key-123', mockAnalysis);
  });

  test('generateCacheKey is called with language, errorType, and errorText', async () => {
    await analyseError(baseInput);
    expect(mockGenerateCacheKey).toHaveBeenCalledWith(
      'python',
      expect.any(String),
      expect.any(String)
    );
  });

  // ── Successful Gemini call ─────────────────────────────────────────────────

  test('returns parsed analysis on successful Gemini response', async () => {
    const result = await analyseError(baseInput);
    expect(result).toEqual(mockAnalysis);
  });

  test('calls getGeminiModel with correct model name', async () => {
    await analyseError(baseInput);
    expect(mockGetGeminiModel).toHaveBeenCalledWith(expect.objectContaining({ modelName: 'gemini-2.5-flash' }));
  });

  test('calls buildAnalysisPrompt with code, language, and errorType', async () => {
    await analyseError(baseInput);
    expect(mockBuildAnalysisPrompt).toHaveBeenCalledWith(expect.objectContaining({
      code: baseInput.code,
      language: baseInput.language,
    }));
  });

  test('passes previousErrors to buildAnalysisPrompt', async () => {
    const input = { ...baseInput, previousErrors: ['attempt 1', 'attempt 2'] };
    await analyseError(input);
    expect(mockBuildAnalysisPrompt).toHaveBeenCalledWith(expect.objectContaining({
      previousErrors: ['attempt 1', 'attempt 2'],
    }));
  });

  // ── Error text fallback ────────────────────────────────────────────────────

  test('builds errorText from expected/actual when error field is missing', async () => {
    const input = {
      ...baseInput,
      testResult: { status: 'failed', error: '', expected: '10', actual: '5' },
    };
    await analyseError(input);
    expect(mockBuildAnalysisPrompt).toHaveBeenCalledWith(expect.objectContaining({
      expected: '10',
      actual: '5',
    }));
  });

  // ── JSON parse failure ─────────────────────────────────────────────────────

  test('returns null when Gemini response cannot be parsed as JSON', async () => {
    mockSafeParseJSON.mockReturnValue(null);
    const result = await analyseError(baseInput);
    expect(result).toBeNull();
    expect(mockSaveToCache).not.toHaveBeenCalled();
  });

  // ── Gemini API failure ─────────────────────────────────────────────────────

  test('returns null and does not throw when Gemini throws an error', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network error'));
    const result = await analyseError(baseInput);
    expect(result).toBeNull();
  });

  test('does not save to cache when Gemini call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API down'));
    await analyseError(baseInput);
    expect(mockSaveToCache).not.toHaveBeenCalled();
  });
});
