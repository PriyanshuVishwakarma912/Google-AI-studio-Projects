import { Cake, ShoppingBag, Menu, X, Landmark, ClipboardList } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  ordersCount?: number;
  openCart: () => void;
}

export default function Navbar({ activeTab, setActiveTab, cartCount, ordersCount = 0, openCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Bakery Menu' },
    { id: 'builder', label: 'Custom Cake Builder' },
    { id: 'gallery', label: 'Cake Gallery' },
    { id: 'dietary', label: 'Dietary Info' },
    { id: 'orders', label: 'Order History', badge: ordersCount > 0 ? `${ordersCount}` : undefined },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-amber-900 focus:outline-none cursor-pointer group"
            >
              <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Cake className="h-6 w-6 text-amber-700" />
              </div>
              <div className="text-left">
                <span className="block font-serif text-xl font-bold tracking-tight text-amber-950">L’Amour Bakery</span>
                <span className="block text-[10px] font-mono tracking-widest uppercase text-amber-600 font-semibold">Artisanal & Custom</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === link.id
                    ? 'text-amber-950 bg-amber-50/80 font-semibold border-b border-amber-500 rounded-b-none'
                    : 'text-amber-800/80 hover:text-amber-950 hover:bg-amber-50/40'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                    activeTab === link.id
                      ? 'bg-amber-800 text-amber-100'
                      : 'bg-amber-200/80 text-amber-950'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Cart & Mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-amber-900 hover:text-amber-950 hover:bg-amber-50 rounded-xl transition-all cursor-pointer flex items-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5.5 w-5.5 text-amber-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 text-amber-900 hover:text-amber-950 hover:bg-amber-50 rounded-xl focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 border-b border-amber-100 animate-in fade-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === link.id
                    ? 'text-amber-950 bg-amber-50 font-semibold pl-6 border-l-4 border-amber-600'
                    : 'text-amber-800/80 hover:text-amber-950 hover:bg-amber-50/50 pl-4'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-amber-800 text-amber-100">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                openCart();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-amber-950 bg-amber-100/50 flex justify-between items-center cursor-pointer mt-2"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-amber-800" />
                View Cart
              </span>
              <span className="bg-amber-700 text-white font-mono text-xs font-semibold px-2.5 py-1 rounded-full">
                {cartCount} items
              </span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
