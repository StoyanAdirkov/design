// Сезонни категории за плочките под „Сезонни препоръки“.
//
// ВАЖНО: категориите в CloudCart на този магазин НЯМАТ качени
// изображения — проверих всичките 100 върнати от Admin API-то, полето
// `image` е празно навсякъде. Затова всяка плочка ползва снимката на
// представителен продукт от самата категория, а не стокова снимка.
// Така картинките са реално съдържание на магазина.
//
// Изборът на продукт е ръчен. Автоматичното взимане на „най-гледания“
// даваше глупости: за „Ръчни пръскачки“ върна дихроична лампа, а за
// „Ръкавици“ — зимни ръкавици в лятна секция.
//
// Всеки /collections/<handle> е проверен, че връща 200, и всяка снимка също.

export interface SeasonalCategory {
  title: string;
  /** дребният надпис над заглавието */
  kicker: string;
  url: string;
  image: string;
}

export const SEASONAL_CATEGORIES: SeasonalCategory[] = [
  {
    title: 'Косачки и тримери',
    kicker: 'Поддръжка на тревата',
    url: '/collections/trimeri-i-kosachki',
    image: 'https://www.maxxmart.eu/cdn/img/products/19375/kosacka-rd-lm18-image_5d8eb37a6bd12.jpeg?width=900&height=700&v=1777577085',
  },
  {
    title: 'Градински маркучи',
    kicker: 'Поливане',
    url: '/collections/gradinski-markuchi',
    image: 'https://www.maxxmart.eu/cdn/img/products/20316/markuc-gradinski-raztegatelen-do-22-5m-image_5d8eb72386833.jpeg?width=900&height=700&v=1777577087',
  },
  {
    title: 'Капково напояване',
    kicker: 'Автоматично поливане',
    url: '/collections/sistemi-i-elementi-za-kapkovo-napoyavane',
    image: 'https://www.maxxmart.eu/cdn/img/products/20286/komplekt-za-kapkovo-napoavane-amikroa-42-casti-image_5d8eb705b8763.jpeg?width=900&height=700&v=1777577090',
  },
  {
    title: 'Пръскачки',
    kicker: 'Растителна защита',
    url: '/collections/rachni-praskachki',
    image: 'https://www.maxxmart.eu/cdn/img/products/20411/praskacka-16l-s-metalen-teleskopicen-udalzitel-herly-681da3e6e252c.jpeg?width=900&height=700&v=1777577212',
  },
  {
    title: 'Храсторези и ножици',
    kicker: 'Оформяне и рязане',
    url: '/collections/hrastorezi-i-mehanichni-nojici',
    image: 'https://www.maxxmart.eu/cdn/img/products/34750/nozica-lozarska-akumulatorna-bezcetkova-u-force-35-mm-20v-li-ion-69aff81dab30a.png?width=900&height=700&v=1777577227',
  },
  {
    title: 'Барбекю и къмпинг',
    kicker: 'Навън с приятели',
    url: '/collections/barbekyuta',
    image: 'https://www.maxxmart.eu/cdn/img/products/33746/barbeku-muhler-a-ss115-hibachi-260-62430a4f56713.png?width=900&height=700&v=1777577184',
  },
  {
    title: 'Чадъри и шатри',
    kicker: 'Сянка в двора',
    url: '/collections/chadari',
    image: 'https://www.maxxmart.eu/cdn/img/products/34390/gradinska-satra-6850263542055.png?width=900&height=700&v=1777577209',
  },
];
