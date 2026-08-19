// ДЕМО емисия от социалните мрежи.
//
// ⚠ НЕ Е ИСТИНСКА ВРЪЗКА. Публикациите тук са статични и не се дърпат
// от Facebook или Instagram. Направени са за превюто, за да се види как
// изглежда секцията.
//
// КОЯ МРЕЖА: Facebook. Проверено — страницата maxxmart.stores има около
// 3 751 харесвания, докато Instagram профилът със същото име е с 774
// последователи. Instagram публикува повече (737 поста), но аудиторията
// е във Facebook, пет пъти по-голяма. Затова шапката е с техните числа
// и води към Facebook.
//
// СНИМКИТЕ са реални — от статиите в блога на магазина. Текстовете са
// написани за демонстрация и НЕ са техни истински публикации.
//
// ЗА ЖИВО: тук трябва официална интеграция — Facebook Page Posts през
// Graph API или готов widget. Тогава този файл отпада.

export interface SocialPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
}

/** Изключи, ако демо съдържанието не бива да се вижда. */
export const SOCIAL_DEMO = true;

export const SOCIAL_PROFILE = {
  network: 'Facebook' as const,
  handle: 'maxxmart.stores',
  url: 'https://www.facebook.com/maxxmart.stores/',
  followers: 3751,
  instagramUrl: 'https://www.instagram.com/maxxmart.stores/',
  instagramFollowers: 774,
};

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'p1',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/4/4.jpeg?width=600&height=600',
    caption: 'Новият ни обект в Люлин вече работи! Заповядайте на бул. Европа 171.',
    likes: 184,
    comments: 23,
  },
  {
    id: 'p2',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/1/1.jpeg?width=600&height=600',
    caption: 'Ледено студена награда за истинския майстор — купи 2 лепила Ceresit.',
    likes: 96,
    comments: 11,
  },
  {
    id: 'p3',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/2/2.jpeg?width=600&height=600',
    caption: 'Тониращ център в maxxmart. Хиляди цветове, готови до минути.',
    likes: 212,
    comments: 34,
  },
  {
    id: 'p4',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/3/3.jpeg?width=600&height=600',
    caption: 'Честита Баба Марта от целия екип на maxxmart!',
    likes: 341,
    comments: 47,
  },
  {
    id: 'p5',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/5/5.jpeg?width=600&height=600',
    caption: 'Горещи оферти за спокойни сънища — матраци с до −20%.',
    likes: 78,
    comments: 9,
  },
  {
    id: 'p6',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/7/7.jpeg?width=600&height=600',
    caption: 'BAUFEST RÖFIX и приятели. Благодарим на всички, които бяха с нас!',
    likes: 156,
    comments: 19,
  },
  {
    id: 'p7',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/8/8.jpeg?width=600&height=600',
    caption: 'Разпродажба на GLOBUS FLEX FUGA. Докато е налична.',
    likes: 63,
    comments: 7,
  },
  {
    id: 'p8',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/9/9.jpeg?width=600&height=600',
    caption: 'Специални цени на GLOBUS G4 36 за влажни помещения.',
    likes: 88,
    comments: 12,
  },
  {
    id: 'p9',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/10/10.jpeg?width=600&height=600',
    caption: 'Плати 1, вземи 2 — битумен уплътнител GLOBUS G5 33.',
    likes: 129,
    comments: 16,
  },
  {
    id: 'p10',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/11/11.jpeg?width=600&height=600',
    caption: 'Коледно парти на Сдружение Топливо. Весели празници!',
    likes: 267,
    comments: 38,
  },
  {
    id: 'p11',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/12/12.jpeg?width=600&height=600',
    caption: '26 обекта в страната и още растем. Благодарим ви!',
    likes: 198,
    comments: 25,
  },
  {
    id: 'p12',
    image:
      'https://maxxmart.cloudcart.net/cdn/img/articles/14/14.jpeg?width=600&height=600',
    caption: 'Всичко за фасадата на едно място — питай нашите хора в обекта.',
    likes: 74,
    comments: 8,
  },
];
