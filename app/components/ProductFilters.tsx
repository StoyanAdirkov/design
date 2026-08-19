import {useState, useMemo} from 'react';
import {useSearchParams, useNavigate} from 'react-router';
import type {Filter, FilterValue} from '@cloudcart/nitrogen';
import {filterInputToParam, isFilterActive} from '~/lib/filters';
import {
  translateFilterLabel,
  translateFilterValue,
  filterGroupKey,
} from '~/lib/filter-labels';
import {ChevronDownIcon} from '@heroicons/react/20/solid';

interface ProductFiltersProps {
  filters?: Filter[];
  totalCount?: number | null;
}

/** „1 продукт“ / „1251 продукта“ — числото се форматира с интервал за хилядите. */
function productsLabel(n: number): string {
  const num = new Intl.NumberFormat('bg-BG').format(n);
  return n === 1 ? `${num} продукт` : `${num} продукта`;
}

/**
 * Група филтри с преведено заглавие и слети дубликати.
 *
 * Свойствата в каталога на maxxmart са въвеждани от години и една и съща
 * характеристика живее под три имена („Размер“, „размер“, „РАЗМЕРИ“).
 * Слепваме ги по нормализирано заглавие — виж lib/filter-labels.ts.
 */
interface MergedGroup {
  key: string;
  label: string;
  type: Filter['type'];
  values: FilterValue[];
  source: Filter;
}

/**
 * Скрива групи, които не могат да свършат работа.
 *
 * В Строителство (1251 продукта) секцията „РАЗМЕРИ“ има шест стойности,
 * всяка с по един продукт — филтър, който при клик оставя точно един
 * артикул. Това не е филтър, а списък с продукти, изписан с дребен шрифт.
 *
 * Правилото е двойно нарочно: махаме групата само ако НИТО една стойност
 * не хваща повече от един продукт И групата покрива под 2% от списъка.
 * Така в малка листова категория (1 от 12 продукта = 8%) филтърът остава,
 * а в голяма изчезва.
 */
function isUsefulGroup(values: FilterValue[], totalCount?: number | null): boolean {
  if (!values.length) return false;
  const counts = values.map((v) => v.count ?? 0);
  if (Math.max(...counts) > 1) return true;
  if (!totalCount) return true;
  const coverage = counts.reduce((a, b) => a + b, 0);
  return coverage / totalCount >= 0.02;
}

export function ProductFilters({filters = [], totalCount}: ProductFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentSort = searchParams.get('sort') ?? '';
  const currentMinPrice = searchParams.get('minPrice') ?? '';
  const currentMaxPrice = searchParams.get('maxPrice') ?? '';

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('cursor');
    params.delete('direction');
    params.delete('page');
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  }

  function toggleFilterValue(input: string) {
    const param = filterInputToParam(input);
    if (!param) return;

    const params = new URLSearchParams(searchParams);
    const existing = params.getAll(param.key);

    if (existing.includes(param.value)) {
      // Махаме точно тази стойност, но пазим останалите за същия ключ
      params.delete(param.key);
      for (const v of existing) {
        if (v !== param.value) params.append(param.key, v);
      }
    } else {
      params.append(param.key, param.value);
    }
    params.delete('cursor');
    params.delete('direction');
    // Смяната на филтър винаги връща на първа страница — иначе се озоваваш
    // на стр. 7 от резултат с две страници и списъкът излиза празен.
    params.delete('page');
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  }

  function clearAll() {
    navigate('?', {preventScrollReset: true});
  }

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (k) => !['sort', 'cursor', 'direction', 'page'].includes(k),
  );

  // Сливане на дублиращи се групи + отсяване на безполезните.
  // Слива само в рамките на един тип: „Цвят“ идва ту като списък с
  // отметки, ту като цветни кръгчета, а те не се смесват в един ред.
  const {primary: groups, secondary: rareGroups} = useMemo<{
    primary: MergedGroup[];
    secondary: MergedGroup[];
  }>(() => {
    const byKey = new Map<string, MergedGroup>();
    for (const f of filters) {
      if (f.type === 'PRICE_RANGE' || f.type === 'RANGE' || f.type === 'BOOLEAN') {
        byKey.set(`${f.type}:${f.id}`, {
          key: `${f.type}:${f.id}`,
          label: translateFilterLabel(f.label),
          type: f.type,
          values: f.values,
          source: f,
        });
        continue;
      }
      const key = `${f.type}:${filterGroupKey(f.label)}`;
      const existing = byKey.get(key);
      if (existing) {
        existing.values = [...existing.values, ...f.values];
      } else {
        byKey.set(key, {
          key,
          label: translateFilterLabel(f.label),
          type: f.type,
          values: [...f.values],
          source: f,
        });
      }
    }
    const all = Array.from(byKey.values());
    const isFacet = (g: MergedGroup) =>
      g.type === 'LIST' || g.type === 'SWATCH_COLOR' || g.type === 'SWATCH_IMAGE';
    return {
      primary: all.filter((g) => !isFacet(g) || isUsefulGroup(g.values, totalCount)),
      secondary: all.filter((g) => isFacet(g) && !isUsefulGroup(g.values, totalCount)),
    };
  }, [filters, totalCount]);

  return (
    <div className="flex flex-col gap-5">
      {/* Подреждане */}
      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Подреди по
        </label>
        <select
          className="form-select w-full cursor-pointer rounded-md border-gray-200 px-3 py-2 text-[0.85rem] text-dark focus:border-brand focus:ring-0"
          value={currentSort}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          <option value="">Препоръчани</option>
          <option value="price-asc">Цена: ниска → висока</option>
          <option value="price-desc">Цена: висока → ниска</option>
          <option value="title-asc">Име: А → Я</option>
          <option value="title-desc">Име: Я → А</option>
          <option value="created-desc">Най-нови</option>
          <option value="best-selling">Най-продавани</option>
        </select>
      </div>

      {totalCount != null && (
        <div className="border-b border-gray-100 pb-1 text-xs text-gray-500">
          {productsLabel(totalCount)}
        </div>
      )}

      {/* Динамични филтри от API-то */}
      {groups.map((group) => (
        <FilterGroup
          key={group.key}
          group={group}
          searchParams={searchParams}
          onToggle={toggleFilterValue}
          onUpdateParam={updateParam}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
        />
      ))}

      {/* Рядко срещани характеристики — сгънати, но налични.
          Не ги трием: „Разфасовка 25 кг“ с един продукт е безполезна в
          списък от 1251 артикула, но не е грешна. Скрита зад едно
          кликване, колоната остава четима, а филтърът — достъпен. */}
      {rareGroups.length > 0 && <RareGroups
        groups={rareGroups}
        searchParams={searchParams}
        onToggle={toggleFilterValue}
        onUpdateParam={updateParam}
      />}

      {hasActiveFilters && (
        <button
          className="cursor-pointer border-none bg-transparent p-0 text-left font-sans text-xs font-medium text-brand underline"
          onClick={clearAll}
        >
          Изчисти филтрите
        </button>
      )}
    </div>
  );
}

function GroupLabel({children}: {children: React.ReactNode}) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
      {children}
    </label>
  );
}

function FilterGroup({
  group,
  searchParams,
  onToggle,
  onUpdateParam,
  currentMinPrice,
  currentMaxPrice,
}: {
  group: MergedGroup;
  searchParams: URLSearchParams;
  onToggle: (input: string) => void;
  onUpdateParam: (key: string, value: string) => void;
  currentMinPrice: string;
  currentMaxPrice: string;
}) {
  switch (group.type) {
    case 'LIST':
      return <FilterListGroup group={group} searchParams={searchParams} onToggle={onToggle} />;
    case 'SWATCH_COLOR':
      return <FilterSwatchColorGroup group={group} searchParams={searchParams} onToggle={onToggle} />;
    case 'SWATCH_IMAGE':
      return <FilterSwatchImageGroup group={group} searchParams={searchParams} onToggle={onToggle} />;
    case 'PRICE_RANGE':
      return (
        <FilterPriceRangeGroup
          group={group}
          onUpdateParam={onUpdateParam}
          currentMinPrice={currentMinPrice}
          currentMaxPrice={currentMaxPrice}
        />
      );
    case 'RANGE':
      return <FilterRangeGroup group={group} onUpdateParam={onUpdateParam} />;
    case 'BOOLEAN':
      return <FilterBooleanGroup group={group} searchParams={searchParams} onToggle={onToggle} />;
    default:
      return null;
  }
}

function FilterListGroup({
  group,
  searchParams,
  onToggle,
}: {
  group: MergedGroup;
  searchParams: URLSearchParams;
  onToggle: (input: string) => void;
}) {
  const VISIBLE_COUNT = 7;
  const [expanded, setExpanded] = useState(false);
  const hasMore = group.values.length > VISIBLE_COUNT;
  const visibleValues = expanded ? group.values : group.values.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-col gap-1.5">
      <GroupLabel>{group.label}</GroupLabel>
      <div className="flex flex-col gap-1">
        {visibleValues.map((v) => (
          <label
            key={v.id}
            className="flex cursor-pointer items-center gap-1.5 py-0.5 text-[0.85rem] [&_input]:shrink-0"
          >
            <input
              type="checkbox"
              className="form-checkbox rounded border-gray-300 text-brand focus:ring-brand"
              checked={isFilterActive(searchParams, v.input)}
              onChange={() => onToggle(v.input)}
            />
            <span className="flex-1 truncate text-dark">{translateFilterValue(v.label)}</span>
            <span className="shrink-0 text-xs text-gray-400">({v.count})</span>
          </label>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 font-sans text-xs text-gray-500 transition-colors duration-150 hover:text-dark"
        >
          <ChevronDownIcon
            className={`size-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? 'Покажи по-малко' : `Виж всички ${group.values.length}`}
        </button>
      )}
    </div>
  );
}

function FilterSwatchColorGroup({
  group,
  searchParams,
  onToggle,
}: {
  group: MergedGroup;
  searchParams: URLSearchParams;
  onToggle: (input: string) => void;
}) {
  // Без зададен цвят кръгчето излиза сиво и е неразличимо от съседното —
  // в Строителство така се получаваха девет еднакви сиви точки.
  const values = group.values.filter((v) => !!v.swatchColor);
  if (!values.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <GroupLabel>{group.label}</GroupLabel>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`size-7 cursor-pointer rounded-full border-2 p-0 transition-[border-color,box-shadow] duration-150 hover:border-gray-400 ${isFilterActive(searchParams, v.input) ? 'border-dark shadow-[0_0_0_2px_var(--color-light),0_0_0_4px_var(--color-dark)]' : 'border-gray-200'}`}
            title={`${translateFilterValue(v.label)} (${v.count})`}
            aria-label={`${translateFilterValue(v.label)} (${v.count})`}
            onClick={() => onToggle(v.input)}
            style={{backgroundColor: v.swatchColor ?? '#ccc'}}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSwatchImageGroup({
  group,
  searchParams,
  onToggle,
}: {
  group: MergedGroup;
  searchParams: URLSearchParams;
  onToggle: (input: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <GroupLabel>{group.label}</GroupLabel>
      <div className="flex flex-wrap gap-1.5">
        {group.values.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`size-9 cursor-pointer overflow-hidden rounded-md border-2 bg-light p-0.5 transition-[border-color] duration-150 hover:border-gray-400 ${isFilterActive(searchParams, v.input) ? 'border-dark' : 'border-gray-200'}`}
            title={`${translateFilterValue(v.label)} (${v.count})`}
            aria-label={`${translateFilterValue(v.label)} (${v.count})`}
            onClick={() => onToggle(v.input)}
          >
            {v.swatchImage && (
              <img
                src={v.swatchImage}
                alt={translateFilterValue(v.label)}
                className="h-full w-full rounded object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterPriceRangeGroup({
  group,
  onUpdateParam,
  currentMinPrice,
  currentMaxPrice,
}: {
  group: MergedGroup;
  onUpdateParam: (key: string, value: string) => void;
  currentMinPrice: string;
  currentMaxPrice: string;
}) {
  const min = group.source.minValue?.value ?? 0;
  const max = group.source.maxValue?.value ?? 0;

  return (
    <div className="flex flex-col gap-1.5">
      <GroupLabel>{group.label}</GroupLabel>
      <div className="flex items-center gap-2">
        <input
          key={`min-${currentMinPrice}`}
          type="number"
          className="form-input w-full rounded-md border-gray-200 px-2 py-2 text-[0.85rem] focus:border-brand focus:ring-0"
          placeholder={String(min)}
          aria-label="Най-ниска цена"
          defaultValue={currentMinPrice}
          onBlur={(e) => onUpdateParam('minPrice', e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && onUpdateParam('minPrice', (e.target as HTMLInputElement).value)
          }
          min={min}
          max={max}
        />
        <span className="shrink-0 text-gray-300">&mdash;</span>
        <input
          key={`max-${currentMaxPrice}`}
          type="number"
          className="form-input w-full rounded-md border-gray-200 px-2 py-2 text-[0.85rem] focus:border-brand focus:ring-0"
          placeholder={String(max)}
          aria-label="Най-висока цена"
          defaultValue={currentMaxPrice}
          onBlur={(e) => onUpdateParam('maxPrice', e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && onUpdateParam('maxPrice', (e.target as HTMLInputElement).value)
          }
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}

function FilterRangeGroup({
  group,
  onUpdateParam,
}: {
  group: MergedGroup;
  onUpdateParam: (key: string, value: string) => void;
}) {
  const min = group.source.minValue?.value ?? 0;
  const max = group.source.maxValue?.value ?? 0;
  const step = group.source.rangeStep ?? 1;

  return (
    <div className="flex flex-col gap-1.5">
      <GroupLabel>{group.label}</GroupLabel>
      <div className="flex items-center gap-2">
        <span className="min-w-8 shrink-0 text-center text-xs text-gray-500">{min}</span>
        <input
          type="range"
          className="form-range flex-1 accent-brand"
          aria-label={group.label}
          min={min}
          max={max}
          step={step}
          defaultValue={max}
        />
        <span className="min-w-8 shrink-0 text-center text-xs text-gray-500">{max}</span>
      </div>
    </div>
  );
}

function FilterBooleanGroup({
  group,
  searchParams,
  onToggle,
}: {
  group: MergedGroup;
  searchParams: URLSearchParams;
  onToggle: (input: string) => void;
}) {
  const trueValue = group.values.find((v) => {
    try {
      const parsed = JSON.parse(v.input);
      return parsed.onSale === true || parsed.isNew === true || parsed.isFeatured === true;
    } catch {
      return false;
    }
  });

  if (!trueValue) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex cursor-pointer items-center gap-1.5 py-0.5 text-[0.85rem]">
        <input
          type="checkbox"
          className="form-checkbox shrink-0 rounded border-gray-300 text-brand focus:ring-brand"
          checked={isFilterActive(searchParams, trueValue.input)}
          onChange={() => onToggle(trueValue.input)}
        />
        <span className="flex-1 text-dark">{group.label}</span>
        <span className="shrink-0 text-xs text-gray-400">({trueValue.count})</span>
      </label>
    </div>
  );
}

function RareGroups({
  groups,
  searchParams,
  onToggle,
  onUpdateParam,
}: {
  groups: MergedGroup[];
  searchParams: URLSearchParams;
  onToggle: (input: string) => void;
  onUpdateParam: (key: string, value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const count = groups.reduce((n, g) => n + g.values.length, 0);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex cursor-pointer items-center justify-between gap-2 border-none bg-transparent p-0 text-left font-sans text-xs font-semibold uppercase tracking-wider text-gray-500 transition-colors hover:text-dark"
      >
        <span>
          Още характеристики{' '}
          <span className="font-normal normal-case text-gray-400">({count})</span>
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <FilterGroup
              key={group.key}
              group={group}
              searchParams={searchParams}
              onToggle={onToggle}
              onUpdateParam={onUpdateParam}
              currentMinPrice=""
              currentMaxPrice=""
            />
          ))}
        </div>
      )}
    </div>
  );
}
