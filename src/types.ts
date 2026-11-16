export type TabView = 'catalog' | 'orders' | 'simulator';

export interface ProductArbitrage {
  id: string;
  sku: string;
  name: string;
  category: string;
  imageUrl: string;
  alibabaSupplier: string;
  alibabaPriceUsd: number;
  alibabaMoq: number;
  aliexpressPriceUsd: number;
  marketEasyPriceBrl: number;
  expressShippingBrl: number;
  deliveryDays: string;
  rating: number;
}

export interface TriangularOrder {
  id: string;
  customerName: string;
  destinationCity: string;
  productName: string;
  source: 'alibaba' | 'aliexpress';
  quantity: number;
  totalCostBrl: number;
  totalRevenueBrl: number;
  netProfitBrl: number;
  status: 'Processando Origem' | 'Trânsito China-Brasil' | 'Hub Market Easy' | 'Entregue';
  createdAt: string;
  trackingCode: string;
}

export interface CartItem {
  product: ProductArbitrage;
  source: 'alibaba' | 'aliexpress';
  quantity: number;
}
