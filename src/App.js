import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [scholarId, setScholarId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL = "https://student-image-finder.onrender.com";

  const fetchStudent = async () => {
    if (!scholarId.trim()) return setError("Please enter a Scholar ID or Name");
    setLoading(true);
    setError("");
    setStudentData(null);

    try {
      const res = await axios.get(`${BACKEND_URL}/student/${encodeURIComponent(scholarId)}`);
      setStudentData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Student not found or server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      const messages = [
        "Fetching student details...",
        "Verifying scholar ID...",
        "Checking image links...",
        "Almost done...",
      ];
      let index = 0;
      const textElement = document.getElementById("loading-text");
      if (textElement) textElement.textContent = messages[index];
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        if (textElement) textElement.textContent = messages[index];
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const imageMap = [
    { label: "Father", imgField: "Father's Photograph", nameField: "Father Name" },
    { label: "Mother", imgField: "Mother's Photograph", nameField: "Mother Name" },
    { label: "Grandfather", imgField: "Grandfather's Photograph", nameField: "Grandfather's Name" },
    { label: "Grandmother", imgField: "Grandmother's Photograph", nameField: "Grandmother's Name" },
    { label: "Sibling 1", imgField: "Sibling-1 Photograph (Real brother/sister)", nameField: "Sibling-1 Name" },
    { label: "Sibling 2", imgField: "Sibling-2 Photograph (Real brother/sister)", nameField: "Sibling-2 Name" },
  ];

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <div className="brand">
            <img
              src="https://okiedokie-erp-images.s3.ap-south-1.amazonaws.com/Okie%20Dokie/2025/02/sourceURL/611ed1b9032568edd4f3-Okie%20Dokie%20App%20icon%20%282%29.png"
              alt="Okie Dokie Logo"
              className="brand-logo"
            />
            <h1 className="brand-title">Okie Dokie — Student Info</h1>
          </div>
          <div className="created-by">Created by Okie Dokie</div>
        </div>
      </header>

      {/* SEARCH BAR */}
      <section className="search-area">
        <input
          className="search-input"
          placeholder="Enter Scholar ID (e.g. 2172)"
          value={scholarId}
          onChange={(e) => setScholarId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchStudent()}
        />
        <button className="search-btn" onClick={fetchStudent} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </section>

      {/* LOADER */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text" id="loading-text"></p>
        </div>
      )}

      {/* ERROR */}
      {error && <div className="msg error">{error}</div>}

      {/* MAIN UI */}
      {studentData && !loading && (
        <div className="main-layout">
          {/* STUDENT CARD */}
          <div className="student-card">
  <div className="student-photo-wrapper">
    <img
      src={studentData["Student's Photograph"]}
      alt="Student"
      className="student-photo"
       loading="lazy"
    />
    <img
      src={studentData["Student's Photograph"]}
      alt="Student Enlarged"
      className="student-photo-popup"
      aria-hidden="true"
       loading="lazy"
    />
  </div>

  <h2>{studentData["Student Name"]}</h2>
  <p><strong>Scholar ID:</strong> {studentData["Scholar ID"]}</p>
  <p><strong>Stream:</strong> {studentData["Stream"]}</p>
  <p><strong>Course:</strong> {studentData["Course"]}</p>
</div>


          {/* PHOTOS GRID */}
          <div className="photos-container">
            <h3>Photos & Documents</h3>
            <div className="photos-grid">
              {imageMap.map((item) => {
                const url = studentData[item.imgField];
                const personName = item.nameField ? studentData[item.nameField] : null;
                if (!url && !personName) return null;
                return (
                  <div className="photo-card" key={item.label}>
                    {url ? (
                      <>
                        <img
                          src={url}
                          alt={item.label}
                          className="photo"
                           loading="lazy"
                        />
                        {/* Hover popup duplicate image */}
                        <img
                          src={url}
                          alt={`${item.label} enlarged`}
                          className="photo-popup"
                          aria-hidden="true"
                           loading="lazy"
                        />
                      </>
                    ) : (
                      <div className="photo placeholder">No Image</div>
                    )}
                    <div className="photo-label">{item.label}</div>
                    {personName && <div className="photo-name">{personName}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <footer className="footer">Okie Dokie • Student Image Finder</footer>
    </div>
  );
}

export default App;
