import  { useState, useEffect } from "react";
import {
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Download,
  Plus,
  Trash2,
  
  CheckCircle,
  
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const SymptomTracker = () => {
  const [timeline, setTimeline] = useState({ entries: [], summary: {} });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [symptomEntry, setSymptomEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    symptoms: [{ name: "", severity: 5, timeOfDay: "Morning", notes: "" }],
    medications: [],
    vitals: { temperature: "", bloodPressure: "", heartRate: "", oxygenLevel: "" },
  });

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      setPageLoading(true);
      const response = await api.get("/symptoms/timeline");
      setTimeline(response.data);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddSymptom = () => {
    setSymptomEntry({
      ...symptomEntry,
      symptoms: [
        ...symptomEntry.symptoms,
        { name: "", severity: 5, timeOfDay: "Morning", notes: "" },
      ],
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
      await api.post("/symptoms/entries", symptomEntry);
      toast.success("Symptom entry added successfully!");
      setShowForm(false);
      fetchTimeline();
      setSymptomEntry({
        date: new Date().toISOString().split("T")[0],
        symptoms: [{ name: "", severity: 5, timeOfDay: "Morning", notes: "" }],
        medications: [],
        vitals: { temperature: "", bloodPressure: "", heartRate: "", oxygenLevel: "" },
      });
    } catch (error) {
      toast.error("Failed to save symptom entry");
    } finally {
      setLoading(false);
    }
  };

 const generateDoctorReport = async () => {
  try {
    const response = await api.get("/symptoms/doctor-summary");

    // Agar data empty ho
    if (
      !response.data ||
      !response.data.timelineData ||
      response.data.timelineData.length === 0
    ) {
      toast.error("No symptom data available");
      return;
    }

    // JSON file create
    const blob = new Blob(
      [JSON.stringify(response.data, null, 2)],
      {
        type: "application/json",
      }
    );

    // Download URL create
    const url = window.URL.createObjectURL(blob);

    // Download trigger
    const a = document.createElement("a");
    a.href = url;
    a.download = `doctor-report-${
      new Date().toISOString().split("T")[0]
    }.json`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Memory cleanup
    window.URL.revokeObjectURL(url);

    toast.success("Doctor report generated!");
  } catch (error) {
    console.error("Doctor report error:", error);

    if (error.response?.status === 404) {
      toast.error("No symptom data available");
    } else if (error.response?.status === 401) {
      toast.error("Please login again");
    } else {
      toast.error(
        error.response?.data?.message ||
        "Failed to generate report"
      );
    }
  }
};

  const commonSymptoms = [
    "Fever",
    "Cough",
    "Headache",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Shortness of breath",
    "Chest pain",
    "Sore throat",
    "Body aches",
  ];

  const totalEntries = timeline?.summary?.totalEntries || 0;
  const avgSeverity = timeline?.summary?.avgSeverity || 0;
  const frequentSymptoms = timeline?.summary?.mostFrequentSymptoms?.slice(0, 2).join(", ") || "None";

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; }

    body { background: #090d14; }

    .st-wrap {
      min-height: 100vh;
      background:
        radial-gradient(circle at top right, rgba(59,130,246,.16), transparent 30%),
        radial-gradient(circle at bottom left, rgba(168,85,247,.14), transparent 28%),
        #090d14;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
    }

    .st-wrap::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: .35;
    }

    .st-inner {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 42px 18px 64px;
    }

    .st-hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 28px;
      animation: fadeUp .5s ease both;
    }

    .st-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.04);
      font-size: 12px;
      letter-spacing: .6px;
      color: #94a3b8;
      margin-bottom: 14px;
    }

    .st-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(28px, 4vw, 46px);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -1px;
      color: #f8fafc;
      margin: 0;
    }

    .st-title span { color: #38bdf8; }

    .st-subtitle {
      margin-top: 10px;
      max-width: 680px;
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.8;
    }

    .st-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .st-btn {
      border: none;
      border-radius: 14px;
      padding: 12px 16px;
      cursor: pointer;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: .4px;
      transition: transform .2s ease, opacity .2s ease, background .2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .st-btn:hover { transform: translateY(-1px); }

    .st-btn-primary {
      color: #07111f;
      background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
      box-shadow: 0 10px 30px rgba(56,189,248,.22);
    }

    .st-btn-secondary {
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.1);
      color: #e2e8f0;
    }

    .st-grid {
      display: grid;
      gap: 18px;
    }

    .st-stats {
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      margin-bottom: 28px;
    }

    .st-card {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.04);
      backdrop-filter: blur(14px);
      box-shadow: 0 18px 50px rgba(0,0,0,.22);
      transition: transform .25s ease, border-color .25s ease, background .25s ease;
      animation: fadeUp .5s ease both;
    }

    .st-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
    }

    .st-card-inner {
      position: relative;
      z-index: 1;
      padding: 24px;
    }

    .st-icon-box {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.08);
    }

    .st-stat-value {
      margin-top: 18px;
      font-family: 'Syne', sans-serif;
      font-size: 34px;
      line-height: 1;
      font-weight: 800;
      color: #f8fafc;
    }

    .st-stat-title {
      margin-top: 8px;
      font-size: 14px;
      color: #94a3b8;
    }

    .st-section {
      margin-bottom: 16px;
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #f8fafc;
    }

    .st-form {
      margin-bottom: 28px;
    }

    .st-form-grid {
      display: grid;
      gap: 16px;
    }

    .st-input,
    .st-select,
    .st-textarea {
      width: 100%;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.04);
      color: #e2e8f0;
      padding: 12px 14px;
      outline: none;
      transition: border-color .2s ease, background .2s ease;
      font-size: 14px;
    }

    .st-input::placeholder,
    .st-textarea::placeholder {
      color: #64748b;
    }

    .st-input:focus,
    .st-select:focus,
    .st-textarea:focus {
      border-color: rgba(56,189,248,.5);
      background: rgba(255,255,255,.06);
    }

    .st-symptom-box {
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      border-radius: 18px;
      padding: 16px;
    }

    .st-mini-label {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .st-range {
      width: 100%;
      accent-color: #38bdf8;
    }

    .st-note {
      color: #64748b;
      font-size: 13px;
      line-height: 1.7;
    }

    .st-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      color: #cbd5e1;
      font-size: 12px;
      white-space: nowrap;
    }

    .st-timeline-item {
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      border-radius: 18px;
      padding: 18px;
      transition: transform .2s ease, background .2s ease;
    }

    .st-timeline-item:hover {
      transform: translateY(-2px);
      background: rgba(255,255,255,.05);
    }

    .st-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .st-date {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 16px;
      color: #f8fafc;
    }

    .st-muted {
      color: #94a3b8;
      font-size: 13px;
    }

    .st-divider {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,.06);
    }

    .st-empty {
      text-align: center;
      padding: 54px 20px;
      color: #64748b;
    }

    .st-empty h4 {
      margin-top: 14px;
      font-family: 'Syne', sans-serif;
      color: #94a3b8;
      font-size: 18px;
    }

    .st-spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(7,17,31,.25);
      border-top-color: #07111f;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .st-inner { padding: 28px 14px 52px; }
      .st-card-inner { padding: 20px; }
      .st-section { font-size: 22px; }
      .st-title { font-size: 30px; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="st-wrap">
        <div className="st-inner">
          <header className="st-hero">
            <div>
              <div className="st-eyebrow">
                <Activity size={12} color="#38bdf8" />
                Symptom Intelligence
              </div>
              <h1 className="st-title">
                Symptom <span>Timeline</span> Tracker
              </h1>
              <p className="st-subtitle">
                Track your symptoms daily, monitor vitals, and generate comprehensive doctor-ready reports.
              </p>
            </div>

            <div className="st-actions">
              <button className="st-btn st-btn-secondary" onClick={() => setShowForm(!showForm)}>
                <Plus size={16} />
                Add Entry
              </button>
              <button className="st-btn st-btn-primary" onClick={generateDoctorReport}>
                <Download size={16} />
                Doctor Report
              </button>
            </div>
          </header>

          {totalEntries > 0 && (
            <section className="st-grid st-stats">
              <div className="st-card">
                <div className="st-card-inner">
                  <div className="st-icon-box">
                    <Activity size={24} className="text-emerald-300" />
                  </div>
                  <div className="st-stat-value">{pageLoading ? "..." : totalEntries}</div>
                  <div className="st-stat-title">Total Entries</div>
                </div>
              </div>

              <div className="st-card">
                <div className="st-card-inner">
                  <div className="st-icon-box">
                    <Heart size={24} className="text-rose-300" />
                  </div>
                  <div className="st-stat-value">{pageLoading ? "..." : `${avgSeverity}/10`}</div>
                  <div className="st-stat-title">Average Severity</div>
                </div>
              </div>

              <div className="st-card">
                <div className="st-card-inner">
                  <div className="st-icon-box">
                    <Calendar size={24} className="text-amber-300" />
                  </div>
                  <div className="st-stat-value" style={{ fontSize: 18, lineHeight: 1.3 }}>
                    {pageLoading ? "..." : frequentSymptoms}
                  </div>
                  <div className="st-stat-title">Most Frequent Symptoms</div>
                </div>
              </div>
            </section>
          )}

          {showForm && (
            <section className="st-card st-form">
              <div className="st-card-inner">
                <div className="st-section">Log Symptoms for Today</div>

                <div className="st-form-grid">
                  <div>
                    <label className="st-mini-label">Date</label>
                    <input
                      type="date"
                      className="st-input"
                      value={symptomEntry.date}
                      onChange={(e) =>
                        setSymptomEntry({ ...symptomEntry, date: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="st-mini-label">Symptoms</label>
                    <div className="st-form-grid">
                      {symptomEntry.symptoms.map((symptom, index) => (
                        <div key={index} className="st-symptom-box">
                          <div className="st-form-grid">
                            <select
                              value={symptom.name}
                              onChange={(e) =>
                                handleSymptomChange(index, "name", e.target.value)
                              }
                              className="st-select"
                            >
                              <option value="">Select symptom</option>
                              {commonSymptoms.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>

                            <div>
                              <div className="st-mini-label">
                                Severity ({symptom.severity}/10)
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={symptom.severity}
                                onChange={(e) =>
                                  handleSymptomChange(
                                    index,
                                    "severity",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="st-range"
                              />
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginTop: 6,
                                  color: "#64748b",
                                  fontSize: 12,
                                }}
                              >
                                <span>Mild</span>
                                <span>Moderate</span>
                                <span>Severe</span>
                              </div>
                            </div>

                            <select
                              value={symptom.timeOfDay}
                              onChange={(e) =>
                                handleSymptomChange(index, "timeOfDay", e.target.value)
                              }
                              className="st-select"
                            >
                              <option>Morning</option>
                              <option>Afternoon</option>
                              <option>Evening</option>
                              <option>Night</option>
                            </select>

                            <textarea
                              placeholder="Additional notes..."
                              value={symptom.notes}
                              onChange={(e) =>
                                handleSymptomChange(index, "notes", e.target.value)
                              }
                              rows="2"
                              className="st-textarea"
                            />
                          </div>

                          {symptomEntry.symptoms.length > 1 && (
                            <button
                              onClick={() => handleRemoveSymptom(index)}
                              className="st-btn st-btn-secondary"
                              style={{ marginTop: 12, padding: "9px 12px" }}
                            >
                              <Trash2 size={14} />
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleAddSymptom}
                      className="st-btn st-btn-secondary"
                      style={{
                        width: "100%",
                        marginTop: 12,
                        borderStyle: "dashed",
                      }}
                    >
                      <Plus size={16} />
                      Add Another Symptom
                    </button>
                  </div>

                  <div>
                    <label className="st-mini-label">Vital Signs (Optional)</label>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="relative">
                        <Thermometer size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300" />
                        <input
                          type="text"
                          placeholder="Temperature (°F)"
                          value={symptomEntry.vitals.temperature}
                          onChange={(e) =>
                            setSymptomEntry({
                              ...symptomEntry,
                              vitals: {
                                ...symptomEntry.vitals,
                                temperature: e.target.value,
                              },
                            })
                          }
                          className="st-input pl-10"
                        />
                      </div>

                      <div className="relative">
                        <Heart size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" />
                        <input
                          type="text"
                          placeholder="Blood Pressure"
                          value={symptomEntry.vitals.bloodPressure}
                          onChange={(e) =>
                            setSymptomEntry({
                              ...symptomEntry,
                              vitals: {
                                ...symptomEntry.vitals,
                                bloodPressure: e.target.value,
                              },
                            })
                          }
                          className="st-input pl-10"
                        />
                      </div>

                      <div className="relative">
                        <Activity size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
                        <input
                          type="text"
                          placeholder="Heart Rate (bpm)"
                          value={symptomEntry.vitals.heartRate}
                          onChange={(e) =>
                            setSymptomEntry({
                              ...symptomEntry,
                              vitals: {
                                ...symptomEntry.vitals,
                                heartRate: e.target.value,
                              },
                            })
                          }
                          className="st-input pl-10"
                        />
                      </div>

                      <div className="relative">
                        <Droplets size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300" />
                        <input
                          type="text"
                          placeholder="Oxygen Level (%)"
                          value={symptomEntry.vitals.oxygenLevel}
                          onChange={(e) =>
                            setSymptomEntry({
                              ...symptomEntry,
                              vitals: {
                                ...symptomEntry.vitals,
                                oxygenLevel: e.target.value,
                              },
                            })
                          }
                          className="st-input pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setShowForm(false)}
                      className="st-btn st-btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="st-btn st-btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="st-spinner" />
                          Saving...
                        </>
                      ) : (
                        "Save Entry"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="st-card">
            <div className="st-card-inner">
              <div className="st-section">Symptom Timeline</div>

              {pageLoading ? (
                <div className="st-empty">
                  <div className="st-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  <h4 style={{ marginTop: 14 }}>Loading timeline...</h4>
                </div>
              ) : timeline.entries.length === 0 ? (
                <div className="st-empty">
                  <CheckCircle size={34} className="mx-auto text-slate-500" />
                  <h4>No symptom entries yet</h4>
                  <p>Start tracking your symptoms to build your health timeline.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {timeline.entries.slice().reverse().map((entry, index) => (
                    <div key={index} className="st-timeline-item">
                      <div className="st-meta">
                        <div>
                          <div className="st-date">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="st-muted">Daily symptom log</div>
                        </div>

                        {entry.vitals?.temperature && (
                          <span className="st-pill">
                            <Thermometer size={13} />
                            Temp: {entry.vitals.temperature}°F
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {entry.symptoms.map((symptom, i) => (
                          <span
                            key={i}
                            className="st-pill"
                            style={{
                              background:
                                symptom.severity >= 8
                                  ? "rgba(239,68,68,.12)"
                                  : symptom.severity >= 5
                                  ? "rgba(245,158,11,.12)"
                                  : "rgba(16,185,129,.12)",
                              borderColor:
                                symptom.severity >= 8
                                  ? "rgba(239,68,68,.22)"
                                  : symptom.severity >= 5
                                  ? "rgba(245,158,11,.22)"
                                  : "rgba(16,185,129,.22)",
                            }}
                          >
                            {symptom.name}
                            <span style={{ fontWeight: 700 }}>
                              ({symptom.severity}/10)
                            </span>
                          </span>
                        ))}
                      </div>

                      {(entry.vitals?.bloodPressure ||
                        entry.vitals?.heartRate ||
                        entry.vitals?.oxygenLevel) && (
                        <div className="st-divider flex flex-wrap gap-4">
                          {entry.vitals.bloodPressure && (
                            <span className="st-muted">
                              BP: {entry.vitals.bloodPressure}
                            </span>
                          )}
                          {entry.vitals.heartRate && (
                            <span className="st-muted">
                              HR: {entry.vitals.heartRate} bpm
                            </span>
                          )}
                          {entry.vitals.oxygenLevel && (
                            <span className="st-muted">
                              O₂: {entry.vitals.oxygenLevel}%
                            </span>
                          )}
                        </div>
                      )}

                      {entry.symptoms.some((s) => s.notes) && (
                        <p className="st-note mt-3 italic">
                          Note: {entry.symptoms.find((s) => s.notes)?.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default SymptomTracker;