import {Link, useSearchParams} from 'react-router';
import {XMarkIcon} from '@heroicons/react/20/solid';
import type {Project} from '~/lib/projects';

/**
 * Ред с чипове „Пазарувай по проект“.
 *
 * Стои над продуктите, не в лявата колона: това не е поредният филтър, а
 * друг вход към каталога. В колоната отляво човек стеснява това, което
 * вече е намерил; тук избира какво изобщо да търси.
 *
 * Всеки чип е <Link>, а не бутон с JS — така URL-ът се споделя, търсачките
 * го обхождат и „назад“ работи както очакваш.
 */
export function ProjectChips({
  projects,
  active,
  intro,
  className = '',
}: {
  projects: Project[];
  active?: string | null;
  intro?: string | null;
  className?: string;
}) {
  const [searchParams] = useSearchParams();

  const hrefFor = (key: string | null) => {
    const params = new URLSearchParams(searchParams);
    // Смяната на проект връща на първа страница и маха курсорите —
    // иначе се озоваваш на стр. 7 от списък с две страници.
    params.delete('page');
    params.delete('cursor');
    params.delete('direction');
    if (key) params.set('project', key);
    else params.delete('project');
    const qs = params.toString();
    return qs ? `?${qs}` : '?';
  };

  return (
    <section aria-label="Пазарувай по проект" className={className}>
      <div className="mb-2.5 flex items-baseline gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Пазарувай по проект
        </h2>
        <span className="text-[0.72rem] text-gray-400">
          цялото необходимо на едно място
        </span>
      </div>

      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {projects.map((p) => {
          const isActive = p.key === active;
          return (
            <Link
              key={p.key}
              to={hrefFor(isActive ? null : p.key)}
              preventScrollReset
              prefetch="intent"
              aria-pressed={isActive}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.82rem] font-medium transition-all duration-150 hover:no-underline ${
                isActive
                  ? 'border-brand bg-brand text-white shadow-[0_4px_14px_-6px_rgba(60,180,74,0.9)]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand hover:text-brand-dark'
              }`}
            >
              <span aria-hidden="true">{p.emoji}</span>
              <span className="whitespace-nowrap">{p.label}</span>
              {isActive && <XMarkIcon className="size-3.5 shrink-0 opacity-80" />}
            </Link>
          );
        })}
      </div>

      {active && intro && (
        <p className="mt-3 max-w-3xl rounded-lg border border-brand/25 bg-brand/5 px-3.5 py-2.5 text-[0.84rem] leading-relaxed text-gray-700">
          {intro}
        </p>
      )}
    </section>
  );
}
