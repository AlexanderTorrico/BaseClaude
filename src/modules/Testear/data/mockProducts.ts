/**
 * Mock data para productos (simulando respuesta de API)
 * Usa snake_case como si viniera del backend
 */
export const mockProductsApiResponse = {
  data: [
    {
      id: 1,
      name: 'Laptop Dell XPS 15',
      description: 'Laptop profesional de alto rendimiento con procesador Intel i7 de última generación',
      sku: 'DELL-XPS15-001',
      price: '1299.99',
      stock: 25,
      category: {
        id: 1,
        name: 'Computadoras',
        description: 'Equipos de cómputo y laptops'
      },
      image_url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Dell+XPS',
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-10-10T14:20:00Z'
    },
    {
      id: 2,
      name: 'Mouse Logitech MX Master 3',
      description: 'Mouse ergonómico inalámbrico con precisión avanzada',
      sku: 'LOGI-MX3-002',
      price: '99.99',
      stock: 150,
      category: {
        id: 2,
        name: 'Accesorios',
        description: 'Accesorios y periféricos'
      },
      image_url: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Logitech',
      is_active: true,
      created_at: '2024-02-20T08:15:00Z',
      updated_at: '2024-10-12T16:45:00Z'
    },
    {
      id: 3,
      name: 'Teclado Mecánico Keychron K2',
      description: 'Teclado mecánico inalámbrico con switches Gateron Brown',
      sku: 'KEY-K2-003',
      price: '89.99',
      stock: 75,
      category: {
        id: 2,
        name: 'Accesorios',
        description: 'Accesorios y periféricos'
      },
      image_url: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Keychron',
      is_active: true,
      created_at: '2024-03-10T12:00:00Z',
      updated_at: '2024-10-11T09:30:00Z'
    },
    {
      id: 4,
      name: 'Monitor LG UltraWide 34"',
      description: 'Monitor curvo ultra ancho con resolución 3440x1440',
      sku: 'LG-UW34-004',
      price: '599.99',
      stock: 12,
      category: {
        id: 3,
        name: 'Monitores',
        description: 'Pantallas y monitores'
      },
      image_url: 'https://via.placeholder.com/150/FFFF00/000000?text=LG+Monitor',
      is_active: true,
      created_at: '2024-04-05T15:45:00Z',
      updated_at: '2024-10-13T11:00:00Z'
    },
    {
      id: 5,
      name: 'Auriculares Sony WH-1000XM4',
      description: 'Auriculares inalámbricos con cancelación de ruido premium',
      sku: 'SONY-WH4-005',
      price: '349.99',
      stock: 8,
      category: {
        id: 4,
        name: 'Audio',
        description: 'Dispositivos de audio'
      },
      image_url: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Sony',
      is_active: true,
      created_at: '2024-05-12T09:20:00Z',
      updated_at: '2024-10-12T14:15:00Z'
    },
    {
      id: 6,
      name: 'Webcam Logitech C920',
      description: 'Cámara web HD 1080p para videollamadas profesionales',
      sku: 'LOGI-C920-006',
      price: '79.99',
      stock: 45,
      category: {
        id: 2,
        name: 'Accesorios',
        description: 'Accesorios y periféricos'
      },
      image_url: 'https://via.placeholder.com/150/00FFFF/000000?text=Webcam',
      is_active: true,
      created_at: '2024-06-18T11:30:00Z',
      updated_at: '2024-10-10T10:00:00Z'
    },
    {
      id: 7,
      name: 'SSD Samsung 970 EVO 1TB',
      description: 'Disco sólido NVMe M.2 de alta velocidad',
      sku: 'SAMS-970-007',
      price: '129.99',
      stock: 5,
      category: {
        id: 5,
        name: 'Almacenamiento',
        description: 'Dispositivos de almacenamiento'
      },
      image_url: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Samsung+SSD',
      is_active: true,
      created_at: '2024-07-22T13:45:00Z',
      updated_at: '2024-10-13T08:30:00Z'
    },
    {
      id: 8,
      name: 'Router WiFi 6 TP-Link',
      description: 'Router inalámbrico de última generación con WiFi 6',
      sku: 'TPL-W6-008',
      price: '149.99',
      stock: 30,
      category: {
        id: 6,
        name: 'Redes',
        description: 'Equipos de red y conectividad'
      },
      image_url: 'https://via.placeholder.com/150/800080/FFFFFF?text=TP-Link',
      is_active: true,
      created_at: '2024-08-30T16:00:00Z',
      updated_at: '2024-10-11T12:45:00Z'
    },
    {
      id: 9,
      name: 'Impresora HP LaserJet Pro',
      description: 'Impresora láser monocromática profesional',
      sku: 'HP-LJ-009',
      price: '249.99',
      stock: 2,
      category: {
        id: 7,
        name: 'Impresoras',
        description: 'Equipos de impresión'
      },
      image_url: 'https://via.placeholder.com/150/008000/FFFFFF?text=HP+Printer',
      is_active: true,
      created_at: '2024-09-14T10:15:00Z',
      updated_at: '2024-10-12T15:30:00Z'
    },
    {
      id: 10,
      name: 'Cable USB-C a HDMI',
      description: 'Cable adaptador USB-C a HDMI 4K compatible',
      sku: 'CABLE-UCH-010',
      price: '19.99',
      stock: 200,
      category: {
        id: 2,
        name: 'Accesorios',
        description: 'Accesorios y periféricos'
      },
      image_url: 'https://via.placeholder.com/150/000080/FFFFFF?text=Cable',
      is_active: true,
      created_at: '2024-10-01T08:00:00Z',
      updated_at: '2024-10-13T07:00:00Z'
    },
    {
      id: 11,
      name: 'Hub USB 3.0 Anker',
      description: 'Hub USB de 7 puertos con carga rápida',
      sku: 'ANK-USB7-011',
      price: '39.99',
      stock: 0,
      category: {
        id: 2,
        name: 'Accesorios',
        description: 'Accesorios y periféricos'
      },
      image_url: 'https://via.placeholder.com/150/FFD700/000000?text=Anker+Hub',
      is_active: false,
      created_at: '2024-01-25T14:30:00Z',
      updated_at: '2024-10-05T18:00:00Z'
    },
    {
      id: 12,
      name: 'MacBook Pro 16"',
      description: 'MacBook Pro con chip M2 Pro, 16GB RAM, 512GB SSD',
      sku: 'APPLE-MBP16-012',
      price: '2499.99',
      stock: 8,
      category: {
        id: 1,
        name: 'Computadoras',
        description: 'Equipos de cómputo y laptops'
      },
      image_url: 'https://via.placeholder.com/150/C0C0C0/000000?text=MacBook',
      is_active: true,
      created_at: '2024-02-28T11:00:00Z',
      updated_at: '2024-10-13T09:15:00Z'
    }
  ]
};
