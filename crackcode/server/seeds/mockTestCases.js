// Mock test cases for code editor problems

export const addTwoNumbersTests = {
  python: {
    testCode: `
# Test code will be appended after user code
result = Solution().addTwoNumbers(2, 3)
print(result)
`,
    testCases: [
      {
        input: "2 3",
        expectedOutput: "5",
        setup: ""
      },
      {
        input: "10 20",
        expectedOutput: "30",
        setup: ""
      },
      {
        input: "100 200",
        expectedOutput: "300",
        setup: ""
      },
      {
        input: "-5 5",
        expectedOutput: "0",
        setup: ""
      },
      {
        input: "0 0",
        expectedOutput: "0",
        setup: ""
      }
    ]
  },
  javascript: {
    testCode: `
const solution = new Solution();
const result = solution.addTwoNumbers(2, 3);
console.log(result);
`,
    testCases: [
      {
        input: "2 3",
        expectedOutput: "5",
        setup: ""
      },
      {
        input: "10 20",
        expectedOutput: "30",
        setup: ""
      },
      {
        input: "100 200",
        expectedOutput: "300",
        setup: ""
      },
      {
        input: "-5 5",
        expectedOutput: "0",
        setup: ""
      },
      {
        input: "0 0",
        expectedOutput: "0",
        setup: ""
      }
    ]
  }
};

export const sumTwoArraysTests = {
  python: {
    testCode: `
# Test code
result = findSum([1, 2, 3], [4, 5, 6])
print(result)
`,
    testCases: [
      {
        input: "[1, 2, 3] [4, 5, 6]",
        expectedOutput: "21",
        setup: ""
      },
      {
        input: "[1] [1]",
        expectedOutput: "2",
        setup: ""
      },
      {
        input: "[10, 20] [30, 40]",
        expectedOutput: "100",
        setup: ""
      }
    ]
  },
  javascript: {
    testCode: `
const result = findSum([1, 2, 3], [4, 5, 6]);
console.log(result);
`,
    testCases: [
      {
        input: "[1, 2, 3] [4, 5, 6]",
        expectedOutput: "21",
        setup: ""
      },
      {
        input: "[1] [1]",
        expectedOutput: "2",
        setup: ""
      },
      {
        input: "[10, 20] [30, 40]",
        expectedOutput: "100",
        setup: ""
      }
    ]
  }
};

export default {
  addTwoNumbersTests,
  sumTwoArraysTests
};
