import {StarIcon} from '@heroicons/react/24/solid';
import {REVIEWS, REVIEWS_TITLE, REVIEWS_SUBTITLE, REVIEWS_TOTAL} from '~/lib/reviews';
import type {Review} from '~/lib/reviews';

/**
 * Лента с отзиви — непрекъснат marquee, по 5 карти на екран при широк
 * монитор.
 *
 * Ползва същия механизъм като лентата с марките: пистата е дублирана, за
 * да няма шев, копието е aria-hidden, за да не се чете два пъти, и
 * движението спира при задържане и при prefers-reduced-motion.
 *
 * Звездите са от реалната оценка на отзива, не декоративни пет броя.
 */
function Stars({rating}: {rating: number}) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} от 5 звезди`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          className={`size-4 ${i <= rating ? 'text-amber-400' : 'text-gray-300'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewCard({review, ariaHidden}: {review: Review; ariaHidden: boolean}) {
  return (
    <li
      className="w-[280px] shrink-0 sm:w-[320px]"
      aria-hidden={ariaHidden || undefined}
    >
      <figure className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_14px_30px_-16px_rgba(60,180,74,0.55)]">
        <Stars rating={review.rating} />

        <blockquote className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-gray-700">
          „{review.text}“
        </blockquote>

        <figcaption className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[0.8rem] font-bold text-brand-dark ring-1 ring-brand/20">
            {review.author.replace(/[^\p{L}]/gu, '').slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block text-[0.82rem] font-semibold text-dark">
              {review.author}
            </span>
            <span className="block text-[0.72rem] text-gray-500">
              {review.store} · {review.source}
            </span>
          </span>
        </figcaption>
      </figure>
    </li>
  );
}

export function ReviewsCarousel({className = ''}: {className?: string}) {
  if (!REVIEWS.length) return null;

  const track = (ariaHidden: boolean) => (
    <ul className="flex shrink-0 items-stretch gap-4 pr-4" aria-hidden={ariaHidden || undefined}>
      {REVIEWS.map((review) => (
        <ReviewCard
          key={`${review.author}-${review.text.slice(0, 12)}`}
          review={review}
          ariaHidden={ariaHidden}
        />
      ))}
    </ul>
  );

  return (
    <section
      aria-label={REVIEWS_TITLE}
      className={`relative overflow-hidden border-y border-gray-200 bg-mist ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

      <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 pt-7 xl:px-8">
        <h2 className="text-xl font-bold tracking-tight text-dark md:text-2xl">
          {REVIEWS_TITLE}
        </h2>
        <p className="text-[0.82rem] text-gray-500">
          {REVIEWS_SUBTITLE} · над {REVIEWS_TOTAL} отзива
        </p>
      </div>

      <div className="group/marquee relative py-6">
        <div className="marquee marquee-slow flex w-max">
          {track(false)}
          {track(true)}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-mist to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-mist to-transparent" />
      </div>
    </section>
  );
}
