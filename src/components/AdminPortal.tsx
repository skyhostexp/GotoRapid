import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  User, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  RotateCcw, 
  LogOut, 
  Eye, 
  EyeOff, 
  Coins, 
  ArrowLeft, 
  DollarSign, 
  Package, 
  Check, 
  Copy, 
  Layers, 
  Settings, 
  FileSpreadsheet,
  TrendingUp,
  Globe,
  Sparkles,
  Send,
  Building2,
  Users,
  Star
} from 'lucide-react';
import { 
  AdminOrder, 
  getStoredOrders, 
  saveOrders, 
  updateOrderStatus, 
  deleteOrder, 
  addOrder, 
  resetOrdersToDefault,
  checkAdminAuth,
  setAdminAuth,
  DEFAULT_ADMIN_CREDENTIALS
} from '../utils/orderStorage';
import { PRODUCTS } from '../data/products';
import { ProductCategory } from '../types';

interface AdminPortalProps {
  onBackToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToStore }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Data State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'create-order' | 'inventory' | 'settings'>('orders');
  
  // Filtering & Search
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Inventory custom stock state
  const [stockOverrides, setStockOverrides] = useState<Record<string, { inStock: boolean; stockCount: number }>>(() => {
    try {
      const saved = localStorage.getItem('gotorapid_stock_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Settings State
  const [adminUsername, setAdminUsername] = useState<string>(() => {
    return localStorage.getItem('gotorapid_admin_custom_user') || DEFAULT_ADMIN_CREDENTIALS.username;
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('gotorapid_admin_custom_pass') || DEFAULT_ADMIN_CREDENTIALS.password;
  });
  const [telegramHandle, setTelegramHandle] = useState<string>(() => {
    return localStorage.getItem('gotorapid_admin_custom_tg') || '@Go2Rapid';
  });

  // Manual Order Form State
  const [manualCustomerEmail, setManualCustomerEmail] = useState('');
  const [manualTelegram, setManualTelegram] = useState('');
  const [manualProduct, setManualProduct] = useState(PRODUCTS[0].name);
  const [manualCategory, setManualCategory] = useState<string>('Bank Accounts');
  const [manualPriceUsd, setManualPriceUsd] = useState(250);
  const [manualCryptoCoin, setManualCryptoCoin] = useState('USDT (TRC-20)');
  const [manualNotes, setManualNotes] = useState('');

  // Notification Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Load orders and auth status
  useEffect(() => {
    const isAuth = checkAdminAuth();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setOrders(getStoredOrders());
    }
  }, []);

  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const validUser = adminUsername;
    const validPass = adminPassword;

    if (loginUsername.trim() === validUser && loginPassword.trim() === validPass) {
      setAdminAuth(true);
      setIsAuthenticated(true);
      setOrders(getStoredOrders());
      showToast('Admin access granted. Welcome back!');
    } else {
      setLoginError('Invalid administrator credentials. Please check username & password.');
    }
  };

  const handleQuickFillDemo = () => {
    setLoginUsername(adminUsername);
    setLoginPassword(adminPassword);
    setLoginError(null);
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    setLoginPassword('');
    showToast('Logged out of Admin Portal.');
  };

  // Status Change Handler
  const handleStatusChange = (orderId: string, newStatus: AdminOrder['status']) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Order #${orderId} status changed to "${newStatus}"`);
  };

  // Delete Order Handler
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}? This cannot be undone.`)) {
      const updated = deleteOrder(orderId);
      setOrders(updated);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
      showToast(`Order #${orderId} has been deleted.`);
    }
  };

  // Reset to default seed orders
  const handleResetOrders = () => {
    if (window.confirm('Reset all order data to initial demo orders?')) {
      const reset = resetOrdersToDefault();
      setOrders(reset);
      showToast('Order database reset to defaults.');
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Create Manual Order Handler
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerEmail) {
      alert('Please enter a customer email.');
      return;
    }

    const orderId = `GR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrd = addOrder({
      id: orderId,
      orderNumber: orderId,
      customerEmail: manualCustomerEmail,
      telegramUsername: manualTelegram || undefined,
      items: [
        {
          productId: 'custom-manual-item',
          productName: manualProduct,
          category: manualCategory,
          quantity: 1,
          priceUsd: Number(manualPriceUsd),
          customRequirements: manualNotes
        }
      ],
      totalUsd: Number(manualPriceUsd),
      discountPercent: 0,
      paymentMethod: 'Manual',
      cryptoCoin: manualCryptoCoin,
      cryptoNetwork: manualCryptoCoin.includes('TRC') ? 'TRON' : 'Mainnet',
      cryptoAmount: `${manualPriceUsd} USDT Equivalent`,
      status: 'Delivered',
      deliveryVaultId: `VAULT-MANUAL-${Math.floor(1000 + Math.random() * 9000)}-AES256`,
      masterDecryptionKey: `GOTORAPID-${orderId}-VAULT-KEY-AES256`,
      proxyAssigned: 'Dedicated Residential Static Proxy (Port 8443)',
      warrantyDays: 30,
      warrantyValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      adminNotes: manualNotes || 'Direct manual order created by admin'
    });

    refreshOrders();
    setActiveTab('orders');
    setSelectedOrder(newOrd);
    showToast(`Created manual order #${orderId}!`);

    // Reset fields
    setManualCustomerEmail('');
    setManualTelegram('');
    setManualNotes('');
  };

  // Stock Override toggle
  const handleToggleStock = (productId: string, currentInStock: boolean, currentCount: number) => {
    const updated = {
      ...stockOverrides,
      [productId]: {
        inStock: !currentInStock,
        stockCount: !currentInStock ? Math.max(currentCount, 5) : 0
      }
    };
    setStockOverrides(updated);
    localStorage.setItem('gotorapid_stock_overrides', JSON.stringify(updated));
    showToast(`Stock updated for item`);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gotorapid_admin_custom_user', adminUsername);
    localStorage.setItem('gotorapid_admin_custom_pass', adminPassword);
    localStorage.setItem('gotorapid_admin_custom_tg', telegramHandle);
    showToast('Admin credentials & settings successfully saved!');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer Email', 'Telegram', 'Total USD', 'Crypto Paid', 'Status', 'Vault Key', 'Proxy'];
    const rows = orders.map(o => [
      o.orderNumber,
      new Date(o.createdAt).toLocaleString(),
      o.customerEmail,
      o.telegramUsername || 'N/A',
      `$${o.totalUsd}`,
      o.cryptoAmount,
      o.status,
      o.masterDecryptionKey,
      o.proxyAssigned
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gotorapid_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported orders to CSV!');
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'delivered' && order.status !== 'Delivered') return false;
        if (statusFilter === 'escrow' && order.status !== 'Escrow Locked') return false;
        if (statusFilter === 'pending' && !['Pending Verification', 'Processing Vault'].includes(order.status)) return false;
        if (statusFilter === 'refunded' && order.status !== 'Refunded') return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        const hasCat = order.items.some(item => item.category.toLowerCase().includes(categoryFilter.toLowerCase()));
        if (!hasCat) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = order.orderNumber.toLowerCase().includes(q);
        const matchEmail = order.customerEmail.toLowerCase().includes(q);
        const matchTg = order.telegramUsername?.toLowerCase().includes(q) || false;
        const matchTx = order.txHash?.toLowerCase().includes(q) || false;
        const matchItem = order.items.some(i => i.productName.toLowerCase().includes(q));
        if (!matchNum && !matchEmail && !matchTg && !matchTx && !matchItem) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, categoryFilter, searchQuery]);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalRevenueUsd = orders.reduce((sum, o) => sum + (o.status !== 'Refunded' ? o.totalUsd : 0), 0);
    const totalOrdersCount = orders.length;
    const escrowActiveCount = orders.filter(o => o.status === 'Escrow Locked').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length;
    const pendingCount = orders.filter(o => o.status === 'Pending Verification' || o.status === 'Processing Vault').length;
    return {
      totalRevenueUsd,
      totalOrdersCount,
      escrowActiveCount,
      deliveredCount,
      pendingCount
    };
  }, [orders]);

  // If Not Authenticated -> Show Sleek Admin Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100 selection:bg-emerald-500/30">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Back to store link */}
        <div className="absolute top-6 left-6">
          <button
            onClick={onBackToStore}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Login Box */}
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c1220]/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 p-[1px] mx-auto shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full rounded-2xl bg-[#0d1424] flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-['Outfit']">
              gotorapid.com <span className="text-emerald-400">Admin</span>
            </h1>
            <p className="text-xs text-slate-400">
              Order Management & Escrow Fulfillment Console
            </p>
          </div>

          {/* Credentials Notice Box */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Login Credentials</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Authorized Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Username</span>
                <span className="text-white font-bold">{adminUsername}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Password</span>
                <span className="text-emerald-300 font-bold">{adminPassword}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Fill Credentials</span>
            </button>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              Authenticate & Open Order Console
            </button>
          </form>

          <div className="text-center">
            <span className="text-[11px] text-slate-500">
              gotorapid.com • AES-256 Authenticated Session
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Portal View
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col selection:bg-emerald-500/30">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-900 border border-emerald-500/50 text-white text-xs font-bold shadow-2xl shadow-emerald-950/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-[#090e18]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Admin Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold text-white font-['Outfit']">GoTo<span className="text-emerald-400">Rapid</span></span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ADMIN CONSOLE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Escrow Engine v3.4 • Logged in as: <strong className="text-slate-200">{adminUsername}</strong>
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('create-order')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'create-order'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Order</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Stock & Inventory</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>
            </nav>

            {/* Actions: View Storefront & Logout */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={onBackToStore}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <div className="flex md:hidden border-t border-slate-800 py-2 space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('create-order')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === 'create-order' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              + Create Order
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === 'inventory' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === 'settings' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {/* KPI Ribbon Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Volume Processed</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              ${metrics.totalRevenueUsd.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">
              ≈ {(metrics.totalRevenueUsd * 0.999).toFixed(2)} USDT Escrowed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {metrics.totalOrdersCount}
            </div>
            <span className="text-[11px] text-slate-400">
              Across 5 Digital Categories
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active In Escrow</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {metrics.escrowActiveCount}
            </div>
            <span className="text-[11px] text-amber-400/80">
              Held under 24-48h inspection
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Delivered & Validated</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {metrics.deliveredCount}
            </div>
            <span className="text-[11px] text-slate-400">
              100% AES-256 Vault Dispatched
            </span>
          </div>
        </div>

        {/* TAB 1: ORDERS LIST & MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filters and Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Order ID, Email, TXID, TG..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>

              {/* Status & Category Selectors */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="delivered">Delivered</option>
                  <option value="escrow">Escrow Locked</option>
                  <option value="pending">Pending / Processing</option>
                  <option value="refunded">Refunded</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="bank">Bank Accounts</option>
                  <option value="crypto">Crypto Accounts</option>
                  <option value="smm">SMM (Accounts & Services)</option>
                  <option value="review">Reviews Services</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  title="Export orders to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                <button
                  onClick={handleResetOrders}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
                  title="Reset Demo Orders"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Digital Product</th>
                      <th className="py-3.5 px-4">Amount / Crypto</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          No orders match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const statusColors: Record<string, string> = {
                          'Delivered': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                          'Completed': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
                          'Escrow Locked': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                          'Pending Verification': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                          'Processing Vault': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                          'Refunded': 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        };

                        return (
                          <tr 
                            key={order.id}
                            className="hover:bg-slate-800/40 transition cursor-pointer"
                            onClick={() => setSelectedOrder(order)}
                          >
                            {/* Order ID */}
                            <td className="py-3.5 px-4 font-mono font-bold text-white">
                              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-emerald-400">
                                #{order.orderNumber}
                              </span>
                            </td>

                            {/* Customer Email & TG */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{order.customerEmail}</div>
                              {order.telegramUsername && (
                                <div className="text-[11px] text-cyan-400 font-mono">
                                  {order.telegramUsername}
                                </div>
                              )}
                            </td>

                            {/* Digital Product */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="font-medium text-slate-200 truncate">
                                {order.items[0]?.productName || 'Custom Asset'}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {order.items[0]?.category}
                              </div>
                            </td>

                            {/* Amount & Crypto */}
                            <td className="py-3.5 px-4 font-mono">
                              <div className="font-bold text-white">${order.totalUsd}</div>
                              <div className="text-[10px] text-slate-400">{order.cryptoAmount}</div>
                            </td>

                            {/* Status Pill */}
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as AdminOrder['status'])}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${
                                  statusColors[order.status] || 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                <option value="Pending Verification">Pending Verification</option>
                                <option value="Escrow Locked">Escrow Locked</option>
                                <option value="Processing Vault">Processing Vault</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Completed">Completed</option>
                                <option value="Refunded">Refunded</option>
                              </select>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-[11px] text-slate-400 font-mono">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                title="View Full Order Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                                title="Delete Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE MANUAL ORDER */}
        {activeTab === 'create-order' && (
          <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center space-x-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Create Manual / VIP Client Order</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Directly provision an encrypted vault order for private telegram clients or custom volume contracts.
              </p>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Customer Email <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={manualCustomerEmail}
                    onChange={(e) => setManualCustomerEmail(e.target.value)}
                    placeholder="client@agency.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Telegram Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={manualTelegram}
                    onChange={(e) => setManualTelegram(e.target.value)}
                    placeholder="@client_handle"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Select Digital Asset / Service
                  </label>
                  <select
                    value={manualProduct}
                    onChange={(e) => {
                      setManualProduct(e.target.value);
                      const prod = PRODUCTS.find(p => p.name === e.target.value);
                      if (prod) {
                        setManualCategory(prod.categoryLabel);
                        setManualPriceUsd(prod.priceUsd);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {PRODUCTS.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} (${p.priceUsd})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Price in USD ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={manualPriceUsd}
                    onChange={(e) => setManualPriceUsd(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Payment Method / Coin
                </label>
                <select
                  value={manualCryptoCoin}
                  onChange={(e) => setManualCryptoCoin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="BSC">BSC (BNB Smart Chain / BEP-20)</option>
                  <option value="TRX">TRX (TRON / TRC-20)</option>
                  <option value="ETH">Ethereum (ETH / ERC-20)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="LTC">Litecoin (LTC)</option>
                  <option value="DOGE">Dogecoin (DOGE)</option>
                  <option value="Direct Escrow Wire">Direct Escrow Wire</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Custom Requirements / Delivery Instructions
                </label>
                <textarea
                  rows={3}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="e.g. UK LTD company docs, assigned London residential socks5 proxy, drip pace 2 reviews/day"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                Provision & Generate Encrypted Vault Order
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: STOCK & INVENTORY CONTROLLER */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-['Outfit']">
                  Digital Asset Inventory & Stock Status
                </h2>
                <p className="text-xs text-slate-400">
                  Toggle asset availability and live stock levels displayed across the storefront.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {PRODUCTS.length} Total Inventory Items
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUCTS.map((prod) => {
                const override = stockOverrides[prod.id];
                const isCurrentlyInStock = override ? override.inStock : prod.inStock;
                const currentCount = override ? override.stockCount : prod.stockCount;

                return (
                  <div 
                    key={prod.id} 
                    className={`p-4 rounded-2xl border transition ${
                      isCurrentlyInStock 
                        ? 'bg-slate-900/80 border-slate-800' 
                        : 'bg-slate-950/90 border-rose-900/40 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">
                          {prod.categoryLabel}
                        </span>
                        <h3 className="text-xs font-bold text-white leading-snug">
                          {prod.name}
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">
                        ${prod.priceUsd}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                      {prod.subtitle}
                    </p>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">
                        Stock: <strong className="text-white">{currentCount} units</strong>
                      </span>

                      <button
                        onClick={() => handleToggleStock(prod.id, isCurrentlyInStock, currentCount)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isCurrentlyInStock
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        {isCurrentlyInStock ? '✓ In Stock' : '✕ Out of Stock'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center space-x-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                <span>Admin Credentials & Escrow Settings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize administrator login credentials, Telegram hotline handle, and security keys.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Admin Master Password
                </label>
                <input
                  type="text"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Official Support Telegram Username
                </label>
                <input
                  type="text"
                  required
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-slate-400">
                <span className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AES-256 Escrow Engine Security</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  All generated vault decryption keys use local deterministic AES-256 seed strings.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                Save Admin Settings & Credentials
              </button>
            </form>
          </div>
        )}
      </main>

      {/* DETAILED ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c1220] border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span className="text-base font-bold text-white">
                  Order Details: <span className="font-mono text-emerald-400">#{selectedOrder.orderNumber}</span>
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scroll Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Total USD</span>
                  <span className="text-base font-bold text-white font-mono">${selectedOrder.totalUsd}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Payment</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{selectedOrder.cryptoCoin}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Status</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedOrder.status}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase">Warranty</span>
                  <span className="text-xs font-bold text-amber-300">{selectedOrder.warrantyDays} Days</span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">
                  Customer & Dispatch Target:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email Address</span>
                    <span className="font-mono text-white select-all">{selectedOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Telegram Handle</span>
                    <span className="font-mono text-cyan-400">{selectedOrder.telegramUsername || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Order Placed At</span>
                    <span className="font-mono">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Assigned Residential Proxy</span>
                    <span className="font-mono text-emerald-300">{selectedOrder.proxyAssigned}</span>
                  </div>
                </div>
              </div>

              {/* Crypto Payment / TXID info */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Crypto Gateway & Transaction Verification:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedOrder.cryptoAmount}</span>
                </h4>
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400">
                    Network: <strong className="text-slate-200">{selectedOrder.cryptoNetwork}</strong>
                  </div>
                  {selectedOrder.txHash ? (
                    <div>
                      <span className="text-slate-500 block text-[10px]">TXID / Transaction Hash</span>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-300 border border-slate-800 break-all select-all">
                        <span>{selectedOrder.txHash}</span>
                        <button
                          onClick={() => handleCopy(selectedOrder.txHash!, 'TXID')}
                          className="ml-2 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-400/80 italic">
                      No on-chain TXID submitted yet (escrow auto-detection active).
                    </div>
                  )}
                </div>
              </div>

              {/* Master Decryption Key & Encrypted Vault Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>Master AES-256 Vault Decryption Key</span>
                  </span>
                  <button
                    onClick={() => handleCopy(selectedOrder.masterDecryptionKey, 'Vault Key')}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer font-bold"
                  >
                    {copiedKey === selectedOrder.masterDecryptionKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === selectedOrder.masterDecryptionKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 break-all select-all border border-emerald-500/20">
                  {selectedOrder.masterDecryptionKey}
                </div>
              </div>

              {/* Admin Internal Notes */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase text-[10px] tracking-wider text-slate-400">
                  Admin Internal Notes / Dispatch Logs:
                </label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs">
                  {selectedOrder.adminNotes || 'No custom notes.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  ✓ Mark Delivered
                </button>

                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'Escrow Locked')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  ⏱ Set Escrow Locked
                </button>

                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 font-bold text-xs transition cursor-pointer"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
