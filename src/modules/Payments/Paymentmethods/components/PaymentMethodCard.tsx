import React from 'react';
import {
  Card,
  CardBody,
  Badge,
  Button,
  Collapse,
  Table,
  Input,
  UncontrolledTooltip
} from 'reactstrap';
import { PaymentMethodWithAccounts, PaymentAccountModel } from '../models/PaymentmethodsModel';

interface PaymentMethodCardProps {
  method: PaymentMethodWithAccounts;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddAccount: (methodId: number) => void;
  onEditAccount: (account: PaymentAccountModel) => void;
  onDeleteAccount: (accountUuid: string) => void;
  onToggleAccountActive: (accountUuid: string) => void;
  onTestConnection?: (accountUuid: string) => Promise<void>;
  testingConnectionUuid?: string | null;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isExpanded,
  onToggleExpand,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onToggleAccountActive,
  onTestConnection,
  testingConnectionUuid,
}) => {

  const hasAccounts = method.accounts.length > 0;
  const hasActiveAccounts = method.activeAccountsCount > 0;

  return (
    <Card className="mb-3 border shadow-sm">
      <CardBody className="p-0">
        <div
          className="d-flex align-items-center justify-content-between p-3 cursor-pointer"
          onClick={onToggleExpand}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: hasActiveAccounts ? `${method.color}15` : '#f5f5f5',
                padding: method.image ? '8px' : '0'
              }}
            >
              {method.image ? (
                <img
                  src={method.image}
                  alt={method.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: hasActiveAccounts ? 'none' : 'grayscale(100%)',
                    opacity: hasActiveAccounts ? 1 : 0.5
                  }}
                />
              ) : (
                <i
                  className={`mdi ${method.icon} font-size-24`}
                  style={{ color: hasActiveAccounts ? method.color : '#9e9e9e' }}
                />
              )}
            </div>

            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="mb-0 fw-medium">{method.name}</h5>
                {hasAccounts && (
                  <Badge color={hasActiveAccounts ? 'success' : 'secondary'} pill>
                    {method.activeAccountsCount}/{method.accounts.length} activas
                  </Badge>
                )}
                {!hasAccounts && (
                  <Badge color="light" className="text-muted">
                    Sin configurar
                  </Badge>
                )}
              </div>
              <small className="text-muted">{method.description}</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              color="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddAccount(method.id);
              }}
            >
              <i className="mdi mdi-plus me-1" />
              Agregar Cuenta
            </Button>
            <i className={`mdi ${isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'} font-size-20 text-muted`} />
          </div>
        </div>

        <Collapse isOpen={isExpanded}>
          <div className="border-top">
            {!hasAccounts ? (
              <div className="text-center py-4">
                <i className="mdi mdi-wallet-plus-outline font-size-32 text-muted" />
                <p className="text-muted mb-2 mt-2">No tienes cuentas configuradas para este método</p>
                <Button color="primary" outline size="sm" onClick={() => onAddAccount(method.id)}>
                  <i className="mdi mdi-plus me-1" />
                  Configurar primera cuenta
                </Button>
              </div>
            ) : (
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Alias</th>
                    <th>Monedas</th>
                    <th>Modo</th>
                    <th className="text-center" style={{ width: '100px' }}>Verificado</th>
                    <th className="text-center" style={{ width: '80px' }}>Estado</th>
                    <th className="text-center" style={{ width: '140px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {method.accounts.map(account => (
                    <tr key={account.uuid} style={!account.isActive ? { opacity: 0.6, backgroundColor: '#f8f9fa' } : {}}>
                      <td className="align-middle">
                        <span className={account.isActive ? 'fw-medium' : 'text-muted'}>
                          {account.alias}
                        </span>
                        {account.description && (
                          <small className="text-muted d-block">{account.description}</small>
                        )}
                      </td>
                      <td className="align-middle">
                        <div className="d-flex flex-wrap gap-1">
                          {account.currencies.slice(0, 2).map(c => (
                            <Badge key={c} color="light" className="text-dark font-size-10">
                              {c}
                            </Badge>
                          ))}
                          {account.currencies.length > 2 && (
                            <Badge color="secondary" className="font-size-10">
                              +{account.currencies.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="align-middle">
                        <Badge
                          color={account.mode === 'production' ? 'danger' : 'warning'}
                          className="font-size-10"
                        >
                          {account.mode === 'production' ? 'Producción' : 'Sandbox'}
                        </Badge>
                      </td>
                      <td className="align-middle text-center">
                        {testingConnectionUuid === account.uuid ? (
                          <span className="text-info">
                            <i className="mdi mdi-loading mdi-spin font-size-18" />
                          </span>
                        ) : account.isVerified ? (
                          <span className="text-success">
                            <i className="mdi mdi-check-circle font-size-18" />
                          </span>
                        ) : (
                          <span className="text-warning">
                            <i className="mdi mdi-alert-circle font-size-18" />
                          </span>
                        )}
                      </td>
                      <td className="align-middle text-center">
                        <div
                          className="form-check form-switch d-flex justify-content-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Input
                            type="switch"
                            checked={account.isActive}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggleAccountActive(account.uuid);
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center gap-1">
                          {onTestConnection && method.provider === 'paypal' && (
                            <>
                              <Button
                                id={`test-${account.uuid}`}
                                size="sm"
                                color="info"
                                outline
                                disabled={testingConnectionUuid === account.uuid}
                                onClick={() => onTestConnection(account.uuid)}
                              >
                                {testingConnectionUuid === account.uuid ? (
                                  <i className="mdi mdi-loading mdi-spin" />
                                ) : (
                                  <i className="mdi mdi-connection" />
                                )}
                              </Button>
                              <UncontrolledTooltip target={`test-${account.uuid}`}>
                                Probar conexión
                              </UncontrolledTooltip>
                            </>
                          )}

                          <Button
                            id={`edit-${account.uuid}`}
                            size="sm"
                            color="primary"
                            outline
                            onClick={() => onEditAccount(account)}
                          >
                            <i className="mdi mdi-pencil" />
                          </Button>
                          <UncontrolledTooltip target={`edit-${account.uuid}`}>
                            Editar cuenta
                          </UncontrolledTooltip>

                          <Button
                            id={`delete-${account.uuid}`}
                            size="sm"
                            color="danger"
                            outline
                            onClick={() => onDeleteAccount(account.uuid)}
                          >
                            <i className="mdi mdi-trash-can" />
                          </Button>
                          <UncontrolledTooltip target={`delete-${account.uuid}`}>
                            Eliminar cuenta
                          </UncontrolledTooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default PaymentMethodCard;
