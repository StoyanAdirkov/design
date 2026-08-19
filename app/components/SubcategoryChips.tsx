import {Link} from 'react-router';
import {Image} from '@cloudcart/nitrogen-react';

/**
 * Лента с подкатегориите над продуктите.
 *
 * Същата форма като чиповете „Пазарувай по проект“, но с различна роля и
 * затова на отделен ред: тук е структурата на каталога, там е задачата на
 * купувача. Категориите стоят отгоре, защото са основната навигация, а
 * проектите са допълнителният вход.
 *
 * ⚠ `displayChildren` НАРОЧНО НЕ СЕ ПРОВЕРЯВА
 * Старият блок се показваше само когато категорията има вдигнат
 * `displayChildren` в админа. В maxxmart той е изключен навсякъде, тоест
 * функцията стоеше мъртва. Показваме подкатегориите винаги, когато ги
 * има — ако клиентът реши, че някъде не ги иска, това е решение за
 * админа, не причина цялата лента да мълчи.
 *
 * Празните подкатегории отпадат — плочка, която води до празна страница,
 * само хаби кликване.
 *
 * ⚠ СНИМКИТЕ НА КАТЕГОРИИТЕ СА ЛОГОТО НА МАГАЗИНА
 * Проверено в Admin API-то: `image` е null при ВСЯКА категория в
 * maxxmart. Storefront-ът обаче не връща null, а подменя липсата с
 * логото — `/cdn/img/logo/7/7.jpeg`. Ако му се доверим, лентата излиза
 * с осем еднакви зелени кръгчета с логото, което не казва нищо и
 * изглежда като грешка.
 *
 * Затова логото се разпознава и се третира като липсваща снимка.
 * Когато клиентът качи истински снимки на категориите, те ще излязат
 * сами — проверката пуска всичко, което не е от папката с логото.
 */

/** Storefront-ът подменя липсващата снимка с логото на магазина. */
function isStoreLogo(url?: string | null): boolean {
  return !!url && url.includes('/cdn/img/logo/');
}
export interface SubcategoryChip {
  id: string;
  title: string;
  handle: string;
  productsCount?: number | null;
  image?: {url?: string} | null;
}

export function SubcategoryChips({
  items,
  className = '',
}: {
  items: SubcategoryChip[];
  className?: string;
}) {
  const usable = items
    .filter((c) => c.productsCount == null || c.productsCount > 0)
    .map((c) => (isStoreLogo(c.image?.url) ? {...c, image: null} : c));
  if (!usable.length) return null;

  // Когато никоя няма своя снимка, лентата минава изцяло на текст —
  // осем еднакви заместващи кръгчета са по-лоши от никакви.
  const anyImage = usable.some((c) => c.image?.url);

  return (
    <section aria-label="Подкатегории" className={className}>
      <div className="mb-2.5 flex items-baseline gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Разгледай по раздел
        </h2>
        <span className="text-[0.72rem] text-gray-400">
          {usable.length} подраздела в тази категория
        </span>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {usable.map((c) => (
          <Link
            key={c.id}
            to={`/collections/${c.handle}`}
            prefetch="intent"
            className={`group flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pr-3.5 text-[0.82rem] font-medium text-gray-700 transition-all duration-150 hover:border-brand hover:text-brand-dark hover:no-underline ${
              anyImage ? 'pl-1.5' : 'pl-3.5'
            }`}
          >
            {anyImage ? (
              c.image?.url ? (
                <Image
                  data={c.image as any}
                  alt={c.title}
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[0.8rem] font-bold text-brand-dark"
                >
                  {c.title.trim().charAt(0).toLocaleUpperCase('bg-BG')}
                </span>
              )
            ) : null}
            <span className="whitespace-nowrap">{c.title}</span>
            {c.productsCount != null ? (
              <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[0.68rem] font-semibold text-gray-500 transition-colors group-hover:bg-brand/10 group-hover:text-brand-dark">
                {c.productsCount}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
