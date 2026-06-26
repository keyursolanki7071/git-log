import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Shield, GitPullRequest, ArrowRight } from 'lucide-react';
import './ConnectGitHub.css';

export const ConnectGitHub: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="connect-github-page">
      <div className="connect-container">
        <div className="connect-header">
          <div className="icon-badge">
            <GitPullRequest size={32} className="text-primary" />
          </div>
          <h2>Connect Your Workspace</h2>
          <p className="text-body-sm text-center">
            GitLog AI needs read-only access to your repositories to generate semantic reports.
          </p>
        </div>

        <Card padding="lg" className="connect-card">
          <div className="provider-option">
            <div className="provider-info">
              <GitPullRequest size={24} />
              <div>
                <h3>GitHub</h3>
                <p className="text-body-sm">Connect your GitHub organization or personal account.</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => navigate('/select-repo')}>
              Connect <ArrowRight size={16} />
            </Button>
          </div>

          <div className="provider-option disabled">
            <div className="provider-info">
              <div className="icon-placeholder">GL</div>
              <div>
                <h3>GitLab</h3>
                <p className="text-body-sm">Coming soon in Q3.</p>
              </div>
            </div>
            <Button variant="secondary" disabled>Waitlist</Button>
          </div>

          <div className="divider">
            <span>or use a personal access token</span>
          </div>

          <div className="pat-section">
            <Input label="Personal Access Token" type="password" placeholder="ghp_xxxxxxxxxxxx" fullWidth />
            <Button variant="secondary" fullWidth className="mt-3">Authenticate Token</Button>
          </div>
        </Card>

        <div className="security-notice">
          <Shield size={16} />
          <span>We only request <strong>read-only</strong> permissions. Your code is never stored.</span>
        </div>
      </div>
    </div>
  );
};
