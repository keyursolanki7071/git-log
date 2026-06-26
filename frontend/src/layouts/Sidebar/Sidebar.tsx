import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Activity, Settings, GitPullRequest, Plus } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
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
          <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FolderOpen size={18} />
            <span>Projects</span>
          </NavLink>
          <NavLink to="/activity" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={18} />
            <span>Activity Log</span>
          </NavLink>
        </div>

        <div className="sidebar-section mt-auto">
          <div className="px-3 mb-2">
            <Button variant="ai" size="sm" fullWidth>
              <Plus size={16} /> New Report
            </Button>
          </div>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
