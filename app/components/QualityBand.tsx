import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router';
import {PlayIcon, PauseIcon} from '@heroicons/react/24/solid';

/**
 * „Материали, на които може да се разчита“ — качество, разнообразие,
 * наличност и дълготрайност, с кратко видео.
 *
 * ВСИЧКИ ЧИСЛА СА ИЗМЕРЕНИ, НЕ ИЗМИСЛЕНИ (19 август 2026):
 *   6 922 продукта     — products.totalCount от Storefront API
 *   100 марки          — vendors от Admin API
 *   534 категории      — с поне един продукт, от дървото с 702 категории
 *   8 от 10 налични    — availableForSale върху извадка от 2000 продукта
 *                        (1607 налични, 80,3%)
 *   26 обекта          — от lib/stores.ts
 *
 * ⚠ Защо не пише „6922 налични“: филтърът `available` на Storefront-а не
 * работи — връща целия каталог независимо какво подадеш. Затова делът е
 * преброен от полето по продукт, а не взет от филтъра.
 *
 * Видеото е складово (Pexels, свободно за търговска употреба), защото
 * maxxmart нямат публичен клип, който да се вгради — реелите им във
 * Facebook не се сервират като файл. Заменя се с един ред, когато дадат
 * свой.
 */

interface Point {
  key: string;
  label: string;
  figure: string;
  text: string;
  icon: React.ReactNode;
}

const POINTS: Point[] = [
  {
    key: 'quality',
    label: 'Качество',
    figure: '100 марки',
    text: 'Baumit, Ceresit, Bosch, Grohe, Tondach — оригинални системи, не заместители.',
    icon: (
      <>
        <path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8L3.5 9.2l5.9-.9z" />
      </>
    ),
  },
  {
    key: 'variety',
    label: 'Разнообразие',
    figure: '6 900+ артикула',
    text: 'В 534 раздела — от един чувал лепило до материалите за цял обект.',
    icon: (
      <>
        <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z" />
        <path d="M3.5 7 12 11.2 20.5 7" />
        <path d="M12 11.2v10" />
      </>
    ),
  },
  {
    key: 'stock',
    label: 'Наличност',
    figure: '8 от 10 налични',
    text: 'Веднага, без чакане на доставка. Плюс 26 обекта, от които се взима безплатно.',
    icon: (
      <>
        <path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z" />
        <path d="m8.5 12 2.4 2.4 4.6-4.6" />
      </>
    ),
  },
  {
    key: 'durability',
    label: 'Дълготрайност',
    figure: 'Пълни системи',
    text: 'Лепило, мрежа, грунд и мазилка от един производител — с неговата гаранция.',
    icon: (
      <>
        <path d="M12 3.2 4.8 6v6.2c0 4.3 3 7.6 7.2 8.8 4.2-1.2 7.2-4.5 7.2-8.8V6z" />
        <path d="m9 12.2 2.2 2.2 4-4.2" />
      </>
    ),
  },
];

export function QualityBand({className = ''}: {className?: string}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  /**
   * Уважаваме „намалено движение“ в системата: там видеото не тръгва
   * само, а стои на постера, докато човек не го пусне. Проверката е в
   * ефект, а не в атрибут, защото на сървъра няма matchMedia.
   */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      video.current?.pause();
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      aria-labelledby="quality-heading"
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/70 ${className}`}
    >
      <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Видео */}
        <div className="relative aspect-[16/10] bg-gray-900 lg:aspect-auto lg:min-h-[22rem]">
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            src="/video/sklad.mp4"
            poster="/video/sklad.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Рафтове със строителни материали в склад"
          />

          {/* Лек градиент отдолу, за да се чете надписът върху всеки кадър */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent"
          />

          {/* Надписът НЕ твърди, че това е складът на maxxmart — не е.
              Клипът е стоков (Pexels). Първата версия пишеше „Складът зад
              26-те обекта", което представяше чужди кадри за техни.
              Говори за наличността, която е измерена и вярна, а не за
              сградата на екрана. Сменя се, щом дадат свои кадри. */}
          <p className="absolute bottom-4 left-4 right-16 text-[0.8rem] font-medium leading-snug text-white/95">
            8 от 10 артикула са налични веднага — поръчката тръгва днес, а не
            следващата седмица.
          </p>

          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Спри видеото' : 'Пусни видеото'}
            className="absolute bottom-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full border-none bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/35"
          >
            {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4 translate-x-px" />}
          </button>
        </div>

        {/* Текст */}
        <div className="p-6 md:p-8">
          <h2
            id="quality-heading"
            className="text-xl font-bold tracking-tight text-dark md:text-2xl"
          >
            Материали, на които може да се разчита
          </h2>
          <p className="mt-1.5 max-w-lg text-[0.88rem] leading-relaxed text-gray-500">
            Тридесет години на пазара и склад, който държи каталога зареден.
            Ето какво стои зад това.
          </p>

          <ul className="mt-6 grid list-none gap-x-6 gap-y-5 p-0 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p.key} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-dark">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[1.15rem]"
                    aria-hidden="true"
                  >
                    {p.icon}
                  </svg>
                </span>
                <div className="min-w-0">
                  <span className="block text-[0.66rem] font-bold uppercase tracking-[0.13em] text-gray-400">
                    {p.label}
                  </span>
                  <span className="block text-[0.95rem] font-bold leading-tight text-dark">
                    {p.figure}
                  </span>
                  <span className="mt-1 block text-[0.82rem] leading-relaxed text-gray-500">
                    {p.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/collections/stroitelstvo"
              prefetch="intent"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-all hover:bg-brand-dark hover:no-underline hover:shadow-[0_6px_18px_-6px_rgba(60,180,74,0.85)]"
            >
              Разгледай каталога
            </Link>
            <Link
              to="/page/magazini"
              prefetch="intent"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-[0.85rem] font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand-dark hover:no-underline"
            >
              Виж 26-те обекта
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
