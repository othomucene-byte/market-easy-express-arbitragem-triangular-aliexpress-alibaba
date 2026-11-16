import React from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export const TriangularFlowBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-400 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Fluxo Triangular Automatizado</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Compre na fonte com menor custo (Alibaba B2B ou AliExpress) e despache via Hub Market Easy Express.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
          1. Alibaba / AliExpress
        </span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
        <span className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          2. Hub Market Easy Express
        </span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" />
          3. Cliente Final (BR)
        </span>
      </div>
    </div>
  );
};
