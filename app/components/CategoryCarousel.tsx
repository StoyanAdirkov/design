import {useRef, useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router';
import {ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon} from '@heroicons/react/24/outline';
import type {SeasonalCategory} from '~/lib/seasonal-categories';

/**
 * Карусел с категорийни плочки — снимка, тъмен градиент и текст върху нея.
 *
 * Ефектите са три и всеки има причина:
 *  · снимката се приближава бавно при задържане — дава живот, без да мести
 *    текста, защото трансформацията е само върху <img>;
 *  · градиентът потъмнява, за да остане текстът четим и когато снимката е
 *    светла (маркучът е жълт, шатрата е бяла);
 *  · зелена линия израства отдолу и стрелката излиза — сигнал, че плочката
 *    води някъде.
 *
 * Всичко е на CSS transition, без JS анимация, и се изключва при
 * prefers-reduced-motion.
 */
export function CategoryCarousel({
  title,
  subtitle,
  categories,
}: {
  title: string;
  subtitle?: string;
  categories: SeasonalCategory[];
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 12);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 12);
  }, []);

  useEffect(() => {
    sync();
    const onResize = () => sync();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [sync, categories.length]);

  const page = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({left: dir * el.clientWidth, behavior: 'smooth'});
  };

  if (!categories.length) return null;

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
          <ArrowButton dir="left" disabled={atStart} onClick={() => page(-1)} />
          <ArrowButton dir="right" disabled={atEnd} onClick={() => page(1)} />
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={sync}
        className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
      >
        {categories.map((cat, i) => (
          <Link
            key={cat.url}
            to={cat.url}
            prefetch="intent"
            className="group relative aspect-[4/5] w-[68%] shrink-0 snap-start overflow-hidden rounded-xl bg-ink ring-1 ring-hairline/60 hover:no-underline sm:aspect-[4/3] sm:w-[44%] lg:w-[30%] xl:w-[calc(25%-0.75rem)]"
          >
            <img
              src={cat.image}
              alt=""
              aria-hidden="true"
              loading={i < 4 ? 'eager' : 'lazy'}
              className="absolute inset-0 size-full rounded-none object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />

            {/* градиент — потъмнява при задържане, за да остане текстът четим */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/55" />

            {/* зелено сияние, което се появява отдолу */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-bright">
                {cat.kicker}
              </span>
              <span className="flex items-center gap-2 text-[1.05rem] font-bold leading-tight text-white md:text-[1.15rem]">
                {cat.title}
                <ArrowRightIcon className="size-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none" />
              </span>

              {/* линията израства отляво надясно */}
              <span className="mt-3 block h-[3px] w-9 origin-left rounded-full bg-brand transition-transform duration-500 ease-out group-hover:scale-x-[3.2] motion-reduce:transition-none" />
            </div>
          </Link>
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
