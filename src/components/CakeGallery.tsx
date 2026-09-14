import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, ArrowRight, X, ChevronRight, Check } from 'lucide-react';
import { GalleryItem, CustomCake } from '../types';
import { GALLERY_ITEMS } from '../data/menu';

interface CakeGalleryProps {
  onOrderPreset: (preset: Partial<CustomCake>) => void;
}

export default function CakeGallery({ onOrderPreset }: CakeGalleryProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCake, setSelectedCake] = useState<GalleryItem | null>(null);

  const filters = ['All', 'Wedding', 'Birthday', 'Celebration', 'Rustic', 'Whimsical'];

  const filteredCakes = GALLERY_ITEMS.filter((item) => {
    if (activeFilter === 'All') return true;
    return item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleOrderSimilar = (cake: GalleryItem) => {
    // Map Gallery item specs to our CustomCake parameters for prepopulation
    let mappedFlavor = 'Vanilla Bean';
    if (cake.specs.flavor.includes('Chocolate')) mappedFlavor = 'Rich Chocolate';
    else if (cake.specs.flavor.includes('Red Velvet')) mappedFlavor = 'Red Velvet';
    else if (cake.specs.flavor.includes('Lemon')) mappedFlavor = 'Lemon Poppy';
    else if (cake.specs.flavor.includes('Matcha')) mappedFlavor = 'Matcha Green Tea';

    let mappedFilling = 'Swiss Buttercream';
    if (cake.specs.filling.includes('Strawberry')) mappedFilling = 'Strawberry Compote';
    else if (cake.specs.filling.includes('Chocolate') || cake.specs.filling.includes('Ganache')) mappedFilling = 'Chocolate Ganache';
    else if (cake.specs.filling.includes('Lemon') || cake.specs.filling.includes('Curd')) mappedFilling = 'Lemon Curd';
    else if (cake.specs.filling.includes('Caramel')) mappedFilling = 'Salted Caramel';

    let mappedStyle = 'Classic Smooth';
    if (cake.specs.frosting.includes('Naked')) mappedStyle = 'Semi-Naked';
    else if (cake.specs.frosting.includes('Textured') || cake.specs.frosting.includes('Concrete')) mappedStyle = 'Textured Knife';
    else if (cake.specs.frosting.includes('Scallop') || cake.specs.frosting.includes('Piping')) mappedStyle = 'Scallop Piping';

    let mappedColor = 'Creamy White';
    if (cake.title.includes('Bloom') || cake.title.includes('Cloud')) mappedColor = 'Soft Pastel Pink';
    else if (cake.title.includes('Sage') || cake.specs.frosting.includes('sage')) mappedColor = 'Artisanal Sage Green';
    else if (cake.title.includes('Concrete')) mappedColor = 'Luxe Charcoal Gray';

    // Map toppings
    const mappedToppings: string[] = [];
    if (cake.specs.toppings.some(t => t.toLowerCase().includes('berry') || t.toLowerCase().includes('berries') || t.toLowerCase().includes('blueberry') || t.toLowerCase().includes('blueberries'))) {
      mappedToppings.push('Fresh Berries');
    }
    if (cake.specs.toppings.some(t => t.toLowerCase().includes('gold') || t.toLowerCase().includes('leaf') || t.toLowerCase().includes('foil'))) {
      mappedToppings.push('Edible Gold Foil');
    }
    if (cake.specs.toppings.some(t => t.toLowerCase().includes('flower') || t.toLowerCase().includes('botanical') || t.toLowerCase().includes('lavender') || t.toLowerCase().includes('rose'))) {
      mappedToppings.push('Pressed Wildflowers');
    }
    if (cake.specs.toppings.some(t => t.toLowerCase().includes('drip') || t.toLowerCase().includes('chocolate drip'))) {
      mappedToppings.push('Chocolate Drip');
    }
    if (cake.specs.toppings.some(t => t.toLowerCase().includes('macaron') || t.toLowerCase().includes('macarons'))) {
      mappedToppings.push('Pastel Macarons');
    }
    if (cake.specs.toppings.some(t => t.toLowerCase().includes('piping') || t.toLowerCase().includes('border') || t.toLowerCase().includes('star'))) {
      mappedToppings.push('Scalloped Piping Stars');
    }

    const presetConfig: Partial<CustomCake> = {
      size: cake.specs.size.includes('2-Tier') ? '2-Tier' : '8-inch',
      flavor: mappedFlavor,
      filling: mappedFilling,
      frosting: mappedStyle,
      color: mappedColor,
      toppings: mappedToppings,
      totalPrice: cake.priceEstimate,
      writing: '',
    };

    setSelectedCake(null); // close modal if open
    onOrderPreset(presetConfig);
  };

  return (
    <div className="py-10 bg-amber-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-2">Exquisite Portfolios</span>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-amber-950 mb-3">
            Custom Cake Gallery
          </h1>
          <p className="text-amber-800/80 text-sm md:text-base leading-relaxed">
            Glance through some of our proudest bespoke masterpieces. Every single design below can be selected and customized further in our cake lab.
          </p>
        </div>

        {/* Filter Scroll bar */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="bg-white border border-amber-100 p-1.5 rounded-2xl flex gap-1 shadow-xs">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  activeFilter === f
                    ? 'bg-amber-800 text-white shadow-xs font-semibold'
                    : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-50/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCakes.map((cake) => (
            <motion.div
              layout
              key={cake.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-xs hover:shadow-md transition-all group flex flex-col h-full"
            >
              {/* Image box */}
              <div className="relative h-72 w-full overflow-hidden bg-amber-50">
                <img
                  src={cake.image}
                  alt={cake.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay details */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-mono tracking-wider font-bold text-amber-900 border border-amber-100 uppercase">
                  {cake.category}
                </div>

                <div className="absolute bottom-3 left-3 bg-amber-950/90 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border border-amber-400/20">
                  Est: ${cake.priceEstimate.toFixed(2)}
                </div>

                {/* Hover Quick Eye overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedCake(cake)}
                    className="p-3 bg-white text-amber-950 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Eye className="h-4.5 w-4.5" />
                    Inspect Details
                  </button>
                </div>
              </div>

              {/* Title Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
                    {cake.title}
                  </h3>
                  <p className="text-amber-900/80 text-xs md:text-sm mt-1.5 leading-relaxed line-clamp-2">
                    {cake.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-amber-50 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCake(cake)}
                    className="text-xs text-amber-700 hover:text-amber-950 font-medium cursor-pointer"
                  >
                    View Recipe Specs
                  </button>
                  <button
                    onClick={() => handleOrderSimilar(cake)}
                    className="py-1.5 px-3.5 bg-amber-50 text-amber-900 hover:bg-amber-800 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer border border-amber-100"
                  >
                    Order Similar
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Inspection Modal Overlay */}
        <AnimatePresence>
          {selectedCake && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCake(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              ></motion.div>

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-xl border border-amber-100 relative z-10 flex flex-col md:flex-row h-auto max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCake(null)}
                  className="absolute top-4 right-4 z-20 p-1.5 bg-white/80 rounded-full hover:bg-white text-stone-700 shadow-md cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Left: Image */}
                <div className="md:w-1/2 h-48 md:h-auto bg-amber-50 relative">
                  <img
                    src={selectedCake.image}
                    alt={selectedCake.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right: Content */}
                <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-amber-600 uppercase">
                        {selectedCake.category} Design
                      </span>
                      <h2 className="font-serif text-xl font-bold text-amber-950 mt-0.5">
                        {selectedCake.title}
                      </h2>
                    </div>

                    <p className="text-amber-900/80 text-xs md:text-sm leading-relaxed">
                      {selectedCake.description}
                    </p>

                    {/* Specifications List */}
                    <div className="space-y-2 border-t border-b border-amber-50 py-3.5">
                      <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block">Baking Specifications:</span>
                      
                      <div className="space-y-1.5 text-xs text-amber-900">
                        <div className="flex justify-between">
                          <span className="text-amber-700/80 font-medium">Size:</span>
                          <span className="font-semibold text-right">{selectedCake.specs.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700/80 font-medium">Sponge Base:</span>
                          <span className="font-semibold text-right">{selectedCake.specs.flavor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700/80 font-medium">Inner Fill:</span>
                          <span className="font-semibold text-right">{selectedCake.specs.filling}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700/80 font-medium">Frosting:</span>
                          <span className="font-semibold text-right">{selectedCake.specs.frosting}</span>
                        </div>
                        <div className="flex flex-col pt-1">
                          <span className="text-amber-700/80 font-medium">Bespoke Toppings:</span>
                          <span className="font-semibold mt-0.5 text-stone-700">{selectedCake.specs.toppings.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-amber-50 flex items-center justify-between gap-3">
                    <div>
                      <span className="block text-[9px] font-mono text-amber-600">Base Estimate</span>
                      <span className="font-mono font-bold text-lg text-amber-950">${selectedCake.priceEstimate.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handleOrderSimilar(selectedCake)}
                      className="py-2.5 px-4 bg-amber-800 text-white hover:bg-amber-950 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      Customize This Design
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
