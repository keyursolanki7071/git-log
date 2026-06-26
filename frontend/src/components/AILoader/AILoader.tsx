import React from 'react';
import './AILoader.css';

interface AILoaderProps {
  text?: string;
  className?: string;
}

export const AILoader: React.FC<AILoaderProps> = ({ 
  text = 'AI is processing...', 
  className = '' 
}) => {
  return (
    <div className={`ai-loader-container ${className}`}>
      <div className="ai-loader-shimmer"></div>
      {text && <span className="ai-loader-text">{text}</span>}
    </div>
  );
};
