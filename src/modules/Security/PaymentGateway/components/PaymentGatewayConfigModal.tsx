import React, { useState, useEffect } from 'react';
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Alert,
  Badge,
} from 'reactstrap';
import { PaymentGatewayModel } from '../models/PaymentGatewayModel';

interface PaymentGatewayConfigModalProps {
  isOpen: boolean;
  toggle: () => void;
  gateway: PaymentGatewayModel | null;
  onSave: (gateway: PaymentGatewayModel) => void;
}

export const PaymentGatewayConfigModal: React.FC<PaymentGatewayConfigModalProps> = ({
  isOpen,
  toggle,
  gateway,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState('1');
  const [formData, setFormData] = useState<PaymentGatewayModel | null>(null);

  useEffect(() => {
    if (gateway) {
      setFormData({ ...gateway });
    }
  }, [gateway]);

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        [key]: value,
      },
    });
  };

  const handleFeesChange = (key: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      fees: {
        ...formData.fees,
        [key]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      toggle();
    }
  };

  if (!formData) return null;

  const renderCredentialsTab = () => {
    const configFields = formData.config || {};

    return (
      <TabPane tabId="1">
        <Alert color="info" className="mb-3">
          <i className="mdi mdi-information me-2"></i>
          Configure las credenciales de API proporcionadas por {formData.name}
        </Alert>

        {Object.keys(configFields).map((key) => {
          if (key === 'environment') {
            return (
              <FormGroup key={key}>
                <Label>Entorno</Label>
                <Input
                  type="select"
                  value={configFields[key] as string || 'sandbox'}
                  onChange={(e) => handleConfigChange(key, e.target.value)}
                >
                  <option value="sandbox">Pruebas (Sandbox)</option>
                  <option value="production">Producción</option>
                </Input>
              </FormGroup>
            );
          }

          const isSecret = key.toLowerCase().includes('secret') ||
                          key.toLowerCase().includes('key') ||
                          key.toLowerCase().includes('token');

          return (
            <FormGroup key={key}>
              <Label className="text-capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
              <Input
                type={isSecret ? 'password' : 'text'}
                value={configFields[key] as string || ''}
                onChange={(e) => handleConfigChange(key, e.target.value)}
                placeholder={`Ingrese ${key}`}
              />
            </FormGroup>
          );
        })}

        {Object.keys(configFields).length === 0 && (
          <Alert color="warning">
            Esta pasarela no requiere configuración adicional.
          </Alert>
        )}
      </TabPane>
    );
  };

  const renderFeesTab = () => {
    return (
      <TabPane tabId="2">
        <Alert color="info" className="mb-3">
          <i className="mdi mdi-cash me-2"></i>
          Configure las comisiones asociadas a esta pasarela
        </Alert>

        <FormGroup>
          <Label>Comisión Porcentual (%)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.fees?.percentage || ''}
            onChange={(e) => handleFeesChange('percentage', parseFloat(e.target.value))}
            placeholder="0.00"
          />
        </FormGroup>

        <FormGroup>
          <Label>Comisión Fija</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.fees?.fixed || ''}
            onChange={(e) => handleFeesChange('fixed', parseFloat(e.target.value))}
            placeholder="0.00"
          />
        </FormGroup>

        <FormGroup>
          <Label>Moneda de la Comisión</Label>
          <Input
            type="select"
            value={formData.fees?.currency || 'USD'}
            onChange={(e) => handleFeesChange('currency', e.target.value)}
          >
            <option value="USD">USD - Dólar Estadounidense</option>
            <option value="EUR">EUR - Euro</option>
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="ARS">ARS - Peso Argentino</option>
            <option value="CLP">CLP - Peso Chileno</option>
            <option value="COP">COP - Peso Colombiano</option>
            <option value="PEN">PEN - Sol Peruano</option>
            <option value="BRL">BRL - Real Brasileño</option>
          </Input>
        </FormGroup>

        <div className="bg-light p-3 rounded">
          <h6>Vista Previa de Comisión:</h6>
          <p className="mb-0">
            {formData.fees?.percentage && <span>{formData.fees.percentage}%</span>}
            {formData.fees?.percentage && formData.fees?.fixed && <span> + </span>}
            {formData.fees?.fixed && <span>{formData.fees.fixed} {formData.fees?.currency || 'USD'}</span>}
            {!formData.fees?.percentage && !formData.fees?.fixed && <span className="text-muted">Sin comisiones</span>}
          </p>
        </div>
      </TabPane>
    );
  };

  const renderSettingsTab = () => {
    return (
      <TabPane tabId="3">
        <Alert color="info" className="mb-3">
          <i className="mdi mdi-cog me-2"></i>
          Configuración adicional de la pasarela
        </Alert>

        <FormGroup>
          <Label>Tiempo de Procesamiento</Label>
          <Input
            type="text"
            value={formData.processingTime || ''}
            onChange={(e) => handleInputChange('processingTime', e.target.value)}
            placeholder="Ej: Instantáneo, 1-3 días hábiles"
          />
        </FormGroup>

        <FormGroup>
          <Label>Monto Mínimo</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.minAmount || ''}
            onChange={(e) => handleInputChange('minAmount', parseFloat(e.target.value))}
            placeholder="0.00"
          />
        </FormGroup>

        <FormGroup>
          <Label>Monto Máximo</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.maxAmount || ''}
            onChange={(e) => handleInputChange('maxAmount', parseFloat(e.target.value))}
            placeholder="Ilimitado"
          />
        </FormGroup>

        <FormGroup check className="mb-3">
          <Input
            type="checkbox"
            id="requiresKYC"
            checked={formData.requiresKYC || false}
            onChange={(e) => handleInputChange('requiresKYC', e.target.checked)}
          />
          <Label check for="requiresKYC">
            Requiere verificación de identidad (KYC)
          </Label>
        </FormGroup>

        <FormGroup>
          <Label>Países Soportados</Label>
          <Input
            type="textarea"
            rows={3}
            value={formData.countries?.join(', ') || ''}
            onChange={(e) => handleInputChange('countries', e.target.value.split(',').map(c => c.trim()))}
            placeholder="US, MX, ES, AR..."
          />
          <small className="text-muted">Separar con comas</small>
        </FormGroup>

        <FormGroup>
          <Label>Monedas Soportadas</Label>
          <Input
            type="textarea"
            rows={3}
            value={formData.currencies?.join(', ') || ''}
            onChange={(e) => handleInputChange('currencies', e.target.value.split(',').map(c => c.trim()))}
            placeholder="USD, EUR, MXN..."
          />
          <small className="text-muted">Separar con comas</small>
        </FormGroup>

        {formData.category === 'card' && (
          <FormGroup>
            <Label>Métodos de Pago Soportados</Label>
            <Input
              type="textarea"
              rows={2}
              value={formData.supportedPaymentMethods?.join(', ') || ''}
              onChange={(e) => handleInputChange('supportedPaymentMethods', e.target.value.split(',').map(m => m.trim()))}
              placeholder="visa, mastercard, amex..."
            />
            <small className="text-muted">Separar con comas</small>
          </FormGroup>
        )}
      </TabPane>
    );
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          <div className="d-flex align-items-center">
            <i className={`${formData.icon} font-size-24 me-2`}></i>
            <div>
              <div>Configurar {formData.name}</div>
              <small className="text-muted">{formData.description}</small>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <Badge color={formData.enabled ? 'success' : 'secondary'}>
              {formData.enabled ? 'Activa' : 'Inactiva'}
            </Badge>
            {formData.config?.environment && (
              <Badge color={formData.config.environment === 'production' ? 'success' : 'warning'} className="ms-2">
                {formData.config.environment === 'production' ? 'Producción' : 'Pruebas'}
              </Badge>
            )}
          </div>

          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === '1' ? 'active' : ''}
                onClick={() => setActiveTab('1')}
                style={{ cursor: 'pointer' }}
              >
                <i className="mdi mdi-key me-1"></i>
                Credenciales
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '2' ? 'active' : ''}
                onClick={() => setActiveTab('2')}
                style={{ cursor: 'pointer' }}
              >
                <i className="mdi mdi-cash me-1"></i>
                Comisiones
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '3' ? 'active' : ''}
                onClick={() => setActiveTab('3')}
                style={{ cursor: 'pointer' }}
              >
                <i className="mdi mdi-cog me-1"></i>
                Configuración
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="pt-3">
            {renderCredentialsTab()}
            {renderFeesTab()}
            {renderSettingsTab()}
          </TabContent>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            <i className="mdi mdi-content-save me-1"></i>
            Guardar Configuración
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
