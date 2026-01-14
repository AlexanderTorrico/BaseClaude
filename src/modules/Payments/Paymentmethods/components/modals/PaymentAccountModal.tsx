import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Badge
} from 'reactstrap';
import {
  PaymentMethodModel,
  PaymentAccountModel,
  CreatePaymentAccountDto,
  UpdatePaymentAccountDto,
  PaymentAccountCredentials
} from '../../models/PaymentmethodsModel';

interface PaymentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (dto: CreatePaymentAccountDto) => Promise<{ success: boolean; message: string }>;
  onUpdate: (dto: UpdatePaymentAccountDto) => Promise<{ success: boolean; message: string }>;
  accountToEdit: PaymentAccountModel | null;
  selectedMethod: PaymentMethodModel | null;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' }
];

const CREDENTIAL_LABELS: Record<string, string> = {
  // Visa / Mastercard
  merchantId: 'ID del Comercio (Merchant ID)',
  terminalId: 'ID del Terminal (Terminal ID)',
  apiKey: 'API Key',
  secretKey: 'Secret Key',

  // Klarna
  klarnaUsername: 'Usuario de Klarna (API Username)',
  klarnaPassword: 'Contraseña de Klarna (API Password)',
  klarnaApiKey: 'API Key de Klarna',

  // Revolut
  revolutApiKey: 'API Key de Revolut',
  revolutMerchantId: 'Merchant ID de Revolut',
  revolutWebhookSecret: 'Webhook Secret de Revolut',

  // PayPal
  paypalClientId: 'Client ID de PayPal',
  paypalClientSecret: 'Client Secret de PayPal',
  paypalWebhookId: 'Webhook ID de PayPal',
  paypalMode: 'Modo (sandbox/live)'
};

const getDefaultFormState = (method: PaymentMethodModel | null): CreatePaymentAccountDto => ({
  paymentMethodId: method?.id || 0,
  alias: '',
  description: '',
  isActive: true,
  isDefault: false,
  commissionPercentage: method?.defaultCommissionPercentage || 0,
  fixedCommission: method?.defaultFixedCommission || 0,
  currencies: method?.supportedCurrencies.slice(0, 1) || [],
  credentials: {},
  limits: {
    minAmount: 1,
    maxAmount: 10000,
    dailyLimit: 50000,
    monthlyLimit: 500000
  },
  schedule: {
    enabled: false,
    startTime: '09:00',
    endTime: '18:00',
    daysOfWeek: [1, 2, 3, 4, 5]
  }
});

