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
import {VendorSlider} from '~/components/VendorSlider';
import {ProductCarousel} from '~/components/ProductCarousel';
import {SUMMER_PICKS} from '~/lib/summer';
import {CategoryCarousel} from '~/components/CategoryCarousel';
import {SEASONAL_CATEGORIES} from '~/lib/seasonal-categories';
import {BundleOffer} from '~/components/BundleOffer';
import {QualityBand} from '~/components/QualityBand';
import {BUNDLE_ITEMS} from '~/lib/bundle';
import {SALE_PICKS, SALE_PERCENT, SALE_ENABLED, SALE_TITLE, SALE_SUBTITLE} from '~/lib/sale';
import {ClubCard} from '~/components/ClubCard';
import {ReviewsCarousel} from '~/components/ReviewsCarousel';
import {BlogGrid} from '~/components/BlogGrid';
import {SocialFeed} from '~/components/SocialFeed';
import {SOCIAL_DEMO} from '~/lib/social';
import {REVIEWS_ENABLED} from '~/lib/reviews';

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
  {
    // Трети банер, сглобен от нас: рамка 1920x640, същото съотношение 3:1
    // като другите два, за да не подскача височината при смяна на слайда.
    // Продуктът, цената и курсът са реални.
    src: '/hero/kosachka-oferta.jpg',
    alt: 'Сезонна оферта: косачка RAIDER RD-LM18 за 76,59 €',
    url: '/products/kosachka-raider-rd-lm18',
  },
];

export async function loader({context, request}: Route.LoaderArgs) {
  const ctx = await getContext(context, request);
  const collections = await ctx.storefront.getCollections(1);
  const featuredCollection = collections[0] ?? null;

  // Сезонните препоръки се дърпат по handle, за да са цените и
  // наличността винаги живи, вместо да се замразяват в кода.
  // Заявките вървят паралелно и всяка се проваля поотделно — един
  // изтрит артикул не бива да сваля цялата начална страница.
  const summerProducts = Promise.all(
    SUMMER_PICKS.map((handle) =>
      ctx.storefront.getProduct(handle).catch((error: Error) => {
        console.error(`Сезонни препоръки: ${handle} не се зареди`, error);
        return null;
      }),
    ),
  ).then((items) => items.filter(Boolean));

  const bundleProducts = Promise.all(
    BUNDLE_ITEMS.map(({handle}) =>
      ctx.storefront.getProduct(handle).catch((error: Error) => {
        console.error(`Комплект: ${handle} не се зареди`, error);
        return null;
      }),
    ),
  ).then((items) => items.filter(Boolean));

  // Статии от блоговете на магазина. Тегли се и от двата — „Новини“ и
  // „Промоции“ — защото поотделно не винаги имат по 6 пресни.
  const articles = Promise.all([
    ctx.storefront.getArticles('novini', 6).catch(() => []),
    ctx.storefront.getArticles('promocii', 6).catch(() => []),
  ])
    .then(([novini, promocii]) => {
      const tagged = [
        ...(novini as any[]).map((a) => ({...a, blogHandle: 'novini', blogTitle: 'Новини'})),
        ...(promocii as any[]).map((a) => ({...a, blogHandle: 'promocii', blogTitle: 'Промоции'})),
      ];
      // редуваме двата източника, за да не излязат 6 промоции подред
      const out: any[] = [];
      const a = tagged.filter((x) => x.blogHandle === 'novini');
      const b = tagged.filter((x) => x.blogHandle === 'promocii');
      for (let i = 0; i < 5; i++) {
        if (a[i]) out.push(a[i]);
        if (b[i]) out.push(b[i]);
      }
      // ПЕТ, не шест: водещата карта заема 2×2 в решетка от 4 колони,
      // тоест 4 клетки. Още 4 обикновени я допълват точно до 2 реда.
      // При шест статии шестата увисва сама на трети ред.
      return out.slice(0, 5);
    })
    .catch((error: Error) => {
      console.error('Статиите не се заредиха', error);
      return [];
    });

  const saleProducts = SALE_ENABLED
    ? Promise.all(
        SALE_PICKS.map((handle) =>
          ctx.storefront.getProduct(handle).catch((error: Error) => {
            console.error(`Разпродажба: ${handle} не се зареди`, error);
            return null;
          }),
        ),
      ).then((items) =>
        // Разпродажба с неналични артикули е по-лоша от липсваща.
        // Филтрираме тук, а не в списъка, защото наличността се мени:
        // разпродаден артикул изчезва сам, вместо да стои под −20% с
        // надпис „Запитване“.
        items.filter((p: any) => p && p.availableForSale !== false),
      )
    : Promise.resolve([]);

  return {
    featuredCollection,
    summerProducts,
    bundleProducts,
    saleProducts,
    articles,
  };
}

