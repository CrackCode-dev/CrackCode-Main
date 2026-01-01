export const MOCK_PROBLEMS = {
  "case-101": {
    id: "case-101",
    caseNumber: "089",
    difficulty: "Intermediate",
    title: "The Midnight Robbery",
    fileName: "investigation.py",
    description: "Detective, a thief has stashed the stolen jewels in one of the abandoned row houses on Elm Street. We need you to search every house one by one until you find the loot. But be careful—don't search past the end of the street!",
    objectives: [
      "Define the row of houses.",
      "Create a loop to search each house.",
      "Stop searching before you run out of road (Fix the Loop Limit)."
    ],
    clue: "Check your loop range; index errors are a detective's worst enemy!",
    example: {
      input: 'houses = ["Empty", "Empty", "Loot", "Empty"]',
      output: 'Found at index 2'
    },
    starterCode: {
      python: 'houses = ["Empty", "Empty", "Loot", "Empty"]\n\n# Search every house\nfor i in range(0, 5):  # Fix this!\n    if houses[i] == "Loot":\n        print(f"Found at index {i}")\n        break',
      javascript: 'const houses = ["Empty", "Empty", "Loot", "Empty"];\n\n// Search every house\nfor (let i = 0; i < 5; i++) {\n    if (houses[i] === "Loot") {\n        console.log(`Found at index ${i}`);\n        break;\n    }\n}'
    },
    testCases: [
      { input: "", expectedOutput: "Found at index 2" }
    ]
  }
};