import {Suspense} from 'react';
import {useLoaderData, data, Link, Await} from 'react-router';
import type {Route} from './+types/products.$handle';
import {getContext} from '~/lib/context';
import {getSeoMeta, generateProductJsonLd} from '@cloudcart/nitrogen';
import {Image, RichText, useOptimisticVariant} from '@cloudcart/nitrogen-react';
import {PriceDual} from '~/components/PriceDual';
import {ProductTabs} from '~/components/ProductTabs';
import {ProductCarousel} from '~/components/ProductCarousel';
import {ProductUsage} from '~/components/ProductUsage';
import {parseUsage} from '~/lib/usage';
import {findCategoryPath} from '~/lib/navigation';
import {ArrowDownTrayIcon} from '@heroicons/react/24/outline';
import {ProductForm} from '~/components/ProductForm';
import {ProductImageGallery} from '~/components/ProductImageGallery';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {StarRating} from '~/components/StarRating';
import {WishlistButton} from '~/components/WishlistButton';
import {ReviewList} from '~/components/ReviewList';

export const meta: Route.MetaFunction = ({data: d}) => {
  const product = d?.product;
  if (!product) return getSeoMeta({title: 'Product | Nitrogen'});

  const url = `/products/${product.handle}`;
  return [
    ...getSeoMeta({
      title: product.seo?.title || `${product.title} | Nitrogen`,
      description: product.seo?.description || product.description,
      type: 'product',
      ...(product.featuredImage
        ? {image: {url: product.featuredImage.url, width: product.featuredImage.width, height: product.featuredImage.height}}
        : {}),
    }),
    {'script:ld+json': generateProductJsonLd(product, url)},
  ];
};

export async function loader({params, context, request}: Route.LoaderArgs) {
  const ctx = await getContext(context, request);
  const product = await ctx.storefront.getProduct(params.handle);
  if (!product) throw data('Product not found', {status: 404});

  // „Сходни продукти“ = останалите от същата категория.
  // Свързаните продукти (linkedProducts) се задават на ръка в админа и
  // затова често липсват; сходните се получават сами и работят за всеки
  // продукт, който изобщо има категория.
  const primary = (product as any).collections?.nodes?.[0];
  const similar = primary
    ? ctx.storefront
        .getCollectionProductsPaginated(primary.handle, {first: 14})
        .then((res: any) =>
          (res?.products?.nodes ?? [])
            .filter((p: any) => p.handle !== product.handle)
            .slice(0, 12),
        )
        .catch((error: Error) => {
          console.error('Сходни продукти не се заредиха', error);
          return [];
        })
    : Promise.resolve([]);

  return {
    similar,
    product,
    linkedProducts: (product as any).linkedProducts?.nodes ?? [],
    collections: (product as any).collections?.nodes ?? [],
  };
}

export default function ProductPage() {
  const {product, linkedProducts, collections, similar} = useLoaderData<typeof loader>();
  const firstVariant = product.variants.nodes[0];
  const {selectedVariant} = useOptimisticVariant(product, firstVariant);
  const variant = selectedVariant ?? firstVariant;

  // Центриран контейнер. <main> е от край до край заради началната
  // страница, затова тук ограничението трябва изрично да се центрира —
  // иначе съдържанието се лепи вляво и вдясно зее празно.
  return (
    <div className="mx-auto max-w-[1280px]">
      <ProductBreadcrumbs product={product} collections={collections} />

      <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
        <ProductMedia product={product} variant={variant} />
        <ProductDetails product={product} variant={variant} />
      </div>

      {/* „Как се използва“ стои преди описанието: практичното преди
          маркетинговото. Идеята е от bulgarbiotic.bg. */}
      <ProductUsage facts={parseUsage(product.descriptionHtml)} />

      {/* Табовете са под галерията и заемат цялата ширина, както при
          CloudCart — там „ОПИСАНИЕ“ започва под снимката, а не в
          дясната колона до цената. */}
      <ProductTabs
        descriptionHtml={product.descriptionHtml}
        properties={(product as any).properties ?? []}
        files={(product as any).files?.nodes ?? []}
        product={product}
        variant={variant}
      />

      {/* Reviews */}
      {(
        <ReviewList
          reviews={(product as any).reviews?.nodes ?? []}
          summary={(product as any).reviewSummary}
          totalCount={(product as any).reviews?.totalCount ?? (product as any).reviewSummary?.totalCount ?? 0}
        />
      )}

      {linkedProducts.length > 0 && (
        <LinkedProducts products={linkedProducts} />
      )}

      {/* Сходни продукти — от същата категория. Карусел, а не решетка,
          защото са до 12 и не бива да избутват страницата надолу. */}
      <Suspense fallback={<div className="mt-16 h-72 animate-pulse rounded-xl bg-gray-100" />}>
        <Await resolve={similar}>
          {(items) =>
            (items as any[]).length ? (
              <section className="mt-16 border-t border-gray-200 pt-8">
                <ProductCarousel
                  title="Сходни продукти"
                  subtitle={collections?.[0]?.title}
                  products={items as any}
                />
              </section>
            ) : null
          }
        </Await>
      </Suspense>
    </div>
  );
}

