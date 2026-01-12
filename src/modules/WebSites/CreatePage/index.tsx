import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import { TemplateModel } from './models/TemplateModel';
import { GeneratePageDto } from './models/GeneratePageDto';
import { CreatePageApiService } from './services/CreatePageApiService';
import Header from './components/Header';
import ContentTemplates from './components/ContentTemplates';
import CreatePageModal from './components/CreatePageModal';

const CreatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [apiTemplates, setApiTemplates] = useState<TemplateModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para el modal de creación
  const [modalOpen, setModalOpen] = useState(false);
  const [pageName, setPageName] = useState('');
  const [generating, setGenerating] = useState(false);

  // Servicio API
  const service = new CreatePageApiService();

  // Cargar templates del API
  const fetchTemplates = async () => {
    const response = await service.getTemplates(setLoading);
    if (response.status === 200 && response.data) {
      setApiTemplates(response.data);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleRefresh = async () => {
    await fetchTemplates();
  };

  const handleCreateWithAI = () => {
    console.log('Crear página con IA');
    // Aquí iría la lógica para crear con IA
  };

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    setPageName('');
    setModalOpen(true);
  };

  const handlePreviewTemplate = (templateId: number) => {
    console.log('Vista previa:', templateId);
    // Aquí iría la lógica para mostrar preview
  };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleGenerate = async () => {
    if (!selectedTemplate || !pageName.trim()) return;

    setGenerating(true);
    try {
      const dto: GeneratePageDto = {
        conf: {},
        description: '',
        gbl_company_id: 1,
        name: pageName,
        template_page_id: selectedTemplate
      };

      const res = await service.generatePage(dto);
      if (res.status === 200 || res.status === 201) {
        console.log('Page generated successfully:', res.data);
        toggleModal();
        toast.success(`Página creada: ${pageName}`, { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error generating page:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getSelectedTemplateName = () => {
    const template = apiTemplates.find(t => t.id === selectedTemplate);
    return template ? template.name : '';
  };

  return (
    <div className="page-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Container fluid style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header
          loading={loading}
          onRefresh={handleRefresh}
          onCreateWithAI={handleCreateWithAI}
        />

        <ContentTemplates
          templates={apiTemplates}
          loading={loading}
          activeTab={activeTab}
          selectedTemplate={selectedTemplate}
          onTabChange={setActiveTab}
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />

        <CreatePageModal
          isOpen={modalOpen}
          toggle={toggleModal}
          pageName={pageName}
          onPageNameChange={setPageName}
          onGenerate={handleGenerate}
          generating={generating}
          selectedTemplateName={getSelectedTemplateName()}
        />
      </Container>
    </div>
  );
};

export default CreatePage;
