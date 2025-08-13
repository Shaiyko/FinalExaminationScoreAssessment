/**
 * Utility functions for thesis defense scoring calculations
 * Maintains full precision during calculations, rounding only for display
 */

/**
 * Calculate average of array values
 * @param {number[]} values - Array of numbers
 * @returns {number} Average value with full precision
 */
export function avg(values) {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

/**
 * Calculate weighted score for a rater
 * @param {number} a1 - Average score from sheet 1
 * @param {number} a2 - Average score from sheet 2
 * @returns {number} Weighted score (35% sheet1 + 65% sheet2)
 */
export function weighted(a1, a2) {
  return a1 * 0.35 + a2 * 0.65;
}

/**
 * Calculate final score from all rater weights
 * @param {number[]} weights - Array of weighted scores from all raters
 * @returns {number} Final average score
 */
export function finalScore(weights) {
  if (!weights || weights.length === 0) return 0;
  return weights.reduce((a, b) => a + b, 0) / weights.length;
}

/**
 * Convert score to percentage (multiply by 20)
 * @param {number} score - Score out of 5
 * @returns {number} Percentage score
 */
export function toPercent(score) {
  return score * 20;
}

/**
 * Validate if all scores in arrays are valid (1-5)
 * @param {number[][]} allSheets - Array of sheet arrays containing scores
 * @returns {boolean} True if all scores are valid
 */
export function validateAllScores(allSheets) {
  for (const sheet of allSheets) {
    for (const score of sheet) {
      if (score < 1 || score > 5 || !Number.isInteger(score)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Count filled scores across all sheets
 * @param {number[][]} allSheets - Array of sheet arrays
 * @returns {number} Number of filled scores
 */
export function countFilledScores(allSheets) {
  let count = 0;
  for (const sheet of allSheets) {
    for (const score of sheet) {
      if (score >= 1 && score <= 5) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Round number to specified decimal places for display
 * @param {number} num - Number to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Rounded number
 */
export function roundForDisplay(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Convert 5-point score to GPA and letter grade
 * @param {number} score - Score out of 5
 * @returns {object} Object with gpa, letterGrade, and meaning
 */
export function scoreToGPA(score) {
  const percentage = toPercent(score);
  
  if (percentage >= 85) {
    return { gpa: 4, letterGrade: 'A', meaning: 'Excellent' };
  } else if (percentage >= 80) {
    return { gpa: 3.5, letterGrade: 'B+', meaning: 'Very Good' };
  } else if (percentage >= 75) {
    return { gpa: 3, letterGrade: 'B', meaning: 'Good' };
  } else if (percentage >= 70) {
    return { gpa: 2.5, letterGrade: 'C+', meaning: 'Fairly Good' };
  } else if (percentage >= 65) {
    return { gpa: 2, letterGrade: 'C', meaning: 'Fair' };
  } else if (percentage >= 60) {
    return { gpa: 1.5, letterGrade: 'D+', meaning: 'Poor' };
  } else if (percentage >= 50) {
    return { gpa: 1, letterGrade: 'D', meaning: 'Very Poor' };
  } else {
    return { gpa: 0, letterGrade: 'F', meaning: 'Fail' };
  }
}