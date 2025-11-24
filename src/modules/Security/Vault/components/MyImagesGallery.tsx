import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { UserMediaModel } from '../models/VaultModel';

interface MyImagesGalleryProps {
  images: UserMediaModel[];
  onSelectImage?: (imageUrl: string) => void;
}

const MyImagesGallery: React.FC<MyImagesGalleryProps> = ({ images, onSelectImage }) => {
  const getFullImageUrl = (url: string) => {
    // Si la URL ya es absoluta, retornarla tal cual
    if (url.startsWith('http')) return url;
    // Si es relativa, agregar el dominio base del API
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/${url}`;
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="mdi mdi-image-off font-size-48 text-muted"></i>
        <p className="text-muted mt-3">No tienes imágenes guardadas</p>
      </div>
    );
  }

  return (
    <Row>
      {images.map((image) => (
        <Col key={image.id} xs={12} sm={6} md={4} lg={3} xl={2} className="mb-3">
          <Card
            className="border shadow-sm h-100"
            style={{
              cursor: onSelectImage ? 'pointer' : 'default',
              transition: 'transform 0.2s',
            }}
            onClick={() => onSelectImage?.(image.url)}
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
                  src={getFullImageUrl(image.url)}
                  alt={`Imagen ${image.id}`}
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
  );
};

export default MyImagesGallery;
