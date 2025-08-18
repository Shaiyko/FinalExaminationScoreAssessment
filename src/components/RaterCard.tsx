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
  
  // Calculate live statistics
  const sheet1Scores = data.sheet1.filter((score: number) => score >= 1 && score <= 5);
  const sheet2Scores = data.sheet2.filter((score: number) => score >= 1 && score <= 5);
  
  const sheet1Sum = sheet1Scores.reduce((sum: number, score: number) => sum + score, 0);
  const sheet2Sum = sheet2Scores.reduce((sum: number, score: number) => sum + score, 0);
  
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
    const isValid = score >= 1 && score <= 5;
    
    return (
      <input
        type="number"
        min="1"
        max="5"
        step="1"
        value={score || ''}
        onChange={(e) => handleScoreChange(sheet, index, e.target.value)}
        className={`score-input ${!isValid && score !== 0 ? 'invalid' : ''}`}
        placeholder="1-5"
      />
    );
  };

  const sheet1Complete = sheet1Scores.length === 14;
  const sheet2Complete = sheet2Scores.length === 24;
  const allComplete = sheet1Complete && sheet2Complete;

  return (
    <div className={`rater-card ${allComplete ? 'complete' : ''}`}>
      <div className="rater-header" onClick={onToggle}>
        <h3>{raterName}</h3>
        <div className="rater-status">
          <span className="completion-badge">
            {sheet1Scores.length + sheet2Scores.length}/38 ຂໍ້
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
              <div className="sheet-controls">
                <button onClick={() => fillSheet('sheet1', 5)} className="fill-btn">ເຕັມ 5</button>
                <button onClick={() => fillSheet('sheet1', 4)} className="fill-btn">ເຕັມ 4</button>
                <button onClick={() => fillSheet('sheet1', 3)} className="fill-btn">ເຕັມ 3</button>
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
                <span>ຜົນລວມ: {sheet1Sum}/70</span>
                <span>ຄ່າສະເລ່ຍ: {sheet1Complete ? roundForDisplay(sheet1Avg, 2) : '-.--'}</span>
                <span className="completion-status">
                  {sheet1Complete ? '✅ ສົມບູນ' : `❌ ເຫຼືອ ${14 - sheet1Scores.length} ຂໍ້`}
                </span>
              </div>
            </div>
          </div>

          {/* Sheet 2 */}
          <div className="sheet-section">
            <div className="sheet-header">
              <h4>ແບບສອບຖາມ 2 (24 ຂໍ້) - ກວມເອົາ 65%</h4>
              <div className="sheet-controls">
                <button onClick={() => fillSheet('sheet2', 5)} className="fill-btn">ເຕັມ 5</button>
                <button onClick={() => fillSheet('sheet2', 4)} className="fill-btn">ເຕັມ 4</button>
                <button onClick={() => fillSheet('sheet2', 3)} className="fill-btn">ເຕັມ 3</button>
                <button onClick={() => clearSheet('sheet2')} className="clear-btn">ລ້າງ</button>
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
                <span>ຜົນລວມ: {sheet2Sum}/120</span>
                <span>ຄ່າສະເລ່ຍ: {sheet2Complete ? roundForDisplay(sheet2Avg, 2) : '-.--'}</span>
                <span className="completion-status">
                  {sheet2Complete ? '✅ ສົມບູນ' : `❌ ເຫຼືອ ${24 - sheet2Scores.length} ຂໍ້`}
                </span>
              </div>
            </div>
          </div>

          {/* Weighted Score */}
          <div className="weighted-summary">
            <div className="calculation-formula">
              ສູດ: (ສະເລ່ຍເອກະສານ 1 × 0.35) + (ສະເລ່ຍເອກະສານ 2 × 0.65)
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