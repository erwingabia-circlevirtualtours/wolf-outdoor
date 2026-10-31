import React, { useState, useMemo } from 'react';
import { 
  Search, CheckCircle2, Clock, Truck, CheckCheck, XCircle, 
  Phone, Mail, MapPin, Download, Edit2, Trash2, AlertCircle, 
  ExternalLink, DollarSign, PackageCheck, FileText, ChevronDown, ChevronUp,
  ArrowRight, ShieldCheck, Check, AlertTriangle, Lock
} from 'lucide-react';
import { StoreOrder, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  ORDER_FSM_TRANSITIONS, 
  ORDER_STATUS_METADATA, 
  canTransitionOrderState, 
  validateOrderTransition,
  validateGcashReferenceInput,
  formatGcashReferenceDisplay,
  sanitizeGcashReference
} from '../../lib/validations';

const PIPELINE_STEPS: OrderStatus[] = [
  'pending_payment',
  'verified',
  'preparing',
  'dispatched',
  'completed'
];

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderNotes, deleteOrder } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Toast / notification feedback
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // GCash Verification Modal
  const [verifyingOrder, setVerifyingOrder] = useState<StoreOrder | null>(null);
  const [verifyGcashRef, setVerifyGcashRef] = useState('');
  const [verifyGcashError, setVerifyGcashError] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery) ||
        (order.email && order.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.cityRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.paymentReference && order.paymentReference.includes(searchQuery));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Key metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'pending_payment').length;
  const verifiedCount = orders.filter(o => o.status === 'verified').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;

  const handleStartEditNotes = (order: StoreOrder) => {
    setEditingNotesId(order.id);
    setTempNotes(order.staffNotes || '');
  };

  const handleSaveNotes = (orderId: string) => {
    updateOrderNotes(orderId, tempNotes.trim());
    setEditingNotesId(null);
    showToast('success', `Staff note saved for order ${orderId}`);
  };

  const handleStatusChange = (order: StoreOrder, newStatus: OrderStatus) => {
    if (order.status === newStatus) return;

    // Check if transitioning to verified with GCash
    if (order.status === 'pending_payment' && newStatus === 'verified' && order.paymentOption === 'GCash') {
      const currentRef = order.paymentReference ? sanitizeGcashReference(order.paymentReference) : '';
      if (currentRef.length !== 13) {
        setVerifyingOrder(order);
        setVerifyGcashRef(currentRef);
        setVerifyGcashError(null);
        return;
      }
    }

    const res = updateOrderStatus(order.id, newStatus);
    if (res.success) {
      showToast('success', `Order ${order.id} transitioned to: ${ORDER_STATUS_METADATA[newStatus].label}`);
    } else {
      showToast('error', res.error || 'Cannot transition order status');
    }
  };

  const handleConfirmGcashVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;

    const validation = validateGcashReferenceInput(verifyGcashRef);
    if (!validation.isValid) {
      setVerifyGcashError(validation.error || '13-digit GCash reference required');
      return;
    }

    const res = updateOrderStatus(verifyingOrder.id, 'verified', { gcashRef: validation.cleaned });
    if (res.success) {
      showToast('success', `GCash Ref ${validation.cleaned} verified! Order moved to "Payment Verified"`);
      setVerifyingOrder(null);
      setVerifyGcashRef('');
      setVerifyGcashError(null);
    } else {
      setVerifyGcashError(res.error || 'Failed to update order status');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'City/Region', 'Delivery Method', 'Payment Option', 'Payment Ref', 'Subtotal', 'Shipping', 'Total', 'Status', 'Notes'];
    const rows = orders.map(o => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.email || ''}"`,
      `"${o.cityRegion}"`,
      `"${o.deliveryMethod}"`,
      `"${o.paymentOption}"`,
      `"${o.paymentReference || ''}"`,
      o.subtotal,
      o.shipping,
      o.total,
      `"${o.status}"`,
      `"${(o.staffNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wolf_orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-200' 
            : 'bg-red-950/80 border-red-600/70 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#12151c] p-3.5 rounded-xl border border-[#222a3a]">
          <span className="text-slate-400 text-xs font-mono block">Total Gear Revenue</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
            ₱{totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">{orders.length} lifetime orders</span>
        </div>

        <div className="bg-[#12151c] p-3.5 rounded-xl border border-[#222a3a]">
          <span className="text-amber-400 text-xs font-mono block">Needs Verification</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
            {pendingCount}
          </div>
          <span className="text-[10px] text-slate-500">Stage 1: Pending GCash</span>
        </div>

        <div className="bg-[#12151c] p-3.5 rounded-xl border border-[#222a3a]">
          <span className="text-emerald-400 text-xs font-mono block">Payment Confirmed</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
            {verifiedCount}
          </div>
          <span className="text-[10px] text-slate-500">Stage 2: Ready to pack</span>
        </div>

        <div className="bg-[#12151c] p-3.5 rounded-xl border border-[#222a3a]">
          <span className="text-blue-400 text-xs font-mono block">In Basecamp Prep</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
            {preparingCount}
          </div>
          <span className="text-[10px] text-slate-500">Stage 3: Packing at Cumba</span>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#12151c] p-3.5 rounded-xl border border-[#222a3a]">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, phone, GCash ref..."
            className="w-full bg-[#0c0e12] border border-[#2b3344] focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-300 hover:text-white border border-[#2e3747] text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export Orders to CSV</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
              : 'bg-[#141820] text-slate-400 border-[#222a3a] hover:text-white'
          }`}
        >
          All Orders ({orders.length})
        </button>

        {(['pending_payment', 'verified', 'preparing', 'dispatched', 'completed', 'cancelled'] as const).map(st => {
          const count = orders.filter(o => o.status === st).length;
          const meta = ORDER_STATUS_METADATA[st];
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                statusFilter === st
                  ? `${meta.badgeBg} ring-1 ring-emerald-500/30 font-bold`
                  : 'bg-[#141820] text-slate-400 border-[#222a3a] hover:text-white'
              }`}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-[#12151c] border border-[#222a3a] rounded-xl p-12 text-center text-slate-500">
            <PackageCheck className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-medium">No orders found matching the filter</p>
            <p className="text-xs text-slate-600 mt-1">Orders placed on storefront checkout or admin will appear here in real-time</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const statusMeta = ORDER_STATUS_METADATA[order.status];
            const allowedTransitions = ORDER_FSM_TRANSITIONS[order.status] || [];
            const isTerminal = order.status === 'completed' || order.status === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-[#12151c] border border-[#222a3a] hover:border-[#2f394d] rounded-xl overflow-hidden transition-all shadow-md"
              >
                {/* Header Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0e1015]/70 border-b border-[#1f2635]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-sm text-emerald-400 tracking-wider">
                      {order.id}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusMeta.badgeBg}`}>
                      {statusMeta.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#1c222e] text-slate-300 font-medium">
                      {order.deliveryMethod === 'pickup' ? '📍 Basecamp Pickup' : '🚚 CALABARZON Delivery'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Total Order Amount</div>
                      <div className="font-mono font-bold text-base sm:text-lg text-white">
                        ₱{order.total.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-1.5 rounded-lg bg-[#1a202c] hover:bg-[#252e3e] text-slate-300 hover:text-white border border-[#2b3344] transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand order details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* State Machine Stepper Progress Bar */}
                {order.status !== 'cancelled' ? (
                  <div className="px-4 py-2.5 bg-[#0a0c10] border-b border-[#1a202d] overflow-x-auto">
                    <div className="flex items-center justify-between min-w-[500px] text-[11px] font-mono">
                      {PIPELINE_STEPS.map((stepKey, idx) => {
                        const stepMeta = ORDER_STATUS_METADATA[stepKey];
                        const currentIndex = PIPELINE_STEPS.indexOf(order.status);
                        const isPast = currentIndex > idx;
                        const isCurrent = currentIndex === idx;

                        return (
                          <React.Fragment key={stepKey}>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                                isCurrent
                                  ? 'bg-emerald-500 text-black border-emerald-400 ring-2 ring-emerald-500/30'
                                  : isPast
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-600/50'
                                    : 'bg-[#151922] text-slate-500 border-[#242c3d]'
                              }`}>
                                {isPast ? <Check className="w-3 h-3" /> : idx + 1}
                              </div>
                              <span className={`whitespace-nowrap ${
                                isCurrent 
                                  ? 'text-white font-bold' 
                                  : isPast 
                                    ? 'text-emerald-400/90' 
                                    : 'text-slate-500'
                              }`}>
                                {stepMeta.label.split(' / ')[0]}
                              </span>
                            </div>

                            {idx < PIPELINE_STEPS.length - 1 && (
                              <div className={`flex-1 h-[2px] mx-2 transition-colors ${
                                currentIndex > idx ? 'bg-emerald-600/70' : 'bg-[#1e2535]'
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-red-950/30 border-b border-red-900/40 text-xs text-red-400 font-mono flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>This order has been cancelled and voided from active inventory fulfillment.</span>
                  </div>
                )}

                {/* Primary Info Row */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Customer Information */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">
                      Customer & Destination
                    </span>
                    <div className="font-semibold text-white text-sm">
                      {order.customerName}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <a href={`tel:${order.phone}`} className="hover:text-emerald-400 font-mono">
                        {order.phone}
                      </a>
                    </div>
                    {order.email && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{order.email}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{order.address ? `${order.address}, ` : ''}{order.cityRegion}</span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider block">
                      Payment & GCash Status
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Method:</span>
                      <span className="px-2 py-0.5 rounded bg-[#1e2533] text-emerald-300 font-medium font-mono text-[11px]">
                        {order.paymentOption}
                      </span>
                    </div>
                    
                    {order.paymentReference ? (
                      <div className="text-slate-300">
                        <span className="text-slate-500">Ref Code: </span>
                        <span className="font-mono text-emerald-400 font-medium bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          {formatGcashReferenceDisplay(order.paymentReference)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">
                        No payment reference submitted yet
                      </div>
                    )}

                    {/* Quick GCash Verify Action Button */}
                    {order.status === 'pending_payment' && order.paymentOption === 'GCash' && (
                      <button
                        onClick={() => {
                          setVerifyingOrder(order);
                          setVerifyGcashRef(order.paymentReference ? sanitizeGcashReference(order.paymentReference) : '');
                          setVerifyGcashError(null);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify GCash Reference</span>
                      </button>
                    )}
                  </div>

                  {/* Deterministic Status Controller & Next Stage Actions */}
                  <div className="space-y-2">
                    <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider flex items-center justify-between">
                      <span>Order FSM Transition</span>
                      {isTerminal && <span className="text-slate-400 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> Terminal</span>}
                    </span>

                    {/* Quick Next State Transition Action */}
                    {!isTerminal && allowedTransitions.length > 0 && (
                      <div className="flex items-center gap-2">
                        {allowedTransitions.filter(s => s !== 'cancelled').map(nextStatus => (
                          <button
                            key={nextStatus}
                            onClick={() => handleStatusChange(order, nextStatus)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs border border-emerald-500/40 shadow-sm transition-colors"
                          >
                            <span>Next: {ORDER_STATUS_METADATA[nextStatus].label.split(' / ')[0]}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Controlled Status Selector enforcing FSM */}
                    <select
                      value={order.status}
                      disabled={isTerminal}
                      onChange={e => handleStatusChange(order, e.target.value as OrderStatus)}
                      className={`w-full bg-[#0c0e12] border ${
                        isTerminal ? 'border-[#1f2633] text-slate-500 cursor-not-allowed' : 'border-[#2b3344] focus:border-emerald-500 text-white'
                      } rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none`}
                    >
                      <option value={order.status} disabled>
                        Current: {ORDER_STATUS_METADATA[order.status].label}
                      </option>
                      {allowedTransitions.map(st => (
                        <option key={st} value={st}>
                          → Transition to: {ORDER_STATUS_METADATA[st].label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleStartEditNotes(order)}
                        className="text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1 text-[11px]"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{order.staffNotes ? 'Edit Staff Note' : 'Add Staff Note'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete order record ${order.id}?`)) {
                            deleteOrder(order.id);
                            showToast('success', `Order ${order.id} deleted.`);
                          }
                        }}
                        className="text-slate-500 hover:text-red-400 inline-flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Staff Notes Banner if present */}
                {order.staffNotes && editingNotesId !== order.id && (
                  <div className="mx-4 mb-3 p-2.5 rounded-lg bg-[#0e1015] border border-[#222a3a] text-xs text-slate-300 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="text-slate-400 text-[10px] uppercase font-mono block">Staff Notes:</strong>
                      <span>{order.staffNotes}</span>
                    </div>
                  </div>
                )}

                {/* Notes Inline Editor */}
                {editingNotesId === order.id && (
                  <div className="mx-4 mb-3 p-3 rounded-lg bg-[#0e1015] border border-emerald-500/40 space-y-2">
                    <label className="text-[11px] font-medium text-slate-300 block">
                      Internal Basecamp Staff Notes (e.g. Courier tracking #, GCash sender name)
                    </label>
                    <textarea
                      rows={2}
                      value={tempNotes}
                      onChange={e => setTempNotes(e.target.value)}
                      placeholder="Add tracking number, confirmation notes..."
                      className="w-full bg-[#141820] border border-[#2b3344] focus:border-emerald-500 rounded-lg p-2 text-xs text-white outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2.5 py-1 rounded bg-[#1f2633] text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(order.id)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded Itemized Gear List */}
                {isExpanded && (
                  <div className="p-4 bg-[#0a0c10] border-t border-[#1f2635] space-y-3">
                    <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Ordered Gear Items ({order.items.reduce((s, i) => s + i.quantity, 0)} items)
                    </h5>

                    <div className="divide-y divide-[#181e2b]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#2b3344] bg-black shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{item.name}</div>
                              <div className="text-[11px] text-slate-400 flex gap-2">
                                {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right font-mono">
                            <div className="text-white font-semibold">
                              ₱{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              ₱{item.price.toLocaleString()} each
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#1f2635] flex justify-end">
                      <div className="w-64 space-y-1 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>Subtotal:</span>
                          <span>₱{order.subtotal.toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Discount:</span>
                            <span>-₱{order.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-400">
                          <span>Delivery Fee:</span>
                          <span>₱{order.shipping.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-white font-bold text-sm border-t border-[#222a3a] pt-1">
                          <span>Final Total:</span>
                          <span className="text-emerald-400">₱{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* GCash Verification Modal */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-slate-100">
          <div 
            className="w-full max-w-md bg-[#141820] border border-[#2b3344] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#222a3a] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    Verify GCash Payment
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Order: {verifyingOrder.id} · ₱{verifyingOrder.total.toLocaleString()}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setVerifyingOrder(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmGcashVerification} className="space-y-4">
              <div className="text-xs text-slate-300">
                Confirm the 13-digit GCash transaction reference number received on the WOLF merchant account (<span className="text-emerald-400 font-mono font-bold">0956 369 5062</span>).
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  13-Digit GCash Reference Number *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  autoFocus
                  placeholder="e.g. 9021 4820 19481"
                  value={formatGcashReferenceDisplay(verifyGcashRef)}
                  onChange={e => {
                    setVerifyGcashRef(sanitizeGcashReference(e.target.value));
                    setVerifyGcashError(null);
                  }}
                  className={`w-full bg-[#0a0c10] border ${
                    verifyGcashError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2b3344] focus:border-emerald-500'
                  } rounded-lg px-3 py-2 text-sm text-white font-mono tracking-widest outline-none`}
                />
                {verifyGcashError ? (
                  <p className="text-[11px] text-red-400 mt-1 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{verifyGcashError}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Must be exactly 13 digits to satisfy FSM payment verification guard.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222a3a]">
                <button
                  type="button"
                  onClick={() => setVerifyingOrder(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#1f2633] text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Confirm & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
