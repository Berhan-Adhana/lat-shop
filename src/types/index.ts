// src/types/index.ts
// Central type definitions for Lat Shop

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────
export type Role = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  phone?: string;
  createdAt: string;
}

// ─────────────────────────────────────────
// CATEGORY
// ─────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

// ─────────────────────────────────────────
// PRODUCT
// ─────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  saleEndsAt?: string;
  stock: number;
  images: string[];
  featured: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  reviews?: Review[];
  avgRating?: number;
  reviewCount?: number;
  createdAt: string;
}

// ─────────────────────────────────────────
// CART
// ─────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ─────────────────────────────────────────
// ORDER
// ─────────────────────────────────────────
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  tax: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  items: OrderItem[];
  address: Address;
  createdAt: string;
}

// ─────────────────────────────────────────
// ADDRESS
// ─────────────────────────────────────────
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// ─────────────────────────────────────────
// COUPON
// ─────────────────────────────────────────
export type DiscountType = "PERCENTAGE" | "FIXED" | "FREE_SHIPPING";

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  onePerCustomer: boolean;
  isActive: boolean;
  expiresAt?: string;
  categoryId?: string;
  productId?: string;
}

// ─────────────────────────────────────────
// SHIPPING
// ─────────────────────────────────────────
export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rate: number;
  freeOver?: number;
  isActive: boolean;
}

// ─────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────
export interface Review {
  id: string;
  userId: string;
  user?: Pick<User, "id" | "name" | "image">;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ─────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────
export interface CheckoutSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponApplied?: Coupon;
}

// ─────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueToday: number;
  ordersToday: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  topProducts: Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
  ordersByStatus: Record<OrderStatus, number>;
}
