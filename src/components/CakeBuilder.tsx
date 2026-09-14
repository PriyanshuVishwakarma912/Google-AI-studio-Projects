import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Check, HelpCircle, RefreshCw, ArrowRight, X } from 'lucide-react';
import { CustomCake } from '../types';

interface CakeBuilderProps {
  onAddCustomCake: (cake: CustomCake) => void;
  prepopulatedCake?: Partial<CustomCake> | null;
  onClearPrepopulated?: () => void;
  openCart?: () => void;
}

const SIZES = [
  { id: '6-inch', label: '6" Petite Round', description: 'Serves 8–12. Perfect for intimate gatherings.', price: 45 },
  { id: '8-inch', label: '8" Party Round', description: 'Serves 15–20. Our most popular size.', price: 65 },
  { id: '10-inch', label: '10" Grand Round', description: 'Serves 25–30. Great for large parties.', price: 85 },
  { id: '2-Tier', label: '2-Tier (8" + 6")', description: 'Serves 30–45. Magnificent centerpiece.', price: 130 },
];

const FLAVORS = [
  { id: 'Vanilla Bean', label: 'Madagascar Vanilla Bean', description: 'Classic airy sponge with real vanilla bean flecks.', price: 0 },
  { id: 'Rich Chocolate', label: 'Belgian Chocolate Fudge', description: 'Decadent, moist sponge infused with organic cocoa.', price: 0 },
  { id: 'Red Velvet', label: 'Traditional Red Velvet', description: 'Classic velvet texture with buttermilk & hints of cocoa.', price: 0 },
  { id: 'Lemon Poppy', label: 'Lemon Zest Poppyseed', description: 'Bright zesty crumb filled with crunchy poppyseeds.', price: 5 },
  { id: 'Matcha Green Tea', label: 'Japanese Matcha', description: 'Elegant, earthy ceremonial-grade matcha tea sponge.', price: 5 },
];

const FILLINGS = [
  { id: 'Swiss Buttercream', label: 'Classic Swiss Meringue', description: 'Silky-smooth, feather-light sweetened buttercream.', price: 0 },
  { id: 'Strawberry Compote', label: 'Organic Strawberry Compote', description: 'House-simmered fresh strawberries and lime zest.', price: 5 },
  { id: 'Chocolate Ganache', label: 'Dark Chocolate Ganache', description: 'Luxurious melted Valrhona dark chocolate silk.', price: 5 },
  { id: 'Lemon Curd', label: 'Zesty Lemon Curd', description: 'Creamy, sharp, lemon-juice yellow curd filler.', price: 5 },
  { id: 'Salted Caramel', label: 'Sea Salted Caramel Praline', description: 'Rich caramelized organic sugar, butter, and pecans.', price: 5 },
];

const STYLES = [
  { id: 'Classic Smooth', label: 'Classic Smooth Cover', description: 'Sleek, pristine traditional buttercream envelope.', price: 0 },
  { id: 'Semi-Naked', label: 'Rustic Semi-Naked', description: 'Minimal scraping showing beautiful organic sponge outlines.', price: 0 },
  { id: 'Textured Knife', label: 'Concrete Palette Knife', description: 'Thick, beautiful artistic vertical plaster sweeps.', price: 5 },
  { id: 'Scallop Piping', label: 'Vintage Scallop Piping', description: 'Regal layered loops and ornate borders on top & bottom.', price: 5 },
];

const COLORS = [
  { id: 'Creamy White', label: 'Ivory White', hex: '#FAF7ED', text: 'text-amber-900 border-amber-200' },
  { id: 'Soft Pastel Pink', label: 'Blush Pink', hex: '#FAD9DB', text: 'text-rose-900 border-rose-200' },
  { id: 'Artisanal Sage Green', label: 'Sage Green', hex: '#D7E5DF', text: 'text-teal-900 border-teal-200' },
  { id: 'Whimsical Lavender', label: 'Lavender Blue', hex: '#DFE2FA', text: 'text-indigo-900 border-indigo-200' },
  { id: 'Luxe Charcoal Gray', label: 'Velvet Charcoal', hex: '#4A4C52', text: 'text-stone-100 border-stone-800' },
  { id: 'Warm Peach', label: 'Warm Peach', hex: '#FAD8C3', text: 'text-orange-950 border-orange-200' },
];

