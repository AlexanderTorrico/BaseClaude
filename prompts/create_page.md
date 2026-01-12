# Guia para Crear Nuevas Paginas/Modulos

## Modulo de Referencia

El modulo **Users** es el estandar a seguir para crear nuevas paginas CRUD:
```
src/modules/RRHH/Users/
```

---

## 1. Estructura de Directorios

Cada modulo debe seguir esta estructura:

```
src/modules/[AREA]/[NombreModulo]/
├── index.tsx                    # Componente principal de la pagina
├── models/
│   ├── [Nombre]Model.ts         # Modelo principal (interface)
│   ├── Create[Nombre]Dto.ts     # DTO para creacion
│   └── Update[Nombre]Dto.ts     # DTO para actualizacion
├── components/
│   ├── Header.tsx               # Header con titulo, badge, botones
│   ├── ContentTable.tsx         # Vista tabla (desktop)
│   ├── ContentCards.tsx         # Vista cards (mobile)
│   └── modals/
│       ├── [Nombre]FormModal.tsx      # Modal crear/editar
│       └── [Nombre]DetailsModal.tsx   # Modal detalles (opcional)
├── hooks/
│   ├── use[Nombre]s.ts          # Hook sync (acceso a Redux)
│   └── use[Nombre]sFetch.ts     # Hook async (operaciones CRUD)
├── services/
│   ├── I[Nombre]Service.ts      # Interface del servicio
│   ├── [Nombre]ApiService.ts    # Implementacion API real
│   └── [Nombre]MockService.ts   # Implementacion mock (opcional)
├── adapters/
│   └── [nombre]Adapter.ts       # Mapeo API (snake_case) -> UI (camelCase)
├── slices/
│   └── [nombre]Slice.ts         # Redux slice
├── config/
│   └── tableColumns.tsx         # Configuracion de columnas de tabla
└── __tests__/                   # Tests (opcional)
    ├── unit/
    └── integration/
```

---

## 2. Archivos Requeridos

### 2.1 Model (models/[Nombre]Model.ts)

```typescript
export interface ProductModel {
    id: number;
    uuid: string;
    name: string;
    description: string;
    price: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}
```

### 2.2 DTOs

**CreateDto:**
```typescript
export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
}
```

**UpdateDto:**
```typescript
export interface UpdateProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
}
```

### 2.3 Service Interface (services/I[Nombre]Service.ts)

```typescript
import { ApiResponse, SetStateFn } from '@/core/services/ServiceWrapper';
import { ProductModel } from '../models/ProductModel';

export interface IProductService {
    getAll(setLoading?: SetStateFn): Promise<ApiResponse<ProductModel[]>>;
    getById(id: number, setLoading?: SetStateFn): Promise<ApiResponse<ProductModel | null>>;
    create(data: CreateProductDto, setLoading?: SetStateFn): Promise<ApiResponse<ProductModel | null>>;
    update(data: UpdateProductDto, setLoading?: SetStateFn): Promise<ApiResponse<ProductModel | null>>;
    delete(id: number, setLoading?: SetStateFn): Promise<ApiResponse<boolean>>;
}
```

### 2.4 API Service (services/[Nombre]ApiService.ts)

```typescript
import { ServiceWrapper, ApiResponse, SetStateFn } from '@/core/services/ServiceWrapper';
import { IProductService } from './IProductService';
import { ProductModel } from '../models/ProductModel';
import { adaptProductResponse, adaptProductsArray } from '../adapters/productAdapter';

export class ProductApiService implements IProductService {
    private baseUrl = '/api/products';

    async getAll(setLoading?: SetStateFn): Promise<ApiResponse<ProductModel[]>> {
        return ServiceWrapper.get<ProductModel[]>(
            this.baseUrl,
            setLoading,
            adaptProductsArray
        );
    }

    async create(data: CreateProductDto, setLoading?: SetStateFn): Promise<ApiResponse<ProductModel | null>> {
        return ServiceWrapper.post<ProductModel>(
            this.baseUrl,
            data,
            setLoading,
            adaptProductResponse
        );
    }

    // ... otros metodos
}
```

### 2.5 Adapter (adapters/[nombre]Adapter.ts)

```typescript
import { ProductModel } from '../models/ProductModel';

export const adaptProductResponse = (apiProduct: any): ProductModel => ({
    id: apiProduct.id,
    uuid: apiProduct.uuid,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    isActive: apiProduct.is_active,           // snake_case -> camelCase
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
});

export const adaptProductsArray = (apiProducts: any[]): ProductModel[] => {
    if (!Array.isArray(apiProducts)) return [];
    return apiProducts.map(adaptProductResponse);
};
```