const PaymentAccountModal: React.FC<PaymentAccountModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  accountToEdit,
  selectedMethod
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [formData, setFormData] = useState<CreatePaymentAccountDto>(getDefaultFormState(selectedMethod));
  const [loading, setLoading] = useState(false);

  const isEditMode = !!accountToEdit;

  useEffect(() => {
    if (accountToEdit) {
      setFormData({
        paymentMethodId: accountToEdit.paymentMethodId,
        alias: accountToEdit.alias,
        description: accountToEdit.description || '',
        isActive: accountToEdit.isActive,
        isDefault: accountToEdit.isDefault,
        commissionPercentage: accountToEdit.commissionPercentage,
        fixedCommission: accountToEdit.fixedCommission,
        currencies: accountToEdit.currencies,
        credentials: accountToEdit.credentials,
        limits: accountToEdit.limits,
        schedule: accountToEdit.schedule
      });
    } else if (selectedMethod) {
      setFormData(getDefaultFormState(selectedMethod));
    }
    setActiveTab('1');
  }, [accountToEdit, selectedMethod, isOpen]);

  const handleCurrencyToggle = (currency: string) => {
    setFormData(prev => ({
      ...prev,
      currencies: prev.currencies.includes(currency)
        ? prev.currencies.filter(c => c !== currency)
        : [...prev.currencies, currency]
    }));
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        daysOfWeek: prev.schedule.daysOfWeek?.includes(day)
          ? prev.schedule.daysOfWeek.filter(d => d !== day)
          : [...(prev.schedule.daysOfWeek || []), day].sort()
      }
    }));
  };

  const handleCredentialChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    let result;
    if (isEditMode && accountToEdit) {
      result = await onUpdate({
        id: accountToEdit.id,
        ...formData
      });
    } else {
      result = await onCreate(formData);
    }

    setLoading(false);

    if (result.success) {
      onClose();
    }
  };

  if (!selectedMethod) return null;

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg" centered>
      <ModalHeader toggle={onClose}>
        <i className={`mdi ${selectedMethod.icon} me-2`} style={{ color: selectedMethod.color }} />
        {isEditMode ? `Editar Cuenta - ${selectedMethod.name}` : `Nueva Cuenta - ${selectedMethod.name}`}
      </ModalHeader>

      <ModalBody>
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={activeTab === '1' ? 'active' : ''}
              onClick={() => setActiveTab('1')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-information-outline me-1" />
              General
            </NavLink>
          </NavItem>
          {selectedMethod.requiresCredentials && (
            <NavItem>
              <NavLink
                className={activeTab === '2' ? 'active' : ''}
                onClick={() => setActiveTab('2')}
                style={{ cursor: 'pointer' }}
              >
                <i className="mdi mdi-key me-1" />
                Credenciales
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink
              className={activeTab === '3' ? 'active' : ''}
              onClick={() => setActiveTab('3')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-percent me-1" />
              Comisiones y Límites
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '4' ? 'active' : ''}
              onClick={() => setActiveTab('4')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-clock-outline me-1" />
              Horarios
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Form>
              <Row>
                <Col md={8}>
                  <FormGroup>
                    <Label>Alias de la Cuenta *</Label>
                    <Input
                      type="text"
                      value={formData.alias}
                      onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
                      placeholder={`Ej: ${selectedMethod.name} Ventas, ${selectedMethod.name} Principal...`}
                    />
                    <small className="text-muted">
                      Nombre para identificar esta cuenta (visible solo para ti)
                    </small>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Estado</Label>
                    <div className="d-flex gap-3 mt-2">
                      <div className="form-check">
                        <Input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <Label check htmlFor="isActive">Activa</Label>
                      </div>
                      <div className="form-check">
                        <Input
                          type="checkbox"
                          id="isDefault"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                        />
                        <Label check htmlFor="isDefault">Predeterminada</Label>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label>Descripción (opcional)</Label>
                <Input
                  type="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción o notas sobre esta cuenta..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Monedas Aceptadas</Label>
                <div className="d-flex flex-wrap gap-2">
                  {selectedMethod.supportedCurrencies.map(currency => (
                    <Badge
                      key={currency}
                      color={formData.currencies.includes(currency) ? 'primary' : 'light'}
                      className={`cursor-pointer ${formData.currencies.includes(currency) ? '' : 'text-dark'}`}
                      onClick={() => handleCurrencyToggle(currency)}
                      style={{ cursor: 'pointer', padding: '8px 12px' }}
                    >
                      {currency}
                    </Badge>
                  ))}
                </div>
                <small className="text-muted">
                  Selecciona las monedas que aceptarás en esta cuenta
                </small>
              </FormGroup>
            </Form>
          </TabPane>

          {selectedMethod.requiresCredentials && (
            <TabPane tabId="2">
              <Card className="border">
                <CardBody>
                  <h6 className="mb-3">
                    <i className="mdi mdi-key me-2" />
                    Credenciales de {selectedMethod.name}
                  </h6>
                  <small className="text-muted d-block mb-3">
                    Ingresa las credenciales de tu cuenta de {selectedMethod.name}.
                    Estas se guardan de forma segura.
                  </small>

                  {selectedMethod.credentialFields.map(field => (
                    <FormGroup key={field}>
                      <Label>{CREDENTIAL_LABELS[field] || field}</Label>
                      {field === 'paypalMode' ? (
                        <Input
                          type="select"
                          value={(formData.credentials as PaymentAccountCredentials)[field as keyof PaymentAccountCredentials] || 'sandbox'}
                          onChange={(e) => handleCredentialChange(field, e.target.value)}
                        >
                          <option value="sandbox">Sandbox (Pruebas)</option>
                          <option value="live">Live (Producción)</option>
                        </Input>
                      ) : (
                        <Input
                          type={field.toLowerCase().includes('secret') || field.toLowerCase().includes('password') ? 'password' : 'text'}
                          value={(formData.credentials as PaymentAccountCredentials)[field as keyof PaymentAccountCredentials] || ''}
                          onChange={(e) => handleCredentialChange(field, e.target.value)}
                          placeholder={`Ingresa ${CREDENTIAL_LABELS[field] || field}`}
                        />
                      )}
                    </FormGroup>
                  ))}
                </CardBody>
              </Card>
            </TabPane>
          )}

          <TabPane tabId="3">
            <Card className="border mb-3">
              <CardBody>
                <h6 className="mb-3">
                  <i className="mdi mdi-percent me-2" />
                  Comisiones por Transacción
                </h6>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Comisión Porcentual (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.commissionPercentage}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          commissionPercentage: parseFloat(e.target.value) || 0
                        }))}
                      />
                      <small className="text-muted">
                        Predeterminado: {selectedMethod.defaultCommissionPercentage}%
                      </small>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Comisión Fija ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.fixedCommission}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          fixedCommission: parseFloat(e.target.value) || 0
                        }))}
                      />
                      <small className="text-muted">
                        Predeterminado: ${selectedMethod.defaultFixedCommission}
                      </small>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="border">
              <CardBody>
                <h6 className="mb-3">
                  <i className="mdi mdi-speedometer me-2" />
                  Límites de Transacción
                </h6>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Monto Mínimo ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.limits.minAmount}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          limits: { ...prev.limits, minAmount: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Monto Máximo ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.limits.maxAmount}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          limits: { ...prev.limits, maxAmount: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Límite Diario ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.limits.dailyLimit || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          limits: { ...prev.limits, dailyLimit: parseFloat(e.target.value) || undefined }
                        }))}
                        placeholder="Sin límite"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Límite Mensual ($)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.limits.monthlyLimit || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          limits: { ...prev.limits, monthlyLimit: parseFloat(e.target.value) || undefined }
                        }))}
                        placeholder="Sin límite"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </TabPane>

          <TabPane tabId="4">
            <Card className="border">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">
                    <i className="mdi mdi-clock-outline me-2" />
                    Horario de Disponibilidad
                  </h6>
                  <div className="form-check form-switch">
                    <Input
                      type="switch"
                      checked={formData.schedule.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, enabled: e.target.checked }
                      }))}
                    />
                    <Label className="form-check-label">
                      {formData.schedule.enabled ? 'Habilitado' : 'Deshabilitado'}
                    </Label>
                  </div>
                </div>

                {formData.schedule.enabled ? (
                  <>
                    <Row className="mb-3">
                      <Col md={6}>
                        <FormGroup>
                          <Label>Hora de Inicio</Label>
                          <Input
                            type="time"
                            value={formData.schedule.startTime || '09:00'}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              schedule: { ...prev.schedule, startTime: e.target.value }
                            }))}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Hora de Fin</Label>
                          <Input
                            type="time"
                            value={formData.schedule.endTime || '18:00'}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              schedule: { ...prev.schedule, endTime: e.target.value }
                            }))}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup>
                      <Label>Días Disponibles</Label>
                      <div className="d-flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map(day => (
                          <Button
                            key={day.value}
                            color={formData.schedule.daysOfWeek?.includes(day.value) ? 'primary' : 'light'}
                            size="sm"
                            onClick={() => handleDayToggle(day.value)}
                            style={{ minWidth: '50px' }}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </FormGroup>
                  </>
                ) : (
                  <div className="text-center text-muted py-3">
                    <i className="mdi mdi-clock-check font-size-24 d-block mb-2" />
                    Esta cuenta estará disponible las 24 horas, los 7 días de la semana.
                  </div>
                )}
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>
      </ModalBody>

      <ModalFooter>
        <Button color="light" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !formData.alias.trim()}
        >
          {loading ? (
            <>
              <i className="mdi mdi-loading mdi-spin me-1" />
              Guardando...
            </>
          ) : (
            <>
              <i className={`mdi ${isEditMode ? 'mdi-content-save' : 'mdi-plus'} me-1`} />
              {isEditMode ? 'Guardar Cambios' : 'Crear Cuenta'}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentAccountModal;