const TOPPINGS = [
  { id: 'Fresh Berries', label: 'Fresh Forest Berries', description: 'Raspberries, blueberries & strawberries stacked high.', price: 6 },
  { id: 'Edible Gold Foil', label: '24k Edible Gold Leaf', description: 'Hand-applied sparkling metallic luxury accents.', price: 8 },
  { id: 'Pressed Wildflowers', label: 'Organic Pressed Flowers', description: 'Dainty handpicked edible chamomile, marigold & pansies.', price: 6 },
  { id: 'Chocolate Drip', label: 'Chocolate Ganache Drip', description: 'Luxe chocolate or caramel glaze dripping down the edges.', price: 5 },
  { id: 'Pastel Macarons', label: 'French Almond Macarons', description: 'Four matching, delicate house-baked macarons.', price: 8 },
  { id: 'Scalloped Piping Stars', label: 'Stars Piping Accents', description: 'Dainty star border buttercream dollops.', price: 3 },
];

export default function CakeBuilder({ onAddCustomCake, prepopulatedCake, onClearPrepopulated, openCart }: CakeBuilderProps) {
  // Step navigation state
  const [activeStep, setActiveStep] = useState(1);
  
  // Custom Cake selections
  const [size, setSize] = useState(SIZES[1]); // Default 8"
  const [flavor, setFlavor] = useState(FLAVORS[0]);
  const [filling, setFilling] = useState(FILLINGS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [selectedToppings, setSelectedToppings] = useState<typeof TOPPINGS>([]);
  const [writing, setWriting] = useState('');
  
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [justAddedCake, setJustAddedCake] = useState<CustomCake | null>(null);

  // Monitor prepopulated cake configs from the gallery "Order Similar" click
  useEffect(() => {
    if (prepopulatedCake) {
      if (prepopulatedCake.size) {
        const matched = SIZES.find(s => prepopulatedCake.size?.includes(s.id) || s.id.includes(prepopulatedCake.size as string));
        if (matched) setSize(matched);
      }
      if (prepopulatedCake.flavor) {
        const matched = FLAVORS.find(f => f.id === prepopulatedCake.flavor);
        if (matched) setFlavor(matched);
      }
      if (prepopulatedCake.filling) {
        const matched = FILLINGS.find(fi => fi.id === prepopulatedCake.filling);
        if (matched) setFilling(matched);
      }
      if (prepopulatedCake.frosting) {
        const matched = STYLES.find(st => st.id === prepopulatedCake.frosting || prepopulatedCake.frosting?.includes(st.id));
        if (matched) setStyle(matched);
      }
      if (prepopulatedCake.color) {
        const matched = COLORS.find(c => c.id === prepopulatedCake.color);
        if (matched) setColor(matched);
      }
      if (prepopulatedCake.toppings) {
        const matchedToppings = TOPPINGS.filter(t => prepopulatedCake.toppings?.includes(t.id) || prepopulatedCake.toppings?.some(pt => pt.includes(t.id)));
        setSelectedToppings(matchedToppings);
      }
      if (prepopulatedCake.writing) {
        setWriting(prepopulatedCake.writing);
      }

      // Automatically jump to final preview step for validation
      setActiveStep(5);
    }
  }, [prepopulatedCake]);

  const toggleTopping = (topping: typeof TOPPINGS[0]) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Calculate Real-time Price
  const baseCost = size.price;
  const flavorCost = flavor.price;
  const fillingCost = filling.price;
  const styleCost = style.price;
  const toppingsCost = selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const totalCost = baseCost + flavorCost + fillingCost + styleCost + toppingsCost;

  const handleReset = () => {
    setSize(SIZES[1]);
    setFlavor(FLAVORS[0]);
    setFilling(FILLINGS[0]);
    setStyle(STYLES[0]);
    setColor(COLORS[0]);
    setSelectedToppings([]);
    setWriting('');
    setActiveStep(1);
    setAddedSuccess(false);
    if (onClearPrepopulated) onClearPrepopulated();
  };

  const handleAddToOrder = () => {
    const customCake: CustomCake = {
      size: size.id,
      basePrice: size.price,
      flavor: flavor.id,
      filling: filling.id,
      frosting: style.id,
      color: color.id,
      colorHex: color.hex,
      toppings: selectedToppings.map(t => t.label),
      writing: writing.trim(),
      totalPrice: totalCost,
    };

    onAddCustomCake(customCake);
    setJustAddedCake(customCake);
    setAddedSuccess(true);
    setShowAddedModal(true);
  };

  const isTier2 = size.id === '2-Tier';

  // Dynamic visual dimensions based on size
  const getTierDimensions = () => {
    switch (size.id) {
      case '6-inch': return { topW: 120, topH: 70, bottomW: 0, bottomH: 0 };
      case '8-inch': return { topW: 150, topH: 82, bottomW: 0, bottomH: 0 };
      case '10-inch': return { topW: 180, topH: 94, bottomW: 0, bottomH: 0 };
      case '2-Tier': return { topW: 110, topH: 58, bottomW: 170, bottomH: 74 };
      default: return { topW: 150, topH: 82, bottomW: 0, bottomH: 0 };
    }
  };

  const spongeColorUndertone = () => {
    switch (flavor.id) {
      case 'Rich Chocolate': return '#3D2314';
      case 'Red Velvet': return '#7F1D1D';
      case 'Matcha Green Tea': return '#4D7C0F';
      case 'Lemon Poppy': return '#CA8A04';
      default: return '#D97706';
    }
  };

  const dims = getTierDimensions();

  return (
    <div className="py-10 bg-amber-50/10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-2">Artisanal Customizer</span>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-amber-950 mb-3">
            Custom Cake Lab
          </h1>
          <p className="text-amber-800/80 text-sm md:text-base leading-relaxed">
            Co-design your sweet dreams. Choose every layer, flavor, frosting shade, and artisanal topping. See your cake shape up in our interactive kitchen!
          </p>

          {prepopulatedCake && (
            <div className="mt-4 inline-flex items-center gap-3 bg-amber-100/70 border border-amber-200 px-4 py-2 rounded-xl">
              <span className="text-xs text-amber-950 font-medium">Preloaded from Gallery Design!</span>
              <button 
                onClick={handleReset}
                className="text-[10px] font-mono tracking-wider font-bold bg-white text-amber-800 hover:text-amber-950 hover:bg-amber-100 px-2 py-1 rounded-md border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Reset Custom
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Lab Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Cake Canvas Preview (Sticky) */}
          <div className="lg:col-span-5 sticky top-24 bg-white border border-amber-100 rounded-3xl p-6 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6 border-b border-amber-50 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 uppercase block">Lab View</span>
                <span className="font-serif text-base font-semibold text-amber-950">Draft Design</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-mono font-semibold text-amber-600">Calculated Cost</span>
                <span className="font-mono text-2xl font-bold text-amber-950">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            {/* Interactive Visual Canvas Container */}
            <div className="w-full h-80 bg-linear-to-b from-amber-50/20 to-amber-50/80 rounded-2xl border border-amber-50/70 flex flex-col justify-end items-center pb-12 relative overflow-hidden shadow-inner">
              
              {/* Stand / Plate */}
              <div className="absolute bottom-6 w-56 h-4 bg-stone-100 rounded-full border-b-4 border-stone-300 flex justify-center items-center">
                <div className="w-20 h-4 bg-stone-200 transform translate-y-3 rounded-b-md border-x-4 border-stone-300"></div>
              </div>

              {/* Cake Tiers Container */}
              <div className="relative flex flex-col items-center select-none z-10 scale-90 sm:scale-100">
                
                {/* TOP TIER (Shows on 2-Tier or as main tier on Single) */}
                <motion.div
                  layout
                  animate={{
                    backgroundColor: color.hex,
                    width: dims.topW,
                    height: dims.topH,
                  }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                  className="rounded-t-lg relative border-b-8 border-black/10 shadow-xs flex items-center justify-center overflow-hidden"
                  style={{
                    borderStyle: style.id === 'Semi-Naked' ? 'double' : 'solid',
                    borderColor: style.id === 'Semi-Naked' ? 'rgba(139, 92, 26, 0.2)' : 'transparent',
                    boxShadow: style.id === 'Textured Knife' ? 'inset 4px 4px 0 rgba(255,255,255,0.4), inset -4px -4px 0 rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {/* Semi-Naked sponge crumb peek-through */}
                  {style.id === 'Semi-Naked' && (
                    <div className="absolute inset-x-2 inset-y-1.5 flex flex-col justify-around pointer-events-none opacity-25">
                      <div className="h-1 rounded-full w-full" style={{ backgroundColor: spongeColorUndertone() }} />
                      <div className="h-1 rounded-full w-full" style={{ backgroundColor: spongeColorUndertone() }} />
                    </div>
                  )}

                  {/* Pipings on top border if Classic Piping */}
                  {style.id === 'Scallop Piping' && (
                    <div className="absolute -top-1 left-0 right-0 h-3 flex justify-between px-1">
                      {Array.from({ length: isTier2 ? 6 : 9 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-white opacity-90 border border-stone-200 shadow-xs -translate-y-1"></div>
                      ))}
                    </div>
                  )}

                  {/* Toppings Visual overlays (Top Tier) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full flex justify-center gap-1 px-3 z-10">
                    {/* Fresh Berries visual representation */}
                    {selectedToppings.some(t => t.id === 'Fresh Berries') && (
                      <div className="flex justify-center -space-x-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-xs"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-950 shadow-xs"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-xs"></div>
                        <div className="w-3 h-3 rounded-full bg-blue-950 shadow-xs"></div>
                      </div>
                    )}
                    {/* Macarons */}
                    {selectedToppings.some(t => t.id === 'Pastel Macarons') && (
                      <div className="flex gap-1 absolute -top-4">
                        <div className="w-4 h-2.5 rounded-full bg-rose-300 border-y border-rose-400"></div>
                        <div className="w-4 h-2.5 rounded-full bg-teal-200 border-y border-teal-300"></div>
                      </div>
                    )}
                  </div>

                  {/* Chocolate Drip Visual */}
                  {selectedToppings.some(t => t.id === 'Chocolate Drip') && (
                    <div className="absolute top-0 left-0 right-0 h-4 flex justify-between px-0.5 pointer-events-none">
                      {Array.from({ length: isTier2 ? 10 : 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1.5 rounded-b-full bg-amber-950 opacity-90" 
                          style={{ height: `${8 + (i % 3) * 4}px` }}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* Wildflowers */}
                  {selectedToppings.some(t => t.id === 'Pressed Wildflowers') && (
                    <div className="absolute inset-x-2 bottom-1 flex justify-around pointer-events-none">
                      <div className="w-3 h-3 rounded-full bg-amber-300 border border-white"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-white"></div>
                      <div className="w-3 h-3 rounded-full bg-indigo-300 border border-white"></div>
                    </div>
                  )}

                  {/* Edible Gold leaf dots */}
                  {selectedToppings.some(t => t.id === 'Edible Gold Foil') && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-yellow-400 rounded-xs rotate-45 animate-pulse"></div>
                      <div className="absolute top-6 right-6 w-1 h-1 bg-yellow-400 rounded-xs rotate-12"></div>
                      <div className="absolute top-4 right-12 w-2 h-2 bg-yellow-400 rounded-xs rotate-45"></div>
                    </div>
                  )}

                  {/* Custom Cake Writing Representation */}
                  {writing && (
                    <div className="px-2 text-center pointer-events-none max-w-[90%] z-10">
                      <p className={`font-serif leading-none italic tracking-wide break-words select-none text-[8px] sm:text-[10px] ${color.id === 'Luxe Charcoal Gray' ? 'text-amber-200' : 'text-amber-900'}`}>
                        "{writing}"
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* BOTTOM TIER (Only shows if 2-Tier is selected) */}
                <AnimatePresence>
                  {isTier2 && (
                    <motion.div
                      initial={{ height: 0, width: 140, opacity: 0 }}
                      animate={{ height: dims.bottomH || 74, width: dims.bottomW || 170, opacity: 1 }}
                      exit={{ height: 0, width: 140, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                      className="rounded-t-lg relative border-b-8 border-black/10 shadow-xs mt-0.5 overflow-hidden"
                      style={{
                        backgroundColor: color.hex,
                        borderStyle: style.id === 'Semi-Naked' ? 'double' : 'solid',
                        borderColor: style.id === 'Semi-Naked' ? 'rgba(139, 92, 26, 0.2)' : 'transparent',
                        boxShadow: style.id === 'Textured Knife' ? 'inset 5px 5px 0 rgba(255,255,255,0.4), inset -5px -5px 0 rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      {/* Semi-Naked sponge crumb peek-through */}
                      {style.id === 'Semi-Naked' && (
                        <div className="absolute inset-x-2 inset-y-1.5 flex flex-col justify-around pointer-events-none opacity-25">
                          <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: spongeColorUndertone() }} />
                          <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: spongeColorUndertone() }} />
                        </div>
                      )}

                      {/* Pipings on top border if Classic Piping */}
                      {style.id === 'Scallop Piping' && (
                        <div className="absolute -top-1 left-0 right-0 h-3 flex justify-between px-1">
                          {Array.from({ length: 11 }).map((_, i) => (
                            <div key={i} className="w-3.5 h-3.5 rounded-full bg-white opacity-95 border border-stone-200 shadow-xs -translate-y-1"></div>
                          ))}
                        </div>
                      )}

                      {/* Bottom tier toppings / drip */}
                      {selectedToppings.some(t => t.id === 'Chocolate Drip') && (
                        <div className="absolute top-0 left-0 right-0 h-5 flex justify-between px-0.5 pointer-events-none">
                          {Array.from({ length: 18 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1.5 rounded-b-full bg-amber-950 opacity-90" 
                              style={{ height: `${9 + (i % 4) * 4}px` }}
                            ></div>
                          ))}
                        </div>
                      )}

                      {/* Wildflowers */}
                      {selectedToppings.some(t => t.id === 'Pressed Wildflowers') && (
                        <div className="absolute inset-x-3 bottom-2 flex justify-around pointer-events-none">
                          <div className="w-2.5 h-2.5 bg-amber-300 rounded-full border border-white"></div>
                          <div className="w-3 h-3 bg-red-400 rounded-full border border-white"></div>
                          <div className="w-2.5 h-2.5 bg-indigo-300 rounded-full border border-white"></div>
                        </div>
                      )}

                      {/* Toppings on Bottom border */}
                      {selectedToppings.some(t => t.id === 'Scalloped Piping Stars') && (
                        <div className="absolute bottom-0.5 left-0 right-0 h-2 flex justify-between px-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-amber-100 border border-stone-200/50"></div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Decorative Background sparkle */}
              <div className="absolute top-10 right-10 opacity-30 animate-pulse">
                <Sparkles className="h-8 w-8 text-amber-500" />
              </div>
            </div>

            {/* Cake Blueprint Tags */}
            <div className="w-full mt-6 space-y-2">
              <div className="flex flex-wrap gap-1.5 justify-center">
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-100 font-mono">
                  {size.id}
                </span>
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-100 font-mono">
                  {flavor.id} Sponge
                </span>
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-100 font-mono">
                  {filling.id} Filling
                </span>
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-100 font-mono">
                  {style.id}
                </span>
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-100 font-mono">
                  {color.id} Frosting
                </span>
              </div>

              {selectedToppings.length > 0 && (
                <div className="text-center">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-600 block mb-1">Loaded Artisanal Toppings:</span>
                  <p className="text-xs text-amber-800 leading-normal">
                    {selectedToppings.map(t => t.label).join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Add to Cart Actions (Always visible in Left Column) */}
            <div className="w-full mt-5 space-y-2">
              <button
                onClick={handleAddToOrder}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  addedSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-800 hover:bg-amber-950 text-white'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add Custom Cake • ${totalCost.toFixed(2)}
                  </>
                )}
              </button>

              {openCart && (
                <button
                  onClick={openCart}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-amber-700" />
                  View Current Cart & Order
                </button>
              )}

              {activeStep < 5 && (
                <button
                  onClick={() => setActiveStep(5)}
                  className="w-full text-center text-xs text-amber-800 hover:text-amber-950 font-medium py-1 cursor-pointer flex items-center justify-center gap-1"
                >
                  Review Details & Add Writing <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Quick reset/clear */}
            <button
              onClick={handleReset}
              className="mt-4 text-xs text-amber-700/60 hover:text-amber-900 underline flex items-center gap-1 cursor-pointer"
            >
              Clear selections and start over
            </button>
          </div>

          {/* RIGHT: Step-by-Step Selection Panels */}
          <div className="lg:col-span-7 bg-white border border-amber-100 rounded-3xl p-6 shadow-xs">
            
            {/* Steps Progress Tabs */}
            <div className="flex justify-between items-center mb-8 border-b border-amber-50 pb-4 overflow-x-auto scrollbar-none">
              {[
                { step: 1, label: '1. Foundation' },
                { step: 2, label: '2. Flavor Core' },
                { step: 3, label: '3. Dress' },
                { step: 4, label: '4. Toppings' },
                { step: 5, label: '5. Writing & Order' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`pb-2 border-b-2 font-medium text-xs md:text-sm transition-all whitespace-nowrap cursor-pointer px-1 mr-4 ${
                    activeStep === s.step
                      ? 'border-amber-700 text-amber-950 font-semibold'
                      : 'border-transparent text-amber-700/50 hover:text-amber-950'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* STEP 1: Foundation (Sizes & Tiers) */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-amber-950">Select Your Cake Size & Tiers</h3>
                  <p className="text-amber-800/70 text-xs mt-1">Determine the size of your cake based on the guest capacity of your celebration.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {SIZES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSize(s)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-36 ${
                        size.id === s.id
                          ? 'border-amber-700 bg-amber-50/30 ring-2 ring-amber-700/10'
                          : 'border-amber-100 hover:border-amber-400 hover:bg-amber-50/10'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-serif font-semibold text-amber-950 text-sm md:text-base">{s.label}</span>
                          {size.id === s.id && <Check className="h-4.5 w-4.5 text-amber-700 stroke-[3]" />}
                        </div>
                        <p className="text-amber-800/80 text-xs mt-1.5 line-clamp-2 leading-relaxed">{s.description}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-950 bg-white border border-amber-100 px-2.5 py-1 rounded-lg w-max mt-2">
                        Base: ${s.price}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveStep(2)}
                  className="w-full mt-4 py-3 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Continue to Flavor Core & Fillings <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* STEP 2: Flavor Core (Sponge & Fillings) */}
            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-200">
                {/* Sponge Flavor */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-amber-950">Select Sponge Flavor</h3>
                    <p className="text-amber-800/70 text-xs mt-1">All sponges are baked with certified organic ingredients from local flour mills.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FLAVORS.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFlavor(f)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          flavor.id === f.id
                            ? 'border-amber-700 bg-amber-50/30'
                            : 'border-amber-100 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-serif font-medium text-sm text-amber-950 block">{f.label}</span>
                            <span className="text-amber-800/70 text-xs leading-normal mt-0.5 block">{f.description}</span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                            {f.price === 0 ? 'Free' : `+$${f.price}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filling Cream */}
                <div className="space-y-3 border-t border-amber-50 pt-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-amber-950">Select Inner Core Filling</h3>
                    <p className="text-amber-800/70 text-xs mt-1">The gourmet layer applied between each sponge layer.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FILLINGS.map((fi) => (
                      <button
                        key={fi.id}
                        onClick={() => setFilling(fi)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          filling.id === fi.id
                            ? 'border-amber-700 bg-amber-50/30'
                            : 'border-amber-100 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-serif font-medium text-sm text-amber-950 block">{fi.label}</span>
                            <span className="text-amber-800/70 text-xs leading-normal mt-0.5 block">{fi.description}</span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                            {fi.price === 0 ? 'Free' : `+$${fi.price}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveStep(3)}
                  className="w-full mt-4 py-3 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Continue to Frosting Dress & Palette <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* STEP 3: Dress (Frosting Style & Colors) */}
            {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-200">
                {/* Frosting Styles */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-amber-950">Select Frosting Outer Cover</h3>
                    <p className="text-amber-800/70 text-xs mt-1">Choose how the buttercream envelope is textured on your cake.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {STYLES.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setStyle(st)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          style.id === st.id
                            ? 'border-amber-700 bg-amber-50/30'
                            : 'border-amber-100 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-serif font-medium text-sm text-amber-950 block">{st.label}</span>
                            <span className="text-amber-800/70 text-xs leading-normal mt-0.5 block">{st.description}</span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                            {st.price === 0 ? 'Free' : `+$${st.price}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frosting Color Palette */}
                <div className="space-y-3 border-t border-amber-50 pt-5">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-amber-950">Select Buttercream Color Palette</h3>
                    <p className="text-amber-800/70 text-xs mt-1">We use organic plant-based fruit and vegetable powders for high-end colorings.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setColor(c)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center gap-2 ${
                          color.id === c.id
                            ? 'border-amber-700 bg-amber-50/20'
                            : 'border-amber-100 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: c.hex }}
                        ></div>
                        <div className="text-left">
                          <span className="block text-[11px] font-semibold text-amber-950 text-center">{c.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveStep(4)}
                  className="w-full mt-4 py-3 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Continue to Artisanal Toppings <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* STEP 4: Toppings (Multi-select) */}
            {activeStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-200">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-amber-950">Artisanal Toppings Selection</h3>
                  <p className="text-amber-800/70 text-xs mt-1">Customize with handcraft components. You can choose multiple toppings to load on top or cascade.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
                  {TOPPINGS.map((t) => {
                    const isSelected = selectedToppings.some(st => st.id === t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => toggleTopping(t)}
                        className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between gap-3 ${
                          isSelected
                            ? 'border-amber-700 bg-amber-50/20 shadow-xs'
                            : 'border-amber-100 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => {}} // handled by button click
                              className="accent-amber-800 h-3.5 w-3.5 rounded-sm shrink-0 cursor-pointer pointer-events-none" 
                            />
                            <span className="font-serif font-medium text-sm text-amber-950">{t.label}</span>
                          </div>
                          <p className="text-amber-800/70 text-xs leading-normal mt-1.5 line-clamp-2">{t.description}</p>
                        </div>
                        <span className="font-mono text-xs font-semibold text-amber-900 bg-amber-50/70 px-2 py-1 h-fit rounded-lg border border-amber-100 shrink-0">
                          +${t.price}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveStep(5)}
                  className="w-full mt-4 py-3 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Continue to Piping Writing & Review <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* STEP 5: Piping Writing & Add to Cart */}
            {activeStep === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-200">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-amber-950">Piping Calligraphy Message</h3>
                    <p className="text-amber-800/70 text-xs mt-1">Optional. We will pipe elegant buttercream writing in cursive on top of the cake (max 35 characters).</p>
                  </div>
                  
                  <input
                    type="text"
                    value={writing}
                    onChange={(e) => setWriting(e.target.value.slice(0, 35))}
                    placeholder="e.g., Happy Birthday Chloe!"
                    className="w-full px-4 py-3 bg-amber-50/40 border border-amber-100 focus:bg-white focus:border-amber-500 rounded-xl outline-none text-sm text-amber-950 transition-all placeholder:text-amber-700/50"
                  />
                  <div className="text-right text-[10px] font-mono text-amber-700/60 font-semibold">
                    {writing.length} / 35 characters
                  </div>
                </div>

                {/* Order Summary Box */}
                <div className="bg-amber-50/30 rounded-2xl border border-amber-100 p-5 space-y-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-700 tracking-wider block">Custom Build Blueprint:</span>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-xs md:text-sm border-b border-amber-100 pb-3">
                    <div>
                      <span className="text-amber-800/70 text-xs block">Foundation:</span>
                      <span className="font-medium text-amber-950">{size.label} (${size.price})</span>
                    </div>
                    <div>
                      <span className="text-amber-800/70 text-xs block">Sponge flavor:</span>
                      <span className="font-medium text-amber-950">{flavor.label} ({flavor.price === 0 ? 'Free' : `+$${flavor.price}`})</span>
                    </div>
                    <div>
                      <span className="text-amber-800/70 text-xs block">Inner core cream:</span>
                      <span className="font-medium text-amber-950">{filling.label} ({filling.price === 0 ? 'Free' : `+$${filling.price}`})</span>
                    </div>
                    <div>
                      <span className="text-amber-800/70 text-xs block">Frosting style:</span>
                      <span className="font-medium text-amber-950">{style.label} ({style.price === 0 ? 'Free' : `+$${style.price}`})</span>
                    </div>
                  </div>

                  <div className="text-xs md:text-sm space-y-1.5 border-b border-amber-100 pb-3">
                    <span className="text-amber-800/70 text-xs block">Outer coloring:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.hex }}></div>
                      <span className="font-medium text-amber-950">{color.label} (Plant-based)</span>
                    </div>
                  </div>

                  {selectedToppings.length > 0 && (
                    <div className="text-xs md:text-sm border-b border-amber-100 pb-3">
                      <span className="text-amber-800/70 text-xs block">Toppings (Total +${toppingsCost}):</span>
                      <span className="font-medium text-amber-950">{selectedToppings.map(t => t.label).join(', ')}</span>
                    </div>
                  )}

                  {writing && (
                    <div className="text-xs md:text-sm border-b border-amber-100 pb-3">
                      <span className="text-amber-800/70 text-xs block">Custom written lettering:</span>
                      <span className="font-serif italic font-semibold text-amber-950">"{writing}"</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-serif font-bold text-amber-950 text-base">Grand Total Estimate:</span>
                    <span className="font-mono text-xl font-bold text-amber-950">${totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <button
                  onClick={handleAddToOrder}
                  disabled={addedSuccess}
                  className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                    addedSuccess
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                      : 'bg-amber-800 border-amber-800 text-white hover:bg-amber-950 hover:border-amber-950 shadow-sm'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="h-5 w-5 stroke-[3] text-emerald-600" />
                      Custom Cake added to cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Add Custom Cake to Order
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Pagination Controls Footer */}
            <div className="flex justify-between items-center mt-8 border-t border-amber-50 pt-5">
              <button
                disabled={activeStep === 1}
                onClick={() => setActiveStep(activeStep - 1)}
                className={`px-4 py-2 border border-amber-100 rounded-xl text-xs font-semibold text-amber-800 hover:text-amber-950 hover:bg-amber-50/50 cursor-pointer transition-colors ${
                  activeStep === 1 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Previous Step
              </button>
              
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(stNum => (
                  <div 
                    key={stNum} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeStep === stNum ? 'w-4 bg-amber-700' : 'bg-amber-100'}`}
                  ></div>
                ))}
              </div>

              {activeStep < 5 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-950 transition-all cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  disabled={addedSuccess}
                  onClick={handleAddToOrder}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-950 transition-all cursor-pointer"
                >
                  Finish & Add
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Added to Cart Success Modal */}
      <AnimatePresence>
        {showAddedModal && justAddedCake && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-100 relative"
            >
              <button
                onClick={() => setShowAddedModal(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-amber-950 mb-1">
                  Custom Cake Added!
                </h3>
                <p className="text-xs text-amber-800/80 mb-5">
                  Your artisanal creation is now in your order cart ready for WhatsApp checkout.
                </p>

                {/* Cake Summary Box */}
                <div className="bg-amber-50/50 rounded-2xl p-4 text-left border border-amber-100 text-xs space-y-1.5 mb-6">
                  <div className="flex justify-between font-semibold text-amber-950 text-sm pb-1 border-b border-amber-200/60">
                    <span>{justAddedCake.size}</span>
                    <span className="font-mono text-amber-900">${justAddedCake.totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-amber-900"><strong className="text-amber-950">Sponge:</strong> {justAddedCake.flavor}</p>
                  <p className="text-amber-900"><strong className="text-amber-950">Filling:</strong> {justAddedCake.filling}</p>
                  <p className="text-amber-900"><strong className="text-amber-950">Frosting:</strong> {justAddedCake.frosting} ({justAddedCake.color})</p>
                  {justAddedCake.toppings.length > 0 && (
                    <p className="text-amber-900"><strong className="text-amber-950">Toppings:</strong> {justAddedCake.toppings.join(', ')}</p>
                  )}
                  {justAddedCake.writing && (
                    <p className="text-amber-900"><strong className="text-amber-950">Lettering:</strong> "{justAddedCake.writing}"</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  {openCart && (
                    <button
                      onClick={() => {
                        setShowAddedModal(false);
                        openCart();
                      }}
                      className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="h-4.5 w-4.5" />
                      View Cart & Order on WhatsApp
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowAddedModal(false);
                        handleReset();
                      }}
                      className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Design Another
                    </button>
                    <button
                      onClick={() => setShowAddedModal(false)}
                      className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Keep Editing
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
