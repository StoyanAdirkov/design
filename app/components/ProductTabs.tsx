import {useState, useId} from 'react';
import {RichText} from '@cloudcart/nitrogen-react';
import {ArrowDownTrayIcon} from '@heroicons/react/24/outline';

/**
 * Табове под продукта — както е при CloudCart: описанието, параметрите и
 * документите не се редят един под друг, а се сменят.
 *
 * Показват се само табовете, за които има съдържание. Празен таб
 * „Документи“ е по-лош от липсващ. Лентата се рисува и при един таб,
 * защото CloudCart прави точно така.
 *
 * ДВЕ НЕЩА ЗА ДАННИТЕ, ОТКРИТИ ПРИ ПРОВЕРКА:
 *
 * 1. Storefront API-то НЕ връща собствените табове на продукта. Полето
 *    tabs съществува в Admin API, но не и в storefront заявката.
 *
 * 2. В целия магазин продуктите нямат нито характеристики, нито
 *    прикачени файлове — проверени са бормашина, смесител, косачка и
 *    лепило: properties = 0, files = 0 навсякъде. Затова табът
 *    „Параметри“ се сглобява от реални данни, с които разполагаме
 *    (производител, SKU, тегло, разфасовка), вместо да стои празен.
 *    Ако маркетингът попълни характеристики в админа, те печелят.
 */
interface Props {
  descriptionHtml?: string | null;
  properties?: Array<{name: string; values: string[]}>;
  files?: Array<{id: string; name: string; filename: string; url: string; fileSize: number}>;
  product?: any;
  variant?: any;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProductTabs({
  descriptionHtml,
  properties = [],
  files = [],
  product,
  variant,
}: Props) {
  const baseId = useId();

  // Характеристиките от админа печелят. Ако ги няма, сглобяваме реда от
  // това, което магазинът наистина знае за продукта.
  const specs: Array<{name: string; values: string[]}> = properties.length
    ? properties
    : [
        product?.vendor ? {name: 'Производител', values: [product.vendor]} : null,
        variant?.sku ? {name: 'Каталожен номер', values: [String(variant.sku)]} : null,
        variant?.weight
          ? {
              name: 'Тегло',
              values: [
                `${variant.weight >= 1000 ? variant.weight / 1000 : variant.weight} кг`,
              ],
            }
          : null,
        variant?.title ? {name: 'Разновидност', values: [variant.title]} : null,
        // statusName нарочно НЕ влиза тук: за наличен продукт магазинът
        // връща „Продукт“, което като стойност на ред „Наличност“ е
        // безсмислица. Ползва се само когато нещо не е налично, където
        // стойността е смислена („Запитване“).
      ].filter(Boolean) as Array<{name: string; values: string[]}>;

  const tabs = [
    descriptionHtml?.trim() ? {id: 'opisanie', label: 'Описание'} : null,
    specs.length ? {id: 'parametri', label: 'Параметри'} : null,
    files.length ? {id: 'dokumenti', label: `Документи (${files.length})`} : null,
  ].filter(Boolean) as Array<{id: string; label: string}>;

  const [active, setActive] = useState(tabs[0]?.id);

  if (!tabs.length) return null;

  const panel = (id: string) => {
    if (id === 'opisanie') {
      return (
        /**
         * Описанието на производителя е низ от редове „Етикет: стойност“
         * — опаковка, дебелина, състав, технически показатели. Досега
         * вървеше като 14px проза с 10px между абзаците и се четеше като
         * сива стена, в която нищо не се намира.
         *
         * Промените са три и всяка има причина:
         *   · 15px вместо 14 и ред 1.8 вместо 1.6 — това е текст, който
         *     се чете на обект, често с телефон в едната ръка;
         *   · 16px между абзаците вместо 10 — окото хваща къде свършва
         *     една мисъл;
         *
         * Пробвах и да откроя думата преди двоеточието през ::first-line,
         * но той хваща целия първи ВИЗУАЛЕН ред, не етикета — при дълъг
         * абзац удебеляваше случайни думи. За истинско открояване трябва
         * описанието да се разбие на етикет и стойност още при парсването.
         */
        <RichText
          data={descriptionHtml as string}
          className="prose-lines prose prose-gray max-w-[68ch] text-[0.95rem] leading-[1.8] text-gray-700 prose-p:my-4 prose-li:my-1.5 prose-headings:mb-3 prose-headings:mt-7 prose-headings:text-dark prose-strong:font-semibold prose-strong:text-dark prose-ul:my-4 md:text-[1rem]"
        />
      );
    }

    if (id === 'parametri') {
      return (
        /* На телефон таблица с колона 38% оставя на стойността шейсет
           пиксела и всяка се чупи на три реда. Затова там етикетът и
           стойността са един под друг, а от sm нагоре — в две колони. */
        <dl className="max-w-[68ch] divide-y divide-gray-100">
          {specs.map((prop) => (
            <div
              key={prop.name}
              className="grid gap-0.5 py-3.5 sm:grid-cols-[minmax(0,38%)_minmax(0,1fr)] sm:gap-4"
            >
              <dt className="text-[0.78rem] font-semibold uppercase tracking-wide text-gray-500 sm:pt-0.5">
                {prop.name}
              </dt>
              <dd className="m-0 text-[0.92rem] leading-relaxed text-dark">
                {prop.values.join(', ')}
              </dd>
            </div>
          ))}
        </dl>
      );
    }

    return (
      <ul className="flex list-none flex-col gap-2 p-0">
        {files.map((file) => (
          <li key={file.id}>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[0.85rem] text-dark transition-all duration-150 hover:border-gray-400 hover:bg-gray-100 hover:no-underline"
            >
              <ArrowDownTrayIcon className="size-4 shrink-0 text-gray-400" />
              {file.name || file.filename}
              {file.fileSize > 0 ? (
                <span className="ml-auto text-xs text-gray-400">
                  {formatFileSize(file.fileSize)}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    /* Оформлението следва останалите блокове на страницата — калкулатора,
       доставката и „Как се използва“ са меки карти с рамка. Табовете бяха
       гол текст с тънка сива черта и се четяха като друг шаблон. */
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div
        role="tablist"
        aria-label="Информация за продукта"
        className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50/70 px-2"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`-mb-px border-b-2 px-4 py-3.5 text-[0.88rem] font-semibold transition-colors ${
                isActive
                  ? 'border-brand text-dark'
                  : 'border-transparent text-gray-500 hover:text-dark'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 md:p-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={tab.id !== active}
          >
            {tab.id === active ? panel(tab.id) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
