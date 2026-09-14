import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Send, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle, 
  Truck, 
  Store,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Edit2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { CartItem, Order, OrderItem } from '../types';

export const cleanWhatsAppNumber = (raw: string): string => {
  return raw.replace(/\D/g, '');
};

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  bakeryPhone?: string;
  onUpdateBakeryPhone?: (phone: string) => void;
  onPlaceOrder?: (order: Order) => void;
  onOpenOrderHistory?: () => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  bakeryPhone = '15550199000',
  onUpdateBakeryPhone,
  onPlaceOrder,
  onOpenOrderHistory
}: CartProps) {
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Destination WhatsApp configuration
  const [recipientType, setRecipientType] = useState<'bakery' | 'customer' | 'custom'>('bakery');
  const [customPhone, setCustomPhone] = useState('');
  const [isEditingBakeryNum, setIsEditingBakeryNum] = useState(false);
  const [tempBakeryPhone, setTempBakeryPhone] = useState(bakeryPhone);
  
  // Checkout order states
  const [isOrdered, setIsOrdered] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    orderId: string;
    receipt: string;
    targetPhone: string;
    recipientLabel: string;
    waUrl: string;
    webWaUrl: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showFullReceipt, setShowFullReceipt] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const itemsSubtotal = cartItems.reduce((acc, item) => {
    const price = item.type === 'menu' && item.menuItem 
      ? item.menuItem.price 
      : (item.customCake ? item.customCake.totalPrice : 0);
    return acc + (price * item.quantity);
  }, 0);

  const deliveryFee = fulfillment === 'delivery' ? 10.00 : 0.00;
  const tax = itemsSubtotal * 0.08; // 8% local tax
  const grandTotal = itemsSubtotal + deliveryFee + tax;

  // Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full Name is required';
    if (!phone.trim()) errs.phone = 'Customer WhatsApp Mobile number is required';
    if (fulfillment === 'delivery' && !address.trim()) errs.address = 'Delivery Address is required';
    if (!date) errs.date = 'Fulfillment Date is required';
    if (!time) errs.time = 'Time is required';

    let targetRaw = '';
    if (recipientType === 'bakery') {
      targetRaw = bakeryPhone;
    } else if (recipientType === 'customer') {
      targetRaw = phone;
    } else {
      targetRaw = customPhone;
      if (!customPhone.trim()) {
        errs.customPhone = 'Please specify the recipient WhatsApp number';
      }
    }

    const clean = cleanWhatsAppNumber(targetRaw);
    if (!clean || clean.length < 7) {
      errs.destinationPhone = 'Recipient WhatsApp number must include country code and be at least 7 digits (e.g. 14155552671 or 919876543210)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Compile receipt text and open WhatsApp
  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Resolve target recipient number and label
    let targetRaw = '';
    let recipientLabel = '';
    if (recipientType === 'bakery') {
      targetRaw = bakeryPhone;
      recipientLabel = 'Bakery Kitchen & Orders Desk';
    } else if (recipientType === 'customer') {
      targetRaw = phone;
      recipientLabel = `Customer (${name.trim()})`;
    } else {
      targetRaw = customPhone;
      recipientLabel = 'Designated Contact Person';
    }

    const cleanTargetPhone = cleanWhatsAppNumber(targetRaw);
    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Compile Receipt
    let receipt = `🎂 *NEW ORDER FROM L’AMOUR BAKERY* (Ref: #${orderId}) 🎂\n`;
    receipt += `=========================\n\n`;
    receipt += `👤 *CUSTOMER DETAILS*\n`;
    receipt += `• Name: ${name.trim()}\n`;
    receipt += `• WhatsApp: ${phone.trim()}\n`;
    receipt += `• Fulfillment: ${fulfillment.toUpperCase()}\n`;
    if (fulfillment === 'delivery') {
      receipt += `• Address: ${address.trim()}\n`;
    }
    receipt += `• Requested Date: ${date}\n`;
    receipt += `• Requested Time: ${time}\n\n`;

    receipt += `🛍️ *ITEMS ORDERED*\n`;
    receipt += `-------------------------\n`;
    
    cartItems.forEach((item, idx) => {
      if (item.type === 'menu' && item.menuItem) {
        receipt += `${idx + 1}. *${item.menuItem.name}* (x${item.quantity})\n`;
        receipt += `   _Category: ${item.menuItem.category}_\n`;
        receipt += `   _Price: $${(item.menuItem.price * item.quantity).toFixed(2)}_\n`;
      } else if (item.type === 'custom' && item.customCake) {
        const cake = item.customCake;
        receipt += `${idx + 1}. *CUSTOM CAKE DESIGN* (x${item.quantity})\n`;
        receipt += `   _Size: ${cake.size}_\n`;
        receipt += `   _Sponge: ${cake.flavor}_\n`;
        receipt += `   _Filling: ${cake.filling}_\n`;
        receipt += `   _Style: ${cake.frosting}_\n`;
        receipt += `   _Color: ${cake.color}_\n`;
        if (cake.toppings.length > 0) {
          receipt += `   _Toppings: ${cake.toppings.join(', ')}_\n`;
        }
        if (cake.writing) {
          receipt += `   _Piping Writing: "${cake.writing}"_\n`;
        }
        receipt += `   _Price: $${(cake.totalPrice * item.quantity).toFixed(2)}_\n`;
      }
      receipt += `\n`;
    });

    if (notes.trim()) {
      receipt += `📝 *SPECIAL BAKING NOTES*\n`;
      receipt += `"${notes.trim()}"\n\n`;
    }

    receipt += `=========================\n`;
    receipt += `💰 *BILLING SUMMARY*\n`;
    receipt += `• Items Subtotal: $${itemsSubtotal.toFixed(2)}\n`;
    if (fulfillment === 'delivery') {
      receipt += `• Delivery Fee: $10.00\n`;
    }
    receipt += `• Sales Tax (8%): $${tax.toFixed(2)}\n`;
    receipt += `*Grand Total Due: $${grandTotal.toFixed(2)}*\n\n`;
    receipt += `Thank you for choosing L’Amour Bakery! We will review and confirm your order promptly. 🥐✨`;

    // Automatically record order in Order History
    const orderItems: OrderItem[] = cartItems.map((item, idx) => {
      if (item.type === 'menu' && item.menuItem) {
        return {
          id: `item-${idx}-${item.menuItem.id}`,
          type: 'menu',
          name: item.menuItem.name,
          quantity: item.quantity,
          unitPrice: item.menuItem.price,
          totalPrice: item.menuItem.price * item.quantity,
          details: {
            category: item.menuItem.category,
          },
          image: item.menuItem.image,
        };
      } else if (item.type === 'custom' && item.customCake) {
        const cake = item.customCake;
        return {
          id: `item-${idx}-${Date.now()}`,
          type: 'custom',
          name: `Custom Bespoke Cake (${cake.size})`,
          quantity: item.quantity,
          unitPrice: cake.totalPrice,
          totalPrice: cake.totalPrice * item.quantity,
          details: {
            size: cake.size,
            flavor: cake.flavor,
            filling: cake.filling,
            frosting: cake.frosting,
            color: cake.color,
            colorHex: cake.colorHex,
            toppings: [...cake.toppings],
            writing: cake.writing,
          },
          image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=400',
        };
      }
      return {
        id: `item-${idx}`,
        type: 'menu',
        name: 'Bakery Item',
        quantity: item.quantity,
        unitPrice: 0,
        totalPrice: 0,
      };
    });

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName: name.trim(),
      customerPhone: phone.trim(),
      fulfillment,
      deliveryAddress: fulfillment === 'delivery' ? address.trim() : undefined,
      requestedDate: date,
      requestedTime: time,
      specialNotes: notes.trim() || undefined,
      items: orderItems,
      subtotal: itemsSubtotal,
      deliveryFee,
      tax,
      grandTotal,
      status: 'new',
    };

    if (onPlaceOrder) {
      onPlaceOrder(newOrder);
    }

    // Encode URLs
    const encodedText = encodeURIComponent(receipt);
    const waUrl = `https://wa.me/${cleanTargetPhone}?text=${encodedText}`;
    const webWaUrl = `https://web.whatsapp.com/send?phone=${cleanTargetPhone}&text=${encodedText}`;

    setLastOrderDetails({
      orderId,
      receipt,
      targetPhone: cleanTargetPhone,
      recipientLabel,
      waUrl,
      webWaUrl,
    });

    // Attempt to open WhatsApp directly (user-triggered click)
    try {
      window.open(waUrl, '_blank');
    } catch {
      // Fallback handled by in-drawer link buttons
    }
    
    // Switch to interactive confirmation state
    setIsOrdered(true);
  };

  const handleCopyReceipt = () => {
    if (!lastOrderDetails) return;
    navigator.clipboard.writeText(lastOrderDetails.receipt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const handleFinishAndClear = () => {
    onClearCart();
    setIsOrdered(false);
    setLastOrderDetails(null);
    onClose();
    // Reset form
    setName('');
    setPhone('');
    setAddress('');
    setDate('');
    setTime('');
    setNotes('');
    setCustomPhone('');
    setErrors({});
  };

  const handleSaveBakeryPhone = () => {
    const cleaned = cleanWhatsAppNumber(tempBakeryPhone);
    if (cleaned.length >= 7) {
      if (onUpdateBakeryPhone) {
        onUpdateBakeryPhone(cleaned);
      }
      try {
        localStorage.setItem('lamour_bakery_whatsapp', cleaned);
      } catch {}
      setIsEditingBakeryNum(false);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.destinationPhone;
        return next;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        destinationPhone: 'Please enter at least 7 digits with country code.'
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          ></motion.div>

          {/* Drawer Container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md md:max-w-lg bg-white shadow-xl flex flex-col h-full border-l border-amber-50"
            >
              {/* Header */}
              <div className="px-5 py-5 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100/50 rounded-lg text-amber-800">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-amber-950">Your Order Cart</h2>
                    <p className="text-[10px] font-mono tracking-widest text-amber-600 uppercase font-semibold">
                      {cartItems.length} items selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-amber-100/50 text-stone-700 cursor-pointer transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SUCCESS OVERLAY SCREEN */}
              {isOrdered && lastOrderDetails ? (
                <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-stone-50/50 space-y-4 animate-in fade-in duration-300">
                  <div className="text-center space-y-2 pt-2">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
                      <CheckCircle className="h-8 w-8 stroke-[2.5]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-amber-950">Order Ready for WhatsApp!</h3>
                    <p className="text-stone-600 text-xs max-w-sm mx-auto leading-relaxed">
                      Your full order receipt is formatted and ready. Clicking below opens WhatsApp with the complete order pre-filled directly to this recipient.
                    </p>
                  </div>

                  {/* Order Recorded in History Notification */}
                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-900 block">
                          Recorded in Order History
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-950">
                          Ref: #{lastOrderDetails.orderId}
                        </span>
                      </div>
                    </div>
                    {onOpenOrderHistory && (
                      <button
                        type="button"
                        onClick={() => {
                          handleFinishAndClear();
                          onOpenOrderHistory();
                        }}
                        className="px-3 py-1.5 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-[11px] font-bold cursor-pointer transition-colors shrink-0 shadow-xs"
                      >
                        Track in Order History →
                      </button>
                    )}
                  </div>

                  {/* Destination Info Card */}
                  <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
                        <MessageCircle className="h-3.5 w-3.5 fill-emerald-600 text-emerald-600" />
                        Target WhatsApp Contact
                      </span>
                      <span className="text-[10px] bg-emerald-100/70 text-emerald-900 font-medium px-2 py-0.5 rounded-full">
                        {lastOrderDetails.recipientLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-emerald-50">
                      <div>
                        <span className="text-xs text-stone-500 block">Recipient Phone:</span>
                        <span className="font-mono text-base font-bold text-emerald-950">
                          +{lastOrderDetails.targetPhone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Total Due:</span>
                        <span className="font-mono text-base font-bold text-amber-950">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary WhatsApp Action Buttons */}
                  <div className="space-y-2">
                    <a
                      href={lastOrderDetails.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 fill-white" />
                      <span>Open in WhatsApp (App or Web)</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                    </a>

                    <a
                      href={lastOrderDetails.webWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <span>Open in WhatsApp Web Directly (Browser)</span>
                      <ExternalLink className="h-3 w-3 text-emerald-700" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyReceipt}
                      className="w-full py-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                          <span className="text-emerald-800 font-bold">Order Details Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-amber-800" />
                          <span>Copy Full Order Receipt Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Collapsible WhatsApp message preview */}
                  <div className="border border-stone-200 rounded-2xl bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowFullReceipt(!showFullReceipt)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-stone-500" />
                        Preview Pre-filled WhatsApp Message
                      </span>
                      {showFullReceipt ? <ChevronUp className="h-4 w-4 text-stone-400" /> : <ChevronDown className="h-4 w-4 text-stone-400" />}
                    </button>

                    {showFullReceipt && (
                      <div className="p-4 border-t border-stone-100 bg-stone-50 text-[11px] font-mono text-stone-800 whitespace-pre-wrap max-h-52 overflow-y-auto leading-relaxed select-all">
                        {lastOrderDetails.receipt}
                      </div>
                    )}
                  </div>

                  {/* Actions to Finish or Edit */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOrdered(false)}
                      className="flex-1 py-2.5 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Edit Number or Order
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishAndClear}
                      className="flex-1 py-2.5 px-3 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Done & Clear Cart
                    </button>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                /* EMPTY STATE */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <ShoppingBag className="h-12 w-12 text-amber-300 stroke-[1.5]" />
                  <h3 className="font-serif text-lg font-bold text-amber-950">Your cart is empty</h3>
                  <p className="text-amber-800/60 text-xs md:text-sm max-w-xs leading-relaxed">
                    Glance through our freshly baked catalog or custom cake lab to add artisanal products to your order sheet.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold hover:bg-amber-950 cursor-pointer transition-colors"
                  >
                    Browse Bakery Menu
                  </button>
                </div>
              ) : (
                /* CART CONTENT */
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Item List Scroller */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 division-y division-amber-50">
                    {cartItems.map((item) => {
                      const isCustom = item.type === 'custom';
                      const name = isCustom ? 'Bespoke Custom Cake' : item.menuItem?.name;
                      const price = isCustom ? item.customCake?.totalPrice : item.menuItem?.price;
                      const image = isCustom 
                        ? 'https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=300' // floral wedding custom cake thumbnail
                        : item.menuItem?.image;

                      return (
                        <div 
                          key={item.id}
                          className="flex gap-3 bg-amber-50/20 p-3 rounded-2xl border border-amber-100/50"
                        >
                          {/* Image */}
                          <img 
                            src={image} 
                            alt={name} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300';
                            }}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 bg-amber-50"
                          />
                          
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-sm text-amber-950 truncate">{name}</h4>
                            
                            {/* Render Custom Cake Specs if custom */}
                            {isCustom && item.customCake && (
                              <div className="text-[10px] text-amber-800/80 space-y-0.5 mt-0.5 font-sans leading-tight">
                                <p>• Size: {item.customCake.size}</p>
                                <p>• Sponge: {item.customCake.flavor}</p>
                                <p>• Cream: {item.customCake.filling}</p>
                                {item.customCake.writing && (
                                  <p className="italic font-semibold text-rose-800">
                                    • Lettering: "{item.customCake.writing}"
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex justify-between items-center mt-2.5">
                              <span className="font-mono text-xs font-bold text-amber-950">
                                ${(price ? price * item.quantity : 0).toFixed(2)}
                              </span>
                              
                              {/* Quantity actions */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-amber-100 rounded-md bg-white">
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-0.5 text-xs text-amber-900 cursor-pointer hover:bg-amber-50"
                                  >
                                    -
                                  </button>
                                  <span className="px-1.5 text-xs font-mono font-semibold text-amber-950 min-w-4 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-0.5 text-xs text-amber-900 cursor-pointer hover:bg-amber-50"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                  aria-label="Delete item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Form & Billing Sticky Footer */}
                  <div className="border-t border-amber-100 bg-amber-50/15 p-5 max-h-[50vh] overflow-y-auto">
                    
                    {/* BILLING CALCULATION */}
                    <div className="space-y-1.5 pb-4 border-b border-amber-100 text-xs md:text-sm text-amber-900">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-mono font-semibold">${itemsSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fulfillment ({fulfillment === 'delivery' ? 'Express' : 'Pickup'}):</span>
                        <span className="font-mono font-semibold">
                          {fulfillment === 'delivery' ? '+$10.00' : 'Free'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Baking Sales Tax (8%):</span>
                        <span className="font-mono font-semibold">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-950 text-sm md:text-base pt-1.5 border-t border-amber-100/50">
                        <span>Estimated Total:</span>
                        <span className="font-mono">${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* CLIENT DETAILS CHECKOUT FORM */}
                    <form onSubmit={handleCheckout} className="space-y-4 pt-4">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase block">Fulfillment Details</span>
                      
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-amber-700" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl outline-none text-xs text-amber-950 focus:border-amber-500 transition-colors"
                        />
                        {errors.name && <p className="text-[10px] text-red-600 font-medium">{errors.name}</p>}
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-amber-700" />
                          WhatsApp Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +1 555-019-9000"
                          className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl outline-none text-xs text-amber-950 focus:border-amber-500 transition-colors"
                        />
                        {errors.phone && <p className="text-[10px] text-red-600 font-medium">{errors.phone}</p>}
                      </div>

                      {/* Fulfillment Type */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFulfillment('pickup')}
                          className={`py-2 px-3.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            fulfillment === 'pickup'
                              ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                              : 'bg-white hover:bg-amber-50/40 text-amber-900 border-amber-100'
                          }`}
                        >
                          <Store className="h-3.5 w-3.5" />
                          Store Pickup
                        </button>
                        <button
                          type="button"
                          onClick={() => setFulfillment('delivery')}
                          className={`py-2 px-3.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            fulfillment === 'delivery'
                              ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                              : 'bg-white hover:bg-amber-50/40 text-amber-900 border-amber-100'
                          }`}
                        >
                          <Truck className="h-3.5 w-3.5" />
                          Delivery (+$10)
                        </button>
                      </div>

                      {/* Address conditional input */}
                      {fulfillment === 'delivery' && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top duration-200">
                          <label className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-amber-700" />
                            Delivery Address *
                          </label>
                          <textarea
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street Name, Apt #, City, Zip"
                            rows={2}
                            className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl outline-none text-xs text-amber-950 focus:border-amber-500 transition-colors resize-none"
                          />
                          {errors.address && <p className="text-[10px] text-red-600 font-medium">{errors.address}</p>}
                        </div>
                      )}

                      {/* Date & Time selectors */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-amber-700" />
                            Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl outline-none text-xs text-amber-950 focus:border-amber-500 transition-colors"
                          />
                          {errors.date && <p className="text-[10px] text-red-600 font-medium">{errors.date}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-amber-700" />
                            Time *
                          </label>
                          <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl outline-none text-xs text-amber-950 focus:border-amber-500 transition-colors"
                          />
                          {errors.time && <p className="text-[10px] text-red-600 font-medium">{errors.time}</p>}
                        </div>
                      </div>

                      {/* Special instructions */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-amber-950 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-amber-700" />
                          Special Baking Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Allergies, door codes, eggless requirements, etc."
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-amber-100 rounded-xl outline-none text-xs text-amber-950 focus:border-amber-500 transition-colors resize-none"
                        />
                      </div>

                      {/* WHATSAPP RECIPIENT SETTING */}
                      <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <MessageCircle className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                            Send Order Details To
                          </label>
                          <span className="text-[10px] font-mono text-emerald-800 font-semibold bg-emerald-100/60 border border-emerald-300 px-2 py-0.5 rounded-full">
                            Real WhatsApp Direct
                          </span>
                        </div>

                        {/* Recipient Mode Tabs */}
                        <div className="grid grid-cols-3 gap-1.5 p-1 bg-amber-100/60 rounded-xl text-[11px] font-medium text-amber-900">
                          <button
                            type="button"
                            onClick={() => setRecipientType('bakery')}
                            className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition-all ${
                              recipientType === 'bakery'
                                ? 'bg-white font-bold text-amber-950 shadow-xs'
                                : 'hover:text-amber-950'
                            }`}
                          >
                            Bakery Phone
                          </button>
                          <button
                            type="button"
                            onClick={() => setRecipientType('customer')}
                            className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition-all ${
                              recipientType === 'customer'
                                ? 'bg-white font-bold text-amber-950 shadow-xs'
                                : 'hover:text-amber-950'
                            }`}
                          >
                            My Number
                          </button>
                          <button
                            type="button"
                            onClick={() => setRecipientType('custom')}
                            className={`py-1.5 px-2 rounded-lg text-center cursor-pointer transition-all ${
                              recipientType === 'custom'
                                ? 'bg-white font-bold text-amber-950 shadow-xs'
                                : 'hover:text-amber-950'
                            }`}
                          >
                            Any Person
                          </button>
                        </div>

                        {/* Tab Content: Bakery Phone */}
                        {recipientType === 'bakery' && (
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200">
                              <div>
                                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-mono">Bakery Orders Desk:</span>
                                <span className="font-mono font-bold text-amber-950">
                                  +{cleanWhatsAppNumber(bakeryPhone || '15550199000')}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditingBakeryNum(!isEditingBakeryNum);
                                  setTempBakeryPhone(bakeryPhone || '15550199000');
                                }}
                                className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer underline"
                              >
                                <Edit2 className="h-3 w-3" />
                                {isEditingBakeryNum ? 'Cancel' : 'Change Number'}
                              </button>
                            </div>

                            {isEditingBakeryNum && (
                              <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-2 animate-in fade-in">
                                <label className="text-[11px] font-semibold text-amber-950 block">
                                  Set Bakery Store WhatsApp Number:
                                </label>
                                <input
                                  type="tel"
                                  value={tempBakeryPhone}
                                  onChange={(e) => setTempBakeryPhone(e.target.value)}
                                  placeholder="e.g. 14155552671 or 919876543210"
                                  className="w-full px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs font-mono text-amber-950 outline-none focus:border-amber-500"
                                />
                                <p className="text-[10px] text-stone-500 leading-tight">
                                  Enter country code followed by phone number digits (e.g. 1 for US/Canada, 91 for India, 44 for UK).
                                </p>
                                <div className="flex gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={handleSaveBakeryPhone}
                                    className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                                  >
                                    Save as Default
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsEditingBakeryNum(false)}
                                    className="px-2 py-1 text-stone-600 text-[11px] hover:text-stone-900 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tab Content: Customer Phone */}
                        {recipientType === 'customer' && (
                          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs space-y-1">
                            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-mono">Recipient:</span>
                            <p className="font-semibold text-amber-950">
                              Customer's WhatsApp: <span className="font-mono text-emerald-800">{phone.trim() ? `+${cleanWhatsAppNumber(phone)}` : '(Enter your phone in the form above)'}</span>
                            </p>
                            <p className="text-[10px] text-stone-500 leading-tight">
                              The order details will open in a WhatsApp chat directly to your personal number as a digital receipt.
                            </p>
                          </div>
                        )}

                        {/* Tab Content: Any Custom Phone */}
                        {recipientType === 'custom' && (
                          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs space-y-2">
                            <label className="text-[11px] font-semibold text-amber-950 block">
                              Enter Any Person's Real WhatsApp Number:
                            </label>
                            <input
                              type="tel"
                              value={customPhone}
                              onChange={(e) => setCustomPhone(e.target.value)}
                              placeholder="e.g. +1 415-555-0123 or 919876543210"
                              className="w-full px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs font-mono text-amber-950 outline-none focus:border-amber-500"
                            />
                            {customPhone.trim() && (
                              <p className="text-[10px] font-mono text-emerald-700 font-medium">
                                Ready for WhatsApp API: +{cleanWhatsAppNumber(customPhone)}
                              </p>
                            )}
                            <p className="text-[10px] text-stone-500 leading-tight">
                              Enter any real number (e.g. your personal number, friend, baker, event coordinator). WhatsApp will connect directly to this number with the order receipt loaded in the chat!
                            </p>
                            {errors.customPhone && (
                              <p className="text-[10px] text-red-600 font-medium">{errors.customPhone}</p>
                            )}
                          </div>
                        )}

                        {errors.destinationPhone && (
                          <div className="flex items-center gap-1 text-[10px] text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>{errors.destinationPhone}</span>
                          </div>
                        )}
                      </div>

                      {/* Checkout Submit CTA */}
                      <button
                        type="submit"
                        className="w-full mt-4 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-emerald-700"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send Order Receipt to WhatsApp</span>
                      </button>

                      <p className="text-[10px] text-amber-800/60 leading-normal text-center font-medium mt-1">
                        🔒 No payment processed now. Your order receipt config compiles instantly so you can review details direct with our baking team on chat.
                      </p>

                    </form>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
