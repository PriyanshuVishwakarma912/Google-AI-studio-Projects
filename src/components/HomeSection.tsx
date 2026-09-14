import { motion } from 'motion/react';
import { ArrowRight, Cake, Heart, Leaf, ShieldCheck, Clock, MapPin, Star, Award } from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeSection({ setActiveTab }: HomeSectionProps) {
  const featuredCats = [
    { id: 'menu', category: 'pastry', label: 'Fine Pastries', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400', desc: 'Normandy butter tarts & croissants' },
    { id: 'builder', category: 'cake', label: 'Custom Cakes', image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=400', desc: 'Bespoke designs built layer by layer' },
    { id: 'menu', category: 'bread', label: 'Artisanal Bread', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=400', desc: 'Slow naturally fermented sourdoughs' },
    { id: 'menu', category: 'cookie', label: 'Gourmet Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400', desc: 'Rich caramelized browned-butter biscuits' },
  ];

  const testimonials = [
    {
      name: "Marcus & Amelia Vance",
      role: "Wedding Client",
      quote: "L’Amour crafted our 3-tier botanical wedding cake. Not only was it a breathtaking rustic masterpiece that matched our florals perfectly, but the Earl Grey and lemon curd sponge was incredibly moist. Everyone was asking where we got it!",
      rating: 5
    },
    {
      name: "Julianna Frost",
      role: "Birthday Mother",
      quote: "My daughter has severe dairy and gluten allergies, making birthdays stressful. L’Amour baked a custom vegan, gluten-free chocolate fudge cake that tasted absolutely divine—you couldn't even tell it was allergy-friendly. Deeply grateful!",
      rating: 5
    },
    {
      name: "Chef David K.",
      role: "Local Food Critic",
      quote: "The croissants here are a technical marvel. The lamination is flawless—crisp shatter on the outer shell, opening into a feather-light, rich, butter-fragrant honeycomb. Easily the best sourdough boule in the city.",
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-amber-50/45 via-amber-50/10 to-transparent py-14 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-1.5 bg-amber-100/50 border border-amber-200/60 px-3.5 py-1.5 rounded-full text-xs text-amber-900 font-mono font-bold tracking-wider uppercase w-fit">
                <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                Voted Best Local Bakery 2026
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-amber-950 leading-[1.08] max-w-lg">
                Baked Daily. With Love & <span className="text-amber-700 italic font-medium">Integrity.</span>
              </h1>

              <p className="text-amber-900/80 text-base md:text-lg leading-relaxed max-w-md">
                From flaky Normandy butter croissants to organic custom-designed celebration cakes, L’Amour blends classical French lamination with inclusive dietary baking.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('menu')}
                  className="px-6 py-3 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all group"
                >
                  Explore Daily Menu
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className="px-6 py-3 bg-white border border-amber-200 hover:border-amber-400 text-amber-950 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Cake className="h-4.5 w-4.5 text-amber-700" />
                  Custom Cake Lab
                </button>
              </div>

              {/* Mini trust stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-100 max-w-sm">
                <div>
                  <span className="block font-serif text-xl md:text-2xl font-bold text-amber-950">100%</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-semibold">Organic Flour</span>
                </div>
                <div>
                  <span className="block font-serif text-xl md:text-2xl font-bold text-amber-950">36 Hr</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-semibold">Slow Ferment</span>
                </div>
                <div>
                  <span className="block font-serif text-xl md:text-2xl font-bold text-amber-950">Allergen</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-semibold">Sterilized Shifts</span>
                </div>
              </div>

            </motion.div>

            {/* Right Graphic collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative h-96 sm:h-[460px] rounded-3xl overflow-hidden shadow-md border border-amber-100"
            >
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200"
                alt="Flour dusted baking countertop and fresh bread"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Overlapping Glass box */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-lg flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-800 shrink-0">
                  <Award className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-amber-600 uppercase block">Craft Philosophy</span>
                  <span className="block font-serif text-sm font-semibold text-amber-950 mt-0.5">"Ingredients are the seed of all memory."</span>
                  <p className="text-[11px] text-amber-800/80 mt-1">We source unrefined sugars, stone-ground ancient grains, and direct-trade vanilla.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-1">Hand-Crafted Selections</span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-amber-950">Explore Our Bakery Collections</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredCats.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat.id)}
              className="group text-center space-y-3 cursor-pointer outline-none focus:ring-0"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-amber-100 group-hover:border-amber-600 transition-all duration-300 p-1 bg-white">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-serif font-bold text-amber-950 group-hover:text-amber-800 transition-colors text-base md:text-lg">
                  {cat.label}
                </h3>
                <p className="text-amber-700/70 text-xs mt-0.5 leading-normal max-w-xs mx-auto line-clamp-1">
                  {cat.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. BENTO CORE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-amber-50/25 border-y border-amber-100/60 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Large Bento Block: Custom Cakes */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-100 p-6 md:p-8 flex flex-col justify-between gap-8 h-full shadow-xs">
            <div className="space-y-3 max-w-md">
              <span className="text-[10px] font-mono font-bold tracking-wider text-amber-600 uppercase">The Cake Customizer</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-950 leading-tight">
                Design Cakes of Absolute Grandeur
              </h2>
              <p className="text-amber-900/80 text-xs md:text-sm leading-relaxed">
                Need a cake that represents your unique style? Our custom laboratory allows you to pick layers of buttermilk sponge, silken ganache fillings, and choose gorgeous hand-placed toppings like edible 24k gold leaf or pressed wildflowers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-amber-50 pt-6">
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs font-mono text-amber-900 border border-amber-100">Vanilla Bean</span>
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs font-mono text-amber-900 border border-amber-100">Gold Leaf</span>
                <span className="px-2.5 py-1 bg-amber-50 rounded-lg text-xs font-mono text-amber-900 border border-amber-100">Sage Green</span>
              </div>
              <button
                onClick={() => setActiveTab('builder')}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
              >
                Launch Cake Lab
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Smaller Bento Block 1: Dietary Commitment */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-amber-100 p-6 flex flex-col justify-between gap-6 shadow-xs">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="p-2 bg-amber-50 rounded-xl text-amber-800">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-950">Dietary Inclusivity</h3>
              <p className="text-amber-900/80 text-xs md:text-sm leading-relaxed">
                Eating gluten-free, vegan, or lactose-free shouldn't feel like a sacrifice. We isolate flour-free bakes in customized sterilized bakery shifts so everyone can celebrate safely.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('dietary')}
              className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer w-fit mt-2"
            >
              Read Dietary Protocols
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. CLIENT LOVE TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-1">Happy Celebrations</span>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-amber-950">Client Testimonials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="bg-white border border-amber-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-amber-900/90 italic text-xs md:text-sm leading-relaxed">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-amber-50 pt-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center font-serif font-bold text-amber-800 text-sm">
                  {test.name[0]}
                </div>
                <div>
                  <span className="block font-bold text-xs text-amber-950">{test.name}</span>
                  <span className="block text-[10px] font-mono tracking-wider text-amber-600 font-semibold">{test.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOURS & LOCATION DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-950 rounded-3xl text-stone-100 p-8 md:p-12 relative overflow-hidden border border-amber-800/20 shadow-lg">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 items-center">
            
            {/* Information */}
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase block mb-2">Fulfillment Kitchen</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">Visit Our Cozy Shop</h2>
                <p className="text-stone-300 text-xs md:text-sm leading-relaxed mt-2">
                  Have a custom wedding consultation or want to smell the sourdough boules coming hot out of our stone ovens? Visit us at the main street commons!
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-amber-400">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs md:text-sm text-stone-200">
                    428 Artisanal Row, Sourdough Commons, Suite B
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg text-amber-400">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-xs md:text-sm text-stone-200">
                    <span className="block">Mon–Sat: 7:00 AM – 6:00 PM</span>
                    <span className="block text-[10px] text-stone-400 font-mono">Sunday: Closed for deep-sterilization shifts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated interactive map placeholder */}
            <div className="w-full h-56 rounded-2xl overflow-hidden relative border border-white/15 bg-stone-900/60 flex flex-col justify-center items-center text-center p-4">
              <MapPin className="h-8 w-8 text-amber-500 animate-bounce mb-2" />
              <span className="font-serif font-semibold text-sm text-white">Google Maps Interactive Link</span>
              <p className="text-[11px] text-stone-400 max-w-xs leading-normal mt-1">
                L’Amour Bakery sits directly across from the Central Park greenbelt, adjacent to the historic clock tower.
              </p>
              <button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="mt-3.5 px-4 py-1.5 bg-white text-amber-950 text-[10px] font-mono font-bold tracking-wider uppercase rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                Launch Navigation Map
              </button>
            </div>

          </div>

          {/* Graphic circles backdrop */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-800/10 rounded-full blur-2xl -translate-y-12 translate-x-12"></div>
        </div>
      </section>

    </div>
  );
}
