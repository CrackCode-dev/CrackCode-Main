import axios from "axios";

// JUDGE0 CONFIGURATION

const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
  c: 50
};

// Judge0 status IDs for proper error classification
const JUDGE0_STATUS = {
  IN_QUEUE: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_SIGSEGV: 7,
  RUNTIME_SIGXFSZ: 8,
  RUNTIME_SIGFPE: 9,
  RUNTIME_SIGABRT: 10,
  RUNTIME_NZEC: 11,
  RUNTIME_OTHER: 12,
  INTERNAL_ERROR: 13,
  EXEC_FORMAT_ERROR: 14
};

export const getLanguageId = (language) => {
  return LANGUAGE_IDS[language] || LANGUAGE_IDS.python;
};

const JUDGE0_URL =
  process.env.JUDGE0_API_URL ||
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

const JUDGE0_HEADERS = {
  "content-type": "application/json",
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
  "X-RapidAPI-Host": process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com"
};

// JUDGE0 API REQUEST

export const submitCodeToJudge0 = async (sourceCode, languageId, stdin = "") => {
  try {
    const response = await axios.post(
      JUDGE0_URL,
      {
        language_id: languageId,
        source_code: sourceCode,
        stdin
      },
      {
        headers: JUDGE0_HEADERS,
        timeout: 30000
      }
    );

    return response.data;
  } catch (error) {
    const details =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      "Unknown Judge0 error";

    console.error("❌ Judge0 API Error:", details);
    throw new Error(`Failed to execute code: ${details}`);
  }
};

// HELPER UTILITIES

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};


const normalizeExpectedOutput = (testCase) => {
  const raw = testCase.expectedOutput ?? testCase.expected_output;
  if (raw === undefined || raw === null) return "";

  // Boolean → canonical lowercase string
  if (typeof raw === "boolean") return raw ? "true" : "false";

  return String(raw).trim();
};

const normalizeActualOutput = (stdout) => {
  if (!stdout) return "";
  const trimmed = String(stdout).trim();

  // Normalize Python-style booleans → lowercase
  if (trimmed === "True") return "true";
  if (trimmed === "False") return "false";

  return trimmed;
};

const compareOutputs = (expected, actual) => {
  // Direct match (fast path)
  if (expected === actual) return true;

  // Boolean normalization 
  const TRUTHY = new Set(["true", "True", "1"]);
  const FALSY  = new Set(["false", "False", "0"]);

  const expectedIsBoolTrue  = TRUTHY.has(expected);
  const expectedIsBoolFalse = FALSY.has(expected);

  if (expectedIsBoolTrue || expectedIsBoolFalse) {
    if (expectedIsBoolTrue && TRUTHY.has(actual)) return true;
    if (expectedIsBoolFalse && FALSY.has(actual)) return true;
  }

  // Numeric normalization 
  const expectedNum = Number(expected);
  const actualNum = Number(actual);
  if (
    expected !== "" && actual !== "" &&
    !isNaN(expectedNum) && !isNaN(actualNum) &&
    expectedNum === actualNum
  ) {
    return true;
  }

  // JSON structural comparison 
  try {
    const expectedParsed = JSON.parse(expected);
    const actualParsed = JSON.parse(actual);
    if (JSON.stringify(expectedParsed) === JSON.stringify(actualParsed)) {
      return true;
    }
  } catch {
    // Not valid JSON - fall through
  }

  return false;
};

const serializeInputForRunMode = (input) => {
  if (input === undefined || input === null) return "";
  return typeof input === "string" ? input : JSON.stringify(input);
};

// Build ordered arguments array from input based on paramOrder
const buildOrderedArgs = (input, paramOrder = []) => {
  if (Array.isArray(input)) {
    return input;
  }

  if (isPlainObject(input)) {
    if (Array.isArray(paramOrder) && paramOrder.length > 0) {
      return paramOrder.map((paramName) => input[paramName]);
    }
    return Object.values(input);
  }

  if (input === undefined || input === null) {
    return [];
  }

  return [input];
};

// LITERAL CONVERTERS FOR EACH LANGUAGE

