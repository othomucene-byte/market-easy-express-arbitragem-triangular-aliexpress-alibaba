import { ProductArbitrage, TriangularOrder } from '../types';

export const INITIAL_PRODUCTS: ProductArbitrage[] = [
  {
    id: 'prod-1',
    sku: 'MEE-SW-900',
    name: 'Smartwatch Ultra AMOLED 49mm NFC', 
    category: 'Eletrônicos',
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    alibabaSupplier: 'Shenzhen Huazhi Tech Co.',
    alibabaPriceUsd: 14.50,
    alibabaMoq: 5,
    aliexpressPriceUsd: 21.90,
    marketEasyPriceBrl: 249.90,
    expressShippingBrl: 22.00,
    deliveryDays: '9-14 dias',
    rating: 4.9
  },
  {
    id: 'prod-2',
    sku: 'MEE-AUD-420',
    name: 'Fone TWS Cancelamento de Ruído ANC Pro',
    category: 'Áudio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    alibabaSupplier: 'Guangzhou SoundWave Ltd.',
    alibabaPriceUsd: 9.80,
    alibabaMoq: 10,
    aliexpressPriceUsd: 15.40,
    marketEasyPriceBrl: 179.00,
    expressShippingBrl: 18.00,
    deliveryDays: '8-12 dias',
    rating: 4.8
  },
  {
    id: 'prod-3',
    sku: 'MEE-HOME-115',
    name: 'Mini Projetor Portátil 4K Wi-Fi 6 Android',
    category: 'Casa Inteligente',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    alibabaSupplier: 'Yiwu Vision Optics Factory',
    alibabaPriceUsd: 34.00,
    alibabaMoq: 2,
    aliexpressPriceUsd: 46.50,
    marketEasyPriceBrl: 459.00,
    expressShippingBrl: 35.00,
    deliveryDays: '10-15 dias',
    rating: 4.9
  },
  {
    id: 'prod-4',
    sku: 'MEE-FIT-308',
    name: 'Pistola Massageadora Muscular 6 Pontas',
    category: 'Saúde & Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    alibabaSupplier: 'Ningbo ActiveGear Co.',
    alibabaPriceUsd: 12.20,
    alibabaMoq: 5,
    aliexpressPriceUsd: 18.90,
    marketEasyPriceBrl: 219.90,
    expressShippingBrl: 25.00,
    deliveryDays: '9-14 dias',
    rating: 4.7
  },
  {
    id: 'prod-5',
    sku: 'MEE-GAM-770',
    name: 'Teclado Mecânico RGB 60% Hot-Swappable',
    category: 'Eletrônicos',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    alibabaSupplier: 'Dongguan KeyMaster Tech',
    alibabaPriceUsd: 16.00,
    alibabaMoq: 5,
    aliexpressPriceUsd: 24.50,
    marketEasyPriceBrl: 279.00,
    expressShippingBrl: 26.00,
    deliveryDays: '10-14 dias',
    rating: 4.9
  },
  {
    id: 'prod-6',
    sku: 'MEE-LED-204',
    name: 'Fita LED RGBIC 10m Controle App & Alexa',
    category: 'Casa Inteligente',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    alibabaSupplier: 'Zhongshan BrightLife LED',
    alibabaPriceUsd: 6.40,
    alibabaMoq: 10,
    aliexpressPriceUsd: 11.20,
    marketEasyPriceBrl: 129.90,
    expressShippingBrl: 16.00,
    deliveryDays: '7-11 dias',
    rating: 4.8
  }
];

export const INITIAL_ORDERS: TriangularOrder[] = [
  {
    id: 'MEE-84920',
    customerName: 'Lucas Andrade',
    destinationCity: 'São Paulo, SP',
    productName: 'Smartwatch Ultra AMOLED 49mm NFC',
    source: 'alibaba',
    quantity: 5,
    totalCostBrl: 395.38,
    totalRevenueBrl: 1249.50,
    netProfitBrl: 854.12,
    status: 'Hub Market Easy',
    createdAt: '12/05/2025',
    trackingCode: 'CN948271635BR'
  },
  {
    id: 'MEE-84915',
    customerName: 'Mariana Costa',
    destinationCity: 'Belo Horizonte, MG',
    productName: 'Mini Projetor Portátil 4K Wi-Fi 6 Android',
    source: 'aliexpress',
    quantity: 1,
    totalCostBrl: 274.48,
    totalRevenueBrl: 459.00,
    netProfitBrl: 184.52,
    status: 'Trânsito China-Brasil',
    createdAt: '11/05/2025',
    trackingCode: 'CN773190442BR'
  },
  {
    id: 'MEE-84899',
    customerName: 'Rafael Nogueira',
    destinationCity: 'Curitiba, PR',
    productName: 'Fone TWS Cancelamento de Ruído ANC Pro',
    source: 'alibaba',
    quantity: 10,
    totalCostBrl: 522.70,
    totalRevenueBrl: 1790.00,
    netProfitBrl: 1267.30,
    status: 'Entregue',
    createdAt: '08/05/2025',
    trackingCode: 'CN512098331BR'
  }
];
