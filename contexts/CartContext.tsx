'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SupportType, ShapeType } from '@/lib/pricing'

export interface CartItem {
  productId: string
  handle: string
  title: string
  support: SupportType
  shape: ShapeType
  widthCm?: number
  heightCm?: number
  diameterCm?: number
  quantity: number
  unitCents: number
  totalCents: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  clearCart: () => void
  totalItems: number
  totalCents: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'stickers-cart'

// Helper to check if two cart items have the same configuration
function isSameConfiguration(a: CartItem, b: CartItem): boolean {
  return (
    a.productId === b.productId &&
    a.support === b.support &&
    a.shape === b.shape &&
    a.widthCm === b.widthCm &&
    a.heightCm === b.heightCm &&
    a.diameterCm === b.diameterCm &&
    a.unitCents === b.unitCents
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        setItems(parsed)
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [items, isLoaded])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Check if an item with the same configuration already exists
      const existingIndex = prev.findIndex((existing) =>
        isSameConfiguration(existing, item)
      )

      if (existingIndex !== -1) {
        // Merge quantities
        const updated = [...prev]
        const existing = updated[existingIndex]
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + item.quantity,
          totalCents: existing.totalCents + item.totalCents,
        }
        return updated
      } else {
        // Add as new item
        return [...prev, item]
      }
    })
    // TODO: Add notification/toast
    console.log('Item added to cart:', item)
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalCents = items.reduce((sum, item) => sum + item.totalCents, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        totalItems,
        totalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
