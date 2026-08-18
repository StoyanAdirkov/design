import {useFetcher} from 'react-router';
import {useEffect} from 'react';
import {Link} from 'react-router';
import type {Product} from '@cloudcart/nitrogen';
import {Image} from '@cloudcart/nitrogen-react';
import {PlusIcon, TagIcon} from '@heroicons/react/24/outline';
import {useAside} from './Aside';
import {
  BUNDLE_ITEMS,
  BUNDLE_DISCOUNT_PERCENT,
  BUNDLE_DISCOUNT_CODE,
  BUNDLE_TITLE,
  BUNDLE_SUBTITLE,
} from '~/lib/bundle';

/**
 * Комплект от три артикула с обща отстъпка.
 *
 * Сумата се смята от ЖИВИТЕ цени на продуктите, а не от числа в кода —
 * ако утре боята поскъпне, офертата се обновява сама.
 *
 * Валутата се взима от самите продукти, вместо да се пише „€“ на ръка:
 * магазинът е в EUR днес, но това е настройка, не константа.
 */
export function BundleOffer({products}: {products: Product[]}) {
  const fetcher = useFetcher();
  const {open} = useAside();
  const isAdding = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) open('cart');
  }, [fetcher.state, fetcher.data, open]);

  if (products.length < 2) return null;

  // Всеки артикул сочи конкретен вариант. Цената се взима от НЕГО, а не
  // от priceRange.minVariantPrice — иначе боята щеше да се води 15 € (за
  // 5 кг), а в количката да влиза 12-килограмовата за 34,59 €.
  const picks = products.map((product) => {
    const nodes: any[] = product.variants?.nodes ?? [];
    const wanted = BUNDLE_ITEMS.find((b) => b.handle === product.handle)?.variantTitle;
    const variant =
      (wanted ? nodes.find((v) => v.title?.trim() === wanted.trim()) : null) ??
      (nodes.length === 1 ? nodes[0] : null);
    return {product, variant};
  });

  const currency =
    picks[0]?.variant?.price?.currencyCode ??
    (products[0] as any)?.priceRange?.minVariantPrice?.currencyCode ??
    'EUR';

  const total = picks.reduce(
    (sum, {product, variant}) =>
      sum +
      Number(
        variant?.price?.amount ?? product.priceRange?.minVariantPrice?.amount ?? 0,
      ),
    0,
  );
  const discounted = total * (1 - BUNDLE_DISCOUNT_PERCENT / 100);
  const saved = total - discounted;

  const money = (n: number) =>
    new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(n);

  const variantIds = picks
    .map(({variant}) => (variant?.availableForSale !== false ? variant?.id : null))
    .filter(Boolean) as string[];

  const canAddAll = variantIds.length === picks.length;

  return (
    <section
      aria-label={BUNDLE_TITLE}
      className="relative overflow-hidden rounded-2xl bg-ink text-white ring-1 ring-hairline"
    >
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
      {/* зелено сияние зад цената, за да тежи дясната страна */}
      <div className="pointer-events-none absolute -right-24 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-brand/20 blur-3xl" />

      <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-[0_2px_14px_rgba(60,180,74,0.6)]">
              <TagIcon className="size-3.5" strokeWidth={2.4} />
              −{BUNDLE_DISCOUNT_PERCENT}% на комплекта
            </span>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              {BUNDLE_TITLE}
            </h2>
          </div>
          <p className="mb-6 max-w-xl text-[0.86rem] text-gray-400">
            {BUNDLE_SUBTITLE}
          </p>

          {/* трите продукта с „+“ между тях */}
          <ul className="flex flex-wrap items-stretch gap-3">
            {picks.map(({product, variant}, i) => (
              <li key={product.id} className="flex items-center gap-3">
                {i > 0 ? (
                  <PlusIcon
                    className="size-4 shrink-0 text-brand-bright"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                ) : null}
                <Link
                  to={`/products/${product.handle}`}
                  prefetch="intent"
                  className="group flex w-[150px] flex-col rounded-xl border border-hairline bg-ink-2/80 p-3 transition-colors hover:border-brand/50 hover:no-underline sm:w-[168px]"
                >
                  <span className="mb-2 block overflow-hidden rounded-lg bg-white">
                    {product.featuredImage?.url ? (
                      <Image
                        data={product.featuredImage}
                        alt={product.title}
                        className="aspect-square w-full rounded-none object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="block aspect-square w-full" />
                    )}
                  </span>
                  <span className="line-clamp-2 text-[0.72rem] leading-snug text-gray-300">
                    {product.title}
                  </span>
                  {variant?.title ? (
                    <span className="mt-1 block text-[0.68rem] text-brand-bright">
                      {variant.title}
                    </span>
                  ) : null}
                  <span className="mt-1 text-[0.78rem] font-semibold text-white">
                    {money(
                      Number(
                        variant?.price?.amount ??
                          product.priceRange.minVariantPrice.amount,
                      ),
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* цената */}
        <div className="w-full rounded-xl border border-hairline bg-ink-2/70 p-6 backdrop-blur-sm lg:w-[300px]">
          <span className="block text-[0.72rem] uppercase tracking-wider text-gray-500">
            Поотделно
          </span>
          <span className="block text-[1.05rem] font-medium text-gray-500 line-through">
            {money(total)}
          </span>

          <span className="mt-4 block text-[0.72rem] uppercase tracking-wider text-brand-bright">
            Заедно
          </span>
          <span className="block text-[2.1rem] font-extrabold leading-none tracking-tight text-white">
            {money(discounted)}
          </span>
          <span className="mt-2 block text-[0.8rem] font-semibold text-brand-bright">
            Спестяваш {money(saved)}
          </span>

          {canAddAll ? (
            <fetcher.Form method="post" action="/cart" className="mt-5">
              <input type="hidden" name="action" value="ADD_BUNDLE" />
              {variantIds.map((id) => (
                <input key={id} type="hidden" name="merchandiseId" value={id} />
              ))}
              <input type="hidden" name="discountCode" value={BUNDLE_DISCOUNT_CODE} />
              <button
                type="submit"
                disabled={isAdding}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-brand text-[0.88rem] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-[0_8px_22px_-8px_rgba(60,180,74,0.9)] disabled:opacity-60"
              >
                {isAdding ? 'Добавя се…' : 'Купи комплекта'}
              </button>
            </fetcher.Form>
          ) : (
            <p className="mt-5 text-[0.76rem] leading-snug text-gray-500">
              Един от артикулите в комплекта в момента не е наличен в
              избрания вариант. Отвори продукта, за да видиш какво има.
            </p>
          )}

          <p className="mt-3 text-center text-[0.68rem] text-gray-600">
            Отстъпката се прилага в количката
          </p>
        </div>
      </div>
    </section>
  );
}
