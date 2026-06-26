import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Badge } from '../../components/Badge/Badge';
import { Search, GitBranch, Clock, AlertCircle, Zap } from 'lucide-react';
import { integrationsApi } from '../../api/integrations';
import { reportsApi } from '../../api/reports';
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

  const [selectedRepo, setSelectedRepo] = useState<any | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [fetchingBranches, setFetchingBranches] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleOpenModal = async (repo: any) => {
    setSelectedRepo(repo);
    setSelectedBranch('');
    setBranches([]);
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);
    
    setDateTo(to.toISOString().split('T')[0]);
    setDateFrom(from.toISOString().split('T')[0]);
    
    if (integrationId) {
      try {
        setFetchingBranches(true);
        const data = await integrationsApi.getBranches(integrationId, repo.full_name);
        setBranches(data);
        if (data && data.length > 0) {
          // Find default branch if possible, else first
          const defaultBranch = data.find((b: any) => b.name === repo.default_branch);
          if (defaultBranch) {
            setSelectedBranch(defaultBranch.name);
          } else {
            setSelectedBranch(data[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch branches', err);
      } finally {
        setFetchingBranches(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedRepo || !integrationId) return;
    setIsGenerating(true);
    try {
      await reportsApi.generateReport({
        integration_id: integrationId,
        repository_name: selectedRepo.full_name,
        branch_name: selectedBranch || undefined,
        date_from: new Date(dateFrom).toISOString(),
        date_to: new Date(dateTo).toISOString()
      });
      setSelectedRepo(null);
      navigate('/activity');
    } catch (err) {
      console.error(err);
      alert('Failed to start report generation');
    } finally {
      setIsGenerating(false);
    }
  };

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
                <Button variant="ai" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenModal(repo); }}>
                  <Zap size={14} /> Generate
                </Button>
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

      {selectedRepo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '8px' }}>Generate Report</h2>
            <p className="text-body-sm" style={{ color: 'var(--color-outline)', marginBottom: '1.5rem' }}>
              Select the date range to analyze commits for <strong>{selectedRepo.name}</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>Branch</label>
                {fetchingBranches ? (
                  <div style={{ fontSize: '14px', color: 'var(--color-outline)' }}>Loading branches...</div>
                ) : (
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}
                  >
                    {branches.map(b => (
                      <option key={b.name} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>From Date</label>
                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} fullWidth />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px', fontWeight: 500 }}>To Date</label>
                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} fullWidth />
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button variant="ghost" onClick={() => setSelectedRepo(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? 'Starting...' : 'Generate Now'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
