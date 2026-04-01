import type {
  CurrencyCode,
  ListParams,
  Metadata,
  Timestamps,
} from "@/types/common";

export type ProductStatus = "active" | "inactive" | "draft" | "archived";

/**
 * Mappe `product_format` Django → type SDK via `get_type()`.
 * `"physical"` et `"service"` sont les seuls choices Django natifs.
 * `"digital"` est supporté par le mapping mais absent des choices.
 */
export type ProductType = "physical" | "digital" | "service";

/**
 * Image d'un produit — mappée depuis `ProductImageSerializer`.
 * Pas de timestamps (absents des `Meta.fields`).
 */
export interface ProductImage {
  id: string;
  product: string;      // ID du produit parent
  url: string;          // source="image" (ImageField)
  alt?: string;         // source="alt_text"
  position: number;     // source="order"
  is_primary: boolean;
}

/**
 * Représente un produit Sangho.
 * Préfixe d'identifiant : `prod_xxx`
 */
export interface Product extends Timestamps {
  id: string;
  object: "product";
  app: string;
  name: string;
  description?: string | null;
  type: ProductType;        // get_type() : mappe product_format → type SDK
  status: ProductStatus;
  unit_amount: number;      // int — get_unit_amount() : int(obj.price)
  currency: CurrencyCode;
  stock?: number | null;
  sku?: string | null;
  is_shippable: boolean;    // source="shippable"
  images: ProductImage[];
  metadata: Metadata;
}

/** Champs POST — `name`, `unit_amount`, `currency` requis */
export interface CreatePayloads {
  name: string;
  description?: string;
  type?: ProductType;         // mappé en product_format côté backend
  unit_amount: number;        // mappé en price
  currency: CurrencyCode;
  stock?: number;
  sku?: string;
  is_shippable?: boolean;     // mappé en shippable
  metadata?: Metadata;
}

/** Champs PATCH — tous optionnels */
export interface Payloads {
  name?: string;
  description?: string;
  type?: ProductType;
  unit_amount?: number;
  stock?: number;
  sku?: string;
  status?: ProductStatus;
  is_shippable?: boolean;
  metadata?: Metadata;
}

/** Filtres GET /products/ — alignés sur get_queryset() */
export interface ProductCriteria extends ListParams {
  status?: ProductStatus;
  currency?: CurrencyCode;
}