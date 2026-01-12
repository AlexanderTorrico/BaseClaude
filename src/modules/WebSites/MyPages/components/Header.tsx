import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import AzHeaderCard from '@/components/aziende/AzHeader/AzHeaderCard';

const MOBILE_BREAKPOINT = 768;

interface HeaderProps {
  loading: boolean;
  onRefresh: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ loading, onRefresh }) => {
  const { t } = useTranslation();

  // Detectar si estamos en móvil para modo compacto
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

  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <AzHeaderCard
      title={t('myPages.title')}
      compact={isMobile}
      contentTopRight={
        <Button
          color="light"
          onClick={handleRefresh}
          className="d-flex align-items-center"
          disabled={loading}
          title={t('myPages.refreshTitle') || 'Actualizar'}
          size={isMobile ? 'sm' : undefined}
        >
          <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
          <span className="d-none d-md-inline ms-1">{t('myPages.refresh') || 'Actualizar'}</span>
        </Button>
      }
    />
  );
};

export default Header;
