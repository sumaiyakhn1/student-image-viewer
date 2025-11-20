import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [scholarId, setScholarId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  const BACKEND_URL = "https://student-image-finder.onrender.com";

  // SEARCH STUDENT
  const handleSearch = async () => {
    if (!scholarId.trim()) {
      setError("Please enter a Scholar ID");
      return;
    }

    setLoading(true);
    setError("");
    setStudentData(null);

    try {
      const res = await axios.get(
        `${BACKEND_URL}/student/${encodeURIComponent(scholarId)}`
      );
      setStudentData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Student not found");
    } finally {
      setLoading(false);
    }
  };

  // REFRESH SHEET
  const handleRefresh = async () => {
    try {
      await axios.get(`${BACKEND_URL}/refresh-sheet`);
      alert("Sheet refreshed successfully!");
    } catch (err) {
      alert("Failed to refresh sheet.");
    }
  };

  // ESC closes popup
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Map for Photos & Documents section
  const imageMap = [
    {
      label: "Father",
      imgField: "Father's Photograph",
      nameField: "Father Name",
    },
    {
      label: "Mother",
      imgField: "Mother's Photograph",
      nameField: "Mother Name",
    },
    {
      label: "Guardian",
      imgField: "Guardian's Photo",
      nameField: null,
    },
    {
      label: "Grandfather",
      imgField: "Grandfather's Photograph",
      nameField: "Grandfather's Name",
    },
    {
      label: "Grandmother",
      imgField: "Grandmother's Photograph",
      nameField: "Grandmother's Name",
    },

    // Sibling 1
    {
      label: "Sibling 1",
      imgField: "Sibling-1 Photograph (Real brother/sister)",
      nameField: "Sibling-1 Name",
      idField: "Sibling-1 Scholar ID",
    },
    {
      label: "Sibling 1 — Aadhar",
      imgField: "Aadhar Card Of Sibling 1",
      nameField: "Sibling-1 Name",
      idField: "Sibling-1 Scholar ID",
    },

    // Sibling 2
    {
      label: "Sibling 2",
      imgField: "Sibling-2 Photograph (Real brother/sister)",
      nameField: "Sibling-2 Name",
      idField: "Sibling-2 Scholar ID",
    },
    {
      label: "Sibling 2 — Aadhar",
      imgField: "Aadhar Card Of Sibling 2",
      nameField: "Sibling-2 Name",
      idField: "Sibling-2 Scholar ID",
    },
  ];

  return (
    <div className="page">
      {/* Background blobs */}
      <div className="blob1" />
      <div className="blob2" />

      {/* Logo */}
      <div className="logo-box">
        <img src="/logo.png" alt="Logo" />
        <div>
          <h1>Okie Dokie</h1>
          <div className="subtitle">Student Search – Kids Friendly</div>
        </div>
      </div>

      {/* White Search Card */}
      <div className="search-wrapper">
        <h2 className="title">Find a Student 🎒</h2>
        <p className="subtitle">Search using Scholar ID.</p>

        <div className="search">
          <input
            type="text"
            placeholder="Enter Scholar ID e.g. 2074"
            value={scholarId}
            onChange={(e) => setScholarId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="btn btn-search" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-refresh" onClick={handleRefresh}>
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <p className="loading-text">Fetching student details…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="error-box">❌ {error}</div>
        )}

        {/* Empty message */}
        {!studentData && !loading && !error && (
          <div className="info-section">
            <div className="info-box">
              <h3>📚 No student selected</h3>
              <p>Start typing above to search any student by ID.</p>
            </div>
          </div>
        )}
      </div>

      {/* Student + Photos Layout */}
      {studentData && !loading && (
        <div className="result-layout">
          {/* Student card */}
          <div className="student-card">
            {studentData["Student's Photograph"] && (
              <img
                src={studentData["Student's Photograph"]}
                alt="Student"
                className="student-photo"
                onClick={() =>
                  setActiveImage(studentData["Student's Photograph"])
                }
              />
            )}
            <h2 className="student-name">
              {studentData["Student Name"] || "—"}
            </h2>
            <p>
              <strong>Scholar ID:</strong>{" "}
              {studentData["Scholar ID"] || "—"}
            </p>
            <p>
              <strong>Class:</strong>{" "}
              {studentData["Course"] || "—"}
            </p>
            <p>
              <strong>Stream:</strong>{" "}
              {studentData["Stream"] || "—"}
            </p>
            <p>
              <strong>Section:</strong>{" "}
              {studentData["Section"] || "—"}
            </p>
          </div>

          {/* Photos & Documents */}
          <div className="photos-card">
            <h3 className="photos-title">Photos &amp; Documents</h3>

            <div className="photos-grid">
              {imageMap.map((item) => {
                const url = studentData[item.imgField];
                const name = item.nameField
                  ? studentData[item.nameField]
                  : null;
                const siblingId = item.idField
                  ? studentData[item.idField]
                  : null;

                // Hide card if nothing to show
                if (!url && !name && !siblingId) return null;

                return (
                  <div className="photo-card" key={item.label}>
                    {url ? (
                      <img
                        src={url}
                        alt={item.label}
                        className="photo-img"
                        onClick={() => setActiveImage(url)}
                      />
                    ) : (
                      <div className="photo-placeholder">No Image</div>
                    )}
                    <div className="photo-label">{item.label}</div>
                    {name && <div className="photo-name">{name}</div>}
                    {siblingId && (
                      <div className="photo-id">Scholar ID: {siblingId}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Image popup */}
      {activeImage && (
        <div
          className="popup-overlay"
          onClick={(e) =>
            e.target.classList.contains("popup-overlay") &&
            setActiveImage(null)
          }
        >
          <div className="popup-content">
            <button
              className="popup-close"
              onClick={() => setActiveImage(null)}
            >
              ✕
            </button>
            <img src={activeImage} alt="preview" className="popup-image" />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        Crafted with ❤️ by <span>Okie Dokie</span>
      </div>
    </div>
  );
}

export default App;
