import {useLoaderData, Await} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/promo';
import {getContext} from '~/lib/context';
import {getSeoMeta} from '@cloudcart/nitrogen';
import {BundleOffer} from '~/components/BundleOffer';
import {ProductCard} from '~/components/ProductCard';
import {BUNDLE_ITEMS} from '~/lib/bundle';
import {SALE_PICKS, SALE_PERCENT, SALE_TITLE} from '~/lib/sale';

/**
 * Страница „Оферти“ — целта на линка „Виж още пакетни предложения“.
 *
 * Направена е, защото линк към несъществуваща страница е по-лош от липсващ
 * линк. Днес показва един комплект и сезонната разпродажба; когато се
 * появят още комплекти, тук е мястото им.
 */
export const meta: Route.MetaFunction = () =>
  getSeoMeta({
    title: 'Оферти и комплекти | maxxmart',
    description: 'Пакетни предложения и сезонни намаления в maxxmart.',
  });

export async function loader({context, request}: Route.LoaderArgs) {
  const ctx = await getContext(context, request);

  const fetchAll = (handles: string[]) =>
    Promise.all(
      handles.map((handle) =>
        ctx.storefront.getProduct(handle).catch(() => null),
      ),
    ).then((items) => items.filter(Boolean));

  const fetchAvailable = (handles: string[]) =>
    fetchAll(handles).then((items) =>
      items.filter((p: any) => p.availableForSale !== false),
    );

  return {
    bundleProducts: fetchAll(BUNDLE_ITEMS.map((b) => b.handle)),
    saleProducts: fetchAvailable(SALE_PICKS),
  };
}

export default function PromoPage() {
  const {bundleProducts, saleProducts} = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-dark md:text-3xl">
        Оферти и комплекти
      </h1>
      <p className="mb-8 text-[0.9rem] text-gray-500">
        Пакетни предложения и сезонни намаления на едно място.
      </p>

      <Suspense fallback={<div className="h-[420px] animate-pulse rounded-2xl bg-gray-100" />}>
        <Await resolve={bundleProducts}>
          {(products) => <BundleOffer products={products as any} />}
        </Await>
      </Suspense>

      <section className="mt-12">
        <h2 className="mb-5 text-xl font-bold tracking-tight text-dark md:text-2xl">
          {SALE_TITLE}
        </h2>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-gray-100" />}>
          <Await resolve={saleProducts}>
            {(products) => (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {(products as any[]).map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    salePercent={SALE_PERCENT}
                    loading={i < 5 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </section>
    </div>
  );
}
