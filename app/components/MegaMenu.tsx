import {Link} from 'react-router';
import type {NavCategory} from '~/lib/navigation';
import {CategoryIcon} from './CategoryIcon';

/**
 * Пълноширок панел по модела на Coolblue:
 * колона = подкатегория (ниво 2) като заглавие, под нея нейните деца (ниво 3).
 * Колоните се леят в 4 еднакви вертикални колони чрез CSS columns,
 * така групите не се разкъсват и панелът остава компактен независимо
 * колко подкатегории има категорията (варира от 4 до 9).
 */
/**
 * Най-дългата група е 27 елемента ("Електро-механични инструменти").
 * Без таван тя се разкъсва между колоните и остатъкът увисва без
 * заглавие, което чете като чужди линкове. Затова режем на 10 и
 * пращаме останалите към самата подкатегория.
 */
const MAX_LEAVES = 10;

export function MegaMenu({category}: {category: NavCategory}) {
  const subs = category.children ?? [];

  return (
    <div className="glass-panel border-t border-brand/40 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)]">
      <div className="mx-auto max-w-[1400px] px-6 py-7 md:px-8">
        {/* заглавен ред */}
        <div className="mb-5 flex items-center gap-3 border-b border-hairline pb-4">
          <span className="flex size-9 items-center justify-center rounded-md bg-brand/12 text-brand-bright ring-1 ring-brand/25">
            <CategoryIcon name={category.icon} className="size-5" />
          </span>
          <Link
            to={category.url}
            className="text-base font-semibold tracking-tight text-white hover:text-brand-bright hover:no-underline"
            prefetch="intent"
          >
            {category.title}
          </Link>
          <Link
            to={category.url}
            className="ml-auto text-xs font-medium text-gray-400 transition-colors hover:text-brand-bright hover:no-underline"
            prefetch="intent"
          >
            Виж всички →
          </Link>
        </div>

        {/* групи */}
        <div className="scrollbar-thin-brand max-h-[62vh] overflow-y-auto md:columns-3 md:gap-8 lg:columns-4">
          {subs.map((sub) => (
            <div key={sub.url} className="mb-6 break-inside-avoid">
              <Link
                to={sub.url}
                className="mb-2 block text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-brand-bright hover:no-underline hover:brightness-125"
                prefetch="intent"
              >
                {sub.title}
              </Link>
              {sub.children?.length ? (
                <ul className="space-y-1">
                  {sub.children.slice(0, MAX_LEAVES).map((leaf) => (
                    <li key={leaf.url}>
                      <Link
                        to={leaf.url}
                        className="block text-[0.82rem] leading-snug text-gray-400 transition-colors hover:text-white hover:no-underline"
                        prefetch="intent"
                      >
                        {leaf.title}
                      </Link>
                    </li>
                  ))}
                  {sub.children.length > MAX_LEAVES ? (
                    <li>
                      <Link
                        to={sub.url}
                        className="block text-[0.82rem] font-medium leading-snug text-gray-500 transition-colors hover:text-brand-bright hover:no-underline"
                        prefetch="intent"
                      >
                        + още {sub.children.length - MAX_LEAVES}
                      </Link>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
