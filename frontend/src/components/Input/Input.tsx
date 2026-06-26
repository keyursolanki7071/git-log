import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || Math.random().toString(36).substring(2, 9);
  
  const containerClasses = [
    'input-container',
    fullWidth ? 'input-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <input 
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props} 
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};
