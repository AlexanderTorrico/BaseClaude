import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button, Badge } from 'reactstrap';
import { VaultCategoryModel, MultimediaModel } from '../models/VaultModel';

interface VaultCategoriesGalleryProps {
  categories: VaultCategoryModel[];
  onSelectImage?: (imageUrl: string) => void;
}

const VaultCategoriesGallery: React.FC<VaultCategoriesGalleryProps> = ({
  categories,
  onSelectImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/${url}`;
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="mdi mdi-folder-off font-size-48 text-muted"></i>
        <p className="text-muted mt-3">No hay categorías disponibles</p>
      </div>
    );
  }

  const currentCategory = categories.find((cat) => cat.name === selectedCategory);
  const imagesToShow = currentCategory ? currentCategory.multimedias : [];

  return (
    <>
      {/* Barra de categorías */}
      <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
        <span className="text-muted me-2">Categorías:</span>
        <Button
          color={selectedCategory === null ? 'primary' : 'light'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          <i className="mdi mdi-view-grid me-1"></i>
          Todas
        </Button>
        {categories.map((category) => (
          <Button
            key={category.name}
            color={selectedCategory === category.name ? 'primary' : 'light'}
            size="sm"
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
            <Badge color="secondary" pill className="ms-2">
              {category.multimedias.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Vista de todas las categorías */}
      {selectedCategory === null && (
        <Row>
          {categories.map((category) => (
            <Col key={category.name} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="border shadow-sm h-100">
                <CardBody className="text-center">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingBottom: '100%',
                      overflow: 'hidden',
                      borderRadius: '4px',
                      marginBottom: '12px',
                      background: '#f8f9fa',
                    }}
                  >
                    {category.multimedias[0] && (
                      <img
                        src={getFullImageUrl(category.multimedias[0].url)}
                        alt={category.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200?text=No+Image';
                        }}
                      />
                    )}
                  </div>
                  <h5 className="font-size-14 mb-2">{category.name}</h5>
                  <Badge color="primary" pill>
                    {category.multimedias.length} imágenes
                  </Badge>
                  <div className="mt-3">
                    <Button
                      color="primary"
                      size="sm"
                      block
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      Ver categoría
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Vista de imágenes de categoría seleccionada */}
      {selectedCategory !== null && (
        <>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {currentCategory?.name} - {imagesToShow.length} imágenes
            </h5>
            <Button
              color="light"
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              <i className="mdi mdi-arrow-left me-1"></i>
              Volver
            </Button>
          </div>
          <Row>
            {imagesToShow.map((media: MultimediaModel, index: number) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
                <Card
                  className="border shadow-sm h-100"
                  style={{
                    cursor: onSelectImage ? 'pointer' : 'default',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => onSelectImage?.(media.url)}
                  onMouseEnter={(e) => {
                    if (onSelectImage) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <CardBody className="p-2">
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '100%',
                        overflow: 'hidden',
                        borderRadius: '4px',
                      }}
                    >
                      <img
                        src={getFullImageUrl(media.url)}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200?text=No+Image';
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default VaultCategoriesGallery;
