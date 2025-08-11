import { Row, Col, Card, CardBody, InputGroup, InputGroupText, Input, Button, Badge } from "reactstrap";
import PropTypes from "prop-types";
import CustomSelect from "./CustomSelect";
import FilterInfoPanel from "./FilterInfoPanel";
import { opcionesOrdenamiento } from "../utils/constants.js";

const CardSearchPanel = ({ 
  cardSearchTerm,
  cardSorting,
  usuariosFiltradosCards,
  usuarios,
  onSearchChange,
  onSortFieldChange,
  onSortDirectionChange,
  onClearFilters
}) => {
  // Check if there are active filters or sorting
  const hasActiveFilters = cardSearchTerm || (cardSorting.field && cardSorting.field !== 'nombre') || cardSorting.direction === 'desc';
  return (
    <Card className="border-0 shadow-sm mb-4 card-filter-panel">
      <CardBody className="p-3">
        {/* Title and Basic Info Row */}
        <Row className="align-items-center mb-3">
          <Col xs={12}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="mb-2 mb-md-0">
                <h5 className="mb-1">Vista de Tarjetas</h5>
                <p className="text-muted mb-0 small">
                  Gestión visual de usuarios
                  {hasActiveFilters && (
                    <Badge color="info" className="ms-2" style={{ fontSize: '0.65rem' }}>
                      <i className="mdi mdi-filter-check me-1"></i>
                      {usuariosFiltradosCards.length} de {usuarios.length} resultados
                    </Badge>
                  )}
                </p>
              </div>
              {!hasActiveFilters && (
                <div className="text-muted small">
                  {usuariosFiltradosCards.length} usuario{usuariosFiltradosCards.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Search Controls Row */}
        <Row className="g-2 align-items-end mb-3">
          <Col lg={6} md={12} sm={12} xs={12}>
            <InputGroup size="sm" className="search-input-group">
              <InputGroupText className="bg-light">
                <i className="mdi mdi-magnify text-muted"></i>
              </InputGroupText>
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={cardSearchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="form-control-sm search-input-enhanced"
              />
              {cardSearchTerm && (
                <InputGroupText 
                  className="bg-light cursor-pointer"
                  onClick={() => onSearchChange("")}
                  title="Limpiar búsqueda"
                >
                  <i className="mdi mdi-close text-muted"></i>
                </InputGroupText>
              )}
            </InputGroup>
          </Col>
          
          <Col lg={2} md={3} sm={4} xs={6}>
            <CustomSelect
              value={cardSorting.field}
              onChange={onSortFieldChange}
              options={opcionesOrdenamiento}
              placeholder="Ordenar por"
              icon="mdi-sort"
              size="sm"
            />
          </Col>
          
          <Col lg={1} md={2} sm={4} xs={6}>
            <div className="btn-group w-100" role="group">
              <Button 
                color={cardSorting.direction === 'asc' ? 'primary' : 'light'}
                size="sm"
                onClick={() => onSortDirectionChange('asc')}
                title="Ascendente"
                className="d-flex align-items-center justify-content-center"
                style={{ height: '31px' }}
              >
                <i className="mdi mdi-sort-ascending"></i>
              </Button>
              <Button 
                color={cardSorting.direction === 'desc' ? 'primary' : 'light'}
                size="sm"
                onClick={() => onSortDirectionChange('desc')}
                title="Descendente"
                className="d-flex align-items-center justify-content-center"
                style={{ height: '31px' }}
              >
                <i className="mdi mdi-sort-descending"></i>
              </Button>
            </div>
          </Col>
          
          <Col lg={3} md={4} sm={4} xs={12}>
            <div className="text-end">
              {hasActiveFilters && (
                <Button 
                  color="outline-secondary" 
                  size="sm"
                  onClick={onClearFilters}
                  className="d-inline-flex align-items-center"
                  title="Limpiar todos los filtros"
                >
                  <i className="mdi mdi-filter-remove me-1"></i>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Informative Filter Panel usando FilterInfoPanel */}
        <FilterInfoPanel
          filters={cardSearchTerm ? [{
            column: 'búsqueda',
            value: cardSearchTerm,
            type: 'search'
          }] : []}
          sorting={(cardSorting.field && cardSorting.field !== 'nombre') || cardSorting.direction === 'desc' ? {
            column: cardSorting.field,
            direction: cardSorting.direction,
            isActive: true
          } : null}
          onClearFilter={(filter) => {
            if (filter.type === 'search') {
              onSearchChange('');
            }
          }}
          onClearSorting={() => {
            onSortFieldChange('nombre');
            onSortDirectionChange('asc');
          }}
          onClearAll={onClearFilters}
          totalResults={usuariosFiltradosCards.length}
          totalItems={usuarios.length}
          isIntegrated={true}
        />
      </CardBody>
    </Card>
  );
};

CardSearchPanel.propTypes = {
  cardSearchTerm: PropTypes.string.isRequired,
  cardSorting: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  usuariosFiltradosCards: PropTypes.array.isRequired,
  usuarios: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSortFieldChange: PropTypes.func.isRequired,
  onSortDirectionChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default CardSearchPanel;