/* --- Product Media (Left Column) --- */

function ProductMedia({product, variant}: {product: any; variant: any}) {
  const isOnSale = variant?.compareAtPrice &&
    parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);
  const labels: Array<{name: string; color?: string; textColor?: string}> = product.labels ?? [];

  return (
    <div className="relative">
      <div className="relative md:sticky md:top-[calc(4rem+1.5rem)]">
        <div className="absolute top-3 right-3 z-[2]">
          <WishlistButton productId={product.id} size="lg" />
        </div>
        <div className="absolute top-3 left-3 z-[2] flex flex-wrap gap-1.5">
          {product.isNew && <span className="py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-brand text-white">Ново</span>}
          {product.isFeatured && <span className="py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-amber-500 text-white">Препоръчан</span>}
          {isOnSale && <span className="py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-red-600 text-white">Промо</span>}
          {product.availableForSale === false && <span className="py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-gray-600 text-white">{product.statusName || 'Няма наличност'}</span>}
          {labels
            .filter((l) => !['New', 'Featured', 'FEATURED'].includes(l.name))
            .map((label) => (
              <span
                key={label.name}
                className="py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-gray-600 text-white"
                style={label.color ? {backgroundColor: label.color, color: label.textColor || '#fff'} : undefined}
              >
                {label.name}
              </span>
            ))}
        </div>
        <ProductImageGallery
          images={product.images?.nodes ?? []}
          featuredImage={product.featuredImage}
        />
      </div>
    </div>
  );
}

/* --- Product Details (Right Column) --- */

