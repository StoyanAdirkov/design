import {Link} from 'react-router';

/**
 * Лентата с предимства под hero-то.
 *
 * Всяко обещание тук е проверено по страниците на самия магазин, а не
 * съчинено — точните източници са в USPS по-долу. Ако маркетингът промени
 * условията, текстът тук трябва да се обнови заедно с тях.
 */

interface Usp {
  title: string;
  subtitle: string;
  icon: 'store' | 'truck' | 'card' | 'percent';
  url?: string;
}

const USPS: Usp[] = [
  {
    // /page/porachka-i-dostavka: "Вие може да заявите взимане на поръчаната
    // от Вас стока в удобен за Вас търговски обект на maxxmart."
    // Броят обекти е от /page/magazini.
    icon: 'store',
    title: 'Вземи безплатно от магазин',
    subtitle: '26 обекта в цялата страна',
    url: '/pages/magazini',
  },
  {
    // /page/porachka-i-dostavka: "Доставка с куриер обикновено отнема
    // до 2 дни от момента, в който поръчката Ви е била приета."
    icon: 'truck',
    title: 'Доставка до 2 работни дни',
    subtitle: 'с куриер, до адрес или офис',
    url: '/pages/porachka-i-dostavka',
  },
  {
    // /page/nachin-na-plashtane
    icon: 'card',
    title: 'Плащаш както ти е удобно',
    subtitle: 'карта, наложен платеж или банка',
    url: '/pages/nachin-na-plashtane',
  },
  {
    // /page/promocards: "Картата Ви гарантира 5% отстъпка от цената на
    // стоките при плащане във всички търговски обекти на maxxmart."
    icon: 'percent',
    title: 'Клубна карта −5%',
    subtitle: 'плюс бонус точки при всяка покупка',
    url: '/pages/promocards',
  },
];

const ICONS: Record<Usp['icon'], React.ReactNode> = {
  store: (
    <>
      <path d="M3.5 9.5 5 4.5h14l1.5 5" />
      <path d="M3.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 2 0" />
      <path d="M5 11.5V19a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-7.5" />
      <path d="M10 19.5V14h4v5.5" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v9h-11z" />
      <path d="M13.5 10h3.2l2.8 3v2.5h-6z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
      <path d="M2.5 10h19" />
      <path d="M6 14.5h4" />
    </>
  ),
  percent: (
    <>
      <path d="M6.5 17.5 17.5 6.5" />
      <circle cx="7.5" cy="7.5" r="2.2" />
      <circle cx="16.5" cy="16.5" r="2.2" />
    </>
  ),
};

export function UspBar({className = ''}: {className?: string}) {
  return (
    <section
      aria-label="Защо да пазаруваш от maxxmart"
      className={`border-y border-hairline bg-ink ${className}`}
    >
      <div className="tech-grid relative">
        {/* тънка зелена нишка отгоре, за да върже лентата с хедъра */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

        {/* На телефон беше хоризонтален скрол с карти по 78% ширина: виждаше
            се едно обещание и по едно голо иконче отляво и отдясно, откъснато
            от текста си. Изглеждаше счупено, а и никой не се сещаше да плъзне.
            Сега е решетка — четирите обещания се виждат наведнъж, нищо не е
            отрязано и няма скрито съдържание. */}
        <ul className="grid grid-cols-2 divide-x divide-y divide-hairline md:grid-cols-2 md:divide-y-0 lg:grid-cols-4">
          {USPS.map((usp) => {
            const body = (
              <>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 sm:size-11 text-brand-bright ring-1 ring-brand/25 transition-all duration-200 group-hover:bg-brand/20 group-hover:ring-brand/50">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                    aria-hidden="true"
                  >
                    {ICONS[usp.icon]}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.8rem] font-semibold leading-tight text-white sm:text-[0.9rem]">
                    {usp.title}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] leading-tight text-gray-400 sm:text-[0.78rem]">
                    {usp.subtitle}
                  </span>
                </span>
              </>
            );

            return (
              <li
                key={usp.title}
                className="min-w-0"
              >
                {usp.url ? (
                  <Link
                    to={usp.url}
                    className="group flex h-full items-center gap-2.5 px-3.5 py-3.5 transition-colors hover:bg-white/[0.03] hover:no-underline sm:gap-3.5 sm:px-5 sm:py-4 xl:px-8"
                    prefetch="intent"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex h-full items-center gap-2.5 px-3.5 py-3.5 sm:gap-3.5 sm:px-5 sm:py-4 xl:px-8">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
