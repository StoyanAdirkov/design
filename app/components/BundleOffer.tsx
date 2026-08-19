import {useFetcher} from 'react-router';
import {useEffect} from 'react';
import {Link} from 'react-router';
import type {Product} from '@cloudcart/nitrogen';
import {Image} from '@cloudcart/nitrogen-react';
import {PlusIcon, TagIcon, CheckIcon} from '@heroicons/react/24/outline';
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
      className="promo-shine relative overflow-hidden rounded-2xl bg-ink text-white ring-1 ring-hairline"
    >
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
      {/* дишащо зелено сияние зад цената, за да тежи дясната страна */}
      <div className="promo-breathe pointer-events-none absolute -right-24 top-1/2 size-[460px] -translate-y-1/2 rounded-full bg-brand/25 blur-3xl" />

      <div className="relative p-5 md:p-6 lg:p-7">
        {/* Заглавният ред е на цялата ширина, а не в лявата колона.
            Преди беше вътре в нея и оставяше празно поле в средата. */}
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="promo-badge flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[0.75rem] font-bold uppercase tracking-wider text-white">
            <TagIcon className="size-4" strokeWidth={2.4} />
            −{BUNDLE_DISCOUNT_PERCENT}% на комплекта
          </span>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {BUNDLE_TITLE}
          </h2>
          <p className="w-full text-[0.88rem] text-gray-400">{BUNDLE_SUBTITLE}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch lg:gap-6">
          {/* Продуктите се разпъват на цялата лява колона (flex-1 на всяка
              карта), затова между тях и цената вече не зее празно. */}
          {/* Плюсчетата стоят АБСОЛЮТНО в разстоянието, а не в потока.
              Докато бяха вътре в li-то, те ядяха от ширината му и втората
              и третата карта излизаха с 21px по-тесни от първата —
              снимките им се смаляваха и редът не беше подравнен. */}
          <ul className="flex flex-col items-stretch gap-7 sm:flex-row">
            {picks.map(({product, variant}, i) => (
              <li key={product.id} className="relative flex flex-1 items-stretch">
                {i > 0 ? (
                  <PlusIcon
                    className="absolute -top-[1.65rem] left-1/2 size-5 -translate-x-1/2 text-brand-bright sm:left-[-1.6rem] sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                ) : null}
                <Link
                  to={`/products/${product.handle}`}
                  prefetch="intent"
                  className="group flex h-full w-full flex-col rounded-xl border border-hairline bg-ink-2/80 p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/60 hover:bg-ink-2 hover:shadow-[0_14px_30px_-16px_rgba(60,180,74,0.7)] hover:no-underline"
                >
                  <span className="mb-2.5 block overflow-hidden rounded-lg bg-white">
                    {product.featuredImage?.url ? (
                      <Image
                        data={product.featuredImage}
                        alt={product.title}
                        className="aspect-[3/2] w-full rounded-none object-contain p-2.5 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="block aspect-[3/2] w-full" />
                    )}
                  </span>
                  <span className="line-clamp-2 min-h-[2.5em] text-[0.82rem] leading-snug text-gray-200">
                    {product.title}
                  </span>
                  {/* редът се рисува винаги, за да са картите с еднаква
                      височина — валякът няма разновидност, боята и
                      стълбата имат */}
                  <span className="mt-1.5 block min-h-[1.15em] text-[0.74rem] text-brand-bright">
                    {variant?.title ?? ''}
                  </span>
                  <span className="mt-auto pt-1.5 text-[0.98rem] font-bold text-white">
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

          {/* Цената е flex колона с mt-auto на бутона, за да е висока
              колкото продуктите и бутонът да ляга на дъното. */}
          <div className="flex flex-col rounded-xl border border-brand/25 bg-ink-2/70 p-5 backdrop-blur-sm">
            <span className="block text-[0.75rem] uppercase tracking-wider text-gray-500">
              Поотделно
            </span>
            <span className="block text-[1.2rem] font-medium text-gray-500 line-through">
              {money(total)}
            </span>

            <span className="mt-3.5 block text-[0.75rem] uppercase tracking-wider text-brand-bright">
              Заедно
            </span>
            <span className="block text-[2.3rem] font-extrabold leading-none tracking-tight text-white">
              {money(discounted)}
            </span>
            <span className="mt-3 inline-flex w-fit items-center rounded-md bg-brand/15 px-2.5 py-1 text-[0.85rem] font-bold text-brand-bright ring-1 ring-brand/30">
              Спестяваш {money(saved)}
            </span>

            {/* Между отстъпката и бутона зееха 125 празни пиксела: колоната
                се разпъва по височината на продуктите отляво, а съдържанието
                ѝ свършва по средата. Мълчаливото свиване на картата щеше да
                счупи подравняването с продуктите, затова празното се пълни с
                трите неща, които купувачът и без това проверява преди да
                натисне бутона. */}
            <ul className="mt-4 flex list-none flex-col gap-2 border-t border-hairline p-0 pt-4">
              {[
                `${picks.length} артикула с едно кликане`,
                'Доставка до 2 работни дни',
                'Или безплатно от 26-те обекта',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2 text-[0.8rem] text-gray-400">
                  <CheckIcon
                    className="size-3.5 shrink-0 text-brand-bright"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>

            {canAddAll ? (
              <fetcher.Form method="post" action="/cart" className="mt-auto pt-4">
                <input type="hidden" name="action" value="ADD_BUNDLE" />
                {variantIds.map((id) => (
                  <input key={id} type="hidden" name="merchandiseId" value={id} />
                ))}
                <input
                  type="hidden"
                  name="discountCode"
                  value={BUNDLE_DISCOUNT_CODE}
                />
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-brand text-[0.95rem] font-bold text-white transition-all hover:bg-brand-dark hover:shadow-[0_10px_26px_-8px_rgba(60,180,74,1)] disabled:opacity-60"
                >
                  {isAdding ? 'Добавя се…' : 'Купи комплекта'}
                </button>
              </fetcher.Form>
            ) : (
              <p className="mt-4 text-[0.8rem] leading-snug text-gray-500">
                Един от артикулите в комплекта в момента не е наличен в
                избрания вариант. Отвори продукта, за да видиш какво има.
              </p>
            )}

            <p className="mt-2.5 text-center text-[0.72rem] text-gray-600">
              {/* линкът е whitespace-nowrap, за да не се къса на „още“
                  и „оферти“ — пренася се цял на нов ред */}
              Отстъпката се прилага в количката{' '}
              <Link
                to="/promo"
                prefetch="intent"
                className="whitespace-nowrap font-semibold text-brand-bright hover:no-underline"
              >
                · още оферти →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