### 2.6 Redux Slice (slices/[nombre]Slice.ts)

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductModel } from '../models/ProductModel';

interface ProductState {
    list: ProductModel[];
    currentView: string; // '0' = tabla, '1' = cards
}

const initialState: ProductState = {
    list: [],
    currentView: '0'
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<ProductModel[]>) => {
            state.list = action.payload;
        },
        addProduct: (state, action: PayloadAction<ProductModel>) => {
            state.list.push(action.payload);
        },
        updateProduct: (state, action: PayloadAction<ProductModel>) => {
            const index = state.list.findIndex(p => p.id === action.payload.id);
            if (index !== -1) state.list[index] = action.payload;
        },
        removeProduct: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(p => p.id !== action.payload);
        },
        setCurrentView: (state, action: PayloadAction<string>) => {
            state.currentView = action.payload;
        }
    }
});

export const { setProducts, addProduct, updateProduct, removeProduct, setCurrentView } = productSlice.actions;
export default productSlice.reducer;
```

### 2.7 Hook Sync (hooks/use[Nombre]s.ts)

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ProductModel } from '../models/ProductModel';

export const useProducts = () => {
    const products = useSelector((state: RootState) => state.products.list);
    const currentView = useSelector((state: RootState) => state.products.currentView);

    const findById = (id: number): ProductModel | undefined => {
        return products.find(p => p.id === id);
    };

    const getTotal = (): number => products.length;

    return {
        products,
        currentView,
        findById,
        getTotal
    };
};
```

### 2.8 Hook Async (hooks/use[Nombre]sFetch.ts)

```typescript
import { useState } from 'react';
import { store } from '@/store';
import { IProductService } from '../services/IProductService';
import { setProducts, addProduct, updateProduct as updateProductAction } from '../slices/productSlice';
import { CreateProductDto, UpdateProductDto } from '../models/ProductModel';

export const useProductsFetch = (service: IProductService) => {
    const [loading, setLoading] = useState(false);

    const fetchAll = async (): Promise<void> => {
        const result = await service.getAll(setLoading);
        if (result.success && result.data) {
            store.dispatch(setProducts(result.data));
        }
    };

    const create = async (dto: CreateProductDto): Promise<{ success: boolean; message: string }> => {
        const result = await service.create(dto, setLoading);
        if (result.success && result.data) {
            store.dispatch(addProduct(result.data));
            return { success: true, message: 'Producto creado' };
        }
        return { success: false, message: result.message || 'Error al crear' };
    };

    const update = async (dto: UpdateProductDto): Promise<{ success: boolean; message: string }> => {
        const result = await service.update(dto, setLoading);
        if (result.success && result.data) {
            store.dispatch(updateProductAction(result.data));
            return { success: true, message: 'Producto actualizado' };
        }
        return { success: false, message: result.message || 'Error al actualizar' };
    };

    return {
        loading,
        fetchAll,
        create,
        update
    };
};
```

---

## 3. Componentes de UI

### 3.1 index.tsx (Pagina Principal)

