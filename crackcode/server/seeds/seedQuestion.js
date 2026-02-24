import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../src/config/db.js';
import Question from '../src/modules/learn/Question.model.js';

const seedAddTwoNumbers = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if question already exists
    const existingQuestion = await Question.findOne({ problemId: 'CASE-001' });
    
    if (existingQuestion) {
      console.log('Question already exists, updating...');
      await Question.updateOne(
        { problemId: 'CASE-001' },
        {
          $set: {
            original: {
              title: 'Add Two Numbers',
              description: 'Write a program that takes two numbers as input and returns their sum.\n\nThis is a simple arithmetic problem to test your coding skills.',
            },
            difficulty: 'Easy',
            topic: 'Arithmetic',
            examples: [
              {
                input: '2 3',
                output: '5',
              },
              {
                input: '10 20',
                output: '30',
              },
            ],
            constraints: [
              'Numbers can be positive or negative',
              'Range: -10^6 to 10^6',
              'Time Complexity: O(1)',
            ],
            test_cases: [
              {
                input: '2 3',
                expected_output: '5',
              },
              {
                input: '10 20',
                expected_output: '30',
              },
              {
                input: '100 200',
                expected_output: '300',
              },
            ],
            variants: [
              {
                variantId: 'add-two-python',
                language: 'python',
                narrative: {
                  title: 'Detective Case #001: The Missing Sum',
                  description: 'Detective, we need you to solve this arithmetic puzzle. Given two numbers, find their sum.',
                },
                starterCode: `class Solution:
    def addTwoNumbers(self, num1: int, num2: int) -> int:
        """
        Add two numbers and return their sum.
        
        Args:
            num1: First number
            num2: Second number
            
        Returns:
            The sum of num1 and num2
        """
        # Write your code here
        pass`,
              },
              {
                variantId: 'add-two-javascript',
                language: 'javascript',
                narrative: {
                  title: 'Detective Case #001: The Missing Sum',
                  description: 'Detective, we need you to solve this arithmetic puzzle. Given two numbers, find their sum.',
                },
                starterCode: `class Solution {
    addTwoNumbers(num1, num2) {
        /**
         * Add two numbers and return their sum.
         * 
         * @param {number} num1 - First number
         * @param {number} num2 - Second number
         * @returns {number} The sum of num1 and num2
         */
        // Write your code here
    }
}`,
              },
            ],
          }
        }
      );
      console.log('✅ Question updated successfully!');
    } else {
      // Create new question
      const newQuestion = new Question({
        problemId: 'CASE-001',
        source: {
          dataset: 'crackcode-detective',
          source_question_id: 'Q001',
        },
        original: {
          title: 'Add Two Numbers',
          description: 'Write a program that takes two numbers as input and returns their sum.\n\nThis is a simple arithmetic problem to test your coding skills.',
        },
        difficulty: 'Easy',
        topic: 'Arithmetic',
        bloom: {
          level: 'Remember',
          score: 1,
        },
        story: {
          chapterId: 'chapter-1',
          beatId: 'beat-1',
        },
        examples: [
          {
            input: '2 3',
            output: '5',
          },
          {
            input: '10 20',
            output: '30',
          },
        ],
        constraints: [
          'Numbers can be positive or negative',
          'Range: -10^6 to 10^6',
          'Time Complexity: O(1)',
        ],
        test_cases: [
          {
            input: '2 3',
            expected_output: '5',
          },
          {
            input: '10 20',
            expected_output: '30',
          },
          {
            input: '100 200',
            expected_output: '300',
          },
        ],
        variants: [
          {
            variantId: 'add-two-python',
            language: 'python',
            narrative: {
              title: 'Detective Case #001: The Missing Sum',
              description: 'Detective, we need you to solve this arithmetic puzzle. Given two numbers, find their sum.',
            },
            starterCode: `class Solution:
    def addTwoNumbers(self, num1: int, num2: int) -> int:
        """
        Add two numbers and return their sum.
        
        Args:
            num1: First number
            num2: Second number
            
        Returns:
            The sum of num1 and num2
        """
        # Write your code here
        pass`,
          },
          {
            variantId: 'add-two-javascript',
            language: 'javascript',
            narrative: {
              title: 'Detective Case #001: The Missing Sum',
              description: 'Detective, we need you to solve this arithmetic puzzle. Given two numbers, find their sum.',
            },
            starterCode: `class Solution {
    addTwoNumbers(num1, num2) {
        /**
         * Add two numbers and return their sum.
         * 
         * @param {number} num1 - First number
         * @param {number} num2 - Second number
         * @returns {number} The sum of num1 and num2
         */
        // Write your code here
    }
}`,
          },
        ],
      });

      await newQuestion.save();
      console.log('✅ Question seeded successfully!');
    }

    // Display the question
    const question = await Question.findOne({ problemId: 'CASE-001' });
    console.log('\n📋 Question Details:');
    console.log(JSON.stringify(question, null, 2));
    console.log('\n✅ Test cases added:');
    question.test_cases.forEach((tc, idx) => {
      console.log(`  ${idx + 1}. Input: ${tc.input} → Expected: ${tc.expected_output}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedAddTwoNumbers();
