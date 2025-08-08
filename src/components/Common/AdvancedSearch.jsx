import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Badge,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import PropTypes from 'prop-types';

const AdvancedSearch = ({ 
  isOpen,
  toggle,
  fields = [],
  onSearch,
  onClear,
  initialValues = {},
  className = ""
}) => {
  const [searchCriteria, setSearchCriteria] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('advancedSearches') || '[]');
    setSavedSearches(saved);
    
    if (Object.keys(initialValues).length > 0) {
      const criteria = Object.entries(initialValues).map(([field, config]) => ({
        id: Date.now() + Math.random(),
        field,
        operator: config.operator || 'contains',
        value: config.value || ''
      }));
      setSearchCriteria(criteria);
    }
  }, [initialValues, isOpen]);

  const operators = {
    text: [
      { value: 'contains', label: 'Contiene', icon: 'mdi-magnify' },
      { value: 'equals', label: 'Igual a', icon: 'mdi-equal' },
      { value: 'startsWith', label: 'Comienza con', icon: 'mdi-format-align-left' },
      { value: 'endsWith', label: 'Termina con', icon: 'mdi-format-align-right' },
      { value: 'notEquals', label: 'No igual a', icon: 'mdi-not-equal' },
      { value: 'isEmpty', label: 'Está vacío', icon: 'mdi-checkbox-blank-outline' },
      { value: 'isNotEmpty', label: 'No está vacío', icon: 'mdi-checkbox-marked-outline' }
    ],
    number: [
      { value: 'equals', label: 'Igual a', icon: 'mdi-equal' },
      { value: 'greaterThan', label: 'Mayor que', icon: 'mdi-greater-than' },
      { value: 'lessThan', label: 'Menor que', icon: 'mdi-less-than' },
      { value: 'greaterThanOrEqual', label: 'Mayor o igual que', icon: 'mdi-greater-than-or-equal' },
      { value: 'lessThanOrEqual', label: 'Menor o igual que', icon: 'mdi-less-than-or-equal' },
      { value: 'notEquals', label: 'No igual a', icon: 'mdi-not-equal' }
    ],
    date: [
      { value: 'equals', label: 'Igual a', icon: 'mdi-equal' },
      { value: 'greaterThan', label: 'Después de', icon: 'mdi-calendar-arrow-right' },
      { value: 'lessThan', label: 'Antes de', icon: 'mdi-calendar-arrow-left' },
      { value: 'greaterThanOrEqual', label: 'En o después de', icon: 'mdi-calendar-check' },
      { value: 'lessThanOrEqual', label: 'En o antes de', icon: 'mdi-calendar-remove' }
    ]
  };

  const addCriteria = () => {
    const newCriteria = {
      id: Date.now(),
      field: fields[0]?.value || '',
      operator: 'contains',
      value: ''
    };
    setSearchCriteria([...searchCriteria, newCriteria]);
  };

  const updateCriteria = (id, property, value) => {
    setSearchCriteria(criteria => 
      criteria.map(c => 
        c.id === id ? { ...c, [property]: value } : c
      )
    );
  };

  const removeCriteria = (id) => {
    setSearchCriteria(criteria => criteria.filter(c => c.id !== id));
  };

  const handleSearch = () => {
    const validCriteria = searchCriteria.filter(c => 
      c.field && c.operator && (c.value || ['isEmpty', 'isNotEmpty'].includes(c.operator))
    );
    
    const searchObject = validCriteria.reduce((acc, criteria) => {
      acc[criteria.field] = {
        operator: criteria.operator,
        value: criteria.value
      };
      return acc;
    }, {});
    
    onSearch(searchObject);
    toggle();
  };

  const handleClear = () => {
    setSearchCriteria([]);
    onClear();
  };

  const saveSearch = () => {
    const name = prompt('Nombre para guardar esta búsqueda:');
    if (name && searchCriteria.length > 0) {
      const newSaved = [...savedSearches, {
        id: Date.now(),
        name,
        criteria: searchCriteria
      }];
      setSavedSearches(newSaved);
      localStorage.setItem('advancedSearches', JSON.stringify(newSaved));
    }
  };

  const loadSearch = (savedSearch) => {
    setSearchCriteria(savedSearch.criteria);
  };

  const deleteSavedSearch = (id) => {
    const newSaved = savedSearches.filter(s => s.id !== id);
    setSavedSearches(newSaved);
    localStorage.setItem('advancedSearches', JSON.stringify(newSaved));
  };

  const getFieldType = (fieldValue) => {
    const field = fields.find(f => f.value === fieldValue);
    return field?.type || 'text';
  };

  const getFieldIcon = (fieldValue) => {
    const field = fields.find(f => f.value === fieldValue);
    return field?.icon || 'mdi-text-box-outline';
  };

  const getOperatorIcon = (operator, fieldType) => {
    const typeOperators = operators[fieldType] || operators.text;
    const operatorConfig = typeOperators.find(op => op.value === operator);
    return operatorConfig?.icon || 'mdi-help-circle-outline';
  };

  const renderValueInput = (criteria) => {
    const fieldType = getFieldType(criteria.field);
    const needsValue = !['isEmpty', 'isNotEmpty'].includes(criteria.operator);
    
    if (!needsValue) {
      return <Input disabled placeholder="No se requiere valor" />;
    }

    switch (fieldType) {
      case 'number':
        return (
          <Input
            type="number"
            value={criteria.value}
            onChange={(e) => updateCriteria(criteria.id, 'value', e.target.value)}
            placeholder="Ingresa un número"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={criteria.value}
            onChange={(e) => updateCriteria(criteria.id, 'value', e.target.value)}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={criteria.value}
            onChange={(e) => updateCriteria(criteria.id, 'value', e.target.value)}
            placeholder="Ingresa el valor"
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className={className}>
      <ModalHeader toggle={toggle} className="border-bottom">
        <div className="d-flex align-items-center">
          <i className="mdi mdi-filter-variant me-2 text-primary"></i>
          <div>
            <h5 className="mb-0">Búsqueda Avanzada</h5>
            <small className="text-muted">Crea criterios específicos de búsqueda</small>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-4">
        {/* Búsquedas guardadas */}
        {savedSearches.length > 0 && (
          <Card className="mb-4">
            <CardBody>
              <h6 className="mb-3">
                <i className="mdi mdi-bookmark-outline me-2"></i>
                Búsquedas Guardadas
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {savedSearches.map(saved => (
                  <Badge 
                    key={saved.id} 
                    color="light"
                    className="d-flex align-items-center p-2"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <span 
                      className="cursor-pointer me-2"
                      onClick={() => loadSearch(saved)}
                    >
                      <i className="mdi mdi-bookmark me-1"></i>
                      {saved.name}
                    </span>
                    <Button
                      color="link"
                      size="sm"
                      className="p-0 text-danger"
                      onClick={() => deleteSavedSearch(saved.id)}
                    >
                      <i className="mdi mdi-close" style={{ fontSize: '0.8rem' }}></i>
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Criterios de búsqueda */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              <i className="mdi mdi-filter-cog me-2"></i>
              Criterios de Búsqueda
            </h6>
            <Button color="primary" size="sm" onClick={addCriteria}>
              <i className="mdi mdi-plus me-1"></i>
              Agregar Criterio
            </Button>
          </div>

          {searchCriteria.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="mdi mdi-filter-off display-4 d-block mb-2"></i>
              <p>No hay criterios de búsqueda definidos</p>
              <Button color="outline-primary" onClick={addCriteria}>
                <i className="mdi mdi-plus me-1"></i>
                Agregar primer criterio
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {searchCriteria.map((criteria, index) => (
                <Card key={criteria.id} className="border-0 shadow-sm">
                  <CardBody className="p-3">
                    <Row className="align-items-end">
                      {/* AND/OR conectores */}
                      {index > 0 && (
                        <Col xs={12} className="mb-2">
                          <div className="text-center">
                            <Badge color="info" className="px-3 py-1">
                              Y
                            </Badge>
                          </div>
                        </Col>
                      )}

                      {/* Campo */}
                      <Col md={3} className="mb-2">
                        <Label className="form-label">Campo</Label>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="button"
                            className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                          >
                            <span className="d-flex align-items-center">
                              <i className={`${getFieldIcon(criteria.field)} me-2`}></i>
                              {fields.find(f => f.value === criteria.field)?.label || 'Seleccionar'}
                            </span>
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu className="w-100">
                            {fields.map(field => (
                              <DropdownItem
                                key={field.value}
                                onClick={() => updateCriteria(criteria.id, 'field', field.value)}
                                className={criteria.field === field.value ? 'active' : ''}
                              >
                                <i className={`${field.icon || 'mdi-text-box-outline'} me-2`}></i>
                                {field.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>

                      {/* Operador */}
                      <Col md={3} className="mb-2">
                        <Label className="form-label">Operador</Label>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="button"
                            className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                          >
                            <span className="d-flex align-items-center">
                              <i className={`${getOperatorIcon(criteria.operator, getFieldType(criteria.field))} me-2`}></i>
                              {operators[getFieldType(criteria.field)]?.find(op => op.value === criteria.operator)?.label || 'Seleccionar'}
                            </span>
                            <i className="mdi mdi-chevron-down"></i>
                          </DropdownToggle>
                          <DropdownMenu className="w-100">
                            {(operators[getFieldType(criteria.field)] || operators.text).map(operator => (
                              <DropdownItem
                                key={operator.value}
                                onClick={() => updateCriteria(criteria.id, 'operator', operator.value)}
                                className={criteria.operator === operator.value ? 'active' : ''}
                              >
                                <i className={`${operator.icon} me-2`}></i>
                                {operator.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </Col>

                      {/* Valor */}
                      <Col md={4} className="mb-2">
                        <Label className="form-label">Valor</Label>
                        {renderValueInput(criteria)}
                      </Col>

                      {/* Acciones */}
                      <Col md={2} className="mb-2">
                        <Button
                          color="danger"
                          size="sm"
                          onClick={() => removeCriteria(criteria.id)}
                          className="w-100"
                        >
                          <i className="mdi mdi-delete"></i>
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter className="border-top">
        <div className="d-flex justify-content-between w-100">
          <div>
            {searchCriteria.length > 0 && (
              <Button color="outline-info" onClick={saveSearch} className="me-2">
                <i className="mdi mdi-bookmark-plus me-1"></i>
                Guardar Búsqueda
              </Button>
            )}
          </div>
          <div>
            <Button color="light" onClick={handleClear} className="me-2">
              <i className="mdi mdi-refresh me-1"></i>
              Limpiar
            </Button>
            <Button color="secondary" onClick={toggle} className="me-2">
              Cancelar
            </Button>
            <Button 
              color="primary" 
              onClick={handleSearch}
              disabled={searchCriteria.length === 0}
            >
              <i className="mdi mdi-magnify me-1"></i>
              Buscar ({searchCriteria.filter(c => c.field && c.operator).length})
            </Button>
          </div>
        </div>
      </ModalFooter>

      <style jsx>{`
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .cursor-pointer:hover {
          text-decoration: underline;
        }
        
        .dropdown-menu {
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>
    </Modal>
  );
};

AdvancedSearch.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'number', 'date']),
      icon: PropTypes.string
    })
  ).isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  className: PropTypes.string
};

export default AdvancedSearch;