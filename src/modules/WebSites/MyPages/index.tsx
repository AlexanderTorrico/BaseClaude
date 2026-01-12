import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, CardBody, Spinner } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useMyPages } from './hooks/useMyPages';
import { useMyPagesFetch } from './hooks/useMyPagesFetch';
import { MyPagesApiService } from './services/MyPagesApiService';
import AzFilterSummary from '@/components/aziende/AzFilterSummary';
import AzMobileFilters from '@/components/aziende/AzMobileFilters';
import { getMyPagesColumns } from './config/tableMyPagesColumns';
import Header from './components/Header';
import ContentCards from './components/ContentCards';

const myPagesService = new MyPagesApiService();
const MOBILE_BREAKPOINT = 768;

const MyPages: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mypagess } = useMyPages();
  const { loading, fetchAll, updatePageName } = useMyPagesFetch(myPagesService);

  // Detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Columnas con traducciones
  const columns = useMemo(() => getMyPagesColumns(t), [t, i18n.language]);

  useEffect(() => {
    fetchAll();
  }, []);

  // Loading inicial
  if (loading && mypagess.length === 0) {
    return (
      <div className="page-content" style={{ overflowX: 'clip' }}>
        <Container fluid style={{ overflowX: 'clip' }}>
          <Header loading={loading} onRefresh={fetchAll} />
          <Card className="border">
            <CardBody className="text-center py-5">
              <Spinner color="primary" />
              <p className="text-muted mt-3 mb-0">{t('myPages.loading')}</p>
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

        <AzFilterSummary
          data={mypagess}
          columns={columns}
          alwaysVisible={true}
          showCount="always"
          countPosition="top"
          compact={isMobile}
        >
          {({ filteredData, filters, onFilterChange }) => (
            <>
              {/* Filtros moviles colapsables */}
              <AzMobileFilters
                columns={columns}
                filters={filters}
                onFilterChange={onFilterChange}
                mobileFilterKeys={['name']}
                className="mb-3"
              />

              <ContentCards
                filteredPages={filteredData}
                onUpdateName={updatePageName}
              />
            </>
          )}
        </AzFilterSummary>
      </Container>
    </div>
  );
};

export default MyPages;
