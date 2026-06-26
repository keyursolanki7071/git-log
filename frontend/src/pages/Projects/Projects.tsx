import React from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Badge } from '../../components/Badge/Badge';
import { Search, FolderPlus, GitBranch, Clock, MoreVertical } from 'lucide-react';
import './Projects.css';

export const Projects: React.FC = () => {
  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1>Your Projects</h1>
          <p className="text-body-sm">Manage your connected repositories and report settings.</p>
        </div>
        <Button variant="primary" size="md">
          <FolderPlus size={16} /> New Project
        </Button>
      </header>

      <div className="projects-toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <Input placeholder="Search projects by name or repo..." fullWidth className="search-input" />
        </div>
        <div className="filters">
          <Button variant="secondary" size="md">All Projects</Button>
          <Button variant="ghost" size="md">Favorites</Button>
        </div>
      </div>

      <div className="projects-grid">
        {/* Project Card 1 */}
        <Card interactive className="project-card">
          <div className="project-card-header">
            <div>
              <h3>git-log-frontend</h3>
              <div className="repo-info">
                <GitBranch size={14} /> <span>main</span>
              </div>
            </div>
            <button className="icon-button"><MoreVertical size={18} /></button>
          </div>
          
          <div className="project-card-body">
            <p className="text-body-sm">React dashboard for the GitLog AI client. Includes all components and routing.</p>
          </div>

          <div className="project-card-footer">
            <div className="project-meta">
              <Clock size={14} /> <span>Updated 2 hrs ago</span>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>

        {/* Project Card 2 */}
        <Card interactive className="project-card">
          <div className="project-card-header">
            <div>
              <h3>core-api</h3>
              <div className="repo-info">
                <GitBranch size={14} /> <span>production</span>
              </div>
            </div>
            <button className="icon-button"><MoreVertical size={18} /></button>
          </div>
          
          <div className="project-card-body">
            <p className="text-body-sm">Python FastAPI backend handling Git parsing and AI report generation.</p>
          </div>

          <div className="project-card-footer">
            <div className="project-meta">
              <Clock size={14} /> <span>Updated 1 day ago</span>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>

        {/* Project Card 3 */}
        <Card interactive className="project-card project-card-disabled">
          <div className="project-card-header">
            <div>
              <h3>legacy-webapp</h3>
              <div className="repo-info">
                <GitBranch size={14} /> <span>master</span>
              </div>
            </div>
            <button className="icon-button"><MoreVertical size={18} /></button>
          </div>
          
          <div className="project-card-body">
            <p className="text-body-sm">Old AngularJS application. Archived but retained for historical reports.</p>
          </div>

          <div className="project-card-footer">
            <div className="project-meta">
              <Clock size={14} /> <span>Updated 6 mos ago</span>
            </div>
            <Badge variant="neutral">Archived</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};
