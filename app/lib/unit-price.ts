/**
 * Цена за мерна единица — €/кг, €/л, €/м, €/м², €/бр.
 *
 * ЗАЩО: „9,83 €“ не значи нищо, докато не се знае за колко е. Чувал от 5
 * или от 25 кг, патрон от 280 или салам от 600 мл, кутия с 10 или с 100
 * винта — без обща база сравнението между два артикула е невъзможно.
 *
 * КОИ МЕРКИ ВЛИЗАТ
 * Проверих кои единици реално се срещат в имената на 1258-те продукта в
 * Строителство: бр (407 срещания), кг (194), мм (131), мл (87), м (81),
 * г (69), см (27), м² и л. Оттам следва и подборът тук:
 *
 *   МАТЕРИАЛ (влиза)      кг, г → €/кг · л, мл → €/л · м → €/м
 *                         м² → €/м² · бр → €/бр
 *   РАЗМЕР (не влиза)     мм, см
 *
 * Разликата е проста: „25 кг“ казва колко материал получаваш, „10 x 100
 * мм“ казва как изглежда един брой. Цена за милиметър няма смисъл.
 *
 * ⚠ ГРЕШКА В ДАННИТЕ НА ПЛАТФОРМАТА
 * Storefront API-то връща за „Baumit DuoContact 25 кг“:
 *     weight: 25000, weightUnit: 'KILOGRAMS'
 * Стойността е в ГРАМОВЕ, а етикетът твърди килограми. Ако му се доверим,
 * сметката излиза 1000 пъти сгрешена. Затова теглото се чете като грамове.
 *
 * ⚠ ЗАЩО СЕ ЧЕТЕ ОТ ИМЕТО, А НЕ ОТ ПОЛЕ
 * CloudCart има готова система за мерни единици — вариантът носи unitId,
 * unitValue, unitText, unitType, baseUnitValue. Проверено: заявката
 * `units` за maxxmart връща празен списък, а от 64 проверени варианта
 * нито един няма попълнено поле. Докато не се попълнят, единственият
 * източник е името на продукта.
 */

/**
 * Категории, в които €/кг важи дори името да мълчи. Втори път, не основен.
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
 * Артикули, при които обявената мярка е на самия предмет, а не на
 * материала в него.
 *
 * „Туба за бензин 5 л“ струва 11,30 € за тубата, не за бензина.
 * „Мастар 2 м“ е инструмент — цена за метър мастар няма смисъл, същото
 * важи за нивелир, ролетка и стълба. Проверява се само ПЪРВАТА дума,
 * защото тя назовава артикула: „Латекс … кофа 5 л“ си остава боя.
 */
const NON_MATERIAL_WORDS = new Set([
  // съдове
  'туба', 'бидон', 'варел', 'канистра', 'кофа', 'ведро', 'кана',
  'бутилка', 'резервоар', 'съд', 'казан', 'кофичка',
  // инструменти, чиято дължина е конструкция, не количество
  'мастар', 'нивелир', 'ролетка', 'метър', 'ролетка', 'стълба',
  'скеле', 'лата', 'телескоп', 'дръжка', 'количка', 'маркуч',
]);

/** Базова единица, до която се свежда всичко от даден вид. */
export type BaseUnit = 'кг' | 'л' | 'м' | 'м²' | 'бр';

/**
 * Прагове, под които цената за единица е шум.
 *
 * Литрите и броевете са със строго „над“, а не „поне“: при 1 литър и при
 * 1 брой цената за единица е точно цената на продукта и само повтаря
 * същото число.
 */
/**
 * Долна граница на цената при броевете.
 *
 * ⚠ ДАННИТЕ НА МАГАЗИНА, НЕ НАШАТА СМЕТКА
 * При крепежа „100бр.“ в името често означава опаковката на доставчика,
 * докато цената е за ЕДИН артикул. „Дюбел с пирон 8*45 100бр.“ струва
 * 0,05 € — това е цена на дюбел, не на кутия със сто. Разделено на 100
 * излиза 0,0005 €/бр., тоест безплатно.
 *
 * Проверих всичките 40 продукта с брой в името в Крепежни елементи и
 * границата е чиста: под 0,50 € за целия артикул винаги е цена на брой
 * (двайсет продукта, всички дюбели, куки и халки), а от 0,66 € нагоре
 * винаги е цена на опаковка (нитове, пирони, стяжки).
 *
 * Затова при броевете искаме артикулът да струва поне 50 стотинки.
 * Опаковка от двайсет крепежа под тази цена не съществува.
 */
const MIN_PACK_PRICE = 0.5;

const MIN: Record<BaseUnit, number> = {
  'кг': 0.5,
  'л': 0.25,
  'м': 1,
  'м²': 1,
  'бр': 1,
};
const STRICTLY_ABOVE: BaseUnit[] = ['л', 'м', 'бр'];

export interface UnitPrice {
  /** Цена за една базова единица */
  per: number;
  /** Размер на разфасовката в базовата единица */
  size: number;
  /** Базовата единица */
  unit: BaseUnit;
  /** Както е изписано в името: „750 г“, „280 мл“ */
  label: string;
}

