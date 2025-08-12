export const productFields = {
  nombre: {
    label: 'Nombre del Producto',
    type: 'text',
    required: true,
    sortable: true,
    filterable: true
  },
  precio: {
    label: 'Precio',
    type: 'number',
    required: true,
    sortable: true,
    filterable: true,
    format: 'currency'
  },
  categoria: {
    label: 'Categoría',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: [
      { value: 'electronica', label: 'Electrónica' },
      { value: 'ropa', label: 'Ropa' },
      { value: 'hogar', label: 'Hogar' },
      { value: 'deportes', label: 'Deportes' },
      { value: 'libros', label: 'Libros' }
    ]
  },
  stock: {
    label: 'Stock',
    type: 'number',
    required: true,
    sortable: true,
    filterable: true
  },
  estado: {
    label: 'Estado',
    type: 'select',
    required: true,
    sortable: true,
    filterable: true,
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'agotado', label: 'Agotado' },
      { value: 'discontinuado', label: 'Discontinuado' }
    ]
  },
  descripcion: {
    label: 'Descripción',
    type: 'textarea',
    required: false,
    sortable: false,
    filterable: true
  }
};

export const generateProducts = () => {
  const productos = [
    {
      id: 1,
      nombre: 'iPhone 14 Pro',
      precio: 1299,
      categoria: 'electronica',
      stock: 25,
      estado: 'activo',
      descripcion: 'Smartphone Apple con cámara profesional'
    },
    {
      id: 2,
      nombre: 'MacBook Air M2',
      precio: 1499,
      categoria: 'electronica',
      stock: 15,
      estado: 'activo',
      descripcion: 'Laptop ultraligera con chip M2'
    },
    {
      id: 3,
      nombre: 'Camiseta Nike',
      precio: 29.99,
      categoria: 'ropa',
      stock: 100,
      estado: 'activo',
      descripcion: 'Camiseta deportiva de alta calidad'
    },
    {
      id: 4,
      nombre: 'Sofá Modular',
      precio: 899,
      categoria: 'hogar',
      stock: 5,
      estado: 'activo',
      descripcion: 'Sofá cómodo y elegante para sala'
    },
    {
      id: 5,
      nombre: 'Bicicleta Mountain',
      precio: 599,
      categoria: 'deportes',
      stock: 12,
      estado: 'activo',
      descripcion: 'Bicicleta todo terreno de 21 velocidades'
    },
    {
      id: 6,
      nombre: 'El Quijote',
      precio: 15.99,
      categoria: 'libros',
      stock: 0,
      estado: 'agotado',
      descripción: 'Clásico de la literatura española'
    },
    {
      id: 7,
      nombre: 'Samsung Galaxy S23',
      precio: 999,
      categoria: 'electronica',
      stock: 8,
      estado: 'discontinuado',
      descripcion: 'Smartphone Android de gama alta'
    }
  ];

  return productos;
};