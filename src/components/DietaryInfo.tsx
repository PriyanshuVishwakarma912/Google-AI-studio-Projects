import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wheat, Droplets, Leaf, ShieldCheck, Heart, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function DietaryInfo() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const dietaryCards = [
    {
      id: 'gluten-free',
      icon: <Wheat className="h-6 w-6 text-emerald-700" />,
      title: 'Gluten-Free Alternatives',
      subtitle: 'Celiac & Wheat-Sensitive Friendly',
      description: 'We substitute refined wheat flour with a meticulously designed house-blend of organic almond meal, stone-ground brown rice flour, sweet potato flour, and coconut starch.',
      highlight: 'Note: Extremely soft textures and delicious nut-butter undertones.'
    },
    {
      id: 'vegan',
      icon: <Leaf className="h-6 w-6 text-green-700" />,
      title: 'Plant-Based & Vegan',
      subtitle: 'Egg & Dairy-Free Excellence',
      description: 'We exclude all animal-derived fats. Eggs are replaced with nutrient-rich organic flaxmeal slurries, applesauce, or aquafaba. Milk is replaced with creamy oat or homemade cashew milk.',
      highlight: 'We use premium, cold-pressed vegetable and coconut oil fats.'
    },
    {
      id: 'dairy-free',
      icon: <Droplets className="h-6 w-6 text-blue-700" />,
      title: 'Lactose & Dairy-Free',
      subtitle: 'Zero Lactose Baking',
      description: 'For customers sensitive to cow milk proteins, we create gorgeous tarts, breads, and icings using premium vegan organic fats and organic nut-milks.',
      highlight: 'Our chocolate is 100% dairy-free dark Belgian chocolate.'
    },
    {
      id: 'safety',
      icon: <ShieldCheck className="h-6 w-6 text-amber-700" />,
      title: 'Strict Allergen Protocols',
      subtitle: 'Kitchen Cross-Contamination Guard',
      description: 'All dietary baking occurs during separate, sterilized shifts. Before dietary flour enters the workspace, all equipment, planetary mixers, and worktops undergo a 3-step high-temp sterilization.',
      highlight: 'Safety is our absolute cornerstone of trust.'
    }
  ];

  const faqs = [
    {
      question: "Are your gluten-free items baked in a 100% gluten-free kitchen?",
      answer: "While we have separate, thoroughly sterilized workspaces and specialized baking trays for our gluten-free products to avoid airborne flour dust, we do bake wheat-based sourdough in the same facility. If you have an extreme, highly life-threatening celiac allergy, please contact our bakers in advance so we can take additional medical-grade precautions."
    },
    {
      question: "What sweeteners do you use for your sugar-free or low-glycemic options?",
      answer: "We strictly avoid artificial chemical sweeteners (like aspartame or sucralose). Instead, we sweeten our specialty cakes and pastries with organic unrefined coconut nectar, pure maple syrup, caramelized dates, or organic erythritol (upon custom request for keto clients)."
    },
    {
      question: "Can I request a custom cake that is BOTH Vegan and Gluten-Free?",
      answer: "Absolutely! Our Custom Cake Builder allows you to specify details. In fact, many of our chocolate sponges are naturally vegan and can be baked with our premium almond-rice gluten-free blend. Just enter this in the special instructions or special writing field in Step 5 of the builder!"
    },
    {
      question: "Do you use organic and non-GMO ingredients?",
      answer: "Yes, 100%. We source our berries from local bio-farms, use AOP Normandy butter for traditional pastries, organic Madagascar vanilla beans, and non-GMO stone-ground heritage flours."
    }
  ];

  return (
    <div className="py-10 bg-amber-50/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase block mb-2">Baking with Care</span>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-amber-950 mb-3">
            Dietary Integrity
          </h1>
          <p className="text-amber-800/80 text-sm md:text-base leading-relaxed">
            We believe delicious bakes should be inclusive. We design recipes that honor gluten-free, vegan, and allergen-safe lifestyles without compromising on texture, moisture, or taste.
          </p>
        </div>

        {/* 4-Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {dietaryCards.map((card) => (
            <div 
              key={card.id}
              className="bg-white border border-amber-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start"
            >
              <div className="p-3 bg-amber-50 rounded-2xl shrink-0">
                {card.icon}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-600 block uppercase">
                  {card.subtitle}
                </span>
                <h3 className="font-serif text-lg font-bold text-amber-950">
                  {card.title}
                </h3>
                <p className="text-amber-900/80 text-xs md:text-sm leading-relaxed">
                  {card.description}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-100/50 text-[11px] text-amber-800 font-medium">
                  <Info className="h-3 w-3 text-amber-600 shrink-0" />
                  {card.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto bg-white border border-amber-100 rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="text-center mb-8">
            <Heart className="h-6 w-6 text-red-500 mx-auto mb-2 animate-pulse" />
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-amber-950">
              Dietary FAQ & Guarantees
            </h2>
            <p className="text-amber-800/70 text-xs md:text-sm mt-1">
              Have questions about cross-contamination, ingredients, or allergens? We have transparent answers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFAQ === idx;
              return (
                <div 
                  key={idx}
                  className="border border-amber-50 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 bg-amber-50/30 hover:bg-amber-50/70 transition-colors flex justify-between items-center gap-3 cursor-pointer"
                  >
                    <span className="font-serif font-medium text-sm md:text-base text-amber-950">
                      {faq.question}
                    </span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-amber-700" /> : <ChevronDown className="h-4 w-4 text-amber-700" />}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="px-5 py-4 text-xs md:text-sm text-amber-900/90 leading-relaxed border-t border-amber-50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