const toPythonLiteral = (value) => {
  if (value === null || value === undefined) return "None";
  if (typeof value === "string") return JSON.stringify(value);

  // Python booleans are capitalized: True / False
  // MUST come before number check
  if (typeof value === "boolean") return value ? "True" : "False";

  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    return `[${value.map(toPythonLiteral).join(", ")}]`;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, val]) => {
      return `${JSON.stringify(key)}: ${toPythonLiteral(val)}`;
    });
    return `{${entries.join(", ")}}`;
  }

  return "None";
};

const toJsLiteral = (value) => {
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    return `[${value.map(toJsLiteral).join(", ")}]`;
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value).map(([key, val]) => {
      return `${JSON.stringify(key)}: ${toJsLiteral(val)}`;
    });
    return `{ ${entries.join(", ")} }`;
  }

  return "null";
};

const inferArrayTypeForJava = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return "int";

  if (arr.every((x) => Number.isInteger(x))) return "int";
  if (arr.every((x) => typeof x === "number")) return "double";
  if (arr.every((x) => typeof x === "boolean")) return "boolean";
  if (arr.every((x) => typeof x === "string")) return "String";

  return null;
};

const toJavaLiteral = (value) => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : `${value}d`;
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "string") {
    return `"${value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")}"`;
  }

  if (Array.isArray(value)) {
    const arrayType = inferArrayTypeForJava(value);

    if (arrayType === "int") {
      return `new int[]{${value.join(", ")}}`;
    }

    if (arrayType === "double") {
      return `new double[]{${value.map((v) => `${v}d`).join(", ")}}`;
    }

    if (arrayType === "boolean") {
      return `new boolean[]{${value
        .map((v) => (v ? "true" : "false"))
        .join(", ")}}`;
    }

    if (arrayType === "String") {
      return `new String[]{${value
        .map((v) => `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)
        .join(", ")}}`;
    }
  }

  throw new Error("Unsupported Java input type in wrapper.");
};

const inferArrayTypeForCpp = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return "int";

  if (arr.every((x) => Number.isInteger(x))) return "int";
  if (arr.every((x) => typeof x === "number")) return "double";
  if (arr.every((x) => typeof x === "boolean")) return "bool";
  if (arr.every((x) => typeof x === "string")) return "string";

  return null;
};

const toCppLiteral = (value) => {
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";

  if (typeof value === "string") {
    return `"${value
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")}"`;
  }

  if (Array.isArray(value)) {
    const arrayType = inferArrayTypeForCpp(value);

    if (arrayType === "int") {
      return `vector<int>{${value.join(", ")}}`;
    }

    if (arrayType === "double") {
      return `vector<double>{${value.join(", ")}}`;
    }

    if (arrayType === "bool") {
      return `vector<bool>{${value
        .map((v) => (v ? "true" : "false"))
        .join(", ")}}`;
    }

    if (arrayType === "string") {
      return `vector<string>{${value
        .map((v) => `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`)
        .join(", ")}}`;
    }
  }

  throw new Error("Unsupported C++ input type in wrapper.");
};


// CODE PATTERN DETECTORS

// Starter templates produce:
//   Python:     def solve(...)
//   JavaScript: function solve(...)
//   Java:       public class Main { public static ... solve(...) }
//   C++:        <return_type> solve(...) { ... }   (standalone)

// Legacy/alternate patterns also supported:
//   Java:       class Solution { ... solve(...) }
//   C++:        class Solution { ... solve(...) }

const hasPythonSolve = (sourceCode) =>
  /\bdef\s+solve\s*\(/.test(sourceCode);

const hasJavaScriptSolve = (sourceCode) =>
  /\bfunction\s+solve\s*\(/.test(sourceCode) ||
  /\bconst\s+solve\s*=\s*\(/.test(sourceCode) ||
  /\blet\s+solve\s*=\s*\(/.test(sourceCode) ||
  /\bvar\s+solve\s*=\s*\(/.test(sourceCode);

// Java: detect solve() inside class Main OR class Solution
const hasJavaSolve = (sourceCode) =>
  /\bsolve\s*\(/.test(sourceCode) &&
  (/\bclass\s+Main\b/.test(sourceCode) || /\bclass\s+Solution\b/.test(sourceCode));

// C++: detect solve() as standalone function OR inside class Solution
const hasCppSolve = (sourceCode) =>
  /\bsolve\s*\(/.test(sourceCode);

// Sub-detectors for wrapper strategy selection
const hasJavaClassSolution = (sourceCode) =>
  /\bclass\s+Solution\b/.test(sourceCode) && /\bsolve\s*\(/.test(sourceCode);

const hasJavaClassMain = (sourceCode) =>
  /\bclass\s+Main\b/.test(sourceCode) && /\bsolve\s*\(/.test(sourceCode);

const hasJavaMainMethod = (sourceCode) =>
  /public\s+static\s+void\s+main\s*\(/.test(sourceCode);

const hasCppClassSolution = (sourceCode) =>
  /\bclass\s+Solution\b/.test(sourceCode) && /\bsolve\s*\(/.test(sourceCode);

const hasCppMainFunction = (sourceCode) =>
  /\bint\s+main\s*\(/.test(sourceCode);

// CHALLENGE MODE WRAPPER BUILDER

const buildChallengeWrapper = ({ sourceCode, language, input, paramOrder = [] }) => {
  const args = buildOrderedArgs(input, paramOrder);

  // PYTHON 
  if (language === "python") {
    if (!hasPythonSolve(sourceCode)) {
      console.warn("⚠️  [Wrapper] Python: no 'def solve(' found — returning raw code (no wrapper)");
      return sourceCode;
    }

    const argsString = args.map(toPythonLiteral).join(", ");

    return `${sourceCode}

