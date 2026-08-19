/**
 * Истинска пагинация по номер на страница.
 *
 * `getPaginationVariables` от Nitrogen НЕ прави това, което името обещава.
 * Собствената му документация го казва открито:
 *
 *     Page-based: ?page=2 → fetches pageBy * page items (overfetch)
 *
 * Тоест `?page=2` тегли 64 продукта, а не вторите 32. Направено е за
 * „Зареди още“, където точно това искаш. За номерирани страници е
 * неизползваемо: Строителство има 1251 продукта, при 32 на страница
 * последната е №40, а тя би поискала 1280 артикула в една заявка.
 *
 * Storefront курсорите са base64 от `es:<индекс>` — проверено на живо:
 * първата страница връща startCursor `es:0` и endCursor `es:31`. Значи
 * курсорът за началото на страница N се сглобява аритметично, без да
 * обхождаме страниците една по една.
 *
 * Форматът е недокументиран и може да се смени. Затова има и проверка:
 * `verifyPage` сравнява върнатия startCursor с очаквания и казва на
 * извикващия дали да мине на резервния вариант.
 */

const CURSOR_PREFIX = 'es:';

// btoa/atob са глобални и в Cloudflare Workers, и в Node 18+, така че
// няма нужда от Buffer — проектът и без това няма @types/node.
function encodeCursor(index: number): string {
  return btoa(`${CURSOR_PREFIX}${index}`);
}

function decodeCursor(cursor: string): number | null {
  try {
    const raw = atob(cursor);
    if (!raw.startsWith(CURSOR_PREFIX)) return null;
    const n = parseInt(raw.slice(CURSOR_PREFIX.length), 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Номер на текущата страница от URL-а. Винаги ≥ 1. */
export function getPageNumber(searchParams: URLSearchParams): number {
  const raw = searchParams.get('page');
  const n = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/**
 * GraphQL променливи за конкретна страница.
 *
 * Страница 1 няма курсор. За всяка следваща подаваме курсора на
 * ПОСЛЕДНИЯ артикул от предишната — `after` е изключващо.
 */
export function pageVariables(page: number, pageBy: number): {first: number; after?: string} {
  if (page <= 1) return {first: pageBy};
  return {first: pageBy, after: encodeCursor((page - 1) * pageBy - 1)};
}

/**
 * Проверява, че API-то наистина е върнало исканата страница.
 *
 * Връща false, ако курсорният формат се е сменил — тогава извикващият
 * пада обратно на overfetch + рязане, което е бавно, но винаги вярно.
 */
export function verifyPage(
  page: number,
  pageBy: number,
  startCursor: string | null | undefined,
): boolean {
  if (page <= 1) return true;
  if (!startCursor) return false;
  return decodeCursor(startCursor) === (page - 1) * pageBy;
}
