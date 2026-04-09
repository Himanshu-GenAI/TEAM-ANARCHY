import React from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const { role, university } = location.state || {};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{university} Dashboard</h1>
      <h3>Role: {role}</h3>

      <p>Attendance: 72%</p>
      <p>Assignments Due: 1</p>
      <p>Alert: Low attendance</p>
    </div>
  );
}

export default Dashboard;