if __name__ == "__main__":
    _result_ = solve(${argsString})
    if isinstance(_result_, bool):
        print(str(_result_).lower())
    else:
        print(_result_)
`;
  }

  // JAVASCRIPT
  if (language === "javascript") {
    if (!hasJavaScriptSolve(sourceCode)) {
      console.warn("⚠️  [Wrapper] JS: no 'function solve(' found — returning raw code (no wrapper)");
      return sourceCode;
    }

    const argsString = args.map(toJsLiteral).join(", ");

    return `"use strict";

${sourceCode}

const _result_ = solve(${argsString});
console.log(_result_);
`;
  }

  // JAVA 
  if (language === "java") {
    if (!hasJavaSolve(sourceCode)) {
      console.warn("⚠️  [Wrapper] Java: no 'solve(' in class Main/Solution — returning raw code (no wrapper)");
      return sourceCode;
    }

    const argsString = args.map(toJavaLiteral).join(", ");

    // Case 1: class Solution { solve() } - wrap with separate class Main
    if (hasJavaClassSolution(sourceCode)) {
      return `import java.util.*;
import java.io.*;

${sourceCode}

public class Main {
    public static void main(String[] args) throws Exception {
        Object result = Solution.solve(${argsString});
        System.out.println(String.valueOf(result));
    }
}
`;
    }

    // Case 2: class Main { solve() } but NO main method yet
    if (hasJavaClassMain(sourceCode) && !hasJavaMainMethod(sourceCode)) {
      const lastBraceIdx = sourceCode.lastIndexOf("}");
      if (lastBraceIdx === -1) return sourceCode;

      const before = sourceCode.slice(0, lastBraceIdx);
      const after = sourceCode.slice(lastBraceIdx);

      return `${before}
    public static void main(String[] args) throws Exception {
        Object result = solve(${argsString});
        System.out.println(String.valueOf(result));
    }
${after}
`;
    }

    // Case 3: class Main already has a main method - return as-is
    return sourceCode;
  }

  // C++ 
  if (language === "cpp") {
    if (!hasCppSolve(sourceCode)) {
      console.warn("⚠️  [Wrapper] C++: no 'solve(' found — returning raw code (no wrapper)");
      return sourceCode;
    }

    const argsString = args.map(toCppLiteral).join(", ");

    // Case 1: class Solution { solve() }
    if (hasCppClassSolution(sourceCode)) {
      return `#include <bits/stdc++.h>
