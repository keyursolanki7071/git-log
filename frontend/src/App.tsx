import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Projects } from './pages/Projects/Projects';
import { Welcome } from './pages/Welcome/Welcome';
import { ConnectGitHub } from './pages/ConnectGitHub/ConnectGitHub';
import { SelectRepository } from './pages/SelectRepository/SelectRepository';
import { CreateProject } from './pages/CreateProject/CreateProject';
import { ActivityLog } from './pages/ActivityLog/ActivityLog';
import { GeneratingReport } from './pages/GeneratingReport/GeneratingReport';
import { ReportPreview } from './pages/ReportPreview/ReportPreview';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/connect" element={<ConnectGitHub />} />
          <Route path="/select-repo" element={<SelectRepository />} />
          <Route path="/generating" element={<GeneratingReport />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="create" element={<CreateProject />} />
            <Route path="report-preview" element={<ReportPreview />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
