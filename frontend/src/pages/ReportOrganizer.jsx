import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Activity,
  ChevronRight,
  X,
} from 'lucide-react';

/* ───────────────── MOCK DATA ───────────────── */
const MOCK_REPORTS = [
  {
    _id: '1',
    reportType: 'Complete Blood Count (CBC)',
    reportDate: '2025-05-10',
    createdAt: '2025-05-10',
    abnormalCount: 2,
    summary:
      'Haemoglobin slightly below range, WBC elevated — may indicate mild anaemia with an inflammatory response. Recommend repeat in 4 weeks.',
    extractedData: [
      {
        testName: 'Haemoglobin',
        value: '10.8',
        unit: 'g/dL',
        referenceRange: '13.5–17.5',
        normalRangeMin: 13.5,
        normalRangeMax: 17.5,
      },
      {
        testName: 'WBC Count',
        value: '12.4',
        unit: '×10³/µL',
        referenceRange: '4.0–11.0',
        normalRangeMin: 4.0,
        normalRangeMax: 11.0,
      },
      {
        testName: 'Platelets',
        value: '245',
        unit: '×10³/µL',
        referenceRange: '150–400',
        normalRangeMin: 150,
        normalRangeMax: 400,
      },
      {
        testName: 'RBC Count',
        value: '4.9',
        unit: '×10⁶/µL',
        referenceRange: '4.5–5.5',
        normalRangeMin: 4.5,
        normalRangeMax: 5.5,
      },
    ],
  },
  {
    _id: '2',
    reportType: 'Lipid Panel',
    reportDate: '2025-04-01',
    createdAt: '2025-04-01',
    abnormalCount: 1,
    summary:
      'LDL cholesterol mildly elevated. Dietary modification advised. HDL levels are favourable.',
    extractedData: [
      {
        testName: 'Total Cholesterol',
        value: '218',
        unit: 'mg/dL',
        referenceRange: '<200',
        normalRangeMin: 0,
        normalRangeMax: 200,
      },
      {
        testName: 'LDL Cholesterol',
        value: '148',
        unit: 'mg/dL',
        referenceRange: '<130',
        normalRangeMin: 0,
        normalRangeMax: 130,
      },
      {
        testName: 'HDL Cholesterol',
        value: '62',
        unit: 'mg/dL',
        referenceRange: '>40',
        normalRangeMin: 40,
        normalRangeMax: 200,
      },
    ],
  },
];

/* ───────────────── HELPERS ───────────────── */
const getStatus = (value, min, max) => {
  const v = parseFloat(value);

  if (v < min) return 'low';
  if (v > max) return 'high';

  return 'normal';
};

const getBarPercent = (value, min, max) => {
  const v = parseFloat(value);
  const range = max - min;

  if (range <= 0) return 50;

  return Math.min(Math.max(((v - min) / range) * 100, 0), 100);
};