using namespace std;

${sourceCode}

int main() {
    auto result = Solution::solve(${argsString});
    cout << boolalpha << result << "\\n";
    return 0;
}
`;
    }

    // Case 2: standalone solve() function, no main() yet
    if (!hasCppMainFunction(sourceCode)) {
      return `${sourceCode}

int main() {
    auto result = solve(${argsString});
    cout << boolalpha << result << "\\n";
    return 0;
}
`;
    }

    // Case 3: already has main()
    return sourceCode;
  }

  return sourceCode;
};

// Main submission builder
const buildSubmissionSource = ({
  sourceCode,
  language,
  mode = "challenge",
  input,
  paramOrder = []
}) => {
  if (mode === "run") {
    return sourceCode;
  }

  return buildChallengeWrapper({
    sourceCode,
    language,
    input,
    paramOrder
  });
};

// JUDGE0 RESPONSE CLASSIFIER

const classifyJudge0Result = (result) => {
  const statusId = result.status?.id ?? result.status_id ?? null;

  // Status-based classification (most reliable)
  if (statusId === JUDGE0_STATUS.ACCEPTED || statusId === JUDGE0_STATUS.WRONG_ANSWER) {
    return { type: "accepted", errorMessage: null };
  }

  if (statusId === JUDGE0_STATUS.COMPILATION_ERROR) {
    return {
      type: "compilation_error",
      errorMessage: result.compile_output || result.stderr || "Compilation failed"
    };
  }

  if (statusId === JUDGE0_STATUS.TIME_LIMIT) {
    return {
      type: "time_limit",
      errorMessage: "Time Limit Exceeded"
    };
  }

  if (statusId >= JUDGE0_STATUS.RUNTIME_SIGSEGV && statusId <= JUDGE0_STATUS.RUNTIME_OTHER) {
    return {
      type: "runtime_error",
      errorMessage: result.stderr || result.compile_output || "Runtime error"
    };
  }

  if (statusId === JUDGE0_STATUS.INTERNAL_ERROR || statusId === JUDGE0_STATUS.EXEC_FORMAT_ERROR) {
    return {
      type: "internal_error",
      errorMessage: result.stderr || result.compile_output || "Judge internal error"
    };
  }

  // Fallback: field-based heuristic (if status.id is missing)
  if (result.compile_output && !result.stdout) {
    return {
      type: "compilation_error",
      errorMessage: result.compile_output
    };
  }

  if (result.stderr && !result.stdout) {
    return {
      type: "runtime_error",
      errorMessage: result.stderr
    };
  }

  return { type: "accepted", errorMessage: null };
};

// TEST CASE EXECUTION

export const runTestCases = async (
  sourceCode,
  language,
  testCases,
  options = {}
) => {
  const languageId = getLanguageId(language);
  const results = [];

  const mode = options.mode || "challenge";
  const paramOrder = Array.isArray(options.paramOrder)
    ? options.paramOrder
    : [];

  console.log(`📝 Running ${testCases.length} test cases in '${mode}' mode [${language}]`);

  // Validate source code 
  if (!sourceCode || typeof sourceCode !== "string" || !sourceCode.trim()) {
    console.error("❌ [runTestCases] sourceCode is empty or missing!");
    return testCases.map((_, i) => ({
      testNumber: i + 1,
      status: "failed",
      message: `Test Case ${i + 1} Failed - No source code provided`,
      error: "Source code is empty. Please write your solution before submitting."
    }));
  }

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    const hasExpected =
      testCase.expectedOutput !== undefined ||
      testCase.expected_output !== undefined;

    if (testCase.input === undefined || !hasExpected) {
      console.warn(`⚠️  Test ${i + 1}: Invalid structure — input:`, testCase.input, "hasExpected:", hasExpected);
      results.push({
        testNumber: i + 1,
        status: "failed",
        message: `Test Case ${i + 1} Failed - Invalid test case structure`,
        input: testCase.input,
        expected: normalizeExpectedOutput(testCase)
      });
      continue;
    }

    try {
      // Build the code with wrapper if needed
      const codeToRun = buildSubmissionSource({
        sourceCode,
        language,
        mode,
        input: testCase.input,
        paramOrder
      });

      // Debug: detect if wrapper was NOT applied 
      const wrapperApplied = codeToRun !== sourceCode;
      if (!wrapperApplied && mode === "challenge") {
        console.warn(
          `⚠️  [Wrapper] Test ${i + 1}: wrapper was NOT applied!`,
          `Language: ${language}, mode: ${mode}.`,
          `The code will run without a print/main — output will be empty.`
        );
      }

      // Debug: log the full wrapped code for first test case 
      if (i === 0) {
        console.log(`\n🔍 [Debug] Wrapped code for test 1:\n${"─".repeat(40)}\n${codeToRun}\n${"─".repeat(40)}\n`);
      }

      // In run mode, pass input as stdin. In challenge mode, stdin is empty
      const stdin =
        mode === "run" ? serializeInputForRunMode(testCase.input) : "";

      console.log(`  Test ${i + 1}: Submitting to Judge0... (input: ${JSON.stringify(testCase.input)})`);

      const result = await submitCodeToJudge0(codeToRun, languageId, stdin);

      // Debug: log full Judge0 response for first test 
      if (i === 0) {
        console.log(`📋 [Debug] Judge0 response:`, JSON.stringify({
          status: result.status,
          stdout: result.stdout ? result.stdout.substring(0, 200) : null,
          stderr: result.stderr ? result.stderr.substring(0, 200) : null,
          compile_output: result.compile_output ? result.compile_output.substring(0, 200) : null,
          time: result.time,
          memory: result.memory
        }, null, 2));
      }

      const expectedStr = normalizeExpectedOutput(testCase);
      const actualRaw = result.stdout ? String(result.stdout).trim() : "";
      const actualStr = normalizeActualOutput(actualRaw);

      // Use status-based classification (not field heuristics) 
      const classification = classifyJudge0Result(result);

      let testResult;

      if (classification.type === "compilation_error") {
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Compilation Error`,
          error: classification.errorMessage,
          input: testCase.input,
          expected: expectedStr
        };
      } else if (classification.type === "runtime_error") {
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Runtime Error`,
          error: classification.errorMessage,
          input: testCase.input,
          expected: expectedStr
        };
      } else if (classification.type === "time_limit") {
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Time Limit Exceeded`,
          error: "Your solution took too long to execute.",
          input: testCase.input,
          expected: expectedStr
        };
      } else if (classification.type === "internal_error") {
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Execution Error`,
          error: classification.errorMessage,
          input: testCase.input,
          expected: expectedStr
        };
      } else if (compareOutputs(expectedStr, actualStr)) {
        // Test passed
        testResult = {
          testNumber: i + 1,
          status: "passed",
          message: `Test Case ${i + 1} Passed ✅`,
          input: testCase.input,
          expected: expectedStr,
          actual: actualStr,
          time: result.time || 0,
          memory: result.memory || 0
        };
      } else {
        // Wrong answer
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Wrong Answer`,
          input: testCase.input,
          expected: expectedStr,
          actual: actualStr || "No output",
          // Include stderr if present (might explain why output is wrong)
          ...(result.stderr ? { error: result.stderr } : {})
        };
      }

      results.push(testResult);
    } catch (error) {
      results.push({
        testNumber: i + 1,
        status: "failed",
        message: `Test Case ${i + 1} Failed - API Error`,
        error: error.message,
        input: testCase.input,
        expected: normalizeExpectedOutput(testCase)
      });
    }
  }

  return results;
};

// FREE CODE EXECUTION (FOR PLAYGROUNDS)

export const executeCode = async (sourceCode, language, input = "") => {
  try {
    const languageId = getLanguageId(language);
    const stdin = serializeInputForRunMode(input);

    console.log(`▶️  Executing ${language} code...`);

    const result = await submitCodeToJudge0(sourceCode, languageId, stdin);

    return {
      success: true,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      time: result.time || 0,
      memory: result.memory || 0,
      status_id: result.status?.id || result.status_id || null,
      status: result.status || null
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.message
    };
  }
};