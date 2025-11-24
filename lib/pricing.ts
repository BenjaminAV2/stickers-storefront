// Pricing configuration
const BASE_EUR_PER_CM2 = 0.027

const SUPPORT_MULTIPLIERS = {
  vinyle_blanc: 1,
  vinyle_transparent: 1.05,
  vinyle_holographique: 1.2,
  vinyle_miroir: 1.25,
}

const SHAPE_MULTIPLIERS = {
  carre_rectangle: 1,
  carre_rectangle_bords_arrondis: 1,
  rond: 1,
  cut_contour: 1.2,
}

const QUANTITY_TIERS = [20, 50, 100, 200, 300, 500, 1000, 2000, 3000]

const DISCOUNTS = {
  20: 0.20,
  50: 0.22,
  100: 0.24,
  200: 0.28,
  300: 0.30,
  500: 0.45,
  1000: 0.55,
  2000: 0.60,
  3000: 0.65,
}

// Predefined sizes for each shape type
export const PREDEFINED_SIZES = {
  carre_rectangle: [
    { widthCm: 2, heightCm: 2, label: '2×2 cm' },
    { widthCm: 5, heightCm: 5, label: '5×5 cm' },
    { widthCm: 8, heightCm: 8, label: '8×8 cm' },
    { widthCm: 10, heightCm: 10, label: '10×10 cm' },
    { widthCm: 15, heightCm: 15, label: '15×15 cm' },
    { widthCm: 20, heightCm: 20, label: '20×20 cm' },
    { widthCm: 30, heightCm: 30, label: '30×30 cm' },
    { widthCm: 40, heightCm: 40, label: '40×40 cm' },
    { widthCm: 50, heightCm: 50, label: '50×50 cm' },
    { widthCm: 80, heightCm: 80, label: '80×80 cm' },
    { widthCm: 100, heightCm: 100, label: '100×100 cm' },
  ],
  carre_rectangle_bords_arrondis: [
    { widthCm: 2, heightCm: 2, label: '2×2 cm' },
    { widthCm: 5, heightCm: 5, label: '5×5 cm' },
    { widthCm: 8, heightCm: 8, label: '8×8 cm' },
    { widthCm: 10, heightCm: 10, label: '10×10 cm' },
    { widthCm: 15, heightCm: 15, label: '15×15 cm' },
    { widthCm: 20, heightCm: 20, label: '20×20 cm' },
    { widthCm: 30, heightCm: 30, label: '30×30 cm' },
    { widthCm: 40, heightCm: 40, label: '40×40 cm' },
    { widthCm: 50, heightCm: 50, label: '50×50 cm' },
    { widthCm: 80, heightCm: 80, label: '80×80 cm' },
    { widthCm: 100, heightCm: 100, label: '100×100 cm' },
  ],
  rond: [
    { diameterCm: 2, label: 'Ø 2 cm' },
    { diameterCm: 5, label: 'Ø 5 cm' },
    { diameterCm: 8, label: 'Ø 8 cm' },
    { diameterCm: 10, label: 'Ø 10 cm' },
    { diameterCm: 15, label: 'Ø 15 cm' },
    { diameterCm: 20, label: 'Ø 20 cm' },
    { diameterCm: 30, label: 'Ø 30 cm' },
    { diameterCm: 40, label: 'Ø 40 cm' },
    { diameterCm: 50, label: 'Ø 50 cm' },
    { diameterCm: 80, label: 'Ø 80 cm' },
    { diameterCm: 100, label: 'Ø 100 cm' },
  ],
  cut_contour: [
    { widthCm: 5, heightCm: 5, label: '5×5 cm' },
    { widthCm: 8, heightCm: 8, label: '8×8 cm' },
    { widthCm: 10, heightCm: 10, label: '10×10 cm' },
    { widthCm: 15, heightCm: 15, label: '15×15 cm' },
    { widthCm: 20, heightCm: 20, label: '20×20 cm' },
    { widthCm: 30, heightCm: 30, label: '30×30 cm' },
    { widthCm: 40, heightCm: 40, label: '40×40 cm' },
    { widthCm: 50, heightCm: 50, label: '50×50 cm' },
  ],
}

export type SupportType = keyof typeof SUPPORT_MULTIPLIERS
export type ShapeType = keyof typeof SHAPE_MULTIPLIERS

