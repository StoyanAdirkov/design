/**
 * Филтър по проект, а не по свойство.
 *
 * ЗАЩО: купувачът на строителни материали не мисли „искам циментова
 * хидроизолация с разход 1,5 кг/м²“. Мисли „ремонтирам банята“. Между
 * двете стои цялата работа по избора, която магазинът може да свърши
 * вместо него. Bauhaus и Home Depot го правят от години („Проекти“,
 * „Project Guides“); в България никой.
 *
 * ⚠ ЗАЩО НЕ Е ОБИКНОВЕН ФИЛТЪР КЪМ API-ТО
 * Проверих на живо: Storefront филтърът `category` се игнорира на
 * products() — връща целия каталог (6922) независимо какво подадеш. Няма
 * и tags по продуктите (всички са празни). Тоест няма как да се каже
 * „категория A ИЛИ категория B“ с една заявка.
 *
 * Затова проектът се сглобява от няколко категорийни заявки наведнъж и
 * се слива в паметта. Заявките са паралелни, всяка е ограничена (CAP), а
 * филтрите отляво (марка, цена) се подават на всяка — така продължават да
 * работят вътре в проекта.
 *
 * Правилният дългосрочен ремонт е един от двата:
 *   1) CloudCart да направи `category` филтъра OR-ируем, или
 *   2) свойство „Проект“ по продуктите → тогава става един productMetafield
 *      филтър и цялата тази машинария отпада.
 *
 * СТРУКТУРА
 * Всеки проект знае в коя главна категория кои подкатегории му принадлежат.
 * Така „Ремонт на баня“ в Строителство показва хидроизолации и лепила, а
 * в Баня — смесители и санитария. Един и същ проект, различен обхват —
 * защото човекът е в различна част от магазина.
 */

export interface Project {
  key: string;
  label: string;
  /** Едно изречение под чиповете, когато проектът е активен. */
  intro: string;
  /** Емоджи за чипа. Иконите на категориите не покриват „проект“. */
  emoji: string;
  /** Главна категория → подкатегории от нея, които влизат в проекта. */
  roots: Record<string, string[]>;
}

export const PROJECTS: Project[] = [
  {
    key: 'banya',
    label: 'Ремонт на баня',
    emoji: '🚿',
    intro:
      'Всичко за баня в един списък: хидроизолация и лентите за ъглите, лепило и фугираща смес, санитарен силикон, плочки и смесители.',
    roots: {
      stroitelstvo: [
        'techni-i-pastoobrazni-hidroizolacii',
        'hidroizolaciya-na-cimentova-osnova',
        'hidroizolacionni-mushami-lenti-folia-i-uplatneniya',
        // родителят вече съдържа „Лепила за плочки“ и „Фугиращи смеси“
        'za-fayans-i-keramika',
        'sanitarni-silikonovi-uplatniteli',
      ],
      'banya-i-kuhnya': [
        'smesiteli-za-umivalnici',
        'smesiteli-za-dushove-i-vani',
        'umivalnici',
        'toaletni-chinii-i-monoblokove',
        'strukturi-za-vgrajdane',
        'celi-dushove',
      ],
      'podovi-pokritiya': ['granitogres', 'fiksatori-za-sanitaren-fayans'],
    },
  },
  {
    key: 'fasada',
    label: 'Фасада и топлоизолация',
    emoji: '🏠',
    intro:
      'Пълната топлоизолационна система: плоскости, лепило-шпакловъчна смес, дюбели и профили, грунд и финишна мазилка.',
    roots: {
      stroitelstvo: [
        'ekspandiran-penopolistirol-eps',
        'ekstrudiran-penopolistirol-xps',
        'aksesoari-za-toploizolacionni-sistemi',
        'za-toploizolacii',
      ],
      'boi-lakove-i-mazilki': [
        'mineralni-strukturni-finishni-mazilki',
        'silikonova-fasadna-mazilka',
        'grundove-za-metal-darvo-i-mazilki-1',
      ],
    },
  },
  {
    key: 'pod',
    label: 'Нов под',
    emoji: '🪵',
    intro:
      'Ламинат и гранитогрес с всичко под тях: изравняваща замазка, лепило, фуга и первази.',
    roots: {
      'podovi-pokritiya': ['laminat', 'podovi-pervazi-i-aksesoari-za-tyah', 'granitogres'],
      stroitelstvo: ['zamazki', 'za-fayans-i-keramika'],
    },
  },
  {
    key: 'pokriv',
    label: 'Ремонт на покрив',
    emoji: '🧱',
    intro:
      'Керемиди, улуци и всички капаци и аксесоари, за които се сеща човек чак когато е горе.',
    roots: {
      stroitelstvo: [
        'keramichni-keremidi',
        'keramichni-keremidi-1',
        'betonovi-keremidi',
        'aksesoari-za-betonovi-keremidi',
        'oluci-i-vodostoci',
        'hidroizolacionni-mushami-lenti-folia-i-uplatneniya',
      ],
    },
  },
  {
    key: 'boyadisvane',
    label: 'Боядисване на стая',
    emoji: '🎨',
    intro:
      'Боя, грунд и цялата подготовка: валяци, четки, телескоп, тиксо и найлон за покриване.',
    roots: {
      'boi-lakove-i-mazilki': [
        'vododispersni-boi-za-steni-i-fasadi',
        'ocvetiteli-i-pigmenti-za-tonirane',
        'betonkontakt',
        'valyaci',
        'chetki',
        'badanarki',
        'vani-teleskopi-drajki-i-dr',
      ],
      'instrumenti-krepejni-elementi-pomoshtni-sredstva': [
        'pokrivala-predpazno-folio-i-polietilen',
        'lenti-1',
      ],
    },
  },
  {
    key: 'gipskarton',
    label: 'Сухо строителство',
    emoji: '🪚',
    intro:
      'Профили, плоскости и крепеж за преградни стени и окачени тавани, плюс шпакловката и лентата за фугите.',
    roots: {
      stroitelstvo: [
        'cw',
        'uw',
        'cd',
        'lepila-i-shpaklovki-za-gipskarton',
        'lenti-uplatneniya-i-krepeji-za-gipskarton',
        'vintove-za-metal',
      ],
    },
  },
  {
    key: 'gradina',
    label: 'Градина и двор',
    emoji: '🌿',
    intro: 'Косене, поливане и засаждане — техниката и консумативите за сезона.',
    roots: {
      gradina: [
        'trimeri-i-kosachki',
        'gradinski-markuchi',
        'gradinski-markuchi-i-aksesoari',
        'torove',
        'semena',
        'saksii',
        'grebla',
        'lopati',
      ],
    },
  },
];

/**
 * Колко продукта най-много се теглят от една категория на проект.
 *
 * 150 покрива с резерв най-голямата участваща категория („Лепила за плочки
 * и фуги“ — 108 във витрината). Когато таванът все пак се удари, лоудърът
 * пише предупреждение, вместо да занижи броя мълчаливо.
 */
export const PROJECT_CATEGORY_CAP = 150;

export function getProject(key: string | null | undefined): Project | null {
  if (!key) return null;
  return PROJECTS.find((p) => p.key === key) ?? null;
}

/** Проектите, които имат какво да покажат в дадена главна категория. */
export function projectsForCollection(handle: string): Project[] {
  return PROJECTS.filter((p) => (p.roots[handle]?.length ?? 0) > 0);
}

/** Подкатегориите на проекта, които попадат в дадена главна категория. */
export function projectCategories(project: Project, collectionHandle: string): string[] {
  return project.roots[collectionHandle] ?? [];
}
