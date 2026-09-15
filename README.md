# L'Amour Bakery — Modern Bakery Shop
 
An elegant, modern bakery website built with React, TypeScript, and Tailwind CSS. It includes a custom cake builder, dietary filters, a shopping cart, WhatsApp-based ordering, and an owner dashboard to track orders.

---
 
## Features
 
- **Home Page** — Introduces the bakery with a clean, editorial-style layout.
- **Daily Menu** — Browse pastries, breads, cakes, cookies, and savory items. Add items straight to the cart.
- **Custom Cake Builder** — Design a custom cake by choosing size, flavor, filling, frosting, color, toppings, and a personal message.
- **Cake Gallery** — A portfolio of past cake designs. Any design can be used as a starting point in the Cake Builder.
- **Dietary Info** — Clear labels for gluten-free, vegan, dairy-free, and nut-free options.
- **Shopping Cart** — Add, update, or remove items. Cart contents are saved in the browser, so they aren't lost on refresh.
- **WhatsApp Ordering** — Orders are sent directly to the bakery's WhatsApp number via click-to-chat. The number can be changed from the site footer.
- **Owner Order History Dashboard** — Track every order, update its status (new → baking → ready → completed/cancelled), and add internal staff notes.
---
## Tech Stack
 
| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Animation | Motion |
| Backend (optional) | Express |
| AI | Google Gemini API (`@google/genai`) |
 
---
 
## Project Structure
 
```
Google-AI-studio-Projects/
├── src/
│   ├── components/
│   │   ├── CakeBuilder.tsx     # Custom cake design tool
│   │   ├── CakeGallery.tsx     # Past cake designs
│   │   ├── Cart.tsx            # Shopping cart drawer + WhatsApp order flow
│   │   ├── DietaryInfo.tsx     # Dietary/allergen information
│   │   ├── HomeSection.tsx     # Landing page section
│   │   ├── MenuSection.tsx     # Daily menu listing
│   │   ├── Navbar.tsx          # Site navigation
│   │   └── OrderHistory.tsx    # Owner dashboard for order tracking
│   ├── data/
│   │   ├── menu.ts             # Menu item data
│   │   └── sampleOrders.ts     # Sample order data for the dashboard
│   ├── App.tsx                 # Main app logic and layout
│   ├── main.tsx                # App entry point
│   ├── index.css                # Global styles
│   └── types.ts                # Shared TypeScript types
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── .gitignore
```
 
---
 
## Getting Started
 
### Prerequisites
 
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Gemini API key](https://aistudio.google.com/apikey)
### Installation
 
1. Clone the repository:
```bash
   git clone https://github.com/PriyanshuVishwakarma912/Google-AI-studio-Projects.git
   cd Google-AI-studio-Projects
```
 
2. Install dependencies:
```bash
   npm install
```
 
3. Set up your environment variables. Copy `.env.example` to `.env` and add your key:
```bash
   cp .env.example .env
```
```env
   GEMINI_API_KEY="your_gemini_api_key_here"
```
 
4. Start the development server:
```bash
   npm run dev
```
 
5. Open your browser at `http://localhost:3000`.
### Other Commands
 
| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with TypeScript |
| `npm run clean` | Remove build output |
 
---
 
## How Ordering Works
 
1. A customer browses the menu or designs a custom cake.
2. Items are added to the cart (saved locally in the browser).
3. On checkout, the order is formatted and sent via a WhatsApp click-to-chat link to the bakery's number.
4. The order is also saved to the **Owner Order History** dashboard, where staff can update its status and add notes.
---
 

## License
 
This project is open source and available for learning and personal use.
 

