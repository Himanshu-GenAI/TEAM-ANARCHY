import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UniversityLogin() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (code === "AKTU123") {
      navigate("/login", { state: { university: "AKTU" } });
    } else {
      alert("Invalid University Code");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
          width: "400px",
        }}
      >
        <h1
          style={{
            color: "#1e3a8a",
            marginBottom: "10px",
            fontSize: "28px",
          }}
        >
          University Portal
        </h1>

        <h2
          style={{
            color: "#374151",
            marginBottom: "30px",
            fontSize: "20px",
          }}
        >
          Enter University Code
        </h2>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code (e.g. AKTU123)"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            marginBottom: "20px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Continue Login
        </button>
      </div>
    </div>
  );
}

export default UniversityLogin;