/**
 * Изважда количеството от името на продукта.
 *
 * Редът в списъка е и приоритет: маса печели пред обем, обемът пред площ,
 * площта пред дължина, дължината пред брой. При „Гвоздеи 3x70 мм 1 кг“
 * важното е килограмът, а не броят в кутията.
 *
 * Границата отпред пази „CM 17“ да не бъде прочетено като число, а
 * отрицателният поглед напред — „1.8 kW“, „3*1.50 мм2“ и най-вече
 * дебитите: „Водоструйка … 6 л/мин“ обявява поток, не разфасовка.
 */
const PATTERNS: Array<{
  unit: BaseUnit;
  factor: number;
  suffix: string;
  re: RegExp;
}> = [
  {unit: 'кг', factor: 1, suffix: 'кг', re: /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:кг|kg)(?![a-zа-я/²³])/gi},
  {unit: 'кг', factor: 0.001, suffix: 'г', re: /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:гр|г)\.?(?![a-zа-яр/²³])/gi},
  {unit: 'л', factor: 1, suffix: 'л', re: /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:л|L)\.?(?![a-zа-я/²³])/gi},
  {unit: 'л', factor: 0.001, suffix: 'мл', re: /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:мл|ml)(?![a-zа-я/])/gi},
  {unit: 'м²', factor: 1, suffix: 'м²', re: /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:м\s?[²2]|кв\.?\s?м)(?![0-9])/gi},
  {unit: 'м', factor: 1, suffix: 'м', re: /(^|[^\d.,])(\d{1,4}(?:[.,]\d{1,2})?)\s*(?:м|m)\.?(?![a-zа-я²³2м/])/gi},
  {unit: 'бр', factor: 1, suffix: 'бр.', re: /(^|[^\d.,])(\d{1,4})\s*(?:бр|броя)\.?/gi},
];

function parsePack(title: string): UnitPriceParse | null {
  if (!title) return null;
  for (const p of PATTERNS) {
    p.re.lastIndex = 0;
    let best: number | null = null;
    let m: RegExpExecArray | null;
    while ((m = p.re.exec(title))) {
      const n = parseFloat(m[2].replace(',', '.'));
      if (!Number.isFinite(n) || n <= 0) continue;
      // При няколко съвпадения взимаме най-голямото: „Комплект 2 x 5 кг“
      if (best === null || n > best) best = n;
    }
    if (best === null) continue;
    const size = best * p.factor;
    const min = MIN[p.unit];
    const ok = STRICTLY_ABOVE.includes(p.unit) ? size > min : size >= min;
    // Мярката е намерена, но е под прага — това е отговор „не“, а не
    // покана да пробваме следващата единица със същото число.
    if (!ok) return null;
    const shown = best % 1 === 0 ? String(best) : String(best).replace('.', ',');
    return {size, unit: p.unit, label: `${shown} ${p.suffix}`};
  }
  return null;
}

interface UnitPriceParse {
  size: number;
  unit: BaseUnit;
  label: string;
}

function isNonMaterial(title: string): boolean {
  const first = (title ?? '').trim().split(/[\s,]+/)[0] ?? '';
  return NON_MATERIAL_WORDS.has(first.toLocaleLowerCase('bg-BG'));
}

export function getUnitPrice(product: any): UnitPrice | null {
  const variants: any[] = product?.variants?.nodes ?? [];
  // При няколко разфасовки цената е на варианта, не на продукта —
  // няма едно количество, на което да я разделим.
  if (variants.length > 1) return null;

  const price = Number(
    variants[0]?.price?.amount ?? product?.priceRange?.minVariantPrice?.amount ?? 0,
  );
  if (!price) return null;

  const title: string = product?.title ?? '';
  if (isNonMaterial(title)) return null;

  // 1. Каквото обявява самото име.
  const fromTitle = parsePack(title);
  if (fromTitle) {
    if (fromTitle.unit === 'бр' && price < MIN_PACK_PRICE) return null;
    // Обща застраховка: цена за единица, закръглена до нула, не носи
    // информация и почти винаги значи разминаване в данните.
    if (price / fromTitle.size < 0.001) return null;
    return {
      per: price / fromTitle.size,
      size: fromTitle.size,
      unit: fromTitle.unit,
      label: fromTitle.label,
    };
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
  if (kg < 2) return null;

  const shown = kg % 1 === 0 ? String(kg) : kg.toFixed(1).replace('.', ',');
  return {per: price / kg, size: kg, unit: 'кг', label: `${shown} кг`};
}

/**
 * „0,39 €/кг“, „0,09 €/бр.“, „0,04 € / 100 бр.“
 *
 * Дребните стойности получават трети знак — кутия с 250 дюбела прави
 * 0,004 €/бр., а закръглено на два знака става „0,00“.
 *
 * Под един стотинка на брой и това не стига: винт по 0,0002 € излизаше
 * „0,000 €/бр.“, тоест безплатно. Там базата се вдига на сто броя, което
 * е и начинът, по който крепежът се търгува в действителност.
 */
export function formatUnitPrice(unit: UnitPrice, currency = 'EUR'): string {
  const label = unit.unit === 'бр' ? 'бр.' : unit.unit;
  const per100 = unit.per < 0.01;
  const value = per100 ? unit.per * 100 : unit.per;
  const decimals = value < 0.1 ? 3 : 2;

  const money = new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return per100 ? `${money} / 100 ${label}` : `${money}/${label}`;
}

/** „25 кг“, „280 мл“, „100 бр.“ — както е изписано в името. */
export function formatPackSize(unit: UnitPrice): string {
  return unit.label;
}
