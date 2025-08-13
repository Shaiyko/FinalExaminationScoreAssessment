import { describe, test, expect } from 'vitest';
import { avg, weighted, finalScore, toPercent, validateAllScores, countFilledScores, roundForDisplay, scoreToGPA } from './calc.js';

describe('Thesis Defense Calculator Functions', () => {
  describe('avg function', () => {
    test('calculates average correctly', () => {
      expect(avg([1, 2, 3, 4, 5])).toBe(3);
      expect(avg([4, 4, 4, 4])).toBe(4);
      expect(avg([5])).toBe(5);
    });

    test('handles empty array', () => {
      expect(avg([])).toBe(0);
      expect(avg(null)).toBe(0);
      expect(avg(undefined)).toBe(0);
    });

    test('maintains precision', () => {
      expect(avg([1, 2])).toBe(1.5);
      expect(avg([2, 3, 4])).toBe(3);
    });
  });

  describe('weighted function', () => {
    test('calculates weighted score correctly', () => {
      // Test with example data: A1=4.2857142857, A2=4.1666666667
      const a1 = 60 / 14; // 4.2857142857
      const a2 = 100 / 24; // 4.1666666667
      const result = weighted(a1, a2);
      
      expect(result).toBeCloseTo(4.2083333333, 9);
    });

    test('handles perfect scores', () => {
      expect(weighted(5, 5)).toBe(5);
      expect(weighted(1, 1)).toBe(1);
    });

    test('applies correct weights', () => {
      // 35% for sheet1, 65% for sheet2
      const result = weighted(4, 3);
      const expected = 4 * 0.35 + 3 * 0.65;
      expect(result).toBe(expected);
    });
  });

  describe('finalScore function', () => {
    test('calculates final score from multiple raters', () => {
      const weights = [4.2083333333, 3.9479166667, 4.4687500000];
      const result = finalScore(weights);
      
      expect(result).toBeCloseTo(4.2083333333, 9);
    });

    test('handles empty array', () => {
      expect(finalScore([])).toBe(0);
      expect(finalScore(null)).toBe(0);
    });

    test('handles single rater', () => {
      expect(finalScore([4.5])).toBe(4.5);
    });
  });

  describe('toPercent function', () => {
    test('converts score to percentage correctly', () => {
      expect(toPercent(4.2083333333)).toBeCloseTo(84.1666666667, 9);
      expect(toPercent(5)).toBe(100);
      expect(toPercent(1)).toBe(20);
      expect(toPercent(0)).toBe(0);
    });
  });

  describe('validateAllScores function', () => {
    test('validates correct scores', () => {
      const validSheets = [
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1]
      ];
      expect(validateAllScores(validSheets)).toBe(true);
    });

    test('rejects invalid scores', () => {
      const invalidSheets = [
        [1, 2, 6, 4, 5], // 6 is invalid
        [5, 4, 3, 2, 1]
      ];
      expect(validateAllScores(invalidSheets)).toBe(false);
    });

    test('rejects decimal scores', () => {
      const decimalSheets = [
        [1, 2, 3.5, 4, 5], // 3.5 is not integer
        [5, 4, 3, 2, 1]
      ];
      expect(validateAllScores(decimalSheets)).toBe(false);
    });

    test('rejects zero scores', () => {
      const zeroSheets = [
        [1, 2, 0, 4, 5], // 0 is invalid
        [5, 4, 3, 2, 1]
      ];
      expect(validateAllScores(zeroSheets)).toBe(false);
    });
  });

  describe('countFilledScores function', () => {
    test('counts valid scores correctly', () => {
      const sheets = [
        [1, 2, 3, 0, 0], // 3 valid scores
        [4, 5, 0, 0, 0]  // 2 valid scores
      ];
      expect(countFilledScores(sheets)).toBe(5);
    });

    test('ignores invalid scores', () => {
      const sheets = [
        [1, 2, 6, 0, -1], // only 2 valid scores
        [4, 5, 0, 0, 0]   // 2 valid scores
      ];
      expect(countFilledScores(sheets)).toBe(4);
    });
  });

  describe('roundForDisplay function', () => {
    test('rounds to specified decimal places', () => {
      expect(roundForDisplay(3.14159, 2)).toBe(3.14);
      expect(roundForDisplay(3.14159, 3)).toBe(3.142);
      expect(roundForDisplay(3.14159, 0)).toBe(3);
    });

    test('uses default 2 decimal places', () => {
      expect(roundForDisplay(3.14159)).toBe(3.14);
    });

    test('handles edge cases', () => {
      expect(roundForDisplay(0)).toBe(0);
      expect(roundForDisplay(5)).toBe(5);
    });
  });

  describe('scoreToGPA function', () => {
    test('converts scores to correct GPA and letter grades', () => {
      // Test A grade (85-100%)
      expect(scoreToGPA(5)).toEqual({ gpa: 4, letterGrade: 'A', meaning: 'Excellent' });
      expect(scoreToGPA(4.25)).toEqual({ gpa: 4, letterGrade: 'A', meaning: 'Excellent' });
      
      // Test B+ grade (80-84%)
      expect(scoreToGPA(4.2)).toEqual({ gpa: 3.5, letterGrade: 'B+', meaning: 'Very Good' });
      expect(scoreToGPA(4.0)).toEqual({ gpa: 3.5, letterGrade: 'B+', meaning: 'Very Good' });
      
      // Test B grade (75-79%)
      expect(scoreToGPA(3.9)).toEqual({ gpa: 3, letterGrade: 'B', meaning: 'Good' });
      expect(scoreToGPA(3.75)).toEqual({ gpa: 3, letterGrade: 'B', meaning: 'Good' });
      
      // Test C+ grade (70-74%)
      expect(scoreToGPA(3.7)).toEqual({ gpa: 2.5, letterGrade: 'C+', meaning: 'Fairly Good' });
      expect(scoreToGPA(3.5)).toEqual({ gpa: 2.5, letterGrade: 'C+', meaning: 'Fairly Good' });
      
      // Test C grade (65-69%)
      expect(scoreToGPA(3.4)).toEqual({ gpa: 2, letterGrade: 'C', meaning: 'Fair' });
      expect(scoreToGPA(3.25)).toEqual({ gpa: 2, letterGrade: 'C', meaning: 'Fair' });
      
      // Test D+ grade (60-64%)
      expect(scoreToGPA(3.2)).toEqual({ gpa: 1.5, letterGrade: 'D+', meaning: 'Poor' });
      expect(scoreToGPA(3.0)).toEqual({ gpa: 1.5, letterGrade: 'D+', meaning: 'Poor' });
      
      // Test D grade (50-59%)
      expect(scoreToGPA(2.9)).toEqual({ gpa: 1, letterGrade: 'D', meaning: 'Very Poor' });
      expect(scoreToGPA(2.5)).toEqual({ gpa: 1, letterGrade: 'D', meaning: 'Very Poor' });
      
      // Test F grade (0-49%)
      expect(scoreToGPA(2.4)).toEqual({ gpa: 0, letterGrade: 'F', meaning: 'Fail' });
      expect(scoreToGPA(1.0)).toEqual({ gpa: 0, letterGrade: 'F', meaning: 'Fail' });
    });

    test('handles edge cases correctly', () => {
      // Test exact boundary values
      expect(scoreToGPA(4.25)).toEqual({ gpa: 4, letterGrade: 'A', meaning: 'Excellent' }); // 85%
      expect(scoreToGPA(4.0)).toEqual({ gpa: 3.5, letterGrade: 'B+', meaning: 'Very Good' }); // 80%
      expect(scoreToGPA(3.75)).toEqual({ gpa: 3, letterGrade: 'B', meaning: 'Good' }); // 75%
      expect(scoreToGPA(3.5)).toEqual({ gpa: 2.5, letterGrade: 'C+', meaning: 'Fairly Good' }); // 70%
      expect(scoreToGPA(3.25)).toEqual({ gpa: 2, letterGrade: 'C', meaning: 'Fair' }); // 65%
      expect(scoreToGPA(3.0)).toEqual({ gpa: 1.5, letterGrade: 'D+', meaning: 'Poor' }); // 60%
      expect(scoreToGPA(2.5)).toEqual({ gpa: 1, letterGrade: 'D', meaning: 'Very Poor' }); // 50%
    });
  });

  describe('Integration test with provided example', () => {
    test('matches expected calculation results', () => {
      // Test data from the specification
      const rater1 = {
        sheet1Sum: 60,
        sheet2Sum: 100
      };
      const rater2 = {
        sheet1Sum: 55,
        sheet2Sum: 95
      };
      const rater3 = {
        sheet1Sum: 65,
        sheet2Sum: 105
      };

      // Calculate averages
      const a1_1 = rater1.sheet1Sum / 14; // 4.2857142857
      const a2_1 = rater1.sheet2Sum / 24; // 4.1666666667
      const w1 = weighted(a1_1, a2_1); // 4.2083333333

      const a1_2 = rater2.sheet1Sum / 14; // 3.9285714286
      const a2_2 = rater2.sheet2Sum / 24; // 3.9583333333
      const w2 = weighted(a1_2, a2_2); // 3.9479166667

      const a1_3 = rater3.sheet1Sum / 14; // 4.6428571429
      const a2_3 = rater3.sheet2Sum / 24; // 4.3750000000
      const w3 = weighted(a1_3, a2_3); // 4.4687500000

      // Test individual calculations
      expect(a1_1).toBeCloseTo(4.2857142857, 9);
      expect(a2_1).toBeCloseTo(4.1666666667, 9);
      expect(w1).toBeCloseTo(4.2083333333, 9);

      expect(a1_2).toBeCloseTo(3.9285714286, 9);
      expect(a2_2).toBeCloseTo(3.9583333333, 9);
      expect(w2).toBeCloseTo(3.9479166667, 9);

      expect(a1_3).toBeCloseTo(4.6428571429, 9);
      expect(a2_3).toBeCloseTo(4.3750000000, 9);
      expect(w3).toBeCloseTo(4.4687500000, 9);

      // Test final score
      const final = finalScore([w1, w2, w3]);
      expect(final).toBeCloseTo(4.2083333333, 9);

      // Test percentage
      const percent = toPercent(final);
      expect(percent).toBeCloseTo(84.1666666667, 9);
      
      // Test GPA conversion
      const gradeInfo = scoreToGPA(final);
      expect(gradeInfo).toEqual({ gpa: 3.5, letterGrade: 'B+', meaning: 'Very Good' });
    });
  });
});