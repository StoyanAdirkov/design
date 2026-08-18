/**
 * „Лятна разпродажба“ — сезонни артикули с обща отстъпка.
 *
 * ⚠⚠ ПРОЧЕТИ, ПРЕДИ ДА ПУСНЕШ ТОВА НА ЖИВО ⚠⚠
 *
 * Магазинът В МОМЕНТА НЯМА нито един продукт в намаление. Проверено през
 * Admin API: `products(sale: yes)` връща 0, а `discounts` съдържа само
 * една неактивна по код отстъпка без код.
 *
 * Тоест процентът по-долу е ОФОРМЛЕНИЕ, не реална цена. Ако секцията
 * тръгне така, началната страница ще показва зачертана цена и „−20%“,
 * а касата ще вземе пълната сума. Това подвежда купувача и е проблем по
 * ЗЗП, не просто визуален недостатък.
 *
 * За да стане истина, трябва ЕДНО от двете:
 *  1) намаление, зададено на самите продукти в админа (тогава Storefront
 *     API-то връща compareAtPrice и този файл вече не е нужен), или
 *  2) код за отстъпка, който се прилага в количката — същият, който
 *     ползва и комплектът (виж lib/bundle.ts).
 *
 * Компонентът предпочита РЕАЛНАТА отстъпка, ако я намери на продукта, и
 * пада на процента оттук само ако няма такава.
 *
 * Подборът е само от артикули, които Storefront API-то дава като
 * availableForSale. Два от първоначалните (косачка MOLLER и храсторез
 * PT600) излизаха „Запитване“ — количество в админа има, но storefront-ът
 * ги дава като непродаваеми. Разпродажба с неналични артикули е по-лоша
 * от липсваща разпродажба.
 */
export const SALE_PERCENT = 20;

/** Дали изобщо да се показва секцията. Изключи я, ако промоцията не е готова. */
export const SALE_ENABLED = true;

export const SALE_TITLE = 'Лятна разпродажба';
export const SALE_SUBTITLE = 'Сезонни артикули с намаление до края на лятото';

export const SALE_PICKS: string[] = [
  'partner-pro-pp-blm20v-akumulatorna-kosachka-20v4ah-bezchetkova-4500-obmin-5-skorosti-1-br-bateriya-i-zaryadno-v-komplekta',
  'prskachka-akum-butalo-125l-12v-8ah-rtr-max',
  'khrastorez-2v1-72v-1300mah-nicd-rtr-max',
  'markuch-gradinski-raztegatelen-do-225m-premiumgarden',
  'benzinov-trimer-razglobyaem-premium',
  'prskachka-5l-s-metalen-udlzhitel-herly',
  'rchna-kolichka-90l-galvanizirana-s-usileno-kolelo-yaparlar',
  'greblo-za-lista-tip-vetrilo-palisad',
  'lopata-prava-s-drzhka-herly',
  'elektricheska-kosachka-gardena',
  'kosachka-trimer-raider-rd-gt21',
  'akumulatorna-praskachka-daewoo-daps16-b-16-l-12-v-8-ah-s-bateriya-i-zaryadno',
  'kolichka-s-shiroko-bandazhno-kolelo-i-60l-kosh-sinya-amts',
];
