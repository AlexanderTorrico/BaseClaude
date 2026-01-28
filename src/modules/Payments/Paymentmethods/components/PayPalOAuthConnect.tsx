import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardBody,
  Button,
  Alert,
  Spinner,
  Badge,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useUserCompanyId } from '@/core/auth/hooks/useUserCompanyId';
import { createPayPalOAuthService } from '../services/PayPalOAuthService';
import {
  OAuthStatusResponse,
  OAuthConfigListItem,
  PaymentConfigMode,
} from '../models/PaymentmethodsModel';

interface PayPalOAuthConnectProps {
  onConfigConnected?: (configUuid: string) => void;
  onConfigDisconnected?: (configUuid: string) => void;
  showExistingConfigs?: boolean;
}

/**
 * Componente para conectar cuenta PayPal via OAuth
 */
const PayPalOAuthConnect: React.FC<PayPalOAuthConnectProps> = ({
  onConfigConnected,
  onConfigDisconnected,
  showExistingConfigs = true,
}) => {
  const companyId = useUserCompanyId();
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [configs, setConfigs] = useState<OAuthConfigListItem[]>([]);
  const [selectedConfigStatus, setSelectedConfigStatus] = useState<OAuthStatusResponse | null>(null);

  // Form state para nueva conexión
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [mode, setMode] = useState<PaymentConfigMode>('sandbox');
  const [currency, setCurrency] = useState('EUR');
  const [brandName, setBrandName] = useState('');

  const service = companyId ? createPayPalOAuthService(companyId) : null;

  // Cargar configuraciones existentes
  const loadConfigs = useCallback(async () => {
    if (!service) return;

    const response = await service.listConfigs(setLoadingConfigs);
    if (response.status === 200 && response.data) {
      setConfigs(response.data);
    }
  }, [service]);

  useEffect(() => {
    if (showExistingConfigs) {
      loadConfigs();
    }
  }, [showExistingConfigs, loadConfigs]);

  // Manejar callback de OAuth (cuando vuelve de PayPal)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const oauthError = urlParams.get('oauth_error');
    const configUuid = urlParams.get('config_uuid');

    if (oauthSuccess === 'true' && configUuid) {
      setSuccess('Cuenta PayPal conectada exitosamente');
      onConfigConnected?.(configUuid);
      // Limpiar URL
      window.history.replaceState({}, '', window.location.pathname);
      loadConfigs();
    } else if (oauthError) {
      setError(decodeURIComponent(oauthError));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [onConfigConnected, loadConfigs]);

  // Iniciar conexión OAuth
  const handleConnect = async () => {
    if (!service) {
      setError('No se pudo obtener el ID de la empresa');
      return;
    }

    if (!clientId.trim() || !clientSecret.trim()) {
      setError('Debes ingresar tu Client ID y Client Secret de PayPal');
      return;
    }

    setError(null);
    setSuccess(null);

    const response = await service.connect(
      clientId.trim(),
      clientSecret.trim(),
      mode,
      currency,
      brandName || undefined,
      setLoadingConnect
    );

    if (response.status === 200 && response.data?.authorization_url) {
      // Redirigir a PayPal
      window.location.href = response.data.authorization_url;
    } else {
      setError(response.message || 'Error al iniciar conexión con PayPal');
    }
  };

  // Desconectar cuenta
  const handleDisconnect = async (configUuid: string) => {
    if (!service) return;

    setError(null);
    setSuccess(null);

    const response = await service.disconnect(configUuid, setLoadingAction);

    if (response.status === 200) {
      setSuccess('Cuenta PayPal desconectada');
      onConfigDisconnected?.(configUuid);
      loadConfigs();
    } else {
      setError(response.message || 'Error al desconectar cuenta');
    }
  };

  // Reconectar cuenta
  const handleReconnect = async (configUuid: string) => {
    if (!service) return;

    setError(null);
    setSuccess(null);

    const response = await service.reconnect(configUuid, setLoadingAction);

    if (response.status === 200 && response.data?.authorization_url) {
      window.location.href = response.data.authorization_url;
    } else {
      setError(response.message || 'Error al iniciar reconexión');
    }
  };

  // Toggle activar/desactivar
  const handleToggleActive = async (configUuid: string) => {
    if (!service) return;

    const response = await service.toggleActive(configUuid, setLoadingAction);

    if (response.status === 200) {
      loadConfigs();
    } else {
      setError(response.message || 'Error al cambiar estado');
    }
  };

  // Ver estado de configuración
  const handleViewStatus = async (configUuid: string) => {
    if (!service) return;

    const response = await service.getStatus(configUuid, setLoadingAction);

    if (response.status === 200 && response.data) {
      setSelectedConfigStatus(response.data);
    } else {
      setError(response.message || 'Error al obtener estado');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      connected: 'success',
      pending: 'warning',
      expired: 'danger',
      revoked: 'secondary',
    };
    const statusLabels: Record<string, string> = {
      connected: 'Conectado',
      pending: 'Pendiente',
      expired: 'Expirado',
      revoked: 'Revocado',
    };

    return (
      <Badge color={statusColors[status] || 'secondary'}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  if (!companyId) {
    return (
      <Alert color="warning">
        <i className="mdi mdi-alert me-2" />
        No se pudo obtener el ID de la empresa.
      </Alert>
    );
  }

  return (
    <div>
      {/* Mensajes de error/éxito */}
      {error && (
        <Alert color="danger" isOpen toggle={() => setError(null)} className="mb-3">
          <i className="mdi mdi-alert-circle me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="success" isOpen toggle={() => setSuccess(null)} className="mb-3">
          <i className="mdi mdi-check-circle me-2" />
          {success}
        </Alert>
      )}

      {/* Configuraciones existentes */}
      {showExistingConfigs && configs.length > 0 && (
        <Card className="mb-4">
          <CardBody>
            <h6 className="mb-3">
              <i className="mdi mdi-link-variant me-2" />
              Cuentas PayPal Conectadas
            </h6>

            {configs.map((config) => (
              <div
                key={config.uuid}
                className="d-flex justify-content-between align-items-center p-3 border rounded mb-2"
              >
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="mdi mdi-paypal text-primary font-size-20" />
                    <strong>{config.oauth_email || 'PayPal'}</strong>
                    {getStatusBadge(config.oauth_status)}
                    <Badge color={config.mode === 'production' ? 'danger' : 'info'} className="ms-1">
                      {config.mode === 'production' ? 'Producción' : 'Sandbox'}
                    </Badge>
                    {config.is_active && (
                      <Badge color="success" className="ms-1">
                        Activa
                      </Badge>
                    )}
                  </div>
                  <small className="text-muted">
                    {config.brand_name && `${config.brand_name} • `}
                    {config.default_currency} •{' '}
                    {config.oauth_connected_at
                      ? `Conectado: ${new Date(config.oauth_connected_at).toLocaleDateString()}`
                      : 'No conectado'}
                  </small>
                </div>

                <div className="d-flex gap-2">
                  <Button
                    color="light"
                    size="sm"
                    onClick={() => handleViewStatus(config.uuid)}
                    title="Ver estado"
                  >
                    <i className="mdi mdi-information-outline" />
                  </Button>

                  {config.oauth_status === 'connected' && (
                    <Button
                      color={config.is_active ? 'warning' : 'success'}
                      size="sm"
                      onClick={() => handleToggleActive(config.uuid)}
                      disabled={loadingAction}
                      title={config.is_active ? 'Desactivar' : 'Activar'}
                    >
                      <i className={`mdi ${config.is_active ? 'mdi-pause' : 'mdi-play'}`} />
                    </Button>
                  )}

                  {(config.oauth_status === 'expired' || config.oauth_status === 'revoked') && (
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => handleReconnect(config.uuid)}
                      disabled={loadingAction}
                    >
                      <i className="mdi mdi-refresh me-1" />
                      Reconectar
                    </Button>
                  )}

                  <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={() => handleDisconnect(config.uuid)}
                    disabled={loadingAction}
                    title="Desconectar"
                  >
                    <i className="mdi mdi-link-variant-off" />
                  </Button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Modal de estado (inline) */}
      {selectedConfigStatus && (
        <Card className="mb-4 border-primary">
          <CardBody>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h6 className="mb-0">
                <i className="mdi mdi-information me-2 text-primary" />
                Estado de la Conexión
              </h6>
              <Button close onClick={() => setSelectedConfigStatus(null)} />
            </div>

            <Row>
              <Col md={6}>
                <p className="mb-2">
                  <strong>Email:</strong> {selectedConfigStatus.oauth_email || 'N/A'}
                </p>
                <p className="mb-2">
                  <strong>Merchant ID:</strong> {selectedConfigStatus.oauth_merchant_id || 'N/A'}
                </p>
                <p className="mb-2">
                  <strong>Estado:</strong> {getStatusBadge(selectedConfigStatus.oauth_status)}
                </p>
              </Col>
              <Col md={6}>
                <p className="mb-2">
                  <strong>Conexión activa:</strong>{' '}
                  {selectedConfigStatus.is_connected ? (
                    <Badge color="success">Sí</Badge>
                  ) : (
                    <Badge color="danger">No</Badge>
                  )}
                </p>
                <p className="mb-2">
                  <strong>Token expira:</strong>{' '}
                  {selectedConfigStatus.token_expires_at
                    ? new Date(selectedConfigStatus.token_expires_at).toLocaleString()
                    : 'N/A'}
                </p>
                <p className="mb-2">
                  <strong>Conectado:</strong>{' '}
                  {selectedConfigStatus.oauth_connected_at
                    ? new Date(selectedConfigStatus.oauth_connected_at).toLocaleString()
                    : 'N/A'}
                </p>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {/* Formulario para nueva conexión */}
      <Card>
        <CardBody>
          <h6 className="mb-3">
            <i className="mdi mdi-plus-circle me-2" />
            Conectar Nueva Cuenta PayPal
          </h6>

          <Alert color="info" className="mb-3">
            <i className="mdi mdi-information me-2" />
            <strong>Credenciales de PayPal Developer:</strong> Necesitas crear una aplicación en{' '}
            <a href="https://developer.paypal.com/dashboard/applications" target="_blank" rel="noopener noreferrer">
              PayPal Developer Dashboard
            </a>{' '}
            para obtener tu Client ID y Client Secret.
          </Alert>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Client ID *</Label>
                <Input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="AYSq3RDGsmBLJ..."
                />
                <small className="text-muted">
                  Obtén esto de tu app en PayPal Developer
                </small>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label>Client Secret *</Label>
                <Input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="EGnHDxD_qRPdaL..."
                />
                <small className="text-muted">
                  Se almacena de forma segura (encriptado)
                </small>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Modo</Label>
                <Input
                  type="select"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as PaymentConfigMode)}
                >
                  <option value="sandbox">Sandbox (Pruebas)</option>
                  <option value="production">Producción</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label>Moneda por defecto</Label>
                <Input
                  type="select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dólar</option>
                  <option value="GBP">GBP - Libra</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label>Nombre del negocio (opcional)</Label>
                <Input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Mi Empresa"
                />
              </FormGroup>
            </Col>
          </Row>

          <div className="d-flex align-items-center gap-3 mt-3">
            <Button
              color="primary"
              size="lg"
              onClick={handleConnect}
              disabled={loadingConnect || !clientId.trim() || !clientSecret.trim()}
              className="d-flex align-items-center"
            >
              {loadingConnect ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Conectando...
                </>
              ) : (
                <>
                  <i className="mdi mdi-paypal me-2 font-size-20" />
                  Conectar con PayPal
                </>
              )}
            </Button>

            <small className="text-muted">
              <i className="mdi mdi-shield-lock me-1" />
              Serás redirigido a PayPal para autorizar el acceso de forma segura.
            </small>
          </div>

          {mode === 'production' && (
            <Alert color="warning" className="mt-3 mb-0">
              <i className="mdi mdi-alert me-2" />
              <strong>Modo Producción:</strong> Las transacciones serán reales. Asegúrate de usar
              las credenciales de producción de tu cuenta PayPal Business.
            </Alert>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PayPalOAuthConnect;
