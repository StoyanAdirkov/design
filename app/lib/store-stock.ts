import {STORES, type Store} from './stores';

/**
 * Наличност по обект.
 *
 * ⚠⚠⚠ ТЕЗИ ЧИСЛА СА ИЗМИСЛЕНИ ⚠⚠⚠
 *
 * Проверено докрай в платформата:
 *  · Variant.quantity е ЕДНО число за целия магазин (напр. 28 бр.),
 *    не по обекти.
 *  · zeronWarehouses (интеграцията за складове) връща празен списък —
 *    не е настроена за този магазин.
 *  · Нито Storefront, нито Admin API дават количество по склад.
 *
 * Тоест реална наличност по обект НЯМА откъде да дойде. Демото по-долу
 * показва как ще изглежда функцията, когато данните станат налични.
 *
 * ЗА ДА СТАНЕ ИСТИНСКО трябва едно от двете:
 *  1) maxxmart да подава наличностите по обект от вътрешната си система
 *     (ERP/складов софтуер) към CloudCart, и CloudCart да ги отдава в
 *     Storefront API-то, или
 *  2) собствена услуга, която държи наличностите и която storefront-ът
 *     пита — по същия модел като другите ни интеграции.
 *
 * Когато това стане, се сменя САМО тялото на getStoreStock. Целият
 * интерфейс отгоре вече работи срещу този договор.
 */
export const STORE_STOCK_IS_DEMO = true;

export interface StoreStock {
  store: Store;
  quantity: number;
}

/**
 * Псевдослучайно, но УСТОЙЧИВО число: едно и също при всяко рендиране
 * за същата двойка вариант/обект. Ако беше Math.random(), сървърът и
 * клиентът щяха да покажат различни числа и React щеше да се оплаче.
 */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Кои обекти имат този вариант и по колко.
 *
 * @param variantId идентификаторът на конкретната разновидност
 * @param total общата наличност, която магазинът обявява
 */
export function getStoreStock(variantId: string, total: number): StoreStock[] {
  if (!variantId || !total || total <= 0) return [];

  const retail = STORES.filter((s) => !s.warehouse);
  const out: StoreStock[] = [];
  let left = total;

  for (const store of retail) {
    if (left <= 0) break;
    const h = hash(`${variantId}|${store.name}`);
    // около половината обекти нямат артикула — така списъкът е
    // правдоподобен, а не „навсякъде има по малко“
    if (h % 100 < 55) continue;
    const qty = Math.min(left, 1 + (h % 6));
    out.push({store, quantity: qty});
    left -= qty;
  }

  return out;
}
