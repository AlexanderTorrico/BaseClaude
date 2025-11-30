import { useState, useEffect, useMemo } from 'react';
import {
  ProductModel,
  CategoryModel,
  AppliedFilters,
  SortOption,
  FilterOptions,
} from '../models/ProductModel';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/mockProducts';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductModel[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<CategoryModel[]>(MOCK_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);

  const filterOptions = useMemo<FilterOptions>(() => {
    const categoryProducts = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;

    return {
      priceRange: {
        min: Math.min(...categoryProducts.map((p) => p.price)),
        max: Math.max(...categoryProducts.map((p) => p.price)),
      },
      brands: [...new Set(categoryProducts.map((p) => p.brand))],
      models: [...new Set(categoryProducts.map((p) => p.model))],
      years: [...new Set(categoryProducts.map((p) => p.year))].sort((a, b) => b - a),
      conditions: ['new', 'used', 'refurbished'],
      colors: [
        ...new Set(categoryProducts.map((p) => p.color).filter((c): c is string => !!c)),
      ],
      availability: ['in_stock', 'immediate_shipping', 'reservation'],
    };
  }, [products, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = selectedCategory
      ? products.filter((p) => p.category === selectedCategory)
      : products;

    if (appliedFilters.priceMin !== undefined) {
      result = result.filter((p) => p.price >= appliedFilters.priceMin!);
    }

    if (appliedFilters.priceMax !== undefined) {
      result = result.filter((p) => p.price <= appliedFilters.priceMax!);
    }

    if (appliedFilters.brands && appliedFilters.brands.length > 0) {
      result = result.filter((p) => appliedFilters.brands!.includes(p.brand));
    }

    if (appliedFilters.models && appliedFilters.models.length > 0) {
      result = result.filter((p) => appliedFilters.models!.includes(p.model));
    }

    if (appliedFilters.years && appliedFilters.years.length > 0) {
      result = result.filter((p) => appliedFilters.years!.includes(p.year));
    }

    if (appliedFilters.conditions && appliedFilters.conditions.length > 0) {
      result = result.filter((p) => appliedFilters.conditions!.includes(p.condition));
    }

    if (appliedFilters.colors && appliedFilters.colors.length > 0) {
      result = result.filter((p) => p.color && appliedFilters.colors!.includes(p.color));
    }

    if (appliedFilters.availability && appliedFilters.availability.length > 0) {
      result = result.filter((p) =>
        appliedFilters.availability!.includes(p.status)
      );
    }

    if (appliedFilters.search) {
      const searchLower = appliedFilters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.model.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [products, selectedCategory, appliedFilters]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => b.year - a.year);
      case 'lowest_usage':
        return sorted.sort((a, b) => {
          const aUsage = a.usage?.kilometers || a.usage?.hours || 0;
          const bUsage = b.usage?.kilometers || b.usage?.hours || 0;
          return aUsage - bUsage;
        });
      case 'best_rated':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'availability':
        const statusOrder = { in_stock: 0, immediate_shipping: 1, reservation: 2, out_of_stock: 3 };
        return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const updateFilter = (key: keyof AppliedFilters, value: any) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setAppliedFilters({});
  };

  const getProductById = (id: number): ProductModel | undefined => {
    return products.find((p) => p.id === id);
  };

  const getRelatedProducts = (productId: number): ProductModel[] => {
    const product = getProductById(productId);
    if (!product || !product.relatedProducts) return [];
    return product.relatedProducts
      .map((id) => getProductById(id))
      .filter((p): p is ProductModel => !!p);
  };

  return {
    products: sortedProducts,
    allProducts: products,
    categories,
    selectedCategory,
    setSelectedCategory,
    appliedFilters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
    filterOptions,
    selectedProduct,
    setSelectedProduct,
    getProductById,
    getRelatedProducts,
    totalProducts: sortedProducts.length,
  };
};
