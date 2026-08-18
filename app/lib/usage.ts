/**
 * „Как се използва“ — структурираните факти от описанието.
 *
 * Идеята е от bulgarbiotic.bg, където има отделни секции „Прием“,
 * „Съхранение“, „За кого е подходящ“ вместо един слят абзац.
 *
 * При maxxmart същата информация СЪЩЕСТВУВА, но е скрита в стената текст
 * на описанието. Производителите я пишат с етикети — „Приложение:“,
 * „Съотношение на смесване:“, „Съхранение:“ — така че може да се извади
 * и подреди, без някой да пренаписва съдържание.
 *
 * Показваме само етикетите, които наистина помагат при работа.
 * Технически показатели като плътност и коефициент на топлопроводност
 * остават в описанието — те са за инженер, не за човек с мистрия.
 */

export interface UsageFact {
  label: string;
  value: string;
}

/** Етикети, които влизат в „Как се използва“, в реда на показване. */
const WANTED: Array<{match: RegExp; label: string}> = [
  {match: /^Приложение$/i, label: 'Приложение'},
  {match: /^Предназначение$/i, label: 'Предназначение'},
  {match: /^Основа$/i, label: 'Основа'},
  {match: /^Съотношение на смесване$/i, label: 'Смесване с вода'},
  {match: /^Максимална дебелина.*$/i, label: 'Максимална дебелина'},
  {match: /^Разходна норма$/i, label: 'Разходна норма'},
  {match: /^Време за.*$/i, label: 'Време за работа'},
  {match: /^Температура.*$/i, label: 'Температура на полагане'},
  {match: /^Зърнометрия$/i, label: 'Зърнометрия'},
  {match: /^Съхранение$/i, label: 'Съхранение'},
];

export function parseUsage(html?: string | null): UsageFact[] {
  if (!html) return [];

  const text = html
    .replace(/<\/(p|div|li|br)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&ndash;|&#8211;/g, '–')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/ /g, ' ');

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const facts: UsageFact[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sep = line.indexOf(':');
    if (sep < 1) continue;

    const rawLabel = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();

    const hit = WANTED.find((w) => w.match.test(rawLabel));
    if (!hit) continue;

    // Стойността понякога е на следващите редове („Разходна норма:“ и
    // отдолу два реда с тирета). Събираме ги, докато не дойде нов етикет.
    if (!value) {
      const collected: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j];
        const nextSep = next.indexOf(':');
        const looksLikeLabel =
          nextSep > 1 && nextSep < 40 && !/^[-–•]/.test(next);
        if (looksLikeLabel) break;
        collected.push(next.replace(/^[-–•]\s*/, ''));
        if (collected.length >= 4) break;
      }
      value = collected.join(' · ');
    }

    if (!value) continue;
    if (facts.some((f) => f.label === hit.label)) continue;

    facts.push({label: hit.label, value});
  }

  return facts;
}

/**
 * Маха от описанието редовете, които вече са показани в „Как се използва“.
 *
 * Без това читателят вижда едно и също два пъти: веднъж подредено в
 * мрежата отгоре и веднъж като суров списък в таба. Точно това правеше
 * долната част на страницата да изглежда разпокъсана.
 *
 * Маха се САМО каквото наистина е показано горе — подава се списъкът с
 * извлечените факти, не предположение. Ако „Как се използва“ не се е
 * появила, описанието остава непокътнато.
 */
export function stripUsageLines(html: string | null | undefined, facts: UsageFact[]): string {
  if (!html || !facts.length) return html ?? '';

  // Етикетите, както изглеждат в оригиналния текст
  const labels = new Set<string>();
  for (const f of facts) {
    labels.add(f.label.toLowerCase());
  }
  // Оригиналните надписи се различават от нашите („Смесване с вода“ е
  // „Съотношение на смесване“ в текста), затова добавяме и тях.
  const ALIASES: Record<string, string[]> = {
    'смесване с вода': ['съотношение на смесване'],
    'температура на полагане': ['температура'],
    'време за работа': ['време за'],
    'максимална дебелина': ['максимална дебелина'],
  };
  for (const [ours, theirs] of Object.entries(ALIASES)) {
    if (labels.has(ours)) theirs.forEach((t) => labels.add(t));
  }

  const isDropped = (line: string) => {
    const sep = line.indexOf(':');
    if (sep < 1) return false;
    const label = line.slice(0, sep).trim().toLowerCase();
    for (const l of labels) {
      if (label === l || label.startsWith(l)) return true;
    }
    return false;
  };

  // Работим по параграфи, за да не разкъсаме форматирането
  return html
    .split(/(?=<p)|(?<=<\/p>)/g)
    .filter((chunk) => {
      const text = chunk
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .trim();
      if (!text) return true;
      if (isDropped(text)) return false;
      // редовете с тирета под „Разходна норма“ също отпадат
      if (labels.has('разходна норма') && /^[-–•]\s*\S+.*(kg|кг)\s*\/\s*(m|м)/i.test(text)) {
        return false;
      }
      return true;
    })
    .join('');
}
