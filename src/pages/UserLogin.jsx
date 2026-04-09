import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UserLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  const university = location.state?.university;

  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (id && password) {
      navigate("/dashboard", { state: { role, university } });
    } else {
      alert("Fill all fields");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{university} Login</h2>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
      </select>

      <br /><br />

      <input
        placeholder="ID"
        onChange={(e) => setId(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default UserLogin;