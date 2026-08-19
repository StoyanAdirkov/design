/**
 * Цени в евро.
 *
 * ⚠ ПРАВНА БЕЛЕЖКА, ЗАПИСАНА НАРОЧНО ТУК
 * До края на преходния период българските търговци са длъжни да показват
 * цената и в лева. Живият сайт на maxxmart го прави: „9,83 € / 19,23 лв.“
 * По изрично искане тук показваме само евро. Преди магазинът да приема
 * реални поръчки, двойното изписване трябва да се върне — целият код за
 * него е запазен по-долу (`formatBgn`, `BGN_PER_EUR`), за да е въпрос на
 * връщане на един ред, а не на писане наново.
 *
 * Курсът е фиксиран със закон и НЕ се чете от API — 1 EUR = 1.95583 BGN.
 * Константа е, защото е нормативно число, не бизнес решение.
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

/** Запазено за връщането на двойното изписване. Виж бележката горе. */
export function formatBgn(amount: number, currency?: string): string {
  return `${bgn.format(toEur(amount, currency) * BGN_PER_EUR)} лв.`;
}

interface Props {
  /** Money обект от Storefront API-то */
  data?: {amount: string | number; currencyCode?: string} | null;
  /** или директно число */
  amount?: number;
  currency?: string;
  /** размер на цената */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'text-[0.95rem]',
  md: 'text-[1.15rem]',
  lg: 'text-[1.9rem]',
};

export function PriceDual({data, amount, currency, size = 'md', className = ''}: Props) {
  const raw = Number(data?.amount ?? amount ?? 0);
  const cur = data?.currencyCode ?? currency;
  if (!raw && raw !== 0) return null;

  return (
    <span
      className={`font-bold tracking-tight text-dark ${SIZES[size]} ${className}`}
    >
      {formatEur(raw, cur)}
    </span>
  );
}

/**
 * Голямата цена на продуктовата страница, в бранд зелено.
 */
export function PriceCloudCart({data, amount, currency, className = ''}: Props) {
  const raw = Number(data?.amount ?? amount ?? 0);
  const cur = data?.currencyCode ?? currency;
  if (!raw && raw !== 0) return null;

  return (
    <span
      className={`block text-[1.9rem] font-bold leading-none tracking-tight text-brand-dark md:text-[2.15rem] ${className}`}
    >
      {formatEur(raw, cur)}
    </span>
  );
}

/** Зачертана стара цена. */
export function PriceDualOld({data, amount, currency}: Props) {
  const raw = Number(data?.amount ?? amount ?? 0);
  const cur = data?.currencyCode ?? currency;
  if (!raw) return null;
  return (
    <span className="text-[0.85rem] text-gray-400 line-through">
      {formatEur(raw, cur)}
    </span>
  );
}