```typescript
import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useProducts } from './hooks/useProducts';
import { useProductsFetch } from './hooks/useProductsFetch';
import AzFilterSummary from '@/components/aziende/AzFilterSummary';
import AzMobileFilters from '@/components/aziende/AzMobileFilters';
import { getProductTableColumns } from './config/tableColumns';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import ContentCards from './components/ContentCards';
import { ProductApiService } from './services/ProductApiService';
import { ProductModel } from './models/ProductModel';

const productService = new ProductApiService();
const MOBILE_BREAKPOINT = 768;

const Products: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { currentView, products } = useProducts();
    const { loading, fetchAll, create, update } = useProductsFetch(productService);
    const [itemToEdit, setItemToEdit] = useState<ProductModel | null>(null);

    // Detectar mobile
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
    );

    // Columnas con traducciones
    const tableColumns = useMemo(() => getProductTableColumns(t), [t, i18n.language]);

    // Listener de resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Carga inicial
    useEffect(() => {
        fetchAll();
    }, []);

    // En mobile siempre cards, en desktop respetar seleccion
    const effectiveView = isMobile ? '1' : currentView;

    const handleEdit = (id: number) => {
        const item = products.find(p => p.id === id);
        if (item) setItemToEdit(item);
    };

    return (
        <div className="page-content" style={{ overflowX: 'clip' }}>
            <Container fluid style={{ overflowX: 'clip' }}>
                <Header
                    loading={loading}
                    onRefresh={fetchAll}
                    onCreate={create}
                    onUpdate={update}
                    itemToEdit={itemToEdit}
                    onCloseEditModal={() => setItemToEdit(null)}
                />

                <AzFilterSummary
                    data={products}
                    columns={tableColumns}
                    alwaysVisible={true}
                    showCount="always"
                    countPosition="top"
                >
                    {({ filteredData, filters, sorting, onFilterChange, onSortChange }) => (
                        <>
                            {effectiveView === '0' && (
                                <Row>
                                    <Col xl={12}>
                                        <ContentTable
                                            filteredData={filteredData}
                                            filters={filters}
                                            sorting={sorting}
                                            onFilterChange={onFilterChange}
                                            onSortChange={onSortChange}
                                            loading={loading}
                                            onEdit={handleEdit}
                                        />
                                    </Col>
                                </Row>
                            )}

                            {effectiveView === '1' && (
                                <>
                                    <AzMobileFilters
                                        columns={tableColumns}
                                        filters={filters}
                                        onFilterChange={onFilterChange}
                                        mobileFilterKeys={['name', 'description']}
                                        className="mb-3"
                                    />
                                    <ContentCards
                                        filteredData={filteredData}
                                        onEdit={handleEdit}
                                    />
                                </>
                            )}
                        </>
                    )}
                </AzFilterSummary>
            </Container>
        </div>
    );
};

export default Products;
```

### 3.2 Header.tsx

```typescript
import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import AzHeaderCardViews from '@/components/aziende/AzHeader/AzHeaderCardViews';
import { useProducts } from '../hooks/useProducts';
import { setCurrentView } from '../slices/productSlice';
import ProductFormModal from './modals/ProductFormModal';

interface HeaderProps {
    loading: boolean;
    onRefresh: () => Promise<void>;
    onCreate: (dto: any) => Promise<{ success: boolean; message: string }>;
    onUpdate: (dto: any) => Promise<{ success: boolean; message: string }>;
    itemToEdit: any | null;
    onCloseEditModal: () => void;
}

const Header: React.FC<HeaderProps> = ({
    loading, onRefresh, onCreate, onUpdate, itemToEdit, onCloseEditModal
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { getTotal, currentView } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (itemToEdit) setIsModalOpen(true);
    }, [itemToEdit]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        if (isModalOpen && itemToEdit) onCloseEditModal();
    };

    const handleSuccess = (isEdit: boolean) => {
        setIsModalOpen(false);
        toast.success(isEdit ? t('products.toast.updated') : t('products.toast.created'));
        onCloseEditModal();
    };

    const handleViewChange = (viewKey: string) => {
        dispatch(setCurrentView(viewKey));
    };

    return (
        <>
            <AzHeaderCardViews
                title={t('products.title')}
                description={t('products.description')}
                badge={{ count: getTotal(), color: 'info' }}
                currentView={currentView}
                onViewChange={handleViewChange}
                views={['table', 'cards']}
                contentTopRight={
                    <>
                        <Button
                            color="light"
                            onClick={onRefresh}
                            className="d-flex align-items-center"
                            disabled={loading}
                            title={t('products.refreshTitle')}
                        >
                            <i className={`mdi mdi-refresh ${loading ? 'mdi-spin' : ''}`}></i>
                            <span className="d-none d-md-inline ms-1">{t('products.refresh')}</span>
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => setIsModalOpen(true)}
                            className="d-flex align-items-center"
                            disabled={loading}
                            title={t('products.newProduct')}
                        >
                            <i className="mdi mdi-plus"></i>
                            <span className="d-none d-md-inline ms-1">{t('products.newProduct')}</span>
                        </Button>
                    </>
                }
            />

            <ProductFormModal
                isOpen={isModalOpen}
                toggle={toggleModal}
                onSuccess={handleSuccess}
                onCreate={onCreate}
                onUpdate={onUpdate}
                itemToEdit={itemToEdit}
            />
        </>
    );
};

export default Header;
```

---

## 4. Configuracion de Tabla (config/tableColumns.tsx)

