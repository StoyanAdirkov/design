// Марките на maxxmart с лого, подредени по брой продукти.
// Извадени през Admin API (query vendors, has_products: true) на 2026-08-18
// и всеки URL е проверен, че връща 200.
//
// Магазинът има 312 марки с продукти, но само 43 от топ 100 имат качено
// лого. Тук са точно тези — лента с празни квадратчета не върши работа.
// Ако маркетингът качи още лога, файлът се прегенерира.

export interface VendorLogo {
  name: string;
  src: string;
  count: number;
}

export const VENDOR_LOGOS: VendorLogo[] = [
  {name: 'VIVALUX', src: 'https://www.maxxmart.eu/cdn/img/vendors/71/71.png?width=400&height=200', count: 554},
  {name: 'WURTH', src: 'https://www.maxxmart.eu/cdn/img/vendors/118/118.png?width=400&height=200', count: 453},
  {name: 'Schuller', src: 'https://www.maxxmart.eu/cdn/img/vendors/117/117.png?width=400&height=200', count: 369},
  {name: 'Inter Ceramic', src: 'https://www.maxxmart.eu/cdn/img/vendors/89/89.png?width=400&height=200', count: 217},
  {name: 'DECOREX', src: 'https://www.maxxmart.eu/cdn/img/vendors/30/30.jpeg?width=400&height=200', count: 197},
  {name: 'Ceresit', src: 'https://www.maxxmart.eu/cdn/img/vendors/68/68.png?width=400&height=200', count: 192},
  {name: 'GLOBUS', src: 'https://www.maxxmart.eu/cdn/img/vendors/9/9.png?width=400&height=200', count: 185},
  {name: 'Raider', src: 'https://www.maxxmart.eu/cdn/img/vendors/56/56.png?width=400&height=200', count: 154},
  {name: 'Top Master Pro', src: 'https://www.maxxmart.eu/cdn/img/vendors/59/59.png?width=400&height=200', count: 154},
  {name: 'Леко', src: 'https://www.maxxmart.eu/cdn/img/vendors/64/64.png?width=400&height=200', count: 146},
  {name: 'Mapei', src: 'https://www.maxxmart.eu/cdn/img/vendors/141/141.png?width=400&height=200', count: 145},
  {name: 'BAUMIT', src: 'https://www.maxxmart.eu/cdn/img/vendors/16/16.png?width=400&height=200', count: 110},
  {name: 'DEVOREX', src: 'https://www.maxxmart.eu/cdn/img/vendors/83/83.png?width=400&height=200', count: 104},
  {name: 'Лактофол', src: 'https://www.maxxmart.eu/cdn/img/vendors/106/106.jpeg?width=400&height=200', count: 103},
  {name: 'Топ Експрес', src: 'https://www.maxxmart.eu/cdn/img/vendors/108/108.png?width=400&height=200', count: 99},
  {name: 'BRAMAC', src: 'https://www.maxxmart.eu/cdn/img/vendors/2/2.png?width=400&height=200', count: 87},
  {name: 'HERLY', src: 'https://www.maxxmart.eu/cdn/img/vendors/28/28.jpeg?width=400&height=200', count: 85},
  {name: 'Top Garden', src: 'https://www.maxxmart.eu/cdn/img/vendors/57/57.png?width=400&height=200', count: 84},
  {name: 'TESA', src: 'https://www.maxxmart.eu/cdn/img/vendors/135/135.png?width=400&height=200', count: 83},
  {name: 'Casa Bella', src: 'https://www.maxxmart.eu/cdn/img/vendors/63/63.png?width=400&height=200', count: 79},
  {name: 'SEMMELROCK', src: 'https://www.maxxmart.eu/cdn/img/vendors/13/13.png?width=400&height=200', count: 77},
  {name: 'PREMIUM', src: 'https://www.maxxmart.eu/cdn/img/vendors/76/76.png?width=400&height=200', count: 66},
  {name: 'Sika', src: 'https://www.maxxmart.eu/cdn/img/vendors/136/136.png?width=400&height=200', count: 56},
  {name: 'RÖFIX', src: 'https://www.maxxmart.eu/cdn/img/vendors/12/12.png?width=400&height=200', count: 54},
  {name: 'ANURA', src: 'https://www.maxxmart.eu/cdn/img/vendors/51/51.jpeg?width=400&height=200', count: 48},
  {name: 'Knauf', src: 'https://www.maxxmart.eu/cdn/img/vendors/134/134.png?width=400&height=200', count: 47},
  {name: 'TONDACH', src: 'https://www.maxxmart.eu/cdn/img/vendors/531/531.jpeg?width=400&height=200', count: 44},
  {name: 'SINIAT', src: 'https://www.maxxmart.eu/cdn/img/vendors/14/14.png?width=400&height=200', count: 41},
  {name: 'Moment', src: 'https://www.maxxmart.eu/cdn/img/vendors/69/69.png?width=400&height=200', count: 41},
  {name: 'Rigips', src: 'https://www.maxxmart.eu/cdn/img/vendors/131/131.png?width=400&height=200', count: 40},
  {name: 'PREMIUMGARDEN', src: 'https://www.maxxmart.eu/cdn/img/vendors/33/33.png?width=400&height=200', count: 39},
  {name: 'Protecta', src: 'https://www.maxxmart.eu/cdn/img/vendors/66/66.png?width=400&height=200', count: 36},
  {name: 'AKFIX', src: 'https://www.maxxmart.eu/cdn/img/vendors/40/40.png?width=400&height=200', count: 34},
  {name: 'Gadget', src: 'https://www.maxxmart.eu/cdn/img/vendors/60/60.png?width=400&height=200', count: 34},
  {name: 'AKVO', src: 'https://www.maxxmart.eu/cdn/img/vendors/81/81.png?width=400&height=200', count: 31},
  {name: 'Ejot', src: 'https://www.maxxmart.eu/cdn/img/vendors/129/129.png?width=400&height=200', count: 30},
  {name: 'RTR MAX', src: 'https://www.maxxmart.eu/cdn/img/vendors/75/75.jpeg?width=400&height=200', count: 28},
  {name: 'АМЦ', src: 'https://www.maxxmart.eu/cdn/img/vendors/111/111.jpeg?width=400&height=200', count: 28},
  {name: 'WIENERBERGER', src: 'https://www.maxxmart.eu/cdn/img/vendors/7/7.png?width=400&height=200', count: 20},
  {name: 'YTONG', src: 'https://www.maxxmart.eu/cdn/img/vendors/8/8.png?width=400&height=200', count: 16},
  {name: 'VELUX', src: 'https://www.maxxmart.eu/cdn/img/vendors/15/15.png?width=400&height=200', count: 16},
  {name: 'K.E.B.E', src: 'https://www.maxxmart.eu/cdn/img/vendors/163/163.jpeg?width=400&height=200', count: 16},
  {name: 'De\'HOME', src: 'https://www.maxxmart.eu/cdn/img/vendors/97/97.jpeg?width=400&height=200', count: 15},
];
