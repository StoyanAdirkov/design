import {useRef, useState, useEffect, useCallback} from 'react';
import type {Product} from '@cloudcart/nitrogen';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';
import {ProductCard} from './ProductCard';

/**
 * Продуктов карусел — 4 карти на екран при desktop.
 *
 * Плъзгането е обикновен scroll-snap контейнер, а не JS транслация:
 * така работи и с пръст, и с трекпад, и с клавиатура, без да се бори с
 * нативното поведение. Стрелките само превъртат с една „страница“.
 */
interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  /** Етикет, който сяда върху всяка карта (напр. „Препоръчан“) */
  badge?: string;
  /** Процент отстъпка, наложен на всички карти в каруселa */
  salePercent?: number;
  viewAllUrl?: string;
  viewAllLabel?: string;
}

export function ProductCarousel({
  title,
  subtitle,
  products,
  badge,
  salePercent,
  viewAllUrl,
  viewAllLabel = 'Виж всички',
}: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    // прагът е 12, а не 2: заради px-1 на контейнера scrollLeft стои на
    // 4 дори в самото начало и стрелката „Назад“ не се изключваше
    setAtStart(el.scrollLeft <= 12);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 12);
  }, []);

  useEffect(() => {
    sync();
    const el = scroller.current;
    if (!el) return;
    const onResize = () => sync();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sync, products.length]);

  const page = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({left: dir * el.clientWidth, behavior: 'smooth'});
  };

  if (!products.length) return null;

  return (
    <section aria-label={title} className="relative">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-dark md:text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[0.82rem] text-gray-500">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {viewAllUrl ? (
            <a
              href={viewAllUrl}
              className="mr-1 text-[0.8rem] font-semibold text-brand-dark transition-colors hover:text-brand hover:no-underline"
            >
              {viewAllLabel} →
            </a>
          ) : null}
          <ArrowButton dir="left" disabled={atStart} onClick={() => page(-1)} />
          <ArrowButton dir="right" disabled={atEnd} onClick={() => page(1)} />
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={sync}
        className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="w-[72%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[calc(25%-0.75rem)]"
          >
            <ProductCard
              product={product}
              badge={badge}
              salePercent={salePercent}
              loading={i < 4 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Назад' : 'Напред'}
      className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all hover:border-brand hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-600"
    >
      <Icon className="size-4" strokeWidth={2.2} />
    </button>
  );
}
