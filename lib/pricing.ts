// Pricing configuration
const BASE_EUR_PER_CM2 = 0.045

const SUPPORT_MULTIPLIERS = {
  vinyle_blanc: 1,
  vinyle_transparent: 1.05,
  vinyle_holographique: 1.2,
  vinyle_miroir: 1.25,
}

const SHAPE_MULTIPLIERS = {
  carre_rectangle: 1,
  rond: 1.05,
  cut_contour: 1.1,
}

const QUANTITY_TIERS = [5, 10, 25, 50, 100, 250, 500, 1000]

const DISCOUNTS = {
  5: 0,
  10: 0.03,
  25: 0.07,
  50: 0.12,
  100: 0.18,
  250: 0.25,
  500: 0.35,
  1000: 0.45,
}

export type SupportType = keyof typeof SUPPORT_MULTIPLIERS
export type ShapeType = keyof typeof SHAPE_MULTIPLIERS

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
 */
export function cm2Area({ shape, widthCm, heightCm, diameterCm }: AreaParams): number {
  if (shape === 'rond') {
    if (!diameterCm) return 0
    const radius = diameterCm / 2
    return Math.PI * radius * radius
  }

  if (!widthCm || !heightCm) return 0
  return widthCm * heightCm
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

  // Floor at 0.2€
  if (base < 0.2) {
    base = 0.2
  }

  return Math.round(base * 100)
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
