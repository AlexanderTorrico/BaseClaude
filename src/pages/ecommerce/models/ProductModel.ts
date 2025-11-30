export interface ProductModel {
  id: number;
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  priceWithVAT: number;
  vatIncluded: boolean;
  currency: string;
  condition: 'new' | 'used' | 'refurbished';
  status: 'in_stock' | 'immediate_shipping' | 'reservation' | 'out_of_stock';
  year: number;
  images: string[];
  mainImage: string;
  description: string;
  shortDescription: string;
  highlights: string[];
  tags: string[];
  specifications: {
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
      unit?: string;
    };
    materials?: string[];
    performance?: {
      power?: string;
      autonomy?: string;
      efficiency?: string;
    };
    technical?: Record<string, string>;
    certifications?: string[];
    warranty?: string;
  };
  usage?: {
    kilometers?: number;
    hours?: number;
    condition?: string;
  };
  availability: {
    stock: number;
    deliveryTime: string;
    pickupLocation?: string;
    returnPolicy?: string;
  };
  color?: string;
  rating?: number;
  reviews?: number;
  relatedProducts?: number[];
  accessories?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryModel {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productsCount: number;
}

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  models: string[];
  years: number[];
  conditions: ('new' | 'used' | 'refurbished')[];
  colors: string[];
  availability: ('in_stock' | 'immediate_shipping' | 'reservation')[];
}

export interface AppliedFilters {
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  models?: string[];
  years?: number[];
  conditions?: string[];
  colors?: string[];
  availability?: string[];
  search?: string;
}

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'lowest_usage'
  | 'best_rated'
  | 'availability';
