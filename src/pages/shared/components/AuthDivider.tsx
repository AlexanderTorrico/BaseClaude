import React from 'react';

interface AuthDividerProps {
  text?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text = 'OR' }) => {
  return (
    <div className="mt-4 pt-2 text-center">
      <div className="signin-other-title">
        <h5 className="font-size-14 mb-3 text-muted">{text}</h5>
      </div>
    </div>
  );
};