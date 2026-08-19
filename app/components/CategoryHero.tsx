import {CategoryIcon} from './CategoryIcon';

/**
 * Заглавна лента на категорията.
 *
 * Три неща носят информация, не украса:
 *   · етикетът горе вляво казва в кой главен раздел си;
 *   · картата вдясно показва КОЛКО продукта има СЛЕД филтрите — при
 *     включен филтър числото пада и това е най-бързата обратна връзка,
 *     че изборът е подействал;
 *   · гигантското име отзад е името на самата категория, не декор.
 *
 * Снимката вдясно е с маска към прозрачно, за да не реже рязко и да не
 * се бие със заглавието. Тя е зад текста, затова носи `aria-hidden` —
 * за екранен четец е шум, името вече е в h1.
 */
export function CategoryHero({
  title,
  parentTitle,
  tagline,
  image,
  icon,
  count,
}: {
  title: string;
  parentTitle?: string | null;
  tagline?: string | null;
  image?: string | null;
  icon?: string | null;
  count?: number | null;
}) {
  const short = shorten(tagline, 118);

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-r from-brand/[0.09] via-gray-50 to-gray-50">
      {/* Името на категорията, гигантско и почти невидимо — както
          bactology стои зад заглавието на bulgarbiotic. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[clamp(4rem,13vw,9rem)] font-extrabold leading-none tracking-tighter text-dark/[0.06]"
      >
        {title.toLocaleLowerCase('bg-BG')}
      </span>

      {/* Мека светла завеса над лявата третина. Гигантското име минава и
          под подзаглавието, а сиво върху сиво се чете зле — завесата
          вдига текста, без да скрие ефекта отдясно. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-white/85 via-white/55 to-transparent"
      />

      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] object-cover opacity-[0.55] [mask-image:linear-gradient(to_right,transparent,black_72%)] md:block"
        />
      ) : null}

      <div className="relative flex flex-wrap items-center justify-between gap-5 px-5 py-6 md:px-8 md:py-8">
        <div className="min-w-0">
          {parentTitle ? (
            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-brand-dark shadow-[0_1px_4px_rgba(0,0,0,0.06)] backdrop-blur">
              {icon ? <CategoryIcon name={icon} className="size-3.5" /> : null}
              {parentTitle}
            </span>
          ) : null}

          <h1 className="text-[1.7rem] font-bold leading-tight tracking-tight text-dark md:text-[2.15rem]">
            {title}
          </h1>

          {short ? (
            <p className="mt-1.5 max-w-lg text-[0.86rem] leading-relaxed text-gray-500">
              {short}
            </p>
          ) : null}
        </div>

        {count != null ? (
          <div className="flex min-w-[6.5rem] shrink-0 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.25)]">
            <span className="text-[2rem] font-bold leading-none tracking-tight text-dark tabular-nums">
              {new Intl.NumberFormat('bg-BG').format(count)}
            </span>
            <span className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-gray-400">
              {count === 1 ? 'продукт' : 'продукта'}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Първото изречение, отрязано по дума, за да не се разлива под заглавието. */
function shorten(text: string | null | undefined, max: number): string | null {
  const raw = (text ?? '').trim();
  if (!raw) return null;
  const firstSentence = raw.split(/(?<=[.!?])\s/)[0] ?? raw;
  if (firstSentence.length <= max) return firstSentence;
  const cut = firstSentence.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max)}…`;
}
