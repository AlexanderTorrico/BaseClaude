import { Row, Col, Card, CardBody, InputGroup, InputGroupText, Input, Button } from "reactstrap";
import PropTypes from "prop-types";
import CustomSelect from "./CustomSelect";
import FilterInfoPanel from "./FilterInfoPanel";
import { opcionesOrdenamiento } from "../../pages/CrudV2/config/userConstants.js";

const CardSearchPanelSimple = ({ 
  cardSearchTerm,
  cardSorting,
  usuariosFiltradosCards,
  usuarios,
  onSearchChange,
  onSortFieldChange,
  onSortDirectionChange,
  onClearFilters
}) => {
  const hasActiveFilters = cardSearchTerm || (cardSorting.field && cardSorting.field !== 'nombre') || cardSorting.direction === 'desc';
  
  return (
    <Card className="border-0 shadow-sm mb-4 card-filter-panel">
      <CardBody className="p-3">
        {/* Search and Filter Controls */}
        <Row className="align-items-center mb-3">
          <Col lg={6} md={12}>
            <InputGroup>
              <InputGroupText>
                <i className="mdi mdi-magnify"></i>
              </InputGroupText>
              <Input
                type="text"
                placeholder="Buscar usuarios..."
                value={cardSearchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </InputGroup>
          </Col>
          
          <Col lg={6} md={12} className="mt-3 mt-lg-0">
            <Row>
              <Col md={6}>
                <CustomSelect
                  value={cardSorting.field}
                  onChange={onSortFieldChange}
                  options={opcionesOrdenamiento}
                  placeholder="Ordenar por"
                />
              </Col>
              <Col md={6} className="mt-2 mt-md-0">
                <div className="btn-group w-100" role="group">
                  <Button
                    color={cardSorting.direction === 'asc' ? 'primary' : 'light'}
                    onClick={() => onSortDirectionChange('asc')}
                    size="sm"
                  >
                    <i className="mdi mdi-sort-alphabetical-ascending"></i>
                  </Button>
                  <Button
                    color={cardSorting.direction === 'desc' ? 'primary' : 'light'}
                    onClick={() => onSortDirectionChange('desc')}
                    size="sm"
                  >
                    <i className="mdi mdi-sort-alphabetical-descending"></i>
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Filter Info Panel */}
        {hasActiveFilters && (
          <FilterInfoPanel
            filters={cardSearchTerm ? [['search', cardSearchTerm]] : []}
            sorting={cardSorting.field && cardSorting.direction ? {
              column: cardSorting.field,
              direction: cardSorting.direction,
              isActive: true
            } : null}
            onClearFilter={() => onSearchChange('')}
            onClearSorting={() => {
              onSortFieldChange('nombre');
              onSortDirectionChange('asc');
            }}
            onClearAll={onClearFilters}
            totalResults={usuariosFiltradosCards.length}
            totalItems={usuarios.length}
            isIntegrated={false}
            className="mt-3"
          />
        )}
      </CardBody>
    </Card>
  );
};

CardSearchPanelSimple.propTypes = {
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

export default CardSearchPanelSimple;