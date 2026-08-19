import {Link} from 'react-router';
import {ArrowLeftIcon} from '@heroicons/react/20/solid';
import {FilterIcon} from './FilterIcon';

export interface SubcategoryItem {
  id: string;
  title: string;
  handle: string;
  productsCount?: number | null;
}

/**
 * Подкатегориите като филтър в лявата колона.
 *
 * ⚠ ЗАЩО СА ЛИНКОВЕ, А НЕ ОТМЕТКИ
 * Storefront филтърът `category` не работи — проверено на живо: подаваш
 * категория, връща целия каталог (6922 продукта). Тоест не може да се
 * каже „покажи ми само тези две подкатегории“ с една заявка. Затова
 * всяка подкатегория е линк към собствената си страница, което и без
 * това е по-доброто поведение: адресът се споделя и търсачките го
 * обхождат.
 *
 * Броевете идват от `productsCount` на самата категория, затова могат да
 * се разминават с витрината — там влизат само активните артикули. Не ги
 * поправяме наум: числото на клиента е числото на клиента.
 */
export function SubcategoryFilter({
  items,
  parent,
  currentHandle,
}: {
  items: SubcategoryItem[];
  /** Родителят, ако сме в подкатегория — за връщане нагоре. */
  parent?: {title: string; handle: string} | null;
  currentHandle: string;
}) {
  // Празните подкатегории отпадат: „Битумна рулонна хидроизолация (0)“
  // е филтър, който води до празна страница. Тези без известен брой
  // остават — липсващо число не значи липсващи продукти.
  const usable = items.filter((c) => c.productsCount == null || c.productsCount > 0);

  if (!usable.length && !parent) return null;

  const VISIBLE = 9;
  const shown = usable.slice(0, VISIBLE);
  const rest = usable.length - shown.length;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <FilterIcon name="type" className="size-[1.05rem] shrink-0 text-brand" />
        Категории
      </span>

      {parent ? (
        <Link
          to={`/collections/${parent.handle}`}
          prefetch="intent"
          className="mb-0.5 flex items-center gap-1 rounded-md py-1 pl-1 pr-1.5 text-[0.82rem] text-gray-500 transition-colors hover:bg-gray-50 hover:text-dark hover:no-underline"
        >
          <ArrowLeftIcon className="size-3.5 shrink-0" />
          Всичко в „{parent.title}“
        </Link>
      ) : null}

      <div className="flex flex-col gap-0.5">
        {shown.map((c) => {
          const active = c.handle === currentHandle;
          return (
            <Link
              key={c.id}
              to={`/collections/${c.handle}`}
              prefetch="intent"
              aria-current={active ? 'page' : undefined}
              className={`relative flex items-center gap-1.5 rounded-md py-1 pl-2 pr-1.5 text-[0.85rem] transition-colors duration-150 hover:no-underline ${
                active ? 'bg-brand/10 font-semibold text-brand-dark' : 'text-dark hover:bg-gray-50'
              }`}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-brand"
                />
              ) : null}
              <span className="flex-1 truncate">{c.title}</span>
              {c.productsCount != null ? (
                <span className="shrink-0 text-xs text-gray-400">({c.productsCount})</span>
              ) : null}
            </Link>
          );
        })}
      </div>

      {rest > 0 ? (
        <span className="pl-2 text-[0.72rem] text-gray-400">
          и още {rest} {rest === 1 ? 'подкатегория' : 'подкатегории'} по-надолу
        </span>
      ) : null}
    </div>
  );
}
