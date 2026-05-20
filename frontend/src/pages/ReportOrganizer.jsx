import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, TrendingUp, Download } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ReportOrganizer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('report', selectedFile);

    setLoading(true);
    try {
      const response = await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`Report analyzed! Found ${response.data.abnormalCount} abnormal value(s)`);
      fetchReports();
      setActiveTab('history');
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getAbnormalStatus = (value, min, max) => {
    if (value < min) return { status: 'low', color: '#ef4444', text: 'Low' };
    if (value > max) return { status: 'high', color: '#f59e0b', text: 'High' };
    return { status: 'normal', color: '#10b981', text: 'Normal' };
  };

  const getTrendIcon = (report, index) => {
    if (index === 0) return null;
    const prevReport = reports[index - 1];
    const currentValue = parseFloat(report.extractedData[0]?.value);
    const prevValue = parseFloat(prevReport?.extractedData[0]?.value);
    
    if (currentValue > prevValue) return <TrendingUp color="#ef4444" size={16} />;
    if (currentValue < prevValue) return <TrendingUp color="#10b981" size={16} style={{ transform: 'rotate(180deg)' }} />;
    return null;
  };

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '12px' }}>Medical Report Organizer</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Upload blood test reports for automatic abnormal value detection and trend analysis</p>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'upload' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            color: activeTab === 'upload' ? '#2563eb' : 'white',
            fontWeight: '600'
          }}
        >
          Upload Report
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'history' ? 'white' : 'transparent',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            color: activeTab === 'history' ? '#2563eb' : 'white',
            fontWeight: '600'
          }}
        >
          My Reports ({reports.length})
        </button>
        {selectedReport && (
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'details' ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              color: activeTab === 'details' ? '#2563eb' : 'white',
              fontWeight: '600'
            }}
          >
            Report Details
          </button>
        )}
      </div>

      {activeTab === 'upload' && (
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <FileText size={64} color="#7c3aed" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Upload Blood Test Report</h3>
            <p style={{ color: '#6b7280' }}>Supported formats: JPG, PNG, PDF (Max 5MB)</p>
          </div>

          <div
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '24px'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect({ target: { files: [file] } });
            }}
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="report-input"
            />
            <label htmlFor="report-input" style={{ cursor: 'pointer' }}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
              ) : (
                <>
                  <Upload size={48} color="#9ca3af" style={{ marginBottom: '16px' }} />
                  <p style={{ color: '#6b7280' }}>Click or drag & drop to upload</p>
                </>
              )}
            </label>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Analyzing Report...' : 'Analyze Report'}
          </button>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card">
          <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Report History</h3>
          {reports.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>No reports uploaded yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reports.map((report, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedReport(report);
                    setActiveTab('details');
                  }}
                  style={{
                    padding: '16px',
                    border: `1px solid ${report.abnormalCount > 0 ? '#fee2e2' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: report.abnormalCount > 0 ? '#fef2f2' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '16px' }}>{report.reportType}</strong>
                      <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {report.abnormalCount > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} color="#ef4444" />
                        <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                          {report.abnormalCount} Abnormal
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} color="#10b981" />
                        <span style={{ color: '#10b981', fontSize: '14px' }}>Normal</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{report.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'details' && selectedReport && (
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{selectedReport.reportType}</h3>
                <p style={{ color: '#6b7280' }}>Report Date: {new Date(selectedReport.reportDate).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(selectedReport, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `report-${selectedReport.reportType}-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  toast.success('Report exported!');
                }}
                style={{ background: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Download size={16} style={{ marginRight: '8px' }} />
                Export
              </button>
            </div>
            
            {selectedReport.abnormalCount > 0 && (
              <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                <strong>⚠️ Abnormal Values Detected:</strong> {selectedReport.abnormalCount} value(s) outside normal range. Please consult your doctor.
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Test Results Analysis</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Test Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Your Value</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Reference Range</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedReport.extractedData.map((test, idx) => {
                    const status = getAbnormalStatus(parseFloat(test.value), test.normalRangeMin, test.normalRangeMax);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontWeight: '500' }}>{test.testName}</td>
                        <td style={{ padding: '12px', fontWeight: status.status !== 'normal' ? 'bold' : 'normal', color: status.color }}>
                          {test.value} {test.unit}
                        </td>
                        <td style={{ padding: '12px', color: '#6b7280' }}>{test.referenceRange}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: status.status === 'normal' ? '#d1fae5' : status.status === 'high' ? '#fed7aa' : '#fee2e2',
                            color: status.status === 'normal' ? '#065f46' : status.status === 'high' ? '#92400e' : '#991b1b',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {status.text}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {status.status !== 'normal' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={14} color={status.color} />
                              {test.severity}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {selectedReport.summary && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
                <strong>Clinical Summary:</strong>
                <p style={{ marginTop: '8px', color: '#4b5563' }}>{selectedReport.summary}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportOrganizer;