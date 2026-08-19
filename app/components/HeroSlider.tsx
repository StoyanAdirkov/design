import {useState, useEffect, useCallback, useRef} from 'react';
import {Link} from 'react-router';
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline';

export interface HeroSlide {
  src: string;
  alt: string;
  url?: string;
  /** Кратко заглавие за лентата под банера на телефон. */
  title?: string;
  /** Надпис на бутона там. По подразбиране „Виж офертата“. */
  cta?: string;
}

/**
 * Оригиналните банери на maxxmart са с различни пропорции
 * (1912×632 = 3.03:1 и 1920×708 = 2.71:1) — заради това на живия сайт
 * височината подскача при смяна на слайда.
 *
 * Тук всички минават през ЕДНА рамка 3:1. Избрана е нарочно близо до
 * по-широкия банер: така по хоризонтала не се реже нищо и текстът в
 * банерите остава цял. По-тесният губи само по малко горе и долу.
 *
 * НА ТЕЛЕФОН
 * При 390px широчина 3:1 дава лента от 130px — банерът се вижда цял, но
 * седи като тънка ивица и текстът в него е нечетим.
 *
 * Проверих кропването: при 2:1 от „КЛУБНА КАРТА“ остава „КЛУБНА“, от
 * „40 ГОДИНИ ГАРАНЦИЯ“ — половината, а от нашия банер изчезва началото на
 * всеки ред. Тези банери носят съдържание от край до край, така че всяко
 * подрязване ги чупи.
 *
 * Затова на телефон банерът остава ЦЯЛ, а под него застава лента с
 * заглавието и бутона. Героят става ~230px вместо 130px, офертата се чете
 * с истински шрифт и се натиска с палец, без от изображението да е отрязан
 * и пиксел. На desktop лентата я няма — там банерът се чете сам.
 *
 * Истинското решение остава клиентът да даде вертикални банери за мобилни.
 */
const AUTOPLAY_MS = 6000;

export function HeroSlider({slides, className = ''}: {slides: HeroSlide[]; className?: string}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  if (!count) return null;

  const active = slides[index];

  return (
    <section
      className={`relative overflow-hidden bg-ink-2 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Промоции"
    >
      {/* рамката, която изравнява всички банери */}
      <div className="relative aspect-[3/1] w-full">
        {slides.map((slide, i) => {
          const inner = (
            <img
              src={slide.src}
              alt={slide.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className="size-full rounded-none object-cover object-center"
            />
          );
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={i !== index}
            >
              {slide.url ? (
                <Link to={slide.url} className="block size-full hover:no-underline">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}

        {/* лек тъмен ръб долу, за да седят точките върху всяка снимка */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />

        {count > 1 ? (
          <>
            <SliderButton side="left" onClick={() => go(index - 1)} />
            <SliderButton side="right" onClick={() => go(index + 1)} />

            {/* индикатори — вътре в рамката на снимката, за да не слизат
                в лентата под нея на телефон */}
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Слайд ${i + 1} от ${count}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-8 bg-brand shadow-[0_0_12px_rgba(60,180,74,0.9)]'
                      : 'w-2 bg-white/45 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Лентата под банера — само на телефон. Виж бележката най-горе.
          `relative` е нужно: стрелките и точките са абсолютни спрямо
          секцията, а без него лентата им минаваше отдолу и точките
          падаха точно върху заглавието ѝ. */}
      {active?.title ? (
        <div className="relative z-10 flex items-center justify-between gap-3 bg-ink px-4 py-3 md:hidden">
          <span className="min-w-0 flex-1 text-[0.95rem] font-bold leading-tight text-white">
            {active.title}
          </span>
          {active.url ? (
            <Link
              to={active.url}
              className="shrink-0 rounded-lg bg-brand px-3.5 py-2 text-[0.78rem] font-bold text-white hover:bg-brand-dark hover:no-underline"
            >
              {active.cta ?? 'Виж офертата'}
            </Link>
          ) : null}
        </div>
      ) : null}


    </section>
  );
}

function SliderButton({side, onClick}: {side: 'left' | 'right'; onClick: () => void}) {
  const Icon = side === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Предишен банер' : 'Следващ банер'}
      className={`absolute top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-sm transition-all hover:border-brand hover:bg-brand hover:text-white sm:flex ${
        side === 'left' ? 'left-4' : 'right-4'
      }`}
    >
      <Icon className="size-5" strokeWidth={2.2} />
    </button>
  );
}
