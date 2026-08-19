import {Link} from 'react-router';
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
      </div>

      {/* Пистата се движи сама. Дублирана е, за да няма шев; копието е
          aria-hidden. Плочките са с ФИКСИРАНА ширина — при процентна
          дублираната писта не е точно 200% и шевът се вижда. */}
      <div className="group/marquee relative overflow-hidden">
      <div className="marquee marquee-categories flex w-max gap-4">
        {[...categories, ...categories].map((cat, i) => (
          <Link
            key={`${cat.url}-${i}`}
            to={cat.url}
            prefetch="intent"
            aria-hidden={i >= categories.length || undefined}
            tabIndex={i >= categories.length ? -1 : undefined}
            // 280px на екран от 390 значеше, че в кадъра се събират
            // плочка и половина и заглавията се режеха по средата на
            // думата. При 210px влизат почти две цели и лентата пак се
            // чете, докато се движи.
            className="group relative aspect-[4/3] w-[210px] shrink-0 overflow-hidden rounded-xl bg-ink ring-1 ring-hairline/60 hover:no-underline sm:w-[300px] lg:w-[360px]"
          >
            <img
              src={cat.image}
              alt=""
              aria-hidden="true"
              loading={i < 4 ? 'eager' : 'lazy'}
              className="absolute inset-0 size-full rounded-none object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />

            {/* Затъмнението беше from-black/85 via-black/35 — покриваше
                снимката почти изцяло и от категорията се виждаше силует.
                Сега тъмното е само в долната третина, колкото текстът да е
                четим; горните две трети остават чисти. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent via-40% to-transparent transition-all duration-500 group-hover:from-black/85" />

            {/* зелено сияние, което се появява отдолу */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
              <span className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-bright">
                {cat.kicker}
              </span>
              <span className="block text-[0.92rem] font-bold leading-tight text-white sm:text-[1.05rem] md:text-[1.15rem]">
                {cat.title}
              </span>

              {/* линията израства отляво надясно */}
              <span className="mt-3 block h-[3px] w-9 origin-left rounded-full bg-brand transition-transform duration-500 ease-out group-hover:scale-x-[3.2] motion-reduce:transition-none" />
            </div>
          </Link>
        ))}
      </div>

        {/* меко избледняване в двата края */}
        {/* Избледняването беше по 16 стъпки от всяка страна и на телефон
            изяждаше половин плочка. Свито е и изчезва под sm. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-white to-transparent sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 bg-gradient-to-l from-white to-transparent sm:block" />
      </div>
    </section>
  );
}

