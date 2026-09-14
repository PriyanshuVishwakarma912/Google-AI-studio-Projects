import { MenuItem, GalleryItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // Pastries
  {
    id: 'pastry-1',
    name: 'Artisanal Butter Croissant',
    description: 'Flaky, golden-brown, multi-layered French croissant made with premium Normandy butter.',
    price: 4.50,
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    dietary: [],
    ingredients: ['French wheat flour', 'AOP Normandy butter', 'Organic sugar', 'Yeast', 'Sea salt']
  },
  {
    id: 'pastry-2',
    name: 'Pistachio Cardamom Bun',
    description: 'Spiced cardamom dough filled with a rich roasted pistachio frangipane, topped with crushed pistachios.',
    price: 5.25,
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600',
    dietary: [],
    ingredients: ['Wheat flour', 'Butter', 'Organic cardamom', 'Roasted pistachios', 'Sugar', 'Egg']
  },
  {
    id: 'pastry-3',
    name: 'Gluten-Free Raspberry Almond Tart',
    description: 'Crisp almond meal crust filled with organic raspberry compote and topped with toasted sliced almonds.',
    price: 6.00,
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    dietary: ['gluten-free', 'dairy-free'],
    ingredients: ['Almond meal', 'Coconut flour', 'Maple syrup', 'Fresh raspberries', 'Coconut oil', 'Vanilla bean']
  },

  // Breads
  {
    id: 'bread-1',
    name: 'Wild Yeast Sourdough Boule',
    description: 'Naturally leavened sourdough bread with a blistered crust and a soft, tangy, open-crumb interior.',
    price: 8.50,
    category: 'bread',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=800',
    dietary: ['vegan', 'dairy-free', 'nut-free'],
    ingredients: ['Organic stone-ground flour', 'Water', 'Wild yeast starter', 'Himalayan pink salt']
  },
  {
    id: 'bread-2',
    name: 'Kalamata Olive & Rosemary Focaccia',
    description: 'Fluffy Ligurian-style flatbread seasoned with extra virgin olive oil, rosemary, and cured Kalamata olives.',
    price: 7.50,
    category: 'bread',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=600',
    dietary: ['vegan', 'dairy-free', 'nut-free'],
    ingredients: ['Wheat flour', 'Cold-pressed olive oil', 'Kalamata olives', 'Fresh rosemary', 'Flaky sea salt']
  },

  // Cakes (By the slice)
  {
    id: 'cake-1',
    name: 'Vegan Dark Chocolate Ganache Slice',
    description: 'Decadent, moist cocoa sponge layered with silken dark chocolate ganache and espresso infusion.',
    price: 7.00,
    category: 'cake',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    dietary: ['vegan', 'dairy-free', 'nut-free'],
    ingredients: ['Unrefined cane sugar', 'Oat milk', '70% Valrhona dark chocolate', 'Espresso powder', 'Cocoa powder', 'Coconut cream']
  },
  {
    id: 'cake-2',
    name: 'Lemon Lavender Poppyseed Cake',
    description: 'A light, bright citrus cake infused with culinary lavender, lemon zest, and crunchy poppyseeds.',
    price: 6.75,
    category: 'cake',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600',
    dietary: ['nut-free'],
    ingredients: ['Wheat flour', 'Organic butter', 'Fresh lemon juice & zest', 'Culinary lavender buds', 'Poppyseeds', 'Powdered sugar']
  },

  // Cookies
  {
    id: 'cookie-1',
    name: 'Brown Butter Sea Salt Chocolate Chip',
    description: 'Chewy cookies with crisp caramelized edges, made with browned butter, dark chocolate chunks, and Maldon salt flakes.',
    price: 3.75,
    category: 'cookie',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=600',
    dietary: ['nut-free'],
    ingredients: ['Grass-fed butter', 'Brown sugar', 'Belgian dark chocolate chunks', 'Free-range eggs', 'Vanilla extract', 'Maldon sea salt']
  },
  {
    id: 'cookie-2',
    name: 'Gluten-Free Triple Chocolate Mud Cookie',
    description: 'Fudge-like cookies packed with milk, white, and dark chocolate chips. Incredibly rich and soft.',
    price: 4.00,
    category: 'cookie',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600',
    dietary: ['gluten-free', 'nut-free'],
    ingredients: ['Gluten-free flour blend', 'Dutch-processed cocoa', 'Chocolate chips', 'Organic cane sugar', 'Butter', 'Free-range eggs']
  },

  // Savory
  {
    id: 'savory-1',
    name: 'Spinach, Feta & Pine Nut Croissant',
    description: 'Golden savory croissant filled with sautéed baby spinach, Greek feta cheese, and toasted pine nuts.',
    price: 6.50,
    category: 'savory',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600',
    dietary: [],
    ingredients: ['Normandy butter pastry', 'Fresh baby spinach', 'Greek feta cheese', 'Toasted pine nuts', 'Garlic', 'Nutmeg']
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Elysian Bloom Botanical',
    category: 'Wedding',
    description: 'An elegant, multi-layered cake coated in smooth pastel buttercream and styled with fresh pesticide-free lavender, roses, and baby breath.',
    image: 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=800',
    priceEstimate: 140.00,
    specs: {
      size: '2-Tier (8" + 6")',
      flavor: 'Vanilla Bean & Raspberry',
      filling: 'Champagne Raspberry Compote',
      frosting: 'Swiss Meringue Buttercream',
      toppings: ['Fresh Edible Flowers', 'Piping Accents', 'Gold Flakes']
    }
  },
  {
    id: 'gallery-2',
    title: 'Golden Hour Drip',
    category: 'Celebration',
    description: 'A chocolate-lover’s dream featuring a rich Belgian chocolate ganache drip, topped with hand-crafted macarons and chocolate curls.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    priceEstimate: 85.00,
    specs: {
      size: '8-inch (Serves 15-20)',
      flavor: 'Double Belgian Chocolate',
      filling: 'Salted Caramel Buttercream',
      frosting: 'Dark Chocolate Ganache',
      toppings: ['Dark Chocolate Drip', 'Handcrafted Macarons', 'Toasted Hazelnut Shards']
    }
  },
  {
    id: 'gallery-3',
    title: 'Minimalist Sage Concrete',
    category: 'Artisanal',
    description: 'A textured, rustic cake designed with concrete-style palette knife strokes in soft sage and slate shades, finished with delicate dried wheat stalks.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
    priceEstimate: 75.00,
    specs: {
      size: '6-inch (Serves 8-12)',
      flavor: 'Earl Grey Lavender',
      filling: 'Lemon Zest Curd',
      frosting: 'Rustic Textured Buttercream',
      toppings: ['Dried Botanicals', 'Dehydrated Lemon Wheels', 'Copper Leaf Accents']
    }
  },
  {
    id: 'gallery-4',
    title: 'Forest Foraged Semi-Naked',
    category: 'Rustic',
    description: 'A beautifully natural semi-naked cake showing hints of organic crumb layers, decorated with fresh winter pine, rosemary needles, and frosted red berries.',
    image: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&q=80&w=800',
    priceEstimate: 95.00,
    specs: {
      size: '8-inch (Serves 15-20)',
      flavor: 'Spiced Carrot & Walnut',
      filling: 'Cream Cheese Whip',
      frosting: 'Rustic Semi-Naked Frosting',
      toppings: ['Fresh Rosemary & Pine', 'Sugared Blueberries & Cranberries', 'Dusting of Snowy Sugar']
    }
  },
  {
    id: 'gallery-5',
    title: 'Wildflower Meadow Naked',
    category: 'Birthday',
    description: 'A colorful, joyous naked sponge cake stuffed to the brim with fluffy vanilla cream, spilling over with hand-picked country garden wildflowers.',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800',
    priceEstimate: 90.00,
    specs: {
      size: '2-Tier (6" + 4")',
      flavor: 'Lemon Sponge Cake',
      filling: 'Sweet Strawberry Cream',
      frosting: 'Minimalist Crumb Coat',
      toppings: ['Fresh Chamomile Flowers', 'Pansies & Marigolds', 'Vanilla Piping']
    }
  },
  {
    id: 'gallery-6',
    title: 'Dreamy Cloud Pastel',
    category: 'Whimsical',
    description: 'A pastel-pink tiered dream with elegant scalloped piping, topped with a custom gold single-candle holder. Perfect for milestones.',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    priceEstimate: 110.00,
    specs: {
      size: '8-inch (Serves 15-20)',
      flavor: 'Red Velvet Royale',
      filling: 'Tangy Cream Cheese Buttercream',
      frosting: 'Classic Scallop Buttercream',
      toppings: ['Luxe Piping Borders', 'White Chocolate Cloud Toppers', 'Pastel Pink Confetti']
    }
  }
];
