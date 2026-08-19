import {useState} from 'react';
import {Link} from 'react-router';
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {STORE_HOURS} from '~/lib/stores';
import {getStoreStock} from '~/lib/store-stock';
import {useSelectedStore} from '~/lib/use-selected-store';

/**
 * Обектите, в които КОНКРЕТНАТА разновидност е налична, с избор.
 *
 * Показват се само обекти, които имат артикула, и по колко. Ако е само в
 * един — няма какво да се избира и просто се показва. Ако е в няколко —
 * клиентът избира, а изборът се помни между продуктите.
 *
 * ⚠ Числата са ДЕМО — реална наличност по обект платформата не дава.
 * Видим етикет няма по желание на клиента: това е превю за представяне.
 * Предупреждението стои в lib/store-stock.ts, където се сменя източникът.
 */
export function StorePickup({
  variantId,
  totalQuantity,
}: {
  variantId?: string | null;
  totalQuantity?: number | null;
}) {
  const {store: selected, select, ready} = useSelectedStore();
  const [expanded, setExpanded] = useState(false);

  const available = getStoreStock(variantId ?? '', totalQuantity ?? 0);

  const tel = (phone: string) =>
    `tel:+359${phone.replace(/\D/g, '').replace(/^0/, '')}`;

  // няма нито един обект с този артикул
  if (!available.length) {
    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-start gap-2.5">
          <BuildingStorefrontIcon className="mt-0.5 size-5 shrink-0 text-gray-400" />
          <div>
            <p className="text-[0.85rem] font-semibold text-dark">
              В момента не е наличен в обект
            </p>
            <p className="mt-0.5 text-[0.8rem] leading-snug text-gray-500">
              Можеш да го поръчаш с доставка или да се обадиш на{' '}
              <a href="tel:+35928180826" className="font-semibold text-brand-dark hover:no-underline">
                02 81 80 826
              </a>{' '}
              за проверка.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const single = available.length === 1;
  const shown = expanded ? available : available.slice(0, 5);

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-gray-200 px-4 py-3">
        <BuildingStorefrontIcon className="size-5 shrink-0 text-brand" />

        {ready && selected && available.some((a) => a.store.name === selected.name) ? (
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
          <span className="text-[0.85rem]">
            <span className="font-semibold text-dark">
              {single ? 'Наличен в 1 обект' : `Наличен в ${available.length} обекта`}
            </span>
            {single ? null : (
              <span className="text-gray-500"> · избери откъде да го вземеш</span>
            )}
          </span>
        )}

      </div>

      <ul className="divide-y divide-gray-100">
        {shown.map(({store, quantity}) => {
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
                <span className="mt-0.5 flex items-center gap-1.5 text-[0.76rem] font-semibold text-brand-dark">
                  <span className="inline-block size-1.5 rounded-full bg-brand" />
                  {quantity} бр. в наличност
                </span>
              </span>

              <a
                href={tel(store.phone)}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-[0.78rem] font-semibold text-brand-dark transition-colors hover:border-brand hover:bg-brand/5 hover:no-underline"
              >
                <PhoneIcon className="size-3.5" />
                {store.phone}
              </a>

              {/* при един-единствен обект няма какво да се избира */}
              {single ? null : (
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
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 px-4 py-3">
        <span className="text-[0.75rem] text-gray-500">{STORE_HOURS}</span>
        <div className="flex items-center gap-4">
          {available.length > 5 ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-[0.8rem] font-semibold text-brand-dark hover:brightness-110"
            >
              {expanded ? 'Покажи по-малко' : `Още ${available.length - 5} обекта`}
              <ChevronDownIcon
                className={`size-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          ) : null}
          <Link
            to="/pages/magazini"
            prefetch="intent"
            className="text-[0.8rem] font-semibold text-gray-500 hover:text-brand-dark hover:no-underline"
          >
            Всички обекти →
          </Link>
        </div>
      </div>
    </div>
  );
}
