import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Users, GitPullRequest } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { integrationsApi } from '../../api/integrations';
import './Dashboard.css';

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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ accounts: 0, repositories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const integrations = await integrationsApi.getIntegrations();
        
        let totalRepos = 0;
        // Fetch repositories for each account in parallel
        await Promise.all(integrations.map(async (acc: any) => {
          try {
            const repos = await integrationsApi.getRepositories(acc.id);
            totalRepos += repos.length;
          } catch (err) {
            console.error(`Failed to fetch repos for ${acc.id}`, err);
          }
        }));

        setStats({
          accounts: integrations.length,
          repositories: totalRepos
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-body-sm">Welcome back. Here's your workspace overview.</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md" onClick={() => navigate('/connect')}>
            <GithubIcon size={16} /> Connect GitHub
          </Button>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-outline)' }}>
          Loading dashboard stats...
        </div>
      ) : (
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <Card interactive onClick={() => navigate('/accounts')}>
            <div className="metric-card">
              <div className="metric-icon"><Users size={20} /></div>
              <div className="metric-content">
                <span className="text-caps-label">Total Connected Accounts</span>
                <h3>{stats.accounts}</h3>
              </div>
            </div>
          </Card>
          <Card interactive onClick={() => navigate('/repositories')}>
            <div className="metric-card">
              <div className="metric-icon"><GitPullRequest size={20} /></div>
              <div className="metric-content">
                <span className="text-caps-label">Total Repositories</span>
                <h3>{stats.repositories}</h3>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
