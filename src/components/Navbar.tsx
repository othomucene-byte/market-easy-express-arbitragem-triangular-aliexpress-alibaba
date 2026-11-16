import React from 'react';
import { ShoppingBag, Globe, Layers, TrendingUp, Package } from 'lucide-react';
import { TabView } from '../types';

interface NavbarProps {
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
  cartCount: number;
  onOpenCart: () => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  exchangeRate,
  setExchangeRate
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg leading-none">
              Market Easy <span className="text-orange-600">Express</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              Hub Triangular • AliExpress & Alibaba
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'catalog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Catálogo Triangular
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Pedidos & Rastreio
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'simulator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Simulador de Margem
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500">USD/BRL:</span>
            <input
              type="number"
              step="0.05"
              min="3.5"
              max="8.0"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 5.15)}
              className="w-14 bg-transparent text-xs font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            aria-label="Abrir lote triangular"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-slate-100 px-4 py-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'catalog' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Simulador
        </button>
      </div>
    </header>
  );
};
