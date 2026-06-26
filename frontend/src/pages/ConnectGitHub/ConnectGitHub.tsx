import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { integrationsApi } from '../../api/integrations';
import './ConnectGitHub.css';

const GithubIcon = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ConnectGitHub: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if we just returned from a successful OAuth flow
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('success') === 'true') {
      setSuccess(true);
    }
  }, [location]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');
      // This gets the GitHub OAuth URL which securely embeds our user_id in the state
      const url = await integrationsApi.getGitHubLoginUrl();
      // Redirect the entire browser window to GitHub
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError('Failed to initiate GitHub connection. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="connect-container">
        <div className="connect-card success-card">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={48} className="success-icon" />
          </div>
          <h2 className="connect-title">Successfully Connected!</h2>
          <p className="connect-description">
            Your GitHub account is now securely linked to GitLog AI. We can now begin analyzing your repositories.
          </p>
          <div className="connect-actions">
            <Button variant="ai" size="lg" onClick={() => navigate('/select-repo')} className="continue-btn">
              Select Repository <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-container">
      <div className="connect-card">
        <div className="github-icon-wrapper">
          <GithubIcon size={48} />
        </div>
        <h2 className="connect-title">Connect your GitHub</h2>
        <p className="connect-description">
          GitLog AI needs read-only access to your repositories to analyze commits and generate automated reports. 
          We never store your source code.
        </p>
        
        {error && <div className="error-message" style={{color: '#ef4444', marginBottom: '1rem'}}>{error}</div>}

        <ul className="permission-list">
          <li>✓ Read-only access to code</li>
          <li>✓ Access to commit history</li>
          <li>✓ Pull request metadata</li>
        </ul>

        <div className="connect-actions">
          <Button 
            variant="primary" 
            size="lg" 
            className="github-btn" 
            onClick={handleConnect}
            disabled={loading}
          >
            <GithubIcon size={20} />
            {loading ? 'Connecting...' : 'Connect GitHub Account'}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
};
