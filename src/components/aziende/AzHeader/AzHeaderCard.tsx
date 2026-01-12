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
  compact?: boolean | undefined;
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
  cardClassName = "",
  compact = false
}) => {
  const badgeContent = React.useMemo(() => {
    if (!showBadge) return null;

    // Soportar: count/total, solo count, o texto
    let content: string | number | undefined;
    if (badgeCount !== undefined && badgeTotal !== undefined) {
      content = `${badgeCount}/${badgeTotal}`;
    } else if (badgeCount !== undefined) {
      content = badgeCount;
    } else {
      content = badgeText;
    }

    if (content === undefined) return null;

    return (
      <Badge color={badgeColor} className="ms-2" style={{ fontSize: '0.65rem', padding: '0.2em 0.5em', verticalAlign: 'middle' }}>
        {content}
      </Badge>
    );
  }, [showBadge, badgeCount, badgeTotal, badgeText, badgeColor]);

  return (
    <Card className={`border-0 shadow-sm mb-2 ${cardClassName}`}>
      <CardBody className={`${compact ? 'py-2 px-3' : ''} ${className}`}>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <div className="flex-grow-1 min-width-0">
            <h4 className={`mb-0 text-truncate ${compact ? 'font-size-15' : ''}`}>
              {title}
              {!description && badgeContent}
            </h4>
            {description && (
              <p className={`text-muted mb-0 text-truncate ${compact ? 'font-size-12' : ''}`}>
                {description}
                {badgeContent}
              </p>
            )}
          </div>
          {contentTopRight && (
            <div className="d-flex flex-nowrap gap-2 flex-shrink-0">
              {contentTopRight}
            </div>
          )}
        </div>

        {showBottomRow && (bottomLeftSlot || bottomRightSlot) && (
          <Row className={`${compact ? 'mt-2' : 'mt-3'} g-2`}>
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
