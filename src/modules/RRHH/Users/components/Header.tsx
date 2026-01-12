import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import AzHeaderCardViews from '../../../../components/aziende/AzHeader/AzHeaderCardViews';
import UserRegisterModal from './modals/UserRegisterModal';
import { useUsers } from '../hooks/useUsers';
import { setCurrentView } from '../slices/userSlice';
import { CreateUserDto } from '../models/CreateUserDto';
import { UpdateUserDto } from '../models/UpdateUserDto';
import { UserModel } from '../models/UserModel';

interface HeaderProps {
  loading: boolean;
  onRefresh: (companyId: number) => Promise<void>;
  onRegisterUser: (dto: CreateUserDto) => Promise<{ success: boolean; message: string }>;
  onUpdateUser: (dto: UpdateUserDto) => Promise<{ success: boolean; message: string }>;
  userToEdit: UserModel | null;
  onCloseEditModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
  loading,
  onRefresh,
  onRegisterUser,
  onUpdateUser,
  userToEdit,
  onCloseEditModal
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { getTotalUsers, currentView } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abrir modal cuando se selecciona un usuario para editar
  useEffect(() => {
    if (userToEdit) {
      setIsModalOpen(true);
    }
  }, [userToEdit]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen && userToEdit) {
      onCloseEditModal();
    }
  };

  const handleCreateUser = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    if (userToEdit) {
      toast.success(t('users.toast.updated'));
    } else {
      toast.success(t('users.toast.registered'));
    }
    onCloseEditModal();
  };

  const handleRefresh = async () => {
    await onRefresh(1);
    console.log('🔄 Datos actualizados desde la API');
  };

  const handleViewChange = (viewKey: string) => {
    dispatch(setCurrentView(viewKey));
  };

  return (
    <>
      <AzHeaderCardViews
        title={t('users.title')}
        description={t('users.description')}
        badge={{
          count: getTotalUsers(),
          total: getTotalUsers(),
          color: 'primary'
        }}
        currentView={currentView}
        onViewChange={handleViewChange}
        views={[
          { key: '0', name: t('users.views.table'), icon: 'mdi-table', title: t('users.views.tableTitle') },
          { key: '1', name: t('users.views.cards'), icon: 'mdi-view-grid', title: t('users.views.cardsTitle') }
        ]}
        contentTopRight={
          <>
            <Button
              color="light"
              onClick={handleRefresh}
              className="d-flex align-items-center"
              disabled={loading}
              title={t('users.refreshTitle')}
            >
              <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
              <span className="d-none d-md-inline ms-1">{t('users.refresh')}</span>
            </Button>
            <Button
              color="warning"
              onClick={handleCreateUser}
              className="d-flex align-items-center"
              disabled={loading}
              title={t('users.newUser')}
            >
              <i className="mdi mdi-plus"></i>
              <span className="d-none d-md-inline ms-1">{t('users.newUser')}</span>
            </Button>
          </>
        }
      />

      <UserRegisterModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSuccess={handleSuccess}
        onRegister={onRegisterUser}
        onUpdate={onUpdateUser}
        userToEdit={userToEdit}
        companyId="1"
      />
    </>
  );
};

export default Header;
