import {WrenchScrewdriverIcon} from '@heroicons/react/24/outline';
import type {UsageFact} from '~/lib/usage';

/**
 * „Как се използва“ — практичните факти, извадени от описанието.
 *
 * Идеята е от bulgarbiotic.bg: там „Прием“ и „Съхранение“ са отделни
 * блокове, а не изречения, заровени в текст. При строителните материали
 * ефектът е още по-голям — човекът на обекта търси точно две неща:
 * колко вода на торба и при каква температура се полага.
 */
export function ProductUsage({facts}: {facts: UsageFact[]}) {
  if (!facts.length) return null;

  return (
    <section
      aria-label="Как се използва"
      className="mt-8 rounded-xl border border-gray-200 bg-gray-50/60 p-5 md:p-6"
    >
      <h2 className="mb-4 flex items-center gap-2 text-[1.05rem] font-bold text-dark">
        <WrenchScrewdriverIcon className="size-5 text-brand" />
        Как се използва
      </h2>

      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="border-l-2 border-brand/30 pl-3">
            <dt className="text-[0.74rem] font-semibold uppercase tracking-wide text-gray-500">
              {fact.label}
            </dt>
            <dd className="mt-0.5 text-[0.88rem] leading-snug text-dark">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