```typescript
import { TFunction } from 'i18next';
import { ProductModel } from '../models/ProductModel';
import { Badge } from 'reactstrap';

export const getProductTableColumns = (t: TFunction) => [
    {
        key: "name",
        header: t('products.table.name'),
        sortable: true,
        filterable: true,
        filterType: "text",
        cell: ({ row: { original } }: { row: { original: ProductModel } }) => (
            <span className="fw-medium">{original.name}</span>
        )
    },
    {
        key: "price",
        header: t('products.table.price'),
        sortable: true,
        filterable: false,
        cell: ({ row: { original } }: { row: { original: ProductModel } }) => (
            <span className="font-family-monospace">${original.price.toFixed(2)}</span>
        )
    },
    {
        key: "isActive",
        header: t('products.table.status'),
        sortable: false,
        filterable: true,
        filterType: "select",
        filterOptions: ["Activo", "Inactivo"],
        cell: ({ row: { original } }: { row: { original: ProductModel } }) => (
            <Badge color={original.isActive ? "success" : "danger"}>
                {original.isActive ? t('products.status.active') : t('products.status.inactive')}
            </Badge>
        )
    }
];
```

---

## 5. Registrar en Redux Store

**src/store/index.ts:**

```typescript
import { configureStore } from '@reduxjs/toolkit';
// ... otros imports
import productReducer from '@/modules/[AREA]/Products/slices/productSlice';

export const store = configureStore({
    reducer: {
        // ... otros reducers
        products: productReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 6. Registrar Ruta

**src/routes/index.tsx:**

```typescript
import Products from '@/modules/[AREA]/Products';
import { PRODUCT_PERMISSIONS } from '@/core/auth/constants/permissions';

const authProtectedRoutes: RouteConfig[] = [
    // ... otras rutas
    {
        path: "/products",
        component: Products,
        permissions: [PRODUCT_PERMISSIONS.SHOW]
    },
];
```

---

## 7. Agregar Permisos

**src/core/auth/constants/permissions.ts:**

```typescript
export const PRODUCT_PERMISSIONS = {
    SHOW: 'product.show',
    CREATE: 'product.create',
    EDIT: 'product.edit',
    DELETE: 'product.delete',
};
```

Ver documentacion completa de autorizacion en: `prompts/authorization.md`

---

## 8. Traducciones

**src/assets/lang/es.json:**

```json
{
    "products": {
        "title": "Productos",
        "description": "Gestion de productos del sistema",
        "refresh": "Actualizar",
        "refreshTitle": "Actualizar lista de productos",
        "newProduct": "Nuevo Producto",
        "table": {
            "name": "Nombre",
            "price": "Precio",
            "status": "Estado"
        },
        "status": {
            "active": "Activo",
            "inactive": "Inactivo"
        },
        "toast": {
            "created": "Producto creado exitosamente",
            "updated": "Producto actualizado exitosamente"
        }
    }
}
```

---

## 9. Componentes Reutilizables Disponibles

| Componente | Ubicacion | Uso |
|------------|-----------|-----|
| `AzHeaderCard` | `components/aziende/AzHeader/` | Header simple |
| `AzHeaderCardViews` | `components/aziende/AzHeader/` | Header con toggle tabla/cards |
| `AzFilterSummary` | `components/aziende/AzFilterSummary/` | Resumen de filtros + contador |
| `AzMobileFilters` | `components/aziende/AzMobileFilters/` | Filtros colapsables para mobile |
| `AzTable` | `components/aziende/AzTable/` | Tabla con filtros y ordenamiento |
| `UserAvatar` | `components/Common/UserAvatar` | Avatar con iniciales/imagen |

---

## 10. Checklist de Implementacion

- [ ] Crear estructura de directorios
- [ ] Crear Model e interfaces DTO
- [ ] Crear Interface de servicio
- [ ] Crear API Service con adapter
- [ ] Crear Redux slice
- [ ] Crear hooks (sync y async)
- [ ] Crear configuracion de columnas
- [ ] Crear componente index.tsx
- [ ] Crear Header.tsx con modal
- [ ] Crear ContentTable.tsx
- [ ] Crear ContentCards.tsx
- [ ] Registrar reducer en store
- [ ] Agregar constantes de permisos
- [ ] Registrar ruta protegida
- [ ] Agregar traducciones
- [ ] Probar funcionalidad CRUD

---

## Documentacion Relacionada

- **Sistema de rutas:** `prompts/routing.md`
- **Autorizacion (Roles y Permisos):** `prompts/authorization.md`
- **Configuracion de APIs:** `API_CONFIGURATION.md`

---

*Ultima actualizacion: Enero 2026*
