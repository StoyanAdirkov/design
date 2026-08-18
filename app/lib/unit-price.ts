/**
 * Цена за мерна единица (€/кг) за насипните и чувалните материали.
 *
 * ЗАЩО: при строителните материали „9,83 €“ не значи нищо, ако не се
 * знае дали е за чувал от 5, 15 или 25 кг. Сравнението между два вида
 * лепило е невъзможно без обща база. Това е и стандарт при големите
 * вериги за строителни материали.
 *
 * ⚠ ГРЕШКА В ДАННИТЕ НА ПЛАТФОРМАТА, КОЯТО ТРЯБВА ДА СЕ ЗНАЕ
 * Storefront API-то връща за „Лепило-шпакловка Baumit DuoContact 25 кг“:
 *     weight: 25000, weightUnit: 'KILOGRAMS'
 * Стойността е в ГРАМОВЕ, а етикетът твърди килограми. Проверено и в
 * Admin API-то: гипсова шпакловка „15 кг“ → weight 15000.
 *
 * Ако се доверим на weightUnit, сметката излиза 1000 пъти сгрешена
 * (0,0004 €/кг вместо 0,39 €/кг). Затова стойността се третира като
 * грамове, а етикетът се игнорира — с предпазна проверка отдолу.
 *
 * ⚠ КЪДЕ РАБОТИ И КЪДЕ НЕ
 * Работи на продуктовата страница, защото getProduct връща варианти с
 * тегло и колекции.
 *
 * НЕ работи в списъците (категория, търсене, карусели). Проверено:
 * getCollectionProductsPaginated връща само id, handle, title,
 * availableForSale, featuredImage, priceRange, labels, reviewSummary —
 * без варианти, без тегло, без колекции. Няма от какво да се сметне.
 *
 * За да излезе €/кг и в списъците, трябва едно от двете:
 *   1) CloudCart да добави weight в списъчната заявка (правилното), или
 *   2) допълнителна заявка на продукт в loader-а — 12 заявки на страница,
 *      което е скъпо и бавно.
 * Точно в списъка сравнението между два вида лепило има най-голям смисъл,
 * така че вариант 1 си струва да се поиска от платформата.
 */

/**
 * Колекции, в които €/кг има смисъл. Нарочно е списък, а не праг по
 * тегло: 23-килограмова стълба също минава всякакъв праг, но „€/кг за
 * стълба“ е безсмислица.
 */
const WEIGHED_COLLECTIONS = new Set([
  'suhi-stroitelni-smesi',
  'cimenti',
  'gipsovi-produkti',
  'beton',
  'za-fayans-i-keramika',
  'lepila-za-plochki',
  'fugirashti-smesi',
  'za-toploizolacii',
  'zidarski-raztvori-i-lepila',
  'zidarski-raztvori',
  'lepila-za-gazobeton',
  'shpaklovki',
  'gipsovi-shpaklovki',
  'varovi-shpaklovki',
  'mazilki',
  'varo-cimentovi-mazilki',
  'gipsovo-varovi-mazilki',
  'beton-ciment-raztvori-zamazki',
  'dobavki-za-betoni-i-raztvori',
]);

/** Под 2 кг цената за килограм не помага на никого. */
const MIN_KG = 2;

export interface UnitPrice {
  /** Цена за килограм */
  perKg: number;
  /** Теглото на разфасовката в килограми */
  kg: number;
}

export function getUnitPrice(product: any): UnitPrice | null {
  const collections: string[] = (product?.collections?.nodes ?? product?.collections ?? [])
    .map((c: any) => (typeof c === 'string' ? c : c?.handle))
    .filter(Boolean);

  if (!collections.some((h) => WEIGHED_COLLECTIONS.has(h))) return null;

  const variants: any[] = product?.variants?.nodes ?? [];
  if (variants.length !== 1) return null; // при няколко разфасовки цената е на варианта

  const raw = Number(variants[0]?.weight ?? 0);
  const price = Number(
    variants[0]?.price?.amount ?? product?.priceRange?.minVariantPrice?.amount ?? 0,
  );
  if (!raw || !price) return null;

  // Стойността е в грамове въпреки етикета. Предпазна мярка: ако някога
  // платформата го поправи и започне да връща истински килограми,
  // стойност под 1000 се приема за килограми.
  const kg = raw >= 1000 ? raw / 1000 : raw;

  if (kg < MIN_KG) return null;

  return {perKg: price / kg, kg};
}

/** „0,39 €/кг“ */
export function formatUnitPrice(unit: UnitPrice, currency = 'EUR'): string {
  const money = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(unit.perKg);
  return `${money}/кг`;
}
