import {Link} from 'react-router';
import type {Shop, Menu} from '@cloudcart/nitrogen';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {NewsletterForm} from './NewsletterForm';
import {STORES, STORE_HOURS} from '~/lib/stores';
import {SOCIAL_PROFILE} from '~/lib/social';
import {BGN_PER_EUR} from './PriceDual';

/**
 * Футър в езика на хедъра — тъмна основа, техно-мрежа, зелени акценти.
 *
 * Съдържанието е реално: телефонът и адресът са от страницата им
 * „Контакти“, работното време и броят обекти — от „Магазини“, курсът
 * е нормативният.
 */
function FacebookMark({className = 'size-4'}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function InstagramMark({className = 'size-4'}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32Zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.3-7.02a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0Z" />
    </svg>
  );
}

interface FooterProps {
  shop: Shop;
  menu: Menu | null;
}

const INFO_LINKS = [
  {title: 'Поръчка и доставка', url: '/pages/porachka-i-dostavka'},
  {title: 'Начин на плащане', url: '/pages/nachin-na-plashtane'},
  {title: 'Общи условия', url: '/pages/obshti-usloviya'},
  {title: 'Политика за поверителност', url: '/pages/privacy-policy'},
  {title: 'Бисквитки', url: '/pages/cookie-policy'},
];

const SHOP_LINKS = [
  {title: 'Магазини', url: '/pages/magazini'},
  {title: 'Промо карта', url: '/pages/promocards'},
  {title: 'Брошура', url: '/pages/httpsmaxxmarteupreviewpage71116'},
  {title: 'Оферти и комплекти', url: '/promo'},
  {title: 'Новини', url: '/blogs/novini'},
  {title: 'Кариери', url: '/pages/karieri'},
  {title: 'За нас', url: '/pages/za-nas'},
];

export function Footer({shop}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-gray-400">
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -right-24 top-0 size-[380px] rounded-full bg-brand/10 blur-3xl" />

      {/* лента за брошурата */}
      <div className="relative border-b border-hairline">
        <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-5 py-9 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-12 xl:px-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              Брошурата на maxxmart
            </h2>
            <p className="mt-1.5 max-w-md text-[0.88rem] leading-relaxed text-gray-400">
              Всеки месец нови оферти за строителство, ремонт и градина.
              Получавай я преди да е излязла в обектите.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* колоните */}
      <div className="relative mx-auto grid max-w-[1400px] gap-9 px-5 py-11 sm:grid-cols-2 lg:grid-cols-4 xl:px-8">
        <div>
          <img
            src="https://www.maxxmart.eu/cdn/img/logo/4/4.svg?v=1777460209"
            alt={shop?.name || 'maxxmart'}
            width={150}
            height={60}
            className="mb-4 h-9 w-auto rounded-none"
          />
          <p className="text-[0.85rem] leading-relaxed text-gray-400">
            Строителство, ремонт и градина. {STORES.length} обекта в страната
            и онлайн магазин с над 6900 продукта.
          </p>

          <div className="mt-5 flex gap-2.5">
            <a
              href={SOCIAL_PROFILE.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-lg border border-hairline text-gray-400 transition-colors hover:border-brand/50 hover:text-brand-bright"
            >
              <FacebookMark />
            </a>
            <a
              href={SOCIAL_PROFILE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-lg border border-hairline text-gray-400 transition-colors hover:border-brand/50 hover:text-brand-bright"
            >
              <InstagramMark />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
            Магазинът
          </h3>
          <ul className="space-y-2">
            {SHOP_LINKS.map((l) => (
              <li key={l.url}>
                <Link
                  to={l.url}
                  prefetch="intent"
                  className="text-[0.85rem] text-gray-400 transition-colors hover:text-brand-bright hover:no-underline"
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
            Информация
          </h3>
          <ul className="space-y-2">
            {INFO_LINKS.map((l) => (
              <li key={l.url}>
                <Link
                  to={l.url}
                  prefetch="intent"
                  className="text-[0.85rem] text-gray-400 transition-colors hover:text-brand-bright hover:no-underline"
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white">
            Контакти
          </h3>
          <ul className="space-y-3 text-[0.85rem]">
            <li className="flex gap-2.5">
              <PhoneIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <a href="tel:+35928180826" className="text-white hover:no-underline hover:text-brand-bright">
                02 81 80 826
              </a>
            </li>
            <li className="flex gap-2.5">
              <EnvelopeIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <a href="mailto:orders@maxxmart.eu" className="hover:no-underline hover:text-brand-bright">
                orders@maxxmart.eu
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>гр. София, бул. Арсеналски 77</span>
            </li>
            <li className="flex gap-2.5">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-brand" />
              <span>{STORE_HOURS}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* обещанията */}
      <div className="relative border-t border-hairline">
        <div className="mx-auto flex max-w-[1400px] flex-wrap gap-x-8 gap-y-3 px-5 py-4 text-[0.8rem] xl:px-8">
          <span className="flex items-center gap-2">
            <BuildingStorefrontIcon className="size-4 text-brand" />
            Вземи безплатно от {STORES.length} обекта
          </span>
          <span className="flex items-center gap-2">
            <TruckIcon className="size-4 text-brand" />
            Доставка до 2 работни дни
          </span>
        </div>
      </div>

      {/* долният ред */}
      <div className="relative border-t border-hairline">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-5 text-[0.76rem] text-gray-500 md:flex-row md:items-center md:justify-between xl:px-8">
          <p>
            Всички посочени цени са с включено ДДС. 1 EUR = {BGN_PER_EUR} BGN.
          </p>
          <p>© {year} {shop?.name || 'maxxmart'}. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
}
