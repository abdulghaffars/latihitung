import { describe, it, expect } from 'vitest';
import { generateQuestion } from './mathLogic';

describe('generateQuestion - Latihitung Engine', () => {

  it('1. Should always return 4 unique options (No duplicates)', () => {
    // Run 100 times to ensure the random generator is stable
    for (let i = 0; i < 100; i++) {
      const result = generateQuestion(Math.floor(Math.random() * 100) + 1);
      
      // Ensure the array length is always 4
      expect(result.options.length).toBe(4);
      
      // Ensure there are no duplicates using Set
      const uniqueOptions = new Set(result.options);
      expect(uniqueOptions.size).toBe(4);
    }
  });

  it('2. Should always include correctAnswer in the options array', () => {
    for (let i = 0; i < 100; i++) {
      const result = generateQuestion(20);
      expect(result.options).toContain(result.correctAnswer);
    }
  });

  it('3. Should never produce Division by Zero (Division by 0)', () => {
    for (let i = 0; i < 100; i++) {
      // Force only using division operator
      const result = generateQuestion(50, ['÷']);
      
      // Take the divisor from the question string (e.g. from "10 ÷ 2", take "2")
      const parts = result.question.split(' ÷ ');
      const divisor = parseInt(parts[1].replace(/[()]/g, ''), 10);
      
      // Divisor cannot be 0
      expect(divisor).not.toBe(0);
      // Result cannot be Infinity (because division by zero)
      expect(result.correctAnswer).not.toBe(Infinity);
      expect(result.correctAnswer).not.toBe(-Infinity);
    }
  });

  it('4. Follows the negative number rule (allowNegative = false)', () => {
    for (let i = 0; i < 100; i++) {
      // Set negativeAnswer = false, negativeNumber = false
      const result = generateQuestion(10, ['+', '-', 'x', '÷'], false, false);
      
      // Correct answer must be >= 0
      expect(result.correctAnswer).toBeGreaterThanOrEqual(0);
      
      // All options must be >= 0
      result.options.forEach(option => {
        expect(option).toBeGreaterThanOrEqual(0);
      });
      
      // There should be no minus (-) sign on the numbers in the question string (except for operators)
      // Example valid: "10 - 5", invalid: "10 + (-5)"
      const isNegativeOperandPresent = /\(\-[0-9]+\)/.test(result.question);
      expect(isNegativeOperandPresent).toBe(false);
    }
  });

  it('5. Anti-Cheat Digit / Magnitude Fallback works well', () => {
    // We catch with extreme conditions where normal traps (tier 1 & 2) 
    // might be filtered out, so the function is forced to call fallback multiplier.
    for (let i = 0; i < 50; i++) {
      // Level 100 usually produces thousands for multiplication
      const result = generateQuestion(100, ['x'], false, false);
      
      // Take the wrong answer only
      const wrongOptions = result.options.filter((opt: number) => opt !== result.correctAnswer);
      
      // Ensure there are 3 wrong options
      expect(wrongOptions.length).toBe(3);

      if (result.correctAnswer >= 100) {
         // If the answer is hundreds/thousands, the wrong option distance cannot be too close (+1 or +2 only),
         // except it is trap Tier 1 (like wrong operation).
         // Fallback generator uses magnitude multiples (10, 100), 
         // so we ensure there are no undefined/NaN values leaking.
         wrongOptions.forEach((opt: number) => {
           expect(Number.isFinite(opt)).toBe(true);
           expect(opt % 1 === 0).toBe(true); // Ensure always integer (not decimal)
         });
      }
    }
  });

  it('6. Guard Clause throws Error if allowedOperators is empty', () => {
    expect(() => {
      // Send empty array to test validation
      generateQuestion(10, []);
    }).toThrow("At least one operator must be selected.");
  });

});