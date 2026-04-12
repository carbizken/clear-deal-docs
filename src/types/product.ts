// ──────────────────────────────────────────────────────────────
// Rich Product Data Model
//
// Products have:
// - Multiple price tiers (sedan, SUV, truck)
// - Full descriptions, benefits, warranty details
// - Product library with extended info
// - Category hierarchy
// - Provider/vendor information
// ──────────────────────────────────────────────────────────────

export type VehicleCategory = "sedan" | "suv" | "truck" | "van" | "coupe" | "convertible" | "wagon" | "default";

export interface ProductPriceTier {
  vehicleCategory: VehicleCategory;
  price: number;
  label?: string;  // e.g. "Sedan/Coupe", "SUV/Crossover", "Truck/Van"
}

export interface ProductLibraryEntry {
  // Core identity
  id: string;
  name: string;
  category: string;           // e.g. "Paint Protection", "Electronics", "Interior", "Exterior", "Warranty", "Maintenance"
  subcategory?: string;       // e.g. "Ceramic Coating", "Film", "Tint"

  // Display on sticker
  subtitle: string;           // Short tagline for the sticker
  badge_type: "installed" | "optional";

  // Pricing tiers
  defaultPrice: number;       // Base price (used when no vehicle category match)
  priceTiers: ProductPriceTier[];  // Category-specific pricing
  price_label: string;        // "Included in Selling Price" or "If Accepted"

  // Rich content (product library)
  description: string;        // Full marketing description
  benefits: string[];         // Bullet point benefits
  features: string[];         // Technical features
  whyItMatters: string;       // Customer-facing "why you need this"

  // Warranty
  warranty: string;           // Short warranty line for sticker
  warrantyDetails: string;    // Full warranty terms
  warrantyProvider: string;   // Who backs the warranty
  warrantyDuration: string;   // e.g. "7 years / 100,000 miles"

  // Provider / vendor
  vendorName: string;         // e.g. "XPEL", "Cilajet", "Resistall"
  vendorUrl?: string;
  vendorLogo?: string;

  // Compliance
  disclosure: string;         // Legal disclosure text for the addendum
  ftcCompliant: boolean;      // Does this product provide genuine consumer benefit?
  noBenefitWarning?: string;  // If flagged by checkNoBenefitItems()

  // Media
  iconType: string;           // Icon key from PRODUCT_ICONS
  productImageUrl?: string;
  brochureUrl?: string;       // PDF link for the product library
  videoUrl?: string;          // Demo/install video

  // Admin
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Map body style strings to our vehicle categories
export function getVehicleCategory(bodyStyle: string): VehicleCategory {
  const lower = (bodyStyle || "").toLowerCase();

  if (lower.includes("sedan") || lower.includes("coupe") || lower.includes("hatchback") || lower.includes("convertible")) {
    return "sedan";
  }
  if (lower.includes("suv") || lower.includes("crossover") || lower.includes("sport utility")) {
    return "suv";
  }
  if (lower.includes("truck") || lower.includes("pickup") || lower.includes("cab")) {
    return "truck";
  }
  if (lower.includes("van") || lower.includes("minivan")) {
    return "van";
  }
  if (lower.includes("wagon")) {
    return "wagon";
  }

  return "default";
}

// Get the right price for a vehicle category
export function getProductPrice(product: ProductLibraryEntry, vehicleCategory: VehicleCategory): number {
  const tier = product.priceTiers.find(t => t.vehicleCategory === vehicleCategory);
  if (tier) return tier.price;

  // Fall back to default price
  return product.defaultPrice;
}

// Default product categories for organizing the library
export const PRODUCT_CATEGORIES = [
  { id: "paint_protection", name: "Paint Protection", description: "PPF, ceramic coating, paint sealant" },
  { id: "window", name: "Window", description: "Tint, film, protection" },
  { id: "interior", name: "Interior Protection", description: "Fabric guard, leather treatment, floor liners" },
  { id: "exterior", name: "Exterior", description: "Door edge guards, pinstripe, clear bra, bed liner" },
  { id: "theft", name: "Theft Deterrent", description: "VIN etch, GPS tracking, alarm systems" },
  { id: "electronics", name: "Electronics", description: "Remote start, dash cam, backup camera" },
  { id: "wheels_tires", name: "Wheels & Tires", description: "Wheel locks, nitrogen, tire protection, TPMS" },
  { id: "appearance", name: "Appearance", description: "Detail packages, chrome delete, wrap" },
  { id: "warranty", name: "Warranty & Plans", description: "Extended warranty, VSC, GAP, maintenance plans" },
  { id: "safety", name: "Safety", description: "Road hazard, key replacement, windshield" },
  { id: "convenience", name: "Convenience", description: "All-weather mats, cargo liner, roof rack, running boards" },
  { id: "chemical", name: "Chemical Application", description: "Rust proofing, undercoating, fabric/paint chemicals" },
];

// Empty product template
export const emptyProductLibraryEntry: Omit<ProductLibraryEntry, "id" | "created_at" | "updated_at"> = {
  name: "",
  category: "paint_protection",
  subtitle: "",
  badge_type: "installed",
  defaultPrice: 0,
  priceTiers: [
    { vehicleCategory: "sedan", price: 0, label: "Sedan / Coupe" },
    { vehicleCategory: "suv", price: 0, label: "SUV / Crossover" },
    { vehicleCategory: "truck", price: 0, label: "Truck / Pickup" },
  ],
  price_label: "Included in Selling Price",
  description: "",
  benefits: [],
  features: [],
  whyItMatters: "",
  warranty: "",
  warrantyDetails: "",
  warrantyProvider: "",
  warrantyDuration: "",
  vendorName: "",
  disclosure: "",
  ftcCompliant: true,
  iconType: "",
  sort_order: 0,
  is_active: true,
};
