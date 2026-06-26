import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/Table/Table';
import { Bot, CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { reportsApi, type Report } from '../../api/reports';
import './ActivityLog.css';

export const ActivityLog: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <div className="status-cell success"><CheckCircle2 size={14} /> Completed</div>;
      case 'FAILED': return <div className="status-cell error"><AlertCircle size={14} /> Failed</div>;
      case 'PROCESSING': return <div className="status-cell" style={{ color: 'var(--color-primary)' }}><RefreshCw size={14} className="spin" /> Processing</div>;
      default: return <div className="status-cell" style={{ color: 'var(--color-outline)' }}><Clock size={14} /> Pending</div>;
    }
  };

  return (
    <div className="activity-log-page">
      <header className="page-header">
        <div>
          <h1>AI Activity Log</h1>
          <p className="text-body-sm">Detailed history of AI report generations.</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md" onClick={fetchReports}>
            <RefreshCw size={16} /> Refresh
          </Button>
        </div>
      </header>

      <Card padding="none">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Repository</TableHeader>
              <TableHeader>Date Range</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Action</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading reports...</TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No reports generated yet.</TableCell>
              </TableRow>
            ) : (
              reports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="event-cell">
                      <Bot size={16} className="text-primary" />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{report.repository_name}</span>
                        {report.branch_name && (
                          <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
                            branch: {report.branch_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(report.date_from).toLocaleDateString()} - {new Date(report.date_to).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusIcon(report.status)}
                  </TableCell>
                  <TableCell>{new Date(report.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      disabled={report.status !== 'COMPLETED'}
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
