import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../src/config/db.js';
import Question from '../src/modules/learn/Question.model.js';

const seedQuestions = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing questions (optional)
    // await Question.deleteMany({});
    // console.log('🗑️ Cleared existing questions');

    // Sample questions data
    const questionsData = [
      {
        problemId: "prob_000067",
        source: {
          dataset: "datasetA",
          source_question_id: "67"
        },
        original: {
          title: "Minimum Difference After k Sort Operations",
          description: "Given an array of integers `nums` and an integer `k`, you are allowed to perform at most `k` operations. In each operation, you can choose any element `nums[i]` and increment or decrement it by 1. The goal is to minimize the difference between the maximum and minimum elements in the array after performing at most `k` operations. Return 1 if it's possible to make the difference 0, otherwise return 0. In other words, return 1 if you can make all elements equal to each other, and 0 otherwise."
        },
        difficulty: "Hard",
        topic: "arrays",
        bloom: {
          level: "Analyze",
          score: 4
        },
        story: {
          chapterId: "case_01",
          beatId: "beat_03"
        },
        examples: [
          {
            input: { k: 6, nums: [1, 4, 7] },
            output: 1
          },
          {
            input: { k: 4, nums: [1, 4, 7] },
            output: 0
          }
        ],
        constraints: [
          "0 <= k <= 10^9",
          "1 <= nums[i] <= 10^9",
          "1 <= nums.length <= 10^5"
        ],
        test_cases: [
          {
            input: { k: 6, nums: [1, 4, 7] },
            expected_output: 1
          },
          {
            input: { k: 4, nums: [1, 4, 7] },
            expected_output: 0
          },
          {
            input: { k: 0, nums: [10] },
            expected_output: 1
          },
          {
            input: { k: 10, nums: [2, 7, 20, 22] },
            expected_output: 0
          },
          {
            input: { k: 30, nums: [2, 7, 20, 22] },
            expected_output: 1
          }
        ],
        variants: [
          {
            variantId: "prob_000067_python_detective_v1",
            language: "python",
            storyId: "detective_v1",
            templateId: "detective_v1_arrays_learn_01",
            narrative: {
              title: "Crack the Case: Minimize Difference with k Operations",
              description: "A new suspect is in custody, but the evidence is murky. You've got a lead on an array of integers `nums` and an integer `k`, but the difference between the maximum and minimum elements is still unclear. Your task is to follow the trail and determine if it's possible to make all elements equal to each other after at most `k` operations, where each operation allows you to increment or decrement any element by 1. Return 1 if you can crack the case and make the difference 0, otherwise return 0. The clock is ticking, detective."
            },
            starterCode: "def solve(k, nums):\n    # TODO: implement solution\n    # Calculate the cost to make all elements equal\n    # Return 1 if possible, 0 otherwise\n    pass\n\n# Test your solution\nif __name__ == '__main__':\n    k = 6\n    nums = [1, 4, 7]\n    print(solve(k, nums))"
          },
          {
            variantId: "prob_000067_javascript_js_adventure_v1",
            language: "javascript",
            storyId: "js_adventure_v1",
            templateId: "js_adventure_v1_arrays_learn_01",
            narrative: {
              title: "System Breach: Minimize Array Difference",
              description: "Critical alert: your skills are required to infiltrate and optimize an array. Task: Minimum Difference After k Sort Operations. Given an array of integers `nums` and an integer `k`, perform at most `k` operations to minimize the difference between the maximum and minimum elements. Each operation allows you to increment or decrement any element by 1. The mission is to unify the array elements. Return 1 if all elements can be made equal, and 0 otherwise. Time is running out, focus on a clear solution before checking test cases."
            },
            starterCode: "function solve(k, nums) {\n  // TODO: implement solution\n  // Calculate the cost to make all elements equal\n  // Return 1 if possible, 0 otherwise\n  return 0;\n}\n\n// Test your solution\nconst k = 6;\nconst nums = [1, 4, 7];\nconsole.log(solve(k, nums));"
          }
        ]
      },
      {
        problemId: "prob_000068",
        source: {
          dataset: "datasetA",
          source_question_id: "68"
        },
        original: {
          title: "Maximum Width of Binary Tree with Null Nodes",
          description: "Given the root of a binary tree, return the maximum width of the given tree.\n\nThe width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes are also counted into the length calculation.\n\nIt is guaranteed that the width of the tree will fit in a 32-bit signed integer."
        },
        difficulty: "Hard",
        topic: "trees",
        bloom: {
          level: "Remember",
          score: 1
        },
        story: {
          chapterId: "case_01",
          beatId: "beat_01"
        },
        examples: [
          {
            input: { root: "[1,3,2,5,3,null,9]" },
            output: 4
          },
          {
            input: { root: "[1,3,2,5,null,null,9,6,null,7]" },
            output: 7
          }
        ],
        constraints: [
          "-100 <= Node.val <= 100",
          "The number of nodes in the tree is in the range [1, 3000]."
        ],
        test_cases: [
          {
            input: { root: "[1,3,2,5,3,null,9]" },
            expected_output: 4
          },
          {
            input: { root: "[1,3,2,5,null,null,9,6,null,7]" },
            expected_output: 7
          },
          {
            input: { root: "[1,3,2,5]" },
            expected_output: 2
          },
          {
            input: { root: "[1,3,2,5,null,null,9,6,null,7,null,null,null,null,8]" },
            expected_output: 8
          },
          {
            input: { root: "[1]" },
            expected_output: 1
          }
        ],
        variants: [
          {
            variantId: "prob_000068_python_detective_v1",
            language: "python",
            storyId: "detective_v1",
            templateId: "detective_v1_trees_learn_01",
            narrative: {
              title: "Cracking the Case of the Binary Tree",
              description: "We've got a new lead, detective. A binary tree with null nodes has been found at the scene, and we need to calculate its maximum width. The width of each level is determined by the length between the leftmost and rightmost non-null nodes, including any null nodes in between. Time is of the essence - we need a solution that can fit within a 32-bit signed integer. Get to work, detective, and unravel the mystery of this binary tree's maximum width."
            },
            starterCode: "def widthOfBinaryTree(root):\n    # TODO: implement solution\n    # Return the maximum width of the binary tree\n    pass\n\nif __name__ == '__main__':\n    # Test your solution\n    pass"
          },
          {
            variantId: "prob_000068_javascript_js_adventure_v1",
            language: "javascript",
            storyId: "js_adventure_v1",
            templateId: "js_adventure_v1_trees_learn_01",
            narrative: {
              title: "Infiltrate the Tree Network: Maximum Width Protocol",
              description: "Warning: System Breach Imminent. Engage tree network protocol to calculate maximum width. Given the root node, infiltrate the binary tree and return the maximum width, considering all nodes - including null ones. Time is critical, and the system's integrity depends on your rapid response."
            },
            starterCode: "function widthOfBinaryTree(root) {\n  // TODO: implement solution\n  // Return the maximum width of the binary tree\n  return 0;\n}\n\n// Test your solution\nconst root = [1,3,2,5,3,null,9];\nconsole.log(widthOfBinaryTree(root));"
          }
        ]
      }
    ];

    // Insert questions
    const result = await Question.insertMany(questionsData);
    console.log(`✅ Successfully inserted ${result.length} questions`);

    // Display inserted questions
    const allQuestions = await Question.find({});
    console.log(`\n📊 Total questions in database: ${allQuestions.length}`);
    console.log('\nQuestions:');
    allQuestions.forEach((q) => {
      console.log(`  - ${q.problemId}: ${q.original.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();
