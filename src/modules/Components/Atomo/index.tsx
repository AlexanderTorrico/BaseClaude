import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//Import Atoms
import { 
  Button, 
  Input, 
  Checkbox, 
  Badge, 
  Avatar, 
  Typography, 
  Icon,
  // Typography shortcuts para escritura rápida
  H1, H2, H3, H4, H5, H6,
  P, Small, Strong,
  Title, Subtitle, Lead, Caption,
  TextPrimary, TextSuccess, TextDanger, TextMuted
} from "../../../components/Atoms";

//Import Icon Examples
import IconExamples, { getSimplifiedName, TextIcon } from "../../../components/Atoms/IconExample";

//i18n
import { withTranslation, WithTranslation } from "react-i18next";

interface AtomoProps extends WithTranslation {}

const Atomo: React.FC<AtomoProps> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);

  //meta title
  document.title = "Átomos del Sistema | Skote - Vite React Admin & Dashboard Template";

  return (
     <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="UI Elements" breadcrumbItem="Átomos del Sistema" />
          
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Typography variant="h4" weight="bold">
                    Sistema de Átomos - Atomic Design
                  </Typography>
                  <H4 weight="bold">
                    Sistema de Átomos - Atomic Design
                  </H4>
                  <Typography variant="p" color="muted">
                    Componentes base reutilizables para el sistema de gestión de usuarios
                  </Typography>
                </CardHeader>
                <CardBody>
                  
                  {/* Buttons Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">🔘 Buttons</Typography>
                    
                    {/* Botones estándar personalizados */}
                    <div className="mb-4 p-3 bg-light rounded">
                      <Typography variant="h6" className="mb-2">⭐ Botones Estándar (size="sm" = 27.46px alto exacto):</Typography>
                      <div className="d-flex flex-wrap gap-2">
                        <Button onClick={()=> alert("Hola mundo")} variant="primary" fontWeight="normal">Crear Usuario</Button>
                        <Button variant="primary" fontWeight="normal">
                          <i className="mdi mdi-pencil me-1"></i>
                          Editar
                        </Button>
                        <Button variant="danger" fontWeight="normal">
                          <i className="mdi mdi-delete me-1"></i>
                          Eliminar
                        </Button>
                        <Button variant="success" fontWeight="normal">
                          <i className="mdi mdi-check me-1"></i>
                          Guardar
                        </Button>
                      </div>
                    </div>

                    {/* Variantes de colores */}
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Variantes de colores:</Typography>
                    </div>

                    {/* Variantes outline */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Button variant="outline-primary" fontWeight="normal">Outline Primary</Button>
                      <Button variant="outline-secondary" fontWeight="normal">Outline Secondary</Button>
                      <Button variant="outline-danger" fontWeight="normal">Outline Danger</Button>
                    </div>

                    {/* Tamaños */}
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Button size="xs" variant="primary" fontWeight="normal">Extra Small</Button>
                      <Button size="sm" variant="primary" fontWeight="normal">Small (Estándar)</Button>
                      <Button size="md" variant="primary" fontWeight="normal">Medium</Button>
                      <Button size="lg" variant="primary" fontWeight="normal">Large</Button>
                      <Button size="xl" variant="primary" fontWeight="normal">Extra Large</Button>
                    </div>

                    {/* Estados especiales */}
                    <div className="d-flex flex-wrap gap-2">
                      <Button disabled variant="primary" fontWeight="normal">Disabled</Button>
                      <Button loading variant="success" fontWeight="normal">Loading</Button>
                      <Button fullWidth variant="info" fontWeight="normal">Full Width</Button>
                    </div>
                  </div>

                  {/* Inputs Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">📝 Inputs</Typography>
                    <Row>
                      <Col md={4}>
                        <Input 
                          label="Nombre completo"
                          placeholder="Ingresa tu nombre"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <Input 
                          label="Email"
                          type="email"
                          placeholder="usuario@ejemplo.com"
                          variant="filled"
                        />
                      </Col>
                      <Col md={4}>
                        <Input 
                          label="Contraseña"
                          type="password"
                          placeholder="••••••••"
                          variant="underlined"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Input 
                          label="Campo con error"
                          error="Este campo es requerido"
                          value="Valor inválido"
                          readonly
                        />
                      </Col>
                      <Col md={6}>
                        <Input 
                          label="Campo deshabilitado"
                          value="Campo deshabilitado"
                          disabled
                          readonly
                          helperText="Este campo no se puede editar"
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Checkboxes Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">☑️ Checkboxes</Typography>
                    <Row>
                      <Col md={3}>
                        <Checkbox 
                          label="Checkbox básico"
                          checked={checkboxValue}
                          onChange={(e) => setCheckboxValue(e.target.checked)}
                        />
                      </Col>
                      <Col md={3}>
                        <Checkbox 
                          label="Checkbox deshabilitado"
                          disabled
                          checked={true}
                          readOnly
                        />
                      </Col>
                      <Col md={3}>
                        <Checkbox 
                          label="Con error"
                          error="Debes aceptar los términos"
                          variant="danger"
                          readOnly
                        />
                      </Col>
                      <Col md={3}>
                        <Checkbox 
                          label="Con descripción"
                          description="Texto de ayuda adicional"
                          variant="success"
                          readOnly
                        />
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Typography variant="h6" className="mb-2">Tamaños:</Typography>
                      <div className="d-flex gap-3">
                        <Checkbox label="Pequeño" size="sm" readOnly />
                        <Checkbox label="Mediano" size="md" readOnly />
                        <Checkbox label="Grande" size="lg" readOnly />
                      </div>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">🏷️ Badges</Typography>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Estados de usuario:</Typography>
                      <div className="d-flex flex-wrap gap-2">
                        <Badge status="active" />
                        <Badge status="inactive" />
                        <Badge status="suspended" />
                        <Badge status="pending" />
                        <Badge status="completed" />
                        <Badge status="draft" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Variantes de colores:</Typography>
                      <div className="d-flex flex-wrap gap-2">
                        <Badge variant="primary">Primary</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge variant="danger">Danger</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="info">Info</Badge>
                      </div>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Tamaños y formas:</Typography>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <Badge size="sm">Pequeño</Badge>
                        <Badge size="md">Mediano</Badge>
                        <Badge size="lg">Grande</Badge>
                        <Badge pill>Píldora</Badge>
                        <Badge dot status="active" />
                        <Badge dot status="inactive" />
                        <Badge dot status="suspended" />
                      </div>
                    </div>
                  </div>

                  {/* Avatars Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">👤 Avatars</Typography>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Con iniciales:</Typography>
                      <div className="d-flex flex-wrap gap-3 align-items-center">
                        <Avatar name="Juan Pérez" size="sm" />
                        <Avatar name="María García" size="md" />
                        <Avatar name="Carlos López" size="lg" />
                        <Avatar name="Ana Martín" size="xl" />
                        <Avatar initial="AB" size="2xl" variant="success" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Formas:</Typography>
                      <div className="d-flex flex-wrap gap-3 align-items-center">
                        <Avatar name="Usuario 1" shape="circle" />
                        <Avatar name="Usuario 2" shape="square" />
                        <Avatar name="Usuario 3" shape="rounded" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Con estado:</Typography>
                      <div className="d-flex flex-wrap gap-3 align-items-center">
                        <Avatar name="Online" status="online" showStatus />
                        <Avatar name="Busy" status="busy" showStatus />
                        <Avatar name="Away" status="away" showStatus />
                        <Avatar name="Offline" status="offline" showStatus />
                      </div>
                    </div>
                    <div className="mb-3">
                      <Typography variant="h6" className="mb-2">Con imágenes:</Typography>
                      <div className="d-flex flex-wrap gap-3 align-items-center">
                        <Avatar 
                          src="https://ui-avatars.com/api/?name=Juan+Perez&background=dc3545&color=fff&size=40" 
                          name="Juan Pérez" 
                          size="md" 
                        />
                        <Avatar 
                          src="https://ui-avatars.com/api/?name=Maria+Garcia&background=28a745&color=fff&size=48" 
                          name="María García" 
                          size="lg" 
                          status="online"
                          showStatus
                        />
                        <Avatar 
                          src="https://picsum.photos/32/32?random=3" 
                          name="Carlos López" 
                          size="sm" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">📝 Typography - Dos enfoques</Typography>
                    
                    {/* Enfoque tradicional */}
                    <div className="mb-4 p-3 bg-light rounded">
                      <Typography variant="h6" className="mb-2">🔧 Enfoque Completo (Typography):</Typography>
                      <div className="mb-3">
                        <Typography variant="h1">Heading 1 (completo)</Typography>
                        <Typography variant="h2" color="primary" weight="bold">Heading 2 personalizado</Typography>
                        <Typography variant="p" size="lg" color="muted" truncate className="w-75">
                          Párrafo con múltiples props: tamaño grande, color silenciado y truncado
                        </Typography>
                      </div>
                      <Small color="muted">💡 Mejor para casos complejos con múltiples props</Small>
                    </div>

                    {/* Enfoque de shortcuts */}
                    <div className="mb-4 p-3 bg-primary bg-opacity-10 rounded">
                      <Typography variant="h6" className="mb-2">⚡ Enfoque Rápido (Shortcuts):</Typography>
                      <div className="mb-3">
                        <H1>Heading 1 (rápido)</H1>
                        <H2 color="primary">Heading 2 rápido</H2>
                        <Title>Título predefinido</Title>
                        <Subtitle>Subtítulo predefinido</Subtitle>
                        <P>Párrafo normal rápido</P>
                        <Lead>Texto destacado (Lead)</Lead>
                        <Caption>Texto de caption</Caption>
                      </div>
                      <Small color="muted">💡 Mejor para escritura rápida y casos comunes</Small>
                    </div>

                    {/* Comparación de código */}
                    <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded">
                      <Typography variant="h6" className="mb-2">📊 Comparación de código:</Typography>
                      <div className="row">
                        <div className="col-md-6">
                          <Small color="muted" className="d-block mb-2">Enfoque completo:</Small>
                          <Typography variant="code" className="d-block bg-white p-2 rounded">
                            {"<Typography variant=\"h2\" color=\"primary\">"}
                          </Typography>
                        </div>
                        <div className="col-md-6">
                          <Small color="muted" className="d-block mb-2">Enfoque rápido:</Small>
                          <Typography variant="code" className="d-block bg-white p-2 rounded">
                            {"<H2 color=\"primary\">"}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Shortcuts de colores */}
                    <div className="mb-4">
                      <Typography variant="h6" className="mb-2">🎨 Shortcuts de colores:</Typography>
                      <div className="mb-3">
                        <TextPrimary>Texto primario (shortcut)</TextPrimary>
                        <TextSuccess>Texto de éxito (shortcut)</TextSuccess>
                        <TextDanger>Texto de peligro (shortcut)</TextDanger>
                        <TextMuted>Texto silenciado (shortcut)</TextMuted>
                      </div>
                    </div>

                    {/* Casos de uso tradicional */}
                    <div>
                      <Typography variant="h6" className="mb-2">🔧 Casos complejos (usar Typography completo):</Typography>
                      <Typography variant="p" transform="uppercase" decoration="underline" weight="bold">
                        Texto en mayúsculas, subrayado y negrita
                      </Typography>
                      <Typography variant="p" truncate className="w-50">
                        Este texto se truncará con puntos suspensivos cuando sea muy largo
                      </Typography>
                    </div>
                  </div>

                  {/* Icons Section */}
                  <div className="mb-5">
                    <Typography variant="h5" className="mb-3">🔢 Icons y Texto Simplificado</Typography>
                    
                    {/* Función de simplificación */}
                    <div className="mb-4 p-3 bg-light rounded">
                      <Typography variant="h6" className="mb-2">📝 Función de Simplificación:</Typography>
                      <Typography variant="code" className="d-block mb-2">
                        getSimplifiedName("Alexander Torrico") → "{getSimplifiedName("Alexander Torrico")}"
                      </Typography>
                      <Typography variant="code" className="d-block mb-2">
                        getSimplifiedName("Alexander") → "{getSimplifiedName("Alexander")}"
                      </Typography>
                      <Typography variant="code" className="d-block mb-2">
                        getSimplifiedName("María García López") → "{getSimplifiedName("María García López")}"
                      </Typography>
                      <Typography variant="code" className="d-block">
                        getSimplifiedName("Juan") → "{getSimplifiedName("Juan")}"
                      </Typography>
                    </div>

                    {/* TextIcon personalizado */}
                    <div className="mb-4">
                      <Typography variant="h6" className="mb-2">🎨 TextIcon Personalizado:</Typography>
                      <div className="d-flex flex-wrap gap-3 align-items-end">
                        <TextIcon name="Alexander Torrico" size="sm" color="primary" />
                        <TextIcon name="Alexander" size="md" color="success" />
                        <TextIcon name="María García López" size="lg" color="danger" />
                        <TextIcon name="Juan" size="xl" color="warning" />
                      </div>
                    </div>

                    {/* Comparación Avatar vs TextIcon */}
                    <div className="mb-4">
                      <Typography variant="h6" className="mb-2">⚖️ Comparación Avatar vs TextIcon:</Typography>
                      <div className="row">
                        <div className="col-md-6">
                          <Typography variant="small" color="muted" className="mb-2 d-block">Avatar estándar:</Typography>
                          <div className="d-flex gap-2">
                            <Avatar name="Alexander Torrico" size="md" variant="primary" />
                            <Avatar name="Alexander" size="md" variant="success" />
                            <Avatar name="María García" size="md" variant="danger" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <Typography variant="small" color="muted" className="mb-2 d-block">TextIcon con nombre:</Typography>
                          <div className="d-flex gap-2">
                            <TextIcon name="Alexander Torrico" size="md" color="primary" />
                            <TextIcon name="Alexander" size="md" color="success" />
                            <TextIcon name="María García" size="md" color="danger" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Icons con librerías externas */}
                    <div className="mb-4">
                      <Typography variant="h6" className="mb-2">📚 Íconos de librerías externas:</Typography>
                      <Typography variant="small" color="muted" className="mb-3 d-block">
                        Nota: Requieren Feather Icons, Bootstrap Icons o Font Awesome
                      </Typography>
                      <div className="d-flex flex-wrap gap-3 align-items-center">
                        <Icon name="?" size="xs" color="muted" />
                        <Icon name="?" size="sm" color="primary" />
                        <Icon name="?" size="md" color="success" />
                        <Icon name="?" size="lg" color="danger" />
                        <Icon name="?" size="xl" color="warning" />
                        <Icon name="AW" size="2xl" color="info" />
                      </div>
                    </div>

                    {/* Con imágenes */}
                    <div className="mb-4">
                      <Typography variant="h6" className="mb-2">🖼️ Con imágenes de ejemplo:</Typography>
                      <div className="d-flex gap-3 align-items-end">
                        <div className="text-center">
                          <Avatar 
                            src="https://picsum.photos/48/48?random=1" 
                            alt="Alexander Torrico"
                            size="lg"
                          />
                          <Typography variant="small" className="text-muted d-block mt-1">
                            Con imagen real
                          </Typography>
                        </div>
                        <div className="text-center">
                          <Avatar 
                            src="https://ui-avatars.com/api/?name=Alexander+Torrico&background=007bff&color=fff&size=48" 
                            alt="Alexander Torrico"
                            size="lg"
                          />
                          <Typography variant="small" className="text-muted d-block mt-1">
                            Avatar generado
                          </Typography>
                        </div>
                        <div className="text-center">
                          <TextIcon name="Alexander Torrico" size="lg" color="primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

// TypeScript interfaces replace PropTypes

export default withTranslation()(Atomo);