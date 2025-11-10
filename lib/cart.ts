// Cart management avec localStorage

export interface CartItem {
  variantId: string
  productId: string
  productTitle: string
  variantTitle: string
  quantity: number
  price: number  // en centimes
  imageUrl?: string
}

const CART_KEY = 'exclusives_cart'

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

// Add item to cart or update quantity if exists
export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): void {
  const cart = getCart()
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.variantId === item.variantId
  )

  if (existingItemIndex > -1) {
    // Update existing item quantity
    cart[existingItemIndex].quantity += item.quantity || 1
  } else {
    // Add new item
    cart.push({
      ...item,
      quantity: item.quantity || 1,
    })
  }

  saveCart(cart)
}

// Update item quantity
export function updateQuantity(variantId: string, quantity: number): void {
  const cart = getCart()
  const itemIndex = cart.findIndex((item) => item.variantId === variantId)

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    saveCart(cart)
  }
}

// Remove item from cart
export function removeItem(variantId: string): void {
  const cart = getCart()
  const filteredCart = cart.filter((item) => item.variantId !== variantId)
  saveCart(filteredCart)
}

// Clear entire cart
export function clearCart(): void {
  saveCart([])
}

// Get total items count
export function getCartCount(): number {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

// Get cart total price in euros
export function getCartTotal(): number {
  const cart = getCart()
  const totalCents = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  return totalCents / 100
}

// Get cart total price formatted
export function getCartTotalFormatted(): string {
  return `${getCartTotal().toFixed(2)}€`
}
