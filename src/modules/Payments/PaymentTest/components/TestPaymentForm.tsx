import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Spinner,
  InputGroup,
  InputGroupText,
  Badge,
} from 'reactstrap';
import { usePaymentTest } from '../hooks/usePaymentTest';
import { SUPPORTED_CURRENCIES } from '../models/PaymentTestModel';

interface TestPaymentFormProps {
  loading: boolean;
  error: string | null;
  onCreateOrder: (amount: number, currency: string, description?: string) => Promise<void>;
  onClearError: () => void;
}

const TestPaymentForm: React.FC<TestPaymentFormProps> = ({
  loading,
  error,
  onCreateOrder,
  onClearError,
}) => {
  const { paypalConfigs, selectedConfigUuid, setSelectedConfigUuid, selectedConfig, hasConfigs } = usePaymentTest();

  const [amount, setAmount] = useState<string>('10.00');
  const [currency, setCurrency] = useState<string>('EUR');
  const [description, setDescription] = useState<string>('Pago de prueba');

  // Sincronizar moneda con la configuración seleccionada
  useEffect(() => {
    if (selectedConfig?.defaultCurrency) {
      setCurrency(selectedConfig.defaultCurrency);
    }
  }, [selectedConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    await onCreateOrder(numAmount, currency, description || undefined);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y punto decimal
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const quickAmounts = [1, 5, 10, 25, 50, 100];

  if (!hasConfigs) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <i className="mdi mdi-alert-circle-outline text-warning" style={{ fontSize: '48px' }} />
          <h5 className="mt-3">No hay configuraciones de PayPal</h5>
          <p className="text-muted">
            Primero debes configurar al menos una cuenta de PayPal en el módulo de Métodos de Pago.
          </p>
          <Button color="primary" href="/payments/methods">
            Ir a Métodos de Pago
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-transparent">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <i className="mdi mdi-credit-card-plus me-2" />
            Crear Pago de Prueba
          </h5>
          {selectedConfig && (
            <Badge color={selectedConfig.mode === 'sandbox' ? 'warning' : 'success'} className="text-uppercase">
              {selectedConfig.mode}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {error && (
          <Alert color="danger" isOpen={!!error} toggle={onClearError}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Selector de configuración */}
          {paypalConfigs.length > 1 && (
            <FormGroup>
              <Label>Configuración de PayPal</Label>
              <Input
                type="select"
                value={selectedConfigUuid || ''}
                onChange={(e) => setSelectedConfigUuid(e.target.value)}
                disabled={loading}
              >
                {paypalConfigs.map((config) => (
                  <option key={config.uuid} value={config.uuid}>
                    {config.brandName || 'PayPal'} ({config.mode}) - {config.defaultCurrency}
                  </option>
                ))}
              </Input>
            </FormGroup>
          )}

          {/* Monto */}
          <FormGroup>
            <Label>Monto</Label>
            <InputGroup>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                disabled={loading}
                className="text-end"
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
              />
              <InputGroupText>
                <Input
                  type="select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={loading}
                  style={{ border: 'none', background: 'transparent' }}
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code}
                    </option>
                  ))}
                </Input>
              </InputGroupText>
            </InputGroup>
          </FormGroup>

          {/* Montos rápidos */}
          <div className="mb-3">
            <Label className="d-block mb-2">Montos rápidos</Label>
            <div className="d-flex flex-wrap gap-2">
              {quickAmounts.map((qa) => (
                <Button
                  key={qa}
                  color="outline-primary"
                  size="sm"
                  onClick={() => setAmount(qa.toFixed(2))}
                  disabled={loading}
                  className={amount === qa.toFixed(2) ? 'active' : ''}
                >
                  {SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || ''}{qa}
                </Button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <FormGroup>
            <Label>Descripción (opcional)</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del pago"
              disabled={loading}
              maxLength={127}
            />
            <small className="text-muted">{description.length}/127 caracteres</small>
          </FormGroup>

          {/* Info de configuración */}
          {selectedConfig && (
            <div className="bg-light rounded p-3 mb-3">
              <small className="text-muted d-block mb-1">Configuración activa:</small>
              <div className="d-flex align-items-center gap-2">
                <i className="mdi mdi-paypal text-primary" style={{ fontSize: '24px' }} />
                <div>
                  <strong>{selectedConfig.brandName || 'PayPal'}</strong>
                  <br />
                  <small className="text-muted">
                    Modo: {selectedConfig.mode} | Moneda: {selectedConfig.defaultCurrency}
                    {selectedConfig.isVerified && (
                      <span className="text-success ms-2">
                        <i className="mdi mdi-check-circle" /> Verificado
                      </span>
                    )}
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-100"
            disabled={loading || !amount || parseFloat(amount) <= 0}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creando orden...
              </>
            ) : (
              <>
                <i className="mdi mdi-paypal me-2" />
                Crear Orden de Pago
              </>
            )}
          </Button>

          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="mdi mdi-information-outline me-1" />
              Se abrirá una ventana de PayPal para completar el pago
            </small>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default TestPaymentForm;