export default function Homepage() {
  const {
    featuredCollection,
    summerProducts,
    bundleProducts,
    saleProducts,
    articles,
  } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Банерът опира ръбовете на екрана — както е и на живия сайт.
          Отрицателните полета трият страничните отстъпи на <main>. */}
      <HeroSlider slides={HERO_SLIDES} className="-mx-4 -mt-6 sm:-mx-5 md:-mt-8 xl:-mx-8" />
      <UspBar className="-mx-4 sm:-mx-5 xl:-mx-8" />
      <VendorSlider className="-mx-4 sm:-mx-5 xl:-mx-8" />

      <div className="mt-10">
        <Suspense fallback={<CarouselSkeleton />}>
          <Await resolve={summerProducts}>
            {(products) => (
              <ProductCarousel
                title="Сезонни препоръки"
                subtitle="Каквото ти трябва за двора и градината това лято"
                products={products as any}
                badge="Препоръчан"
                viewAllUrl="/collections/gradina"
                viewAllLabel="Виж всичко за градината"
              />
            )}
          </Await>
        </Suspense>
      </div>

      <div className="mt-12">
        <CategoryCarousel
          title="Сезонни категории"
          subtitle="Всичко за двора и градината, подредено по задача"
          categories={SEASONAL_CATEGORIES}
        />
      </div>

      <div className="mt-12">
        <Suspense fallback={<div className="h-[420px] animate-pulse rounded-2xl bg-gray-100 lg:h-[340px]" />}>
          <Await resolve={bundleProducts}>
            {(products) => <BundleOffer products={products as any} />}
          </Await>
        </Suspense>
      </div>

      {/* Качество, разнообразие, наличност, дълготрайност — с видео.
          Всички числа са измерени, виж QualityBand.tsx */}
      <QualityBand className="mt-12" />

      {SALE_ENABLED ? (
        <div className="mt-12">
          <Suspense fallback={<CarouselSkeleton />}>
            <Await resolve={saleProducts}>
              {(products) =>
                (products as any[]).length ? (
                  <ProductCarousel
                    title={SALE_TITLE}
                    subtitle={SALE_SUBTITLE}
                    products={products as any}
                    salePercent={SALE_PERCENT}
                    viewAllUrl="/promo"
                    viewAllLabel="Виж всички оферти"
                  />
                ) : null
              }
            </Await>
          </Suspense>
        </div>
      ) : null}

      <ClubCard className="mt-12 -mx-4 sm:-mx-5 xl:-mx-8" />

      {REVIEWS_ENABLED ? (
        <ReviewsCarousel className="-mx-4 sm:-mx-5 xl:-mx-8" />
      ) : null}

      <Suspense fallback={<div className="mt-0 h-[520px] animate-pulse bg-ink-2" />}>
        <Await resolve={articles}>
          {(items) => (
            <BlogGrid
              articles={items as any}
              className="-mx-4 sm:-mx-5 xl:-mx-8"
            />
          )}
        </Await>
      </Suspense>

      {SOCIAL_DEMO ? <SocialFeed className="-mx-4 sm:-mx-5 xl:-mx-8" /> : null}

    </div>
  );
}

/** Държи височината, докато сезонните препоръки се зареждат. */
function CarouselSkeleton() {
  return (
    <div>
      <div className="mb-4 h-8 w-56 animate-pulse rounded bg-gray-100" />
      <div className="flex gap-4">
        {Array.from({length: 4}).map((_, i) => (
          <div
            key={i}
            className="h-[340px] flex-1 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
          />
        ))}
      </div>
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
