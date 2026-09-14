import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Phone, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  Store, 
  Eye, 
  Printer, 
  MessageCircle, 
  Trash2, 
  Plus, 
  ChevronDown, 
  DollarSign, 
  ChefHat, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  Check, 
  Copy, 
  X,
  Edit3,
  TrendingUp,
  PackageCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { cleanWhatsAppNumber } from './Cart';

interface OrderHistoryProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateStaffNotes: (orderId: string, notes: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddSampleOrder: () => void;
  onResetSamples: () => void;
}

export default function OrderHistory({
  orders,
  onUpdateOrderStatus,
  onUpdateStaffNotes,
  onDeleteOrder,
  onAddSampleOrder,
  onResetSamples,
}: OrderHistoryProps) {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<'all' | 'pickup' | 'delivery'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');

  // Active editing notes state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  // Receipt Modal State
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) => o.status === 'new' || o.status === 'baking').length;
    const readyOrders = orders.filter((o) => o.status === 'ready').length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + o.grandTotal, 0);

    return {
      totalOrders,
      activeOrders,
      readyOrders,
      completedOrders,
      totalRevenue,
    };
  }, [orders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) return false;

        // Fulfillment filter
        if (fulfillmentFilter !== 'all' && order.fulfillment !== fulfillmentFilter) return false;

        // Search query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchId = order.id.toLowerCase().includes(q);
          const matchName = order.customerName.toLowerCase().includes(q);
          const matchPhone = order.customerPhone.includes(q);
          const matchItem = order.items.some((it) => it.name.toLowerCase().includes(q));
          const matchNotes = (order.specialNotes || '').toLowerCase().includes(q);
          return matchId || matchName || matchPhone || matchItem || matchNotes;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'amount') {
          return b.grandTotal - a.grandTotal;
        }
        return 0;
      });
  }, [orders, statusFilter, fulfillmentFilter, searchTerm, sortBy]);

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          label: 'Received / New',
        };
      case 'baking':
        return {
          bg: 'bg-orange-100 text-orange-900 border-orange-300',
          dot: 'bg-orange-500 animate-pulse',
          label: 'In Prep & Baking',
        };
      case 'ready':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          dot: 'bg-blue-500',
          label: 'Ready for Pickup / Out for Delivery',
        };
      case 'completed':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Completed',
        };
      case 'cancelled':
        return {
          bg: 'bg-stone-100 text-stone-600 border-stone-300',
          dot: 'bg-stone-400',
          label: 'Cancelled',
        };
    }
  };

  const generateWhatsAppUpdateUrl = (order: Order) => {
    const cleanPhone = cleanWhatsAppNumber(order.customerPhone);
    let msg = `Hi ${order.customerName}! 🎂\n`;
    msg += `This is L’Amour Bakery regarding your order *${order.id}*.\n\n`;

    if (order.status === 'new') {
      msg += `We have received your order details and scheduled it in our kitchen for ${order.requestedDate} at ${order.requestedTime}.\n`;
    } else if (order.status === 'baking') {
      msg += `Great news! Our pastry chefs are currently hand-crafting and baking your order fresh today.\n`;
    } else if (order.status === 'ready') {
      if (order.fulfillment === 'pickup') {
        msg += `Your order is freshly boxed, decorated, and *ready for pickup* at our bakery counter!\n`;
      } else {
        msg += `Your order is freshly packed and dispatched with our delivery courier!\n`;
      }
    } else if (order.status === 'completed') {
      msg += `Thank you for picking up your L’Amour Bakery creation! We hope you and your guests enjoy every single bite. 🥐✨\n`;
    } else if (order.status === 'cancelled') {
      msg += `Your order *${order.id}* has been updated to cancelled. Please let us know if you need assistance.\n`;
    }

    msg += `\nTotal: $${order.grandTotal.toFixed(2)}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  };

  const handleStartEditingNotes = (order: Order) => {
    setEditingNotesId(order.id);
    setTempNotes(order.staffNotes || '');
  };

  const handleSaveNotes = (orderId: string) => {
    onUpdateStaffNotes(orderId, tempNotes);
    setEditingNotesId(null);
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (3600 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="py-10 bg-amber-50/15 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Owner Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-amber-200/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-amber-800 text-amber-100 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
                Owner Portal
              </span>
              <span className="text-xs font-mono text-amber-700">Kitchen & Order Desk</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950 tracking-tight">
              Order History & Tracking
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Monitor incoming bespoke cake commissions, track kitchen baking statuses, review full customer specifications, and send instant WhatsApp dispatch updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onAddSampleOrder}
              className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Simulate a new incoming customer order"
            >
              <Plus className="h-3.5 w-3.5" />
              Simulate Test Order
            </button>
            <button
              onClick={onResetSamples}
              className="px-3 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reload sample orders"
            >
              <RefreshCw className="h-3.5 w-3.5 text-stone-500" />
              Reset Demo Orders
            </button>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-100 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-medium">Total Orders</span>
              <ClipboardList className="h-4 w-4 text-amber-700" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">{stats.totalOrders}</p>
            <p className="text-[10px] text-stone-400 mt-1">All logged records</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-orange-200 shadow-xs">
            <div className="flex items-center justify-between text-orange-700 mb-2">
              <span className="text-xs font-medium">In Baking & Prep</span>
              <ChefHat className="h-4 w-4 text-orange-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-orange-950">{stats.activeOrders}</p>
            <p className="text-[10px] text-orange-700/80 mt-1">Requires kitchen attention</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200 shadow-xs">
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-medium">Ready for Pickup</span>
              <PackageCheck className="h-4 w-4 text-blue-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-blue-950">{stats.readyOrders}</p>
            <p className="text-[10px] text-blue-700/80 mt-1">Boxed & awaiting handover</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-medium">Completed</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950">{stats.completedOrders}</p>
            <p className="text-[10px] text-emerald-700/80 mt-1">Fulfilled successfully</p>
          </div>

          <div className="bg-amber-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-amber-200 mb-2">
              <span className="text-xs font-medium">Gross Revenue</span>
              <TrendingUp className="h-4 w-4 text-amber-300" />
            </div>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-50">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-[10px] text-amber-300/80 mt-1">Subtotal + tax + delivery</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Box */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID (#ORD-), Customer Name, Phone, or Pastry..."
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:bg-white focus:border-amber-700 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Fulfillment Filter */}
            <div className="md:col-span-3">
              <select
                value={fulfillmentFilter}
                onChange={(e) => setFulfillmentFilter(e.target.value as any)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:border-amber-700 focus:outline-none"
              >
                <option value="all">All Fulfillment Methods</option>
                <option value="pickup">Store Pickup</option>
                <option value="delivery">Local Delivery</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:border-amber-700 focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="amount">Sort: Highest Total Amount</option>
              </select>
            </div>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 text-[11px] font-medium mr-1 shrink-0">Filter Status:</span>
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'new', label: 'New / Received', count: orders.filter(o => o.status === 'new').length },
              { id: 'baking', label: 'In Baking', count: orders.filter(o => o.status === 'baking').length },
              { id: 'ready', label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
              { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
              { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  statusFilter === tab.id ? 'bg-amber-800 text-amber-100' : 'bg-stone-200 text-stone-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List / Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-800">
              <ClipboardList className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-950">No orders match your filter</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Try adjusting your search criteria or status filter. You can also generate a simulated test order to test kitchen workflows.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setFulfillmentFilter('all');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={onAddSampleOrder}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Add Sample Order
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusCfg = getStatusColor(order.status);

              return (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50/40 via-white to-transparent border-b border-amber-100/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Order ID with Copy */}
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-amber-950 text-sm sm:text-base">
                          {order.id}
                        </span>
                        <button
                          onClick={() => handleCopyOrderId(order.id)}
                          className="p-1 text-stone-400 hover:text-amber-800 rounded transition-colors"
                          title="Copy Order ID"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Created Time Badge */}
                      <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(order.createdAt)} • {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {/* Fulfillment Method Badge */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.fulfillment === 'delivery'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {order.fulfillment === 'delivery' ? (
                          <>
                            <Truck className="h-3 w-3" />
                            Delivery
                          </>
                        ) : (
                          <>
                            <Store className="h-3 w-3" />
                            Store Pickup
                          </>
                        )}
                      </span>

                      {/* Scheduled Fulfillment Target */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                        <Calendar className="h-3 w-3 text-stone-500" />
                        Target: {order.requestedDate} @ {order.requestedTime}
                      </span>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 font-medium">Status:</span>
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`appearance-none pl-6 pr-8 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${statusCfg.bg}`}
                        >
                          <option value="new">Received / New</option>
                          <option value="baking">In Prep & Baking</option>
                          <option value="ready">Ready for Handover</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Order Body Details */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: Customer & Requested Info (4 cols) */}
                    <div className="lg:col-span-4 space-y-4 border-b lg:border-b-0 lg:border-r border-amber-100/70 lg:pr-6">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider block mb-1">
                          Customer Contact
                        </span>
                        <h4 className="font-serif text-lg font-bold text-amber-950">
                          {order.customerName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`https://wa.me/${cleanWhatsAppNumber(order.customerPhone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-semibold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-600" />
                            +{cleanWhatsAppNumber(order.customerPhone)}
                          </a>
                        </div>
                      </div>

                      {order.fulfillment === 'delivery' && order.deliveryAddress && (
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-purple-900 tracking-wider block mb-1">
                            Delivery Destination
                          </span>
                          <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200 flex items-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-purple-700 shrink-0 mt-0.5" />
                            <span>{order.deliveryAddress}</span>
                          </p>
                        </div>
                      )}

                      {order.specialNotes && (
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider block mb-1">
                            Customer Special Instructions
                          </span>
                          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 italic">
                            "{order.specialNotes}"
                          </div>
                        </div>
                      )}

                      {/* Internal Staff Notes */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-stone-500 tracking-wider">
                            Kitchen Staff Notes
                          </span>
                          {editingNotesId !== order.id && (
                            <button
                              onClick={() => handleStartEditingNotes(order)}
                              className="text-[10px] text-amber-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Edit3 className="h-2.5 w-2.5" />
                              {order.staffNotes ? 'Edit Note' : 'Add Note'}
                            </button>
                          )}
                        </div>

                        {editingNotesId === order.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={tempNotes}
                              onChange={(e) => setTempNotes(e.target.value)}
                              placeholder="e.g., Cake sponges baked, candles placed in box..."
                              rows={2}
                              className="w-full p-2 text-xs border border-amber-300 rounded-xl focus:outline-none focus:border-amber-700"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-2 py-1 text-[10px] text-stone-500 hover:text-stone-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNotes(order.id)}
                                className="px-2.5 py-1 text-[10px] bg-amber-800 text-white rounded-lg font-semibold"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                            {order.staffNotes || <span className="text-stone-400 italic">No internal kitchen notes recorded yet.</span>}
                          </p>
                        )}
                      </div>

                      {/* WhatsApp Direct Action Button */}
                      <div className="pt-2">
                        <a
                          href={generateWhatsAppUpdateUrl(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Send WhatsApp Status Update
                        </a>
                      </div>
                    </div>

                    {/* Right Column: Ordered Items & Full Breakdown (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-3">
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider">
                            Itemized Order Contents ({order.items.reduce((acc, it) => acc + it.quantity, 0)} items)
                          </span>
                          <span className="text-xs text-stone-400 font-mono">Kitchen Spec</span>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, idx) => {
                            const isCustom = item.type === 'custom';

                            return (
                              <div
                                key={idx}
                                className="p-3.5 bg-stone-50/70 hover:bg-stone-50 rounded-2xl border border-stone-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                              >
                                <div className="flex items-start gap-3">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      referrerPolicy="no-referrer"
                                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 bg-white"
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                                      <ChefHat className="h-6 w-6" />
                                    </div>
                                  )}

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-sm font-bold text-amber-950">
                                        {item.name}
                                      </h5>
                                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-mono text-[10px] font-bold">
                                        x{item.quantity}
                                      </span>
                                    </div>

                                    {/* Granular Custom Cake Specs */}
                                    {isCustom && item.details ? (
                                      <div className="mt-1.5 space-y-1 text-xs text-stone-600">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                            {item.details.size}
                                          </span>
                                          <span>• Sponge: <strong>{item.details.flavor}</strong></span>
                                          <span>• Filling: <strong>{item.details.filling}</strong></span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span>Frosting: {item.details.frosting}</span>
                                          {item.details.colorHex && (
                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-stone-200 text-[11px]">
                                              <span
                                                className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                                                style={{ backgroundColor: item.details.colorHex }}
                                              />
                                              {item.details.color}
                                            </span>
                                          )}
                                        </div>

                                        {item.details.toppings && item.details.toppings.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            <span className="text-[10px] text-stone-400">Toppings:</span>
                                            {item.details.toppings.map((t, tidx) => (
                                              <span key={tidx} className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-200 text-stone-700">
                                                {t}
                                              </span>
                                            ))}
                                          </div>
                                        )}

                                        {item.details.writing && (
                                          <div className="mt-1 text-amber-900 font-serif italic text-xs bg-amber-50/80 px-2 py-1 rounded border border-amber-200/50">
                                            Piping Lettering: "{item.details.writing}"
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-stone-500 mt-0.5">
                                        {item.details?.category ? `${item.details.category} selection` : 'Bakery standard fresh menu'}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right shrink-0 self-end sm:self-center">
                                  <span className="text-xs text-stone-400 block">${item.unitPrice.toFixed(2)} ea</span>
                                  <span className="font-mono font-bold text-amber-950 text-sm">${item.totalPrice.toFixed(2)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Billing & Action Row */}
                      <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs text-stone-600">
                          <div>Subtotal: <strong className="text-amber-950 font-mono">${order.subtotal.toFixed(2)}</strong></div>
                          {order.deliveryFee > 0 && (
                            <div>Delivery: <strong className="text-amber-950 font-mono">${order.deliveryFee.toFixed(2)}</strong></div>
                          )}
                          <div>Tax: <strong className="text-amber-950 font-mono">${order.tax.toFixed(2)}</strong></div>
                          <div className="text-sm font-bold text-amber-950 bg-amber-100/60 px-2.5 py-1 rounded-lg">
                            Grand Total: <span className="font-mono">${order.grandTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="View printable ticket & invoice"
                          >
                            <Printer className="h-3.5 w-3.5 text-stone-600" />
                            Kitchen Ticket
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
                                onDeleteOrder(order.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete this order record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Printable Kitchen Ticket / Receipt Modal */}
      <AnimatePresence>
        {selectedReceiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-amber-100 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Printer className="h-5 w-5 text-amber-800" />
                  <h3 className="font-serif text-xl font-bold text-amber-950">
                    Kitchen Order Ticket & Receipt
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReceiptOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Receipt Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs">
                <div className="text-center pb-3 border-b border-dashed border-stone-300">
                  <h4 className="font-serif text-lg font-bold text-amber-950">L’Amour Bakery</h4>
                  <p className="text-[10px] text-stone-500">428 Artisanal Row, Sourdough Commons</p>
                  <p className="text-xs font-bold text-amber-900 mt-1">ORDER TICKET #{selectedReceiptOrder.id}</p>
                  <p className="text-[10px] text-stone-400">
                    Logged: {new Date(selectedReceiptOrder.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1 pb-3 border-b border-dashed border-stone-300 text-stone-800">
                  <p><strong>Customer:</strong> {selectedReceiptOrder.customerName}</p>
                  <p><strong>WhatsApp:</strong> +{cleanWhatsAppNumber(selectedReceiptOrder.customerPhone)}</p>
                  <p><strong>Fulfillment:</strong> {selectedReceiptOrder.fulfillment.toUpperCase()}</p>
                  {selectedReceiptOrder.fulfillment === 'delivery' && (
                    <p><strong>Address:</strong> {selectedReceiptOrder.deliveryAddress}</p>
                  )}
                  <p><strong>Fulfillment Slot:</strong> {selectedReceiptOrder.requestedDate} @ {selectedReceiptOrder.requestedTime}</p>
                  <p><strong>Current Status:</strong> {selectedReceiptOrder.status.toUpperCase()}</p>
                </div>

                {selectedReceiptOrder.specialNotes && (
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-950">
                    <strong>Special Instructions:</strong> {selectedReceiptOrder.specialNotes}
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2 pb-3 border-b border-dashed border-stone-300">
                  <p className="font-bold text-stone-900">ITEMS TO PREPARE:</p>
                  {selectedReceiptOrder.items.map((it, idx) => (
                    <div key={idx} className="pl-2 border-l-2 border-amber-300">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{idx + 1}. {it.name} (x{it.quantity})</span>
                        <span>${it.totalPrice.toFixed(2)}</span>
                      </div>
                      {it.details && (
                        <div className="text-[11px] text-stone-600 pl-2">
                          {it.details.size && <div>Size: {it.details.size}</div>}
                          {it.details.flavor && <div>Flavor: {it.details.flavor}</div>}
                          {it.details.filling && <div>Filling: {it.details.filling}</div>}
                          {it.details.frosting && <div>Frosting: {it.details.frosting} ({it.details.color})</div>}
                          {it.details.toppings && it.details.toppings.length > 0 && (
                            <div>Toppings: {it.details.toppings.join(', ')}</div>
                          )}
                          {it.details.writing && (
                            <div className="italic text-amber-900">Piping: "{it.details.writing}"</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-1 text-right text-stone-800">
                  <p>Subtotal: ${selectedReceiptOrder.subtotal.toFixed(2)}</p>
                  {selectedReceiptOrder.deliveryFee > 0 && (
                    <p>Delivery: ${selectedReceiptOrder.deliveryFee.toFixed(2)}</p>
                  )}
                  <p>Tax (8%): ${selectedReceiptOrder.tax.toFixed(2)}</p>
                  <p className="text-sm font-bold text-amber-950 pt-1 border-t border-stone-300">
                    TOTAL DUE: ${selectedReceiptOrder.grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const ticketText = `L'AMOUR BAKERY ORDER #${selectedReceiptOrder.id}\nCustomer: ${selectedReceiptOrder.customerName}\nPhone: ${selectedReceiptOrder.customerPhone}\nDate: ${selectedReceiptOrder.requestedDate} @ ${selectedReceiptOrder.requestedTime}\nTotal: $${selectedReceiptOrder.grandTotal.toFixed(2)}`;
                    navigator.clipboard.writeText(ticketText);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? 'Copied' : 'Copy Ticket Text'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Ticket
                  </button>
                  <button
                    onClick={() => setSelectedReceiptOrder(null)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
