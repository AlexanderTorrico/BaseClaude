import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from './hooks/useLocation';
import { useProducts } from './hooks/useProducts';
import LocationIndicator from './components/LocationIndicator';
import FilterSidebar from './components/FilterSidebar';
import CategoryView from './components/CategoryView';
import ProductDetailView from './components/ProductDetailView';
import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';
import CompareDrawer from './components/CompareDrawer';
import FloatingActionButtons from './components/FloatingActionButtons';
import { ProductModel } from './models/ProductModel';

const Ecommerce: React.FC = () => {
  const {
    location,
    loading: locationLoading,
    isManualLocation,
    changeLocation,
    resetToDetectedLocation,
  } = useLocation();

  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    appliedFilters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    filterOptions,
    getProductById,
    getRelatedProducts,
    totalProducts,
  } = useProducts();

  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const handleViewProduct = (product: ProductModel) => {
    setSelectedProductId(product.id);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedProductId(null);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateFilter('search', term || undefined);
  };

  const currentProduct = selectedProductId ? getProductById(selectedProductId) : null;
  const relatedProducts = selectedProductId ? getRelatedProducts(selectedProductId) : [];

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Row className="g-0 mb-3">
            <Col xl={12}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h4 className="mb-1">E-commerce Premium</h4>
                  <p className="text-muted mb-0 font-size-13">
                    Explora nuestro catálogo de productos de alta calidad
                  </p>
                </div>
                <LocationIndicator
                  location={location}
                  loading={locationLoading}
                  isManualLocation={isManualLocation}
                  onChangeLocation={changeLocation}
                  onResetLocation={resetToDetectedLocation}
                />
              </div>
            </Col>
          </Row>

          {viewMode === 'list' ? (
            <Row className="g-3">
              <Col xl={3} lg={4}>
                <FilterSidebar
                  filterOptions={filterOptions}
                  appliedFilters={appliedFilters}
                  onFilterChange={updateFilter}
                  onClearFilters={clearFilters}
                />
              </Col>

              <Col xl={9} lg={8}>
                <CategoryView
                  products={products}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onViewProduct={handleViewProduct}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  totalProducts={totalProducts}
                />
              </Col>
            </Row>
          ) : (
            currentProduct && (
              <ProductDetailView
                product={currentProduct}
                relatedProducts={relatedProducts}
                onBack={handleBackToList}
                onViewRelated={handleViewProduct}
              />
            )
          )}
        </Container>
      </div>

      <FloatingActionButtons
        onCartClick={() => setCartOpen(true)}
        onWishlistClick={() => setWishlistOpen(true)}
        onCompareClick={() => setCompareOpen(true)}
      />

      <CartDrawer isOpen={cartOpen} toggle={() => setCartOpen(!cartOpen)} />

      <WishlistModal
        isOpen={wishlistOpen}
        toggle={() => setWishlistOpen(!wishlistOpen)}
        onViewProduct={(productId) => {
          const product = getProductById(productId);
          if (product) handleViewProduct(product);
        }}
      />

      <CompareDrawer
        isOpen={compareOpen}
        toggle={() => setCompareOpen(!compareOpen)}
        onViewProduct={(productId) => {
          const product = getProductById(productId);
          if (product) handleViewProduct(product);
        }}
      />
    </>
  );
};

export default Ecommerce;
