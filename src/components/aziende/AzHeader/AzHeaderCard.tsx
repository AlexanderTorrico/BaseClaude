import React from "react";
import { Row, Col, Card, CardBody, Badge } from "reactstrap";

export interface AzHeaderCardProps {
  title: string;
  description?: string | undefined;
  showBadge?: boolean | undefined;
  badgeColor?: string | undefined;
  badgeText?: string | undefined;
  badgeCount?: number | undefined;
  badgeTotal?: number | undefined;
  showBottomRow?: boolean | undefined;
  contentTopRight?: React.ReactNode | undefined;
  bottomLeftSlot?: React.ReactNode | undefined;
  bottomRightSlot?: React.ReactNode | undefined;
  className?: string | undefined;
  cardClassName?: string | undefined;
}

const AzHeaderCard: React.FC<AzHeaderCardProps> = React.memo(({
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
  const badgeContent = React.useMemo(() => {
    if (!showBadge) return null;

    const content = badgeCount !== undefined && badgeTotal !== undefined
      ? `${badgeCount}/${badgeTotal}`
      : badgeText;

    if (!content) return null;

    return (
      <span className="ms-2">
        <Badge color={badgeColor} style={{ fontSize: '0.65rem' }}>
          {content}
        </Badge>
      </span>
    );
  }, [showBadge, badgeCount, badgeTotal, badgeText, badgeColor]);

  return (
    <Card className={`border-0 shadow-sm mb-2 ${cardClassName}`}>
      <CardBody className={className}>
        <Row className="align-items-center">
          <Col lg={6} md={12}>
            <h4 className="mb-0">{title}</h4>
            {description && (
              <p className="text-muted mb-md-0 mb-3">
                {description}
                {badgeContent}
              </p>
            )}
          </Col>
          <Col lg={6} md={12}>
            <div className="d-flex flex-wrap gap-2 justify-content-lg-end justify-content-center">
              {contentTopRight}
            </div>
          </Col>
        </Row>

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
