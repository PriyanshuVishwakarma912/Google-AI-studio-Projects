import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import MenuSection from './components/MenuSection';
import CakeBuilder from './components/CakeBuilder';
import CakeGallery from './components/CakeGallery';
import DietaryInfo from './components/DietaryInfo';
import OrderHistory from './components/OrderHistory';
import Cart from './components/Cart';
import { MenuItem, CustomCake, CartItem, Order, OrderStatus } from './types';
import { initialSampleOrders } from './data/sampleOrders';
import { Phone, Mail, Instagram, MapPin, MessageCircle, Edit2, ClipboardList } from 'lucide-react';
import { cleanWhatsAppNumber } from './components/Cart';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Persistent local storage for the bakery WhatsApp number
  const [bakeryPhone, setBakeryPhone] = useState<string>(() => {
    try {
      return localStorage.getItem('lamour_bakery_whatsapp') || '15550199000';
    } catch {
      return '15550199000';
    }
  });
  const [isEditingFooterPhone, setIsEditingFooterPhone] = useState(false);
  const [tempFooterPhone, setTempFooterPhone] = useState(bakeryPhone);

  const handleUpdateBakeryPhone = (num: string) => {
    const cleaned = cleanWhatsAppNumber(num);
    if (cleaned) {
      setBakeryPhone(cleaned);
      try {
        localStorage.setItem('lamour_bakery_whatsapp', cleaned);
      } catch {}
    }
  };

  // Persistent local storage for the cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lamour_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent local storage for order history (Owner tracking)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lamour_order_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialSampleOrders;
    } catch {
      return initialSampleOrders;
    }
  });

  // Track pre-populated custom cake designs
  const [prepopulatedCake, setPrepopulatedCake] = useState<Partial<CustomCake> | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('lamour_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('lamour_order_history', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const handleAddToCart = (menuItem: MenuItem, quantity: number) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.type === 'menu' && item.menuItem?.id === menuItem.id);
      if (existing) {
        return prevItems.map((item) => 
          item.type === 'menu' && item.menuItem?.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { id: `menu-${menuItem.id}`, type: 'menu', menuItem, quantity }];
    });
  };

  const handleAddCustomCake = (customCake: CustomCake) => {
    setCartItems((prevItems) => {
      // Each custom cake is unique due to potential writing or toppings configurations
      const uniqueId = `custom-${Date.now()}`;
      return [...prevItems, { id: uniqueId, type: 'custom', customCake, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prevItems) => 
      prevItems.map((item) => item.id === id ? { ...item, quantity: newQty } : item)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Redirects and sets prepopulated options in the cake builder
  const handleOrderPreset = (preset: Partial<CustomCake>) => {
    setPrepopulatedCake(preset);
    setActiveTab('builder');
  };

  // Order history management handlers
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleUpdateStaffNotes = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, staffNotes: notes } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleAddSampleOrder = () => {
    const sampleNames = ['Clara Oswald', 'David Tennant', 'Amelia Pond', 'Rory Williams', 'River Song', 'Sarah Jane'];
    const sampleFlavors = ['Belgian Chocolate Fudge', 'Lemon Zest & Elderflower', 'Vanilla Bean Infusion', 'Carrot & Walnut Spice', 'Matcha Green Tea & Pistachio'];
    const sampleFillings = ['Passionfruit Curd', 'Raspberry Reduction Coulis', 'Salted Caramel Silk', 'White Chocolate Mousseline'];
    const sampleFrostings = ['Swiss Meringue Buttercream', 'Semi-Naked Rustic Crumb', 'Velvet Cocoa Ganache'];
    const sampleColors = [
      { name: 'Eucalyptus Sage', hex: '#A3B18A' },
      { name: 'Warm Ivory Cream', hex: '#FDFBF7' },
      { name: 'Terracotta Rust', hex: '#D08C6A' },
      { name: 'Lavender Haze', hex: '#E2E8F0' },
    ];
    const sampleToppingsPool = ['French Macarons Assortment', 'Fresh Berries', 'Edible 24k Gold Leaf Flakes', 'Parchment Wafer Butterflies'];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomFlavor = sampleFlavors[Math.floor(Math.random() * sampleFlavors.length)];
    const randomFilling = sampleFillings[Math.floor(Math.random() * sampleFillings.length)];
    const randomFrosting = sampleFrostings[Math.floor(Math.random() * sampleFrostings.length)];
    const randomColor = sampleColors[Math.floor(Math.random() * sampleColors.length)];
    const randomToppings = [sampleToppingsPool[Math.floor(Math.random() * sampleToppingsPool.length)]];
    const randomPhone = `1${Math.floor(2000000000 + Math.random() * 8000000000)}`;
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const isDelivery = Math.random() > 0.5;
    const deliveryFee = isDelivery ? 10.00 : 0.00;
    const cakePrice = 86.00;
    const subtotal = cakePrice;
    const tax = subtotal * 0.08;
    const grandTotal = subtotal + deliveryFee + tax;

    const generatedOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: randomName,
      customerPhone: randomPhone,
      fulfillment: isDelivery ? 'delivery' : 'pickup',
      deliveryAddress: isDelivery ? '142 Orchard Lane, Kensington Heights' : undefined,
      requestedDate: '2026-09-17',
      requestedTime: '11:00 AM',
      specialNotes: 'Please provide candle set and decorative box ribbon.',
      items: [
        {
          id: `sim-cake-${Date.now()}`,
          type: 'custom',
          name: 'Custom Celebration Cake (8-inch)',
          quantity: 1,
          unitPrice: cakePrice,
          totalPrice: cakePrice,
          details: {
            size: '8-inch (Serves 10-14)',
            flavor: randomFlavor,
            filling: randomFilling,
            frosting: randomFrosting,
            color: randomColor.name,
            colorHex: randomColor.hex,
            toppings: randomToppings,
            writing: `Best Wishes ${randomName.split(' ')[0]}!`
          },
          image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=400'
        }
      ],
      subtotal,
      deliveryFee,
      tax,
      grandTotal,
      status: 'new',
      staffNotes: 'Newly simulated order for kitchen dashboard testing.'
    };

    setOrders((prev) => [generatedOrder, ...prev]);
  };

  const handleResetSamples = () => {
    setOrders(initialSampleOrders);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'new' || o.status === 'baking').length;

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans">
      
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={totalCartCount}
        ordersCount={activeOrdersCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Primary Content Container */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomeSection setActiveTab={setActiveTab} />
        )}
        {activeTab === 'menu' && (
          <MenuSection onAddToCart={handleAddToCart} />
        )}
        {activeTab === 'builder' && (
          <CakeBuilder 
            onAddCustomCake={handleAddCustomCake} 
            prepopulatedCake={prepopulatedCake}
            onClearPrepopulated={() => setPrepopulatedCake(null)}
            openCart={() => setIsCartOpen(true)}
          />
        )}
        {activeTab === 'gallery' && (
          <CakeGallery onOrderPreset={handleOrderPreset} />
        )}
        {activeTab === 'dietary' && (
          <DietaryInfo />
        )}
        {activeTab === 'orders' && (
          <OrderHistory
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateStaffNotes={handleUpdateStaffNotes}
            onDeleteOrder={handleDeleteOrder}
            onAddSampleOrder={handleAddSampleOrder}
            onResetSamples={handleResetSamples}
          />
        )}
      </main>

      {/* Shopping Cart Side Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        bakeryPhone={bakeryPhone}
        onUpdateBakeryPhone={handleUpdateBakeryPhone}
        onPlaceOrder={handlePlaceOrder}
        onOpenOrderHistory={() => {
          setIsCartOpen(false);
          setActiveTab('orders');
        }}
      />

      {/* Elegant Editorial Footer */}
      <footer className="bg-stone-50 border-t border-amber-100 py-12 text-stone-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div>
                <span className="font-serif text-lg font-bold text-amber-950 tracking-tight block">L’Amour Bakery</span>
                <span className="text-[9px] font-mono tracking-widest text-amber-600 uppercase font-semibold">Artisanal & Bespoke Cakes</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Celebrating inclusive flour-crafting and elegant custom cakes with absolute recipe transparency.
              </p>
              <div className="flex gap-3 text-amber-800">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-950 transition-colors" title="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="mailto:hello@lamourbakery.com" className="hover:text-amber-950 transition-colors" title="Email">
                  <Mail className="h-4 w-4" />
                </a>
                <a 
                  href={`https://wa.me/${cleanWhatsAppNumber(bakeryPhone)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1"
                  title="WhatsApp Direct Chat"
                >
                  <MessageCircle className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-900 block">Bakery Sections</span>
              <ul className="space-y-2 text-xs text-stone-600 font-medium">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-950 transition-colors cursor-pointer text-left">Home & Story</button></li>
                <li><button onClick={() => setActiveTab('menu')} className="hover:text-amber-950 transition-colors cursor-pointer text-left">The Daily Menu</button></li>
                <li><button onClick={() => setActiveTab('builder')} className="hover:text-amber-950 transition-colors cursor-pointer text-left">Custom Cake Lab</button></li>
                <li><button onClick={() => setActiveTab('gallery')} className="hover:text-amber-950 transition-colors cursor-pointer text-left">Cake Gallery Portfolio</button></li>
                <li><button onClick={() => setActiveTab('dietary')} className="hover:text-amber-950 transition-colors cursor-pointer text-left">Dietary Integrity</button></li>
                <li className="pt-1 border-t border-amber-200/50">
                  <button 
                    onClick={() => setActiveTab('orders')} 
                    className="text-amber-800 hover:text-amber-950 font-semibold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Owner Order History</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-200/80 text-amber-950 rounded-full font-bold">
                      {orders.length}
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Consultations */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-900 block">Orders & WhatsApp</span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Orders and consultations route directly via WhatsApp Click-to-Chat:
              </p>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <a 
                    href={`https://wa.me/${cleanWhatsAppNumber(bakeryPhone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                    +{cleanWhatsAppNumber(bakeryPhone)}
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingFooterPhone(!isEditingFooterPhone);
                      setTempFooterPhone(bakeryPhone);
                    }}
                    className="text-[10px] text-amber-800 hover:text-amber-950 flex items-center gap-0.5 underline cursor-pointer"
                  >
                    <Edit2 className="h-2.5 w-2.5" />
                    {isEditingFooterPhone ? 'Cancel' : 'Change'}
                  </button>
                </div>

                {isEditingFooterPhone && (
                  <div className="p-2 bg-white rounded-lg border border-amber-200 shadow-xs space-y-1.5 animate-in fade-in">
                    <span className="text-[10px] text-stone-500 block">Enter real WhatsApp phone (with country code):</span>
                    <input
                      type="tel"
                      value={tempFooterPhone}
                      onChange={(e) => setTempFooterPhone(e.target.value)}
                      placeholder="e.g. 14155552671"
                      className="w-full px-2 py-1 text-xs font-mono border border-stone-300 rounded outline-none focus:border-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateBakeryPhone(tempFooterPhone);
                        setIsEditingFooterPhone(false);
                      }}
                      className="px-2 py-0.5 bg-amber-800 hover:bg-amber-900 text-white rounded text-[10px] font-bold cursor-pointer"
                    >
                      Save Number
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Column 4: Location Badge */}
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-900 block">Our Craft Kitchen</span>
              <div className="space-y-2 text-xs text-stone-500 leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>428 Artisanal Row, Sourdough Commons, Suite B</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono italic">
                  Licensed commercial craft bakery & allergen-isolated workspace.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 font-medium">
            <p>© 2026 L’Amour Bakery Shop. All rights reserved.</p>
            <div className="flex gap-4 mt-2 sm:mt-0 font-semibold text-stone-500">
              <a href="#privacy" className="hover:text-amber-950">Privacy</a>
              <a href="#terms" className="hover:text-amber-950">Terms of Service</a>
              <a href="#contact" className="hover:text-amber-950">Allergen Declarations</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
