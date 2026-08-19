/**
 * Цена за мерна единица (€/кг, €/л) при разфасованите материали.
 *
 * ЗАЩО: „9,83 €“ не значи нищо, докато не се знае дали е за чувал от 5,
 * 15 или 25 кг. Сравнението между две лепила е невъзможно без обща база.
 * Стандарт е при всички големи вериги за строителни материали.
 *
 * ⚠ ГРЕШКА В ДАННИТЕ НА ПЛАТФОРМАТА
 * Storefront API-то връща за „Baumit DuoContact 25 кг“:
 *     weight: 25000, weightUnit: 'KILOGRAMS'
 * Стойността е в ГРАМОВЕ, а етикетът твърди килограми. Проверено и в
 * Admin API-то. Ако се доверим на weightUnit, сметката излиза 1000 пъти
 * сгрешена (0,0004 €/кг вместо 0,39 €/кг).
 *
 * КАК СЕ РЕШАВА КОГА ДА СЕ ПОКАЖЕ
 * Първо гледаме какво пише в самото име на продукта. „Ceresit CM 17
 * 25 кг“ обявява разфасовката си — това е най-надеждният източник и
 * покрива и литрите, където теглото не върши работа.
 *
 * Предишната версия имаше ръчен списък с категории. Той работеше, но
 * трябваше да се поддържа на ръка и мълчеше за всичко извън него.
 * Списъкът е запазен като втори път: продукт в категория за сухи смеси
 * получава €/кг дори името му да не обявява килограми.
 *
 * Прагът пази от безсмислици: под 2 кг и под 1 л цената за единица не
 * помага на никого, а 280-милилитров силикон не се сравнява на литър.
 * Стълба от 23 кг не минава, защото името ѝ не обявява килограми и
 * категорията ѝ не е в списъка.
 */

/**
 * Категории, в които €/кг има смисъл дори името да не го казва.
 * Втори път, не основен — виж коментара горе.
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

/**
 * Под тези стойности цената за единица е шум.
 *
 * Литрите са със строго „над 1“, а не „поне 1“: при туба от 1 литър
 * цената за литър е точно цената на продукта и само повтаря същото число.
 */
const MIN_KG = 2;
const MIN_L = 1;

export interface UnitPrice {
  /** Цена за единица */
  per: number;
  /** Размер на разфасовката */
  size: number;
  /** Единицата: „кг“ или „л“ */
  unit: 'кг' | 'л';
}

/**
 * Изважда разфасовката от името: „... 25 кг“, „Латекс 15л“, „5 L“.
 *
 * Границата отпред (началото или несловен знак) пази от „CM 17“ да бъде
 * прочетено като част от число, а изискването за цифра непосредствено
 * преди единицата — от „1.8 kW“ и „3*1.50 мм2“.
 */
function parsePackFromTitle(title: string): {size: number; unit: 'кг' | 'л'} | null {
  if (!title) return null;
  // Наклонената черта в отрицателния поглед напред е важна: „Водоструйка
  // … 6 л/мин“ обявява дебит, не разфасовка, и без нея излизаше „23,18 €/л“
  // за водоструйка. Същото пази и от „кг/м²“ в разходни норми.
  const re = /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(кг|kg|л|l)(?![a-zа-я/])/gi;
  let best: {size: number; unit: 'кг' | 'л'} | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(title))) {
    const size = parseFloat(m[2].replace(',', '.'));
    if (!Number.isFinite(size) || size <= 0) continue;
    const raw = m[3].toLowerCase();
    const unit: 'кг' | 'л' = raw === 'кг' || raw === 'kg' ? 'кг' : 'л';
    // При няколко съвпадения взимаме най-голямото — „Комплект 2 x 5 кг“
    if (!best || size > best.size) best = {size, unit};
  }
  return best;
}

/**
 * Съдове, при които обявените литри са вместимост, а не съдържание.
 *
 * „Туба за бензин 5л“ струва 11,30 € за тубата, не за бензина в нея —
 * „2,26 €/л“ там е подвеждащо. Проверява се само ПЪРВАТА дума, защото тя
 * назовава самия артикул: „Латекс … кофа 5 л“ си остава боя.
 */
const CONTAINER_WORDS = new Set([
  'туба',
  'бидон',
  'варел',
  'канистра',
  'кофа',
  'ведро',
  'кана',
  'бутилка',
  'резервоар',
  'съд',
  'казан',
]);

function isContainer(title: string): boolean {
  const first = (title ?? '').trim().split(/[\s,]+/)[0] ?? '';
  return CONTAINER_WORDS.has(first.toLocaleLowerCase('bg-BG'));
}

export function getUnitPrice(product: any): UnitPrice | null {
  const variants: any[] = product?.variants?.nodes ?? [];
  // При няколко разфасовки цената е на варианта, не на продукта —
  // не можем да я разделим на едно тегло.
  if (variants.length > 1) return null;

  const price = Number(
    variants[0]?.price?.amount ?? product?.priceRange?.minVariantPrice?.amount ?? 0,
  );
  if (!price) return null;

  const title: string = product?.title ?? '';
  if (isContainer(title)) return null;

  // 1. Каквото обявява самото име на продукта.
  const fromTitle = parsePackFromTitle(title);
  if (fromTitle) {
    const passes =
      fromTitle.unit === 'кг' ? fromTitle.size >= MIN_KG : fromTitle.size > MIN_L;
    if (passes) {
      return {per: price / fromTitle.size, size: fromTitle.size, unit: fromTitle.unit};
    }
    // Името обявява твърде малка разфасовка — това е отговор „не“,
    // а не покана да гадаем по теглото на опаковката.
    return null;
  }

  // 2. Иначе: категория от списъка + тегло от API-то.
  const collections: string[] = (product?.collections?.nodes ?? product?.collections ?? [])
    .map((c: any) => (typeof c === 'string' ? c : c?.handle))
    .filter(Boolean);
  if (!collections.some((h) => WEIGHED_COLLECTIONS.has(h))) return null;

  const raw = Number(variants[0]?.weight ?? 0);
  if (!raw) return null;

  // Стойността е в грамове въпреки етикета. Предпазна мярка: ако някога
  // платформата го поправи, стойност под 1000 се приема за килограми.
  const kg = raw >= 1000 ? raw / 1000 : raw;
  if (kg < MIN_KG) return null;

  return {per: price / kg, size: kg, unit: 'кг'};
}

/** „0,39 €/кг“ */
export function formatUnitPrice(unit: UnitPrice, currency = 'EUR'): string {
  const money = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(unit.per);
  return `${money}/${unit.unit}`;
}

/** „25 кг“ — размерът на разфасовката, без излишни нули. */
export function formatPackSize(unit: UnitPrice): string {
  const n = unit.size % 1 === 0 ? unit.size : unit.size.toFixed(1);
  return `${n} ${unit.unit}`;
}
