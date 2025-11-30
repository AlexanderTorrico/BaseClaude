import React from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  InputGroup,
  Button,
  Badge,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { ProductModel, CategoryModel, SortOption } from '../models/ProductModel';
import ProductCard from './ProductCard';

interface CategoryViewProps {
  products: ProductModel[];
  categories: CategoryModel[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onViewProduct: (product: ProductModel) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  totalProducts: number;
}

const CategoryView: React.FC<CategoryViewProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onViewProduct,
  sortBy,
  onSortChange,
  searchTerm,
  onSearchChange,
  totalProducts,
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Más nuevo' },
    { value: 'price_asc', label: 'Precio: Menor a Mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a Menor' },
    { value: 'lowest_usage', label: 'Menor uso' },
    { value: 'best_rated', label: 'Mejor valorado' },
    { value: 'availability', label: 'Disponibilidad' },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find((opt) => opt.value === sortBy)?.label || 'Ordenar por';
  };

  return (
    <>
      <Row className="g-3 mb-3">
        <Col xl={12}>
          <Card className="border-0 shadow-sm mb-0">
            <CardBody className="p-3">
              <div className="d-flex flex-wrap align-items-center gap-2">
                <div className="flex-grow-1">
                  <InputGroup size="sm">
                    <span className="input-group-text bg-white">
                      <i className="mdi mdi-magnify"></i>
                    </span>
                    <Input
                      type="text"
                      placeholder="Buscar productos por nombre, marca o modelo..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </InputGroup>
                </div>

                <UncontrolledButtonDropdown>
                  <DropdownToggle color="light" size="sm" caret>
                    <i className="mdi mdi-sort me-1"></i>
                    {getCurrentSortLabel()}
                  </DropdownToggle>
                  <DropdownMenu>
                    {sortOptions.map((option) => (
                      <DropdownItem
                        key={option.value}
                        active={sortBy === option.value}
                        onClick={() => onSortChange(option.value)}
                      >
                        {option.label}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="g-2 mb-3">
        <Col xl={12}>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <Button
              color={selectedCategory === null ? 'primary' : 'light'}
              size="sm"
              onClick={() => onSelectCategory(null)}
            >
              Todos
              <Badge color="light" className="ms-2 text-dark">
                {categories.reduce((sum, cat) => sum + cat.productsCount, 0)}
              </Badge>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                color={selectedCategory === category.id ? 'primary' : 'light'}
                size="sm"
                onClick={() => onSelectCategory(category.id)}
              >
                <i className={`${category.icon} me-1`}></i>
                {category.name}
                <Badge color="light" className="ms-2 text-dark">
                  {category.productsCount}
                </Badge>
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      <Row className="g-0 mb-3">
        <Col xl={12}>
          <div className="d-flex align-items-center justify-content-between">
            <small className="text-muted">
              <i className="mdi mdi-package-variant me-1"></i>
              {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}{' '}
              {selectedCategory && 'en esta categoría'}
            </small>
          </div>
        </Col>
      </Row>

      {products.length === 0 ? (
        <Row className="g-3">
          <Col xl={12}>
            <Card className="border-0 shadow-sm">
              <CardBody className="text-center py-5">
                <i className="mdi mdi-package-variant-closed font-size-48 text-muted mb-3"></i>
                <h5 className="text-muted">No se encontraron productos</h5>
                <p className="text-muted">
                  Intenta ajustar los filtros o busca otro término
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="g-3">
          {products.map((product) => (
            <Col key={product.id} xs={12} md={6} lg={4} className="d-flex">
              <ProductCard product={product} onViewDetails={onViewProduct} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default CategoryView;
