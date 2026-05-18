import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { MainLayout } from "./components/layout/MainLayout";

// Public
import { LoginPage } from "./pages/LoginPage";

// Employee
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { CreateGoalSheet } from "./pages/employee/CreateGoalSheet";

// Manager
import { ManagerDashboard } from "./pages/manager/ManagerDashboard";
import { ManagerApprovals } from "./pages/manager/ManagerApprovals";

// Admin
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminAuditLog } from "./pages/admin/AdminAuditLog";
import { AdminEscalations } from "./pages/admin/AdminEscalations";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Employee */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/goals/create" element={<CreateGoalSheet />} />
            <Route path="/employee/goals" element={<EmployeeDashboard />} />
            <Route path="/employee/checkin" element={<EmployeeDashboard />} />

            {/* Manager */}
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/manager/approvals" element={<ManagerApprovals />} />
            <Route path="/manager/reviews" element={<ManagerDashboard />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/audit" element={<AdminAuditLog />} />
            <Route path="/admin/escalations" element={<AdminEscalations />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
