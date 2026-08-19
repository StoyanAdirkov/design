import type {StorefrontClient, ProductFilter} from '@cloudcart/nitrogen';

/**
 * Списъчна заявка с тегло — за да излиза €/кг и в каталога.
 *
 * ЗАЩО СЕ НАЛАГА СОБСТВЕНА ЗАЯВКА
 * `getCollectionProductsPaginated` от Nitrogen връща само осем полета:
 * id, handle, title, availableForSale, featuredImage, priceRange, labels,
 * reviewSummary. Без варианти, без тегло, без колекции — тоест няма от
 * какво да се сметне цена за килограм.
 *
 * Точно в списъка сравнението има най-голям смисъл: човек гледа четири
 * лепила една до друга и „9,83 €“ не му казва нищо, докато не види, че
 * едното е чувал от 5 кг, а другото от 25.
 *
 * Затова тук стои същата заявка, но с добавени:
 *   variants(first: 2)  → тегло, статус, цена на варианта
 *   collections(first: 5) → за allowlist-а в lib/unit-price.ts
 *   options → за да знае картата дали продуктът иска избор
 *
 * `variants(first: 2)`, а не 1: getUnitPrice смята само при точно един
 * вариант. С лимит 1 всеки продукт щеше да изглежда като едновариантен и
 * щяхме да делим цената на грешно тегло. Втората стойност е сигналът
 * „има избор“.
 *
 * Цена: две допълнителни подселекции на 32 продукта. Измерено на живо —
 * заявката поскъпва с около 60–90 ms, което е приемливо за информацията,
 * която дава.
 */

const LISTING_FIELDS = `
  id handle title availableForSale
  featuredImage { id url altText width height }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  labels { name color textColor position }
  reviewSummary { averageRating roundedRating totalCount }
  isNew
  vendor
  options { name values }
  variants(first: 2) {
    nodes {
      id title availableForSale statusName
      weight weightUnit
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
  collections(first: 5) { nodes { id handle } }
`;

const FILTER_FIELDS = `
  filters {
    id label type presentation position
    values { id label count position input swatchColor swatchImage }
    minValue { value currencyCode }
    maxValue { value currencyCode }
    rangeStep decimals
  }
  totalCount
`;

const PAGE_INFO_FIELDS = `
  pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
`;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProductsWithWeight(
    $handle: String!,
    $first: Int, $after: String,
    $sortKey: ProductSortKeys, $reverse: Boolean, $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id title handle description descriptionHtml
      image { id url altText width height }
      color icon productsCount
      seo { title description }
      breadcrumb { id title handle }
      children(first: 50) {
        nodes { id title handle image { id url altText width height } productsCount }
      }
      displayChildren
      products(
        first: $first, after: $after,
        sortKey: $sortKey, reverse: $reverse, filters: $filters
      ) {
        nodes { ${LISTING_FIELDS} }
        ${FILTER_FIELDS}
        ${PAGE_INFO_FIELDS}
      }
    }
  }
`;

const SEARCH_PRODUCTS_QUERY = `#graphql
  query SearchProductsWithWeight(
    $query: String!,
    $first: Int, $after: String,
    $sortKey: ProductSortKeys, $reverse: Boolean, $filters: [ProductFilter!]
  ) {
    search(
      query: $query, first: $first, after: $after,
      sortKey: $sortKey, reverse: $reverse, filters: $filters
    ) {
      nodes { ${LISTING_FIELDS} }
      ${FILTER_FIELDS}
      ${PAGE_INFO_FIELDS}
    }
  }
`;

export interface ListingVariables {
  first?: number;
  after?: string;
  sortKey?: string;
  reverse?: boolean;
  filters?: ProductFilter[];
}

export interface ListingResult {
  collection: any;
  products: any;
}

export async function getCollectionListing(
  storefront: StorefrontClient,
  handle: string,
  vars: ListingVariables,
): Promise<ListingResult | null> {
  const res = await storefront.query<{collection: any}>(COLLECTION_PRODUCTS_QUERY, {
    variables: {handle, ...vars},
  });
  const collection = res?.collection;
  if (!collection) return null;
  return {collection, products: collection.products};
}

export async function searchListing(
  storefront: StorefrontClient,
  query: string,
  vars: ListingVariables,
): Promise<any | null> {
  const res = await storefront.query<{search: any}>(SEARCH_PRODUCTS_QUERY, {
    variables: {query, ...vars},
  });
  return res?.search ?? null;
}
