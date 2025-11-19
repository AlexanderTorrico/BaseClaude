import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';

interface EmptyStateProps {
  onCreateCompany: () => void;
}

/**
 * Componente de estado vacío mostrado cuando no hay compañías
 */
const EmptyState: React.FC<EmptyStateProps> = ({ onCreateCompany }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card className="shadow-sm border" style={{ maxWidth: '500px', width: '100%' }}>
        <CardBody className="text-center p-5">
          <div className="mb-4">
            <i className="mdi mdi-office-building-outline text-primary" style={{ fontSize: '4rem' }}></i>
          </div>

          <h4 className="mb-3">Bienvenido a la Gestión de Compañías</h4>

          <p className="text-muted mb-4">
            Aún no has creado ninguna compañía. Comienza creando tu primera compañía
            para administrar tus sucursales y datos empresariales.
          </p>

          <Button color="warning" size="lg" onClick={onCreateCompany}>
            <i className="mdi mdi-plus me-2"></i>
            Crear Mi Primera Compañía
          </Button>

          <div className="mt-4 pt-4 border-top">
            <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
              <strong>¿Qué puedes hacer?</strong>
            </p>
            <ul className="list-unstyled text-muted" style={{ fontSize: '0.875rem' }}>
              <li className="mb-2">
                <i className="mdi mdi-check-circle text-success me-2"></i>
                Registrar información de tu empresa
              </li>
              <li className="mb-2">
                <i className="mdi mdi-check-circle text-success me-2"></i>
                Gestionar múltiples sucursales
              </li>
              <li className="mb-2">
                <i className="mdi mdi-check-circle text-success me-2"></i>
                Ubicar sucursales en el mapa
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EmptyState;
