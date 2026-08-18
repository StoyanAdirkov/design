import {Link} from 'react-router';
import {VENDOR_LOGOS} from '~/lib/vendors';

/**
 * Лента с марките — непрекъснат marquee по модела на baniadom.com,
 * но в езика на maxxmart.
 *
 * Логата са чужди и трябва да се четат, затова лентата е светла, а не
 * тъмна като хедъра — тъмен фон би изял тъмните лога. Връзката с
 * останалия дизайн идва от зеления кант, техно-мрежата и картите с
 * hairline рамка, а не от фона.
 *
 * Всяко лого води към /products?vendor=ИМЕ — филтърът вече го има в
 * lib/filters.ts, така че линковете са работещи, не декорация.
 */
export function VendorSlider({className = ''}: {className?: string}) {
  // Пистата се дублира, за да няма шев при превъртане. Копието е скрито
  // за екранни четци, иначе всяка марка се прочита по два пъти.
  const track = (ariaHidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-3 pr-3"
      aria-hidden={ariaHidden || undefined}
    >
      {VENDOR_LOGOS.map((vendor) => (
        <li key={vendor.name} className="shrink-0">
          <Link
            to={`/products?vendor=${encodeURIComponent(vendor.name)}`}
            className="group flex h-[74px] w-[168px] items-center justify-center rounded-lg border border-gray-200 bg-white px-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/45 hover:shadow-[0_8px_24px_-12px_rgba(60,180,74,0.55)] hover:no-underline"
            title={`${vendor.name} — ${vendor.count} продукта`}
            tabIndex={ariaHidden ? -1 : undefined}
          >
            <img
              src={vendor.src}
              alt={vendor.name}
              loading="lazy"
              width={128}
              height={48}
              className="max-h-[46px] w-auto rounded-none object-contain opacity-90 transition-opacity duration-200 group-hover:opacity-100"
            />
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label="Марки, които предлагаме"
      className={`relative overflow-hidden border-y border-gray-200 bg-mist ${className}`}
    >
      {/* зеленият кант горе връзва лентата с хедъра и USP-тата */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      {/* Заглавието беше 18px с 24/28px поле — 96px от общо 200px за един
          ред текст, при това с празно поле надясно. Сега е дребен надпис,
          който само означава лентата, вместо да я надвиква. */}
      <div className="relative flex items-baseline gap-2.5 px-5 pt-3.5 xl:px-8">
        <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-gray-700">
          При нас ще откриете
        </h2>
        <span className="text-[0.72rem] text-gray-500">
          над 300 марки в наличност
        </span>
      </div>

      {/* пистата */}
      <div className="group/marquee relative py-4">
        <div className="marquee flex w-max">
          {track(false)}
          {track(true)}
        </div>

        {/* меко избледняване в двата края, за да не се реже рязко */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-mist to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-mist to-transparent" />
      </div>
    </section>
  );
}
