/**
 * Разходна норма, извлечена от описанието на продукта.
 *
 * ЗАЩО ОТ ОПИСАНИЕТО: магазинът няма поле за разходна норма — продуктите
 * нямат нито характеристики, нито параметри (проверено: properties = 0
 * навсякъде). Но производителите я пишат в текста и то доста
 * последователно. При Baumit DuoContact стои:
 *
 *   Разходна норма:
 *   - лепене: 4,0–5,0 kg/m2
 *   - шпакловка: 3,5–4,5 kg/m2
 *
 * Затова я четем оттам. Ако маркетингът някога въведе нормата като
 * характеристика, парсерът трябва да отстъпи пред нея.
 *
 * ⚠ Числата идват от текст на производителя. Калкулаторът е ОРИЕНТИР,
 * не гаранция — затова резултатът се показва като диапазон, а не като
 * едно число, и с изрична бележка.
 */

export interface ConsumptionRate {
  /** „лепене“, „шпакловка“ или празно при една норма */
  label: string;
  /** долна граница, кг на м² */
  min: number;
  /** горна граница, кг на м² (равна на min при единично число) */
  max: number;
}

/** Превръща „4,0“ или „4.0“ в число. */
function num(raw: string): number {
  return parseFloat(raw.replace(',', '.'));
}

/**
 * Търси разходна норма в описанието.
 * Разпознава kg/m2, kg/m², кг/м2 и кг/м², с тире или интервал.
 */
export function parseConsumption(html?: string | null): ConsumptionRate[] {
  if (!html) return [];

  // HTML entity-тата трябва да се разкодират ПРЕДИ търсенето.
  // Тирето в „4,0&ndash;5,0 kg/m2“ е entity, не истински знак — заради
  // това първата версия на парсера не намираше нито една норма, макар
  // текстът да я съдържа.
  const text = html
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&ndash;|&#8211;/g, '\u2013')
    .replace(/&mdash;|&#8212;/g, '\u2014')
    .replace(/&minus;/g, '\u2212')
    .replace(/&amp;/g, '&')
    .replace(/\u00a0/g, ' ');

  // само частта след „Разходна норма“ / „Разход“, за да не хванем
  // плътност (kg/m3) или друга стойност от техническите показатели
  const startMatch = text.match(/Разходна\s+норма|Разход\s*:/i);
  if (!startMatch) return [];
  const section = text.slice(startMatch.index ?? 0, (startMatch.index ?? 0) + 600);

  const unit = String.raw`(?:kg|кг)\s*\/\s*(?:m|м)\s*(?:2|²)`;
  // „лепене: 4,0–5,0 kg/m2“ или „около 1,5 кг/м2“
  const re = new RegExp(
    String.raw`(?:[-–•]\s*)?([А-Яа-яA-Za-z\s]{3,30}?)?\s*[:\s]\s*(?:около\s*)?(\d+(?:[.,]\d+)?)\s*(?:[–—−-]\s*(\d+(?:[.,]\d+)?))?\s*${unit}`,
    'gi',
  );

  const rates: ConsumptionRate[] = [];
  let m: RegExpExecArray | null;

  while ((m = re.exec(section)) !== null) {
    const min = num(m[2]);
    const max = m[3] ? num(m[3]) : min;
    if (!Number.isFinite(min) || min <= 0 || min > 100) continue;

    const label = (m[1] ?? '')
      .replace(/Разходна\s+норма/i, '')
      .replace(/[:\-–—]/g, '')
      .trim();

    rates.push({label, min, max});
  }

  // без дубликати
  const seen = new Set<string>();
  return rates.filter((r) => {
    const key = `${r.label}|${r.min}|${r.max}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
