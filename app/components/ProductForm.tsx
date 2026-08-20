import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {VariantSelector} from '@cloudcart/nitrogen-react';
import {PriceDual, PriceDualOld, PriceCloudCart, formatEur} from './PriceDual';
import {getUnitPrice, formatUnitPrice, formatPackSize} from '~/lib/unit-price';
import {AddToCartButton} from './AddToCartButton';
import {OptionSwatch} from './OptionSwatch';
import {QuantityPicker} from './QuantityPicker';
import {DeliveryPromise} from './DeliveryPromise';
import {StorePickup} from './StorePickup';
import {ProductCalculator} from './ProductCalculator';
import {parseConsumption} from '~/lib/consumption';

interface ProductFormProps {
  product: any;
  selectedVariant: any;
}

export function ProductForm({product, selectedVariant}: ProductFormProps) {
  const variant = selectedVariant;
  const [quantity, setQuantity] = useState(1);
  const hasMultiplePrices =
    product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const isOnSale = variant?.compareAtPrice &&
    parseFloat(variant.compareAtPrice.amount) > parseFloat(variant.price.amount);

  // Цена за килограм при чувалните материали — виж lib/unit-price.ts
  const unit = getUnitPrice(product);

  // Разходна норма от описанието на производителя — виж lib/consumption.ts
  const rates = parseConsumption(product.descriptionHtml);
  // Калкулаторът смята в килограми. При разфасовка в литри го оставяме
  // празен, вместо да делим килограми на литри.
  const packageKg = unit && unit.unit === 'кг' ? unit.size : 0;

  return (
    <div>
      {/* Цената в бранд зелено. Само евро — виж бележката в PriceDual.tsx
          Отстъпът е по-голям от този между редовете над нея: цената е
          най-важното на екрана и трябва да се откъсва от мета данните,
          а не да се лепи за последния им ред. */}
      <div className="mt-6" aria-live="polite">
        {variant ? (
          <PriceCloudCart data={variant.price} />
        ) : hasMultiplePrices ? (
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="text-[0.9rem] text-gray-500">от</span>
            <PriceCloudCart data={product.priceRange.minVariantPrice} />
          </span>
        ) : (
          <PriceCloudCart data={product.priceRange.minVariantPrice} />
        )}

        {isOnSale && variant?.compareAtPrice ? (
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3">
            <span className="text-[0.78rem] text-gray-500">Стара цена:</span>
            <PriceDualOld data={variant.compareAtPrice} />
            <span className="text-[0.78rem] font-semibold text-brand-dark">
              Спестяваш{' '}
              {formatEur(
                parseFloat(variant.compareAtPrice.amount) - parseFloat(variant.price.amount),
                variant.price.currencyCode,
              )}
            </span>
          </div>
        ) : null}

        {/* Мерна единица — това е нашата добавка към техния шаблон.
            При чувалните материали „9,83 €“ не значи нищо без цена за кг. */}
        {unit ? (
          <p className="mt-2 inline-flex items-baseline gap-2 rounded-md bg-brand/8 px-2.5 py-1 text-[0.84rem] ring-1 ring-brand/20">
            <span className="font-bold text-brand-dark">
              {formatUnitPrice(unit, product.priceRange?.minVariantPrice?.currencyCode)}
            </span>
            <span className="text-gray-500">
              разфасовка {formatPackSize(unit)}
            </span>
          </p>
        ) : null}
      </div>

      {/* Етикетът със статуса е махнат по искане на клиента. За наличен
          продукт магазинът връщаше „Продукт“, което и без това не казваше
          нищо на купувача. Статусът се вижда в реда за наличност отдолу. */}

      {variant && <StockIndicator variant={variant} />}

      {/* Обектите, в които тази разновидност е налична */}
      <StorePickup
        variantId={variant?.id}
        totalQuantity={variant?.quantityAvailable}
      />

      {/* Variant Selector */}
      <VariantSelector product={product}>
        {(options) =>
          options.map(({name, values}) => {
            const optionMeta = getOptionMeta(product, name);
            const optionType = optionMeta.type;
            const activeValue = values.find((v) => v.isActive);

            return (
              <fieldset key={name} className="border-none p-0 mb-5">
                <legend className="p-0 text-[0.85rem] font-semibold mb-2 text-dark">
                  {name}
                  {activeValue && <span className="font-normal text-gray-500">: {activeValue.value}</span>}
                </legend>

                {optionType === 'select' ? (
                  <OptionSelect name={name} values={values} />
                ) : (
                  <div className={`flex flex-wrap gap-2${optionType === 'color' ? ' gap-2.5' : ''}`}>
                    {values.map((o) => {
                      const valueMeta = optionMeta.values[o.value];
                      return (
                        <OptionSwatch
                          key={o.value}
                          option={o}
                          type={optionType}
                          color={valueMeta?.color}
                          swatchUrl={valueMeta?.swatchUrl}
                        />
                      );
                    })}
                  </div>
                )}
              </fieldset>
            );
          })
        }
      </VariantSelector>

      {/* Бутонът е в светла кутия на цялата ширина, както при тях.
          Клиентът поиска изрично „Купи“ вместо тяхното „Направи
          запитване“ — на живия им сайт точно този продукт показва
          запитване, макар да е в наличност. */}
      {variant && (
        <div className="mt-5 rounded-lg bg-gray-50 p-4 ring-1 ring-gray-200">
          <div className="mb-3">
            <QuantityPicker
              value={quantity}
              onChange={setQuantity}
              max={variant.quantityAvailable}
            />
          </div>
          <AddToCartButton
            merchandiseId={variant.id}
            quantity={quantity}
            disabled={!variant.availableForSale}
            className="flex w-full items-center justify-center rounded-lg bg-brand px-8 py-4 text-base font-bold uppercase tracking-wide text-white transition-all duration-150 hover:bg-brand-dark hover:shadow-[0_10px_24px_-10px_rgba(60,180,74,1)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
          >
            Купи
          </AddToCartButton>
        </div>
      )}

      {rates.length && packageKg ? (
        <ProductCalculator
          rates={rates}
          packageKg={packageKg}
          price={Number(variant?.price?.amount ?? product.priceRange?.minVariantPrice?.amount ?? 0)}
          currency={variant?.price?.currencyCode ?? product.priceRange?.minVariantPrice?.currencyCode}
        />
      ) : null}

      <DeliveryPromise />

      {/* Дългото уточнение за разликите между магазините е махнато по
          искане на клиента. Бележката за ДДС също слиза оттук, но НЕ е
          изтрита — преместена е във футъра, защото важи за целия сайт и
          е задължителна при B2C цени. */}
    </div>
  );
}

