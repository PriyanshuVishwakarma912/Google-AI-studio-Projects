import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Info, ChevronDown, ChevronUp, ShoppingBag, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<string[]>([]);
  const [expandedIngredients, setExpandedIngredients] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Bakery' },
    { id: 'pastry', label: 'Pastries & Tarts' },
    { id: 'bread', label: 'Artisanal Bread' },
    { id: 'cake', label: 'Cakes (By Slices)' },
    { id: 'cookie', label: 'Gourmet Cookies' },
    { id: 'savory', label: 'Savory Delights' },
  ];

  const dietaryOptions = [
    { id: 'gluten-free', label: 'Gluten-Free', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { id: 'vegan', label: 'Vegan', color: 'bg-green-50 text-green-800 border-green-200' },
    { id: 'dairy-free', label: 'Dairy-Free', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'nut-free', label: 'Nut-Free', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  ];

  const handleDietaryToggle = (filterId: string) => {
    if (activeDietaryFilters.includes(filterId)) {
      setActiveDietaryFilters(activeDietaryFilters.filter(id => id !== filterId));
    } else {
      setActiveDietaryFilters([...activeDietaryFilters, filterId]);
    }
  };

  const handleQuantityChange = (itemId: string, val: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, val)
    }));
  };

  const triggerAddToCart = (item: MenuItem) => {
    const qty = quantities[item.id] || 1;
    onAddToCart(item, qty);
    
    // Show success animation
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
    }, 1500);

    // Reset quantity
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  // Filter Items
  const filteredItems = MENU_ITEMS.filter((item) => {
    // Search match
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category match
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    // Dietary match (all selected filters must be met)
    const matchesDietary = activeDietaryFilters.every(filter => 
      item.dietary.includes(filter as any)
    );

    return matchesSearch && matchesCategory && matchesDietary;
  });

  return (
    <div className="py-10 bg-amber-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-2">Our Freshly Baked Catalog</span>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-amber-950 mb-4">
            The Daily Menu
          </h1>
          <p className="text-amber-800/80 text-sm md:text-base leading-relaxed">
            Everything we bake is made from scratch in-house using organic stone-ground flours, local farm-fresh eggs, and cold-pressed butter. Filter by dietary preference below.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl shadow-xs border border-amber-100 p-4 md:p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search croissants, sourdough, ingredients..."
                className="w-full pl-11 pr-4 py-2.5 bg-amber-50/40 hover:bg-amber-50/80 focus:bg-white border border-amber-100 focus:border-amber-500 rounded-xl outline-none text-sm text-amber-950 transition-all placeholder:text-amber-700/50"
              />
            </div>

            {/* Category Chips Scroller */}
            <div className="w-full overflow-x-auto flex gap-1.5 pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-amber-50/60 text-amber-900 hover:bg-amber-100/70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Filters Toggle panel */}
          <div className="border-t border-amber-50/80 pt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-amber-800/80 flex items-center gap-1.5 mr-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-700" />
              Dietary Filters:
            </span>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((opt) => {
                const isActive = activeDietaryFilters.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleDietaryToggle(opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                        : 'bg-white hover:bg-amber-50/30 text-amber-900 border-amber-100'
                    }`}
                  >
                    {isActive && <Check className="h-3 w-3" />}
                    {opt.label}
                  </button>
                );
              })}
              {activeDietaryFilters.length > 0 && (
                <button
                  onClick={() => setActiveDietaryFilters([])}
                  className="text-xs text-amber-700 hover:text-amber-950 underline font-medium cursor-pointer ml-2"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-20 bg-white rounded-2xl border border-dashed border-amber-200"
            >
              <Info className="h-10 w-10 text-amber-600/50 mx-auto mb-3" />
              <p className="text-amber-900 font-serif text-lg">No baked items match your selection</p>
              <p className="text-amber-700/60 text-sm mt-1">Try resetting your search query or dietary filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setActiveDietaryFilters([]);
                }}
                className="mt-4 px-4 py-2 bg-amber-800 text-white text-xs font-medium rounded-xl hover:bg-amber-950 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-xs hover:shadow-md transition-all flex flex-col group h-full"
                >
                  {/* Item Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-amber-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Dietary Tags Overlay */}
                    {item.dietary.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {item.dietary.map((diet) => {
                          const config = dietaryOptions.find(o => o.id === diet);
                          return (
                            <span
                              key={diet}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wide font-bold uppercase border shadow-xs ${
                                config ? config.color : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {diet === 'gluten-free' ? 'GF' : diet.toUpperCase()}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Price Tag overlay */}
                    <div className="absolute bottom-3 right-3 bg-amber-950/85 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-mono font-bold border border-amber-400/25">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-2">
                      <span className="text-[10px] font-mono font-bold text-amber-600 tracking-widest uppercase block mb-1">
                        {item.category}
                      </span>
                      <h3 className="font-serif text-lg font-semibold text-amber-950 group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-amber-900/80 text-xs md:text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                      {item.description}
                    </p>

                    {/* Ingredients Disclosure */}
                    <div className="border-t border-amber-50 pt-3 mt-auto">
                      <button
                        onClick={() => setExpandedIngredients(expandedIngredients === item.id ? null : item.id)}
                        className="w-full flex justify-between items-center text-xs text-amber-800 hover:text-amber-950 transition-colors cursor-pointer py-1 font-medium"
                      >
                        <span className="flex items-center gap-1">
                          <Info className="h-3.5 w-3.5 text-amber-600/80" />
                          {expandedIngredients === item.id ? 'Hide Ingredients' : 'Show Ingredients'}
                        </span>
                        {expandedIngredients === item.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {expandedIngredients === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100/50"
                          >
                            <p className="text-[11px] text-amber-900 leading-relaxed">
                              <span className="font-mono font-bold text-amber-800 uppercase block mb-1 text-[9px] tracking-wider">Contains:</span>
                              {item.ingredients.join(', ')}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-50">
                      <div className="flex items-center border border-amber-100 rounded-lg bg-amber-50/30">
                        <button
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                          className="px-2.5 py-1.5 text-amber-800 hover:text-amber-950 cursor-pointer text-xs"
                        >
                          -
                        </button>
                        <span className="px-1 text-xs font-mono font-bold text-amber-950 min-w-6 text-center">
                          {quantities[item.id] || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                          className="px-2.5 py-1.5 text-amber-800 hover:text-amber-950 cursor-pointer text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => triggerAddToCart(item)}
                        disabled={addedItems[item.id]}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                          addedItems[item.id]
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                            : 'bg-amber-800 border-amber-800 text-white hover:bg-amber-950 hover:border-amber-950'
                        }`}
                      >
                        {addedItems[item.id] ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Add to Order
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
