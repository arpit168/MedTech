import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Activity,
  FileSpreadsheet,
  Bell,
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

  // ---------------- FETCH DASHBOARD DATA ----------------
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
        abnormalAlerts: reports.filter(
          (report) => report?.abnormalCount > 0
        ).length,
      });

    } catch (error) {
      console.error("Dashboard Error:", error);

      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FEATURE CARDS ----------------
  const features = [
    {
      title: "Prescription Digitizer",
      icon: FileText,
      path: "/prescription",
      color: "var(--primary)",
      description:
        "Upload prescriptions, detect conflicts & duplicates",
    },
    {
      title: "Symptom Tracker",
      icon: Activity,
      path: "/symptom-tracker",
      color: "var(--secondary)",
      description:
        "Track symptoms daily and generate doctor reports",
    },
    {
      title: "Report Organizer",
      icon: FileSpreadsheet,
      path: "/reports",
      color: "var(--primary-hover)",
      description:
        "Analyze blood tests and detect abnormalities",
    },
  ];

  return (
    <div
      className="container"
      style={{
        paddingTop: "90px",
        paddingBottom: "40px",
      }}
    >
      {/* ---------------- HEADER ---------------- */}
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            color: "var(--text)",
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          Welcome Back 👋
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "18px",
          }}
        >
          Manage your health records intelligently
        </p>
      </div>

      {/* ---------------- STATS ---------------- */}
      <div
        className="grid"
        style={{
          marginBottom: "40px",
          gap: "20px",
        }}
      >
        {/* PRESCRIPTIONS */}
        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <FileText
            size={40}
            color="var(--primary)"
            style={{ marginBottom: "12px" }}
          />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "8px",
              color: "var(--text)",
            }}
          >
            {loading ? "..." : stats.prescriptions}
          </h3>

          <p style={{ color: "gray" }}>
            Prescriptions Analyzed
          </p>
        </div>

        {/* SYMPTOMS */}
        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <Activity
            size={40}
            color="var(--secondary)"
            style={{ marginBottom: "12px" }}
          />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "8px",
              color: "var(--text)",
            }}
          >
            {loading ? "..." : stats.symptomEntries}
          </h3>

          <p style={{ color: "gray" }}>
            Symptom Entries
          </p>
        </div>

        {/* REPORTS */}
        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <FileSpreadsheet
            size={40}
            color="var(--primary-hover)"
            style={{ marginBottom: "12px" }}
          />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "8px",
              color: "var(--text)",
            }}
          >
            {loading ? "..." : stats.reports}
          </h3>

          <p style={{ color: "gray" }}>
            Reports Uploaded
          </p>
        </div>

        {/* ALERTS */}
        <div
          className="card"
          style={{
            textAlign: "center",
          }}
        >
          <Bell
            size={40}
            color={
              stats.abnormalAlerts > 0
                ? "var(--danger)"
                : "var(--secondary)"
            }
            style={{ marginBottom: "12px" }}
          />

          <h3
            style={{
              fontSize: "28px",
              marginBottom: "8px",
              color: "var(--text)",
            }}
          >
            {loading ? "..." : stats.abnormalAlerts}
          </h3>

          <p style={{ color: "gray" }}>
            Abnormal Alerts
          </p>
        </div>
      </div>

      {/* ---------------- FEATURES ---------------- */}
      <div
        className="grid"
        style={{
          gap: "24px",
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="card"
            onClick={() => navigate(feature.path)}
            style={{
              cursor: "pointer",
              transition: "0.3s ease",
            }}
          >
            <feature.icon
              size={50}
              color={feature.color}
              style={{ marginBottom: "18px" }}
            />

            <h3
              style={{
                fontSize: "22px",
                marginBottom: "12px",
                color: "var(--text)",
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{
                color: "gray",
                marginBottom: "18px",
                lineHeight: "1.6",
              }}
            >
              {feature.description}
            </p>

            <button className="btn btn-primary">
              Get Started →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;