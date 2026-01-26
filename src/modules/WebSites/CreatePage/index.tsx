import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import { TemplateModel } from './models/TemplateModel';
import { GeneratePageDto } from './models/GeneratePageDto';
import { GenerateWithAIDto } from './models/GenerateWithAIDto';
import { CreatePageApiService } from './services/CreatePageApiService';
import Header from './components/Header';
import ContentTemplates from './components/ContentTemplates';
import CreatePageModal from './components/CreatePageModal';
import CreateWithAIModal from './components/CreateWithAIModal';
import { useUserCompanyId } from '@/core/auth';

const CreatePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [apiTemplates, setApiTemplates] = useState<TemplateModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para el modal de creación normal
  const [modalOpen, setModalOpen] = useState(false);
  const [pageName, setPageName] = useState('');
  const [generating, setGenerating] = useState(false);

  // Estado para el modal de IA
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPageName, setAiPageName] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSelectedTemplate, setAiSelectedTemplate] = useState<number | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Servicio API
  const service = new CreatePageApiService();
  const companyId = useUserCompanyId();

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
    setAiPageName('');
    setAiPrompt('');
    setAiSelectedTemplate(1); // Seleccionar automáticamente el diseño base con id 1
    setAiModalOpen(true);
  };

  const toggleAiModal = () => setAiModalOpen(!aiModalOpen);

  const handleGenerateWithAI = async () => {
    if (!aiPageName.trim() || !aiPrompt.trim() || !aiSelectedTemplate) return;

    setGeneratingAI(true);
    try {
      const dto: GenerateWithAIDto = {
        template_page_id: aiSelectedTemplate,
        name: aiPageName,
        prompt: aiPrompt
      };

      const res = await service.generateWithAI(dto);
      if (res.status === 200 || res.status === 201) {
        console.log('Page generated with AI:', res.data);
        toggleAiModal();
        toast.success(`Página creada con IA: ${aiPageName}`, { autoClose: 3000 });
      } else {
        toast.error('Error al generar la página con IA');
      }
    } catch (error) {
      console.error('Error generating page with AI:', error);
      toast.error('Error al generar la página con IA');
    } finally {
      setGeneratingAI(false);
    }
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
        gbl_company_id: companyId,
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

        {/* Modal para crear página normal */}
        <CreatePageModal
          isOpen={modalOpen}
          toggle={toggleModal}
          pageName={pageName}
          onPageNameChange={setPageName}
          onGenerate={handleGenerate}
          generating={generating}
          selectedTemplateName={getSelectedTemplateName()}
        />

        {/* Modal para crear con IA */}
        <CreateWithAIModal
          isOpen={aiModalOpen}
          toggle={toggleAiModal}
          pageName={aiPageName}
          onPageNameChange={setAiPageName}
          prompt={aiPrompt}
          onPromptChange={setAiPrompt}
          selectedTemplateId={aiSelectedTemplate}
          onGenerate={handleGenerateWithAI}
          generating={generatingAI}
        />
      </Container>
    </div>
  );
};

export default CreatePage;
