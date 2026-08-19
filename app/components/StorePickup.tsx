import {useState} from 'react';
import {Link} from 'react-router';
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {getFeaturedStores, STORES, STORE_HOURS} from '~/lib/stores';
import {useSelectedStore} from '~/lib/use-selected-store';

/**
 * Обектите, от които може да се вземе продуктът, с избор.
 *
 * Изборът се помни в браузъра, за да не се прави на всеки продукт.
 *
 * ⚠ Формулировката е нарочна: „Вземи от обект“, а НЕ „налично в“.
 * Storefront API-то дава едно общо количество за целия магазин, не по
 * складове. Изборът тук казва КЪДЕ иска да вземе клиентът, а не че
 * артикулът е там — затова телефонът остава до всеки обект.
 */
export function StorePickup() {
  const {store: selected, select, ready} = useSelectedStore();
  const [expanded, setExpanded] = useState(false);

  const featured = getFeaturedStores(5);
  const list = expanded ? STORES.filter((s) => !s.warehouse) : featured;
  const total = STORES.length;

  const tel = (phone: string) =>
    `tel:+359${phone.replace(/\D/g, '').replace(/^0/, '')}`;

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white">
      {/* шапка — показва избрания обект, ако има */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-gray-200 px-4 py-3">
        <BuildingStorefrontIcon className="size-5 shrink-0 text-brand" />
        {ready && selected ? (
          <>
            <span className="min-w-0 text-[0.85rem]">
              <span className="text-gray-500">Вземи от </span>
              <span className="font-semibold text-dark">
                {selected.city} · {selected.name}
              </span>
            </span>
            <button
              type="button"
              onClick={() => select(null)}
              className="ml-auto text-[0.78rem] font-semibold text-brand-dark hover:brightness-110"
            >
              Смени
            </button>
          </>
        ) : (
          <>
            <span className="text-[0.85rem] font-semibold text-dark">
              Избери обект за взимане
            </span>
            <span className="text-[0.85rem] text-gray-500">· {total} в страната</span>
          </>
        )}
      </div>

      <ul className="divide-y divide-gray-100">
        {list.map((store) => {
          const isSelected = selected?.name === store.name;
          return (
            <li
              key={store.name}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 transition-colors ${
                isSelected ? 'bg-brand/[0.06]' : ''
              }`}
            >
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
                href={tel(store.phone)}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-[0.78rem] font-semibold text-brand-dark transition-colors hover:border-brand hover:bg-brand/5 hover:no-underline"
              >
                <PhoneIcon className="size-3.5" />
                {store.phone}
              </a>

              <button
                type="button"
                onClick={() => select(isSelected ? null : store)}
                aria-pressed={isSelected}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-[0.78rem] font-semibold transition-colors ${
                  isSelected
                    ? 'bg-brand text-white'
                    : 'border border-brand text-brand-dark hover:bg-brand hover:text-white'
                }`}
              >
                {isSelected ? (
                  <>
                    <CheckCircleIcon className="size-4" />
                    Избран
                  </>
                ) : (
                  'Избери'
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-4 py-3">
        <span className="text-[0.75rem] text-gray-500">{STORE_HOURS}</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-[0.8rem] font-semibold text-brand-dark hover:brightness-110"
          >
            {expanded ? 'Покажи по-малко' : `Покажи всички ${total - 2}`}
            <ChevronDownIcon
              className={`size-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
          <Link
            to="/pages/magazini"
            prefetch="intent"
            className="text-[0.8rem] font-semibold text-gray-500 hover:text-brand-dark hover:no-underline"
          >
            На карта →
          </Link>
        </div>
      </div>

      <p className="border-t border-gray-100 px-4 py-2.5 text-[0.72rem] leading-snug text-gray-500">
        Изборът казва къде искаш да вземеш поръчката. Наличността се различава
        по обекти — обади се, преди да тръгнеш.
      </p>
    </div>
  );
}
