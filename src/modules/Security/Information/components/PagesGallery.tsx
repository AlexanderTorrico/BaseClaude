import React, { useState } from 'react';
import { Row, Col, Input, Label, Spinner } from 'reactstrap';
import { PageModel } from '../models/PageModel';
import { PaymentGatewayModel } from '../../PaymentGateway/models/PaymentGatewayModel';
import PageCard from './PageCard';

interface PagesGalleryProps {
  pages: PageModel[];
  loading?: boolean;
  onPageClick?: (page: PageModel) => void;
  paymentGateways?: PaymentGatewayModel[];
  onEcommerceChange?: (pageId: number, enabled: boolean, gatewayId?: number | null) => void;
}

const PagesGallery: React.FC<PagesGalleryProps> = ({
  pages,
  loading = false,
  onPageClick,
  paymentGateways = [],
  onEcommerceChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'score'>('date');

  const filteredAndSortedPages = React.useMemo(() => {
    let filtered = pages;

    // Filter by search term
    if (searchTerm) {
      filtered = pages.filter((page) =>
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.view_key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.score - a.score;
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sorted;
  }, [pages, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="pages-gallery">
      {/* Header and Filters */}
      <div className="mb-4">
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <h4 className="mb-0">
              Mis Páginas
              <span className="badge bg-primary ms-2">{pages.length}</span>
            </h4>
          </Col>
          <Col md={6} className="text-md-end">
            <small className="text-muted">
              {filteredAndSortedPages.length} {filteredAndSortedPages.length === 1 ? 'página' : 'páginas'} {searchTerm && 'encontradas'}
            </small>
          </Col>
        </Row>

        <Row className="g-3">
          <Col md={8}>
            <div className="position-relative">
              <i
                className="mdi mdi-magnify position-absolute"
                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}
              ></i>
              <Input
                type="text"
                placeholder="Buscar por nombre o clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '35px' }}
              />
            </div>
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center gap-2">
              <Label className="mb-0 text-nowrap">Ordenar por:</Label>
              <Input
                type="select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'score')}
              >
                <option value="date">Fecha</option>
                <option value="name">Nombre</option>
                <option value="score">Puntuación</option>
              </Input>
            </div>
          </Col>
        </Row>
      </div>

      {/* Pages List */}
      {filteredAndSortedPages.length > 0 ? (
        <div>
          {filteredAndSortedPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onPageClick={onPageClick}
              paymentGateways={paymentGateways}
              onEcommerceChange={onEcommerceChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="mdi mdi-file-document-outline display-1 text-muted"></i>
          <h5 className="mt-3 text-muted">
            {searchTerm ? 'No se encontraron páginas' : 'No hay páginas creadas'}
          </h5>
          {searchTerm && (
            <p className="text-muted">
              Intenta con otros términos de búsqueda
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PagesGallery;
