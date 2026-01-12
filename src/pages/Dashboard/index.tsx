import React from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

/**
 * Dashboard principal de la aplicación
 */
const Dashboard: React.FC = () => {
    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col xl={12}>
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h4 className="mb-0">Dashboard</h4>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardBody className="text-center py-5">
                                <i className="bx bx-home-circle text-primary" style={{ fontSize: '4rem' }}></i>
                                <h4 className="mt-3">Bienvenido al Sistema</h4>
                                <p className="text-muted mb-4">
                                    Selecciona una opción del menú lateral para comenzar
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
