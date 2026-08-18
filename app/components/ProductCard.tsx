import {Link} from 'react-router';
import type {Product} from '@cloudcart/nitrogen';
import {Image, Money} from '@cloudcart/nitrogen-react';
import {StarRating} from './StarRating';
import {WishlistButton} from './WishlistButton';

/**
 * Продуктова карта.
 *
 * Стартовата версия беше плаващ блок без рамка: заглавията са с различна
 * дължина, затова цените не се подравняваха, а етикетите бяха сиви и се
 * губеха. Тук картата е с рамка и фиксирана вътрешна структура —
 * снимка, заглавие, после цената, притисната надолу с mt-auto, така че
 * при всички карти в реда цената стои на един и същи ред.
 *
 * Снимките са object-contain, а не object-cover: продуктовите снимки са
 * на бял фон и рязането им отхапва дръжки и накрайници.
 */
export function ProductCard({
  product,
  loading,
  badge,
}: {
  product: Product;
  loading?: 'eager' | 'lazy';
  /** Допълнителен етикет, зададен от секцията (напр. „Препоръчан“) */
  badge?: string;
}) {
  const p = product as any;
  const labels: Array<{name: string; color?: string; textColor?: string}> = p.labels ?? [];
  const reviewSummary = p.reviewSummary;
  const soldOut = product.availableForSale === false;

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-inherit transition-all duration-200 hover:-translate-y-1 hover:border-brand/45 hover:shadow-[0_14px_32px_-16px_rgba(60,180,74,0.55)] hover:no-underline"
      prefetch="intent"
    >
      <div className="relative bg-white p-3">
        {/* 4/3, а не квадрат: при 4 карти на цял екран картата е ~460px
            широка и квадратната снимка правеше секцията 600px висока */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
          {product.featuredImage?.url ? (
            <Image
              data={product.featuredImage}
              alt={product.title}
              loading={loading}
              className="size-full rounded-none object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <img
              src="/noimage.svg"
              alt={product.title}
              loading={loading}
              className="size-full rounded-none object-contain p-6 opacity-60"
            />
          )}
        </div>

        {/* етикети — горе вляво, в бранд зелено вместо сивото по подразбиране */}
        {(badge || labels.length > 0) && (
          <div className="absolute left-5 top-5 flex flex-wrap gap-1.5">
            {badge ? (
              <span className="rounded-md bg-brand px-2.5 py-1 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-white shadow-[0_2px_10px_rgba(60,180,74,0.5)]">
                {badge}
              </span>
            ) : null}
            {/* при секционен етикет пускаме само още един магазинен,
                иначе горният ъгъл се задръства */}
            {(badge ? labels.slice(0, 1) : labels).map((label) => (
              <span
                key={label.name}
                className="rounded-md bg-ink px-2.5 py-1 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-white"
                style={
                  label.color
                    ? {backgroundColor: label.color, color: label.textColor || '#fff'}
                    : undefined
                }
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {soldOut && (
          <span className="absolute right-5 top-5 rounded-md bg-gray-700 px-2.5 py-1 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-white">
            Изчерпан
          </span>
        )}

        <div className="absolute bottom-5 right-5 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <WishlistButton productId={product.id} size="md" />
        </div>
      </div>

      {/* текстовата част — flex-1 и mt-auto подравняват цените между картите */}
      <div className="flex flex-1 flex-col px-4 pb-4">
        <h4 className="line-clamp-2 min-h-[2.6em] text-[0.82rem] font-medium leading-snug text-gray-800 transition-colors group-hover:text-dark">
          {product.title}
        </h4>

        {reviewSummary && reviewSummary.totalCount > 0 ? (
          <div className="mt-1.5">
            <StarRating
              rating={reviewSummary.averageRating}
              count={reviewSummary.totalCount}
              size="sm"
            />
          </div>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-[1.05rem] font-bold tracking-tight text-dark">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          <span className="translate-y-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-brand opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            Виж →
          </span>
        </div>
      </div>
    </Link>
  );
}
