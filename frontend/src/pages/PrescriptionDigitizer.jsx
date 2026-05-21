import { useState, useRef, useCallback } from "react";

const SAMPLE_MEDICINES = [
  {
    id: 1,
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "Twice a day",
    duration: "5 days",
    type: "Analgesic",
  },
  {
    id: 2,
    name: "Amoxicillin",
    dosage: "250mg",
    frequency: "Three times a day",
    duration: "7 days",
    type: "Antibiotic",
  },
  {
    id: 3,
    name: "Omeprazole",
    dosage: "20mg",
    frequency: "Once a day",
    duration: "14 days",
    type: "PPI",
  },
];

const typeColors = {
  Analgesic: {
    bg: "rgba(56,189,248,.12)",
    color: "#38bdf8",
    border: "rgba(56,189,248,.22)",
  },

  Antibiotic: {
    bg: "rgba(167,139,250,.12)",
    color: "#a78bfa",
    border: "rgba(167,139,250,.22)",
  },

  PPI: {
    bg: "rgba(74,222,128,.12)",
    color: "#4ade80",
    border: "rgba(74,222,128,.22)",
  },

  default: {
    bg: "rgba(148,163,184,.12)",
    color: "#94a3b8",
    border: "rgba(148,163,184,.22)",
  },
};

