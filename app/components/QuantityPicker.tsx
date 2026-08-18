import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline';

/**
 * Избор на количество — и Praktiker, и Bauhaus го имат до бутона.
 * При строителни материали е задължително: никой не купува един чувал
 * лепило, купува дванайсет.
 *
 * Горната граница е реалната наличност, когато магазинът я дава.
 */
export function QuantityPicker({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number | null;
}) {
  const ceiling = max && max > 0 ? max : 99;
  const dec = () => onChange(Math.max(1, value - 1));
  const inc = () => onChange(Math.min(ceiling, value + 1));

  return (
    <div className="flex items-center gap-3">
      <span className="text-[0.85rem] font-medium text-gray-600">Количество:</span>
      <div className="flex items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={dec}
          disabled={value <= 1}
          aria-label="Намали количеството"
          className="flex size-10 items-center justify-center rounded-l-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-dark disabled:cursor-not-allowed disabled:opacity-35"
        >
          <MinusIcon className="size-4" strokeWidth={2.4} />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={ceiling}
          value={value}
          aria-label="Количество"
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) onChange(Math.min(ceiling, Math.max(1, n)));
          }}
          className="h-10 w-14 border-x border-gray-300 text-center text-[0.95rem] font-semibold text-dark focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={inc}
          disabled={value >= ceiling}
          aria-label="Увеличи количеството"
          className="flex size-10 items-center justify-center rounded-r-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-dark disabled:cursor-not-allowed disabled:opacity-35"
        >
          <PlusIcon className="size-4" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
