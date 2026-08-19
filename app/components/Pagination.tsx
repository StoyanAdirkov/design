import {Link, useSearchParams, useNavigation} from 'react-router';
import {useMemo} from 'react';
import type {ReactNode, FC} from 'react';

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface Connection<T> {
  nodes: T[];
  pageInfo: PageInfo;
}

export interface PaginationRenderProps<T> {
  nodes: T[];
  NextLink: FC<{children: ReactNode; className?: string}>;
  PreviousLink: FC<{children: ReactNode; className?: string}>;
  isLoading: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Page-number based pagination component.
 *
 * Uses `?page=N` URL format instead of cursor-based `?cursor=...&direction=after`.
 * The server uses `getPaginationVariables` which converts page numbers to the
 * appropriate first/after variables for the API.
 */
export function Pagination<T>({
  connection,
  children,
}: {
  connection: Connection<T>;
  children: (args: PaginationRenderProps<T>) => ReactNode;
}) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const {nodes, pageInfo} = connection;

  const currentPage = parseInt(searchParams.get('page') ?? '1', 10) || 1;

  const nextUrl = useMemo(() => {
    if (!pageInfo.hasNextPage) return null;
    const params = new URLSearchParams(searchParams);
    params.delete('cursor');
    params.delete('direction');
    params.set('page', String(currentPage + 1));
    return `?${params.toString()}`;
  }, [pageInfo.hasNextPage, searchParams, currentPage]);

  const prevUrl = useMemo(() => {
    if (currentPage <= 1) return null;
    const params = new URLSearchParams(searchParams);
    params.delete('cursor');
    params.delete('direction');
    if (currentPage - 1 <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(currentPage - 1));
    }
    return `?${params.toString()}`;
  }, [searchParams, currentPage]);

  const NextLink: FC<{children: ReactNode; className?: string}> = ({children: label, className}) => {
    if (!nextUrl) return null;
    return (
      <Link to={nextUrl} preventScrollReset prefetch="intent" className={className}>
        {label}
      </Link>
    );
  };

  const PreviousLink: FC<{children: ReactNode; className?: string}> = ({children: label, className}) => {
    if (!prevUrl) return null;
    return (
      <Link to={prevUrl} preventScrollReset prefetch="intent" className={className}>
        {label}
      </Link>
    );
  };

  return (
    <>
      {children({
        nodes,
        NextLink,
        PreviousLink,
        isLoading,
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: currentPage > 1,
      })}
    </>
  );
}

/**
 * Номерирана лента със страници.
 *
 * „Зареди още“ работи, докато страницата е 12 продукта. При 32 на страница
 * и 1251 продукта в Строителство това са 40 натискания, за да стигнеш до
 * края, и никакъв начин да се върнеш на страница 12 или да я споделиш.
 * Затова тук има истински номера — всеки с собствен URL, който търсачките
 * могат да обходят, а човек може да сподели.
 *
 * Показваме първата, последната, текущата и по една съседна, а останалите
 * свиваме в многоточие. Така лентата е с постоянна ширина независимо дали
 * страниците са 3 или 40.
 */
export function PageNav({
  currentPage,
  totalCount,
  pageSize,
  className = '',
}: {
  currentPage: number;
  totalCount?: number | null;
  pageSize: number;
  className?: string;
}) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;
  if (!totalPages || totalPages < 2) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.delete('cursor');
    params.delete('direction');
    if (page <= 1) params.delete('page');
    else params.set('page', String(page));
    const qs = params.toString();
    return qs ? `?${qs}` : '?';
  };

  // Първа, последна, текущата и по една съседна; останалото — многоточие.
  const pages: Array<number | 'gap'> = [];
  for (let p = 1; p <= totalPages; p++) {
    const keep = p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
    if (keep) pages.push(p);
    else if (pages[pages.length - 1] !== 'gap') pages.push('gap');
  }

  const base =
    'flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-[0.85rem] font-medium transition-[background,border-color,color] duration-150 no-underline hover:no-underline';

  return (
    <nav
      aria-label="Страници"
      className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}
    >
      {currentPage > 1 ? (
        <Link
          to={hrefFor(currentPage - 1)}
          preventScrollReset
          prefetch="intent"
          rel="prev"
          aria-label="Предишна страница"
          className={`${base} border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand-dark`}
        >
          ← Назад
        </Link>
      ) : (
        <span className={`${base} cursor-not-allowed border-gray-100 bg-white text-gray-300`}>
          ← Назад
        </span>
      )}

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-gray-400 select-none">
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className={`${base} border-brand bg-brand font-semibold text-white`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            to={hrefFor(p)}
            preventScrollReset
            prefetch="intent"
            className={`${base} border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand-dark`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          to={hrefFor(currentPage + 1)}
          preventScrollReset
          prefetch="intent"
          rel="next"
          aria-label="Следваща страница"
          className={`${base} border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand-dark`}
        >
          {isLoading ? 'Зареждане…' : 'Напред →'}
        </Link>
      ) : (
        <span className={`${base} cursor-not-allowed border-gray-100 bg-white text-gray-300`}>
          Напред →
        </span>
      )}
    </nav>
  );
}
