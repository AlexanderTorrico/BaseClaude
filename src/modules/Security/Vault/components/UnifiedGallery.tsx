import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Card, CardBody, Badge, Nav, NavItem, NavLink, Button } from 'reactstrap';
import { VaultModel, UserMediaModel } from '../models/VaultModel';
import { PendingUpload } from '../slices/vaultSlice';

interface UnifiedGalleryProps {
  vaultData: VaultModel;
  pendingUploads: PendingUpload[];
  onSelectImage?: (imageUrl: string) => void;
  onRefresh?: () => void;
  onUploadMedia?: (file: File, isVideo: boolean) => Promise<{ success: boolean; message: string }>;
  onDeleteMedia?: (mediaId: number) => Promise<{ success: boolean; message: string }>;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  images: { url: string; id?: number }[];
  isUserContent: boolean; // Para saber si es contenido del usuario (permite upload/delete)
}

const UnifiedGallery: React.FC<UnifiedGalleryProps> = ({ vaultData, pendingUploads, onSelectImage, onDeleteMedia, onUploadMedia }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('myImages');
  const [visibleCount, setVisibleCount] = useState<number>(12); // Mostrar solo 12 imágenes inicialmente
  const [mediaToDelete, setMediaToDelete] = useState<number | null>(null); // ID de media pendiente de eliminación
  const [deletingMedia, setDeletingMedia] = useState<number | null>(null); // ID de media siendo eliminado

  // Resetear el contador de imágenes visibles cuando cambia la categoría
  useEffect(() => {
    setVisibleCount(12); // Volver a mostrar solo 12 imágenes al cambiar de categoría
  }, [selectedCategory]);

  // Construir lista de categorías
  const categories: CategoryItem[] = useMemo(() => {
    const cats: CategoryItem[] = [
      {
        id: 'myImages',
        name: 'Mis Imágenes',
        icon: 'mdi-image-multiple',
        color: 'primary',
        count: vaultData.myImages.length,
        images: vaultData.myImages,
        isUserContent: true,
      },
      {
        id: 'myVideos',
        name: 'Mis Videos',
        icon: 'mdi-video',
        color: 'danger',
        count: vaultData.myVideos.length,
        images: vaultData.myVideos,
        isUserContent: true,
      },
    ];

    // Agregar categorías del vault
    vaultData.vaul.forEach((cat, index) => {
      cats.push({
        id: `vault_${index}`,
        name: cat.name,
        icon: 'mdi-folder-image',
        color: 'info',
        count: cat.multimedias.length,
        images: cat.multimedias,
        isUserContent: false,
      });
    });

    return cats;
  }, [vaultData]);

  // Obtener categoría actual
  const currentCategory = categories.find((cat) => cat.id === selectedCategory) || categories[0];

  // Obtener pending uploads para la categoría actual
  const categoryPendingUploads = useMemo(() => {
    if (!currentCategory || !currentCategory.isUserContent) return [];

    const isVideoCat = currentCategory.id === 'myVideos';
    return pendingUploads.filter(upload => upload.isVideo === isVideoCat);
  }, [pendingUploads, currentCategory]);

  // Filtrar imágenes según búsqueda y limitar las visibles
  const allImages = currentCategory.images;
  const totalItems = allImages.length + categoryPendingUploads.length;
  const filteredImages = allImages.slice(0, visibleCount);
  const hasMoreImages = totalItems > visibleCount;

  // Función para cargar más imágenes
  const loadMoreImages = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const getFullImageUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost'}/${url}`;
  };

  // Handler para agregar imagen/video
  const handleAddMedia = async () => {
    if (!onUploadMedia || !currentCategory) {
      console.warn('onUploadMedia no está disponible');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = currentCategory.id === 'myVideos' ? 'video/*' : 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (file && onUploadMedia && currentCategory) {
        const isVideo = currentCategory.id === 'myVideos';
        await onUploadMedia(file, isVideo);
      }
    };
    input.click();
  };

  // Handler para mostrar confirmación de eliminación
  const handleDeleteClick = (mediaId: number) => {
    setMediaToDelete(mediaId);
  };

  // Handler para cancelar eliminación
  const handleCancelDelete = () => {
    setMediaToDelete(null);
  };

  // Handler para confirmar y ejecutar eliminación
  const handleConfirmDelete = async (mediaId: number) => {
    if (!onDeleteMedia) {
      console.warn('onDeleteMedia no está disponible');
      return;
    }

    setMediaToDelete(null); // Ocultar confirmación
    setDeletingMedia(mediaId); // Mostrar loader

    await onDeleteMedia(mediaId);

    setDeletingMedia(null); // Ocultar loader
  };

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
      <Row>
      {/* Sidebar de Categorías */}
      <Col lg={3} className="mb-4">
        <Card className="border-0 shadow-sm" style={{ position: 'sticky', top: '80px' }}>
          <CardBody>
            <h5 className="mb-3">Categorías</h5>

            {/* Lista de Categorías */}
            <Nav vertical>
              {categories.map((category) => (
                <NavItem key={category.id} className="mb-1">
                  <NavLink
                    href="#"
                    active={selectedCategory === category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(category.id);
                    }}
                    className="d-flex justify-content-between align-items-start"
                    style={{
                      borderRadius: '6px',
                      padding: '10px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="d-flex align-items-start flex-grow-1" style={{ minWidth: 0 }}>
                      <i className={`mdi ${category.icon} me-2 font-size-18`} style={{ flexShrink: 0 }}></i>
                      <span
                        className="font-size-14"
                        style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          lineHeight: '1.4'
                        }}
                      >
                        {category.name}
                      </span>
                    </div>
                    <Badge color={category.color} pill style={{ flexShrink: 0, marginLeft: '8px' }}>
                      {category.count}
                    </Badge>
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          </CardBody>
        </Card>
      </Col>

      {/* Galería de Imágenes (rectangulares horizontales) */}
      <Col lg={9}>
        <Card className="border-0 shadow-sm">
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className={`mdi ${currentCategory.icon} me-2 text-${currentCategory.color}`}></i>
                {currentCategory.name}
              </h5>
              <div className="d-flex gap-2 align-items-center">
                <span className="text-muted font-size-14">
                  {totalItems} items
                  {categoryPendingUploads.length > 0 && (
                    <span className="text-primary ms-1">
                      ({categoryPendingUploads.length} subiendo...)
                    </span>
                  )}
                </span>
                {currentCategory.isUserContent && (
                  <Button color="primary" size="sm" onClick={handleAddMedia}>
                    <i className="mdi mdi-plus me-1"></i>
                    Agregar
                  </Button>
                )}
              </div>
            </div>

            {/* Grid de imágenes rectangulares horizontales con scroll */}
            <div
              style={{
                maxHeight: 'calc(100vh - 200px)', // Altura máxima basada en viewport
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {filteredImages.length === 0 ? (
                <div className="text-center py-5">
                  <i className="mdi mdi-image-off font-size-48 text-muted"></i>
                  <p className="text-muted mt-3">No hay multimedia en esta categoría</p>
                  {currentCategory.isUserContent && (
                    <Button color="primary" onClick={handleAddMedia}>
                      <i className="mdi mdi-plus me-1"></i>
                      Agregar {currentCategory.id === 'myVideos' ? 'Video' : 'Imagen'}
                    </Button>
                  )}
                </div>
              ) : (
                <Row>
                {/* Placeholders para uploads en progreso */}
                {categoryPendingUploads.map((pendingUpload) => (
                  <Col key={pendingUpload.id} xs={12} sm={6} md={6} lg={4} xl={4} className="mb-3">
                    <Card
                      className="border shadow-sm h-100"
                      style={{
                        cursor: 'default',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          paddingBottom: '56.25%', // Aspect ratio 16:9
                          overflow: 'hidden',
                          backgroundColor: '#f8f9fa',
                        }}
                      >
                        {/* Contenido del loader */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                          }}
                        >
                          <div className="spinner-border text-primary mb-2" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <p className="text-muted font-size-12 mb-0">
                            Subiendo {pendingUpload.isVideo ? 'video' : 'imagen'}...
                          </p>
                          <p className="text-muted font-size-11 mb-0 mt-1">
                            {pendingUpload.fileName}
                          </p>
                        </div>

                        {/* Overlay con efecto de carga */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                            animation: 'shimmer 2s infinite',
                          }}
                        />
                      </div>
                    </Card>
                  </Col>
                ))}

                {/* Imágenes reales */}
                {filteredImages.map((image, index) => {
                  const mediaId = (image as UserMediaModel).id;

                  return (
                    <Col key={index} xs={12} sm={6} md={6} lg={4} xl={4} className="mb-3">
                      <Card
                        className="border shadow-sm h-100"
                        style={{
                          cursor: onSelectImage ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          overflow: 'hidden',
                        }}
                        onClick={() => onSelectImage?.(image.url)}
                        onMouseEnter={(e) => {
                          if (onSelectImage) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '';
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '56.25%', // Aspect ratio 16:9 (rectangular horizontal)
                            overflow: 'hidden',
                            // Fondo de cuadros para imágenes PNG (transparentes)
                            backgroundImage: image.url.toLowerCase().endsWith('.png')
                              ? 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)'
                              : 'none',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                            backgroundColor: '#f5f5f5',
                            margin: "auto",
                          }}
                        >
                          <img
                            src={getFullImageUrl(image.url)}
                            alt={`${currentCategory.name} ${index + 1}`}
                            loading="lazy"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/400x225?text=No+Image';
                            }}
                          />

                          {/* Botón de eliminar (solo para contenido del usuario) */}
                          {currentCategory.isUserContent && mediaId && !deletingMedia && (
                            <Button
                              color="danger"
                              size="sm"
                              className="position-absolute"
                              style={{
                                top: '8px',
                                right: '8px',
                                zIndex: 10,
                                opacity: 0.9,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(mediaId);
                              }}
                            >
                              <i className="bx bx-trash"></i>
                            </Button>
                          )}

                          {/* Overlay de confirmación de eliminación */}
                          {currentCategory.isUserContent && mediaId && mediaToDelete === mediaId && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(255, 255, 255, 0.98)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 20,
                                padding: '20px',
                                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)',
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="bx bx-error-circle text-warning mb-3" style={{ fontSize: '48px' }}></i>
                              <p className="text-dark text-center mb-3 font-size-14 fw-medium">
                                ¿Eliminar esta multimedia?
                              </p>
                              <div className="d-flex gap-2">
                                <Button
                                  color="light"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelDelete();
                                  }}
                                >
                                  <i className="bx bx-x me-1"></i>
                                  Cancelar
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirmDelete(mediaId);
                                  }}
                                >
                                  <i className="bx bx-trash me-1"></i>
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Overlay de loading durante eliminación */}
                          {currentCategory.isUserContent && mediaId && deletingMedia === mediaId && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(255, 255, 255, 0.98)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 20,
                                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)',
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="position-relative d-flex align-items-center justify-content-center mb-3"
                                style={{
                                  width: '60px',
                                  height: '60px',
                                }}
                              >
                                <i
                                  className="bx bx-trash text-danger position-absolute"
                                  style={{
                                    fontSize: '36px',
                                    zIndex: 1,
                                  }}
                                ></i>
                                <div
                                  className="spinner-border text-danger"
                                  role="status"
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    zIndex: 2,
                                  }}
                                >
                                  <span className="visually-hidden">Eliminando...</span>
                                </div>
                              </div>
                              <p className="text-dark text-center font-size-14 fw-medium">
                                Eliminando...
                              </p>
                            </div>
                          )}

                          {/* Overlay al hacer hover (solo si es seleccionable) */}
                          {onSelectImage && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                              }}
                              className="hover-overlay"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '0';
                              }}
                            >
                              <i className="mdi mdi-check-circle text-white font-size-36"></i>
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
              )}

              {/* Botón "Cargar más" */}
              {hasMoreImages && (
                <div className="text-center mt-4 mb-3">
                  <Button color="primary" onClick={loadMoreImages}>
                    <i className="mdi mdi-reload me-1"></i>
                    Cargar más ({allImages.length - visibleCount} restantes)
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
    </>
  );
};

export default UnifiedGallery;
