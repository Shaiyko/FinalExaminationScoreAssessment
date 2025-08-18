/**
 * Utility functions for thesis defense scoring calculations
 * Maintains full precision during calculations, rounding only for display
 */

// ✅ คำนวณค่าเฉลี่ย
export function avg(values: number[]): number {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

// ✅ คำนวณคะแนนถ่วงน้ำหนัก
export function weighted(a1: number, a2: number): number {
  return a1 * 0.35 + a2 * 0.65;
}

// ✅ คำนวณคะแนนสุดท้ายจาก raters
export function finalScore(weights: number[]): number {
  if (!weights || weights.length === 0) return 0;
  return weights.reduce((a, b) => a + b, 0) / weights.length;
}

// ✅ แปลงคะแนน (0–5) → เปอร์เซ็นต์
export function toPercent(score: number): number {
  return score * 20;
}

// ✅ ตรวจสอบว่าคะแนนทุกช่องอยู่ระหว่าง 1–5
export function validateAllScores(allSheets: number[][]): boolean {
  for (const sheet of allSheets) {
    for (const score of sheet) {
      if (score < 1 || score > 5 || !Number.isInteger(score)) {
        return false;
      }
    }
  }
  return true;
}

// ✅ นับจำนวนช่องที่กรอกคะแนนแล้ว
export function countFilledScores(allSheets: number[][]): number {
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

// ✅ ปัดเศษเพื่อแสดงผล
export function roundForDisplay(num: number, decimals: number = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ✅ แปลงคะแนน (0–5) → GPA และเกรดตัวอักษร
export function scoreToGPA(score: number): {
  gpa: number;
  letterGrade: string;
  meaning: string;
} {
  const percentage = toPercent(score);

  if (percentage >= 85) {
    return { gpa: 4, letterGrade: "A", meaning: "Excellent" };
  } else if (percentage >= 80) {
    return { gpa: 3.5, letterGrade: "B+", meaning: "Very Good" };
  } else if (percentage >= 75) {
    return { gpa: 3, letterGrade: "B", meaning: "Good" };
  } else if (percentage >= 70) {
    return { gpa: 2.5, letterGrade: "C+", meaning: "Fairly Good" };
  } else if (percentage >= 65) {
    return { gpa: 2, letterGrade: "C", meaning: "Fair" };
  } else if (percentage >= 60) {
    return { gpa: 1.5, letterGrade: "D+", meaning: "Poor" };
  } else if (percentage >= 50) {
    return { gpa: 1, letterGrade: "D", meaning: "Very Poor" };
  } else {
    return { gpa: 0, letterGrade: "F", meaning: "Fail" };
  }
}
