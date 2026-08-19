import {useLoaderData, data, Link} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getContext} from '~/lib/context';
import {getSeoMeta} from '@cloudcart/nitrogen';
import {Image} from '@cloudcart/nitrogen-react';
import {ProductCard} from '~/components/ProductCard';
import {ProductFilters} from '~/components/ProductFilters';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Pagination, PageNav} from '~/components/Pagination';
import {CategoryCopy} from '~/components/CategoryCopy';
import {getCategoryCopy} from '~/lib/category-copy';
import {buildFiltersFromParams, buildSortFromParams} from '~/lib/filters';
import {getPageNumber, pageVariables, verifyPage} from '~/lib/pagination';

/** Продукти на страница. */
const PAGE_SIZE = 32;

export const meta: Route.MetaFunction = ({data: d}) => {
  const col = d?.collection as any;
  return getSeoMeta({
    title: col?.seo?.title || (col ? `${col.title} | maxxmart` : 'Категория | maxxmart'),
    description: col?.seo?.description || col?.description,
  });
};

export async function loader({params, context, request}: Route.LoaderArgs) {
  const ctx = await getContext(context, request);
  const url = new URL(request.url);
  const page = getPageNumber(url.searchParams);
  const filters = buildFiltersFromParams(url.searchParams);
  const {sortKey, reverse} = buildSortFromParams(url.searchParams);

  const query = (vars: {first: number; after?: string}) =>
    ctx.storefront.getCollectionProductsPaginated(params.handle, {
      ...vars,
      sortKey,
      reverse,
      filters,
    });

  let result = await query(pageVariables(page, PAGE_SIZE));
  if (!result) throw data('Collection not found', {status: 404});

  let nodes = result.products.nodes;

  // Резервен вариант: ако курсорният формат се е сменил и сме получили
  // друга страница, теглим наведнъж до търсената и режем. Бавно е, но
  // винаги вярно — и се вижда в логовете, вместо да лъже мълчаливо.
  if (!verifyPage(page, PAGE_SIZE, result.products.pageInfo?.startCursor)) {
    console.warn(
      `[collections] Курсорът не съвпада за страница ${page}; минавам на overfetch. ` +
        `Проверете формата на Storefront курсорите.`,
    );
    const wide = await query({first: PAGE_SIZE * page});
    if (wide) {
      result = wide;
      nodes = wide.products.nodes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
  }

  return {
    collection: result.collection,
    products: {...result.products, nodes},
    page,
  };
}

export default function CollectionPage() {
  const {collection, products, page: currentPage} = useLoaderData<typeof loader>();
  const col = collection as any;
  const totalCount = (products as any).totalCount as number | null | undefined;

  const breadcrumbItems = (col.breadcrumb ?? [])
    .filter((b: any) => b.handle !== col.handle)
    .map((b: any) => ({title: b.title, to: `/collections/${b.handle}`}));
  breadcrumbItems.push({title: col.title});

  const children = col.children?.nodes ?? [];
  const showChildren = col.displayChildren && children.length > 0;

  const copy = getCategoryCopy(
    col.handle,
    col.title,
    totalCount,
    children.map((c: any) => c.title),
  );

  // Диапазонът се показва само когато има повече от една страница —
  // „Показани 1–12 от 12“ е шум.
  const first = (currentPage - 1) * PAGE_SIZE + 1;
  const last = first + (products.nodes?.length ?? 0) - 1;

  return (
    <div className="w-full">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Описанието от магазина се показва в дъното, не тук — виж
          CategoryCopy. Иначе същият текст щеше да излезе два пъти. */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{collection.title}</h1>
      </div>

      {/* Подкатегории */}
      {showChildren && (
        <div className="scrollbar-none mb-8 flex gap-3 overflow-x-auto pb-2">
          {children.map((child: any) => (
            <Link
              key={child.id}
              to={`/collections/${child.handle}`}
              className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-1.5 pr-3 text-xs font-medium text-dark transition-[border-color,background] duration-150 hover:border-gray-400 hover:bg-gray-100 hover:no-underline"
              prefetch="intent"
            >
              {child.image?.url ? (
                <Image data={child.image} alt={child.title} className="size-7 rounded object-cover" />
              ) : (
                <img src="/noimage.svg" alt={child.title} className="size-7 rounded object-cover" />
              )}
              <span className="whitespace-nowrap">{child.title}</span>
              {child.productsCount != null && (
                <span className="text-[0.7rem] text-gray-400">{child.productsCount}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-[220px_1fr] md:gap-10">
        <aside className="order-2 md:order-1">
          <ProductFilters filters={(products as any).filters} totalCount={totalCount} />
        </aside>

        <div className="order-1 md:order-2">
          <Pagination connection={products}>
            {({nodes}) => (
              <div>
                {totalCount != null && totalCount > PAGE_SIZE && (
                  <p className="mb-4 text-[0.8rem] text-gray-500">
                    Показани {first}–{last} от{' '}
                    {new Intl.NumberFormat('bg-BG').format(totalCount)} продукта
                  </p>
                )}

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                  {nodes.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {nodes.length === 0 && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-14 text-center">
                    <p className="mb-1 font-semibold text-dark">Няма продукти по този избор</p>
                    <p className="text-[0.85rem] text-gray-500">
                      Разхлабете някой от филтрите вляво или изчистете всички.
                    </p>
                  </div>
                )}

                <PageNav
                  currentPage={currentPage}
                  totalCount={totalCount}
                  pageSize={PAGE_SIZE}
                  className="my-8"
                />
              </div>
            )}
          </Pagination>
        </div>
      </div>

      {/* Описателен текст — под продуктите, не над тях */}
      <CategoryCopy copy={copy} title={col.title} storeDescription={col.description} />
    </div>
  );
}