function ProductDetails({product, variant}: {product: any; variant: any}) {
  const properties: Array<{name: string; values: string[]}> = product.properties ?? [];
  const files: Array<{id: string; name: string; filename: string; url: string; fileSize: number}> =
    product.files?.nodes ?? [];

  return (
    <div className="self-start">
      <h1 className="text-[1.75rem] md:text-[2rem] font-bold tracking-tight leading-tight">{product.title}</h1>

      {/* Мета блокът на CloudCart: Категория на свой ред, отдолу
          Производител и SKU един до друг, разделени с тънка линия. */}
      <dl className="mt-4 space-y-1.5 border-t border-gray-200 pt-4 text-[0.85rem]">
        {product.collections?.nodes?.[0] ? (
          <div className="flex flex-wrap gap-1.5">
            <dt className="text-gray-500">Категория:</dt>
            <dd>
              <Link
                to={`/collections/${product.collections.nodes[0].handle}`}
                className="font-medium text-dark hover:text-brand hover:no-underline"
              >
                {product.collections.nodes[0].title}
              </Link>
            </dd>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-x-8 gap-y-1.5">
        {product.vendor ? (
          <div className="flex gap-1.5">
            <dt className="text-gray-500">Производител:</dt>
            <dd>
              <Link
                to={`/products?vendor=${encodeURIComponent(product.vendor)}`}
                className="font-medium text-dark hover:text-brand hover:no-underline"
              >
                {product.vendor}
              </Link>
            </dd>
          </div>
        ) : null}
        {variant?.sku ? (
          <div className="flex gap-1.5">
            <dt className="text-gray-500">SKU:</dt>
            <dd className="font-medium text-dark">{variant.sku}</dd>
          </div>
        ) : null}
        </div>
      </dl>

      {/* „Всичко от [марка]“ — Praktiker го има точно така */}
      {product.vendor ? (
        <Link
          to={`/products?vendor=${encodeURIComponent(product.vendor)}`}
          prefetch="intent"
          className="mt-3 inline-block text-[0.82rem] font-semibold text-brand-dark hover:no-underline hover:brightness-110"
        >
          Всичко от {product.vendor} →
        </Link>
      ) : null}

      {/* Рейтинг с линк към отзивите — bulgarbiotic.bg слага „(75) Виж
          отзивите →“ точно под заглавието и това е добър навик: цифрата
          е доверие, а линкът спестява скролване. */}
      {product.reviewSummary && product.reviewSummary.totalCount > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <StarRating
            rating={product.reviewSummary.averageRating}
            count={product.reviewSummary.totalCount}
            size="md"
          />
          <a
            href="#otzivi"
            className="text-[0.82rem] font-semibold text-brand-dark hover:no-underline hover:brightness-110"
          >
            Виж отзивите →
          </a>
        </div>
      ) : (
        <a
          href="#otzivi"
          className="mt-2 inline-block text-[0.8rem] text-gray-500 hover:text-brand-dark hover:no-underline"
        >
          Още няма отзиви — напиши първия →
        </a>
      )}

      {/* Product Form: Price + Variants + Add to Cart */}
      <ProductForm product={product} selectedVariant={variant} />

      {/* Tags */}
      {product.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-6">
          {product.tags.map((tag: string) => (
            <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`} className="py-1 px-2.5 bg-gray-100 rounded-full text-xs text-gray-600 transition-all duration-150 hover:bg-gray-200 hover:text-dark hover:no-underline">
              {tag}
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}

/* --- Related Products --- */

function LinkedProducts({products}: {products: any[]}) {
  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold tracking-tight mb-5">Често купувани заедно</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p: any) => (
          <Link key={p.id} to={`/products/${p.handle}`} className="block text-inherit transition-transform duration-150 hover:no-underline hover:-translate-y-0.5" prefetch="intent">
            <div className="relative overflow-hidden rounded-[10px]">
              {p.featuredImage?.url ? <Image data={p.featuredImage} alt={p.title} className="aspect-square object-cover w-full rounded-[10px] bg-gray-100" /> : <img src="/noimage.svg" alt={p.title} className="aspect-square object-cover w-full rounded-[10px] bg-gray-100" />}
              {p.availableForSale === false && (
                <span className="absolute top-2 right-2 py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-gray-600 text-white">{p.statusName || 'Няма наличност'}</span>
              )}
              {p.labels?.length > 0 && (
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {p.labels.map((label: any) => (
                    <span
                      key={label.name}
                      className="py-1 px-2.5 rounded text-[0.65rem] font-bold uppercase tracking-wider leading-none bg-gray-600 text-white"
                      style={label.color ? {backgroundColor: label.color, color: label.textColor || '#fff'} : undefined}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h4 className="text-sm font-semibold mt-3 leading-tight">{p.title}</h4>
            <span className="mt-1 block"><PriceDual data={p.priceRange.minVariantPrice} size="sm" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* --- Breadcrumbs --- */

function ProductBreadcrumbs({product, collections}: {product: any; collections: any[]}) {
  const items: Array<{title: string; to?: string}> = [];

  // Живият им сайт показва целия път:
  // Начало / Строителство / Сухи строителни смеси / Лепило-шпакловъчни… / продукт
  // Storefront API-то дава само най-долната категория, затова родителите
  // идват от дървото в lib/navigation.ts.
  const leaf = collections?.[0];
  const path = leaf ? findCategoryPath(leaf.handle) : [];

  if (path.length) {
    for (const node of path) items.push({title: node.title, to: node.url});
  } else if (leaf) {
    items.push({title: leaf.title, to: `/collections/${leaf.handle}`});
  }

  items.push({title: product.title});
  return <Breadcrumbs items={items} />;
}

/* --- Helpers --- */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DownloadIcon() {
  return <ArrowDownTrayIcon className="size-4 shrink-0 text-gray-400" />;
}
