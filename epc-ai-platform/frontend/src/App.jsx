import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComplianceAgent from "./pages/ComplianceAgent.jsx";
import ScheduleRisk from "./pages/ScheduleRisk.jsx";
import SupplyChain from "./pages/SupplyChain.jsx";
import Commissioning from "./pages/Commissioning.jsx";
import RFICopilot from "./pages/RFICopilot.jsx";
import AuditTrail from "./pages/AuditTrail.jsx";

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("nexus_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  if (!user && !isLanding && !isLogin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {!isLanding && !isLogin && <Sidebar />}
      <main className={`flex-1 ${isLanding || isLogin ? "" : "px-8 py-8 max-w-[1400px]"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={setUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compliance" element={<ComplianceAgent />} />
          <Route path="/schedule-risk" element={<ScheduleRisk />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/commissioning" element={<Commissioning />} />
          <Route path="/rfi-copilot" element={<RFICopilot />} />
          <Route path="/audit-trail" element={<AuditTrail />} />
        </Routes>
      </main>
    </div>
  );
}
