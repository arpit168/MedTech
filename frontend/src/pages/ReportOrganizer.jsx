import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Download, Activity, ChevronRight, X, Minus } from 'lucide-react';

/* ─── MOCK DATA ──────────────────────────────────────────────── */
const MOCK_REPORTS = [
  {
    _id: '1',
    reportType: 'Complete Blood Count (CBC)',
    reportDate: '2025-05-10',
    createdAt: '2025-05-10',
    abnormalCount: 2,
    summary: 'Haemoglobin slightly below range, WBC elevated — may indicate mild anaemia with an inflammatory response. Recommend repeat in 4 weeks.',
    extractedData: [
      { testName: 'Haemoglobin', value: '10.8', unit: 'g/dL', referenceRange: '13.5–17.5', normalRangeMin: 13.5, normalRangeMax: 17.5, severity: 'Mild' },
      { testName: 'WBC Count', value: '12.4', unit: '×10³/µL', referenceRange: '4.0–11.0', normalRangeMin: 4.0, normalRangeMax: 11.0, severity: 'Moderate' },
      { testName: 'Platelets', value: '245', unit: '×10³/µL', referenceRange: '150–400', normalRangeMin: 150, normalRangeMax: 400, severity: null },
      { testName: 'RBC Count', value: '4.9', unit: '×10⁶/µL', referenceRange: '4.5–5.5', normalRangeMin: 4.5, normalRangeMax: 5.5, severity: null },
    ]
  },
  {
    _id: '2',
    reportType: 'Lipid Panel',
    reportDate: '2025-04-01',
    createdAt: '2025-04-01',
    abnormalCount: 1,
    summary: 'LDL cholesterol mildly elevated. Dietary modification advised. HDL levels are favourable.',
    extractedData: [
      { testName: 'Total Cholesterol', value: '218', unit: 'mg/dL', referenceRange: '<200', normalRangeMin: 0, normalRangeMax: 200, severity: 'Mild' },
      { testName: 'LDL Cholesterol', value: '148', unit: 'mg/dL', referenceRange: '<130', normalRangeMin: 0, normalRangeMax: 130, severity: 'Mild' },
      { testName: 'HDL Cholesterol', value: '62', unit: 'mg/dL', referenceRange: '>40', normalRangeMin: 40, normalRangeMax: 200, severity: null },
      { testName: 'Triglycerides', value: '120', unit: 'mg/dL', referenceRange: '<150', normalRangeMin: 0, normalRangeMax: 150, severity: null },
    ]
  },
  {
    _id: '3',
    reportType: 'Thyroid Function Test',
    reportDate: '2025-02-15',
    createdAt: '2025-02-15',
    abnormalCount: 0,
    summary: 'All thyroid markers within normal physiological range. No intervention required.',
    extractedData: [
      { testName: 'TSH', value: '2.1', unit: 'mIU/L', referenceRange: '0.4–4.0', normalRangeMin: 0.4, normalRangeMax: 4.0, severity: null },
      { testName: 'Free T4', value: '1.2', unit: 'ng/dL', referenceRange: '0.8–1.8', normalRangeMin: 0.8, normalRangeMax: 1.8, severity: null },
      { testName: 'Free T3', value: '3.1', unit: 'pg/mL', referenceRange: '2.3–4.2', normalRangeMin: 2.3, normalRangeMax: 4.2, severity: null },
    ]
  }
];

