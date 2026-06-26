import React from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/Table/Table';
import { Download, Filter, Bot, GitCommit, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import './ActivityLog.css';

export const ActivityLog: React.FC = () => {
  return (
    <div className="activity-log-page">
      <header className="page-header">
        <div>
          <h1>AI Activity Log</h1>
          <p className="text-body-sm">Detailed history of AI generations and background tasks.</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md">
            <Filter size={16} /> Filter
          </Button>
          <Button variant="secondary" size="md">
            <Download size={16} /> Export
          </Button>
        </div>
      </header>

      <Card padding="none">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Event</TableHeader>
              <TableHeader>Target</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Time</TableHeader>
              <TableHeader>Tokens Used</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="event-cell">
                  <Bot size={16} className="text-primary" />
                  <span>Report Generation</span>
                </div>
              </TableCell>
              <TableCell>git-log-frontend</TableCell>
              <TableCell>
                <div className="status-cell success">
                  <CheckCircle2 size={14} /> Completed
                </div>
              </TableCell>
              <TableCell>2 mins ago</TableCell>
              <TableCell><span className="code-font">4,281</span></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="event-cell">
                  <GitCommit size={16} className="text-outline" />
                  <span>Commit Sync</span>
                </div>
              </TableCell>
              <TableCell>core-api</TableCell>
              <TableCell>
                <div className="status-cell success">
                  <CheckCircle2 size={14} /> Completed
                </div>
              </TableCell>
              <TableCell>1 hour ago</TableCell>
              <TableCell><span className="code-font">-</span></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="event-cell">
                  <FileText size={16} className="text-outline" />
                  <span>Schema Extraction</span>
                </div>
              </TableCell>
              <TableCell>legacy-webapp</TableCell>
              <TableCell>
                <div className="status-cell error">
                  <AlertCircle size={14} /> Failed
                </div>
              </TableCell>
              <TableCell>Yesterday</TableCell>
              <TableCell><span className="code-font">1,024</span></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="event-cell">
                  <Bot size={16} className="text-primary" />
                  <span>Report Generation</span>
                </div>
              </TableCell>
              <TableCell>open-source-utils</TableCell>
              <TableCell>
                <div className="status-cell success">
                  <CheckCircle2 size={14} /> Completed
                </div>
              </TableCell>
              <TableCell>2 days ago</TableCell>
              <TableCell><span className="code-font">8,902</span></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      
      <div className="pagination">
        <Button variant="ghost" size="sm" disabled>Previous</Button>
        <span className="page-info">Page 1 of 12</span>
        <Button variant="ghost" size="sm">Next</Button>
      </div>
    </div>
  );
};
