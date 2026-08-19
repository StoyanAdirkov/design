import {Link} from 'react-router';

/**
 * „Официален партньор на Бригада Нов дом“.
 *
 * ⚠⚠ ПРОЧЕТИ ПРЕДИ ДА ГО ПУСНЕШ ПРЕД КЛИЕНТ ИЛИ ЖИВО ⚠⚠
 *
 * ТОВА ТВЪРДЕНИЕ НЕ Е ПОТВЪРДЕНО. Проверих на 19 август 2026:
 *   · Facebook на maxxmart (maxxmart.stores, 3,7 хил. последователи) —
 *     нула споменавания на предаването;
 *   · Instagram (house.of.maxxmart, 68 последователи) — нищо;
 *   · публичният уеб и страниците на bTV — никаква връзка между
 *     maxxmart и „Бригада Нов дом“, нито като партньор, нито като
 *     доставчик.
 *
 * Ако партньорството не съществува, надписът е:
 *   · заблуждаваща търговска практика по ЗЗП (чл. 68в и сл., Директива
 *     2005/29/ЕО) — твърдение за одобрение/връзка, каквато няма;
 *   · използване на чужда марка (логото е на bTV Media Group) без
 *     разрешение.
 *
 * Затова целият блок стои зад ключ и е ИЗКЛЮЧЕН. Секцията е готова и
 * се пуска с една дума, но чак след като някой отговори с „да“ на два
 * въпроса:
 *   1. Има ли договор с bTV Media Group?
 *   2. Има ли писмено разрешение за логото на предаването?
 * При „не“ на който и да е от двата — остава изключена.
 *
 * Изображението е монтаж: снимка от склад на maxxmart + логото на
 * предаването от официалната им страница. Направено е за макет, не е
 * рекламен материал на нито една от двете страни.
 */
export const PARTNER_ENABLED = false;

export function PartnerBand({className = ''}: {className?: string}) {
  if (!PARTNER_ENABLED) return null;

  return (
    <section
      aria-labelledby="partner-heading"
      className={`overflow-hidden rounded-2xl border border-gray-200 bg-white ${className}`}
    >
      <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[19rem]">
          <img
            src="/cat/partner.jpg"
            alt="maxxmart и Бригада Нов дом"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-6 md:p-9">
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-brand-dark">
            Партньорство
          </span>

          <h2
            id="partner-heading"
            className="text-xl font-bold leading-tight tracking-tight text-dark md:text-[1.7rem]"
          >
            Официален партньор на „Бригада Нов дом“
          </h2>

          <p className="mt-3 max-w-lg text-[0.9rem] leading-relaxed text-gray-600">
            Материалите, с които Бригадата преобразява домове по bTV, идват от
            нашите складове. Същите марки, същото качество и същата наличност,
            които намираш и в 26-те ни обекта.
          </p>

          <ul className="mt-5 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
            {[
              {n: '13', t: 'истории за сезон'},
              {n: '30+ тона', t: 'вложени материали'},
              {n: '26', t: 'обекта зад тях'},
            ].map((s) => (
              <li key={s.t}>
                <span className="block text-[1.15rem] font-bold leading-none text-dark">
                  {s.n}
                </span>
                <span className="mt-1 block text-[0.76rem] text-gray-500">{s.t}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <Link
              to="/collections/stroitelstvo"
              prefetch="intent"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-all hover:bg-brand-dark hover:no-underline hover:shadow-[0_6px_18px_-6px_rgba(60,180,74,0.85)]"
            >
              Виж материалите
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
