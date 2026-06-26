import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Badge } from '../../components/Badge/Badge';
import { Search, GitBranch, Clock, MoreVertical, AlertCircle } from 'lucide-react';
import { integrationsApi } from '../../api/integrations';
import './Projects.css';

export const Projects: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const integrationId = searchParams.get('integrationId');
  
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [integrationsLoading, setIntegrationsLoading] = useState(true);
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch accounts on mount
  useEffect(() => {
    integrationsApi.getIntegrations()
      .then(data => {
        setIntegrations(data);
        // Default to first account if none selected
        if (!integrationId && data.length > 0) {
          navigate(`/repositories?integrationId=${data[0].id}`, { replace: true });
        }
      })
      .catch(console.error)
      .finally(() => {
        setIntegrationsLoading(false);
      });
  }, [integrationId, navigate]);

  // Fetch repos when integrationId changes
  useEffect(() => {
    if (!integrationId) return;

    const fetchRepos = async () => {
      try {
        setLoading(true);
        const repos = await integrationsApi.getRepositories(integrationId);
        setRepositories(repos);
        setError('');
      } catch (err) {
        console.error('Failed to fetch repositories', err);
        setError('Failed to load repositories. Please try again or re-connect your account.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [integrationId]);

  const AccountSelector = () => (
    <select
      value={integrationId || ''}
      onChange={(e) => navigate(`/repositories?integrationId=${e.target.value}`)}
      className="select-account"
    >
      <option value="" disabled>Select a GitHub account</option>
      {integrations.map(acc => (
        <option key={acc.id} value={acc.id}>{acc.username}</option>
      ))}
    </select>
  );

  if (integrationsLoading) {
    return (
      <div className="projects-page">
        <header className="page-header">
          <div>
            <h1>Repositories</h1>
            <p className="text-body-sm">View repositories from your connected GitHub accounts.</p>
          </div>
        </header>
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-outline)' }}>
          Loading accounts...
        </div>
      </div>
    );
  }

  if (!integrationId) {
    return (
      <div className="projects-page">
        <header className="page-header">
          <div>
            <h1>Repositories</h1>
            <p className="text-body-sm">View repositories from your connected GitHub accounts.</p>
          </div>
          {integrations.length > 0 && <AccountSelector />}
        </header>
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: '1px dashed var(--color-outline-variant)' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-outline)', marginBottom: '1rem' }} />
          <h3>No Account Selected</h3>
          <p style={{ color: 'var(--color-outline)', marginBottom: '1.5rem' }}>Please select a connected GitHub account to view its repositories.</p>
          <Button variant="primary" onClick={() => navigate('/accounts')}>
            Go to Connected Accounts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1>Your Repositories</h1>
          <p className="text-body-sm">Manage your connected repositories and report settings.</p>
        </div>
        <AccountSelector />
      </header>

      <div className="projects-toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <Input placeholder="Search repositories..." fullWidth className="search-input" />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading repositories...</div>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)', background: 'var(--danger-light)', borderRadius: '8px' }}>
          {error}
        </div>
      ) : repositories.length === 0 ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--surface-1)', borderRadius: '8px' }}>
          No repositories found for this account.
        </div>
      ) : (
        <div className="projects-grid">
          {repositories.map(repo => (
            <Card key={repo.id} interactive className="project-card">
              <div className="project-card-header">
                <div>
                  <h3>{repo.name}</h3>
                  <div className="repo-info">
                    <GitBranch size={14} /> <span>{repo.default_branch}</span>
                  </div>
                </div>
                <button className="icon-button"><MoreVertical size={18} /></button>
              </div>
              
              <div className="project-card-body">
                <p className="text-body-sm">{repo.description || 'No description provided.'}</p>
              </div>

              <div className="project-card-footer">
                <div className="project-meta">
                  <Clock size={14} /> <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
                <Badge variant={repo.private ? 'neutral' : 'success'}>
                  {repo.private ? 'Private' : 'Public'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
