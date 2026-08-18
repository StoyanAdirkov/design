/**
 * Цена в евро и в лева едновременно.
 *
 * В преходния период към еврото българските търговци са длъжни да
 * показват и двете. Живият сайт на maxxmart го прави точно така:
 * „9,83 € / 19,23 лв.“, а във футъра стои курсът.
 *
 * Курсът е фиксиран със закон и НЕ се чете от API — 1 EUR = 1.95583 BGN.
 * Затова е константа тук, а не настройка: не е бизнес решение, а
 * нормативно число.
 *
 * Ако цената дойде в лева (при друга настройка на магазина), сметката се
 * обръща, вместо да се показват безсмислици.
 */
export const BGN_PER_EUR = 1.95583;

const eur = new Intl.NumberFormat('bg-BG', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

const bgn = new Intl.NumberFormat('bg-BG', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function toEur(amount: number, currency?: string): number {
  return currency === 'BGN' ? amount / BGN_PER_EUR : amount;
}

export function formatEur(amount: number, currency?: string): string {
  return eur.format(toEur(amount, currency));
}

export function formatBgn(amount: number, currency?: string): string {
  return `${bgn.format(toEur(amount, currency) * BGN_PER_EUR)} лв.`;
}

interface Props {
  /** Money обект от Storefront API-то */
  data?: {amount: string | number; currencyCode?: string} | null;
  /** или директно число */
  amount?: number;
  currency?: string;
  /** размер на основната цена */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: {main: 'text-[0.95rem]', sub: 'text-[0.72rem]'},
  md: {main: 'text-[1.15rem]', sub: 'text-[0.78rem]'},
  lg: {main: 'text-[1.9rem]', sub: 'text-[0.92rem]'},
};

export function PriceDual({data, amount, currency, size = 'md', className = ''}: Props) {
  const raw = Number(data?.amount ?? amount ?? 0);
  const cur = data?.currencyCode ?? currency;
  if (!raw && raw !== 0) return null;

  const s = SIZES[size];

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className={`font-bold tracking-tight text-dark ${s.main}`}>
        {formatEur(raw, cur)}
      </span>
      <span className={`text-gray-500 ${s.sub}`}>{formatBgn(raw, cur)}</span>
    </span>
  );
}

/** Зачертана стара цена, също в двете валути. */
export function PriceDualOld({data, amount, currency}: Props) {
  const raw = Number(data?.amount ?? amount ?? 0);
  const cur = data?.currencyCode ?? currency;
  if (!raw) return null;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 text-[0.85rem] text-gray-400 line-through">
      <span>{formatEur(raw, cur)}</span>
      <span className="text-[0.75rem]">{formatBgn(raw, cur)}</span>
    </span>
  );
}
