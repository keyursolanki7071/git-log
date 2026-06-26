import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Plus } from 'lucide-react';
import { integrationsApi } from '../../api/integrations';
import './ConnectedAccounts.css';

interface Integration {
  id: string;
  provider: string;
  provider_account_id: string;
  username: string;
  created_at: string;
}

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

export const ConnectedAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const data = await integrationsApi.getIntegrations();
        setIntegrations(data);
      } catch (err) {
        console.error('Failed to fetch integrations', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegrations();
  }, []);

  const handleConnectNew = () => {
    navigate('/connect');
  };

  const handleSelectAccount = (id: string) => {
    navigate(`/repositories?integrationId=${id}`);
  };

  return (
    <div className="connected-accounts-page">
      <header className="page-header">
        <div>
          <h1>Connected Accounts</h1>
          <p className="text-body-sm">Manage your connected GitHub accounts and select one to view repositories.</p>
        </div>
        <Button variant="primary" size="md" onClick={handleConnectNew}>
          <Plus size={16} /> Connect New Account
        </Button>
      </header>

      {loading ? (
        <div className="loading-state">Loading accounts...</div>
      ) : integrations.length === 0 ? (
        <div className="empty-state">
          <p>No GitHub accounts connected yet.</p>
          <Button variant="ai" size="md" onClick={handleConnectNew}>
            <GithubIcon size={16} /> Connect GitHub
          </Button>
        </div>
      ) : (
        <div className="accounts-grid">
          {integrations.map((integration) => (
            <Card 
              key={integration.id} 
              interactive 
              className="account-card"
              onClick={() => handleSelectAccount(integration.id)}
            >
              <div className="account-card-content">
                <div className="account-icon-wrapper">
                  <GithubIcon size={32} />
                </div>
                <div className="account-details">
                  <h3>{integration.username}</h3>
                  <p className="text-body-sm">Connected on {new Date(integration.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
