import { avg, weighted, roundForDisplay } from '../utils/calc';

// Type definitions
interface RaterData {
  sheet1: number[];
  sheet2: number[];
}

interface RaterCardProps {
  raterIndex: number;
  data: RaterData;
  onUpdate: (raterIndex: number, data: RaterData) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const RaterCard: React.FC<RaterCardProps> = ({ 
  raterIndex, 
  data, 
  onUpdate, 
  isExpanded, 
  onToggle 
}) => {
  const raterName = `ກຳມະການ #${raterIndex + 1}`;
  
  // Calculate live statistics - now including 0 as valid score (no points for that item)
  const sheet1Scores = data.sheet1.filter((score: number) => score >= 0 && score <= 5);
  const sheet2Scores = data.sheet2.filter((score: number) => score >= 0 && score <= 5);
  
  // Count zeros and non-zeros for each sheet
  const sheet1Zeros = data.sheet1.filter(score => score === 0).length;
  const sheet2Zeros = data.sheet2.filter(score => score === 0).length;
  const sheet1NonZeros = data.sheet1.filter(score => score >= 1 && score <= 5).length;
  const sheet2NonZeros = data.sheet2.filter(score => score >= 1 && score <= 5).length;
  
  const sheet1Sum = sheet1Scores.reduce((sum: number, score: number) => sum + score, 0);
  const sheet2Sum = sheet2Scores.reduce((sum: number, score: number) => sum + score, 0);
  
  // Calculate averages including zeros in the calculation
  const sheet1Avg = sheet1Scores.length === 14 ? avg(sheet1Scores) : 0;
  const sheet2Avg = sheet2Scores.length === 24 ? avg(sheet2Scores) : 0;
  
  const weightedScore = sheet1Scores.length === 14 && sheet2Scores.length === 24 
    ? weighted(sheet1Avg, sheet2Avg) 
    : 0;

  const handleScoreChange = (sheet: keyof RaterData, index: number, value: string) => {
    const score = value === '' ? 0 : parseInt(value);
    const newData = { ...data };
    newData[sheet][index] = score;
    onUpdate(raterIndex, newData);
  };

  const fillSheet = (sheet: keyof RaterData, value: number) => {
    const newData = { ...data };
    newData[sheet] = newData[sheet].map(() => value);
    onUpdate(raterIndex, newData);
  };

  const clearSheet = (sheet: keyof RaterData) => {
    const newData = { ...data };
    newData[sheet] = newData[sheet].map(() => 0);
    onUpdate(raterIndex, newData);
  };

  const renderScoreInput = (sheet: keyof RaterData, index: number) => {
    const score = data[sheet][index];
    const isValid = score >= 0 && score <= 5; // Now 0 is valid
    
    return (
      <input
        type="number"
        min="0"
        max="5"
        step="1"
        value={score === 0 ? '' : score}
        onChange={(e) => handleScoreChange(sheet, index, e.target.value)}
        className={`score-input ${!isValid ? 'invalid' : ''}`}
        placeholder="0-5"
      />
    );
  };

  const sheet1Complete = sheet1Scores.length === 14;
  const sheet2Complete = sheet2Scores.length === 24;
  const allComplete = sheet1Complete && sheet2Complete;

  // Count filled items (including zeros)
  const sheet1Filled = data.sheet1.filter(score => score >= 0 && score <= 5).length;
  const sheet2Filled = data.sheet2.filter(score => score >= 0 && score <= 5).length;
  const totalFilled = sheet1Filled + sheet2Filled;
  const totalZeros = sheet1Zeros + sheet2Zeros;
  const totalNonZeros = sheet1NonZeros + sheet2NonZeros;

  return (
    <div className={`rater-card ${allComplete ? 'complete' : ''}`}>
      <div className="rater-header" onClick={onToggle}>
        <h3>{raterName}</h3>
        <div className="rater-status">
          <span className="completion-badge">
            {totalFilled}/38 ຂໍ້
          </span>
          <span className="score-breakdown">
            ມີຄະແນນ: {totalNonZeros} | ຄະແນນ 0: {totalZeros}
          </span>
          {weightedScore > 0 && (
            <span className="weighted-score">
              ຄະແນນລວມ: {roundForDisplay(weightedScore, 2)}
            </span>
          )}
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {isExpanded && (
        <div className="rater-content">
          {/* Sheet 1 */}
          <div className="sheet-section">
            <div className="sheet-header">
              <h4>ແບບສອບຖາມ 1 (14 ຂໍ້) - ກວມເອົາ 35%</h4>
              <div className="sheet-stats">
                <span>ກອກແລ້ວ: {sheet1Filled}/14 ຂໍ້</span>
                <span>ມີຄະແນນ: {sheet1NonZeros} ຂໍ້</span>
                <span>ຄະແນນ 0: {sheet1Zeros} ຂໍ້</span>
              </div>
              <div className="sheet-controls">
                <button onClick={() => fillSheet('sheet1', 5)} className="fill-btn">ເຕັມ 5</button>
                <button onClick={() => fillSheet('sheet1', 4)} className="fill-btn">ເຕັມ 4</button>
                <button onClick={() => fillSheet('sheet1', 3)} className="fill-btn">ເຕັມ 3</button>
                <button onClick={() => fillSheet('sheet1', 0)} className="fill-btn">ເຕັມ 0</button>
                <button onClick={() => clearSheet('sheet1')} className="clear-btn">ລ້າງ</button>
              </div>
            </div>
            
            <div className="score-grid sheet1-grid">
              {Array.from({ length: 14 }, (_, i) => (
                <div key={i} className="score-item">
                  <label>ຂໍ້ {i + 1}</label>
                  {renderScoreInput('sheet1', i)}
                </div>
              ))}
            </div>

            <div className="sheet-summary">
              <div className="summary-row">
                <span>ຜົນລວມ: {sheet1Sum}/70 ({sheet1NonZeros} ຂໍ້ມີຄະແນນ, {sheet1Zeros} ຂໍ້ຄະແນນ 0)</span>
                <span>ຄ່າສະເລ່ຍ: {sheet1Complete ? roundForDisplay(sheet1Avg, 2) : '-.--'}</span>
                <span className="completion-status">
                  {sheet1Complete ? '✅ ສົມບູນ' : `❌ ເຫຼືອ ${14 - sheet1Filled} ຂໍ້`}
                </span>
              </div>
            </div>
          </div>

          {/* Sheet 2 */}
          <div className="sheet-section">
            <div className="sheet-header">
              <h4>ແບບສອບຖາມ 2 (24 ຂໍ້) - ກວມເອົາ 65%</h4>
              <div className="sheet-stats">
                <span>ກອກແລ້ວ: {sheet2Filled}/24 ຂໍ້</span>
                <span>ມີຄະແນນ: {sheet2NonZeros} ຂໍ້</span>
                <span>ຄະແນນ 0: {sheet2Zeros} ຂໍ້</span>
              </div>
              <div className="sheet-controls">
                <button onClick={() => fillSheet('sheet2', 5)} className="fill-btn">ເຕັມ 5</button>
                <button onClick={() => fillSheet('sheet2', 4)} className="fill-btn">ເຕັມ 4</button>
                <button onClick={() => fillSheet('sheet2', 3)} className="fill-btn">ເຕັມ 3</button>
                <button onClick={() => fillSheet('sheet2', 0)} className="fill-btn">ເຕັມ 0</button>
                <button onClick={() => clearSheet('sheet2')} className="clear-btn">ລ້าງ</button>
              </div>
            </div>
            
            <div className="score-grid sheet2-grid">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="score-item">
                  <label>ຂໍ້ {i + 1}</label>
                  {renderScoreInput('sheet2', i)}
                </div>
              ))}
            </div>

            <div className="sheet-summary">
              <div className="summary-row">
                <span>ຜົນລວມ: {sheet2Sum}/120 ({sheet2NonZeros} ຂໍ້ມີຄະແນນ, {sheet2Zeros} ຂໍ້ຄະແນນ 0)</span>
                <span>ຄ່າສະເລ່ຍ: {sheet2Complete ? roundForDisplay(sheet2Avg, 2) : '-.--'}</span>
                <span className="completion-status">
                  {sheet2Complete ? '✅ ສົມບູນ' : `❌ ເຫຼືອ ${24 - sheet2Filled} ຂໍ້`}
                </span>
              </div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="overall-stats">
            <h5>ສະຖິຕິລວມ {raterName}</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">ກອກແລ້ວທັງຫມົດ:</span>
                <span className="stat-value">{totalFilled}/38 ຂໍ້ ({Math.round((totalFilled/38)*100)}%)</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ມີຄະແນນ (1-5):</span>
                <span className="stat-value">{totalNonZeros} ຂໍ້</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ຄະແນນ 0:</span>
                <span className="stat-value">{totalZeros} ຂໍ້</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ຍັງບໍ່ໄດ້ກອກ:</span>
                <span className="stat-value">{38 - totalFilled} ຂໍ້</span>
              </div>
            </div>
          </div>

          {/* Weighted Score */}
          <div className="weighted-summary">
            <div className="calculation-formula">
              ສູດ: (ສະເລ່ຍເອກະສານ 1 × 0.35) + (ສະເລ່ຍເອກະສານ 2 × 0.65)
            </div>
            <div className="calculation-details">
              {allComplete ? (
                <div>
                  ({roundForDisplay(sheet1Avg, 2)} × 0.35) + ({roundForDisplay(sheet2Avg, 2)} × 0.65) = {roundForDisplay(weightedScore, 2)}
                </div>
              ) : (
                <div>ລໍຖ້າຂໍ້ມູນໃຫ້ຄົບ</div>
              )}
            </div>
            <div className="weighted-result">
              <strong>ຄະແນນລວມກວມເອົາຂອງ{raterName}: {
                allComplete ? roundForDisplay(weightedScore, 2) : 'ລໍຖ້າຂໍ້ມູນໃຫ້ຄົບ'
              }</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaterCard;