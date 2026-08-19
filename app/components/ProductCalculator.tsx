import {useState, useMemo} from 'react';
import {CalculatorIcon} from '@heroicons/react/24/outline';
import type {ConsumptionRate} from '~/lib/consumption';
import {formatEur} from './PriceDual';

/**
 * Калкулатор: колко продукт трябва за дадена площ.
 *
 * Leroy Merlin има точно такъв за плочки и за боя и това е една от
 * препоръките в проучването на конкуренцията — в България го няма никой
 * освен ATEK, и то само за топлоизолация.
 *
 * Смята от РЕАЛНИ данни: разходната норма идва от описанието на
 * производителя, теглото на разфасовката — от варианта, цената — от
 * магазина.
 *
 * Резултатът е ДИАПАЗОН, защото и нормата е диапазон. Показването на
 * едно число би било фалшива точност — при 4,0–5,0 кг/м² разликата за
 * 100 м² е цели 100 кг, тоест четири торби.
 */
interface Props {
  rates: ConsumptionRate[];
  /** тегло на разфасовката в килограми */
  packageKg: number;
  /** цена на разфасовка */
  price: number;
  currency?: string;
}

export function ProductCalculator({rates, packageKg, price, currency}: Props) {
  const [area, setArea] = useState<string>('');
  const [rateIndex, setRateIndex] = useState(0);

  const rate = rates[rateIndex] ?? rates[0];

  const result = useMemo(() => {
    const m2 = parseFloat(area.replace(',', '.'));
    if (!Number.isFinite(m2) || m2 <= 0 || !rate || !packageKg) return null;

    const kgMin = m2 * rate.min;
    const kgMax = m2 * rate.max;
    const bagsMin = Math.ceil(kgMin / packageKg);
    const bagsMax = Math.ceil(kgMax / packageKg);

    return {
      kgMin,
      kgMax,
      bagsMin,
      bagsMax,
      costMin: bagsMin * price,
      costMax: bagsMax * price,
    };
  }, [area, rate, packageKg, price]);

  if (!rates.length || !packageKg) return null;

  const rateText = (r: ConsumptionRate) =>
    r.min === r.max ? `${r.min} кг/м²` : `${r.min}–${r.max} кг/м²`;

  return (
    <section
      aria-label="Калкулатор за количество"
      className="mt-5 rounded-lg border border-brand/30 bg-brand/[0.04] p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <CalculatorIcon className="size-5 text-brand-dark" />
        <h2 className="text-[0.92rem] font-bold text-dark">Колко ми трябва?</h2>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[0.78rem] text-gray-600">Площ</span>
          <span className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="напр. 40"
              className="h-10 w-28 rounded-lg border border-gray-300 px-3 text-[0.95rem] font-semibold text-dark focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/40"
            />
            <span className="text-[0.9rem] text-gray-600">м²</span>
          </span>
        </label>

        {rates.length > 1 ? (
          <label className="flex flex-col gap-1">
            <span className="text-[0.78rem] text-gray-600">Приложение</span>
            <select
              value={rateIndex}
              onChange={(e) => setRateIndex(Number(e.target.value))}
              className="h-10 rounded-lg border border-gray-300 px-3 text-[0.9rem] text-dark focus:border-brand focus:outline-none focus:ring-0"
            >
              {rates.map((r, i) => (
                <option key={`${r.label}-${i}`} value={i}>
                  {r.label || 'стандартно'} · {rateText(r)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {rates.length === 1 ? (
        <p className="mt-2 text-[0.76rem] text-gray-500">
          Разходна норма: {rateText(rates[0])}
        </p>
      ) : null}

      {result ? (
        <div className="mt-4 border-t border-brand/20 pt-4">
          <dl className="grid gap-3 sm:grid-cols-3">
            <div>
              <dt className="text-[0.74rem] uppercase tracking-wide text-gray-500">
                Нужно количество
              </dt>
              <dd className="mt-0.5 text-[1.05rem] font-bold text-dark">
                {result.kgMin === result.kgMax
                  ? `${Math.round(result.kgMin)} кг`
                  : `${Math.round(result.kgMin)}–${Math.round(result.kgMax)} кг`}
              </dd>
            </div>
            <div>
              <dt className="text-[0.74rem] uppercase tracking-wide text-gray-500">
                Разфасовки по {packageKg} кг
              </dt>
              <dd className="mt-0.5 text-[1.05rem] font-bold text-brand-dark">
                {result.bagsMin === result.bagsMax
                  ? `${result.bagsMin} бр.`
                  : `${result.bagsMin}–${result.bagsMax} бр.`}
              </dd>
            </div>
            <div>
              <dt className="text-[0.74rem] uppercase tracking-wide text-gray-500">
                Ориентировъчна стойност
              </dt>
              <dd className="mt-0.5 text-[1.05rem] font-bold text-dark">
                {result.costMin === result.costMax
                  ? formatEur(result.costMin, currency)
                  : `${formatEur(result.costMin, currency)} – ${formatEur(result.costMax, currency)}`}
              </dd>
              <dd className="text-[0.76rem] text-gray-500">
                {result.costMin === result.costMax
                  ? formatEur(result.costMin, currency)
                  : `${formatEur(result.costMin, currency)} – ${formatEur(result.costMax, currency)}`}
              </dd>
            </div>
          </dl>

          <p className="mt-3 text-[0.74rem] leading-snug text-gray-500">
            Сметката е ориентировъчна и следва разходната норма на производителя.
            Реалният разход зависи от основата, дебелината на слоя и начина на
            полагане. Предвидете резерв.
          </p>
        </div>
      ) : null}
    </section>
  );
}
