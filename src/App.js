import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

function App() {
  const [scholarId, setScholarId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  const BACKEND_URL = "https://student-image-finder.onrender.com";

  const fetchStudent = async () => {
    if (!scholarId.trim()) {
      setError("Please enter a Scholar ID or Name");
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
      setError(err.response?.data?.detail || "Student not found or server error");
    } finally {
      setLoading(false);
    }
  };

  const refreshSheet = async () => {
    try {
      await axios.get(`${BACKEND_URL}/refresh-sheet`);
      alert("Sheet refreshed successfully!");
    } catch (err) {
      alert("Failed to refresh sheet!");
    }
  };

  // ESC closes popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const imageMap = [
    { label: "Father", imgField: "Father's Photograph", nameField: "Father Name" },
    { label: "Mother", imgField: "Mother's Photograph", nameField: "Mother Name" },
    { label: "Grandfather", imgField: "Grandfather's Photograph", nameField: "Grandfather's Name" },
    { label: "Grandmother", imgField: "Grandmother's Photograph", nameField: "Grandmother's Name" },
    { label: "Sibling 1", imgField: "Sibling-1 Photograph (Real brother/sister)", nameField: "Sibling-1 Name" },
    { label: "Sibling 1 — Aadhar", imgField: "Aadhar Card Of Sibling 1", nameField: "Sibling-1 Name" },
    { label: "Sibling 2", imgField: "Sibling-2 Photograph (Real brother/sister)", nameField: "Sibling-2 Name" },
    { label: "Sibling 2 — Aadhar", imgField: "Aadhar Card Of Sibling 2", nameField: "Sibling-2 Name" },
  ];

  return (
    <div className="app-screen">

      {/* ---------------- SEARCH BOX GLASS UI ---------------- */}
      <div className="glass-card search-card">

        <div className="search-input-wrapper">
          <input
            placeholder="Search by Scholar ID — e.g. 2074 "
            value={scholarId}
            onChange={(e) => setScholarId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchStudent()}
            className="search-input"
          />
          <FiSearch className="search-icon" />
        </div>

        <button className="btn-search" onClick={fetchStudent}>
          Search
        </button>

        <button className="btn-refresh" onClick={refreshSheet}>
          <FiRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* ---------------- NO STUDENT SELECTED PANEL ---------------- */}
      {!studentData && !loading && !error && (
        <div className="glass-card empty-box">
          No student selected — try searching by Scholar ID, name or mobile.
        </div>
      )}

      {/* ---------------- ERROR MESSAGE ---------------- */}
      {error && <div className="error-msg">{error}</div>}

      {/* ---------------- LOADING ---------------- */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Fetching student details…</p>
        </div>
      )}

      {/* ---------------- STUDENT DATA ---------------- */}
      {studentData && !loading && (
        <div className="main-layout">

          {/* STUDENT INFO CARD */}
          <div className="glass-card student-card">
            <img
              src={studentData["Student's Photograph"]}
              className="student-photo"
              alt="Student"
              onClick={() => setActiveImage(studentData["Student's Photograph"])}
            />
            <h2>{studentData["Student Name"]}</h2>
            <p><strong>ID:</strong> {studentData["Scholar ID"]}</p>
            <p><strong>Section:</strong> {studentData["Section"]}</p>
            <p><strong>Course:</strong> {studentData["Course"]}</p>
          </div>

          {/* FAMILY PHOTOS */}
          <div className="glass-card photos-card">
            <h3>Photos & Documents</h3>

            <div className="photos-grid">
              {imageMap.map((item) => {
                const url = studentData[item.imgField];
                const name = studentData[item.nameField];

                if (!url && !name) return null;

                return (
                  <div key={item.label} className="photo-card">
                    {url ? (
                      <img
                        src={url}
                        className="photo"
                        onClick={() => setActiveImage(url)}
                        alt={item.label}
                      />
                    ) : (
                      <div className="photo placeholder">No Image</div>
                    )}
                    <div className="photo-label">{item.label}</div>
                    {name && <div className="photo-name">{name}</div>}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ---------------- IMAGE POPUP ---------------- */}
      {activeImage && (
        <div
          className="popup-overlay"
          onClick={(e) =>
            e.target.classList.contains("popup-overlay") &&
            setActiveImage(null)
          }
        >
          <div className="popup-content">
            <button className="close-btn" onClick={() => setActiveImage(null)}>
              ✕
            </button>
            <img src={activeImage} className="popup-image" alt="preview" />
          </div>
        </div>
      )}

      <footer className="footer">
        crafted with 💖 by Okie Dokie
      </footer>
    </div>
  );
}

export default App;
