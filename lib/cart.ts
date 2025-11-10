// Cart management avec localStorage
import { ProductConfiguration } from '@/lib/types'

export interface CartItem {
  id: string // Unique ID for this cart item
  productId: string
  productHandle: string
  productTitle: string
  productImage?: string
  configuration: ProductConfiguration
  unitPrice: number // Prix unitaire en EUR
  quantity: number // Quantité de stickers (30, 50, 100, etc.)
  totalPrice: number // Prix total de la ligne en EUR
}

const CART_KEY = 'exclusives_cart'

/**
 * Generate a unique ID for a cart item based on its configuration
 */
export function generateCartItemId(
  productId: string,
  config: ProductConfiguration
): string {
  return `${productId}-${config.size}-${config.support}-${config.shape}-${config.quantity}`
}

// Get cart from localStorage
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []

  try {
    const cart = localStorage.getItem(CART_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error reading cart:', error)
    return []
  }
}

// Save cart to localStorage
function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new Event('cartUpdated'))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

// Add item to cart or update if exists with same configuration
export function addToCart(
  productId: string,
  productHandle: string,
  productTitle: string,
  productImage: string | undefined,
  configuration: ProductConfiguration,
  unitPrice: number
): void {
  const cart = getCart()
  const itemId = generateCartItemId(productId, configuration)

  const existingItemIndex = cart.findIndex((item) => item.id === itemId)

  if (existingItemIndex > -1) {
    // Item with same config exists - update it
    const existingItem = cart[existingItemIndex]
    cart[existingItemIndex] = {
      ...existingItem,
      configuration,
      unitPrice,
      quantity: configuration.quantity,
      totalPrice: unitPrice * configuration.quantity,
    }
  } else {
    // Add new item
    cart.push({
      id: itemId,
      productId,
      productHandle,
      productTitle,
      productImage,
      configuration,
      unitPrice,
      quantity: configuration.quantity,
      totalPrice: unitPrice * configuration.quantity,
    })
  }

  saveCart(cart)
}

// Update item quantity and price
export function updateCartItem(
  itemId: string,
  newQuantity: number,
  newUnitPrice: number
): void {
  const cart = getCart()
  const itemIndex = cart.findIndex((item) => item.id === itemId)

  if (itemIndex > -1) {
    const item = cart[itemIndex]
    cart[itemIndex] = {
      ...item,
      quantity: newQuantity,
      unitPrice: newUnitPrice,
      totalPrice: newUnitPrice * newQuantity,
      configuration: {
        ...item.configuration,
        quantity: newQuantity,
      },
    }
    saveCart(cart)
  }
}

// Remove item from cart
export function removeItem(itemId: string): void {
  const cart = getCart()
  const filteredCart = cart.filter((item) => item.id !== itemId)
  saveCart(filteredCart)
}

// Clear entire cart
export function clearCart(): void {
  saveCart([])
}

// Get total items count (number of cart lines, not total stickers)
export function getCartCount(): number {
  return getCart().length
}

// Get total quantity of stickers in cart
export function getTotalStickersCount(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

// Get cart total price in euros
export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.totalPrice, 0)
}

// Get cart total price formatted
export function getCartTotalFormatted(): string {
  return `${getCartTotal().toFixed(2)} €`
}
