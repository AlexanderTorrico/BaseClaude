import React, { useEffect } from 'react';
import { Container } from 'reactstrap';
import { useVault } from './hooks/useVault';
import { useVaultFetch } from './hooks/useVaultFetch';
import { VaultApiService } from './services/VaultApiService';
import UnifiedGallery from './components/UnifiedGallery';

const vaultService = new VaultApiService();

const Vault: React.FC = () => {
  const { vaultData, pendingUploads } = useVault();
  const { loading, fetchVaultData, uploadMedia, deleteMedia } = useVaultFetch(vaultService);

  useEffect(() => {
    fetchVaultData();
  }, []);

  return (
    <div className="page-content" style={{ overflowX: 'clip' }}>
      <Container fluid style={{ overflowX: 'clip' }}>
        {loading && !vaultData ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-3">Cargando vault...</p>
          </div>
        ) : (
          vaultData && (
            <UnifiedGallery
              vaultData={vaultData}
              pendingUploads={pendingUploads}
              onRefresh={fetchVaultData}
              onUploadMedia={uploadMedia}
              onDeleteMedia={deleteMedia}
            />
          )
        )}
      </Container>
    </div>
  );
};

export default Vault;
