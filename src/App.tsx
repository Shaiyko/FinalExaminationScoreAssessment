import React, { useState, useEffect } from 'react';
import RaterCard from './components/RaterCard';
import Summary from './components/Summary';
import { Download, Upload, RotateCcw, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import './styles.css';

// Custom Alert Modal Component
const CustomAlert = ({ isOpen, type = 'success', title, message, onClose, showConfirm = false, onConfirm }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="alert-icon success" size={24} />;
      case 'error':
        return <AlertCircle className="alert-icon error" size={24} />;
      case 'confirm':
        return <AlertCircle className="alert-icon warning" size={24} />;
      default:
        return <CheckCircle className="alert-icon success" size={24} />;
    }
  };

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="alert-close" onClick={onClose}>
          <X size={18} />
        </button>
        
        <div className="alert-content">
          {getIcon()}
          <div className="alert-text">
            <h3 className="alert-title">{title}</h3>
            <p className="alert-message">{message}</p>
          </div>
        </div>
        
        <div className="alert-actions">
          {showConfirm ? (
            <>
              <button className="alert-btn cancel-btn" onClick={onClose}>
                ຍົກເລີກ
              </button>
              <button className="alert-btn confirm-btn" onClick={onConfirm}>
                ຢືນຢັນ
              </button>
            </>
          ) : (
            <button className="alert-btn ok-btn" onClick={onClose}>
              ຕົກລົງ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  // Initial data structure
  const initialRaterData = {
    sheet1: Array(14).fill(0),
    sheet2: Array(24).fill(0)
  };

  const [studentData, setStudentData] = useState({
    name: '',
    studentId: '',
    department: '',
    thesisTitle: ''
  });

  const [ratersData, setRatersData] = useState([
    { ...initialRaterData },
    { ...initialRaterData },
    { ...initialRaterData }
  ]);

  const [expandedRaters, setExpandedRaters] = useState([true, false, false]);

  // Alert state
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    showConfirm: false,
    onConfirm: null
  });

  // Auto-save to localStorage
  useEffect(() => {
    const dataToSave = {
      student: studentData,
      raters: ratersData
    };
    localStorage.setItem('thesisDefenseData', JSON.stringify(dataToSave));
  }, [studentData, ratersData]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('thesisDefenseData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.student) {
          setStudentData(parsed.student);
        }
        if (parsed.raters && parsed.raters.length === 3) {
          setRatersData(parsed.raters);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Alert helper functions
  const showAlert = (type, title, message, showConfirm = false, onConfirm = null) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      showConfirm,
      onConfirm
    });
  };

  const closeAlert = () => {
    setAlert({
      isOpen: false,
      type: 'success',
      title: '',
      message: '',
      showConfirm: false,
      onConfirm: null
    });
  };

  const handleConfirm = () => {
    if (alert.onConfirm) {
      alert.onConfirm();
    }
    closeAlert();
  };

  const handleStudentDataChange = (field, value) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRaterUpdate = (raterIndex, data) => {
    setRatersData(prev => {
      const newData = [...prev];
      newData[raterIndex] = data;
      return newData;
    });
  };

  const toggleRater = (raterIndex) => {
    setExpandedRaters(prev => {
      const newExpanded = [...prev];
      newExpanded[raterIndex] = !newExpanded[raterIndex];
      return newExpanded;
    });
  };

  const handleReset = () => {
    const resetData = () => {
      setStudentData({
        name: '',
        studentId: '',
        department: '',
        thesisTitle: ''
      });
      setRatersData([
        { ...initialRaterData },
        { ...initialRaterData },
        { ...initialRaterData }
      ]);
      localStorage.removeItem('thesisDefenseData');
      
      showAlert('success', 'ລີເຊັດສຳເລັດ', 'ຂໍ້ມູນທັງໝົດຖືກລີເຊັດແລ້ວ');
    };

    showAlert(
      'confirm',
      'ຢືນຢັນການລີເຊັດ',
      'ຕ້ອງການລີເຊັດຂໍ້ມູນທັງໝົດຫຼືບໍ່? ການດຳເນີນງານນີ້ບໍ່ສາມາດຍົກເລີກໄດ້',
      true,
      resetData
    );
  };

  const handleSaveJSON = () => {
    const dataToExport = {
      student: studentData,
      raters: ratersData.map((rater, index) => ({
        name: `ກຳມະການ #${index + 1}`,
        sheet1: rater.sheet1,
        sheet2: rater.sheet2
      }))
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentData.name}-${studentData.department}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showAlert('success', 'ບັນທຶກສຳເລັດ', 'ໄຟລ์ JSON ຖືກດາວໂຫລດແລ້ວ');
  };

  const handleLoadJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.student) {
          setStudentData(data.student);
        }
        
        if (data.raters && data.raters.length === 3) {
          const loadedRaters = data.raters.map(rater => ({
            sheet1: rater.sheet1 || Array(14).fill(0),
            sheet2: rater.sheet2 || Array(24).fill(0)
          }));
          setRatersData(loadedRaters);
        }
        
        showAlert('success', 'ໂຫຼດສຳເລັດ', 'ຂໍ້ມູນຖືກໂຫຼດເຂົ້າສູ່ລະບົບແລ້ວ');
      } catch (error) {
        showAlert('error', 'ຜິດພາດ', `ຟາຍ JSON ບໍ່ຖືກຕ້ອງ: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app">
      {/* Custom Alert Modal */}
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        showConfirm={alert.showConfirm}
        onClose={closeAlert}
        onConfirm={handleConfirm}
      />

      <div className="no-print">
        <header className="app-header">
          <div className="header-content">
            <h1>ລະບົບການຄຳນວນຄະແນນບົດຈົບຊັ້ນ</h1>
            <div className="header-controls">
              <button onClick={handleReset} className="control-btn reset-btn">
                <RotateCcw size={16} />
                ລີເຊັດ
              </button>
              <button onClick={handleSaveJSON} className="control-btn save-btn">
                <Download size={16} />
                ບັນທຶກ JSON
              </button>
              <label htmlFor="load-json" className="control-btn load-btn">
                <Upload size={16} />
                ໂຫຼດ JSON
                <input
                  id="load-json"
                  type="file"
                  accept=".json"
                  onChange={handleLoadJSON}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </header>

        {/* Student Information Form */}
        <section className="student-form">
          <h2>ຂໍ້ມູນຂອງຜູ້ປະເມີນ</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>ຊື່-ນາມສະກຸນ</label>
              <input
                type="text"
                value={studentData.name}
                onChange={(e) => handleStudentDataChange('name', e.target.value)}
                placeholder="ລະບຸຊື່-ນາມສະກຸນ"
              />
            </div>
            <div className="form-group">
              <label>ລະຫັດນັກສຶກສາ</label>
              <input
                type="text"
                value={studentData.studentId}
                onChange={(e) => handleStudentDataChange('studentId', e.target.value)}
                placeholder="ລະບຸນັກສຶກສາ"
              />
            </div>
            <div className="form-group">
              <label>ສາຂາວິຊາ</label>
              <input
                type="text"
                value={studentData.department}
                onChange={(e) => handleStudentDataChange('department', e.target.value)}
                placeholder="ລະບຸສາຂາວິຊາ"
              />
            </div>
            <div className="form-group full-width">
              <label>ຫົວຂໍ້ບົດຈົບຊັ້ນ</label>
              <input
                type="text"
                value={studentData.thesisTitle}
                onChange={(e) => handleStudentDataChange('thesisTitle', e.target.value)}
                placeholder="ລະບຸຫົວຂໍ້ບົດຈົບຊັ້ນ (ບໍ່ບັງຄັບ)"
              />
            </div>
          </div>
        </section>

        {/* Raters Section */}
        <section className="raters-section">
          <h2>ກຳມະການຜູ້ປະເມີນ</h2>
          {ratersData.map((rater, index) => (
            <RaterCard
              key={index}
              raterIndex={index}
              data={rater}
              onUpdate={handleRaterUpdate}
              isExpanded={expandedRaters[index]}
              onToggle={() => toggleRater(index)}
            />
          ))}
        </section>

        {/* Summary Section */}
        <Summary
          studentData={studentData}
          ratersData={ratersData}
          onPrint={handlePrint}
        />
      </div>

      {/* Print View */}
      <div className="print-only">
        <div className="print-header">
          <h1>ລາຍງານຜົນການປະເມີນບົດຈົບຊັ້ນ</h1>
          <p className="print-date">ວັນທີພິມ: {new Date().toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>

        {/* Print Student Info */}
        <div className="print-student-info">
          <h2>ຂໍ້ມູນຂອງຜູ້ປະເມີນ</h2>
          <div className="print-info-table">
            <div className="info-row">
              <span className="info-label">ຊື່-ນາມສະກຸນ:</span>
              <span className="info-value">{studentData.name || '-'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">ລະຫັດນັກສຶກສາ:</span>
              <span className="info-value">{studentData.studentId || '-'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">ສາຂາວິຊາ:</span>
              <span className="info-value">{studentData.department || '-'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">ຫົວຂໍ້ບົດຈົບຊັ້ນ:</span>
              <span className="info-value">{studentData.thesisTitle || '-'}</span>
            </div>
          </div>
        </div>

        {/* Print Summary (rendered by Summary component) */}
      </div>
    </div>
  );
};

export default App;