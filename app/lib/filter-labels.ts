/**
 * Български етикети за филтрите в продуктовия списък.
 *
 * Три отделни проблема, които този файл решава:
 *
 * 1. Storefront API-то връща част от етикетите на английски („Brands“),
 *    а ЦЕНАТА изобщо не е преведена — идва суровият преводен ключ
 *    `sf.widget.product.listing.filter.price`. Това е бъг в платформата,
 *    не в темата: ключът излиза така и в стандартния сторфронт. Докато не
 *    се оправи, го прихващаме тук.
 *
 * 2. Свойствата на категориите са въвеждани ръчно от години и една и съща
 *    характеристика съществува под три имена — „Размер“, „размер“ и
 *    „РАЗМЕРИ“. В Строителство това дава три отделни секции „Размер“ една
 *    под друга. Обединяваме ги по нормализирано име.
 *
 * 3. Част от стойностите са на английски (Walnut, Oak, White) в иначе
 *    изцяло български магазин.
 *
 * Правилният дългосрочен ремонт е чистене на свойствата в админа. Дотогава
 * това е презентационен слой — не пипа данните на клиента.
 */

/** Етикети на групи филтри, идващи от API-то. Ключът е с малки букви. */
const GROUP_LABELS: Record<string, string> = {
  brands: 'Марки',
  brand: 'Марка',
  vendor: 'Производител',
  vendors: 'Производители',
  price: 'Цена',
  availability: 'Наличност',
  available: 'Наличност',
  'in stock': 'В наличност',
  tags: 'Етикети',
  tag: 'Етикет',
  category: 'Категория',
  categories: 'Категории',
  'on sale': 'В промоция',
  onsale: 'В промоция',
  new: 'Нови',
  featured: 'Препоръчани',
  color: 'Цвят',
  colour: 'Цвят',
  size: 'Размер',
  material: 'Материал',
  weight: 'Тегло',
  length: 'Дължина',
  width: 'Ширина',
  height: 'Височина',
  volume: 'Обем',
  type: 'Вид',
};

/**
 * Групи, които се сливат в една.
 *
 * Ключът е нормализираното име от API-то, стойността е заглавието, под
 * което да излезе. Стойностите на всички слети групи стоят една под друга
 * в общ списък — всяка носи собствения си `input`, така че превключването
 * работи без промяна.
 */
const GROUP_ALIASES: Record<string, string> = {
  размер: 'Размер',
  размери: 'Размер',
  размерм: 'Размер',
  разфасовка: 'Разфасовка',
  разфасовки: 'Разфасовка',
  цвят: 'Цвят',
  цветове: 'Цвят',
  видове: 'Вид',
  вид: 'Вид',
  разновидности: 'Вид',
  обем: 'Обем',
  тегло: 'Тегло',
  дължина: 'Дължина',
};

/** Стойности на английски, които се срещат в иначе български списъци. */
const VALUE_LABELS: Record<string, string> = {
  transparent: 'Прозрачен',
  white: 'Бял',
  black: 'Черен',
  grey: 'Сив',
  gray: 'Сив',
  brown: 'Кафяв',
  beige: 'Бежов',
  red: 'Червен',
  blue: 'Син',
  green: 'Зелен',
  yellow: 'Жълт',
  silver: 'Сребърен',
  gold: 'Златен',
  walnut: 'Орех',
  oak: 'Дъб',
  chestnut: 'Кестен',
  hazelnut: 'Лешник',
  pine: 'Бор',
  mahogany: 'Махагон',
  teak: 'Тик',
  cherry: 'Череша',
  wenge: 'Венге',
  natural: 'Натурален',
  yes: 'Да',
  no: 'Не',
};

/**
 * Превежда етикета на група филтри.
 *
 * Прихваща и суровия преводен ключ на цената: всичко, което започва с
 * `sf.widget.`, е непреведен ключ на платформата. Взимаме последната част
 * след точката и я търсим в речника — така и бъдещи счупени ключове
 * (`…filter.vendor`) ще се хванат сами, вместо да излязат на екрана.
 */
export function translateFilterLabel(label: string): string {
  const raw = (label ?? '').trim();
  if (!raw) return raw;

  // „sf.widget.product.listing.filter.price (EUR)“ → „price“ + „ (EUR)“
  const brokenKey = raw.match(/^(sf\.[a-z0-9._]+)(.*)$/i);
  if (brokenKey) {
    const last = brokenKey[1].split('.').pop() ?? '';
    const suffix = brokenKey[2].replace(/\(EUR\)/i, '(€)').trim();
    const translated = GROUP_LABELS[last.toLowerCase()] ?? capitalize(last);
    return suffix ? `${translated} ${suffix}` : translated;
  }

  const key = raw.toLowerCase();
  if (GROUP_ALIASES[key]) return GROUP_ALIASES[key];
  if (GROUP_LABELS[key]) return GROUP_LABELS[key];

  // Иначе оставяме етикета на клиента, но с нормална главна буква —
  // „РАЗМЕРИ“ изкрещяно с главни букви разваля ритъма на колоната.
  return capitalize(raw);
}

/** Ключ за сливане: групи с един и същ ключ стават една секция. */
export function filterGroupKey(label: string): string {
  const translated = translateFilterLabel(label);
  return translated.toLowerCase();
}

/** Превежда стойност на филтър (напр. цвят, дошъл на английски). */
export function translateFilterValue(value: string): string {
  const raw = (value ?? '').trim();
  const hit = VALUE_LABELS[raw.toLowerCase()];
  return hit ?? raw;
}

function capitalize(s: string): string {
  const t = s.trim();
  if (!t) return t;
  // Само ако е изцяло с главни или изцяло с малки — иначе е нарочно
  // изписване („LED крушки“, „ПВЦ ламперия“) и не го пипаме.
  const isAllUpper = t === t.toLocaleUpperCase('bg-BG');
  const isAllLower = t === t.toLocaleLowerCase('bg-BG');
  if (!isAllUpper && !isAllLower) return t;
  const lower = t.toLocaleLowerCase('bg-BG');
  return lower.charAt(0).toLocaleUpperCase('bg-BG') + lower.slice(1);
}
