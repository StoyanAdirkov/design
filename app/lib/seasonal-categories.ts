// Сезонни категории за плочките под „Сезонни препоръки“.
//
// СНИМКИТЕ са сценични, от Unsplash, и се хостват локално в
// public/categories/. Причини да не са продуктови:
// продуктовите снимки на магазина са на бял фон и плочките изглеждаха
// каталожно вместо редакционно. Категориите в CloudCart нямат качени
// изображения — проверих всичките 100, върнати от Admin API-то, полето
// `image` е празно навсякъде.
//
// ЛИЦЕНЗ: Unsplash License — свободна за търговска употреба, без
// изискване за разрешение или посочване на автор. Нарочно НЕ са ползвани
// снимки от plus.unsplash.com, защото те са Unsplash+ и се плащат.
// Източниците са записани до всеки запис, за да може да се проследи.
//
// Файловете се хостват локално, а не се дърпат от images.unsplash.com при
// всяко зареждане: външен хост означава зависимост, чужди лимити и още
// едно място, което може да падне.
//
// Всеки /collections/<handle> е проверен, че връща 200.

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
    // unsplash photo-1734303023491-db8037a21f09 — човек коси морава
    image: '/categories/kosachki.jpg',
  },
  {
    title: 'Градински маркучи',
    kicker: 'Поливане',
    url: '/collections/gradinski-markuchi',
    // unsplash photo-1693776472225-be367ccf88b7 — поливане с маркуч
    image: '/categories/markuchi.jpg',
  },
  {
    title: 'Капково напояване',
    kicker: 'Автоматично поливане',
    url: '/collections/sistemi-i-elementi-za-kapkovo-napoyavane',
    // unsplash photo-1738598665698-7fd7af4b5e0c — напоителна система
    image: '/categories/napoyavane.jpg',
  },
  {
    title: 'Пръскачки',
    kicker: 'Растителна защита',
    url: '/collections/rachni-praskachki',
    // unsplash photo-1524636090643-f30248a74e16 — пръскане на растения
    image: '/categories/prskachki.jpg',
  },
  {
    title: 'Храсторези и ножици',
    kicker: 'Оформяне и рязане',
    url: '/collections/hrastorezi-i-mehanichni-nojici',
    // unsplash photo-1543309959-4d45288d1629 — подрязване на жив плет
    image: '/categories/hrastorezi.jpg',
  },
  {
    title: 'Барбекю и къмпинг',
    kicker: 'Навън с приятели',
    url: '/collections/barbekyuta',
    // unsplash photo-1780091606130-2bfc03991da6 — барбекю в двор
    image: '/categories/barbekyu.jpg',
  },
  {
    title: 'Чадъри и шатри',
    kicker: 'Сянка в двора',
    url: '/collections/chadari',
    // unsplash photo-1786654026603-54c654c05c18 — чадър над маса в двор
    image: '/categories/chadari.jpg',
  },
];
