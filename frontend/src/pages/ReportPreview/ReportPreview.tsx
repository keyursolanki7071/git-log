import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { ArrowLeft, CheckCircle2, AlertTriangle, Target, BarChart2, Calendar, GitCommit } from 'lucide-react';
import { reportsApi, type Report } from '../../api/reports';
import './ReportPreview.css';

export const ReportPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      try {
        const data = await reportsApi.getReport(id);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="report-preview-page">
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-outline)' }}>Loading report...</div>
      </div>
    );
  }

  if (!report || report.status !== 'COMPLETED' || !report.content) {
    return (
      <div className="report-preview-page">
        <header className="page-header">
          <Button variant="ghost" onClick={() => navigate('/activity')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Activity Log
          </Button>
          <h2>Report not available or still processing</h2>
        </header>
      </div>
    );
  }

  const { content } = report;

  return (
    <div className="report-preview-page">
      <header className="page-header">
        <div style={{ width: '100%' }}>
          <Button variant="ghost" onClick={() => navigate('/activity')} style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Activity Log
          </Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>Engineering Velocity Report</h1>
              <p className="text-body-sm" style={{ marginTop: '4px' }}>
                <strong>{report.repository_name}</strong> • {new Date(report.date_from).toLocaleDateString()} to {new Date(report.date_to).toLocaleDateString()}
              </p>
            </div>
            <div className="report-meta">
              Generated: {new Date(report.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      <div className="report-content-grid">
        <Card className="summary-card">
          <div className="card-header">
            <Target size={20} className="text-primary" />
            <h3>Executive Summary</h3>
          </div>
          <div className="card-body">
            <p>{content.executive_summary}</p>
          </div>
        </Card>

        <div className="two-col-grid">
          <Card className="achievements-card">
            <div className="card-header">
              <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
              <h3>Key Achievements</h3>
            </div>
            <div className="card-body">
              <ul className="custom-list">
                {content.key_achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="concerns-card">
            <div className="card-header">
              <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
              <h3>Areas of Concern</h3>
            </div>
            <div className="card-body">
              <ul className="custom-list">
                {content.areas_of_concern.length > 0 ? content.areas_of_concern.map((item, i) => (
                  <li key={i}>{item}</li>
                )) : <li>No significant concerns detected.</li>}
              </ul>
            </div>
          </Card>
        </div>

        <Card className="metrics-card">
          <div className="card-header">
            <BarChart2 size={20} className="text-primary" />
            <h3>Developer Metrics</h3>
          </div>
          <div className="card-body metrics-grid-inner">
            {Object.entries(content.developer_metrics || {}).map(([key, val]) => (
              <div key={key} className="metric-item">
                <span className="metric-label">{key.replace(/_/g, ' ')}</span>
                <span className="metric-value">{val}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {content.all_commits && content.all_commits.length > 0 && (
        <div className="daily-activity-section" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCommit size={24} className="text-primary" />
            All Commits
          </h2>
          <Card className="daily-card">
            <div className="card-body">
              <div className="commits-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {content.all_commits.map((commit, cIdx) => (
                  <div key={cIdx} className="commit-item" style={{ padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <GitCommit size={16} className="text-primary" />
                      <strong>{commit.author}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-outline)' }}>
                        • {new Date(commit.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', color: 'var(--color-text)' }}>{commit.summary}</p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-outline)', fontStyle: 'italic' }}>
                      Original: {commit.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
