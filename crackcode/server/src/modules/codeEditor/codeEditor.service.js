import axios from "axios";

// ====================================================
// JUDGE0 CONFIGURATION
// ====================================================

const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
  c: 50
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

// ====================================================
// JUDGE0 API REQUEST
// ====================================================

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

// ====================================================
// HELPER UTILITIES
// ====================================================

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

const normalizeExpectedOutput = (testCase) => {
  // Handle both expectedOutput and expected_output field names
  const raw = testCase.expectedOutput ?? testCase.expected_output;
  return raw !== undefined && raw !== null ? String(raw).trim() : "";
};

const serializeInputForRunMode = (input) => {
  if (input === undefined || input === null) return "";
  return typeof input === "string" ? input : JSON.stringify(input);
};

// Build ordered arguments array from input based on paramOrder
const buildOrderedArgs = (input, paramOrder = []) => {
  // If input is already an array, use it directly
  if (Array.isArray(input)) {
    return input;
  }

  // If input is an object, use paramOrder to extract in correct sequence
  if (isPlainObject(input)) {
    if (Array.isArray(paramOrder) && paramOrder.length > 0) {
      return paramOrder.map((paramName) => input[paramName]);
    }
    // Fallback to Object.values if paramOrder not provided
    return Object.values(input);
  }

  // Single primitive value or null
  if (input === undefined || input === null) {
    return [];
  }

  return [input];
};

// ====================================================
// LITERAL CONVERTERS FOR EACH LANGUAGE
// ====================================================

const toPythonLiteral = (value) => {
  if (value === null || value === undefined) return "None";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);

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
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);

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

// ====================================================
// CODE PATTERN DETECTORS
// ====================================================

const hasPythonSolve = (sourceCode) => /\bdef\s+solve\s*\(/.test(sourceCode);

const hasJavaScriptSolve = (sourceCode) =>
  /\bfunction\s+solve\s*\(/.test(sourceCode) ||
  /\bconst\s+solve\s*=\s*\(/.test(sourceCode) ||
  /\blet\s+solve\s*=\s*\(/.test(sourceCode) ||
  /\bvar\s+solve\s*=\s*\(/.test(sourceCode);

const hasJavaSolution = (sourceCode) =>
  /\bclass\s+Solution\b/.test(sourceCode) && /\bsolve\s*\(/.test(sourceCode);

const hasCppSolution = (sourceCode) =>
  /\bclass\s+Solution\b/.test(sourceCode) && /\bsolve\s*\(/.test(sourceCode);

// ====================================================
// CHALLENGE MODE WRAPPER BUILDER
// ====================================================

const buildChallengeWrapper = ({ sourceCode, language, input, paramOrder = [] }) => {
  const args = buildOrderedArgs(input, paramOrder);

  if (language === "python") {
    if (!hasPythonSolve(sourceCode)) {
      return sourceCode;
    }

    const argsString = args.map(toPythonLiteral).join(", ");

    return `${sourceCode}

if __name__ == "__main__":
    result = solve(${argsString})
    print(result)
`;
  }

  if (language === "javascript") {
    if (!hasJavaScriptSolve(sourceCode)) {
      return sourceCode;
    }

    const argsString = args.map(toJsLiteral).join(", ");

    return `"use strict";

${sourceCode}

const result = solve(${argsString});
console.log(result);
`;
  }

  if (language === "java") {
    if (!hasJavaSolution(sourceCode)) {
      return sourceCode;
    }

    const argsString = args.map(toJavaLiteral).join(", ");

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

  if (language === "cpp") {
    if (!hasCppSolution(sourceCode)) {
      return sourceCode;
    }

    const argsString = args.map(toCppLiteral).join(", ");

    return `#include <bits/stdc++.h>
using namespace std;

${sourceCode}

int main() {
    auto result = Solution::solve(${argsString});
    cout << result << "\\n";
    return 0;
}
`;
  }

  // If language not handled, return raw code
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
  // Run mode: user code is already a full program
  if (mode === "run") {
    return sourceCode;
  }

  // Challenge mode: wrap the function/class
  return buildChallengeWrapper({
    sourceCode,
    language,
    input,
    paramOrder
  });
};

// ====================================================
// TEST CASE EXECUTION
// ====================================================

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

  console.log(`📝 Running ${testCases.length} test cases in ${mode} mode`);

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];

    const hasExpected =
      testCase.expectedOutput !== undefined ||
      testCase.expected_output !== undefined;

    if (testCase.input === undefined || !hasExpected) {
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

      // In run mode, pass input as stdin. In challenge mode, stdin is empty
      const stdin =
        mode === "run" ? serializeInputForRunMode(testCase.input) : "";

      console.log(`  Test ${i + 1}: Submitting to Judge0...`);

      const result = await submitCodeToJudge0(codeToRun, languageId, stdin);

      const expectedStr = normalizeExpectedOutput(testCase);
      const actualStr = result.stdout ? String(result.stdout).trim() : "";

      let testResult;

      if (result.compile_output && !result.stdout) {
        // Compilation error
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Compilation Error`,
          error: result.compile_output,
          input: testCase.input,
          expected: expectedStr
        };
      } else if (result.stderr && !result.stdout) {
        // Runtime error
        testResult = {
          testNumber: i + 1,
          status: "failed",
          message: `Test Case ${i + 1} Failed - Runtime Error`,
          error: result.stderr,
          input: testCase.input,
          expected: expectedStr
        };
      } else if (actualStr === expectedStr) {
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
          actual: actualStr || "No output"
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

// ====================================================
// FREE CODE EXECUTION (FOR PLAYGROUNDS)
// ====================================================

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
