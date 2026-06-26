import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { ArrowLeft, Download, Share2, Copy } from 'lucide-react';
import './ReportPreview.css';

export const ReportPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="report-preview-page">
      <header className="page-header mb-4">
        <div>
          <div className="flex-center-gap mb-2">
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
          <h1>Q2 Engineering Velocity</h1>
          <div className="report-meta">
            <Badge variant="success">Finalized</Badge>
            <span className="text-body-sm text-outline">Generated on Jun 26, 2026</span>
          </div>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md">
            <Copy size={16} /> Copy Link
          </Button>
          <Button variant="secondary" size="md">
            <Share2 size={16} /> Share
          </Button>
          <Button variant="primary" size="md">
            <Download size={16} /> Export PDF
          </Button>
        </div>
      </header>

      <div className="report-grid">
        <div className="report-main">
          <Card padding="lg" className="report-document">
            <div className="doc-header">
              <h2>Executive Summary</h2>
            </div>
            <div className="doc-content">
              <p>
                During Q2, the engineering team maintained a high velocity across the core repositories. 
                A significant portion of the effort (42%) was dedicated to resolving technical debt within the legacy API, 
                resulting in a 15% reduction in latency for P99 requests.
              </p>
              
              <h3 className="mt-4 mb-2">Key Themes</h3>
              <ul className="doc-list">
                <li><strong>Performance Optimization:</strong> Major rewrites to the caching layer in `payment-service`.</li>
                <li><strong>Security Patches:</strong> Routine dependency bumps and mitigation of 3 CVEs.</li>
                <li><strong>Feature Development:</strong> Launch of the new AI reporting dashboard.</li>
              </ul>

              <h3 className="mt-4 mb-2">AI Insights</h3>
              <div className="ai-insight-box">
                <p>
                  The AI has identified a recurring pattern of merge conflicts in the `src/auth/` directory. 
                  It is recommended to split this module into smaller, independent components to reduce developer friction.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="report-sidebar">
          <Card padding="md" className="stats-card mb-4">
            <h3 className="mb-3">Repository Stats</h3>
            <div className="stat-row">
              <span className="text-outline">Total Commits</span>
              <strong>1,204</strong>
            </div>
            <div className="stat-row">
              <span className="text-outline">Active Devs</span>
              <strong>8</strong>
            </div>
            <div className="stat-row">
              <span className="text-outline">Lines Added</span>
              <strong className="text-success">+14,592</strong>
            </div>
            <div className="stat-row">
              <span className="text-outline">Lines Deleted</span>
              <strong className="text-danger">-8,401</strong>
            </div>
          </Card>

          <Card padding="md">
            <h3 className="mb-3">Top Contributors</h3>
            <div className="contributor-list">
              <div className="contributor-item">
                <div className="avatar">JD</div>
                <div className="contributor-info">
                  <span className="name">Jane Doe</span>
                  <span className="commits">342 commits</span>
                </div>
              </div>
              <div className="contributor-item">
                <div className="avatar">AS</div>
                <div className="contributor-info">
                  <span className="name">Alex Smith</span>
                  <span className="commits">289 commits</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
