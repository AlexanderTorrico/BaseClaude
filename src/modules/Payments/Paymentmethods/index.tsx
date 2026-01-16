import React, { useEffect, useState, useMemo } from 'react';
import { Container } from 'reactstrap';
import { usePaymentmethods } from './hooks/usePaymentmethods';
import { usePaymentmethodsFetch } from './hooks/usePaymentmethodsFetch';
import { createPaymentmethodsApiService } from './services/PaymentmethodsApiService';
import { PaymentMethodModel, PaymentAccountModel } from './models/PaymentmethodsModel';
import Header from './components/Header';
import PaymentMethodCard from './components/PaymentMethodCard';
import PaymentAccountModal from './components/modals/PaymentAccountModal';
import { Loading } from '@/shared/components/Loading';
import { useUserCompanyId } from '@/core/auth/hooks/useUserCompanyId';

const Paymentmethods: React.FC = () => {
  const companyId = useUserCompanyId();

  // Crear servicio con el companyId del usuario
  const paymentMethodsService = useMemo(
    () => createPaymentmethodsApiService(companyId),
    [companyId]
  );

  const { getMethodsWithAccounts, getMethodById } = usePaymentmethods();
  const {
    loading,
    fetchAll,
    createAccount,
    updateAccountData,
    deleteAccount,
    toggleActive,
    testConnection,
  } = usePaymentmethodsFetch(paymentMethodsService);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodModel | null>(null);
  const [accountToEdit, setAccountToEdit] = useState<PaymentAccountModel | null>(null);
  const [expandedMethodId, setExpandedMethodId] = useState<number | null>(null);
  const [testingConnectionUuid, setTestingConnectionUuid] = useState<string | null>(null);

  const handleToggleExpand = (methodId: number) => {
    setExpandedMethodId(prev => prev === methodId ? null : methodId);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddAccount = (methodId: number) => {
    const method = getMethodById(methodId);
    if (method) {
      setSelectedMethod(method);
      setAccountToEdit(null);
      setIsModalOpen(true);
    }
  };

  const handleEditAccount = (account: PaymentAccountModel) => {
    const method = getMethodById(account.paymentMethodId);
    if (method) {
      setSelectedMethod(method);
      setAccountToEdit(account);
      setIsModalOpen(true);
    }
  };

  const handleDeleteAccount = async (accountUuid: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta cuenta?')) {
      await deleteAccount(accountUuid);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMethod(null);
    setAccountToEdit(null);
  };

  const handleTestConnection = async (accountUuid: string) => {
    setTestingConnectionUuid(accountUuid);
    try {
      await testConnection(accountUuid);
      // El icono de verificado se actualizará automáticamente con el refetch
    } finally {
      setTestingConnectionUuid(null);
    }
  };

  const methodsWithAccounts = getMethodsWithAccounts();

  return (
    <div className="page-content">
      <Container fluid>
        <Header loading={loading} onRefresh={fetchAll} />

        {loading && methodsWithAccounts.length === 0 ? (
          <Loading size={400} message="Cargando métodos de pago..." color="primary" />
        ) : (
          <div className="mt-3">
            {methodsWithAccounts.map(method => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isExpanded={expandedMethodId === method.id}
                onToggleExpand={() => handleToggleExpand(method.id)}
                onAddAccount={handleAddAccount}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
                onToggleAccountActive={toggleActive}
                onTestConnection={handleTestConnection}
                testingConnectionUuid={testingConnectionUuid}
              />
            ))}
          </div>
        )}

        <PaymentAccountModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={createAccount}
          onUpdate={updateAccountData}
          accountToEdit={accountToEdit}
          selectedMethod={selectedMethod}
        />
      </Container>
    </div>
  );
};

export default Paymentmethods;
