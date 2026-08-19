/**
 * Начини на плащане във футъра.
 *
 * ⚠ КАКВО РЕАЛНО ПРИЕМА МАГАЗИНЪТ (проверено на 19 август 2026)
 * `paymentProviders` от Admin API-то: от 38 налични доставчика в
 * maxxmart е АКТИВЕН само един — „Наложен платеж“. Инсталирани, но
 * изключени са „Банков трансфер“ и „Плащане на място в магазин“.
 * Карти, PayPal, ePay — нито едно не е включено.
 *
 * Затова всяка иконка носи `active`. При `SHOW_ONLY_ACTIVE = true`
 * футърът показва само истината и редът се свива до едно квадратче.
 * За демото стоят всички, защото рядът с карти е част от макета — но
 * преди магазинът да тръгне живо някой трябва или да включи
 * доставчиците, или да вдигне ключа. Иконка за плащане, което го няма
 * на каса, е обещание, което се къса точно преди поръчката.
 *
 * ЗАЩО СА РИСУВАНИ, А НЕ СВАЛЕНИ
 * Иконките, които CloudCart дава на /app-icons/payment/, са админски —
 * лилави илюстрации на ръка с банкноти и подобни. Във футър изглеждат
 * като чужд стикер. Тези тук са начертани в един размер, една дебелина
 * и една оптична тежест, за да се четат като комплект.
 *
 * За production картовите марки е добре да се сменят с официалните
 * файлове на схемите — тези са достоверни, но не са лицензираните
 * оригинали.
 */

const SHOW_ONLY_ACTIVE = false;

interface Method {
  key: string;
  label: string;
  /** Включен ли е доставчикът в момента */
  active: boolean;
  icon: React.ReactNode;
}

/** Общ размер на рисунката вътре в плочката. */
const box = 'h-full w-full';

const METHODS: Method[] = [
  {
    key: 'visa',
    label: 'Visa',
    active: false,
    icon: (
      <svg viewBox="0 0 48 16" className={box} role="img" aria-label="Visa">
        <text
          x="24"
          y="13"
          textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="14.5"
          fontWeight="700"
          fontStyle="italic"
          letterSpacing="-0.5"
          fill="#1434CB"
        >
          VISA
        </text>
      </svg>
    ),
  },
  {
    key: 'mastercard',
    label: 'Mastercard',
    active: false,
    icon: (
      <svg viewBox="0 0 48 30" className={box} role="img" aria-label="Mastercard">
        <circle cx="19" cy="15" r="9.4" fill="#EB001B" />
        <circle cx="29" cy="15" r="9.4" fill="#F79E1B" />
        <path
          d="M24 7.9a9.4 9.4 0 0 0 0 14.2 9.4 9.4 0 0 0 0-14.2z"
          fill="#FF5F00"
        />
      </svg>
    ),
  },
  {
    key: 'maestro',
    label: 'Maestro',
    active: false,
    icon: (
      <svg viewBox="0 0 48 30" className={box} role="img" aria-label="Maestro">
        <circle cx="19" cy="15" r="9.4" fill="#0099DF" />
        <circle cx="29" cy="15" r="9.4" fill="#ED0006" />
        <path
          d="M24 7.9a9.4 9.4 0 0 0 0 14.2 9.4 9.4 0 0 0 0-14.2z"
          fill="#6C6BBD"
        />
      </svg>
    ),
  },
  {
    key: 'cod',
    label: 'Наложен платеж',
    active: true,
    icon: (
      <svg
        viewBox="0 0 32 22"
        className={box}
        fill="none"
        stroke="#14181C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Наложен платеж"
      >
        <rect x="2.8" y="3.2" width="26.4" height="15.6" rx="2.4" />
        <circle cx="16" cy="11" r="3.6" />
        <path d="M7 11h.01M25 11h.01" />
      </svg>
    ),
  },
  {
    key: 'bwt',
    label: 'Банков превод',
    active: false,
    icon: (
      <svg
        viewBox="0 0 28 22"
        className={box}
        fill="none"
        stroke="#14181C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Банков превод"
      >
        <path d="M2.6 8.4 14 2.6l11.4 5.8" />
        <path d="M5.4 8.4v8.2M11 8.4v8.2M17 8.4v8.2M22.6 8.4v8.2" />
        <path d="M2.6 19.4h22.8" />
      </svg>
    ),
  },
  {
    key: 'pop',
    label: 'В магазина',
    active: false,
    icon: (
      <svg
        viewBox="0 0 28 22"
        className={box}
        fill="none"
        stroke="#14181C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Плащане в магазина"
      >
        <path d="M3.4 3.4h21.2l-1.5 4.3a3.2 3.2 0 0 1-6.1.2 3.2 3.2 0 0 1-6 0 3.2 3.2 0 0 1-6.1-.2z" />
        <path d="M5.2 10.6v8.4a1 1 0 0 0 1 1h15.6a1 1 0 0 0 1-1v-8.4" />
        <path d="M11.4 20v-5h5.2v5" />
      </svg>
    ),
  },
];

export function PaymentIcons({className = ''}: {className?: string}) {
  const shown = SHOW_ONLY_ACTIVE ? METHODS.filter((m) => m.active) : METHODS;
  if (!shown.length) return null;

  return (
    <div className={className}>
      <span className="mb-2.5 block text-[0.66rem] font-bold uppercase tracking-[0.14em] text-gray-500">
        Начини на плащане
      </span>

      {/* Плочките са с еднакъв размер и общ ритъм; рисунката вътре има
          собствен отстъп, за да не опира в ръба. Логата с различни
          пропорции сядат по височина, а не по ширина — иначе Visa
          изглежда двойно по-голяма от Mastercard. */}
      <ul className="flex list-none flex-wrap gap-2 p-0">
        {shown.map((m) => (
          <li key={m.key}>
            <span
              title={m.label}
              className="flex h-[30px] w-[46px] items-center justify-center rounded-[5px] bg-white px-2 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
            >
              {m.icon}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
