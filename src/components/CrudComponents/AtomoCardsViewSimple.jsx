import React from "react";
import { Card, CardBody, Row, Col, Button, Badge } from "reactstrap";

const AtomoCardsViewSimple = ({ 
  atomosFiltradosCards,
  onEditAtomo,
  onDeleteAtomo
}) => {
  const obtenerBadgeTipo = (tipo) => {
    const tipoConfig = {
      metal: { color: 'primary', label: 'Metal' },
      noMetal: { color: 'danger', label: 'No Metal' },
      metaloide: { color: 'warning', label: 'Metaloide' },
      gasNoble: { color: 'info', label: 'Gas Noble' },
      transicion: { color: 'secondary', label: 'Transición' },
      alcalino: { color: 'success', label: 'Alcalino' },
      alcalinoterreo: { color: 'dark', label: 'Alcalinotérreo' }
    };
    
    const config = tipoConfig[tipo] || { color: 'light', label: tipo };
    return <Badge color={config.color} className="me-1">{config.label}</Badge>;
  };

  const obtenerBadgeEstado = (estado) => {
    const estadoConfig = {
      solido: { color: 'primary', label: 'Sólido' },
      liquido: { color: 'info', label: 'Líquido' },
      gas: { color: 'warning', label: 'Gas' },
      sintetico: { color: 'secondary', label: 'Sintético' }
    };
    
    const config = estadoConfig[estado] || { color: 'light', label: estado };
    return <Badge color={config.color}>{config.label}</Badge>;
  };

  const obtenerColorGrupo = (grupo) => {
    // Colores basados en grupos de la tabla periódica
    const colores = {
      1: '#FF6B6B',    // Metales alcalinos - Rojo
      2: '#4ECDC4',    // Metales alcalinotérreos - Verde azulado
      13: '#45B7D1',   // Grupo 13 - Azul
      14: '#96CEB4',   // Grupo 14 - Verde claro
      15: '#FFEAA7',   // Grupo 15 - Amarillo
      16: '#DDA0DD',   // Grupo 16 - Violeta claro
      17: '#98D8C8',   // Halógenos - Verde
      18: '#F7DC6F'    // Gases nobles - Amarillo dorado
    };
    
    return colores[grupo] || '#E0E0E0'; // Color por defecto
  };

  if (!atomosFiltradosCards?.length) {
    return (
      <Card className="border-0 shadow-sm">
        <CardBody className="text-center py-5">
          <div className="mb-3">
            <i className="mdi mdi-atom display-4 text-muted"></i>
          </div>
          <h5 className="text-muted">No se encontraron elementos</h5>
          <p className="text-muted mb-0">
            No hay elementos que coincidan con los criterios de búsqueda.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Row className="g-3">
      {atomosFiltradosCards.map((atomo) => (
        <Col key={atomo.id} xl={4} lg={6} md={6} xs={12}>
          <Card className="border-0 shadow-sm h-100">
            <CardBody>
              {/* Header con símbolo y número atómico */}
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="avatar-lg rounded-circle d-flex align-items-center justify-content-center me-3 text-white"
                  style={{ 
                    backgroundColor: obtenerColorGrupo(atomo.grupo),
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <div className="text-center">
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: '1' }}>
                      {atomo.simbolo}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      {atomo.numeroAtomico}
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow-1">
                  <h5 className="mb-1">{atomo.nombre}</h5>
                  <p className="text-muted mb-0 small">
                    Peso atómico: {atomo.pesoAtomico.toFixed(3)} u.m.a.
                  </p>
                </div>
              </div>

              {/* Información básica */}
              <div className="mb-3">
                <Row className="g-2">
                  <Col xs={6}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-semibold text-primary">{atomo.grupo}</div>
                      <div className="small text-muted">Grupo</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center p-2 bg-light rounded">
                      <div className="fw-semibold text-primary">{atomo.periodo}</div>
                      <div className="small text-muted">Periodo</div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Configuración electrónica */}
              {atomo.configuracionElectronica && (
                <div className="mb-3">
                  <div className="small text-muted mb-1">Configuración electrónica:</div>
                  <div className="font-monospace small bg-light p-2 rounded">
                    {atomo.configuracionElectronica}
                  </div>
                </div>
              )}

              {/* Propiedades físicas */}
              <div className="mb-3">
                <Row className="g-2 small">
                  {atomo.puntoFusion !== null && (
                    <Col xs={6}>
                      <div className="text-muted">P. Fusión:</div>
                      <div className="fw-semibold">{atomo.puntoFusion}°C</div>
                    </Col>
                  )}
                  {atomo.densidad !== null && (
                    <Col xs={6}>
                      <div className="text-muted">Densidad:</div>
                      <div className="fw-semibold">{atomo.densidad} g/cm³</div>
                    </Col>
                  )}
                </Row>
              </div>

              {/* Badges de tipo y estado */}
              <div className="mb-3">
                {obtenerBadgeTipo(atomo.tipo)}
                {obtenerBadgeEstado(atomo.estado)}
              </div>

              {/* Información histórica */}
              {(atomo.descubierto || atomo.descubridor) && (
                <div className="mb-3 p-2 bg-light rounded">
                  <div className="small">
                    {atomo.descubierto && (
                      <div><strong>Descubierto:</strong> {atomo.descubierto}</div>
                    )}
                    {atomo.descubridor && (
                      <div><strong>Por:</strong> {atomo.descubridor}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="d-flex justify-content-between">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => onEditAtomo(atomo)}
                  className="flex-fill me-2"
                >
                  <i className="mdi mdi-pencil me-1"></i>
                  Editar
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  outline
                  onClick={() => onDeleteAtomo(atomo)}
                  className="flex-fill"
                >
                  <i className="mdi mdi-delete me-1"></i>
                  Eliminar
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AtomoCardsViewSimple;