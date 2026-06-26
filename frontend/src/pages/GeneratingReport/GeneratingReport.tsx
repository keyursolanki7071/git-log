import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card';
import { AILoader } from '../../components/AILoader/AILoader';
import { FileText, GitCommit, Search, Sparkles } from 'lucide-react';
import './GeneratingReport.css';

export const GeneratingReport: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    { icon: <GitCommit size={16} />, text: "Fetching commit history from core-api..." },
    { icon: <Search size={16} />, text: "Analyzing semantic changes in src/ directory..." },
    { icon: <FileText size={16} />, text: "Drafting executive summary..." },
    { icon: <Sparkles size={16} />, text: "Applying Kinetic Intelligence formatting..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/report-preview'), 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [navigate, steps.length]);

  return (
    <div className="generating-report-page">
      <div className="generating-container">
        <div className="pulse-circle">
          <Sparkles size={32} className="ai-icon" />
        </div>
        
        <h2 className="mb-2">AI is Generating Your Report</h2>
        <p className="text-body-sm mb-4 text-center text-outline">
          This usually takes 15-30 seconds depending on repository size.
        </p>

        <Card padding="lg" className="status-card">
          <div className="step-list">
            {steps.map((s, idx) => (
              <div 
                key={idx} 
                className={`step-item ${idx === step ? 'active' : ''} ${idx < step ? 'completed' : ''}`}
              >
                <div className="step-icon">{s.icon}</div>
                <span className="step-text">{s.text}</span>
              </div>
            ))}
          </div>
          
          <div className="loader-wrapper">
            <AILoader text="" className="generating-loader" />
          </div>
        </Card>
      </div>
    </div>
  );
};
