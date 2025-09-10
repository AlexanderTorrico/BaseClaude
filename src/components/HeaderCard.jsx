import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody, Badge } from "reactstrap";

/**
 * HeaderCard - Componente genérico de header optimizado
 * 
 * @param {string} title - Título principal del header
 * @param {string} [description] - Descripción opcional del header
 * @param {boolean} [showBadge=false] - Mostrar badge en la descripción
 * @param {string} [badgeColor="info"] - Color del badge
 * @param {string} [badgeText] - Texto del badge
 * @param {boolean} [showBottomRow=false] - Mostrar fila inferior con slots
 * @param {React.ReactNode} [contentTopRight] - Contenido del área superior derecha (botones de acción)
 * @param {React.ReactNode} [bottomLeftSlot] - Contenido del área inferior izquierda
 * @param {React.ReactNode} [bottomRightSlot] - Contenido del área inferior derecha
 * @param {string} [className=""] - Clases CSS adicionales para el CardBody
 * @param {string} [cardClassName=""] - Clases CSS adicionales para el Card
 */
const HeaderCard = React.memo(({
  title,
  description,
  showBadge = false,
  badgeColor = "info",
  badgeText,
  showBottomRow = false,
  contentTopRight,
  bottomLeftSlot,
  bottomRightSlot,
  className = "",
  cardClassName = ""
}) => {
  return (
    <Card className={`border-0 shadow-sm mb-4 ${cardClassName}`}>
      <CardBody className={className}>
        {/* Fila superior: Título/Descripción + Slot derecha */}
        <Row className="align-items-center">
          <Col lg={6} md={12}>
            <h4 className="mb-0">{title}</h4>
            {description && (
              <p className="text-muted mb-md-0 mb-3">
                {description}
                {showBadge && badgeText && (
                  <span className="ms-2">
                    <Badge color={badgeColor} style={{ fontSize: '0.65rem' }}>
                      {badgeText}
                    </Badge>
                  </span>
                )}
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

HeaderCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  showBadge: PropTypes.bool,
  badgeColor: PropTypes.string,
  badgeText: PropTypes.string,
  showBottomRow: PropTypes.bool,
  contentTopRight: PropTypes.node,
  bottomLeftSlot: PropTypes.node,
  bottomRightSlot: PropTypes.node,
  className: PropTypes.string,
  cardClassName: PropTypes.string
};

HeaderCard.displayName = "HeaderCard";

export default HeaderCard;