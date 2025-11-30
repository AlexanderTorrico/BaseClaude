import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  Collapse,
} from 'reactstrap';
import { FilterOptions, AppliedFilters } from '../models/ProductModel';

interface FilterSidebarProps {
  filterOptions: FilterOptions;
  appliedFilters: AppliedFilters;
  onFilterChange: (key: keyof AppliedFilters, value: any) => void;
  onClearFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterOptions,
  appliedFilters,
  onFilterChange,
  onClearFilters,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    brand: true,
    condition: true,
    availability: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange('priceMin', min);
    onFilterChange('priceMax', max);
  };

  const handleCheckboxChange = (
    key: keyof AppliedFilters,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (appliedFilters[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (appliedFilters.priceMin !== undefined || appliedFilters.priceMax !== undefined)
      count++;
    if (appliedFilters.brands && appliedFilters.brands.length > 0) count++;
    if (appliedFilters.models && appliedFilters.models.length > 0) count++;
    if (appliedFilters.years && appliedFilters.years.length > 0) count++;
    if (appliedFilters.conditions && appliedFilters.conditions.length > 0) count++;
    if (appliedFilters.colors && appliedFilters.colors.length > 0) count++;
    if (appliedFilters.availability && appliedFilters.availability.length > 0) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  const FilterSection: React.FC<{
    id: string;
    title: string;
    children: React.ReactNode;
  }> = ({ id, title, children }) => (
    <div className="border-bottom pb-3 mb-3">
      <div
        className="d-flex align-items-center justify-content-between mb-2"
        style={{ cursor: 'pointer' }}
        onClick={() => toggleSection(id)}
      >
        <h6 className="mb-0 fw-medium">{title}</h6>
        <i
          className={`mdi ${
            openSections[id] ? 'mdi-chevron-up' : 'mdi-chevron-down'
          } font-size-16`}
        ></i>
      </div>
      <Collapse isOpen={openSections[id]}>{children}</Collapse>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">
            <i className="mdi mdi-filter-variant me-2"></i>
            Filtros
          </h5>
          {activeCount > 0 && (
            <Badge color="primary" pill>
              {activeCount}
            </Badge>
          )}
        </div>

        {activeCount > 0 && (
          <Button
            color="light"
            size="sm"
            block
            className="mb-3"
            onClick={onClearFilters}
          >
            <i className="mdi mdi-close-circle me-1"></i>
            Limpiar filtros
          </Button>
        )}

        <Form>
          <FilterSection id="price" title="Rango de Precio">
            <FormGroup>
              <Label className="font-size-12 text-muted">
                ${appliedFilters.priceMin || filterOptions.priceRange.min} - $
                {appliedFilters.priceMax || filterOptions.priceRange.max}
              </Label>
              <div className="d-flex gap-2">
                <Input
                  type="number"
                  size="sm"
                  placeholder="Mín"
                  value={appliedFilters.priceMin || ''}
                  onChange={(e) =>
                    handlePriceChange(
                      Number(e.target.value) || filterOptions.priceRange.min,
                      appliedFilters.priceMax || filterOptions.priceRange.max
                    )
                  }
                />
                <Input
                  type="number"
                  size="sm"
                  placeholder="Máx"
                  value={appliedFilters.priceMax || ''}
                  onChange={(e) =>
                    handlePriceChange(
                      appliedFilters.priceMin || filterOptions.priceRange.min,
                      Number(e.target.value) || filterOptions.priceRange.max
                    )
                  }
                />
              </div>
            </FormGroup>
          </FilterSection>

          <FilterSection id="brand" title="Marca">
            {filterOptions.brands.map((brand) => (
              <FormGroup check key={brand} className="mb-2">
                <Input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={(appliedFilters.brands || []).includes(brand)}
                  onChange={(e) =>
                    handleCheckboxChange('brands', brand, e.target.checked)
                  }
                />
                <Label check for={`brand-${brand}`} className="font-size-13">
                  {brand}
                </Label>
              </FormGroup>
            ))}
          </FilterSection>

          <FilterSection id="condition" title="Estado">
            {filterOptions.conditions.map((condition) => (
              <FormGroup check key={condition} className="mb-2">
                <Input
                  type="checkbox"
                  id={`condition-${condition}`}
                  checked={(appliedFilters.conditions || []).includes(condition)}
                  onChange={(e) =>
                    handleCheckboxChange('conditions', condition, e.target.checked)
                  }
                />
                <Label check for={`condition-${condition}`} className="font-size-13">
                  {condition === 'new'
                    ? 'Nuevo'
                    : condition === 'used'
                    ? 'Usado'
                    : 'Reacondicionado'}
                </Label>
              </FormGroup>
            ))}
          </FilterSection>

          {filterOptions.years.length > 0 && (
            <FilterSection id="year" title="Año">
              {filterOptions.years.slice(0, 10).map((year) => (
                <FormGroup check key={year} className="mb-2">
                  <Input
                    type="checkbox"
                    id={`year-${year}`}
                    checked={(appliedFilters.years || []).includes(year)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        'years',
                        year.toString(),
                        e.target.checked
                      )
                    }
                  />
                  <Label check for={`year-${year}`} className="font-size-13">
                    {year}
                  </Label>
                </FormGroup>
              ))}
            </FilterSection>
          )}

          {filterOptions.colors.length > 0 && (
            <FilterSection id="color" title="Color">
              {filterOptions.colors.map((color) => (
                <FormGroup check key={color} className="mb-2">
                  <Input
                    type="checkbox"
                    id={`color-${color}`}
                    checked={(appliedFilters.colors || []).includes(color)}
                    onChange={(e) =>
                      handleCheckboxChange('colors', color, e.target.checked)
                    }
                  />
                  <Label check for={`color-${color}`} className="font-size-13">
                    {color}
                  </Label>
                </FormGroup>
              ))}
            </FilterSection>
          )}

          <FilterSection id="availability" title="Disponibilidad">
            {filterOptions.availability.map((status) => (
              <FormGroup check key={status} className="mb-2">
                <Input
                  type="checkbox"
                  id={`status-${status}`}
                  checked={(appliedFilters.availability || []).includes(status)}
                  onChange={(e) =>
                    handleCheckboxChange('availability', status, e.target.checked)
                  }
                />
                <Label check for={`status-${status}`} className="font-size-13">
                  {status === 'in_stock'
                    ? 'En stock'
                    : status === 'immediate_shipping'
                    ? 'Envío inmediato'
                    : 'Reserva'}
                </Label>
              </FormGroup>
            ))}
          </FilterSection>
        </Form>
      </CardBody>
    </Card>
  );
};

export default FilterSidebar;
