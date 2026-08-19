/**
 * Икони за групите филтри.
 *
 * От същия комплект като CategoryIcon: една дебелина на щриха, един цвят
 * (currentColor), еднаква оптична тежест. В колона от осем реда всяка
 * разлика в тежестта личи и вниманието отива към най-тъмната икона,
 * вместо към филтъра, който човек търси.
 *
 * Изборът се прави по преведеното име на групата — виж lib/filter-labels.ts,
 * където „Размер“, „размер“ и „РАЗМЕРИ“ вече са слети в едно.
 */
const PATHS: Record<string, React.ReactNode> = {
  // Марки — етикет с дупка
  brand: (
    <>
      <path d="M3 12.6V5a2 2 0 0 1 2-2h7.6a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.8l-7.6 7.6a2 2 0 0 1-2.8 0L3.6 14a2 2 0 0 1-.6-1.4z" />
      <path d="M7.5 7.5h.01" />
    </>
  ),
  // Цена — банкнота
  price: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  // Размер — двупосочна стрелка между граници
  size: (
    <>
      <path d="M4 5v14M20 5v14" />
      <path d="M7.5 12h9" />
      <path d="M9.5 9.5 7 12l2.5 2.5M14.5 9.5 17 12l-2.5 2.5" />
    </>
  ),
  // Разфасовка — чувал
  pack: (
    <>
      <path d="M8 3h8l-1.2 2.4A3 3 0 0 0 14.5 7l3 8.6a4 4 0 0 1-3.8 5.4h-3.4a4 4 0 0 1-3.8-5.4L9.5 7a3 3 0 0 0-.3-1.6z" />
      <path d="M9.5 11h5" />
    </>
  ),
  // Цвят — капка
  color: (
    <>
      <path d="M12 3.2 7.4 8.4a6.2 6.2 0 1 0 9.2 0z" />
      <path d="M9 14.5a3 3 0 0 0 3 3" />
    </>
  ),
  // Вид — слоеве
  type: (
    <>
      <path d="M12 3 3 7.5l9 4.5 9-4.5z" />
      <path d="M3 12.5 12 17l9-4.5" />
      <path d="M3 17 12 21.5 21 17" />
    </>
  ),
  // Обем — мензура
  volume: (
    <>
      <path d="M9 3v6.5L4.8 17a3 3 0 0 0 2.6 4.5h9.2a3 3 0 0 0 2.6-4.5L15 9.5V3" />
      <path d="M8 3h8" />
      <path d="M6.6 14h10.8" />
    </>
  ),
  // Тегло — везна
  weight: (
    <>
      <path d="M12 3v3" />
      <path d="M4.5 7.5h15" />
      <path d="M7 7.5 4 14a3 3 0 0 0 6 0z" />
      <path d="M17 7.5 14 14a3 3 0 0 0 6 0z" />
      <path d="M9 21h6" />
      <path d="M12 6v15" />
    </>
  ),
  // Дължина — линийка
  length: (
    <>
      <rect x="2.5" y="8.5" width="19" height="7" rx="1.5" />
      <path d="M7 8.5v3M11 8.5v4.5M15 8.5v3M19 8.5v4.5" />
    </>
  ),
  // Наличност — кашон с отметка
  stock: (
    <>
      <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
      <path d="M3.5 7.5 12 11.5l8.5-4" />
      <path d="M12 11.5v9" />
    </>
  ),
  // Промоция — процент
  sale: (
    <>
      <path d="M6 18 18 6" />
      <circle cx="7.5" cy="7.5" r="2.2" />
      <circle cx="16.5" cy="16.5" r="2.2" />
    </>
  ),
  // Ново — искра
  fresh: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  // Материал — куб
  material: (
    <>
      <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z" />
      <path d="M3.5 7 12 11.2 20.5 7" />
      <path d="M12 11.2v10" />
    </>
  ),
  // Още характеристики — плъзгачи
  more: (
    <>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </>
  ),
  // Подреждане — стрелка надолу с редове
  sort: (
    <>
      <path d="M4 6h11M4 12h8M4 18h5" />
      <path d="M18 5v14" />
      <path d="M15.5 16.5 18 19l2.5-2.5" />
    </>
  ),
};

/**
 * Кое име коя икона получава. Ключът е преведеното име с малки букви;
 * непознатите групи остават без икона — по-добре празно, отколкото
 * произволна картинка до „Цвят фугиращи смеси“.
 */
const BY_LABEL: Record<string, string> = {
  'марки': 'brand',
  'марка': 'brand',
  'производител': 'brand',
  'производители': 'brand',
  'цена': 'price',
  'размер': 'size',
  'разфасовка': 'pack',
  'цвят': 'color',
  'вид': 'type',
  'обем': 'volume',
  'тегло': 'weight',
  'дължина': 'length',
  'ширина': 'length',
  'височина': 'length',
  'наличност': 'stock',
  'в наличност': 'stock',
  'в промоция': 'sale',
  'нови': 'fresh',
  'препоръчани': 'fresh',
  'материал': 'material',
  'категория': 'type',
  'етикети': 'brand',
};

export function filterIconFor(label: string): string | null {
  const key = (label ?? '').trim().toLocaleLowerCase('bg-BG');
  if (BY_LABEL[key]) return BY_LABEL[key];
  // Свойствата на клиента често са описателни: „Цвят фугиращи смеси“.
  // Първата дума носи вида, затова пробваме и по нея, преди да се
  // откажем. Непозната първа дума пак остава без икона.
  const first = key.split(/\s+/)[0];
  return BY_LABEL[first] ?? null;
}

export function FilterIcon({
  name,
  className = 'size-4',
}: {
  name: string | null;
  className?: string;
}) {
  const path = name ? PATHS[name] : null;
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