/* ─── HELPERS ────────────────────────────────────────────────── */
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
  const pct = ((v - min) / range) * 100;
  return Math.min(Math.max(pct, 0), 100);
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
const StatusPill = ({ status }) => {
  const map = {
    normal: { label: 'Normal', bg: 'rgba(16,185,129,.15)', color: '#10b981', dot: '#10b981' },
    high:   { label: 'High',   bg: 'rgba(245,158,11,.15)', color: '#f59e0b', dot: '#f59e0b' },
    low:    { label: 'Low',    bg: 'rgba(239,68,68,.15)',  color: '#ef4444', dot: '#ef4444' },
  };
  const s = map[status] || map.normal;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 20, background: s.bg,
      color: s.color, fontSize: 11, fontWeight: 700, letterSpacing: '.5px',
      textTransform: 'uppercase', fontFamily: 'DM Mono, monospace',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

const RangeBar = ({ value, min, max, status }) => {
  const pct = getBarPercent(value, min, max);
  const color = status === 'normal' ? '#10b981' : status === 'high' ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 2, width: 80 }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`, background: color, borderRadius: 2,
        transition: 'width .6s cubic-bezier(.4,0,.2,1)',
      }} />
      <div style={{
        position: 'absolute', top: -2, width: 8, height: 8, borderRadius: '50%',
        background: color, transform: 'translateX(-50%)',
        left: `${pct}%`, boxShadow: `0 0 6px ${color}`,
      }} />
    </div>
  );
};

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function ReportOrganizer() {
  const [activeTab, setActiveTab] = useState('upload');
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
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

  const totalAbnormal = reports.reduce((s, r) => s + r.abnormalCount, 0);

  /* ── styles ── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body { background: #090d14; }

    .ro-wrap {
      min-height: 100vh;
      background: #090d14;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      padding: 0;
    }

    /* noise grain overlay */
    .ro-wrap::before {
      content: '';
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: .4;
    }

    .ro-inner {
      position: relative; z-index: 1;
      max-width: 860px; margin: 0 auto; padding: 48px 24px 80px;
    }

    /* ── header ── */
    .ro-header { margin-bottom: 48px; }
    .ro-eyebrow {
      font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px;
      text-transform: uppercase; color: #64748b; margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .ro-eyebrow-line { flex: 1; height: 1px; background: rgba(100,116,139,.3); }
    .ro-title {
      font-family: 'Syne', sans-serif; font-size: clamp(28px,5vw,44px);
      font-weight: 800; line-height: 1.1; letter-spacing: -1px;
      background: linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .ro-title em { font-style: normal; color: #38bdf8; -webkit-text-fill-color: #38bdf8; }
    .ro-subtitle {
      margin-top: 8px; font-size: 14px; color: #64748b; font-weight: 300; letter-spacing: .2px;
    }

    /* ── stat chips ── */
    .ro-stats { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
    .ro-stat {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
      border-radius: 10px; padding: 10px 16px;
      font-family: 'DM Mono', monospace; font-size: 12px; color: #94a3b8;
    }
    .ro-stat strong { color: #f1f5f9; font-size: 18px; font-family: 'Syne', sans-serif; }

    /* ── tabs ── */
    .ro-tabs {
      display: flex; gap: 2px; background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.07); border-radius: 12px;
      padding: 4px; margin-bottom: 28px; width: fit-content;
    }
    .ro-tab {
      padding: 8px 20px; border: none; border-radius: 9px; cursor: pointer;
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
      transition: all .25s; background: transparent; color: #64748b;
    }
    .ro-tab:hover { color: #94a3b8; }
    .ro-tab.active {
      background: rgba(56,189,248,.12); color: #38bdf8;
      border: 1px solid rgba(56,189,248,.25); box-shadow: 0 0 20px rgba(56,189,248,.08);
    }

    /* ── cards ── */
    .ro-card {
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 20px; padding: 32px;
      backdrop-filter: blur(12px);
      transition: opacity .5s, transform .5s;
    }

    /* ── upload zone ── */
    .ro-drop {
      border: 1.5px dashed rgba(56,189,248,.25);
      border-radius: 16px; padding: 56px 40px;
      text-align: center; cursor: pointer;
      transition: all .3s; position: relative; overflow: hidden;
      margin-bottom: 24px;
    }
    .ro-drop:hover, .ro-drop.over {
      border-color: rgba(56,189,248,.6);
      background: rgba(56,189,248,.04);
      box-shadow: inset 0 0 40px rgba(56,189,248,.06);
    }
    .ro-drop-icon {
      width: 64px; height: 64px; border-radius: 16px;
      background: rgba(56,189,248,.1); border: 1px solid rgba(56,189,248,.2);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .ro-drop-title {
      font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700;
      color: #f1f5f9; margin-bottom: 6px;
    }
    .ro-drop-sub { font-size: 13px; color: #64748b; }

    /* ── primary button ── */
    .ro-btn {
      width: 100%; padding: 14px; border: none; border-radius: 12px; cursor: pointer;
      font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: .5px;
      transition: all .25s; position: relative; overflow: hidden;
      background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
      color: #0c1220; box-shadow: 0 4px 24px rgba(56,189,248,.3);
    }
    .ro-btn:hover:not(:disabled) {
      transform: translateY(-1px); box-shadow: 0 8px 32px rgba(56,189,248,.4);
    }
    .ro-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }

    /* ── spinner ── */
    @keyframes spin { to { transform: rotate(360deg); } }
    .ro-spinner {
      display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(12,18,32,.3);
      border-top-color: #0c1220; border-radius: 50%; animation: spin .7s linear infinite;
      margin-right: 8px; vertical-align: middle;
    }

    /* ── report list ── */
    .ro-report-item {
      display: flex; align-items: center; gap: 16px;
      padding: 18px 20px; border-radius: 14px;
      border: 1px solid rgba(255,255,255,.06);
      background: rgba(255,255,255,.02);
      cursor: pointer; transition: all .25s; margin-bottom: 10px;
    }
    .ro-report-item:hover {
      background: rgba(255,255,255,.05);
      border-color: rgba(255,255,255,.12);
      transform: translateX(3px);
    }
    .ro-report-item.abnormal { border-color: rgba(239,68,68,.2); background: rgba(239,68,68,.04); }
    .ro-report-item.abnormal:hover { background: rgba(239,68,68,.07); }
    .ro-report-dot {
      width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .ro-report-dot.normal { background: rgba(16,185,129,.12); }
    .ro-report-dot.abnormal { background: rgba(239,68,68,.12); }
    .ro-report-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: #f1f5f9; }
    .ro-report-date { font-family: 'DM Mono', monospace; font-size: 11px; color: #64748b; margin-top: 3px; }
    .ro-chevron { margin-left: auto; color: #334155; transition: color .2s; }
    .ro-report-item:hover .ro-chevron { color: #64748b; }

    /* ── details ── */
    .ro-detail-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 24px; gap: 16px; flex-wrap: wrap;
    }
    .ro-detail-title {
      font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
      color: #f1f5f9; line-height: 1.2;
    }
    .ro-detail-date {
      font-family: 'DM Mono', monospace; font-size: 11px; color: #64748b;
      letter-spacing: .5px; margin-top: 5px;
    }
    .ro-export-btn {
      display: flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
      color: #94a3b8; padding: 8px 14px; border-radius: 9px; cursor: pointer;
      font-size: 12px; font-family: 'DM Mono', monospace; transition: all .2s;
    }
    .ro-export-btn:hover { background: rgba(255,255,255,.09); color: #f1f5f9; }

    /* ── alert banner ── */
    .ro-alert {
      display: flex; align-items: center; gap: 12px;
      background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25);
      border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;
      font-size: 13px; color: #fca5a5;
    }

    /* ── table ── */
    .ro-table { width: 100%; border-collapse: collapse; }
    .ro-table th {
      padding: 10px 16px; text-align: left;
      font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1.2px;
      text-transform: uppercase; color: #475569; border-bottom: 1px solid rgba(255,255,255,.06);
      white-space: nowrap;
    }
    .ro-table td {
      padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,.04);
      font-size: 14px; color: #cbd5e1; vertical-align: middle;
    }
    .ro-table tr:last-child td { border-bottom: none; }
    .ro-table tr:hover td { background: rgba(255,255,255,.02); }
    .ro-test-name { font-weight: 500; color: #f1f5f9; font-size: 14px; }
    .ro-value { font-family: 'DM Mono', monospace; font-size: 14px; }
    .ro-value.high { color: #f59e0b; }
    .ro-value.low  { color: #ef4444; }
    .ro-value.normal { color: #10b981; }
    .ro-ref { font-family: 'DM Mono', monospace; font-size: 12px; color: #475569; }

    /* ── summary box ── */
    .ro-summary {
      margin-top: 24px; padding: 20px; border-radius: 14px;
      background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
    }
    .ro-summary-label {
      font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1.5px;
      text-transform: uppercase; color: #475569; margin-bottom: 8px;
    }
    .ro-summary p { font-size: 14px; color: #94a3b8; line-height: 1.7; font-weight: 300; }

    /* ── empty state ── */
    .ro-empty { text-align: center; padding: 60px 24px; color: #475569; }
    .ro-empty-icon {
      width: 64px; height: 64px; border-radius: 16px;
      background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .ro-empty h4 { font-family: 'Syne', sans-serif; color: #64748b; margin-bottom: 6px; }
    .ro-empty p { font-size: 13px; }

    /* ── back button ── */
    .ro-back {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-family: 'DM Mono', monospace; color: #475569;
      cursor: pointer; margin-bottom: 20px; transition: color .2s;
      background: none; border: none;
    }
    .ro-back:hover { color: #94a3b8; }

    /* ── section label ── */
    .ro-section-label {
      font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
      color: #f1f5f9; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    }
    .ro-section-label::after {
      content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.06);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ro-animate { animation: fadeUp .45s ease both; }

    @media (max-width: 600px) {
      .ro-inner { padding: 32px 16px 60px; }
      .ro-card { padding: 20px; }
      .ro-table th:nth-child(4), .ro-table td:nth-child(4) { display: none; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="ro-wrap">
        <div className="ro-inner">

          {/* ── Header ── */}
          <header className="ro-header ro-animate" style={{ animationDelay: '0ms' }}>
            <div className="ro-eyebrow">
              <Activity size={12} color="#38bdf8" />
              Health Intelligence
              <span className="ro-eyebrow-line" />
            </div>
            <h1 className="ro-title">Medical <em>Report</em> Organizer</h1>
            <p className="ro-subtitle">Upload blood test reports for automatic abnormal value detection and trend analysis</p>

            <div className="ro-stats">
              <div className="ro-stat">
                <strong>{reports.length}</strong> Reports
              </div>
              <div className="ro-stat">
                <span style={{ color: totalAbnormal > 0 ? '#ef4444' : '#10b981' }}>●</span>
                <strong style={{ color: totalAbnormal > 0 ? '#ef4444' : '#10b981' }}>{totalAbnormal}</strong>
                Abnormal Values
              </div>
              <div className="ro-stat">
                <strong>{reports.filter(r => r.abnormalCount === 0).length}</strong> All-Clear Reports
              </div>
            </div>
          </header>

          {/* ── Tabs ── */}
          <div className="ro-tabs ro-animate" style={{ animationDelay: '80ms' }}>
            {['upload', 'history', ...(selectedReport ? ['details'] : [])].map((tab) => (
              <button
                key={tab}
                className={`ro-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'upload' ? 'Upload' : tab === 'history' ? `History (${reports.length})` : 'Details'}
              </button>
            ))}
          </div>

          {/* ══ UPLOAD TAB ══ */}
          {activeTab === 'upload' && (
            <div className="ro-card ro-animate" key="upload" style={{ animationDelay: '120ms' }}>
              <div className="ro-section-label" style={{ marginBottom: 24 }}>Upload Report</div>

              <div
                className={`ro-drop${dragOver ? ' over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('ro-file-input').click()}
              >
                <input
                  id="ro-file-input" type="file" accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleFileSelect(e.target.files[0])}
                />

                {preview ? (
                  <div>
                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 10, marginBottom: 12 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <CheckCircle size={14} color="#10b981" />
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#10b981' }}>
                        {selectedFile?.name}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedFile(null); setPreview(null); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="ro-drop-icon">
                      <Upload size={26} color="#38bdf8" />
                    </div>
                    <div className="ro-drop-title">Drop your report here</div>
                    <div className="ro-drop-sub">JPG · PNG · PDF &nbsp;·&nbsp; Max 5 MB</div>
                    <div style={{
                      display: 'inline-block', marginTop: 18, padding: '7px 18px',
                      border: '1px solid rgba(56,189,248,.3)', borderRadius: 8,
                      fontSize: 12, color: '#38bdf8', fontFamily: 'DM Mono, monospace',
                    }}>
                      Browse Files
                    </div>
                  </>
                )}
              </div>

              <button className="ro-btn" onClick={handleUpload} disabled={!selectedFile || loading}>
                {loading ? (
                  <><span className="ro-spinner" />Analysing Report…</>
                ) : 'Analyse Report'}
              </button>
            </div>
          )}

          {/* ══ HISTORY TAB ══ */}
          {activeTab === 'history' && (
            <div className="ro-animate" key="history" style={{ animationDelay: '120ms' }}>
              <div className="ro-section-label">All Reports</div>

              {reports.length === 0 ? (
                <div className="ro-card ro-empty">
                  <div className="ro-empty-icon"><FileText size={24} color="#475569" /></div>
                  <h4>No reports yet</h4>
                  <p>Upload your first blood test report to get started</p>
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report._id}
                    className={`ro-report-item${report.abnormalCount > 0 ? ' abnormal' : ''}`}
                    onClick={() => openReport(report)}
                  >
                    <div className={`ro-report-dot ${report.abnormalCount > 0 ? 'abnormal' : 'normal'}`}>
                      {report.abnormalCount > 0
                        ? <AlertTriangle size={18} color="#ef4444" />
                        : <CheckCircle size={18} color="#10b981" />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ro-report-name">{report.reportType}</div>
                      <div className="ro-report-date">{new Date(report.reportDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</div>
                    </div>
                    {report.abnormalCount > 0 ? (
                      <StatusPill status="high" />
                    ) : (
                      <StatusPill status="normal" />
                    )}
                    <ChevronRight className="ro-chevron" size={16} />
                  </div>
                ))
              )}
            </div>
          )}

          {/* ══ DETAILS TAB ══ */}
          {activeTab === 'details' && selectedReport && (
            <div className="ro-animate" key="details" style={{ animationDelay: '120ms' }}>
              <button className="ro-back" onClick={() => setActiveTab('history')}>
                ← Back to History
              </button>

              <div className="ro-card" style={{ marginBottom: 20 }}>
                <div className="ro-detail-header">
                  <div>
                    <div className="ro-detail-title">{selectedReport.reportType}</div>
                    <div className="ro-detail-date">
                      Report Date: {new Date(selectedReport.reportDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <button className="ro-export-btn" onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedReport, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `report-${selectedReport._id}.json`;
                    a.click();
                  }}>
                    <Download size={12} /> Export JSON
                  </button>
                </div>

                {selectedReport.abnormalCount > 0 && (
                  <div className="ro-alert">
                    <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span>
                      <strong style={{ color: '#fca5a5' }}>{selectedReport.abnormalCount} abnormal value{selectedReport.abnormalCount > 1 ? 's' : ''} detected.</strong>
                      {' '}Please consult your doctor for clinical interpretation.
                    </span>
                  </div>
                )}

                <div className="ro-section-label">Test Results</div>

                <div style={{ overflowX: 'auto' }}>
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
                      {selectedReport.extractedData.map((test, idx) => {
                        const status = getStatus(test.value, test.normalRangeMin, test.normalRangeMax);
                        return (
                          <tr key={idx}>
                            <td><span className="ro-test-name">{test.testName}</span></td>
                            <td>
                              <span className={`ro-value ${status}`}>
                                {test.value}
                                <span style={{ fontSize: 11, marginLeft: 4, opacity: .7 }}>{test.unit}</span>
                              </span>
                            </td>
                            <td><span className="ro-ref">{test.referenceRange}</span></td>
                            <td>
                              <RangeBar
                                value={test.value}
                                min={test.normalRangeMin}
                                max={test.normalRangeMax}
                                status={status}
                              />
                            </td>
                            <td><StatusPill status={status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedReport.summary && (
                  <div className="ro-summary">
                    <div className="ro-summary-label">Clinical Summary</div>
                    <p>{selectedReport.summary}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
