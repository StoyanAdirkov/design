import {NavLink, Link, Await, Form} from 'react-router';
import {Suspense, useState, useRef, useCallback, useEffect} from 'react';
import type {Shop, Menu, CartData} from '@cloudcart/nitrogen';
import {useAside} from './Aside';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MapPinIcon,
  PhoneIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {CATEGORY_NAV, PROMO_NAV, UTILITY_NAV} from '~/lib/navigation';
import type {NavCategory} from '~/lib/navigation';
import {MegaMenu} from './MegaMenu';
import {CategoryIcon} from './CategoryIcon';

interface HeaderProps {
  shop: Shop;
  menu: Menu | null;
  cart: Promise<CartData | null>;
}

const LOGO_SRC = 'https://www.maxxmart.eu/cdn/img/logo/4/4.svg?v=1777460209';

export function Header({shop, cart}: HeaderProps) {
  const {open} = useAside();
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // малко забавяне при напускане, за да не се затваря панелът,
  // докато мишката пресича процепа между лентата и панела
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenCat(null), 140);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  /**
   * Заключваме страницата, докато мобилното меню е отворено.
   *
   * Без това пръстът скролва каталога зад менюто: менюто стои неподвижно,
   * а съдържанието се движи под него. Изглежда като счупено и се губи
   * мястото, до което човек е стигнал.
   *
   * `position: fixed` върху body, а не само `overflow: hidden` — на iOS
   * Safari второто не спира инерционния скрол. Позицията се пази и се
   * връща при затваряне, иначе страницата отскача най-горе. paddingRight
   * компенсира изчезналия скролбар, за да не подскача съдържанието.
   */
  useEffect(() => {
    if (!mobileOpen) return;
    const {body, documentElement} = document;
    const scrollY = window.scrollY;
    const barWidth = window.innerWidth - documentElement.clientWidth;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    if (barWidth > 0) body.style.paddingRight = `${barWidth}px`;

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [mobileOpen]);

  // Escape затваря мегаменюто
  useEffect(() => {
    if (!openCat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenCat(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openCat]);

  const active = CATEGORY_NAV.find((c) => c.url === openCat) ?? null;

  return (
    <header className="sticky top-0 z-50">
      {/* ── горна помощна лента ──────────────────────────────── */}
      <div className="hidden bg-ink text-gray-400 md:block">
        <div className="flex h-[34px] w-full items-center gap-6 px-5 text-[0.72rem] xl:px-8">
          <span className="flex items-center gap-1.5">
            <MapPinIcon className="size-3.5 text-brand-bright" />
            <Link to="/pages/magazini" className="hover:text-white hover:no-underline">
              Намери магазин — 26 обекта в страната
            </Link>
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <TruckIcon className="size-3.5 text-brand-bright" />
            <Link to="/pages/porachka-i-dostavka" className="hover:text-white hover:no-underline">
              Доставка до 2 работни дни
            </Link>
          </span>
          <nav className="ml-auto flex items-center gap-5">
            {UTILITY_NAV.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className="transition-colors hover:text-white hover:no-underline"
                prefetch="intent"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── основна лента: лого · търсачка · икони ────────────── */}
      <div className="relative bg-ink-2">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-[0.55]" />
        <div className="relative flex h-[68px] w-full items-center gap-4 px-5 md:h-[76px] md:gap-8 xl:px-8">
          {/* мобилен бургер */}
          <button
            type="button"
            className="text-gray-300 transition-colors hover:text-brand-bright lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Затвори менюто' : 'Отвори менюто'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <Bars3Icon className="size-6" /> : <Bars3Icon className="size-6" />}
          </button>

          <Link to="/" className="shrink-0 hover:no-underline" aria-label={shop.name || 'maxxmart'}>
            <img
              src={LOGO_SRC}
              alt={shop.name || 'maxxmart'}
              width={168}
              height={67}
              className="h-9 w-auto rounded-none md:h-11"
            />
          </Link>

          {/* Търсачка.
              Първоначално беше flex-1 и се разтягаше на 1492px — твърде
              дълга. Таванът 1080px я скъсява с около 28%, а mx-auto
              разпределя остатъка поравно отляво и отдясно (по 131px при
              1920px), вместо цялата празнина да зее на едно място до
              телефона. */}
          <Form
            method="get"
            action="/search"
            className="group relative mx-auto hidden w-full max-w-[1080px] items-center md:flex"
            role="search"
          >
            <div className="absolute inset-0 -z-10 rounded-lg bg-brand/0 blur-md transition-all duration-300 group-focus-within:bg-brand/20" />
            <input
              type="search"
              name="q"
              placeholder="Търси сред 6900+ продукта…"
              aria-label="Търсене в магазина"
              className="h-11 w-full rounded-lg border border-hairline bg-ink/80 pl-4 pr-12 text-sm text-white placeholder:text-gray-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/60"
            />
            <button
              type="submit"
              aria-label="Търси"
              className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-md bg-brand text-white transition-colors hover:bg-brand-dark"
            >
              <MagnifyingGlassIcon className="size-4" strokeWidth={2.2} />
            </button>
          </Form>

          {/* телефон — води и на сегашния им сайт, аудиторията звъни */}
          <a
            href="tel:+35928180826"
            className="hidden shrink-0 items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5 hover:no-underline lg:flex"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand-bright ring-1 ring-brand/25">
              <PhoneIcon className="size-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[0.68rem] text-gray-400">Нужна ви е помощ?</span>
              <span className="block text-[0.92rem] font-semibold tracking-tight text-white">
                02 81 80 826
              </span>
            </span>
          </a>

          {/* икони */}
          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-3 lg:gap-2">
            <NavLink
              to="/search"
              className="flex size-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/5 hover:text-brand-bright hover:no-underline md:hidden"
              aria-label="Търсене"
            >
              <MagnifyingGlassIcon className="size-5" />
            </NavLink>

            <NavLink
              to="/account"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-brand-bright hover:no-underline"
              aria-label="Вход в профила"
            >
              <UserIcon className="size-5" />
              <span className="hidden text-xs font-medium leading-tight lg:block">
                Вход
              </span>
            </NavLink>

            <button
              type="button"
              className="relative flex items-center gap-2 rounded-lg px-2 py-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-brand-bright"
              onClick={() => open('cart')}
              aria-label="Отвори количката"
            >
              <span className="relative">
                <ShoppingBagIcon className="size-5" />
                <Suspense>
                  <Await resolve={cart}>
                    {(resolved) =>
                      resolved && resolved.totalQuantity > 0 ? (
                        <span className="absolute -right-2 -top-1.5 flex size-[18px] items-center justify-center rounded-full bg-brand text-[0.6rem] font-bold text-white shadow-[0_0_10px_rgba(60,180,74,0.9)]">
                          {resolved.totalQuantity}
                        </span>
                      ) : null
                    }
                  </Await>
                </Suspense>
              </span>
              <span className="hidden text-xs font-medium leading-tight lg:block">
                Количка
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── категорийна лента с мегаменю ──────────────────────── */}
      <div
        className="relative hidden border-t border-hairline bg-ink edge-glow lg:block"
        onMouseLeave={scheduleClose}
      >
        <div className="flex h-12 w-full items-stretch px-5 xl:px-8">
          <nav className="scrollbar-none flex min-w-0 flex-1 items-stretch justify-between overflow-x-auto" aria-label="Категории">
            {CATEGORY_NAV.map((cat) => (
              <div
                key={cat.url}
                className="flex items-stretch"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenCat(cat.url);
                }}
              >
                <Link
                  to={cat.url}
                  data-open={openCat === cat.url}
                  className="nav-underline relative flex items-center gap-1.5 whitespace-nowrap px-2 text-[0.76rem] font-medium tracking-tight text-gray-300 transition-colors hover:text-white hover:no-underline data-[open=true]:text-white xl:px-2.5 3xl:px-3 3xl:text-[0.8rem]"
                  prefetch="intent"
                  onFocus={() => setOpenCat(cat.url)}
                  aria-haspopup="true"
                  aria-expanded={openCat === cat.url}
                >
                  <CategoryIcon
                    name={cat.icon}
                    className="hidden size-4 shrink-0 text-brand-bright/80 transition-colors 3xl:block"
                  />
                  {cat.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* промо линкове — остават по желание на клиента */}
          <div className="flex shrink-0 items-stretch border-l border-hairline pl-2">
            {PROMO_NAV.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className="flex items-center whitespace-nowrap px-2.5 text-[0.76rem] font-semibold tracking-tight text-brand-bright transition-colors hover:text-white hover:no-underline 3xl:px-3 3xl:text-[0.8rem]"
                prefetch="intent"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* панелът */}
        {active ? (
          <div
            className="absolute inset-x-0 top-full"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <MegaMenu category={active} />
          </div>
        ) : null}
      </div>

      {/* ── мобилно меню ─────────────────────────────────────── */}
      {/* Панелът виси ПОД хедъра, а не В него. Когато стоеше в потока,
          отварянето му правеше sticky хедъра с ~740px по-висок, цялата
          страница се избутваше надолу и браузърът компенсираше скрола.
          Заключването отчиташе вече изместената позиция, затова при
          затваряне страницата се приземяваше стотици пиксели по-надолу.
          `absolute top-full` е същият похват като при MegaMenu — височината
          на хедъра остава непроменена, каквото и да се отваря под него. */}
      {mobileOpen ? (
        <div className="absolute inset-x-0 top-full lg:hidden">
          {/* Затъмнението затваря при докосване встрани. Скрито е от екранния
              четец: бургерът вече носи етикет „Затвори менюто“, а два бутона
              с едно и също име само объркват. С клавиатура се затваря от него
              или от бутона „Затвори“ най-долу в панела. Отместването отгоре
              следва височината на хедъра за съответната ширина. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-x-0 bottom-0 top-[68px] w-full cursor-default border-none bg-black/50 p-0 md:top-[110px]"
          />
          <div className="relative">
            <MobileNav onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MobileNav({onClose}: {onClose: () => void}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    /* Плътен фон, а не „стъкло“: backdrop-filter не се прилага тук, затова
       от оставащите 4% на .glass-panel светлите продуктови карти прозираха
       като призраци точно под текста на менюто. Класът е махнат, а не
       надписан — двата стила са в един слой и редът им не е гарантиран. */
    <div className="max-h-[calc(100vh-68px)] overflow-y-auto border-t border-brand/40 bg-ink-2 lg:hidden">
      <div className="px-6 py-4">
        <Form method="get" action="/search" className="relative mb-4" role="search">
          <input
            type="search"
            name="q"
            placeholder="Търси…"
            aria-label="Търсене"
            className="h-11 w-full rounded-lg border border-hairline bg-ink/80 pl-4 pr-11 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Търси"
            className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-md bg-brand text-white"
          >
            <MagnifyingGlassIcon className="size-4" />
          </button>
        </Form>

        <ul className="divide-y divide-hairline">
          {CATEGORY_NAV.map((cat) => (
            <li key={cat.url}>
              <div className="flex items-center">
                <Link
                  to={cat.url}
                  onClick={onClose}
                  className="flex flex-1 items-center gap-2.5 py-3 text-sm text-gray-200 hover:no-underline"
                >
                  <CategoryIcon name={cat.icon} className="size-4 text-brand-bright" />
                  {cat.title}
                </Link>
                {cat.children?.length ? (
                  <button
                    type="button"
                    className="p-2 text-gray-400"
                    aria-label={`Покажи подкатегории на ${cat.title}`}
                    aria-expanded={expanded === cat.url}
                    onClick={() => setExpanded(expanded === cat.url ? null : cat.url)}
                  >
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${expanded === cat.url ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : null}
              </div>
              {expanded === cat.url ? (
                <ul className="pb-3 pl-7">
                  {cat.children?.map((sub) => (
                    <li key={sub.url}>
                      <Link
                        to={sub.url}
                        onClick={onClose}
                        className="block py-1.5 text-[0.82rem] text-gray-400 hover:text-white hover:no-underline"
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-3 border-t border-hairline pt-4">
          {PROMO_NAV.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              onClick={onClose}
              className="rounded-md border border-brand/40 px-3 py-1.5 text-xs font-semibold text-brand-bright hover:no-underline"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-white/5 py-2 text-xs text-gray-400"
        >
          <XMarkIcon className="size-4" />
          Затвори
        </button>
      </div>
    </div>
  );
}