// Export quantity tiers for use in components
export { QUANTITY_TIERS }

// Minimum custom quantity
export const MIN_CUSTOM_QUANTITY = 10

interface AreaParams {
  shape: ShapeType
  widthCm?: number
  heightCm?: number
  diameterCm?: number
}

interface PricingParams extends AreaParams {
  support: SupportType
}

export interface PriceMatrixRow {
  q: number
  discountPct: number
  unitCents: number
  totalCents: number
}

/**
 * Calculate area in cm² based on shape
 * Always uses the square of the largest side for simplicity
 */
export function cm2Area({ shape, widthCm, heightCm, diameterCm }: AreaParams): number {
  if (shape === 'rond') {
    if (!diameterCm) return 0
    // Use square of diameter instead of actual circle area
    return diameterCm * diameterCm
  }

  if (!widthCm || !heightCm) return 0
  // Use square of the largest side
  const maxSide = Math.max(widthCm, heightCm)
  return maxSide * maxSide
}

/**
 * Compute unit price in cents for a single sticker
 */
export function computeUnitPriceCents({
  shape,
  support,
  widthCm,
  heightCm,
  diameterCm,
}: PricingParams): number {
  const area = cm2Area({ shape, widthCm, heightCm, diameterCm })

  if (area === 0) return 0

  let base =
    BASE_EUR_PER_CM2 *
    area *
    SUPPORT_MULTIPLIERS[support] *
    SHAPE_MULTIPLIERS[shape]

  // Floor at 0.1€
  if (base < 0.1) {
    base = 0.1
  }

  return Math.round(base * 100)
}

/**
 * Get discount percentage for a given quantity
 */
function getDiscountForQuantity(quantity: number): number {
  // If exact match in DISCOUNTS, use it
  if (DISCOUNTS[quantity as keyof typeof DISCOUNTS] !== undefined) {
    return DISCOUNTS[quantity as keyof typeof DISCOUNTS]
  }

  // Find the appropriate discount tier (interpolate)
  const sortedTiers = QUANTITY_TIERS.slice().sort((a, b) => a - b)

  // If below minimum tier, no discount
  if (quantity < sortedTiers[0]) {
    return 0
  }

  // If above maximum tier, use maximum discount
  if (quantity >= sortedTiers[sortedTiers.length - 1]) {
    return DISCOUNTS[sortedTiers[sortedTiers.length - 1] as keyof typeof DISCOUNTS]
  }

  // Find the two tiers to interpolate between
  for (let i = 0; i < sortedTiers.length - 1; i++) {
    const lowerTier = sortedTiers[i]
    const upperTier = sortedTiers[i + 1]

    if (quantity >= lowerTier && quantity < upperTier) {
      const lowerDiscount = DISCOUNTS[lowerTier as keyof typeof DISCOUNTS]
      const upperDiscount = DISCOUNTS[upperTier as keyof typeof DISCOUNTS]

      // Linear interpolation
      const ratio = (quantity - lowerTier) / (upperTier - lowerTier)
      return lowerDiscount + (upperDiscount - lowerDiscount) * ratio
    }
  }

  return 0
}

/**
 * Compute price for a custom quantity
 */
export function computeCustomQuantityPrice(params: PricingParams, quantity: number): PriceMatrixRow {
  const unitCents = computeUnitPriceCents(params)
  const discount = getDiscountForQuantity(quantity)
  const unitAfter = Math.round(unitCents * (1 - discount))
  const totalCents = unitAfter * quantity

  return {
    q: quantity,
    discountPct: Math.round(discount * 100),
    unitCents: unitAfter,
    totalCents,
  }
}

/**
 * Compute full price matrix for all quantity tiers
 */
export function computeMatrix(params: PricingParams): PriceMatrixRow[] {
  const unitCents = computeUnitPriceCents(params)

  return QUANTITY_TIERS.map((q) => {
    const discount = DISCOUNTS[q as keyof typeof DISCOUNTS] || 0
    const unitAfter = Math.round(unitCents * (1 - discount))
    const totalCents = unitAfter * q

    return {
      q,
      discountPct: Math.round(discount * 100),
      unitCents: unitAfter,
      totalCents,
    }
  })
}

/**
 * Format cents to EUR string
 */
export function formatEur(cents: number): string {
  const euros = cents / 100
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros)
}