function StockIndicator({variant}: {variant: any}) {
  if (!variant.availableForSale) {
    return (
      <div className="mb-5 mt-2 text-xs font-medium">
        <span className="text-red-600">{variant.statusName || 'Няма наличност'}</span>
      </div>
    );
  }

  if (variant.currentlyNotInStock) {
    return (
      <div className="mb-5 mt-2 text-xs font-medium">
        <span className="text-brand">Предварителна поръчка</span>
      </div>
    );
  }

  if (variant.quantityAvailable != null && variant.quantityAvailable > 0 && variant.quantityAvailable <= 5) {
    return (
      <div className="mb-5 mt-2 text-xs font-medium">
        <span className="text-orange-600">Остават само {variant.quantityAvailable} бр.</span>
      </div>
    );
  }

  // Bauhaus показва точния брой („В НАЛИЧНОСТ 22 бр.“). Числото е
  // по-убедително от думата и подтиква към по-голяма поръчка.
  return (
    <div className="mb-5 mt-2 text-xs font-medium">
      <span className="text-green-600 before:mr-1.5 before:inline-block before:size-1.5 before:rounded-full before:bg-current before:align-middle before:content-['']">
        В наличност
      </span>
      {variant.quantityAvailable != null && variant.quantityAvailable > 0 ? (
        <span className="ml-1.5 text-gray-500">· {variant.quantityAvailable} бр.</span>
      ) : null}
    </div>
  );
}

function OptionSelect({name, values}: {name: string; values: any[]}) {
  const navigate = useNavigate();
  const activeValue = values.find((v) => v.isActive);

  return (
    <select
      className="form-select w-full max-w-xs py-2.5 border-[1.5px] border-gray-200 rounded-lg text-sm text-dark cursor-pointer transition-[border-color] duration-150 hover:border-gray-400 focus:border-dark focus:ring-0"
      value={activeValue?.value ?? ''}
      aria-label={name}
      onChange={(e) => {
        const selected = values.find((v) => v.value === e.target.value);
        if (selected) {
          navigate(selected.to, {replace: true, preventScrollReset: true});
        }
      }}
    >
      {values.map((o) => (
        <option key={o.value} value={o.value} disabled={!o.available}>
          {o.value}{!o.available ? ' (изчерпан)' : ''}
        </option>
      ))}
    </select>
  );
}

function getOptionMeta(product: any, optionName: string) {
  const values: Record<string, {color?: string; swatchUrl?: string}> = {};
  let type: string | undefined;

  for (const variant of product.variants.nodes) {
    for (const so of variant.selectedOptions) {
      if (so.name !== optionName) continue;
      if (so.type && !type) type = so.type;
      if (!values[so.value]) {
        values[so.value] = {
          color: so.color || undefined,
          swatchUrl: so.swatchUrl || undefined,
        };
      }
    }
  }

  return {type, values};
}
