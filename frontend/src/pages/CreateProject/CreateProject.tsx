import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { ArrowLeft, Rocket } from 'lucide-react';
import './CreateProject.css';

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="create-project-page">
      <div className="create-container">
        <header className="page-header mb-4">
          <div>
            <div className="flex-center-gap mb-2">
              <button className="back-btn" onClick={() => navigate('/select-repo')}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <h1>Create Project</h1>
            <p className="text-body-sm">Configure your new AI-powered GitLog project.</p>
          </div>
        </header>

        <Card padding="lg" className="create-card">
          <div className="form-group">
            <Input label="Project Name" placeholder="e.g., Core API Analytics" fullWidth />
            <p className="form-hint">This will be used to identify your project on the dashboard.</p>
          </div>

          <div className="form-group">
            <label className="input-label">Selected Repository</label>
            <div className="selected-repo-box">
              <span className="text-body-base">core-api</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/select-repo')}>Change</Button>
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Report Frequency</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="freq" value="daily" />
                <span>Daily</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="freq" value="weekly" defaultChecked />
                <span>Weekly</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="freq" value="monthly" />
                <span>Monthly</span>
              </label>
            </div>
          </div>
          
          <div className="form-actions mt-4 pt-4 border-top">
            <Button variant="ghost" onClick={() => navigate('/projects')}>Cancel</Button>
            <Button variant="ai">
              <Rocket size={16} /> Initialize Project
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
