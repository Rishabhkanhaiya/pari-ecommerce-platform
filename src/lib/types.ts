// Shared TypeScript types for the entire application

export interface Profile {
  id: string
  phone: string | null
  name: string | null
  email: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  name: string
  phone: string
  address_line1: string
  address_line2?: string
  landmark?: string
  city: string
  pincode: string
  is_default: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  created_at: string
  subcategories?: Category[]
}

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  description?: string
  price: number
  mrp?: number
  images: string[]
  stock: number
  low_stock_threshold: number
  sku?: string
  tags: string[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: Category
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  price?: number
  stock: number
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  description?: string
  type: 'percent' | 'flat'
  value: number
  min_order_amount: number
  max_discount?: number
  max_uses?: number
  used_count: number
  expires_at?: string
  is_active: boolean
  created_at: string
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  order_number: string
  user_id: string
  address_id?: string
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  delivery_city: string
  delivery_pincode: string
  subtotal: number
  discount: number
  delivery_fee: number
  total: number
  coupon_code?: string
  coupon_id?: string
  status: OrderStatus
  payment_method: 'razorpay' | 'cod'
  payment_status: PaymentStatus
  notes?: string
  admin_notes?: string
  estimated_delivery?: string
  delivered_at?: string
  cancelled_at?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
  user?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  variant_id?: string
  product_name: string
  variant_name?: string
  product_image?: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface Payment {
  id: string
  order_id: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  method?: string
  created_at: string
}

// Cart types (client-side only, persisted in localStorage/Zustand)
export interface CartItem {
  productId: string
  variantId?: string
  name: string
  variantName?: string
  image?: string
  price: number
  quantity: number
  stock: number
  slug: string
}

export interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  addItem: (item: CartItem, openDrawer?: boolean) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getTotalPrice: () => number
}

// Wishlist types (persisted in localStorage/Zustand)
export interface WishlistItem {
  productId: string
  name: string
  price: number
  mrp?: number
  image?: string
  slug: string
  stock: number
  categoryName?: string
}

export interface WishlistState {
  items: WishlistItem[]
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  getTotalItems: () => number
}

// API response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

// Order status flow
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'packed',
  'out_for_delivery',
  'delivered',
]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  packed: 'text-purple-600 bg-purple-50',
  out_for_delivery: 'text-orange-600 bg-orange-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}
