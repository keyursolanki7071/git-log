import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Badge } from '../../components/Badge/Badge';
import { Search, GitBranch, ArrowLeft, Plus } from 'lucide-react';
import './SelectRepository.css';

export const SelectRepository: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="select-repo-page">
      <div className="select-repo-container">
        <header className="page-header mb-4">
          <div>
            <div className="flex-center-gap mb-2">
              <button className="back-btn" onClick={() => navigate('/connect')}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <h1>Select Repository</h1>
            <p className="text-body-sm">Choose a repository to start generating AI insights.</p>
          </div>
        </header>

        <Card padding="lg">
          <div className="search-section mb-4">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <Input placeholder="Search repositories..." fullWidth className="search-input" />
            </div>
          </div>

          <div className="repo-list">
            <div className="repo-item">
              <div className="repo-item-content">
                <h3>git-log-frontend</h3>
                <div className="repo-meta">
                  <Badge variant="neutral">Private</Badge>
                  <span className="repo-meta-item"><GitBranch size={12} /> main</span>
                  <span className="repo-meta-item">Updated 2h ago</span>
                </div>
              </div>
              <Button variant="secondary" size="sm">Select</Button>
            </div>

            <div className="repo-item">
              <div className="repo-item-content">
                <h3>core-api</h3>
                <div className="repo-meta">
                  <Badge variant="neutral">Private</Badge>
                  <span className="repo-meta-item"><GitBranch size={12} /> production</span>
                  <span className="repo-meta-item">Updated 1d ago</span>
                </div>
              </div>
              <Button variant="secondary" size="sm">Select</Button>
            </div>

            <div className="repo-item">
              <div className="repo-item-content">
                <h3>open-source-utils</h3>
                <div className="repo-meta">
                  <Badge variant="success">Public</Badge>
                  <span className="repo-meta-item"><GitBranch size={12} /> master</span>
                  <span className="repo-meta-item">Updated 2w ago</span>
                </div>
              </div>
              <Button variant="secondary" size="sm">Select</Button>
            </div>
          </div>

          <div className="text-center mt-4 pt-4 border-top">
            <p className="text-body-sm mb-3">Don't see your repository?</p>
            <Button variant="ghost" size="sm">
              <Plus size={16} /> Import manually
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
