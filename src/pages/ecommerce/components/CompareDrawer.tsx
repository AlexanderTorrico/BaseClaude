import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Table,
  Badge,
} from 'reactstrap';
import { useCart } from '../hooks/useCart';

interface CompareDrawerProps {
  isOpen: boolean;
  toggle: () => void;
  onViewProduct: (productId: number) => void;
}

const CompareDrawer: React.FC<CompareDrawerProps> = ({ isOpen, toggle, onViewProduct }) => {
  const { compare, removeFromCompare, clearCompareList, addToCart } = useCart();

  if (compare.length === 0) {
    return (
      <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
        <ModalHeader toggle={toggle}>Comparador de Productos</ModalHeader>
        <ModalBody className="text-center py-5">
          <i className="mdi mdi-compare font-size-48 text-muted mb-3"></i>
          <h5 className="text-muted mb-2">No hay productos para comparar</h5>
          <p className="text-muted mb-3">
            Agrega hasta 4 productos para compararlos lado a lado
          </p>
          <Button color="primary" onClick={toggle}>
            <i className="mdi mdi-shopping me-1"></i>
            Explorar productos
          </Button>
        </ModalBody>
      </Modal>
    );
  }

  const specs = [
    { key: 'price', label: 'Precio', formatter: (p: any) => `$${p.price.toLocaleString()}` },
    { key: 'condition', label: 'Estado', formatter: (p: any) => p.condition === 'new' ? 'Nuevo' : 'Usado' },
    { key: 'year', label: 'Año', formatter: (p: any) => p.year },
    { key: 'brand', label: 'Marca', formatter: (p: any) => p.brand },
    { key: 'model', label: 'Modelo', formatter: (p: any) => p.model },
    { key: 'rating', label: 'Valoración', formatter: (p: any) => p.rating ? `⭐ ${p.rating}` : 'N/A' },
    { key: 'status', label: 'Disponibilidad', formatter: (p: any) => {
      if (p.status === 'in_stock') return 'En stock';
      if (p.status === 'immediate_shipping') return 'Envío inmediato';
      return 'Reserva';
    }},
  ];

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" scrollable>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-compare font-size-20"></i>
          <span>Comparar Productos</span>
          <Badge color="primary" pill>
            {compare.length}
          </Badge>
        </div>
      </ModalHeader>
      <ModalBody className="p-0">
        <div className="p-3 bg-light border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Comparando {compare.length} de 4 productos máximo
            </small>
            <Button color="link" size="sm" className="text-danger" onClick={clearCompareList}>
              <i className="mdi mdi-delete me-1"></i>
              Limpiar comparación
            </Button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <Table bordered className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '200px', position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
                  Característica
                </th>
                {compare.map((item) => (
                  <th key={item.product.id} className="text-center" style={{ minWidth: '250px' }}>
                    <div className="p-2">
                      <div
                        className="mb-2"
                        style={{
                          height: '150px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f8f9fa',
                        }}
                      >
                        <img
                          src={item.product.mainImage}
                          alt={item.product.name}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <h6 className="mb-2 font-size-13">{item.product.name}</h6>
                      <div className="d-flex gap-1 justify-content-center">
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => {
                            addToCart(item.product, 1);
                            toggle();
                          }}
                        >
                          <i className="mdi mdi-cart-plus"></i>
                        </Button>
                        <Button
                          color="light"
                          size="sm"
                          onClick={() => {
                            onViewProduct(item.product.id);
                            toggle();
                          }}
                        >
                          <i className="mdi mdi-eye"></i>
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          outline
                          onClick={() => removeFromCompare(item.product.id)}
                        >
                          <i className="mdi mdi-close"></i>
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.key}>
                  <td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }} className="fw-medium">
                    {spec.label}
                  </td>
                  {compare.map((item) => (
                    <td key={item.product.id} className="text-center">
                      {spec.formatter(item.product)}
                    </td>
                  ))}
                </tr>
              ))}

              <tr>
                <td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }} className="fw-medium">
                  Características
                </td>
                {compare.map((item) => (
                  <td key={item.product.id}>
                    <ul className="list-unstyled mb-0 font-size-12">
                      {item.product.highlights.slice(0, 4).map((h, idx) => (
                        <li key={idx} className="mb-1">
                          <i className="mdi mdi-check-circle text-success me-1"></i>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CompareDrawer;
