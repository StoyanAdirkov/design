import {useState} from 'react';
import {CheckIcon} from '@heroicons/react/20/solid';
import type {CategoryCopy as Copy} from '~/lib/category-copy';

/**
 * Описателен блок под продуктовия списък.
 *
 * Стои в дъното, не в началото: текст над каталога избутва продуктите под
 * прегъвката и пречи на човека, който е дошъл да купува. Под тях е за
 * търсачките и за читателя, който наистина е стигнал дотам.
 *
 * Дългите текстове се сгъват на ~2 абзаца. Сгъването е с реален бутон и
 * `aria-expanded`, а не с `max-height` + градиент върху вечно наличен
 * текст — второто заблуждава екранните четци, че всичко се вижда.
 */
export function CategoryCopy({
  copy,
  title,
  storeDescription,
}: {
  copy: Copy | null;
  title: string;
  /** Описанието от админа. Ако има такова, то печели пред локалния текст. */
  storeDescription?: string | null;
}) {
  const [expanded, setExpanded] = useState(false);

  // Магазинът винаги е с предимство. Ако утре някой напише текст в админа,
  // локалният просто спира да се показва — без второ място за поддръжка.
  if (storeDescription && storeDescription.trim().length > 40) {
    return (
      <section className="mt-14 rounded-xl border border-gray-200 bg-gray-50/60 p-6 md:p-8">
        <h2 className="mb-3 text-lg font-bold tracking-tight text-dark md:text-xl">
          {title}
        </h2>
        <div
          className="prose-sm max-w-3xl text-[0.9rem] leading-relaxed text-gray-600 [&_a]:text-brand-dark [&_p]:mb-3"
          dangerouslySetInnerHTML={{__html: storeDescription}}
        />
      </section>
    );
  }

  if (!copy) return null;

  const {heading, paragraphs, bullets} = copy;
  const visible = expanded ? paragraphs : paragraphs.slice(0, 2);
  const hasMore = paragraphs.length > 2;

  return (
    <section className="mt-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60">
      {/* Тънка зелена ивица горе — същият акцент като на картите при hover */}
      <div className="h-1 w-full bg-gradient-to-r from-brand via-brand to-brand/20" />

      <div className="p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold tracking-tight text-dark md:text-xl">
          {heading ?? title}
        </h2>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
          <div className="max-w-3xl">
            {visible.map((p, i) => (
              <p key={i} className="mb-3 text-[0.9rem] leading-relaxed text-gray-600 last:mb-0">
                {p}
              </p>
            ))}

            {hasMore && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                className="mt-3 cursor-pointer border-none bg-transparent p-0 font-sans text-[0.82rem] font-semibold text-brand-dark underline transition-colors hover:text-brand"
              >
                {expanded ? 'Скрий' : 'Прочети повече'}
              </button>
            )}
          </div>

          {bullets && bullets.length > 0 && (
            <ul className="flex shrink-0 list-none flex-col gap-2.5 p-0 md:max-w-xs">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[0.85rem] leading-snug text-gray-700">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <CheckIcon className="size-3 text-brand-dark" strokeWidth={3} />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
