import { useState, useEffect } from 'react';
import RaterCard from './components/RaterCard.tsx';
import Summary from './components/Summary.tsx';
import { Download, Upload, RotateCcw, CheckCircle, AlertCircle, X, FileDown } from 'lucide-react';
import './styles.css';

// Type definitions
interface Department {
  id: number;
  name: string;
  short: string;
  icon: string;
}

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

interface AlertState {
  isOpen: boolean;
  type: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  showConfirm: boolean;
  onConfirm: (() => void) | null;
}

interface CustomAlertProps {
  isOpen: boolean;
  type?: 'success' | 'error' | 'confirm';
  title: string;
  message: string;
  onClose: () => void;
  showConfirm?: boolean;
  onConfirm?: () => void;
}

interface PDFOption {
  id: string;
  title: string;
  filename: string;
}

interface PDFSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: PDFOption) => void;
}

// Custom Alert Modal Component
const CustomAlert: React.FC<CustomAlertProps> = ({ 
  isOpen, 
  type = 'success', 
  title, 
  message, 
  onClose, 
  showConfirm = false, 
  onConfirm 
}) => {
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

// PDF Selection Modal Component
const PDFSelectionModal: React.FC<PDFSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const pdfOptions: PDFOption[] = [
    {
      id: 'committee-record',
      title: 'ບັດບັນທຶກການປ້ອງກັນຈົບຊັ້ນປະລິນຍາຕີຂອງອານຸກຳມະການ',
      filename: 'ບັດບັນທຶກການປ້ອງກັນຈົບຊັ້ນປະລິນຍາຕີຂອງອານຸກຳມະການ.pdf'
    },
    {
      id: 'defense-scoring',
      title: 'ການໃຫ້ຄະແນນປ້ອງກັນບົດຈົບຊັ້ນ',
      filename: 'ການໃຫ້ຄະແນນປ້ອງກັນບົດຈົບຊັ້ນ.pdf'
    },
    {
      id: 'evaluation-scoring',
      title: 'ການປະເມີນແລະໃຫ້ຄະແນນປ້ອງກັນບົດຈົບຊັ້ນ',
      filename: 'ການປະເມີນແລະໃຫ້ຄະແນນປ້ອງກັນບົດຈົບຊັ້ນ.pdf'
    }
  ];

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 relative shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button className="alert-close" onClick={onClose}>
          <X size={18} />
        </button>
        
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">ເລືອກແບບຟອມ PDF</h3>
          <p className="text-gray-600 mb-6 text-sm">ກະລຸນາເລືອກແບບຟອມ PDF ທີ່ຕ້ອງການດາວໂຫລດ</p>
          
          <div className="flex flex-col gap-3">
            {pdfOptions.map((option) => (
              <button
                key={option.id}
                className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg cursor-pointer transition-all duration-200 text-sm text-left hover:bg-slate-200 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => onSelect(option)}
              >
                <FileDown size={20} />
                <span>{option.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // Department data
  const departments: Department[] = [
    {
      id: 1,
      name: "ສາຂາການບໍລິຫານສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດຕໍ່ເນື່ອງ",
      short: "ບໍລິຫານທຸລະກິດ",
      icon: "💼",
    },
    {
      id: 2,
      name: "ສາຂາວິຊາ ການຄ້າເອເລັກໂຕນິກ (ຄອມພິວເຕອທຸລະກິດ)",
      short: "E-Commerce",
      icon: "💻",
    },
    {
      id: 3,
      name: "ສາຂາວິຊາ ຜູ້ປະກອບການ",
      short: "ຜູ້ປະກອບການ",
      icon: "🚀",
    },
    {
      id: 4,
      name: "ສາຂາວິຊາ ພາສາອັງກິດ",
      short: "ພາສາອັງກິດ",
      icon: "🇬🇧",
    },
    {
      id: 5,
      name: "ສາຂາວິຊາ ວິຊະວະກຳຊອບແວ",
      short: "ວິຊະວະກຳຊອບແວ",
      icon: "⚙️",
    },
    {
      id: 6,
      name: "ສາຂາວິຊາ ບໍລິຫານ ທຸລະກິດ",
      short: "ບໍລິຫານ",
      icon: "📊",
    },
    {
      id: 7,
      name: "ສາຂາວິຊາ ພາສາອັງກິດຕໍ່ເນື່ອງ",
      short: "ພາສາອັງກິດຕໍ່ເນື່ອງ",
      icon: "🌐",
    },
  ];

  // Initial data structure
  const initialRaterData: RaterData = {
    sheet1: Array(14).fill(0),
    sheet2: Array(24).fill(0)
  };

  const [studentData, setStudentData] = useState<StudentData>({
    name: '',
    studentId: '',
    department: '',
    thesisTitle: ''
  });

  const [ratersData, setRatersData] = useState<RaterData[]>([
    { ...initialRaterData },
    { ...initialRaterData },
    { ...initialRaterData }
  ]);

  const [expandedRaters, setExpandedRaters] = useState<boolean[]>([true, false, false]);

  // Alert state
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    showConfirm: false,
    onConfirm: null
  });

  // PDF Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);

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
  const showAlert = (
    type: 'success' | 'error' | 'confirm', 
    title: string, 
    message: string, 
    showConfirm: boolean = false, 
    onConfirm: (() => void) | null = null
  ) => {
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

  const handleStudentDataChange = (field: keyof StudentData, value: string) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRaterUpdate = (raterIndex: number, data: RaterData) => {
    setRatersData(prev => {
      const newData = [...prev];
      newData[raterIndex] = data;
      return newData;
    });
  };

  const toggleRater = (raterIndex: number) => {
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

  const handleLoadJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target?.result) return;
        const data = JSON.parse(e.target.result as string);
        
        if (data.student) {
          setStudentData(data.student);
        }
        
        if (data.raters && data.raters.length === 3) {
          const loadedRaters = data.raters.map((rater: any) => ({
            sheet1: rater.sheet1 || Array(14).fill(0),
            sheet2: rater.sheet2 || Array(24).fill(0)
          }));
          setRatersData(loadedRaters);
        }
        
        showAlert('success', 'ໂຫຼດສຳເລັດ', 'ຂໍ້ມູນຖືກໂຫຼດເຂົ້າສູ່ລະບົບແລ້ວ');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showAlert('error', 'ຜິດພາດ', `ຟາຍ JSON ບໍ່ຖືກຕ້ອງ: ${errorMessage}`);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePDFDownload = () => {
    setPdfModalOpen(true);
  };

  const handlePDFSelect = (selectedPDF: PDFOption) => {
    // ปิด modal ก่อน
    setPdfModalOpen(false);
    
    // สร้าง path ไปยังไฟล์ PDF ใน src/pdf folder
    const pdfPath = `/src/pdf/${selectedPDF.filename}`;
    
    // ตรวจสอบว่าไฟล์มีอยู่หรือไม่ แล้วดาวน์โหลด
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = selectedPDF.filename;
    link.target = '_blank'; // เปิดในแท็บใหม่หากไม่สามารถดาวน์โหลดได้
    
    // ลองดาวน์โหลดไฟล์
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // แสดงข้อความยืนยัน
    showAlert('success', 'ດາວໂຫລດ PDF', `ໄຟລ์ ${selectedPDF.title} ຖືກດາວໂຫລດແລ້ວ`);
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

      {/* PDF Selection Modal */}
      <PDFSelectionModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        onSelect={handlePDFSelect}
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
              <button onClick={handlePDFDownload} className="control-btn pdf-btn bg-emerald-600 hover:bg-emerald-700">
                <FileDown size={16} />
                ດາວໂຫລດ PDF ແບບສອບຖາມທີ່ໃຊ້ໃນການປະເມີນ
              </button>
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
              <select
                value={studentData.department}
                onChange={(e) => handleStudentDataChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">ເລືອກສາຂາວິຊາ</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.short}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
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