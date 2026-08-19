import {useFetcher} from 'react-router';
import {EnvelopeIcon, CheckCircleIcon} from '@heroicons/react/24/outline';

/**
 * Записване за брошурата.
 *
 * ⚠ Действието още не съхранява адреса — виж app/routes/newsletter.tsx.
 */
export function NewsletterForm() {
  const fetcher = useFetcher<{ok: boolean; message: string}>();
  const busy = fetcher.state !== 'idle';
  const result = fetcher.data;

  if (result?.ok) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-brand/40 bg-brand/10 p-5">
        <CheckCircleIcon className="mt-0.5 size-6 shrink-0 text-brand-bright" />
        <div>
          <p className="text-[0.95rem] font-semibold text-white">{result.message}</p>
          <p className="mt-1 text-[0.8rem] text-gray-400">
            Брошурата излиза всеки месец с актуалните оферти.
          </p>
        </div>
      </div>
    );
  }

  return (
    <fetcher.Form method="post" action="/newsletter" className="w-full">
      <label htmlFor="newsletter-email" className="mb-2 block text-[0.82rem] text-gray-400">
        Остави имейла си и получавай новата брошура първи.
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-gray-500" />
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="твоят@имейл.bg"
            aria-describedby={result && !result.ok ? 'newsletter-error' : undefined}
            className="h-12 w-full rounded-lg border border-hairline bg-ink/80 pl-10 pr-4 text-[0.92rem] text-white placeholder:text-gray-600 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/50"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="h-12 shrink-0 rounded-lg bg-brand px-7 text-[0.92rem] font-bold text-white transition-all hover:bg-brand-dark hover:shadow-[0_8px_22px_-8px_rgba(60,180,74,0.9)] disabled:opacity-60"
        >
          {busy ? 'Записва се…' : 'Запиши ме'}
        </button>
      </div>

      {result && !result.ok ? (
        <p id="newsletter-error" className="mt-2 text-[0.8rem] text-red-400">
          {result.message}
        </p>
      ) : null}

      <p className="mt-2.5 text-[0.72rem] leading-snug text-gray-600">
        Ще ти пишем само за брошурата и промоциите. Отписването е с едно кликане.
      </p>
    </fetcher.Form>
  );
}
