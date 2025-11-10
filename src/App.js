import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [scholarId, setScholarId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Replace with your Render URL if different
  const BACKEND_URL = "https://student-image-finder.onrender.com";

  const fetchStudent = async () => {
    if (!scholarId.trim()) {
      setError("Please enter Scholar ID");
      return;
    }
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

  // map image fields to friendly labels and associated name fields
  const imageMap = [
    { label: "Student", imgField: "Student's Photograph", nameField: "Student Name" },
    { label: "Father", imgField: "Father's Photograph", nameField: "Father Name" },
    { label: "Mother", imgField: "Mother's Photograph", nameField: "Mother Name" },
    { label: "Guardian", imgField: "Guardian's Photo", nameField: "Guardian's Name" },
    { label: "Grandfather", imgField: "Grandfather's Photograph", nameField: "Grandfather's Name" },
    { label: "Grandmother", imgField: "Grandmother's Photograph", nameField: "Grandmother's Name" },
    { label: "Sibling 1", imgField: "Sibling-1 Photograph (Real brother/sister)", nameField: "Sibling-1 Name" },
    { label: "Sibling 2", imgField: "Sibling-2 Photograph (Real brother/sister)", nameField: "Sibling-2 Name" },
    { label: "Sibling 1 Aadhar", imgField: "Aadhar Card Of Sibling 1", nameField: null },
    { label: "Sibling 2 Aadhar", imgField: "Aadhar Card Of Sibling 2", nameField: null }
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
          <div className="brand-logo">
  <img src="/logo.png" alt="Okie Dokie Logo" className="logo-img" />
</div>

            <div>
              <div className="brand-title">Okie Dokie</div>
              <div className="brand-sub">Student Info</div>
            </div>
          </div>
          <div className="created-by">Created by Okie Dokie</div>
        </div>
      </header>

      <main className="container">
    


        <section className="search-area">
          <input
            className="search-input"
            placeholder="Enter Scholar ID (e.g. 2172/2016)"
            value={scholarId}
            onChange={(e) => setScholarId(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") fetchStudent(); }}
          />
          <button className="search-btn" onClick={fetchStudent} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </section>

        {error && <div className="msg error">{error}</div>}

        {studentData && (
          <>
            {/* Top: Large student image + main details */}
            <section className="top-card">
              <div className="top-left">
                {studentData["Student's Photograph"] ? (
                  <img className="main-photo" src={studentData["Student's Photograph"]} alt="Student" />
                ) : (
                  <div className="main-photo placeholder">No Photo</div>
                )}
              </div>
              <div className="top-right">
                <h2 className="student-name">{studentData["Student Name"] || "—"}</h2>
                <div className="meta-grid">
                  <div><span className="meta-label">Scholar ID</span><div className="meta-value">{studentData["Scholar ID"] || "—"}</div></div>
                  <div><span className="meta-label">Course</span><div className="meta-value">{studentData["Course"] || "—"}</div></div>
                  <div><span className="meta-label">Stream</span><div className="meta-value">{studentData["Stream"] || "—"}</div></div>
                  <div><span className="meta-label">Section</span><div className="meta-value">{studentData["Section"] || "—"}</div></div>
                  <div><span className="meta-label">Father</span><div className="meta-value">{studentData["Father Name"] || "—"}</div></div>
                  <div><span className="meta-label">Mother</span><div className="meta-value">{studentData["Mother Name"] || "—"}</div></div>
                </div>
              </div>
            </section>

            {/* Other photos in cards */}
            <section className="cards-section">
              <h3 className="cards-title">Photos & Documents</h3>
              <div className="cards-grid">
                {imageMap.map((item) => {
                  const url = studentData[item.imgField];
                  const personName = item.nameField ? studentData[item.nameField] : null;
                  // show card if either image or name/field exists
                  if (!url && !personName) return null;
                  return (
                    <div className="card" key={item.imgField || item.label}>
                      <div className="card-label">{item.label}</div>
                      {url ? (
                        <img className="card-img" src={url} alt={item.label} />
                      ) : (
                        <div className="card-img placeholder">No Image</div>
                      )}
                      {personName && <div className="card-name">{personName}</div>}
                    </div>
                  );
                })}
              </div>
            </section>
        </>
        )}
        
      </main>

      <footer className="footer">
        <div>Okie Dokie • Student Image Finder</div>
      </footer>
    </div>
  );
}

export default App;
