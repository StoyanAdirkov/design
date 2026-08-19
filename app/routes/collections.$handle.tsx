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
import {getCollectionListing} from '~/lib/product-listing';
import {
  getProject,
  projectCategories,
  projectsForCollection,
  PROJECT_CATEGORY_CAP,
} from '~/lib/projects';
import {ProjectChips} from '~/components/ProjectChips';

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

  // Собствена заявка вместо getCollectionProductsPaginated — вградената
  // не връща тегло и колекции, без които няма как да се сметне €/кг.
  // Виж lib/product-listing.ts.
  const query = (vars: {first: number; after?: string}) =>
    getCollectionListing(ctx.storefront, params.handle, {
      ...vars,
      sortKey,
      reverse,
      filters,
    });

  // ── Филтър по проект ────────────────────────────────────────────────
  // Storefront API-то не може „категория A ИЛИ категория B“ (проверено:
  // filters.category се игнорира и връща целия каталог). Затова проектът
  // се сглобява от няколко паралелни заявки и се слива тук.
  const project = getProject(url.searchParams.get('project'));
  const projectCats = project ? projectCategories(project, params.handle) : [];

  if (project && projectCats.length) {
    const [meta, ...parts] = await Promise.all([
      // Само за заглавието, троха, подкатегории — оттам не взимаме продукти
      getCollectionListing(ctx.storefront, params.handle, {first: 1, filters}),
      ...projectCats.map((h) =>
        getCollectionListing(ctx.storefront, h, {
          first: PROJECT_CATEGORY_CAP,
          sortKey,
          reverse,
          filters,
        }),
      ),
    ]);

    if (!meta) throw data('Collection not found', {status: 404});

    const seen = new Set<string>();
    const merged: any[] = [];
    let capped = false;
    for (const part of parts) {
      if (!part) continue;
      const pn = part.products?.nodes ?? [];
      if (pn.length >= PROJECT_CATEGORY_CAP) capped = true;
      for (const n of pn) {
        if (seen.has(n.id)) continue;
        seen.add(n.id);
        merged.push(n);
      }
    }

    if (capped) {
      console.warn(
        `[projects] Проект „${project.label}“ опря в тавана от ` +
          `${PROJECT_CATEGORY_CAP} продукта на категория — броят е занижен.`,
      );
    }

    // Подредбата идва от API-то в рамките на всяка категория, но при
    // сливането трябва отново. Цена и име ги сортираме тук; при другите
    // подредби оставяме реда по категории — той поне е смислен.
    const amount = (n: any) => Number(n?.priceRange?.minVariantPrice?.amount ?? 0);
    const sortParam = url.searchParams.get('sort');
    if (sortParam === 'price-asc') merged.sort((a, b) => amount(a) - amount(b));
    else if (sortParam === 'price-desc') merged.sort((a, b) => amount(b) - amount(a));
    else if (sortParam === 'title-asc')
      merged.sort((a, b) => String(a.title).localeCompare(String(b.title), 'bg'));
    else if (sortParam === 'title-desc')
      merged.sort((a, b) => String(b.title).localeCompare(String(a.title), 'bg'));

    // Фасетите се обединяват от участващите категории.
    //
    // ⚠ Сборът може да надчита: продукт, който е и в „Лепила за плочки и
    // фуги“, и в „Санитарни силикони“, се брои два пъти. За марките —
    // най-използвания филтър — това се поправя точно по-долу, като
    // броевете се преброяват наново от вече обединения списък. За
    // останалите фасети остава сборът; те са дребните характеристики,
    // които и без това седят сгънати.
    const facets = new Map<string, any>();
    for (const part of parts) {
      for (const f of part?.products?.filters ?? []) {
        const existing = facets.get(f.id);
        if (!existing) {
          facets.set(f.id, {...f, values: (f.values ?? []).map((v: any) => ({...v}))});
          continue;
        }
        for (const v of f.values ?? []) {
          const hit = existing.values.find((x: any) => x.id === v.id);
          if (hit) hit.count += v.count ?? 0;
          else existing.values.push({...v});
        }
      }
    }

    const vendorFacet = facets.get('filter.v.vendor');
    if (vendorFacet) {
      const perVendor = new Map<string, number>();
      for (const n of merged) {
        const name = (n?.vendor ?? '').trim();
        if (name) perVendor.set(name, (perVendor.get(name) ?? 0) + 1);
      }
      vendorFacet.values = vendorFacet.values
        .map((v: any) => ({...v, count: perVendor.get(String(v.label).trim()) ?? 0}))
        .filter((v: any) => v.count > 0)
        .sort((a: any, b: any) => b.count - a.count);
    }

    const start = (page - 1) * PAGE_SIZE;
    return {
      collection: meta.collection,
      products: {
        nodes: merged.slice(start, start + PAGE_SIZE),
        totalCount: merged.length,
        filters: Array.from(facets.values()),
        pageInfo: {
          hasNextPage: start + PAGE_SIZE < merged.length,
          hasPreviousPage: page > 1,
          startCursor: null,
          endCursor: null,
        },
      },
      page,
      projectKey: project.key,
      projectIntro: project.intro,
    };
  }

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
    projectKey: null as string | null,
    projectIntro: null as string | null,
  };
}

export default function CollectionPage() {
  const {collection, products, page: currentPage, projectKey, projectIntro} =
    useLoaderData<typeof loader>();
  const col = collection as any;
  const projects = projectsForCollection(col.handle);
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

      {/* Пазарувай по проект — виж lib/projects.ts */}
      {projects.length > 0 && (
        <ProjectChips
          projects={projects}
          active={projectKey}
          intro={projectIntro}
          className="mb-8"
        />
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
                  {nodes.map((product: any) => (
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
