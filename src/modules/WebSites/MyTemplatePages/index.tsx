import React, { useEffect } from 'react';
import { Container, Card, CardBody, Spinner } from 'reactstrap';
import { toast } from 'react-toastify';
import { useMyTemplatePages } from './hooks/useMyTemplatePages';
import { useMyTemplatePagesFetch } from './hooks/useMyTemplatePagesFetch';
import { MyTemplatePagesApiService } from './services/MyTemplatePagesApiService';
import Header from './components/Header';
import ContentCards from './components/ContentCards';

const templateService = new MyTemplatePagesApiService();

const MyTemplatePages: React.FC = () => {
  const { mytemplatepagess } = useMyTemplatePages();
  const { loading, fetchAll, publishTemplate } = useMyTemplatePagesFetch(templateService);

  const handlePublish = async (templateId: number) => {
    const result = await publishTemplate(templateId);
    if (result.success) {
      toast.success('Template enviado para revision');
    } else {
      toast.error(result.message || 'Error al publicar template');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading && mytemplatepagess.length === 0) {
    return (
      <div className="page-content" style={{ overflowX: 'clip' }}>
        <Container fluid style={{ overflowX: 'clip' }}>
          <Header loading={loading} onRefresh={fetchAll} />
          <Card className="border">
            <CardBody className="text-center py-5">
              <Spinner color="primary" />
              <p className="text-muted mt-3 mb-0">Cargando templates...</p>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ overflowX: 'clip' }}>
      <Container fluid style={{ overflowX: 'clip' }}>
        <Header loading={loading} onRefresh={fetchAll} />
        <ContentCards filteredTemplates={mytemplatepagess} onPublish={handlePublish} />
      </Container>
    </div>
  );
};

export default MyTemplatePages;
