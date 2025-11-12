import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { setCurrentView } from '../slices/companySlice';
import { CompanyModel, Branch } from '../models/CompanyModel';
import CompanyInfoCard from './CompanyInfoCard';
import CompanyFormModal from './CompanyFormModal';
import BranchesHeader from './BranchesHeader';
import BranchesTable from './BranchesTable';
import BranchFormModal from './BranchFormModal';

interface CompanyLayoutProps {
  company: CompanyModel;
  branches: Branch[];
  currentView: 'info' | 'branches';
  onUpdateCompany: (data: Partial<CompanyModel>) => Promise<boolean>;
  onRefreshBranches: () => void;
  onCreateBranch: (data: Partial<Branch>) => Promise<boolean>;
  onUpdateBranch: (id: number, data: Partial<Branch>) => Promise<boolean>;
  onDeleteBranch: (id: number) => Promise<boolean>;
}

const CompanyLayout: React.FC<CompanyLayoutProps> = ({
  company,
  branches,
  currentView,
  onUpdateCompany,
  onRefreshBranches,
  onCreateBranch,
  onUpdateBranch,
  onDeleteBranch,
}) => {
  const dispatch = useDispatch();

  // Modals state
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [branchModalMode, setBranchModalMode] = useState<'create' | 'edit'>('create');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const toggleCompanyModal = () => setCompanyModalOpen(!companyModalOpen);
  const toggleBranchModal = () => {
    setBranchModalOpen(!branchModalOpen);
    if (branchModalOpen) {
      setSelectedBranch(null);
    }
  };

  const handleTabChange = (view: 'info' | 'branches') => {
    dispatch(setCurrentView(view));
  };

  const handleEditCompany = () => {
    setCompanyModalOpen(true);
  };

  const handleAddBranch = () => {
    setSelectedBranch(null);
    setBranchModalMode('create');
    setBranchModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setBranchModalMode('edit');
    setBranchModalOpen(true);
  };

  const handleDeleteBranch = async (branchId: number) => {
    await onDeleteBranch(branchId);
  };

  const handleBranchSubmit = async (data: Partial<Branch>) => {
    if (branchModalMode === 'create') {
      return await onCreateBranch(data);
    } else if (selectedBranch) {
      return await onUpdateBranch(selectedBranch.id, data);
    }
    return false;
  };

  const activeBranches = branches.filter(b => b.active).length;

  return (
    <div>
      {/* Navigation Tabs */}
      <Nav tabs className="mb-3">
        <NavItem>
          <NavLink
            className={currentView === 'info' ? 'active' : ''}
            onClick={() => handleTabChange('info')}
            style={{ cursor: 'pointer' }}
          >
            <i className="mdi mdi-information me-1"></i>
            Información General
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={currentView === 'branches' ? 'active' : ''}
            onClick={() => handleTabChange('branches')}
            style={{ cursor: 'pointer' }}
          >
            <i className="mdi mdi-store me-1"></i>
            Sucursales
            {branches.length > 0 && (
              <span className="badge bg-warning text-dark ms-1">{branches.length}</span>
            )}
          </NavLink>
        </NavItem>
      </Nav>

      {/* Tab Content */}
      <TabContent activeTab={currentView}>
        {/* Tab: Información General */}
        <TabPane tabId="info">
          <CompanyInfoCard company={company} onEdit={handleEditCompany} />
        </TabPane>

        {/* Tab: Sucursales */}
        <TabPane tabId="branches">
          <BranchesHeader
            totalBranches={branches.length}
            activeBranches={activeBranches}
            onRefresh={onRefreshBranches}
            onAddNew={handleAddBranch}
          />

          <BranchesTable
            branches={branches}
            onEdit={handleEditBranch}
            onDelete={handleDeleteBranch}
          />
        </TabPane>
      </TabContent>

      {/* Modals */}
      <CompanyFormModal
        isOpen={companyModalOpen}
        toggle={toggleCompanyModal}
        company={company}
        onSubmit={onUpdateCompany}
      />

      <BranchFormModal
        isOpen={branchModalOpen}
        toggle={toggleBranchModal}
        branch={selectedBranch}
        mode={branchModalMode}
        onSubmit={handleBranchSubmit}
        companyId={company.id}
      />
    </div>
  );
};

export default CompanyLayout;
