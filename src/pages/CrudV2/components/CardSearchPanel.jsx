import React from "react";
import { Row, Col, Card, CardBody, InputGroup, InputGroupText, Input, Button, Badge } from "reactstrap";
import CustomSelect from "./CustomSelect";
import { opcionesOrdenamiento } from "../utils/constants.js";

const CardSearchPanel = ({ 
  cardSearchTerm,
  cardSorting,
  usuariosFiltradosCards,
  usuarios,
  onSearchChange,
  onSortFieldChange,
  onSortDirectionChange,
  onClearFilters,
  getActiveCardFilters
}) => {
  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardBody className="p-3">
        <Row className="g-2 align-items-end">
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
                className="form-control-sm"
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
          
          <Col lg={1} md={2} sm={6} xs={6}>
            {getActiveCardFilters().length > 0 ? (
              <Button 
                color="outline-secondary" 
                size="sm"
                onClick={onClearFilters}
                className="w-100"
                title="Limpiar filtros"
              >
                <i className="mdi mdi-filter-remove"></i>
              </Button>
            ) : (
              <div className="text-center">
                <small className="text-muted">
                  {usuariosFiltradosCards.length}/{usuarios.length}
                </small>
              </div>
            )}
          </Col>
        </Row>

        {getActiveCardFilters().length > 0 && (
          <Row className="mt-3">
            <Col xs={12}>
              <div className="d-flex align-items-center flex-wrap">
                <span className="text-muted small me-2 fw-medium">
                  <i className="mdi mdi-filter-check me-1"></i>
                  Filtros activos:
                </span>
                
                {getActiveCardFilters().map((filter, index) => (
                  <Badge 
                    key={index}
                    color="primary" 
                    className="me-2 mb-2 d-inline-flex align-items-center"
                    style={{ fontSize: '0.7rem' }}
                  >
                    <i className="mdi mdi-magnify me-1"></i>
                    <span className="text-truncate" style={{ maxWidth: '150px' }}>
                      {filter.column}: "{filter.value}"
                    </span>
                    <Button
                      color="link"
                      size="sm"
                      className="p-0 ms-1 text-white"
                      onClick={() => onSearchChange('')}
                      style={{ fontSize: '0.7rem', lineHeight: '1' }}
                      title="Eliminar filtro"
                    >
                      <i className="mdi mdi-close"></i>
                    </Button>
                  </Badge>
                ))}
                
                <small className="text-muted ms-2">
                  ({usuariosFiltradosCards.length} resultado{usuariosFiltradosCards.length !== 1 ? 's' : ''})
                </small>
              </div>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default CardSearchPanel;