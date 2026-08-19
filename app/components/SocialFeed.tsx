import {HeartIcon, ChatBubbleOvalLeftIcon} from '@heroicons/react/24/solid';
import {SOCIAL_POSTS, SOCIAL_PROFILE} from '~/lib/social';

/**
 * Емисия от социалните мрежи по модела на gabymoda.com: профилна шапка с
 * брояч и бутон „Следвай“, под нея лента от 12 квадратни плочки от край
 * до край.
 *
 * ИЗБОРЪТ НА МРЕЖА е по данни, не по усещане: Facebook страницата на
 * maxxmart има около 3 751 харесвания, Instagram профилът — 774. Пет
 * пъти по-голяма аудитория, затова шапката е на Facebook.
 *
 * ⚠ Съдържанието е ДЕМО и не се дърпа на живо — виж lib/social.ts.
 */
function FacebookMark({className = 'size-5'}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function SocialFeed({className = ''}: {className?: string}) {
  if (!SOCIAL_POSTS.length) return null;

  const fmt = (n: number) => new Intl.NumberFormat('bg-BG').format(n);

  return (
    <section
      aria-label="Последвай ни"
      className={`relative overflow-hidden border-t border-hairline bg-ink text-white ${className}`}
    >
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-50" />

      {/* профилна шапка */}
      <div className="relative flex flex-wrap items-center gap-4 px-5 py-7 xl:px-8">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark ring-2 ring-brand/30">
          <img
            src="https://www.maxxmart.eu/cdn/img/logo/4/4.svg?v=1777460209"
            alt=""
            aria-hidden="true"
            className="size-9 rounded-none brightness-0 invert"
          />
        </span>

        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[1.05rem] font-bold text-white">
              maxxmart.
            </span>
            <FacebookMark className="size-4 text-[#1877F2]" />
          </span>
          <span className="mt-0.5 block text-[0.82rem] text-gray-400">
            {fmt(SOCIAL_PROFILE.followers)} харесвания ·{' '}
            {SOCIAL_POSTS.length} публикации
          </span>
        </span>

        <a
          href={SOCIAL_PROFILE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex h-10 items-center gap-2 rounded-lg bg-[#1877F2] px-5 text-[0.88rem] font-bold text-white transition-all hover:bg-[#0f63d6] hover:shadow-[0_8px_20px_-8px_rgba(24,119,242,0.9)] hover:no-underline"
        >
          <FacebookMark className="size-4" />
          Последвай
        </a>
      </div>

      {/* Плочките се движат непрекъснато.
          Пистата е дублирана, за да няма шев; копието е aria-hidden, за
          да не се чете два пъти. Спира при задържане, за да може човек
          да прочете текста, и не се движи при prefers-reduced-motion.

          Плочките са с ФИКСИРАНА ширина, а не процентна — при процентна
          дублираната писта не се получава точно 200% и шевът се вижда. */}
      <div className="group/marquee relative overflow-hidden">
        <div className="marquee marquee-social flex w-max">
          {[false, true].map((isClone) => (
            <div
              key={isClone ? 'clone' : 'main'}
              className="flex shrink-0"
              aria-hidden={isClone || undefined}
            >
              {SOCIAL_POSTS.map((post) => (
                <a
                  key={`${isClone ? 'c' : 'm'}-${post.id}`}
                  href={SOCIAL_PROFILE.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isClone ? -1 : undefined}
                  className="group relative block size-[180px] shrink-0 overflow-hidden hover:no-underline sm:size-[220px] lg:size-[250px]"
                >
                  <img
                    src={post.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="size-full rounded-none object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink via-ink/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="line-clamp-3 text-[0.72rem] leading-snug text-gray-200">
                      {post.caption}
                    </span>
                    <span className="mt-2 flex items-center gap-3 text-[0.72rem] font-semibold text-white">
                      <span className="flex items-center gap-1">
                        <HeartIcon className="size-3.5 text-brand-bright" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChatBubbleOvalLeftIcon className="size-3.5 text-brand-bright" />
                        {post.comments}
                      </span>
                    </span>
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* меко избледняване в двата края */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent" />
      </div>
    </section>
  );
}