const PrescriptionDigitizer = () => {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] =
    useState("");

  const [dragOver, setDragOver] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [medicines, setMedicines] =
    useState([]);

  const handleExtract =
    useCallback(() => {
      if (!fileName) return;

      setLoading(true);

      setTimeout(() => {
        setMedicines(SAMPLE_MEDICINES);

        setLoading(false);
      }, 1800);
    }, [fileName]);

  const handleDelete = useCallback(
    (id) => {
      setMedicines((prev) =>
        prev.filter((med) => med.id !== id)
      );
    },
    []
  );

  const handleEdit = useCallback(
    (id, field, value) => {
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === id
            ? {
                ...med,
                [field]: value,
              }
            : med
        )
      );
    },
    []
  );

  const handleAdd = useCallback(() => {
    const id = Date.now();

    const newMedicine = {
      id,
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      type: "default",
    };

    setMedicines((prev) => [
      ...prev,
      newMedicine,
    ]);

    setEditId(id);
  }, []);

  const handleFile = useCallback((file) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      alert(
        "Only JPG, PNG, and PDF files are allowed"
      );

      return;
    }

    setFileName(file.name);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0b1120;
          font-family: 'DM Sans', sans-serif;
        }

        .pd-page {
          min-height: 100vh;
          padding: 30px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          background:
            radial-gradient(circle at top left, rgba(59,130,246,.18), transparent 30%),
            radial-gradient(circle at bottom right, rgba(168,85,247,.16), transparent 30%),
            #0b1120;
          position: relative;
          overflow: hidden;
        }

        .pd-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
          background-size: 42px 42px;
          pointer-events: none;
        }

        .pd-card {
          width: 100%;
          max-width: 850px;
          border-radius: 28px;
          padding: 36px;
          background: rgba(15,23,42,.78);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow:
            0 30px 80px rgba(0,0,0,.45),
            inset 0 1px 0 rgba(255,255,255,.04);
          position: relative;
          overflow: hidden;
          animation: fadeUp .5s ease;
        }

        .pd-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(56,189,248,.8),
            transparent
          );
        }

        .pd-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .pd-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pd-logo {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background:
            linear-gradient(
              135deg,
              rgba(59,130,246,.25),
              rgba(168,85,247,.18)
            );
          border: 1px solid rgba(255,255,255,.08);
        }

        .pd-title {
          font-size: 30px;
          color: #f8fafc;
          font-family: 'Playfair Display', serif;
          margin-bottom: 6px;
        }

        .pd-subtitle {
          color: #94a3b8;
          font-size: 14px;
        }

        .pd-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4ade80;
          font-size: 13px;
          font-weight: 600;
        }

        .pd-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 1.5s infinite;
        }

        .pd-upload {
          border: 2px dashed rgba(255,255,255,.12);
          border-radius: 22px;
          padding: 42px 24px;
          text-align: center;
          cursor: pointer;
          transition: all .25s ease;
          background: rgba(255,255,255,.03);
        }

        .pd-upload:hover,
        .pd-upload.drag {
          border-color: #38bdf8;
          background: rgba(56,189,248,.06);
        }

        .pd-upload-icon {
          font-size: 42px;
          margin-bottom: 14px;
        }

        .pd-upload-title {
          color: #f8fafc;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .pd-upload-sub {
          color: #64748b;
          font-size: 13px;
        }

        .pd-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
          margin-bottom: 30px;
        }

        .pd-btn {
          border: none;
          border-radius: 14px;
          padding: 13px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all .25s ease;
        }

        .pd-btn-primary {
          color: white;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed,
              #06b6d4
            );
          background-size: 200% auto;
        }

        .pd-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          background-position: right center;
        }

        .pd-btn-secondary {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          color: #cbd5e1;
        }

        .pd-btn-secondary:hover {
          border-color: rgba(167,139,250,.4);
          color: #a78bfa;
        }

        .pd-btn:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .pd-divider {
          height: 1px;
          background: rgba(255,255,255,.06);
          margin: 26px 0;
        }

        .pd-section-title {
          font-size: 22px;
          color: #f8fafc;
          margin-bottom: 18px;
          font-family: 'Playfair Display', serif;
        }

        .pd-med {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 18px;
          border-radius: 20px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.06);
          margin-bottom: 14px;
          transition: all .25s ease;
          flex-wrap: wrap;
        }

        .pd-med:hover {
          border-color: rgba(56,189,248,.25);
          background: rgba(56,189,248,.04);
        }

        .pd-med-number {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a78bfa;
          font-weight: 700;
          background: rgba(167,139,250,.08);
          border: 1px solid rgba(167,139,250,.14);
          flex-shrink: 0;
        }

        .pd-med-content {
          flex: 1;
          min-width: 220px;
        }

        .pd-med-name {
          color: #f8fafc;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .pd-pill-wrap {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .pd-pill {
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .pd-actions-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pd-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
          color: #f8fafc;
          margin-bottom: 10px;
        }

        .pd-input:focus {
          outline: none;
          border-color: #8b5cf6;
        }

        .pd-empty {
          text-align: center;
          padding: 50px 20px;
        }

        .pd-empty-icon {
          font-size: 50px;
          margin-bottom: 14px;
        }

        .pd-empty-text {
          color: #64748b;
          font-size: 14px;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,100% {
            opacity: 1;
          }

          50% {
            opacity: .4;
          }
        }

        @media (max-width: 640px) {
          .pd-card {
            padding: 24px 18px;
          }

          .pd-title {
            font-size: 24px;
          }

          .pd-header {
            align-items: flex-start;
          }

          .pd-actions {
            flex-direction: column;
          }

          .pd-btn {
            width: 100%;
          }
        }
      `}</style>

      <main className="pd-page">
        <section className="pd-card">
          <header className="pd-header">
            <div className="pd-header-left">
              <div className="pd-logo">
                💊
              </div>

              <div>
                <h1 className="pd-title">
                  Prescription Digitizer
                </h1>

                <p className="pd-subtitle">
                  Upload prescriptions and extract
                  medicines instantly
                </p>
              </div>
            </div>

            <div className="pd-status">
              <span className="pd-dot" />
              AI Ready
            </div>
          </header>

          {/* UPLOAD */}
          <div
            className={`pd-upload ${
              dragOver ? "drag" : ""
            }`}
            onClick={() =>
              fileRef.current?.click()
            }
            onDragOver={(e) => {
              e.preventDefault();

              setDragOver(true);
            }}
            onDragLeave={() =>
              setDragOver(false)
            }
            onDrop={(e) => {
              e.preventDefault();

              setDragOver(false);

              handleFile(
                e.dataTransfer.files[0]
              );
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(e) =>
                handleFile(
                  e.target.files?.[0]
                )
              }
            />

            <div className="pd-upload-icon">
              📋
            </div>

            {fileName ? (
              <>
                <p className="pd-upload-title">
                  {fileName}
                </p>

                <p className="pd-upload-sub">
                  Click to change file
                </p>
              </>
            ) : (
              <>
                <p className="pd-upload-title">
                  Drop prescription here
                </p>

                <p className="pd-upload-sub">
                  JPG, PNG, PDF supported
                </p>
              </>
            )}
          </div>

          {/* ACTIONS */}
          <div className="pd-actions">
            <button
              className="pd-btn pd-btn-primary"
              onClick={handleExtract}
              disabled={
                loading || !fileName
              }
            >
              {loading
                ? "Extracting..."
                : "✦ Extract Medicines"}
            </button>

            {medicines.length > 0 && (
              <>
                <button
                  className="pd-btn pd-btn-secondary"
                  onClick={handleAdd}
                >
                  + Add Medicine
                </button>

                <button
                  className="pd-btn pd-btn-secondary"
                  onClick={() =>
                    setMedicines([])
                  }
                >
                  Clear All
                </button>
              </>
            )}
          </div>

          {medicines.length > 0 && (
            <>
              <div className="pd-divider" />

              <h2 className="pd-section-title">
                Extracted Medicines
              </h2>
            </>
          )}

          {/* MEDICINES */}
          {medicines.map((med, index) => {
            const tc =
              typeColors[med.type] ||
              typeColors.default;

            const isEditing =
              editId === med.id;

            return (
              <article
                key={med.id}
                className="pd-med"
              >
                <div className="pd-med-number">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div className="pd-med-content">
                  {isEditing ? (
                    <>
                      {[
                        "name",
                        "dosage",
                        "frequency",
                        "duration",
                      ].map((field) => (
                        <input
                          key={field}
                          className="pd-input"
                          placeholder={field}
                          value={med[field]}
                          onChange={(e) =>
                            handleEdit(
                              med.id,
                              field,
                              e.target.value
                            )
                          }
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      <h3 className="pd-med-name">
                        {med.name || "—"}
                      </h3>

                      <div className="pd-pill-wrap">
                        {med.dosage && (
                          <span
                            className="pd-pill"
                            style={{
                              background:
                                "rgba(56,189,248,.12)",
                              color:
                                "#38bdf8",
                            }}
                          >
                            {med.dosage}
                          </span>
                        )}

                        {med.frequency && (
                          <span
                            className="pd-pill"
                            style={{
                              background:
                                "rgba(167,139,250,.12)",
                              color:
                                "#a78bfa",
                            }}
                          >
                            {
                              med.frequency
                            }
                          </span>
                        )}

                        {med.duration && (
                          <span
                            style={{
                              color:
                                "#64748b",
                              fontSize: 13,
                            }}
                          >
                            •{" "}
                            {med.duration}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="pd-actions-right">
                  <span
                    className="pd-pill"
                    style={{
                      background: tc.bg,
                      color: tc.color,
                      border: `1px solid ${tc.border}`,
                    }}
                  >
                    {med.type}
                  </span>

                  <button
                    className="pd-btn pd-btn-secondary"
                    style={{
                      padding:
                        "8px 14px",
                    }}
                    onClick={() =>
                      setEditId(
                        isEditing
                          ? null
                          : med.id
                      )
                    }
                  >
                    {isEditing
                      ? "Done"
                      : "Edit"}
                  </button>

                  <button
                    className="pd-btn pd-btn-secondary"
                    style={{
                      padding:
                        "8px 14px",
                    }}
                    onClick={() =>
                      handleDelete(
                        med.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}

          {!loading &&
            medicines.length === 0 && (
              <div className="pd-empty">
                <div className="pd-empty-icon">
                  🩺
                </div>

                <p className="pd-empty-text">
                  No medicines extracted yet
                </p>
              </div>
            )}
        </section>
      </main>
    </>
  );
};

export default PrescriptionDigitizer;