import React, { useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { CompanyMockService } from './services/CompanyMockService';
import { useCompany } from './hooks/useCompany';
import { useCompanyFetch } from './hooks/useCompanyFetch';
import { CompanyModel, Branch } from './models/CompanyModel';
import CompanyLayout from './components/CompanyLayout';

const Company: React.FC = () => {
  const { company, branches, currentView, loading } = useCompany();
  const companyService = useMemo(() => new CompanyMockService(), []);
  const {
    fetchCompany,
    updateCompany,
    fetchBranches,
    createBranch,
    updateBranchData,
    deleteBranch,
  } = useCompanyFetch(companyService);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateCompany = async (data: Partial<CompanyModel>) => {
    return await updateCompany(data);
  };

  const handleRefreshBranches = () => {
    fetchBranches();
  };

  const handleCreateBranch = async (data: Partial<Branch>) => {
    return await createBranch(data as Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const handleUpdateBranch = async (id: number, data: Partial<Branch>) => {
    return await updateBranchData(id, data);
  };

  const handleDeleteBranch = async (id: number) => {
    return await deleteBranch(id);
  };

  if (loading || !company) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="spinner-border text-warning mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando información de la compañía...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        {/* Breadcrumb */}
        <Row>
          <Col xs={12}>
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0 font-size-18">
                <i className="mdi mdi-office-building me-2 text-warning"></i>
                Compañía
              </h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Seguridad</a>
                  </li>
                  <li className="breadcrumb-item active">Compañía</li>
                </ol>
              </div>
            </div>
          </Col>
        </Row>

        {/* Contenido Principal */}
        <CompanyLayout
          company={company}
          branches={branches}
          currentView={currentView}
          onUpdateCompany={handleUpdateCompany}
          onRefreshBranches={handleRefreshBranches}
          onCreateBranch={handleCreateBranch}
          onUpdateBranch={handleUpdateBranch}
          onDeleteBranch={handleDeleteBranch}
        />
      </Container>
    </div>
  );
};

export default Company;
