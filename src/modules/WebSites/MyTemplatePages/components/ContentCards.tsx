import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { MyTemplatePagesModel } from '../models/MyTemplatePagesModel';
import TemplateCard from './TemplateCard';

interface ContentCardsProps {
  filteredTemplates: MyTemplatePagesModel[];
  onPublish?: (templateId: number) => void;
  onEdit?: (templateId: number) => void;
}

const ContentCards: React.FC<ContentCardsProps> = ({ filteredTemplates, onPublish, onEdit }) => {
  if (filteredTemplates.length === 0) {
    return (
      <Card className="border">
        <CardBody className="text-center py-5">
          <i className="mdi mdi-file-document-outline text-muted font-size-48 mb-3 d-block"></i>
          <h5 className="text-muted">No hay templates</h5>
          <p className="text-muted mb-0">Aun no has creado ningun template</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Row>
      <Col xs={12}>
        {filteredTemplates.map((template: MyTemplatePagesModel) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPublish={onPublish}
            onEdit={onEdit}
          />
        ))}
      </Col>
    </Row>
  );
};

export default ContentCards;
