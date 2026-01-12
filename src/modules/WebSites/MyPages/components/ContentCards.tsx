import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { MyPagesModel } from '../models/MyPagesModel';
import PageCard from './PageCard';

interface ContentCardsProps {
  filteredPages: MyPagesModel[];
  onUpdateName: (pageId: number, newName: string) => Promise<{ success: boolean; message: string }>;
}

const ContentCards: React.FC<ContentCardsProps> = ({ filteredPages, onUpdateName }) => {
  const { t } = useTranslation();

  // Encontrar el ID de la página más reciente
  const latestPageId = React.useMemo(() => {
    if (filteredPages.length === 0) return -1;
    const sorted = [...filteredPages].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted[0].id;
  }, [filteredPages]);

  if (filteredPages.length === 0) {
    return (
      <Card className="border">
        <CardBody className="text-center py-5">
          <i className="mdi mdi-web-off text-muted font-size-48 mb-3 d-block"></i>
          <h5 className="text-muted">{t('myPages.empty')}</h5>
          <p className="text-muted mb-0">{t('myPages.emptyHint')}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Row>
      <Col xs={12}>
        {filteredPages.map((page: MyPagesModel) => (
          <PageCard
            key={page.id}
            page={page}
            onUpdateName={onUpdateName}
            isLatest={page.id === latestPageId}
          />
        ))}
      </Col>
    </Row>
  );
};

export default ContentCards;
