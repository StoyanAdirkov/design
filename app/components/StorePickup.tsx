import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  CheckIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import {STORE_HOURS} from '~/lib/stores';
import {getStoreStock} from '~/lib/store-stock';
import {useSelectedStore} from '~/lib/use-selected-store';

/**
 * Обектите, в които КОНКРЕТНАТА разновидност е налична.
 *
 * Списъкът е в падащо меню, а не разгънат: при артикул, който го има в
 * почти всички обекти, разгънатият списък изяжда цялата страница и
 * избутва бутона за поръчка под линията на сгъвката.
 *
 * Затворено се вижда само същественото — избраният обект или колко са
 * наличните. Отваря се при нужда.
 *
 * ⚠ Числата са ДЕМО — реална наличност по обект платформата не дава.
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
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const available = getStoreStock(variantId ?? '', totalQuantity ?? 0);

  // затваряне при клик встрани и с Escape — иначе менюто увисва отворено
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const tel = (phone: string) =>
    `tel:+359${phone.replace(/\D/g, '').replace(/^0/, '')}`;

  if (!available.length) {
    return (
      <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-4">
        <BuildingStorefrontIcon className="mt-0.5 size-5 shrink-0 text-gray-400" />
        <div>
          <p className="text-[0.85rem] font-semibold text-dark">
            В момента не е наличен в обект
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-gray-500">
            Поръчай с доставка или се обади на{' '}
            <a href="tel:+35928180826" className="font-semibold text-brand-dark hover:no-underline">
              02 81 80 826
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  const current = ready && selected
    ? available.find((a) => a.store.name === selected.name)
    : undefined;

  const single = available.length === 1;
  const only = available[0];

  // един-единствен обект — няма меню, просто го показваме
  if (single) {
    return (
      <div className="mt-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <BuildingStorefrontIcon className="size-5 shrink-0 text-brand" />
          <span className="min-w-0 flex-1">
            <span className="block text-[0.85rem] font-semibold text-dark">
              {only.store.city} · {only.store.name}
            </span>
            <span className="block text-[0.78rem] text-gray-500">{only.store.address}</span>
          </span>
          <span className="text-[0.78rem] font-semibold text-brand-dark">
            {only.quantity} бр.
          </span>
          <a
            href={tel(only.store.phone)}
            className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-[0.78rem] font-semibold text-brand-dark hover:border-brand hover:bg-brand/5 hover:no-underline"
          >
            <PhoneIcon className="size-3.5" />
            {only.store.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrap} className="relative mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center gap-2.5 rounded-lg border bg-white px-4 py-3 text-left transition-colors ${
          open ? 'border-brand' : 'border-gray-200 hover:border-brand/60'
        }`}
      >
        <BuildingStorefrontIcon className="size-5 shrink-0 text-brand" />

        {current ? (
          <span className="min-w-0 flex-1">
            <span className="block text-[0.85rem] font-semibold text-dark">
              Вземи от {current.store.city} · {current.store.name}
            </span>
            <span className="block text-[0.78rem] text-gray-500">
              {current.quantity} бр. в наличност · {current.store.address}
            </span>
          </span>
        ) : (
          <span className="min-w-0 flex-1">
            <span className="block text-[0.85rem] font-semibold text-dark">
              Наличен в {available.length} обекта
            </span>
            <span className="block text-[0.78rem] text-gray-500">
              Избери откъде да го вземеш
            </span>
          </span>
        )}

        <ChevronDownIcon
          className={`size-4 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)]"
        >
          {/* списъкът си има таван на височината и скролира вътре, вместо
              да разтяга страницата */}
          <ul className="scrollbar-thin-brand max-h-[320px] divide-y divide-gray-100 overflow-y-auto">
            {available.map(({store, quantity}) => {
              const isSelected = selected?.name === store.name;
              return (
                <li key={store.name}>
                  <div
                    className={`flex items-center gap-3 px-4 py-2.5 ${
                      isSelected ? 'bg-brand/[0.07]' : ''
                    }`}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        select(isSelected ? null : store);
                        setOpen(false);
                      }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="flex items-center gap-1.5">
                        {isSelected ? (
                          <CheckIcon className="size-4 shrink-0 text-brand" strokeWidth={2.5} />
                        ) : null}
                        <span className="truncate text-[0.84rem] font-semibold text-dark">
                          {store.city} · {store.name}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[0.76rem] text-gray-500">
                        {store.address}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-[0.74rem] font-semibold text-brand-dark">
                        <span className="inline-block size-1.5 rounded-full bg-brand" />
                        {quantity} бр.
                      </span>
                    </button>

                    <a
                      href={tel(store.phone)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-[0.76rem] font-semibold text-brand-dark hover:border-brand hover:bg-brand/5 hover:no-underline"
                    >
                      <PhoneIcon className="size-3.5" />
                      {store.phone}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-4 py-2.5">
            <span className="text-[0.74rem] text-gray-500">{STORE_HOURS}</span>
            <Link
              to="/pages/magazini"
              prefetch="intent"
              className="text-[0.78rem] font-semibold text-brand-dark hover:no-underline hover:brightness-110"
            >
              Всички обекти →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
