import React from 'react';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import AzHeaderCard from '@/components/aziende/AzHeader/AzHeaderCard';
import { useMyPages } from '../hooks/useMyPages';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ loading, onRefresh }) => {
  const { t } = useTranslation();
  const { getTotal } = useMyPages();

  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <AzHeaderCard
      title={t('myPages.title')}
      description={t('myPages.subtitle')}
      showBadge={true}
      badgeCount={getTotal()}
      badgeColor="info"
      contentTopRight={
        <Button
          color="light"
          onClick={handleRefresh}
          className="d-flex align-items-center"
          disabled={loading}
          title={t('myPages.refreshTitle') || 'Actualizar'}
        >
          <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
          <span className="d-none d-md-inline ms-1">{t('myPages.refresh') || 'Actualizar'}</span>
        </Button>
      }
    />
  );
};

export default Header;
