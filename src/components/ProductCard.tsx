import React from 'react';
import { Star, Plus, ArrowRight, Clock } from 'lucide-react';
import { ProductArbitrage } from '../types';

interface ProductCardProps {
  product: ProductArbitrage;
  exchangeRate: number;
  onAddToCart: (product: ProductArbitrage, source: 'alibaba' | 'aliexpress', quantity: number) => void;
  onQuickOrder: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  exchangeRate,
  onAddToCart,
  onQuickOrder
}) => {
  const alibabaCostBrl = product.alibabaPriceUsd * exchangeRate + product.expressShippingBrl;
  const aliexpressCostBrl = product.aliexpressPriceUsd * exchangeRate + product.expressShippingBrl;
  const bestProfitBrl = product.marketEasyPriceBrl - alibabaCostBrl;
  const marginPercent = (bestProfitBrl / product.marketEasyPriceBrl) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {product.category}
        </div>
        <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
          Margem {marginPercent.toFixed(0)}%
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-mono">{product.sku}</span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {product.rating}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Fornecedor: {product.alibabaSupplier}</p>
        </div>

        <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-orange-700 font-semibold">Alibaba B2B (MOQ {product.alibabaMoq})</span>
            <span className="font-bold text-slate-900">
              US$ {product.alibabaPriceUsd.toFixed(2)} <span className="text-slate-400 font-normal">(R$ {alibabaCostBrl.toFixed(2)})</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-red-600 font-semibold">AliExpress (1 un.)</span>
            <span className="font-bold text-slate-900">
              US$ {product.aliexpressPriceUsd.toFixed(2)} <span className="text-slate-400 font-normal">(R$ {aliexpressCostBrl.toFixed(2)})</span>
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <span className="text-slate-600 font-semibold">Venda Market Easy</span>
            <span className="font-extrabold text-emerald-600 text-sm">R$ {product.marketEasyPriceBrl.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Entrega Express: {product.deliveryDays}
          </span>
          <span className="font-semibold text-emerald-600">+R$ {bestProfitBrl.toFixed(2)}/un</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onAddToCart(product, 'alibaba', product.alibabaMoq)}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Lote Alibaba
          </button>
          <button
            onClick={onQuickOrder}
            className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors"
          >
            Despachar
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
