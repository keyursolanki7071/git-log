import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Activity, LogOut, GitPullRequest } from 'lucide-react';

import { authApi } from '../../api/auth';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <GitPullRequest className="logo-icon" />
          <span className="logo-text">GitLog AI</span>
        </div>
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-section">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FolderOpen size={18} />
            <span>Accounts</span>
          </NavLink>
          <NavLink to="/repositories" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <GitPullRequest size={18} />
            <span>Repositories</span>
          </NavLink>
          <NavLink to="/activity" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={18} />
            <span>Activity Log</span>
          </NavLink>
        </div>

        <div className="sidebar-section mt-auto">
          <button onClick={handleLogout} className="nav-item" style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
