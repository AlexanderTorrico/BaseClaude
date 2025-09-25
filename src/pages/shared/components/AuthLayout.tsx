import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBranding?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBranding = true
}) => {
  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="bg-primary bg-soft">
                <Row>
                  <Col className="col-7">
                    <div className="text-primary p-4">
                      {title && <h5 className="text-primary">{title}</h5>}
                      {subtitle && <p>{subtitle}</p>}
                    </div>
                  </Col>
                  <Col className="col-5 align-self-end">
                    {showBranding && (
                      <img
                        src="/assets/images/profile-img.png"
                        alt=""
                        className="img-fluid"
                      />
                    )}
                  </Col>
                </Row>
              </div>
              <CardBody className="pt-0">
                <div className="auth-logo">
                  <div className="avatar-md profile-user-wid mb-4">
                    <span className="avatar-title rounded-circle bg-light">
                      <img
                        src="/assets/images/logo.svg"
                        alt=""
                        className="rounded-circle"
                        height="34"
                      />
                    </span>
                  </div>
                </div>
                {children}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};