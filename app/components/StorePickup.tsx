import {Link} from 'react-router';
import {BuildingStorefrontIcon, PhoneIcon} from '@heroicons/react/24/outline';
import {getFeaturedStores, STORES, STORE_HOURS} from '~/lib/stores';

/**
 * Обектите, от които може да се вземе продуктът.
 *
 * ⚠ Формулировката е нарочна: „Вземи от обект“, а НЕ „налично в“.
 * Storefront API-то дава едно общо количество за целия магазин, не по
 * складове. Твърдение, че артикулът е в конкретен обект, би пратило
 * човек през половин София за нищо.
 *
 * Затова всеки обект е с телефон — докато няма наличност по обект,
 * обаждането е честният начин да се провери.
 */
export function StorePickup() {
  const featured = getFeaturedStores(5);
  const total = STORES.length;

  return (
    <details className="group mt-3 rounded-lg border border-gray-200 bg-white">
      <summary className="flex cursor-pointer items-center gap-2.5 px-4 py-3 text-[0.85rem] font-semibold text-dark [&::-webkit-details-marker]:hidden">
        <BuildingStorefrontIcon className="size-5 shrink-0 text-brand" />
        Вземи от обект
        <span className="font-normal text-gray-500">· {total} в страната</span>
        <span className="ml-auto text-[0.78rem] font-medium text-brand-dark transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>

      <ul className="divide-y divide-gray-100 border-t border-gray-200">
        {featured.map((store) => (
          <li key={store.name} className="flex flex-wrap items-start gap-x-3 gap-y-1 px-4 py-3">
            <span className="min-w-0 flex-1">
              <span className="block text-[0.84rem] font-semibold text-dark">
                {store.city} · {store.name}
              </span>
              <span className="block text-[0.78rem] leading-snug text-gray-500">
                {store.address}
              </span>
              {store.note ? (
                <span className="block text-[0.74rem] text-amber-700">{store.note}</span>
              ) : null}
            </span>
            <a
              href={`tel:+359${store.phone.replace(/\D/g, '').replace(/^0/, '')}`}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-[0.78rem] font-semibold text-brand-dark transition-colors hover:border-brand hover:bg-brand/5 hover:no-underline"
            >
              <PhoneIcon className="size-3.5" />
              {store.phone}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-4 py-3">
        <span className="text-[0.75rem] text-gray-500">{STORE_HOURS}</span>
        <Link
          to="/pages/magazini"
          prefetch="intent"
          className="text-[0.8rem] font-semibold text-brand-dark hover:no-underline hover:brightness-110"
        >
          Виж всички {total} обекта →
        </Link>
      </div>

      <p className="border-t border-gray-100 px-4 py-2.5 text-[0.72rem] leading-snug text-gray-500">
        Наличността се различава по обекти. Обадете се, преди да тръгнете.
      </p>
    </details>
  );
}
