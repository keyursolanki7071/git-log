import React from 'react';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/Table/Table';
import { AILoader } from '../../components/AILoader/AILoader';
import { GitCommit, Users, FileText, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-body-sm">Welcome back, Team. Here's your workspace overview.</p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md">
            <RefreshCw size={16} /> Sync Data
          </Button>
          <Button variant="ai" size="md">
            <Zap size={16} /> Generate Master Report
          </Button>
        </div>
      </header>

      <div className="metrics-grid">
        <Card interactive>
          <div className="metric-card">
            <div className="metric-icon"><FileText size={20} /></div>
            <div className="metric-content">
              <span className="text-caps-label">Total Reports</span>
              <h3>124</h3>
            </div>
          </div>
        </Card>
        <Card interactive>
          <div className="metric-card">
            <div className="metric-icon"><GitCommit size={20} /></div>
            <div className="metric-content">
              <span className="text-caps-label">Commits Analyzed</span>
              <h3>8,492</h3>
            </div>
          </div>
        </Card>
        <Card interactive>
          <div className="metric-card">
            <div className="metric-icon"><Users size={20} /></div>
            <div className="metric-content">
              <span className="text-caps-label">Active Contributors</span>
              <h3>18</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="recent-activity-section">
        <div className="section-header">
          <h2>Recent Reports</h2>
          <Button variant="ghost" size="sm">View All <ArrowRight size={16} /></Button>
        </div>

        <Card padding="none">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Report Name</TableHeader>
                <TableHeader>Repository</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Date</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="report-name-cell">
                    <Zap size={16} className="ai-icon" />
                    <span>Q2 Engineering Velocity</span>
                  </div>
                </TableCell>
                <TableCell>git-log-frontend</TableCell>
                <TableCell><Badge variant="primary" pill>Ready</Badge></TableCell>
                <TableCell>Today, 10:45 AM</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="report-name-cell">
                    <Zap size={16} className="ai-icon" />
                    <span>Security Patch Analysis</span>
                  </div>
                </TableCell>
                <TableCell>core-api</TableCell>
                <TableCell><AILoader text="Processing..." className="table-loader" /></TableCell>
                <TableCell>Today, 09:15 AM</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="report-name-cell">
                    <FileText size={16} className="text-icon" />
                    <span>Weekly Commit Summary</span>
                  </div>
                </TableCell>
                <TableCell>payment-service</TableCell>
                <TableCell><Badge variant="success" pill>Completed</Badge></TableCell>
                <TableCell>Yesterday</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};
