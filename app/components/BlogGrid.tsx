import {Link} from 'react-router';
import {ArrowUpRightIcon, NewspaperIcon} from '@heroicons/react/24/outline';
import {ARTICLE_IMAGES} from '~/lib/article-images';

/**
 * Статии от блога — тъмна секция в езика на хедъра и клубната карта.
 *
 * Подредбата е нарочно неравномерна: първата статия заема двойна карта,
 * останалите пет са в мрежа. Шест еднакви правоъгълника изглеждат като
 * таблица; една водеща дава йерархия и казва откъде се започва.
 *
 * Всички карти са с еднаква вътрешна структура — етикет, заглавие,
 * откъс — и заглавието е с резервирана височина, за да са долните
 * ръбове подравнени независимо от дължината му.
 */
interface Article {
  id: string;
  title: string;
  handle: string;
  excerpt?: string | null;
  image?: {url: string; altText?: string | null; width?: number; height?: number} | null;
  blogHandle: string;
  blogTitle: string;
}

function Card({article, featured = false}: {article: Article; featured?: boolean}) {
  // Storefront API-то връща снимка с празен url — виж lib/article-images.ts.
  // Ако някога го поправят, неговият адрес печели.
  const imageUrl = article.image?.url || ARTICLE_IMAGES[article.handle] || null;

  return (
    <Link
      to={`/blogs/${article.blogHandle}/${article.handle}`}
      prefetch="intent"
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-ink-2/70 transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:bg-ink-2 hover:shadow-[0_18px_40px_-20px_rgba(60,180,74,0.65)] hover:no-underline ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
    >
      {/* При водещата карта снимката расте и поема остатъка, иначе между
          нея и текста зее празно, защото картата е висока колкото два реда. */}
      <span
        className={`relative block overflow-hidden bg-ink-3 ${
          featured ? 'min-h-[220px] flex-1' : 'aspect-[16/9]'
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={article.image?.altText ?? article.title}
            loading="lazy"
            className="size-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <NewspaperIcon className="size-10 text-gray-700" />
          </span>
        )}
        <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

        <span className="absolute left-4 top-4 rounded-md bg-brand/90 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {article.blogTitle}
        </span>
      </span>

      <span className={`flex flex-col p-5 ${featured ? '' : 'flex-1'}`}>
        <span
          className={`font-bold leading-snug text-white transition-colors group-hover:text-brand-bright ${
            featured
              ? 'line-clamp-3 text-[1.25rem] md:text-[1.4rem]'
              : 'line-clamp-2 min-h-[2.7em] text-[0.95rem]'
          }`}
        >
          {article.title}
        </span>

        {article.excerpt ? (
          <span
            className={`mt-2 text-[0.84rem] leading-relaxed text-gray-400 ${
              featured ? 'line-clamp-4' : 'line-clamp-2'
            }`}
          >
            {article.excerpt}
          </span>
        ) : null}

        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[0.8rem] font-semibold text-brand-bright">
          Прочети
          <ArrowUpRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>
    </Link>
  );
}

export function BlogGrid({
  articles,
  className = '',
}: {
  articles: Article[];
  className?: string;
}) {
  if (!articles.length) return null;

  const [lead, ...rest] = articles;

  return (
    <section
      aria-label="От блога"
      className={`relative overflow-hidden bg-ink text-white ${className}`}
    >
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="promo-breathe pointer-events-none absolute -left-32 top-1/3 size-[420px] rounded-full bg-brand/18 blur-3xl" />

      <div className="relative px-5 py-10 xl:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.14em] text-brand-bright">
              От блога
            </span>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Съвети, новини и оферти
            </h2>
          </div>
          <Link
            to="/blogs/novini"
            prefetch="intent"
            className="text-[0.85rem] font-semibold text-brand-bright transition-colors hover:text-white hover:no-underline"
          >
            Всички статии →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card article={lead} featured />
          {rest.map((article) => (
            <Card key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
