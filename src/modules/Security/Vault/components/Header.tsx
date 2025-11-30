import React from 'react';
import { Button, Row, Col, Card, CardBody } from 'reactstrap';
import { useVault } from '../hooks/useVault';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ loading, onRefresh }) => {
  const { getTotalMyImages, getTotalCategories, vaultData } = useVault();

  const totalVideos = vaultData?.myVideos.length || 0;

  return (
    <>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">Vault de Imágenes</h4>
              <p className="text-muted mb-0">Gestiona y selecciona imágenes para tus proyectos</p>
            </div>
            <Button color="light" onClick={onRefresh} disabled={loading}>
              <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''} me-1`}></i>
              Actualizar
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    <i className="mdi mdi-image-multiple text-white font-size-24"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Mis Imágenes</p>
                  <h5 className="mb-0">{getTotalMyImages()}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    }}
                  >
                    <i className="mdi mdi-video text-white font-size-24"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Mis Videos</p>
                  <h5 className="mb-0">{totalVideos}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    }}
                  >
                    <i className="mdi mdi-folder-multiple-image text-white font-size-24"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Categorías Vault</p>
                  <h5 className="mb-0">{getTotalCategories()}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Header;
