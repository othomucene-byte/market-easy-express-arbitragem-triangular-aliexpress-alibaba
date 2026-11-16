import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  ShoppingBag,
  Layers,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  Globe,
  Shield,
  Clock,
  Filter,
  Plus,
  Trash2,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ProductArbitrage, TriangularOrder, CartItem, TabView } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/triangularData';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { OrderModal } from './components/OrderModal';
import { TriangularFlowBanner } from './components/TriangularFlowBanner';

export function App() {
  const [activeTab, setActiveTab] = useState<TabView>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [exchangeRate, setExchangeRate] = useState<number>(5.15);
  const [products] = useState<ProductArbitrage[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<TriangularOrder[]>(() => {
    const saved = localStorage.getItem('mee_triangular_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mee_triangular_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductArbitrage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mee_triangular_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mee_triangular_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['Todos', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.alibabaSupplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: ProductArbitrage, source: 'alibaba' | 'aliexpress', quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.source === source);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.source === source
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, source, quantity }];
    });
    showToast(`${product.name} (${source === 'alibaba' ? 'Alibaba B2B' : 'AliExpress'}) adicionado ao lote.`);
  };

  const removeFromCart = (productId: string, source: 'alibaba' | 'aliexpress') => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.source === source)));
  };

  const handleCreateOrder = (customerName: string, destinationCity: string, product: ProductArbitrage, source: 'alibaba' | 'aliexpress', quantity: number) => {
    const unitCostUsd = source === 'alibaba' ? product.alibabaPriceUsd : product.aliexpressPriceUsd;
    const totalCostBrl = unitCostUsd * quantity * exchangeRate + product.expressShippingBrl;
    const totalRevenueBrl = product.marketEasyPriceBrl * quantity;
    const netProfitBrl = totalRevenueBrl - totalCostBrl;

    const newOrder: TriangularOrder = {
      id: `MEE-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName,
      destinationCity,
      productName: product.name,
      source,
      quantity,
      totalCostBrl,
      totalRevenueBrl,
      netProfitBrl,
      status: 'Processando Origem',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      trackingCode: `CN${Math.floor(100000000 + Math.random() * 899999999)}BR`
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedProduct(null);
    showToast(`Pedido triangular ${newOrder.id} criado com lucro estimado de R$ ${netProfitBrl.toFixed(2)}!`);
    setActiveTab('orders');
  };

  const advanceOrderStatus = (orderId: string) => {
    const flow: TriangularOrder['status'][] = [
      'Processando Origem',
      'Trânsito China-Brasil',
      'Hub Market Easy',
      'Entregue'
    ];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const idx = flow.indexOf(o.status);
        const nextStatus = idx < flow.length - 1 ? flow[idx + 1] : flow[idx];
        return { ...o, status: nextStatus };
      })
    );
    showToast(`Status do pedido ${orderId} atualizado.`);
  };

  const totalCartProfit = useMemo(() => { 
    return cart.reduce((acc, item) => {
      const unitCostUsd = item.source === 'alibaba' ? item.product.alibabaPriceUsd : item.product.aliexpressPriceUsd;
      const costBrl = unitCostUsd * item.quantity * exchangeRate + item.product.expressShippingBrl;
      const revBrl = item.product.marketEasyPriceBrl * item.quantity;
      return acc + (revBrl - costBrl);
    }, 0);
  }, [cart, exchangeRate]);

  const kpis = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.totalRevenueBrl, 0);
    const totalProfit = orders.reduce((s, o) => s + o.netProfitBrl, 0);
    const activeCount = orders.filter((o) => o.status !== 'Entregue').length;
    const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    return { totalRevenue, totalProfit, activeCount, avgMargin };
  }, [orders]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
      />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Receita Triangular</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                R$ {kpis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lucro Líquido</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                R$ {kpis.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Margem Média</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.avgMargin.toFixed(1)}%</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Operações Ativas</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.activeCount} pedidos</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
          </div>
        </section>

        <TriangularFlowBanner />

        {activeTab === 'catalog' && (
          <section className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar produto, SKU ou fornecedor Alibaba..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  exchangeRate={exchangeRate}
                  onAddToCart={addToCart}
                  onQuickOrder={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pedidos Triangulares em Andamento</h2>
                <p className="text-xs text-slate-500">
                  Acompanhe a rota China (Alibaba/AliExpress) → Hub Market Easy Express → Cliente Final
                </p>
              </div>
              <button
                onClick={() => setActiveTab('catalog')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Operação
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Pedido / Rastreio</th>
                    <th className="py-3.5 px-4">Cliente / Destino</th>
                    <th className="py-3.5 px-4">Produto & Origem</th>
                    <th className="py-3.5 px-4">Receita</th>
                    <th className="py-3.5 px-4">Lucro Líquido</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{order.id}</div>
                        <div className="text-xs text-slate-400 font-mono">{order.trackingCode}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{order.customerName}</div>
                        <div className="text-xs text-slate-500">{order.destinationCity}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 line-clamp-1">{order.productName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.source === 'alibaba'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.source === 'alibaba' ? 'Alibaba B2B' : 'AliExpress'}
                          </span>
                          <span className="text-xs text-slate-500">x{order.quantity} un.</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        R$ {order.totalRevenueBrl.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        + R$ {order.netProfitBrl.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Entregue'
                              ? 'bg-emerald-100 text-emerald-700'
                              : order.status === 'Hub Market Easy'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {order.status !== 'Entregue' ? (
                          <button
                            onClick={() => advanceOrderStatus(order.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Avançar
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600">Concluído</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'simulator' && (
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Simulador de Arbitragem Triangular</h2>
                <p className="text-xs text-slate-500">
                  Compare custos de importação Alibaba vs AliExpress com câmbio atual (R$ {exchangeRate.toFixed(2)})
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {products.slice(0, 4).map((p) => {
                const alibabaBrl = p.alibabaPriceUsd * exchangeRate + p.expressShippingBrl;
                const aliexpressBrl = p.aliexpressPriceUsd * exchangeRate + p.expressShippingBrl;
                const profitAlibaba = p.marketEasyPriceBrl - alibabaBrl;
                const profitAliexpress = p.marketEasyPriceBrl - aliexpressBrl;

                return (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Venda Market Easy Express: <strong className="text-slate-800">R$ {p.marketEasyPriceBrl.toFixed(2)}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="bg-white px-3 py-2 rounded-lg border border-orange-200">
                        <span className="text-slate-500 block">Lucro via Alibaba</span>
                        <strong className="text-orange-600 text-sm">R$ {profitAlibaba.toFixed(2)}</strong>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-lg border border-red-200">
                        <span className="text-slate-500 block">Lucro via AliExpress</span>
                        <strong className="text-red-600 text-sm">R$ {profitAliexpress.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Slide-over Cart / Lote Triangular */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-900">Lote de Importação Triangular</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  Seu lote triangular está vazio. Adicione produtos do catálogo.
                </div>
              ) : (
                cart.map((item) => {
                  const unitUsd = item.source === 'alibaba' ? item.product.alibabaPriceUsd : item.product.aliexpressPriceUsd;
                  return (
                    <div key={`${item.product.id}-${item.source}`} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-sm text-slate-900">{item.product.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {item.source === 'alibaba' ? 'Alibaba B2B' : 'AliExpress'} • {item.quantity} un. • US$ {unitUsd.toFixed(2)}/un
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.source)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Lucro Líquido Estimado do Lote:</span>
                  <span className="font-bold text-emerald-600 text-base">+ R$ {totalCartProfit.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setCart([]);
                    setIsCartOpen(false);
                    showToast('Lote enviado para processamento triangular!');
                  }}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Confirmar Despacho Triangular
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          exchangeRate={exchangeRate}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleCreateOrder}
        />
      )}
    </div>
  );
}

export default App;
