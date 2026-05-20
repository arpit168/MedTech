import React, { useState, useEffect } from 'react';
import { Calendar, Activity, Heart, Thermometer, Droplets, Download, Plus } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const SymptomTracker = () => {
  const [timeline, setTimeline] = useState({ entries: [], summary: {} });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [symptomEntry, setSymptomEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    symptoms: [{ name: '', severity: 5, timeOfDay: 'Morning', notes: '' }],
    medications: [],
    vitals: { temperature: '', bloodPressure: '', heartRate: '', oxygenLevel: '' }
  });

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await api.get('/symptoms/timeline');
      setTimeline(response.data);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    }
  };

  const handleAddSymptom = () => {
    setSymptomEntry({
      ...symptomEntry,
      symptoms: [...symptomEntry.symptoms, { name: '', severity: 5, timeOfDay: 'Morning', notes: '' }]
    });
  };

  const handleSymptomChange = (index, field, value) => {
    const updatedSymptoms = [...symptomEntry.symptoms];
    updatedSymptoms[index][field] = value;
    setSymptomEntry({ ...symptomEntry, symptoms: updatedSymptoms });
  };

  const handleRemoveSymptom = (index) => {
    const updatedSymptoms = symptomEntry.symptoms.filter((_, i) => i !== index);
    setSymptomEntry({ ...symptomEntry, symptoms: updatedSymptoms });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/symptoms/entries', symptomEntry);
      toast.success('Symptom entry added successfully!');
      setShowForm(false);
      fetchTimeline();
      setSymptomEntry({
        date: new Date().toISOString().split('T')[0],
        symptoms: [{ name: '', severity: 5, timeOfDay: 'Morning', notes: '' }],
        medications: [],
        vitals: { temperature: '', bloodPressure: '', heartRate: '', oxygenLevel: '' }
      });
    } catch (error) {
      toast.error('Failed to save symptom entry');
    } finally {
      setLoading(false);
    }
  };

  const generateDoctorReport = async () => {
    try {
      const response = await api.get('/symptoms/doctor-summary');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `doctor-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Doctor report generated!');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const commonSymptoms = ['Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Shortness of breath', 'Chest pain', 'Sore throat', 'Body aches'];

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '12px' }}>Symptom Timeline Tracker</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>Track your symptoms daily and generate comprehensive doctor reports</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} style={{ marginRight: '8px' }} />
            Add Entry
          </button>
          <button className="btn" onClick={generateDoctorReport} style={{ background: 'white', color: '#2563eb' }}>
            <Download size={18} style={{ marginRight: '8px' }} />
            Doctor Report
          </button>
        </div>
      </div>

      {timeline.summary && timeline.summary.totalEntries > 0 && (
        <div className="grid" style={{ marginBottom: '24px' }}>
          <div className="card">
            <Activity size={32} color="#10b981" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{timeline.summary.totalEntries}</h3>
            <p style={{ color: '#6b7280' }}>Total Entries</p>
          </div>
          <div className="card">
            <Heart size={32} color="#ef4444" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{timeline.summary.avgSeverity || 0}/10</h3>
            <p style={{ color: '#6b7280' }}>Average Severity</p>
          </div>
          <div className="card">
            <Calendar size={32} color="#f59e0b" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{timeline.summary.mostFrequentSymptoms?.slice(0, 2).join(', ') || 'None'}</h3>
            <p style={{ color: '#6b7280' }}>Most Frequent Symptoms</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Log Symptoms for Today</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Date</label>
            <input
              type="date"
              value={symptomEntry.date}
              onChange={(e) => setSymptomEntry({ ...symptomEntry, date: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Symptoms</label>
            {symptomEntry.symptoms.map((symptom, index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '12px' }}>
                  <select
                    value={symptom.name}
                    onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select symptom</option>
                    {commonSymptoms.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  
                  <div>
                    <label>Severity (1-10)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={symptom.severity}
                      onChange={(e) => handleSymptomChange(index, 'severity', parseInt(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>
                  
                  <select
                    value={symptom.timeOfDay}
                    onChange={(e) => handleSymptomChange(index, 'timeOfDay', e.target.value)}
                  >
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                  
                  <textarea
                    placeholder="Additional notes..."
                    value={symptom.notes}
                    onChange={(e) => handleSymptomChange(index, 'notes', e.target.value)}
                    rows="2"
                  />
                </div>
                {symptomEntry.symptoms.length > 1 && (
                  <button
                    onClick={() => handleRemoveSymptom(index)}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddSymptom} style={{ background: 'none', border: '1px dashed #d1d5db', padding: '8px', width: '100%', borderRadius: '8px', cursor: 'pointer' }}>
              + Add Another Symptom
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Vital Signs (Optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div>
                <Thermometer size={16} />
                <input
                  type="text"
                  placeholder="Temperature (°F)"
                  value={symptomEntry.vitals.temperature}
                  onChange={(e) => setSymptomEntry({ ...symptomEntry, vitals: { ...symptomEntry.vitals, temperature: e.target.value } })}
                />
              </div>
              <div>
                <Heart size={16} />
                <input
                  type="text"
                  placeholder="Blood Pressure (e.g., 120/80)"
                  value={symptomEntry.vitals.bloodPressure}
                  onChange={(e) => setSymptomEntry({ ...symptomEntry, vitals: { ...symptomEntry.vitals, bloodPressure: e.target.value } })}
                />
              </div>
              <div>
                <Activity size={16} />
                <input
                  type="text"
                  placeholder="Heart Rate (bpm)"
                  value={symptomEntry.vitals.heartRate}
                  onChange={(e) => setSymptomEntry({ ...symptomEntry, vitals: { ...symptomEntry.vitals, heartRate: e.target.value } })}
                />
              </div>
              <div>
                <Droplets size={16} />
                <input
                  type="text"
                  placeholder="Oxygen Level (%)"
                  value={symptomEntry.vitals.oxygenLevel}
                  onChange={(e) => setSymptomEntry({ ...symptomEntry, vitals: { ...symptomEntry.vitals, oxygenLevel: e.target.value } })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Symptom Timeline</h3>
        {timeline.entries.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center' }}>No symptom entries yet. Start tracking your symptoms!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {timeline.entries.slice().reverse().map((entry, index) => (
              <div key={index} style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                  {entry.vitals?.temperature && (
                    <span style={{ background: '#dbeafe', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      Temp: {entry.vitals.temperature}°F
                    </span>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  {entry.symptoms.map((symptom, i) => (
                    <span key={i} style={{ background: '#fee2e2', padding: '6px 12px', borderRadius: '20px', fontSize: '14px' }}>
                      {symptom.name} <span style={{ fontWeight: 'bold' }}>({symptom.severity}/10)</span>
                    </span>
                  ))}
                </div>
                
                {entry.vitals && (entry.vitals.bloodPressure || entry.vitals.heartRate) && (
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '8px' }}>
                    {entry.vitals.bloodPressure && <span>BP: {entry.vitals.bloodPressure}</span>}
                    {entry.vitals.heartRate && <span>HR: {entry.vitals.heartRate} bpm</span>}
                    {entry.vitals.oxygenLevel && <span>O₂: {entry.vitals.oxygenLevel}%</span>}
                  </div>
                )}
                
                {entry.symptoms.some(s => s.notes) && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', fontStyle: 'italic' }}>
                    Note: {entry.symptoms.find(s => s.notes)?.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;