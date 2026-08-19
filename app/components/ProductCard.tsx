import {Link} from 'react-router';
import type {Product} from '@cloudcart/nitrogen';
import {Image} from '@cloudcart/nitrogen-react';
import {PriceDual, formatEur} from './PriceDual';
import {StarRating} from './StarRating';
import {WishlistButton} from './WishlistButton';
import {AddToCartButton} from './AddToCartButton';
import {AddByHandleButton} from './AddByHandleButton';
import {getUnitPrice, formatUnitPrice, formatPackSize} from '~/lib/unit-price';

/**
 * Продуктова карта.
 *
 * Три неща, които не са очевидни:
 *
 * 1. Картата НЕ е един голям <Link>. Бутонът „Купи“ е <form>, а форма
 *    вътре в линк е невалиден HTML и чупи клавиатурната навигация.
 *    Затова контейнерът е <article>, заглавието носи линка, а
 *    `after:absolute after:inset-0` разпъва кликаемата площ върху цялата
 *    карта. Бутонът стои над нея със `relative z-10`.
 *
 * 2. Снимката е на бяло, не на сиво. Снимките на maxxmart вече са на бял
 *    фон — сивата подложка зад тях рисуваше видим правоъгълник около
 *    всяка снимка.
 *
 * 3. Когато нещо не е налично, показваме `statusName` на магазина, а не
 *    измислено „Изчерпан“. maxxmart нарича това състояние „Запитване“ —
 *    тоест може да се пита, не че е приключило.
 *
 * Внимание при полетата: типът Product в @cloudcart/nitrogen обявява
 * `defaultVariantId` и `statusName`, но Storefront API-то НЕ ги връща на
 * ниво продукт. И двете живеят на варианта. Първата версия четеше
 * product.defaultVariantId, получаваше undefined и затова всяка карта
 * показваше „Избери“ вместо „Купи“.
 */
