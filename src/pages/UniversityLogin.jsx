import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UniversityLogin() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (code === "AKTU123") {
      navigate("/login", { state: { university: "AKTU" } });
    } else {
      alert("Invalid Code");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Enter University Code</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="AKTU123"
      />
      <br /><br />
      <button onClick={handleLogin}>Connect</button>
    </div>
  );
}

export default UniversityLogin;