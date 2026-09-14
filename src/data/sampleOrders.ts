import { Order } from '../types';

export const initialSampleOrders: Order[] = [
  {
    id: 'ORD-2026-8942',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 mins ago
    customerName: 'Eleanor Vance',
    customerPhone: '14155552389',
    fulfillment: 'pickup',
    requestedDate: '2026-09-15',
    requestedTime: '10:30 AM',
    specialNotes: 'For Eleanor’s 30th Birthday. Please include tall gold birthday candles and handle with utmost care!',
    items: [
      {
        id: 'item-custom-1',
        type: 'custom',
        name: 'Custom Tiered Celebration Cake',
        quantity: 1,
        unitPrice: 124.00,
        totalPrice: 124.00,
        details: {
          size: '2-Tier (10" + 6")',
          flavor: 'Vanilla Bean Infusion',
          filling: 'Raspberry Reduction Coulis',
          frosting: 'Swiss Meringue Buttercream (Smooth Minimalist)',
          color: 'Blush Rose Soft Pink',
          colorHex: '#FBCFE8',
          toppings: ['Fresh Berries (Raspberries & Blueberries)', 'Edible 24k Gold Leaf Flakes'],
          writing: 'Happy 30th Eleanor'
        },
        image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'item-menu-1',
        type: 'menu',
        name: 'Classic French Butter Croissant',
        quantity: 4,
        unitPrice: 4.75,
        totalPrice: 19.00,
        details: {
          category: 'Pastry'
        },
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400'
      }
    ],
    subtotal: 143.00,
    deliveryFee: 0.00,
    tax: 11.44,
    grandTotal: 154.44,
    status: 'new',
    staffNotes: 'Customer confirmed via WhatsApp. Gold candles pre-packed in pastry box.'
  },
  {
    id: 'ORD-2026-8910',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    customerName: 'Marcus Sterling',
    customerPhone: '12065558190',
    fulfillment: 'delivery',
    deliveryAddress: '742 Evergreen Terrace, Apt 4B, South District',
    requestedDate: '2026-09-14',
    requestedTime: '03:00 PM',
    specialNotes: 'Please ring bell and leave on the covered porch table. Fragile pastry box.',
    items: [
      {
        id: 'item-custom-2',
        type: 'custom',
        name: 'Custom Velvet Elegance Cake',
        quantity: 1,
        unitPrice: 78.00,
        totalPrice: 78.00,
        details: {
          size: '8-inch (Serves 10-14)',
          flavor: 'Red Velvet',
          filling: 'Belgian Dark Chocolate Ganache',
          frosting: 'Textured Knife Palette Buttercream',
          color: 'Warm Ivory Whipped Cream',
          colorHex: '#FDFBF7',
          toppings: ['French Macarons Assortment', 'Organic Floral Lavender Sprigs'],
          writing: 'Forever & Always'
        },
        image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'item-menu-2',
        type: 'menu',
        name: 'Normandy Lemon Meringue Tart',
        quantity: 2,
        unitPrice: 7.25,
        totalPrice: 14.50,
        details: {
          category: 'Pastry'
        },
        image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=400'
      }
    ],
    subtotal: 92.50,
    deliveryFee: 10.00,
    tax: 7.40,
    grandTotal: 109.90,
    status: 'baking',
    staffNotes: 'Cake sponges cooled; ganache layer setting in chiller.'
  },
  {
    id: 'ORD-2026-8875',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), // 8 hours ago
    customerName: 'Sophia Chen',
    customerPhone: '16505559041',
    fulfillment: 'pickup',
    requestedDate: '2026-09-14',
    requestedTime: '01:30 PM',
    specialNotes: 'Picking up during lunch break. Please have boxed and chilled.',
    items: [
      {
        id: 'item-menu-3',
        type: 'menu',
        name: 'Artisan Country Sourdough Boule',
        quantity: 2,
        unitPrice: 8.50,
        totalPrice: 17.00,
        details: {
          category: 'Bread'
        },
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'item-menu-4',
        type: 'menu',
        name: 'Brown Butter Fleur de Sel Cookie',
        quantity: 6,
        unitPrice: 4.25,
        totalPrice: 25.50,
        details: {
          category: 'Cookie'
        },
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'item-menu-5',
        type: 'menu',
        name: 'Almond Frangipane Pain',
        quantity: 3,
        unitPrice: 5.50,
        totalPrice: 16.50,
        details: {
          category: 'Pastry'
        },
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
      }
    ],
    subtotal: 59.00,
    deliveryFee: 0.00,
    tax: 4.72,
    grandTotal: 63.72,
    status: 'ready',
    staffNotes: 'Packaged in kraft window box on pickup staging shelf #3.'
  },
  {
    id: 'ORD-2026-8804',
    createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), // Yesterday
    customerName: 'Julian Rossi',
    customerPhone: '13125557712',
    fulfillment: 'delivery',
    deliveryAddress: '120 Waterfront Way, Suite 1200, Downtown',
    requestedDate: '2026-09-13',
    requestedTime: '04:00 PM',
    specialNotes: 'Corporate reception event. Invoice requested.',
    items: [
      {
        id: 'item-menu-6',
        type: 'menu',
        name: 'Pain au Chocolat (Valrhona 70%)',
        quantity: 12,
        unitPrice: 5.25,
        totalPrice: 63.00,
        details: {
          category: 'Pastry'
        },
        image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'item-menu-7',
        type: 'menu',
        name: 'Valrhona Triple Chocolate Cookie',
        quantity: 12,
        unitPrice: 4.50,
        totalPrice: 54.00,
        details: {
          category: 'Cookie'
        },
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400'
      }
    ],
    subtotal: 117.00,
    deliveryFee: 10.00,
    tax: 9.36,
    grandTotal: 136.36,
    status: 'completed',
    staffNotes: 'Hand-delivered to office front desk. Signed by Julian.'
  }
];
