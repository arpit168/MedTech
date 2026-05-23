import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Activity,
  FileSpreadsheet,
  Bell,
  ChevronRight,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Microscope,
  Pill,
  ClipboardList,
} from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";

/* =========================================================
   CUSTOM HOOK
========================================================= */

const useDashboardData = () => {
  const [stats, setStats] = useState({
    prescriptions: 0,
    symptomEntries: 0,
    reports: 0,
    abnormalAlerts: 0,
    uniqueMedications: 0,
    healthScore: 85,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [prescriptionsRes, reportsRes] = await Promise.all([
        api.get("/prescriptions").catch(() => ({ data: [] })),
        api.get("/reports").catch(() => ({ data: [] })),
      ]);

      const prescriptions = prescriptionsRes?.data || [];
      const reports = reportsRes?.data || [];

      const medications = new Set();

      prescriptions.forEach((rx) => {
        if (Array.isArray(rx.medications)) {
          rx.medications.forEach((med) => {
            medications.add(med.toLowerCase());
          });
        }
      });

      const activity = [];

      prescriptions.slice(0, 3).forEach((rx) => {
        activity.push({
          id: `rx-${rx._id || Math.random()}`,
          type: "prescription",
          title: "Prescription Analyzed",
          timestamp: rx.createdAt || new Date().toISOString(),
          description: `${rx.medications?.length || 0} medications processed`,
        });
      });

      reports.slice(0, 3).forEach((report) => {
        const abnormal = report?.abnormalCount > 0;

        activity.push({
          id: `report-${report._id || Math.random()}`,
          type: "report",
          title: abnormal
            ? "Abnormalities Detected"
            : "Report Processed",
          timestamp: report.createdAt || new Date().toISOString(),
          description: abnormal
            ? `${report.abnormalCount} abnormal values found`
            : "All values normal",
          status: abnormal ? "abnormal" : "normal",
        });
      });

      activity.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      );

      const abnormalCount = reports.filter(
        (r) => r?.abnormalCount > 0
      ).length;

      const healthScore = Math.max(
        65,
        Math.min(
          98,
          85 - abnormalCount * 3 + (prescriptions.length > 0 ? 2 : 0)
        )
      );

      setRecentActivity(activity.slice(0, 5));

      setStats({
        prescriptions: prescriptions.length,
        symptomEntries: 12,
        reports: reports.length,
        abnormalAlerts: abnormalCount,
        uniqueMedications: medications.size,
        healthScore,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    recentActivity,
    loading,
    error,
    refetch: fetchData,
  };
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  icon: Icon,
  loading,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="icon-box">
          <Icon size={20} />
        </div>

        <div className="trend">
          <ArrowUpRight size={12} />
          12%
        </div>
      </div>

      <div className="stat-value">
        {loading ? "..." : value}
      </div>

      <div className="stat-title">{title}</div>
    </div>
  );
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  onClick,
}) => {
  return (
    <div className="feature-card" onClick={onClick}>
      <div className="feature-icon">
        <Icon size={22} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <button>
        Get Started
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

/* =========================================================
   ACTIVITY ITEM
========================================================= */

const getActivityIcon = (type, status) => {
  switch (type) {
    case "prescription":
      return Pill;

    case "report":
      return status === "abnormal"
        ? AlertCircle
        : Microscope;

    default:
      return Bell;
  }
};

const ActivityCard = ({ item }) => {
  const Icon = getActivityIcon(item.type, item.status);

  return (
    <div className="activity-item">
      <div className="activity-icon">
        <Icon size={16} />
      </div>

      <div className="activity-content">
        <div className="activity-title">
          {item.title}
        </div>

        <div className="activity-description">
          {item.description}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    stats,
    recentActivity,
    loading,
    error,
    refetch,
  } = useDashboardData();

  const features = [
    {
      title: "Prescription Digitizer",
      description:
        "Upload prescriptions and detect medicine conflicts.",
      path: "/prescription",
      icon: FileText,
    },
    {
      title: "Symptom Tracker",
      description:
        "Track daily symptoms and generate reports.",
      path: "/symptom-tracker",
      icon: Activity,
    },
    {
      title: "Report Organizer",
      description:
        "Analyze blood reports and abnormalities.",
      path: "/reports",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0f172a;
          color: white;
          font-family: sans-serif;
        }

        .dashboard {
          min-height: 100vh;
          padding: 30px;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .header p {
          color: #94a3b8;
        }

        .error-box {
          background: rgba(255,0,0,0.1);
          border: 1px solid rgba(255,0,0,0.2);
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .retry-btn {
          margin-top: 10px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .icon-box {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(255,255,255,0.08);
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #22c55e;
          font-size: 12px;
        }

        .stat-value {
          font-size: 34px;
          margin-top: 20px;
          font-weight: bold;
        }

        .stat-title {
          color: #94a3b8;
          margin-top: 6px;
        }

        .section-title {
          margin-bottom: 20px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .feature-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 24px;
          border-radius: 20px;
          cursor: pointer;
          transition: 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.08);
          margin-bottom: 20px;
        }

        .feature-card h3 {
          margin-bottom: 10px;
        }

        .feature-card p {
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .feature-card button {
          border: none;
          background: #3b82f6;
          color: white;
          padding: 10px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .activity-section {
          background: rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .activity-item {
          display: flex;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .activity-title {
          font-weight: 600;
        }

        .activity-description {
          color: #94a3b8;
          font-size: 14px;
          margin-top: 4px;
        }

        @media(max-width:768px){
          .dashboard{
            padding:20px;
          }

          .header h1{
            font-size:32px;
          }
        }
      `}</style>

      <div className="dashboard">
        <div className="header">
          <h1>Health Dashboard 👋</h1>
          <p>
            Manage prescriptions, reports, and symptoms
            in one place.
          </p>
        </div>

        {error && (
          <div className="error-box">
            {error}

            <button
              className="retry-btn"
              onClick={refetch}
            >
              Retry
            </button>
          </div>
        )}

        <div className="stats-grid">
          <StatCard
            title="Prescriptions"
            value={stats.prescriptions}
            icon={Pill}
            loading={loading}
          />

          <StatCard
            title="Symptoms"
            value={stats.symptomEntries}
            icon={ClipboardList}
            loading={loading}
          />

          <StatCard
            title="Reports"
            value={stats.reports}
            icon={FileSpreadsheet}
            loading={loading}
          />

          <StatCard
            title="Alerts"
            value={stats.abnormalAlerts}
            icon={AlertCircle}
            loading={loading}
          />
        </div>

        <div className="section-title">
          <h2>Health Tools</h2>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              onClick={() => navigate(feature.path)}
            />
          ))}
        </div>

        <div className="activity-section">
          <h2 style={{ marginBottom: 20 }}>
            <Clock size={18} style={{ marginRight: 8 }} />
            Recent Activity
          </h2>

          {loading ? (
            <p>Loading activity...</p>
          ) : recentActivity.length === 0 ? (
            <p>No recent activity</p>
          ) : (
            recentActivity.map((item) => (
              <ActivityCard
                key={item.id}
                item={item}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;