/* ───────────────── STATUS PILL ───────────────── */
const StatusPill = ({ status }) => {
  const styles = {
    normal: {
      bg: 'rgba(16,185,129,.15)',
      color: '#10b981',
      text: 'Normal',
    },
    high: {
      bg: 'rgba(245,158,11,.15)',
      color: '#f59e0b',
      text: 'High',
    },
    low: {
      bg: 'rgba(239,68,68,.15)',
      color: '#ef4444',
      text: 'Low',
    },
  };

  const s = styles[status];

  return (
    <span
      style={{
        padding: '4px 10px',
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      {s.text}
    </span>
  );
};

/* ───────────────── RANGE BAR ───────────────── */
const RangeBar = ({ value, min, max, status }) => {
  const pct = getBarPercent(value, min, max);

  const color =
    status === 'normal'
      ? '#10b981'
      : status === 'high'
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div
      style={{
        width: 90,
        height: 5,
        background: 'rgba(255,255,255,.08)',
        borderRadius: 999,
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: -3,
          left: `${pct}%`,
          transform: 'translateX(-50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );
};

/* ───────────────── MAIN COMPONENT ───────────────── */
export default function ReportOrganizer() {
  const [activeTab, setActiveTab] = useState('upload');
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.background = '#090d14';
  }, []);

  const totalAbnormal = reports.reduce(
    (sum, report) => sum + report.abnormalCount,
    0
  );

  const handleFileSelect = (file) => {
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSelectedFile(null);
      setPreview(null);
      setActiveTab('history');
    }, 2200);
  };

  const openReport = (report) => {
    setSelectedReport(report);
    setActiveTab('details');
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500;700&display=swap');

    *{
      box-sizing:border-box;
    }

    body{
      margin:0;
      overflow-x:hidden;
    }

    .ro-wrap{
      min-height:100vh;
      background:#090d14;
      color:#f1f5f9;
      font-family:'DM Sans',sans-serif;
      padding:40px 20px 80px;
    }

    .ro-inner{
      max-width:1100px;
      margin:0 auto;
    }

    .ro-header{
      margin-bottom:40px;
    }

    .ro-title{
      font-family:'Syne',sans-serif;
      font-size:clamp(32px,6vw,52px);
      font-weight:800;
      margin-bottom:10px;
      line-height:1;
    }

    .ro-title span{
      color:#38bdf8;
    }

    .ro-sub{
      color:#64748b;
      font-size:15px;
      max-width:700px;
    }

    .ro-stats{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
      gap:14px;
      margin-top:28px;
    }

    .ro-stat{
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      padding:18px;
      border-radius:18px;
      backdrop-filter:blur(10px);
    }

    .ro-stat h3{
      margin:0;
      font-size:28px;
      font-family:'Syne',sans-serif;
    }

    .ro-stat p{
      margin-top:6px;
      color:#64748b;
      font-size:13px;
    }

    .ro-tabs{
      display:flex;
      gap:10px;
      margin-bottom:24px;
      flex-wrap:wrap;
    }

    .ro-tab{
      padding:10px 18px;
      border:none;
      border-radius:12px;
      cursor:pointer;
      background:rgba(255,255,255,.05);
      color:#94a3b8;
      transition:.25s;
      font-weight:600;
    }

    .ro-tab.active{
      background:#38bdf8;
      color:#0f172a;
    }

    .ro-card{
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      border-radius:24px;
      padding:28px;
      backdrop-filter:blur(14px);
    }

    .ro-upload{
      border:2px dashed rgba(56,189,248,.25);
      border-radius:20px;
      padding:50px 24px;
      text-align:center;
      cursor:pointer;
      transition:.25s;
    }

    .ro-upload.over,
    .ro-upload:hover{
      border-color:#38bdf8;
      background:rgba(56,189,248,.05);
    }

    .ro-btn{
      margin-top:20px;
      width:100%;
      padding:14px;
      border:none;
      border-radius:14px;
      background:linear-gradient(135deg,#0ea5e9,#38bdf8);
      color:#0f172a;
      font-weight:700;
      cursor:pointer;
      transition:.25s;
      font-size:15px;
    }

    .ro-btn:hover{
      transform:translateY(-2px);
    }

    .ro-btn:disabled{
      opacity:.5;
      cursor:not-allowed;
    }

    .ro-report{
      display:flex;
      align-items:center;
      gap:16px;
      padding:18px;
      border-radius:18px;
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.06);
      margin-bottom:12px;
      cursor:pointer;
      transition:.25s;
    }

    .ro-report:hover{
      transform:translateX(4px);
      border-color:rgba(255,255,255,.12);
    }

    .ro-report-title{
      font-weight:700;
      margin-bottom:4px;
    }

    .ro-report-date{
      font-size:12px;
      color:#64748b;
    }

    .ro-table-wrap{
      overflow-x:auto;
    }

    .ro-table{
      width:100%;
      border-collapse:collapse;
      min-width:700px;
    }

    .ro-table th{
      text-align:left;
      padding:14px;
      font-size:12px;
      color:#64748b;
      border-bottom:1px solid rgba(255,255,255,.08);
    }

    .ro-table td{
      padding:16px 14px;
      border-bottom:1px solid rgba(255,255,255,.05);
    }

    .ro-summary{
      margin-top:24px;
      padding:20px;
      border-radius:18px;
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
    }

    .ro-back{
      margin-bottom:18px;
      background:none;
      border:none;
      color:#94a3b8;
      cursor:pointer;
      font-size:13px;
    }

    @media(max-width:768px){
      .ro-card{
        padding:20px;
      }

      .ro-upload{
        padding:40px 16px;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>

      <div className="ro-wrap">
        <div className="ro-inner">

          {/* HEADER */}
          <div className="ro-header">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 14,
                color: '#38bdf8',
              }}
            >
              <Activity size={18} />
              <span style={{ fontSize: 13, letterSpacing: 1 }}>
                HEALTH INTELLIGENCE
              </span>
            </div>

            <h1 className="ro-title">
              Medical <span>Report</span> Organizer
            </h1>

            <p className="ro-sub">
              Upload and analyse medical reports with smart abnormality
              detection and modern health analytics UI.
            </p>

            <div className="ro-stats">
              <div className="ro-stat">
                <h3>{reports.length}</h3>
                <p>Total Reports</p>
              </div>

              <div className="ro-stat">
                <h3 style={{ color: '#ef4444' }}>
                  {totalAbnormal}
                </h3>
                <p>Abnormal Results</p>
              </div>

              <div className="ro-stat">
                <h3 style={{ color: '#10b981' }}>
                  {reports.filter((r) => r.abnormalCount === 0).length}
                </h3>
                <p>Healthy Reports</p>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="ro-tabs">
            <button
              className={`ro-tab ${
                activeTab === 'upload' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>

            <button
              className={`ro-tab ${
                activeTab === 'history' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>

            {selectedReport && (
              <button
                className={`ro-tab ${
                  activeTab === 'details' ? 'active' : ''
                }`}
              >
                Details
              </button>
            )}
          </div>

          {/* UPLOAD */}
          {activeTab === 'upload' && (
            <div className="ro-card">
              <div
                className={`ro-upload ${dragOver ? 'over' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileSelect(e.dataTransfer.files[0]);
                }}
                onClick={() =>
                  document.getElementById('report-file').click()
                }
              >
                <input
                  id="report-file"
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  onChange={(e) =>
                    handleFileSelect(e.target.files[0])
                  }
                />

                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 260,
                        borderRadius: 16,
                        marginBottom: 18,
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      <CheckCircle size={15} color="#10b981" />

                      <span
                        style={{
                          fontSize: 13,
                          color: '#10b981',
                        }}
                      >
                        {selectedFile?.name}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload
                      size={44}
                      color="#38bdf8"
                      style={{ marginBottom: 18 }}
                    />

                    <h3
                      style={{
                        marginBottom: 8,
                        fontSize: 22,
                      }}
                    >
                      Drop Medical Report
                    </h3>

                    <p style={{ color: '#64748b' }}>
                      JPG, PNG, PDF supported
                    </p>
                  </>
                )}
              </div>

              <button
                className="ro-btn"
                disabled={!selectedFile || loading}
                onClick={handleUpload}
              >
                {loading ? 'Analysing Report...' : 'Analyse Report'}
              </button>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === 'history' && (
            <div>
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="ro-report"
                  onClick={() => openReport(report)}
                >
                  <div>
                    {report.abnormalCount > 0 ? (
                      <AlertTriangle color="#ef4444" />
                    ) : (
                      <CheckCircle color="#10b981" />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="ro-report-title">
                      {report.reportType}
                    </div>

                    <div className="ro-report-date">
                      {new Date(
                        report.reportDate
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <ChevronRight color="#64748b" />
                </div>
              ))}
            </div>
          )}

          {/* DETAILS */}
          {activeTab === 'details' && selectedReport && (
            <div>
              <button
                className="ro-back"
                onClick={() => setActiveTab('history')}
              >
                ← Back to History
              </button>

              <div className="ro-card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 20,
                    flexWrap: 'wrap',
                    marginBottom: 28,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: 28,
                        marginBottom: 6,
                      }}
                    >
                      {selectedReport.reportType}
                    </h2>

                    <p style={{ color: '#64748b' }}>
                      {new Date(
                        selectedReport.reportDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    className="ro-tab active"
                    style={{
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onClick={() => {
                      const blob = new Blob(
                        [
                          JSON.stringify(
                            selectedReport,
                            null,
                            2
                          ),
                        ],
                        { type: 'application/json' }
                      );

                      const url =
                        URL.createObjectURL(blob);

                      const a =
                        document.createElement('a');

                      a.href = url;
                      a.download = 'report.json';
                      a.click();
                    }}
                  >
                    <Download size={14} />
                    Export
                  </button>
                </div>

                {selectedReport.abnormalCount > 0 && (
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      background:
                        'rgba(239,68,68,.08)',
                      border:
                        '1px solid rgba(239,68,68,.2)',
                      marginBottom: 24,
                      display: 'flex',
                      gap: 10,
                      alignItems: 'center',
                    }}
                  >
                    <AlertTriangle
                      size={18}
                      color="#ef4444"
                    />

                    <p
                      style={{
                        margin: 0,
                        color: '#fca5a5',
                      }}
                    >
                      {selectedReport.abnormalCount}{' '}
                      abnormal values detected.
                    </p>
                  </div>
                )}

                <div className="ro-table-wrap">
                  <table className="ro-table">
                    <thead>
                      <tr>
                        <th>Test</th>
                        <th>Value</th>
                        <th>Reference</th>
                        <th>Range</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedReport.extractedData.map(
                        (test, idx) => {
                          const status = getStatus(
                            test.value,
                            test.normalRangeMin,
                            test.normalRangeMax
                          );

                          return (
                            <tr key={idx}>
                              <td>{test.testName}</td>

                              <td>
                                <span
                                  style={{
                                    color:
                                      status === 'normal'
                                        ? '#10b981'
                                        : status === 'high'
                                        ? '#f59e0b'
                                        : '#ef4444',
                                  }}
                                >
                                  {test.value}
                                </span>{' '}
                                <span
                                  style={{
                                    color: '#64748b',
                                    fontSize: 12,
                                  }}
                                >
                                  {test.unit}
                                </span>
                              </td>

                              <td>
                                {test.referenceRange}
                              </td>

                              <td>
                                <RangeBar
                                  value={test.value}
                                  min={
                                    test.normalRangeMin
                                  }
                                  max={
                                    test.normalRangeMax
                                  }
                                  status={status}
                                />
                              </td>

                              <td>
                                <StatusPill
                                  status={status}
                                />
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="ro-summary">
                  <h4
                    style={{
                      marginBottom: 10,
                      fontSize: 16,
                    }}
                  >
                    Clinical Summary
                  </h4>

                  <p
                    style={{
                      color: '#94a3b8',
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedReport.summary}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}