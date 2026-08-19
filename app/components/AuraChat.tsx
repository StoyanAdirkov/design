import {useEffect} from 'react';

/**
 * Aura Chat в headless витрината.
 *
 * СЪСТОЯНИЕ (проверено на 19 август 2026)
 * Приложението ВЕЧЕ Е ИНСТАЛИРАНО и активно в магазина:
 *   application(key: "aura_chat") → isInstalled: true, isActive: true
 * Тоест няма какво да се инсталира — има какво да се закачи.
 *
 * ЗАЩО НЕ ИЗЛИЗА САМО
 * CloudCart приложенията се закачат от класическата тема: тя изписва
 * `window.CCAppsConfig.aura_chat` и зарежда
 * assets.cloudcart.com/site/js/apps/aura_chat.min.js, който после слага
 * истинския loader с data-api и data-site. Nitrogen рисува собствен
 * HTML и през него не минава нищо от този конвейер — затова нито едно
 * CloudCart приложение не се появява само в headless витрина.
 *
 * ⚠ И на класическия им сайт го няма: в изходния код на
 * www.maxxmart.eu няма нито един ред „aura“. Приложението е включено,
 * но настройките му явно не са довършени — затова и там мълчи.
 *
 * КАК Е ЗАКАЧЕН ТУК
 * Компонентът прави ръчно това, което класическата тема прави сама:
 * слага loader-а в <head> с data-api и data-site. Стойностите отдолу са
 * същите, с които работи и техният магазин.
 */

/**
 * Конфигурацията, с която работи и класическият им магазин.
 *
 * Не я въведох на ръка и не я гадах: прочетох я от `window.CCAppsConfig`
 * на www.maxxmart.eu. Оказа се, че там я има — първата ми проверка беше
 * само по изходния HTML на началната страница, а обектът се сглобява от
 * JS, затова излезе празна. Урок: за скриптови приложения се гледа
 * изпълненият DOM, не сорсът.
 *
 * Стойностите са същите, които платформата подава на своя loader —
 * `data-api` и `data-site` в мрежата съвпадат едно към едно.
 */
export const AURA = {
  loaderUrl: 'https://aurachatwidget.cloudcart.com/loader.js',
  apiUrl: 'https://chat.cloudcart.com',
  siteId: '13688',
  /** Кеш-ключ; при промяна в приложението се вдига от админа. */
  version: '1787148922',
};

export function AuraChat() {
  useEffect(() => {
    if (!AURA.loaderUrl || typeof document === 'undefined') return;

    // Ако вече е зареден (навигация между страници), не го слагаме пак —
    // React Router не презарежда документа и скриптът щеше да се трупа.
    const existing = document.querySelector('script[data-aura-chat]');
    if (existing) return;

    const el = document.createElement('script');
    el.defer = true;
    el.dataset.auraChat = 'true';
    const sep = AURA.loaderUrl.includes('?') ? '&' : '?';
    el.src = `${AURA.loaderUrl}${sep}v=${AURA.version}`;
    if (AURA.apiUrl) el.dataset.api = AURA.apiUrl;
    if (AURA.siteId) el.dataset.site = AURA.siteId;
    document.head.appendChild(el);

    // Нарочно НЕ го махаме при unmount: чатът държи разговор и
    // размонтирането при навигация би го затваряло насред изречение.
  }, []);

  return null;
}
