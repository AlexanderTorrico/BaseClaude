import React from "react";
import { Row, Col, Card, CardBody, Badge } from "reactstrap";

/**
 * AzHeaderCard - Componente genérico de header optimizado
 *
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header
 * @param {boolean} [showBadge=false] - Mostrar badge en la descripción
 * @param {string} [badgeColor="info"] - Color del badge
 * @param {string} [badgeText] - Texto del badge
 * @param {number} [badgeCount] - Número para mostrar en el badge
 * @param {number} [badgeTotal] - Total para mostrar en el badge
 * @param {boolean} [showBottomRow=false] - Mostrar fila inferior con slots
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha (botones de acción)
 * @param {React.ReactNode} [bottomLeftSlot] - Contenido del área inferior izquierda
 * @param {React.ReactNode} [bottomRightSlot] - Contenido del área inferior derecha
 * @param {string} [className=""] - Clases CSS adicionales para el CardBody
 * @param {string} [cardClassName=""] - Clases CSS adicionales para el Card
 */
const AzHeaderCard = React.memo(({
  title,
  description,
  showBadge = false,
  badgeColor = "info",
  badgeText,
  badgeCount,
  badgeTotal,
  showBottomRow = false,
  contentTopRight,
  bottomLeftSlot,
  bottomRightSlot,
  className = "",
  cardClassName = ""
}) => {
  // Función para renderizar el badge
  const renderBadge = () => {
    if (!showBadge) return null;

    // Si hay count y total, mostrar formato count/total
    if (badgeCount !== undefined && badgeTotal !== undefined) {
      return (
        <span className="ms-2">
          <Badge color={badgeColor} style={{ fontSize: '0.65rem' }}>
            {badgeCount}/{badgeTotal}
          </Badge>
        </span>
      );
    }

    // Si solo hay texto, mostrarlo
    if (badgeText) {
      return (
        <span className="ms-2">
          <Badge color={badgeColor} style={{ fontSize: '0.65rem' }}>
            {badgeText}
          </Badge>
        </span>
      );
    }

    return null;
  };

  return (
    <Card className={`border-0 shadow-sm mb-2 ${cardClassName}`}>
      <CardBody className={className}>
        {/* Fila superior: Título/Descripción + Slot derecha */}
        <Row className="align-items-center">
          <Col lg={6} md={12}>
            <h4 className="mb-0">{title}</h4>
            {description && (
              <p className="text-muted mb-md-0 mb-3">
                {description}
                {renderBadge()}
              </p>
            )}
          </Col>
          <Col lg={6} md={12}>
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
              {contentTopRight}
            </div>
          </Col>
        </Row>

        {/* Fila inferior opcional: Slots izquierda + derecha */}
        {showBottomRow && (bottomLeftSlot || bottomRightSlot) && (
          <Row className="mt-3 g-3">
            <Col xs={12} sm={5} md={6} lg={7}>
              {bottomLeftSlot}
            </Col>
            <Col xs={12} sm={7} md={6} lg={5}>
              <div className="d-flex gap-2 align-items-center justify-content-sm-end">
                {bottomRightSlot}
              </div>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
});

AzHeaderCard.displayName = "AzHeaderCard";

export default AzHeaderCard;
