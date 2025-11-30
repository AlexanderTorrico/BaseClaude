import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from 'reactstrap';
import { ProductModel } from '../models/ProductModel';
import { ReviewFormData } from '../models/CartModel';

interface ReviewModalProps {
  isOpen: boolean;
  toggle: () => void;
  product: ProductModel | null;
  orderId: string;
  onSubmit: (review: ReviewFormData) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  toggle,
  product,
  orderId,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [recommendProduct, setRecommendProduct] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setComment('');
    setPros('');
    setCons('');
    setRecommendProduct(true);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (rating === 0) {
      newErrors.rating = 'Por favor selecciona una calificación';
    }

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (title.length < 10) {
      newErrors.title = 'El título debe tener al menos 10 caracteres';
    }

    if (!comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    } else if (comment.length < 20) {
      newErrors.comment = 'El comentario debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !product) return;

    const reviewData: ReviewFormData = {
      productId: product.id,
      orderId,
      rating,
      title,
      comment,
      pros,
      cons,
      recommendProduct,
    };

    onSubmit(reviewData);
    resetForm();
    toggle();
  };

  const handleClose = () => {
    resetForm();
    toggle();
  };

  const getRatingText = (stars: number): string => {
    const texts = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    return texts[stars] || '';
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-star font-size-20 text-warning"></i>
          <span>Calificar Producto</span>
        </div>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="border rounded p-3 mb-4 bg-light">
            <div className="d-flex gap-3">
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                }}
              >
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h6 className="mb-1">{product.name}</h6>
                <p className="text-muted mb-0 font-size-13">
                  {product.brand} • {product.model}
                </p>
              </div>
            </div>
          </div>

          <FormGroup>
            <Label className="fw-bold">
              Tu calificación <span className="text-danger">*</span>
            </Label>
            <div className="mb-2">
              <div className="d-flex align-items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`mdi ${
                      star <= (hoverRating || rating) ? 'mdi-star' : 'mdi-star-outline'
                    } font-size-32 ${
                      star <= (hoverRating || rating) ? 'text-warning' : 'text-muted'
                    }`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  ></i>
                ))}
                {rating > 0 && (
                  <span className="ms-2 fw-medium">{getRatingText(rating)}</span>
                )}
              </div>
              {errors.rating && (
                <small className="text-danger">{errors.rating}</small>
              )}
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="title" className="fw-bold">
              Título de la reseña <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Resume tu experiencia en una línea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              invalid={!!errors.title}
              maxLength={100}
            />
            <FormFeedback>{errors.title}</FormFeedback>
            <small className="text-muted">{title.length}/100 caracteres</small>
          </FormGroup>

          <FormGroup>
            <Label for="comment" className="fw-bold">
              Cuéntanos tu experiencia <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="comment"
              rows={5}
              placeholder="Describe tu experiencia con este producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              invalid={!!errors.comment}
              maxLength={1000}
            />
            <FormFeedback>{errors.comment}</FormFeedback>
            <small className="text-muted">{comment.length}/1000 caracteres</small>
          </FormGroup>

          <FormGroup>
            <Label for="pros" className="fw-bold">
              ¿Qué te gustó? (Pros)
            </Label>
            <Input
              type="textarea"
              id="pros"
              rows={2}
              placeholder="Aspectos positivos del producto..."
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              maxLength={500}
            />
            <small className="text-muted">Opcional - {pros.length}/500 caracteres</small>
          </FormGroup>

          <FormGroup>
            <Label for="cons" className="fw-bold">
              ¿Qué mejorarías? (Contras)
            </Label>
            <Input
              type="textarea"
              id="cons"
              rows={2}
              placeholder="Aspectos a mejorar del producto..."
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              maxLength={500}
            />
            <small className="text-muted">Opcional - {cons.length}/500 caracteres</small>
          </FormGroup>

          <FormGroup check className="mb-0">
            <Input
              type="checkbox"
              id="recommend"
              checked={recommendProduct}
              onChange={(e) => setRecommendProduct(e.target.checked)}
            />
            <Label check for="recommend" className="fw-medium">
              <i className="mdi mdi-thumb-up me-1"></i>
              Recomendaría este producto a otros
            </Label>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="light" onClick={handleClose}>
            Cancelar
          </Button>
          <Button color="primary" type="submit">
            <i className="mdi mdi-send me-1"></i>
            Enviar Calificación
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ReviewModal;
