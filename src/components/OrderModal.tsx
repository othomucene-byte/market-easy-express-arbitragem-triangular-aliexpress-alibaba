import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { ProductArbitrage } from '../types';

interface OrderModalProps {
  product: ProductArbitrage;
  exchangeRate: number;
  onClose: () => void;
  onConfirm: (
    customerName: string,
    destinationCity: string,
    product: ProductArbitrage,
    source: 'alibaba' | 'aliexpress',
    quantity: number
  ) => void;
}  

export const OrderModal: React.FC<OrderModalProps> = ({ product, exchangeRate, onClose, onConfirm }) => {
  const [customerName, setCustomerName] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [source, setSource] = useState<'alibaba' | 'aliexpress'>('aliexpress');
  const [quantity, setQuantity] = useState<number>(1);

  const unitUsd = source === 'alibaba' ? product.alibabaPriceUsd : product.aliexpressPriceUsd;
  const totalCostBrl = unitUsd * quantity * exchangeRate + product.expressShippingBrl;
  const totalRevenueBrl = product.marketEasyPriceBrl * quantity;
  const netProfitBrl = totalRevenueBrl - totalCostBrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !destinationCity.trim()) return;
    onConfirm(customerName.trim(), destinationCity.trim(), product, source, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Despacho Triangular Express</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Origem da Compra</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSource('aliexpress');
                  setQuantity(1);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  source === 'aliexpress'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                AliExpress (US$ {product.aliexpressPriceUsd.toFixed(2)})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSource('alibaba');
                  setQuantity(product.alibabaMoq);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  source === 'alibaba'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Alibaba B2B (US$ {product.alibabaPriceUsd.toFixed(2)})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade</label>
              <input
                type="number"
                min={source === 'alibaba' ? product.alibabaMoq : 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Lucro Líquido Est.</label>
              <div className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-700">
                + R$ {netProfitBrl.toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Cliente Final</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex: João Silva"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade / Estado de Destino</label>
            <input
              type="text"
              required
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              placeholder="Ex: Campinas, SP"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            Confirmar Pedido Triangular
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
