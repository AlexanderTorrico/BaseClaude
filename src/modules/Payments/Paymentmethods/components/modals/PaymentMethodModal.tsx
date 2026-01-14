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
  PaymentMethodType,
  PaymentMethodProvider,
  RegisterPaymentMethodDto,
  UpdatePaymentMethodDto
} from '../../models/PaymentmethodsModel';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (dto: RegisterPaymentMethodDto) => Promise<{ success: boolean; message: string }>;
  onUpdate: (dto: UpdatePaymentMethodDto) => Promise<{ success: boolean; message: string }>;
  methodToEdit: PaymentMethodModel | null;
}

const PAYMENT_TYPES: { value: PaymentMethodType; label: string; icon: string }[] = [
  { value: 'card', label: 'Tarjeta', icon: 'mdi-credit-card' },
  { value: 'bank_transfer', label: 'Transferencia', icon: 'mdi-bank-transfer' },
  { value: 'cash', label: 'Efectivo', icon: 'mdi-cash' },
  { value: 'digital_wallet', label: 'Billetera Digital', icon: 'mdi-wallet' }
];

const PROVIDERS: Record<PaymentMethodType, { value: PaymentMethodProvider; label: string }[]> = {
  card: [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'amex', label: 'American Express' }
  ],
  bank_transfer: [
    { value: 'bank', label: 'Transferencia Bancaria' }
  ],
  cash: [
    { value: 'cash', label: 'Efectivo' }
  ],
  digital_wallet: [
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'mercadopago', label: 'MercadoPago' }
  ]
};

const CURRENCIES = ['USD', 'EUR', 'MXN', 'ARS', 'BRL', 'COP', 'CLP', 'GBP', 'CAD', 'AUD'];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' }
];

const getDefaultFormState = (): RegisterPaymentMethodDto => ({
  name: '',
  description: '',
  type: 'card',
  provider: 'visa',
  icon: 'mdi-credit-card',
  isActive: true,
  commissionPercentage: 0,
  fixedCommission: 0,
  currencies: ['USD'],
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

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  methodToEdit
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [formData, setFormData] = useState<RegisterPaymentMethodDto>(getDefaultFormState());
  const [loading, setLoading] = useState(false);

  const isEditMode = !!methodToEdit;

  useEffect(() => {
    if (methodToEdit) {
      setFormData({
        name: methodToEdit.name,
        description: methodToEdit.description,
        type: methodToEdit.type,
        provider: methodToEdit.provider,
        icon: methodToEdit.icon,
        isActive: methodToEdit.isActive,
        commissionPercentage: methodToEdit.commissionPercentage,
        fixedCommission: methodToEdit.fixedCommission,
        currencies: methodToEdit.currencies,
        credentials: methodToEdit.credentials,
        limits: methodToEdit.limits,
        schedule: methodToEdit.schedule
      });
    } else {
      setFormData(getDefaultFormState());
    }
    setActiveTab('1');
  }, [methodToEdit, isOpen]);

  const handleTypeChange = (type: PaymentMethodType) => {
    const providers = PROVIDERS[type];
    const defaultProvider = providers[0]?.value || 'visa';
    const typeConfig = PAYMENT_TYPES.find(t => t.value === type);

    setFormData(prev => ({
      ...prev,
      type,
      provider: defaultProvider,
      icon: typeConfig?.icon || 'mdi-credit-card'
    }));
  };

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

  const handleSubmit = async () => {
    setLoading(true);

    let result;
    if (isEditMode && methodToEdit) {
      result = await onUpdate({
        id: methodToEdit.id,
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

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg" centered>
      <ModalHeader toggle={onClose}>
        <i className={`mdi ${formData.icon} me-2`} />
        {isEditMode ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
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
          <NavItem>
            <NavLink
              className={activeTab === '2' ? 'active' : ''}
              onClick={() => setActiveTab('2')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-percent me-1" />
              Comisiones
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === '3' ? 'active' : ''}
              onClick={() => setActiveTab('3')}
              style={{ cursor: 'pointer' }}
            >
              <i className="mdi mdi-key me-1" />
              Credenciales
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
              <FormGroup>
                <Label>Tipo de Pago</Label>
                <div className="d-flex flex-wrap gap-2">
                  {PAYMENT_TYPES.map(type => (
                    <Button
                      key={type.value}
                      color={formData.type === type.value ? 'primary' : 'light'}
                      onClick={() => handleTypeChange(type.value)}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className={`mdi ${type.icon}`} />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Proveedor</Label>
                <Input
                  type="select"
                  value={formData.provider}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    provider: e.target.value as PaymentMethodProvider
                  }))}
                >
                  {PROVIDERS[formData.type].map(provider => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Nombre</Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Visa, PayPal..."
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Estado</Label>
                    <div className="form-check form-switch mt-2">
                      <Input
                        type="switch"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <Label className="form-check-label">
                        {formData.isActive ? 'Activo' : 'Inactivo'}
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label>Descripción</Label>
                <Input
                  type="textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del método de pago..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Monedas Aceptadas</Label>
                <div className="d-flex flex-wrap gap-2">
                  {CURRENCIES.map(currency => (
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
              </FormGroup>
            </Form>
          </TabPane>

          <TabPane tabId="2">
            <Card className="border">
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
                      <small className="text-muted">Porcentaje del monto total</small>
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
                      <small className="text-muted">Monto fijo por transacción</small>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="border mt-3">
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

          <TabPane tabId="3">
            <Card className="border">
              <CardBody>
                <h6 className="mb-3">
                  <i className="mdi mdi-key me-2" />
                  Credenciales API
                </h6>
                <small className="text-muted d-block mb-3">
                  Configura las credenciales necesarias para conectar con el proveedor de pagos.
                </small>

                <FormGroup>
                  <Label>API Key / Client ID</Label>
                  <Input
                    type="password"
                    value={formData.credentials.apiKey || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      credentials: { ...prev.credentials, apiKey: e.target.value }
                    }))}
                    placeholder="pk_live_xxxxxxxxxxxx"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Secret Key</Label>
                  <Input
                    type="password"
                    value={formData.credentials.secretKey || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      credentials: { ...prev.credentials, secretKey: e.target.value }
                    }))}
                    placeholder="sk_live_xxxxxxxxxxxx"
                  />
                </FormGroup>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Public Key</Label>
                      <Input
                        type="text"
                        value={formData.credentials.publicKey || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          credentials: { ...prev.credentials, publicKey: e.target.value }
                        }))}
                        placeholder="Opcional"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Merchant ID</Label>
                      <Input
                        type="text"
                        value={formData.credentials.merchantId || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          credentials: { ...prev.credentials, merchantId: e.target.value }
                        }))}
                        placeholder="Opcional"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label>Webhook Secret</Label>
                  <Input
                    type="password"
                    value={formData.credentials.webhookSecret || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      credentials: { ...prev.credentials, webhookSecret: e.target.value }
                    }))}
                    placeholder="whsec_xxxxxxxxxxxx"
                  />
                </FormGroup>
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

                {formData.schedule.enabled && (
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
                )}

                {!formData.schedule.enabled && (
                  <div className="text-center text-muted py-3">
                    <i className="mdi mdi-clock-check font-size-24 d-block mb-2" />
                    El método de pago estará disponible las 24 horas, los 7 días de la semana.
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
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <i className="mdi mdi-loading mdi-spin me-1" />
              Guardando...
            </>
          ) : (
            <>
              <i className={`mdi ${isEditMode ? 'mdi-content-save' : 'mdi-plus'} me-1`} />
              {isEditMode ? 'Guardar Cambios' : 'Crear Método'}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PaymentMethodModal;
