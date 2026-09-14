export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'pastry' | 'bread' | 'cake' | 'cookie' | 'savory';
  image: string;
  dietary: ('gluten-free' | 'vegan' | 'dairy-free' | 'nut-free')[];
  ingredients: string[];
}

export interface CustomCake {
  size: string;
  basePrice: number;
  flavor: string;
  filling: string;
  frosting: string;
  color: string;
  colorHex: string;
  toppings: string[];
  writing: string;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  type: 'menu' | 'custom';
  menuItem?: MenuItem;
  customCake?: CustomCake;
  quantity: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  priceEstimate: number;
  specs: {
    size: string;
    flavor: string;
    filling: string;
    frosting: string;
    toppings: string[];
  };
}

export type OrderStatus = 'new' | 'baking' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  type: 'menu' | 'custom';
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  details?: {
    category?: string;
    size?: string;
    flavor?: string;
    filling?: string;
    frosting?: string;
    color?: string;
    colorHex?: string;
    toppings?: string[];
    writing?: string;
  };
  image?: string;
}

export interface Order {
  id: string;
  createdAt: string; // ISO string
  customerName: string;
  customerPhone: string;
  fulfillment: 'pickup' | 'delivery';
  deliveryAddress?: string;
  requestedDate: string;
  requestedTime: string;
  specialNotes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  status: OrderStatus;
  staffNotes?: string;
}