export function ProductCard({
  product,
  loading,
  badge,
  salePercent,
}: {
  product: Product;
  loading?: 'eager' | 'lazy';
  /** Допълнителен етикет, зададен от секцията (напр. „Препоръчан“) */
  badge?: string;
  /**
   * Процент отстъпка, наложен от секцията, когато продуктът няма своя.
   * Реалната отстъпка на продукта винаги е с предимство пред тази.
   */
  salePercent?: number;
}) {
  const p = product as any;

  // Магазинът има етикет "FEATURED" — на английски, в изцяло български
  // магазин, и не казва нищо на купувача. Скрит е тук, а не изтрит от
  // админа, защото данните са на клиента.
  const HIDDEN_LABELS = ['featured'];
  const labels: Array<{name: string; color?: string; textColor?: string}> = (
    p.labels ?? []
  ).filter(
    (l: {name?: string}) => !HIDDEN_LABELS.includes((l?.name ?? '').trim().toLowerCase()),
  );
  const reviewSummary = p.reviewSummary;

  const variants: any[] = product.variants?.nodes ?? [];
  const soleVariant = variants.length === 1 ? variants[0] : null;

  const available = product.availableForSale !== false;
  const statusLabel: string | null = soleVariant?.statusName ?? p.statusName ?? null;

  // Артикул с реален избор (цвят, размер, литраж) не бива да влиза в
  // количката с едно кликане — там пращаме към страницата на продукта.
  const needsChoice =
    variants.length > 1 ||
    (product.options ?? []).some((o) => (o.values?.length ?? 0) > 1);

  const buyVariantId: string | null = soleVariant?.id ?? null;
  const canQuickBuy = available && !!buyVariantId && !needsChoice;

  // Цената и отстъпката.
  // Ако магазинът е задал реална стара цена (compareAtPrice), тя печели.
  // Процентът от секцията е само резервен вариант за оформление.
  const price = Number(product.priceRange?.minVariantPrice?.amount ?? 0);
  const compareAt = Number(soleVariant?.compareAtPrice?.amount ?? 0);
  const realDiscount = compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0;

  const percent = realDiscount || (salePercent ?? 0);
  const oldPrice = realDiscount ? compareAt : percent ? price / (1 - percent / 100) : 0;
  const showDiscount = percent > 0 && oldPrice > price;

  // Цена за килограм при чувалните материали — виж lib/unit-price.ts
  const unit = getUnitPrice(p);

  const currencyCode = product.priceRange?.minVariantPrice?.currencyCode;

  return (
    <article /* Един-единствен ефект при задържане: зеленият кант.
         Повдигането и сянката са махнати — при повдигане горният ръб
         излизаше извън скролиращия контейнер на каруселa и се отрязваше,
         затова кантът не се виждаше отгоре. */
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors duration-200 hover:border-brand">
      <div className="relative p-3">
        {/* 4/3, а не квадрат: при 4 карти на цял екран картата е ~460px
            широка и квадратната снимка правеше секцията 600px висока */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
          {product.featuredImage?.url ? (
            <Image
              data={product.featuredImage}
              alt={product.title}
              loading={loading}
              className="size-full rounded-none object-contain p-2"
            />
          ) : (
            <img
              src="/noimage.svg"
              alt={product.title}
              loading={loading}
              className="size-full rounded-none object-contain p-6 opacity-50"
            />
          )}
        </div>

        {/* етикети — горе вляво, в бранд зелено вместо сивото по подразбиране */}
        {showDiscount ? (
          <span className="absolute left-5 top-5 z-10 rounded-md bg-red-600 px-2.5 py-1 text-[0.66rem] font-bold uppercase leading-none tracking-wider text-white shadow-[0_2px_10px_rgba(220,38,38,0.55)]">
            −{percent}%
          </span>
        ) : null}

        {(badge || labels.length > 0) && !showDiscount && (
          <div className="absolute left-5 top-5 z-10 flex flex-wrap gap-1.5">
            {badge ? (
              <span className="rounded-md bg-brand px-2.5 py-1 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-white shadow-[0_2px_10px_rgba(60,180,74,0.5)]">
                {badge}
              </span>
            ) : null}
            {/* при секционен етикет пускаме само още един магазинен,
                иначе горният ъгъл се задръства */}
            {(badge ? labels.slice(0, 1) : labels).map((label) => (
              <span
                key={label.name}
                className="rounded-md bg-ink px-2.5 py-1 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-white"
                style={
                  label.color
                    ? {backgroundColor: label.color, color: label.textColor || '#fff'}
                    : undefined
                }
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* статусът се премести долу вляво — горе вдясно вече е сърцето */}
        {!available && statusLabel ? (
          <span className="absolute bottom-5 left-5 z-10 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-gray-600">
            {statusLabel}
          </span>
        ) : null}

        {/* сърцето стои горе вдясно, на същата линия като етикетите
            отляво (top-5), за да е подравнено */}
        <div className="absolute right-5 top-5 z-10">
          <WishlistButton productId={product.id} size="md" />
        </div>
      </div>

      {/* текстовата част — flex-1 и mt-auto подравняват цената и бутона
          между картите въпреки различната дължина на заглавията */}
      <div className="flex flex-1 flex-col px-4 pb-4">
        <h4 className="min-h-[2.6em] text-[0.82rem] font-medium leading-snug text-gray-800">
          <Link
            to={`/products/${product.handle}`}
            prefetch="intent"
            className="line-clamp-2 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-dark hover:no-underline"
          >
            {product.title}
          </Link>
        </h4>

        {reviewSummary && reviewSummary.totalCount > 0 ? (
          <div className="mt-1.5">
            <StarRating
              rating={reviewSummary.averageRating}
              count={reviewSummary.totalCount}
              size="sm"
            />
          </div>
        ) : null}

        <div className="mt-auto pt-3">
          {/* Двойна валута и тук, не само на продуктовата страница —
              в преходния период към еврото важи за всяка показана цена. */}
          {showDiscount ? (
            <span className="mb-0.5 block text-[0.78rem] font-medium text-gray-400 line-through">
              {formatEur(oldPrice, currencyCode)}
            </span>
          ) : null}
          {showDiscount ? (
            <span className="text-[1.05rem] font-bold tracking-tight text-red-600">
              {formatEur(price, currencyCode)}
            </span>
          ) : (
            <PriceDual data={product.priceRange.minVariantPrice} size="sm" />
          )}

          {unit ? (
            <span className="mt-0.5 block text-[0.74rem] text-gray-500">
              {formatUnitPrice(unit, product.priceRange?.minVariantPrice?.currencyCode)}
              {' · '}
              {formatPackSize(unit)}
            </span>
          ) : null}

          <div className="relative z-10 mt-2.5">
            {canQuickBuy ? (
              <AddToCartButton
                merchandiseId={buyVariantId}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-brand text-[0.82rem] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-[0_6px_18px_-6px_rgba(60,180,74,0.85)] disabled:opacity-60"
              >
                Купи
              </AddToCartButton>
            ) : available ? (
              // Картата не знае варианта (списъчната заявка не го връща),
              // затова бутонът праща handle-а и сървърът го разрешава.
              <AddByHandleButton
                handle={product.handle}
                className="flex h-10 w-full items-center justify-center rounded-lg bg-brand text-[0.82rem] font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-[0_6px_18px_-6px_rgba(60,180,74,0.85)] disabled:opacity-60"
              >
                Купи
              </AddByHandleButton>
            ) : (
              <Link
                to={`/products/${product.handle}`}
                prefetch="intent"
                className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 text-[0.82rem] font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:no-underline"
              >
                {statusLabel ?? 'Виж'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
