import React from 'react';
import { Card, CardBody } from 'reactstrap';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  className = ''
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardBody className="pt-0">
        {children}
      </CardBody>
    </Card>
  );
};