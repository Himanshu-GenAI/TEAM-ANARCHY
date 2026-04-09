import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UniversityLogin from "./pages/UniversityLogin";
import UserLogin from "./pages/UserLogin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UniversityLogin />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;