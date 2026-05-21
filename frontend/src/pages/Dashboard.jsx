import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Activity,
  FileSpreadsheet,
  Bell,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    prescriptions: 0,
    symptomEntries: 0,
    reports: 0,
    abnormalAlerts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [prescriptionsRes, reportsRes] = await Promise.all([
        api.get("/prescriptions"),
        api.get("/reports"),
      ]);

      const prescriptions = prescriptionsRes?.data || [];
      const reports = reportsRes?.data || [];

      setStats({
        prescriptions: prescriptions.length,
        symptomEntries: 12,
        reports: reports.length,
        abnormalAlerts: reports.filter((report) => report?.abnormalCount > 0).length,
      });
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: "Prescription Digitizer",
      icon: FileText,
      path: "/prescription",
      color: "from-blue-500 to-cyan-400",
      glow: "rgba(56,189,248,.18)",
      description: "Upload prescriptions, detect conflicts & duplicates",
    },
    {
      title: "Symptom Tracker",
      icon: Activity,
      path: "/symptom-tracker",
      color: "from-violet-500 to-fuchsia-400",
      glow: "rgba(168,85,247,.18)",
      description: "Track symptoms daily and generate doctor reports",
    },
    {
      title: "Report Organizer",
      icon: FileSpreadsheet,
      path: "/reports",
      color: "from-emerald-500 to-teal-400",
      glow: "rgba(16,185,129,.16)",
      description: "Analyze blood tests and detect abnormalities",
    },
  ];

  const cards = [
    {
      title: "Prescriptions Analyzed",
      value: stats.prescriptions,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-400",
      accent: "text-cyan-300",
    },
    {
      title: "Symptom Entries",
      value: stats.symptomEntries,
      icon: Activity,
      gradient: "from-violet-500 to-fuchsia-400",
      accent: "text-violet-300",
    },
    {
      title: "Reports Uploaded",
      value: stats.reports,
      icon: FileSpreadsheet,
      gradient: "from-emerald-500 to-teal-400",
      accent: "text-emerald-300",
    },
    {
      title: "Abnormal Alerts",
      value: stats.abnormalAlerts,
      icon: Bell,
      gradient:
        stats.abnormalAlerts > 0
          ? "from-red-500 to-rose-400"
          : "from-slate-500 to-slate-400",
      accent:
        stats.abnormalAlerts > 0 ? "text-rose-300" : "text-slate-300",
    },
  ];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; }
    body { background: #090d14; }

    .dash-wrap {
      min-height: 100vh;
      background:
        radial-gradient(circle at top right, rgba(59,130,246,.16), transparent 30%),
        radial-gradient(circle at bottom left, rgba(168,85,247,.14), transparent 28%),
        #090d14;
      color: #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
    }

    .dash-wrap::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      opacity: .35;
    }

    .dash-inner {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
      padding: 42px 18px 64px;
    }

    .dash-hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 34px;
      animation: fadeUp .5s ease both;
    }

    .dash-eyebrow {
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

    .dash-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(28px, 4vw, 46px);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -1px;
      color: #f8fafc;
      margin: 0;
    }

    .dash-title span {
      color: #38bdf8;
    }

    .dash-subtitle {
      margin-top: 10px;
      max-width: 640px;
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.8;
    }

    .dash-status {
      width: 100%;
      max-width: 360px;
      border-radius: 24px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.04);
      backdrop-filter: blur(14px);
      padding: 22px;
      box-shadow: 0 18px 50px rgba(0,0,0,.24);
    }

    .dash-status-label {
      font-family: 'DM Mono', monospace;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 10px;
    }

    .dash-status-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
    }

    .dash-status h2 {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      line-height: 1;
      color: #f8fafc;
      margin: 0;
    }

    .dash-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(16,185,129,.12);
      color: #86efac;
      font-size: 11px;
      font-family: 'DM Mono', monospace;
      letter-spacing: .8px;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .dash-progress {
      margin-top: 18px;
      height: 10px;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
      overflow: hidden;
    }

    .dash-progress > div {
      height: 100%;
      width: 78%;
      border-radius: inherit;
      background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #22d3ee);
    }

    .dash-progress-text {
      margin-top: 10px;
      color: #64748b;
      font-size: 13px;
    }

    .dash-grid {
      display: grid;
      gap: 18px;
    }

    .dash-stats {
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      margin-bottom: 28px;
    }

    .dash-tools {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .dash-card {
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

    .dash-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
    }

    .dash-card-inner {
      position: relative;
      z-index: 1;
      padding: 24px;
    }

    .dash-card-glow {
      position: absolute;
      inset: auto -40px -40px auto;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      filter: blur(24px);
      opacity: .9;
    }

    .dash-icon-box {
      width: 58px;
      height: 58px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.08);
    }

    .dash-stat-value {
      margin-top: 18px;
      font-family: 'Syne', sans-serif;
      font-size: 34px;
      line-height: 1;
      font-weight: 800;
      color: #f8fafc;
    }

    .dash-stat-title {
      margin-top: 8px;
      font-size: 14px;
      color: #94a3b8;
    }

    .dash-feature-title {
      margin-top: 18px;
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.2;
    }

    .dash-feature-desc {
      margin-top: 10px;
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.75;
    }

    .dash-btn {
      width: 100%;
      margin-top: 18px;
      border: none;
      border-radius: 14px;
      padding: 13px 16px;
      cursor: pointer;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: .4px;
      color: #07111f;
      background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
      box-shadow: 0 10px 30px rgba(56,189,248,.22);
      transition: transform .2s ease, opacity .2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .dash-btn:hover { transform: translateY(-1px); opacity: .96; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .dash-inner { padding: 28px 14px 52px; }
      .dash-card-inner { padding: 20px; }
      .dash-status { max-width: 100%; }
      .dash-title { font-size: 30px; }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="dash-wrap">
        <div className="dash-inner">
          <header className="dash-hero">
            <div>
              <div className="dash-eyebrow">
                <Activity size={12} color="#38bdf8" />
                Smart Health Dashboard
              </div>
              <h1 className="dash-title">
                Welcome <span>Back</span> 👋
              </h1>
              <p className="dash-subtitle">
                Manage your health records intelligently with prescriptions, symptom tracking, and report analysis in one clean workspace.
              </p>
            </div>

            <div className="dash-status">
              <div className="dash-status-label">Health Status</div>
              <div className="dash-status-row">
                <h2>Stable</h2>
                <div className="dash-badge">Monitoring Active</div>
              </div>
              <div className="dash-progress">
                <div />
              </div>
              <p className="dash-progress-text">
                Overall health monitoring is active.
              </p>
            </div>
          </header>

          <section className="dash-grid dash-stats">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="dash-card"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className={`dash-card-glow bg-gradient-to-br ${card.gradient}`}
                    style={{ background: `linear-gradient(135deg, ${card.accent.includes("cyan") ? "rgba(56,189,248,.24), rgba(34,211,238,.12)" : card.accent.includes("violet") ? "rgba(168,85,247,.24), rgba(236,72,153,.12)" : card.accent.includes("emerald") ? "rgba(16,185,129,.22), rgba(45,212,191,.12)" : "rgba(251,113,133,.22), rgba(251,146,60,.12)"})` }}
                  />
                  <div className="dash-card-inner">
                    <div className="dash-icon-box">
                      <Icon size={24} className={card.accent} />
                    </div>
                    <div className="dash-stat-value">
                      {loading ? "..." : card.value}
                    </div>
                    <div className="dash-stat-title">{card.title}</div>
                  </div>
                </div>
              );
            })}
          </section>

          <div style={{ marginBottom: 16 }}>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "24px",
              fontWeight: 800,
              color: "#f8fafc",
              marginBottom: 8,
            }}>
              Health Tools
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>
              Powerful AI features to simplify healthcare management.
            </p>
          </div>

          <section className="dash-grid dash-tools">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="dash-card"
                  onClick={() => navigate(feature.path)}
                  style={{ cursor: "pointer", animationDelay: `${index * 70 + 120}ms` }}
                >
                  <div
                    className="dash-card-glow"
                    style={{ background: feature.glow }}
                  />
                  <div className="dash-card-inner">
                    <div className={`dash-icon-box bg-gradient-to-br ${feature.color}`}>
                      <Icon size={26} className="text-white" />
                    </div>

                    <h3 className="dash-feature-title">{feature.title}</h3>
                    <p className="dash-feature-desc">{feature.description}</p>

                    <button className="dash-btn">
                      Get Started
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;