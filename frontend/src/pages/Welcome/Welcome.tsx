import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { GitPullRequest, Zap, Shield, GitCommit } from 'lucide-react';
import './Welcome.css';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-logo">
          <GitPullRequest className="logo-icon-lg" />
        </div>
        
        <h1 className="welcome-title">GitLog AI</h1>
        <p className="welcome-subtitle">
          Sophisticated, high-velocity insights for engineering leaders. 
          Connect your repositories and let our AI turn raw commit data into actionable reports.
        </p>

        <div className="feature-grid">
          <div className="feature-item">
            <Zap className="feature-icon" size={24} />
            <h3>Automated Reports</h3>
            <p className="text-body-sm">Generate sprint reviews and velocity reports instantly.</p>
          </div>
          <div className="feature-item">
            <GitCommit className="feature-icon" size={24} />
            <h3>Commit Analysis</h3>
            <p className="text-body-sm">Deep semantic understanding of every code change.</p>
          </div>
          <div className="feature-item">
            <Shield className="feature-icon" size={24} />
            <h3>Enterprise Ready</h3>
            <p className="text-body-sm">Secure, read-only access to your organization's code.</p>
          </div>
        </div>

        <div className="welcome-actions">
          <Button variant="ai" size="lg" onClick={() => navigate('/dashboard')}>
            Get Started
          </Button>
          <Button variant="ghost" size="lg">
            View Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};
