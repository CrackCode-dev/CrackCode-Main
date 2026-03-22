import { jest } from '@jest/globals';

// ─── MOCK DEPENDENCIES BEFORE IMPORTS ─────────────────────────────────────────

// Mock aiConfig — mutate properties directly so the imported reference stays live
const mockAiConfig = {
  enabled: true,
  assistantEnabled: true,
  model: 'gemini-2.5-flash',
  assistantLimitPerMinute: 4,
};
jest.unstable_mockModule('../src/services/aiConfig.js', () => ({
  aiConfig: mockAiConfig,
}));

// Mock rate limiter
const mockCheckRateLimit = jest.fn();
jest.unstable_mockModule('../src/services/aiRateLimiter.js', () => ({
  checkRateLimit: mockCheckRateLimit,
}));

// Mock error cache (shared with assistant)
const mockGetFromCache = jest.fn();
const mockSaveToCache = jest.fn();
jest.unstable_mockModule('../src/services/errorCache.js', () => ({
  getFromCache: mockGetFromCache,
  saveToCache: mockSaveToCache,
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

const { askAssistant } = await import('../src/services/aiAssistantAgent.js');

// ─── TEST DATA ─────────────────────────────────────────────────────────────────

const baseInput = {
  userId: 'user-123',
  sessionId: 'session-abc',
  question: 'Why is my loop not working?',
  language: 'python',
  code: 'for i in range(10):\nprint(i)',
  problemTitle: 'Sum of Numbers',
  problemDescription: 'Return the sum of numbers 1 to n.',
  lastJudgeResult: { status: 'failed', expected: '55', actual: '0' },
};

const mockParsedReply = {
  mode: 'debug',
  reply: 'Your loop is missing indentation on line 2.',
  hintTitle: 'Indentation matters',
  hintText: 'Python uses indentation to define code blocks.',
  nextStep: 'Indent the print statement inside the loop.',
  severity: 'info',
};

// ─── askAssistant ──────────────────────────────────────────────────────────────

describe('askAssistant', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset config to enabled defaults before each test
    mockAiConfig.enabled = true;
    mockAiConfig.assistantEnabled = true;
    mockAiConfig.model = 'gemini-2.5-flash';
    mockAiConfig.assistantLimitPerMinute = 4;

    // Default: rate limit OK, cache miss, Gemini returns valid JSON
    mockCheckRateLimit.mockReturnValue({ allowed: true, used: 1, remaining: 3, resetAt: Date.now() + 60000 });
    mockGetFromCache.mockReturnValue(null);
    mockSaveToCache.mockReturnValue(undefined);
    mockGenerateContent.mockResolvedValue({ response: { text: () => JSON.stringify(mockParsedReply) } });
    mockGetGeminiModel.mockReturnValue({ generateContent: mockGenerateContent });
    mockSafeParseJSON.mockReturnValue(mockParsedReply);
  });

  // ── Feature flag checks ────────────────────────────────────────────────────

  test('returns disabled response when master AI switch is off', async () => {
    mockAiConfig.enabled = false;
    const result = await askAssistant(baseInput);
    expect(result.disabled).toBe(true);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('returns disabled response when assistantEnabled is false', async () => {
    mockAiConfig.assistantEnabled = false;
    const result = await askAssistant(baseInput);
    expect(result.disabled).toBe(true);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('disabled response includes explanatory message', async () => {
    mockAiConfig.enabled = false;
    const result = await askAssistant(baseInput);
    expect(result.message).toMatch(/disabled/i);
  });

  // ── Input validation ───────────────────────────────────────────────────────

  test('returns error when question is empty string', async () => {
    const result = await askAssistant({ ...baseInput, question: '' });
    expect(result.error).toBeDefined();
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('returns error when question is only whitespace', async () => {
    const result = await askAssistant({ ...baseInput, question: '   ' });
    expect(result.error).toBeDefined();
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('returns error when question is null', async () => {
    const result = await askAssistant({ ...baseInput, question: null });
    expect(result.error).toBeDefined();
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('validation error response has disabled: false', async () => {
    const result = await askAssistant({ ...baseInput, question: '' });
    expect(result.disabled).toBe(false);
  });

  // ── Rate limiting ──────────────────────────────────────────────────────────

  test('returns rateLimited response when limit is exceeded', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, used: 5, remaining: 0, resetAt: Date.now() + 30000 });
    const result = await askAssistant(baseInput);
    expect(result.rateLimited).toBe(true);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('rate limited response has disabled: false', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, used: 5, remaining: 0, resetAt: Date.now() + 30000 });
    const result = await askAssistant(baseInput);
    expect(result.disabled).toBe(false);
  });

  test('rate limited response includes remaining count', async () => {
    mockCheckRateLimit.mockReturnValue({ allowed: false, used: 5, remaining: 0, resetAt: Date.now() + 30000 });
    const result = await askAssistant(baseInput);
    expect(result.remaining).toBe(0);
  });

  test('rate limited response includes resetAt as seconds (not ms)', async () => {
    const resetAt = Date.now() + 30000;
    mockCheckRateLimit.mockReturnValue({ allowed: false, used: 5, remaining: 0, resetAt });
    const result = await askAssistant(baseInput);
    // resetAt in response should be seconds until reset, not a timestamp
    expect(result.resetAt).toBeGreaterThan(0);
    expect(result.resetAt).toBeLessThanOrEqual(30);
  });

  test('uses userId as rate limit key when provided', async () => {
    await askAssistant(baseInput);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ userKey: 'user-123' }));
  });

  test('falls back to sessionId when userId is absent', async () => {
    await askAssistant({ ...baseInput, userId: undefined });
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ userKey: 'session-abc' }));
  });

  test('falls back to "anonymous" when both userId and sessionId are absent', async () => {
    await askAssistant({ ...baseInput, userId: undefined, sessionId: undefined });
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ userKey: 'anonymous' }));
  });

  test('rate limit is checked with assistant feature name', async () => {
    await askAssistant(baseInput);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ feature: 'assistant' }));
  });

  test('rate limit uses assistantLimitPerMinute from config', async () => {
    mockAiConfig.assistantLimitPerMinute = 6;
    await askAssistant(baseInput);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(expect.objectContaining({ limitPerMinute: 6 }));
  });

  // ── Cache ──────────────────────────────────────────────────────────────────

  test('returns cached result without calling Gemini', async () => {
    mockGetFromCache.mockReturnValue(mockParsedReply);
    const result = await askAssistant(baseInput);
    expect(result).toMatchObject(mockParsedReply);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  test('cached result includes cached: true flag', async () => {
    mockGetFromCache.mockReturnValue(mockParsedReply);
    const result = await askAssistant(baseInput);
    expect(result.cached).toBe(true);
  });

  test('saves response to cache after successful Gemini call', async () => {
    await askAssistant(baseInput);
    expect(mockSaveToCache).toHaveBeenCalledWith(expect.any(String), mockParsedReply);
  });

  test('does not save to cache on a cache hit', async () => {
    mockGetFromCache.mockReturnValue(mockParsedReply);
    await askAssistant(baseInput);
    expect(mockSaveToCache).not.toHaveBeenCalled();
  });

  test('cache key includes lastJudgeResult status', async () => {
    // Two calls with different judge statuses should use different cache keys
    await askAssistant({ ...baseInput, lastJudgeResult: { status: 'passed' } });
    await askAssistant({ ...baseInput, lastJudgeResult: { status: 'failed' } });
    const [firstKey, secondKey] = mockGetFromCache.mock.calls.map(([k]) => k);
    expect(firstKey).not.toBe(secondKey);
  });

  test('cache key handles missing lastJudgeResult gracefully', async () => {
    await expect(askAssistant({ ...baseInput, lastJudgeResult: undefined })).resolves.not.toThrow();
    expect(mockGetFromCache).toHaveBeenCalled();
  });

  // ── Successful Gemini call ─────────────────────────────────────────────────

  test('returns parsed response on successful Gemini call', async () => {
    const result = await askAssistant(baseInput);
    expect(result).toEqual(mockParsedReply);
  });

  test('calls getGeminiModel with correct model name', async () => {
    await askAssistant(baseInput);
    expect(mockGetGeminiModel).toHaveBeenCalledWith(expect.objectContaining({ modelName: 'gemini-2.5-flash' }));
  });

  test('calls getGeminiModel with temperature 0.5', async () => {
    await askAssistant(baseInput);
    expect(mockGetGeminiModel).toHaveBeenCalledWith(expect.objectContaining({ temperature: 0.5 }));
  });

  test('passes question to Gemini prompt context', async () => {
    await askAssistant(baseInput);
    // generateContent should be called once with a prompt containing the question
    const [prompt] = mockGenerateContent.mock.calls[0];
    expect(prompt).toContain(baseInput.question);
  });

  test('passes language to Gemini prompt context', async () => {
    await askAssistant(baseInput);
    const [prompt] = mockGenerateContent.mock.calls[0];
    expect(prompt).toContain(baseInput.language);
  });

  test('passes problemTitle to Gemini prompt context', async () => {
    await askAssistant(baseInput);
    const [prompt] = mockGenerateContent.mock.calls[0];
    expect(prompt).toContain(baseInput.problemTitle);
  });

  // ── JSON parse failure ─────────────────────────────────────────────────────

  test('returns fallback response when Gemini JSON cannot be parsed', async () => {
    mockSafeParseJSON.mockReturnValue(null);
    const result = await askAssistant(baseInput);
    expect(result).toBeDefined();
    expect(result.mode).toBe('debug');
    expect(result.reply).toBeDefined();
  });

  test('does not save to cache when JSON parse fails', async () => {
    mockSafeParseJSON.mockReturnValue(null);
    await askAssistant(baseInput);
    expect(mockSaveToCache).not.toHaveBeenCalled();
  });

  // ── Gemini API failure ─────────────────────────────────────────────────────

  test('returns fallback response when Gemini throws an error', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network timeout'));
    const result = await askAssistant(baseInput);
    expect(result).toBeDefined();
    expect(result.mode).toBe('debug');
  });

  test('does not throw when Gemini fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API unavailable'));
    await expect(askAssistant(baseInput)).resolves.not.toThrow();
  });

  test('does not save to cache when Gemini call fails', async () => {
    mockGenerateContent.mockRejectedValue(new Error('API unavailable'));
    await askAssistant(baseInput);
    expect(mockSaveToCache).not.toHaveBeenCalled();
  });

  // ── Optional context fields ────────────────────────────────────────────────

  test('works without optional code field', async () => {
    const result = await askAssistant({ ...baseInput, code: undefined });
    expect(result).toEqual(mockParsedReply);
  });

  test('works without optional problemDescription field', async () => {
    const result = await askAssistant({ ...baseInput, problemDescription: undefined });
    expect(result).toEqual(mockParsedReply);
  });

  test('works without optional lastJudgeResult field', async () => {
    const result = await askAssistant({ ...baseInput, lastJudgeResult: undefined });
    expect(result).toEqual(mockParsedReply);
  });
});
