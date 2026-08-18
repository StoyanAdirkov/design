import {Link} from 'react-router';
import {
  ArrowRightIcon,
  CheckBadgeIcon,
  GiftIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

/**
 * Реклама на клубната карта на maxxmart.
 *
 * Всяко твърдение тук е дословно от тяхната страница /page/promocards,
 * не е рекламно съчинение:
 *  · „Картата Ви гарантира 5% отстъпка от цената на стоките при плащане
 *     във всички търговски обекти на maxxmart.“
 *  · „При покупка на стойност 1EUR, получавате 1 точка, която се равнява
 *     на 0.02 EUR натрупани в картата.“
 *  · „Издаването на нова Kлубна карта maxxmart. е безплатно.“
 *
 * Дребният шрифт долу също е от техните условия — 5% не важи върху
 * стоки в промоция, а точките се нулират в края на годината. Премълчаването
 * им прави рекламата подвеждаща.
 *
 * Визуалът е самата им карта, изрязана от банера maxxmart_kotsyfunky.jpg
 * и хоствана локално.
 */
const BENEFITS = [
  {
    icon: CheckBadgeIcon,
    title: '5% отстъпка',
    text: 'от цената на стоките във всичките 26 обекта',
  },
  {
    icon: GiftIcon,
    title: 'Бонус точки',
    text: 'при всяка покупка — 1 € ти носи 1 точка',
  },
  {
    icon: BanknotesIcon,
    title: 'Плащаш с точките',
    text: 'събраните точки се ползват като пари',
  },
];

export function ClubCard({className = ''}: {className?: string}) {
  return (
    <section
      aria-label="Клубна карта maxxmart"
      className={`relative overflow-hidden bg-ink text-white ${className}`}
    >
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-70" />
      {/* две зелени петна, които дават дълбочина зад картата */}
      <div className="promo-breathe pointer-events-none absolute -right-32 top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-brand/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 size-[320px] rounded-full bg-brand/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-16 xl:px-8">
        {/* текстът */}
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-brand-bright">
            Безплатна клубна карта
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Вземи си картата
            <span className="block text-brand-bright">и отстъпките са твои</span>
          </h2>

          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-gray-400">
            Клубната карта на maxxmart ти дава 5% отстъпка във всеки от 26-те
            ни обекта и трупа бонус точки при всяка покупка. Издаването е
            безплатно.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {BENEFITS.map(({icon: Icon, title, text}) => (
              <li
                key={title}
                className="rounded-xl border border-hairline bg-ink-2/60 p-4 backdrop-blur-sm transition-colors hover:border-brand/40"
              >
                <span className="mb-2.5 flex size-9 items-center justify-center rounded-lg bg-brand/12 text-brand-bright ring-1 ring-brand/25">
                  <Icon className="size-5" />
                </span>
                <span className="block text-[0.88rem] font-semibold text-white">
                  {title}
                </span>
                <span className="mt-0.5 block text-[0.78rem] leading-snug text-gray-400">
                  {text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/pages/promocards"
              prefetch="intent"
              className="group flex h-12 items-center gap-2 rounded-lg bg-brand px-6 text-[0.92rem] font-bold text-white transition-all hover:bg-brand-dark hover:shadow-[0_10px_26px_-8px_rgba(60,180,74,1)] hover:no-underline"
            >
              Заяви картата
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/pages/magazini"
              prefetch="intent"
              className="text-[0.85rem] font-semibold text-gray-400 transition-colors hover:text-brand-bright hover:no-underline"
            >
              Намери най-близкия обект →
            </Link>
          </div>

          <p className="mt-6 max-w-lg text-[0.72rem] leading-relaxed text-gray-600">
            Картата се издава на физически лица над 18 години. Отстъпката не
            важи върху стоки в промоция. Неизползваните точки се нулират в
            края на календарната година.
          </p>
        </div>

        {/* картата */}
        <div className="relative">
          {/* Визуалът е снимка на самата карта, изрязана от банера им.
              Ъглите ѝ хващат малко небе и бяло — оставено е нарочно в
              рамка с ring, за да чете като снимка, а не като неуспешно
              изрязване. Чист PNG с прозрачност от техния дизайнер би бил
              по-добър, но такъв няма в магазина. */}
          <div className="club-float club-glint relative overflow-hidden rounded-2xl shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/15">
            <img
              src="/club/club-card.jpg"
              alt="Клубна карта maxxmart"
              width={1150}
              height={780}
              loading="lazy"
              className="w-full rounded-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
