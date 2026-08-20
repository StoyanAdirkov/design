import {useState, useEffect} from 'react';
import {useLoaderData, data, Link, useSearchParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getContext} from '~/lib/context';
import {getSeoMeta} from '@cloudcart/nitrogen';
import {ProductCard} from '~/components/ProductCard';
import {ProductFilters} from '~/components/ProductFilters';
import {SubcategoryFilter} from '~/components/SubcategoryFilter';
import {SubcategoryChips} from '~/components/SubcategoryChips';
import {FilterIcon} from '~/components/FilterIcon';
import {useHeaderOffset} from '~/lib/use-header-offset';
import {Breadcrumbs} from '~/components/Breadcrumbs';
import {Pagination, PageNav} from '~/components/Pagination';
import {CategoryCopy} from '~/components/CategoryCopy';
import {getCategoryCopy, getRootArt} from '~/lib/category-copy';
import {CategoryHero} from '~/components/CategoryHero';
import {buildFiltersFromParams, buildSortFromParams} from '~/lib/filters';
import {getPageNumber, pageVariables, verifyPage} from '~/lib/pagination';
import {getCollectionListing} from '~/lib/product-listing';
import {
  getProject,
  projectCategories,
  PROJECT_CATEGORY_CAP,
} from '~/lib/projects';

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
  // projectKey/projectIntro идват от лоудъра, но вече не се рисуват:
  // чиповете „Пазарувай по проект" са премахнати по искане. Логиката за
  // `?project=` остава жива, за да не се пише наново, ако потрябва.
  const {collection, products, page: currentPage} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const col = collection as any;

  // Височината на залепения хедър → CSS променлива, за да знае
  // колоната откъде да започне да се лепи. Виж lib/use-header-offset.ts
  useHeaderOffset();

  // Показани ли са филтрите.
  //
  // ДВЕ ОТДЕЛНИ СЪСТОЯНИЯ, а не едно, и причината не е стилистична.
  // Преди беше едно, с подразбиране „отворено", а на телефон се
  // затваряше в useEffect. Резултатът: сървърът връщаше HTML с разгъната
  // колона и до стартирането на React филтрите стояха върху продуктите.
  // На бавен телефон това е цяла секунда с грешен екран.
  //
  // Сега началните стойности са верни още в HTML-а: на телефон
  // затворено, на desktop отворено. Превключвателят вдига и двете —
  // `md:` класовете решават кое важи на текущата ширина.
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('maxxmart:filters');
      if (saved !== null) setShowFilters(saved === '1');
    } catch {
      // блокирано хранилище — оставаме на подразбирането
    }
  }, []);

  const toggleFilters = () => {
    setMobileOpen((v) => !v);
    setShowFilters((v) => {
      try {
        localStorage.setItem('maxxmart:filters', v ? '0' : '1');
      } catch {
        // няма как да го запомним, но превключването пак работи
      }
      return !v;
    });
  };

  // Броят активни филтри стои на бутона, за да личи и когато колоната е
  // скрита. Чете се от URL-а, не от window — иначе на сървъра би било
  // друго число и хидратацията щеше да се скара.
  // Изброяваме по списък с known ключове, а не „всичко освен sort/page":
  // при второто всеки utm_source или ?fresh=1 се брои за филтър и
  // бутонът показва зелено кръгче с единица без причина.
  const FILTER_PARAMS = [
    'available',
    'minPrice',
    'maxPrice',
    'vendor',
    'tag',
    'onSale',
    'isNew',
    'isFeatured',
    'category',
    'filter',
  ];
  const activeFilterCount = Array.from(searchParams.entries()).filter(
    ([k]) =>
      FILTER_PARAMS.includes(k) ||
      k.startsWith('option_') ||
      k.startsWith('prop_') ||
      k.startsWith('brand_'),
  ).length;
  const totalCount = (products as any).totalCount as number | null | undefined;

  const breadcrumbItems = (col.breadcrumb ?? [])
    .filter((b: any) => b.handle !== col.handle)
    .map((b: any) => ({title: b.title, to: `/collections/${b.handle}`}));
  breadcrumbItems.push({title: col.title});

  const children = col.children?.nodes ?? [];

  // Първата троха е главната категория — оттам идва снимката, когато
  // подразделът няма своя.
  const rootHandle = (col.breadcrumb ?? [])[0]?.handle ?? col.handle;

  const rootTitle = (col.breadcrumb ?? [])[0]?.title ?? null;
  const art = getRootArt(rootHandle);

  const copy = getCategoryCopy(
    col.handle,
    col.title,
    totalCount,
    children.map((c: any) => c.title),
    rootHandle,
  );

  // Диапазонът се показва само когато има повече от една страница —
  // „Показани 1–12 от 12“ е шум.
  const first = (currentPage - 1) * PAGE_SIZE + 1;
  const last = first + (products.nodes?.length ?? 0) - 1;

  return (
    <div className="w-full">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Заглавна лента. Пълното описание стои в дъното (CategoryCopy) —
          тук влиза само първото изречение, за да не се повтаря. */}
      <CategoryHero
        title={col.title}
        parentTitle={rootHandle !== col.handle ? rootTitle : null}
        tagline={copy?.paragraphs?.[0] ?? col.description}
        image={art?.hero}
        icon={art?.icon}
        count={totalCount}
      />

      <SubcategoryChips items={children} className="mb-7" />

      {/* Лента с превключвателя. Стои над решетката, за да е на едно
          и също място и когато колоната е скрита. */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleFilters}
          aria-expanded={mobileOpen || showFilters}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[0.82rem] font-semibold text-dark transition-colors duration-150 hover:border-brand hover:text-brand-dark"
        >
          <FilterIcon name="more" className="size-4 text-brand" />
          {/* Надписът следва състоянието, което важи на текущата ширина.
              При едно общо той казваше „Скрий филтрите" на телефон, докато
              филтрите бяха скрити. */}
          <span className="md:hidden">
            {mobileOpen ? 'Скрий филтрите' : 'Филтри'}
          </span>
          <span className="hidden md:inline">
            {showFilters ? 'Скрий филтрите' : 'Филтри'}
          </span>
          {activeFilterCount > 0 ? (
            <span className="ml-0.5 inline-flex size-[1.15rem] items-center justify-center rounded-full bg-brand text-[0.66rem] font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      {/* Решетката е с колона само когато филтрите се виждат на този
          екран — на телефон те са над продуктите, не отстрани. */}
      <div
        className={`grid gap-8 ${
          showFilters ? 'md:grid-cols-[240px_minmax(0,1fr)] md:gap-10' : ''
        }`}
      >
        {/* Колоната е в HTML-а винаги; видимостта е класове, не условие.
            Така сървърът връща верния екран още преди React да тръгне. */}
        <aside
          className={`${mobileOpen ? 'block' : 'hidden'} ${
            showFilters ? 'md:block' : 'md:hidden'
          } order-2 mb-2 md:order-1 md:mb-0 md:sticky md:self-start md:overflow-y-auto md:overscroll-contain md:pr-1 md:[scrollbar-width:thin]`}
          style={{
            top: 'calc(var(--mm-header, 160px) + 0.75rem)',
            maxHeight: 'calc(100dvh - var(--mm-header, 160px) - 1.5rem)',
          }}
        >
          <ProductFilters filters={(products as any).filters} totalCount={totalCount}>
            <SubcategoryFilter
              items={children}
              parent={
                rootHandle !== col.handle && rootTitle
                  ? {title: rootTitle, handle: rootHandle}
                  : null
              }
              currentHandle={col.handle}
            />
          </ProductFilters>
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

                {/* Скритите филтри освобождават 240px — на широк екран
                    това стига за пета карта, вместо да разтягаме четири. */}
                <div
                  className={`grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 ${
                    showFilters ? '' : '2xl:grid-cols-5'
                  }`}
                >
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
