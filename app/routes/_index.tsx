import {useLoaderData, Link, Await} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/_index';
import {getContext} from '~/lib/context';
import {getSeoMeta} from '@cloudcart/nitrogen';
import type {Collection, Product} from '@cloudcart/nitrogen';
import {Image} from '@cloudcart/nitrogen-react';
import {ProductCard} from '~/components/ProductCard';
import {HeroSlider, type HeroSlide} from '~/components/HeroSlider';
import {UspBar} from '~/components/UspBar';

export const meta: Route.MetaFunction = () =>
  getSeoMeta({
    title: 'maxxmart | Всичко за строителството и дома',
    description:
      'Строителни материали, инструменти, ВиК, отопление, осветление и обзавеждане — над 6900 продукта на едно място.',
  });

/**
 * Банерите на клиента от www.maxxmart.eu.
 * Живеят на CloudCart CDN-а на магазина (store 13688), затова се
 * подават директно — HeroSlider ги изравнява до една пропорция.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: 'https://cdncloudcart.com/13688/files/image/maxxmart_kotsyfunky.jpg',
    alt: 'maxxmart Клубна карта — вземи си отстъпките',
    url: '/pages/promocards',
  },
  {
    src: 'https://cdncloudcart.com/13688/files/image/website-banner-nexe-autumn-2026.png',
    alt: 'NEXE есен 2026',
  },
];

export async function loader({context, request}: Route.LoaderArgs) {
  const ctx = await getContext(context, request);
  const collections = await ctx.storefront.getCollections(1);
  const featuredCollection = collections[0] ?? null;

  const recommendedProducts = ctx.storefront
    .getProducts(4)
    .catch((error: Error) => {
      console.error(error);
      return [];
    });

  return {featuredCollection, recommendedProducts};
}

export default function Homepage() {
  const {featuredCollection, recommendedProducts} = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Банерът опира ръбовете на екрана — както е и на живия сайт.
          Отрицателните полета трият страничните отстъпи на <main>. */}
      <HeroSlider slides={HERO_SLIDES} className="-mx-4 -mt-6 sm:-mx-5 md:-mt-8 xl:-mx-8" />
      <UspBar className="-mx-4 sm:-mx-5 xl:-mx-8" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-5">Препоръчани продукти</h2>
        <Suspense fallback={<div className="text-gray-500">Зареждане…</div>}>
          <Await resolve={recommendedProducts}>
            {(products) => (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} loading={i < 2 ? 'eager' : 'lazy'} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </section>
    </div>
  );
}

function FeaturedCollection({collection}: {collection: Collection | null}) {
  if (!collection) return null;

  return (
    <Link to={`/collections/${collection.handle}`} className="relative block rounded-xl overflow-hidden mb-12 hover:no-underline" prefetch="intent">
      {collection.image?.url ? (
        <Image data={collection.image} alt={collection.title} loading="eager" className="w-full aspect-[16/7] object-cover rounded-xl" />
      ) : (
        <div className="aspect-[16/7] bg-gradient-to-br from-brand to-pink-500 rounded-xl" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 rounded-xl">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight">{collection.title}</h1>
      </div>
    </Link>
  );
}
