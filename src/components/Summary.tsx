import { avg, weighted, finalScore, toPercent, roundForDisplay, countFilledScores, scoreToGPA } from '../utils/calc';

// Type definitions
interface StudentData {
  name: string;
  studentId: string;
  department: string;
  thesisTitle: string;
}

interface RaterData {
  sheet1: number[];
  sheet2: number[];
}

interface RaterResult {
  name: string;
  sheet1Avg: number;
  sheet2Avg: number;
  weightedScore: number;
  isComplete: boolean;
}

interface GradeInfo {
  gpa: number;
  letterGrade: string;
  meaning: string;
}

interface SummaryProps {
  studentData: StudentData;
  ratersData: RaterData[];
  onPrint: () => void;
}

const Summary: React.FC<SummaryProps> = ({ studentData, ratersData }) => {
  // Calculate scores for each rater
  const raterResults: RaterResult[] = ratersData.map((rater, index) => {
    const sheet1Scores = rater.sheet1.filter((score: number) => score >= 1 && score <= 5);
    const sheet2Scores = rater.sheet2.filter((score: number) => score >= 1 && score <= 5);
    
    const sheet1Complete = sheet1Scores.length === 14;
    const sheet2Complete = sheet2Scores.length === 24;
    const isComplete = sheet1Complete && sheet2Complete;
    
    const sheet1Avg = isComplete ? avg(sheet1Scores) : 0;
    const sheet2Avg = isComplete ? avg(sheet2Scores) : 0;
    const weightedScore = isComplete ? weighted(sheet1Avg, sheet2Avg) : 0;
    
    return {
      name: `ກຳມະການ #${index + 1}`,
      sheet1Avg,
      sheet2Avg,
      weightedScore,
      isComplete
    };
  });

  // Calculate final scores
  const completedRaters = raterResults.filter((r: RaterResult) => r.isComplete);
  const canCalculateFinal = completedRaters.length === 3;
  
  const finalScoreValue = canCalculateFinal ? 
    finalScore(completedRaters.map((r: RaterResult) => r.weightedScore)) : 0;
  const percentScore = canCalculateFinal ? toPercent(finalScoreValue) : 0;
  const gradeInfo: GradeInfo | null = canCalculateFinal ? scoreToGPA(finalScoreValue) : null;

  // Count total filled scores
  const allSheets = ratersData.flatMap((r: RaterData) => [r.sheet1, r.sheet2]);
  const filledCount = countFilledScores(allSheets);

  return (
    <div className="summary-section">
      <div className="summary-header">
        <h2>ສະຫຼຸບຜົນການປະເມີນ</h2>
        <div className="progress-info">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(filledCount / 114) * 100}%` }}
            ></div>
          </div>
          <span>ກອກແລ້ວ {filledCount}/114 ຂໍ້</span>
        </div>
      </div>

      {/* Student Information Display */}
      {(studentData.name || studentData.studentId) && (
        <div className="student-info-display">
          <h3>ຂໍ້ມູນຜົນການປະເມີນ</h3>
          <div className="info-grid">
            {studentData.name && <div><strong>ຊື່-ນາມສະກຸນ:</strong> {studentData.name}</div>}
            {studentData.studentId && <div><strong>ລະຫັດນັກສຶກສາ:</strong> {studentData.studentId}</div>}
            {studentData.department && <div><strong>ສາຂາວິຊາ:</strong> {studentData.department}</div>}
            {studentData.thesisTitle && <div><strong>ຫົວຂໍ້ບົດຈົບຊັ້ນ:</strong> {studentData.thesisTitle}</div>}
          </div>
        </div>
      )}

      {/* Raters Comparison Table */}
      <div className="comparison-table">
        <h3>ປຽບທຽບຄະແນນກຳມະການ</h3>
        <table>
          <thead>
            <tr>
              <th>ກຳມະການ</th>
              <th>ສະເລ່ຍເອກະສານ 1</th>
              <th>ສະເລ່ຍເອກະສານ 2</th>
              <th>ຄະແນນລວມ</th>
              <th>ສະຖານະ</th>
            </tr>
          </thead>
          <tbody>
            {raterResults.map((rater: RaterResult, index: number) => (
              <tr key={index} className={rater.isComplete ? 'complete' : 'incomplete'}>
                <td>{rater.name}</td>
                <td>{rater.isComplete ? roundForDisplay(rater.sheet1Avg, 2) : '-.--'}</td>
                <td>{rater.isComplete ? roundForDisplay(rater.sheet2Avg, 2) : '-.--'}</td>
                <td>{rater.isComplete ? roundForDisplay(rater.weightedScore, 2) : '-.--'}</td>
                <td>
                  <span className={`status-badge ${rater.isComplete ? 'complete' : 'incomplete'}`}>
                    {rater.isComplete ? '✅ ສົມບູນ' : '❌ ບໍ່ສົມບູນ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final Score */}
      <div className="final-score">
        <h3>ຄະແນນສຸດທ້າຍ</h3>
        {canCalculateFinal ? (
          <div className="score-display">
            <div className="score-item">
              <span className="score-label">ຄະແນນເຕັມ 5:</span>
              <span className="score-value">{roundForDisplay(finalScoreValue, 2)}</span>
            </div>
            <div className="score-item">
              <span className="score-label">ຄະແນນເປີເຊັນ:</span>
              <span className="score-value">{roundForDisplay(percentScore, 2)}%</span>
            </div>
            <div className="score-item">
              <span className="score-label">ເກດ GPA:</span>
              <span className="score-value">{gradeInfo!.gpa} ({gradeInfo!.letterGrade})</span>
            </div>
            <div className="grade-meaning">
              <span className="meaning-text">{gradeInfo!.meaning}</span>
            </div>
            <div className="calculation-detail">
              <small>
                ຄຳນວນຈາກ: ({raterResults.map((r: RaterResult) => roundForDisplay(r.weightedScore, 2)).join(' + ')}) ÷ 3 = {roundForDisplay(finalScoreValue, 2)}
              </small>
            </div>
          </div>
        ) : (
          <div className="incomplete-message">
            <p>ກະລຸນາໃສ່ຂໍ້ມູນໃຫ້ຄົບທັງທັ້ງ 3 ກຳມະການເພື່ອທຳການຄຳນວນຄະແນນສຸກທ້າຍ</p>
            <p>ສະຖານະປັດຈຸບັນ: ກຳມະການທີ່ກອກສົມບູນ {completedRaters.length}/3 ທ່ານ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;