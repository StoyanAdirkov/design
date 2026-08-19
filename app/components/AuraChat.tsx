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
 * КАКВО ТРЯБВА, ЗА ДА ТРЪГНЕ ТУК
 * Трите стойности отдолу, от админа → Приложения → Aura Chat →
 * Настройки. Щом се попълнят, компонентът повтаря точно това, което
 * прави платформата, и чатът се появява.
 */

/** От apps/aura_chat/settings в админа. Празно = компонентът мълчи. */
export const AURA = {
  loaderUrl: '',
  apiUrl: '',
  siteId: '',
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
    el.src = `${AURA.loaderUrl}${sep}v=1`;
    if (AURA.apiUrl) el.dataset.api = AURA.apiUrl;
    if (AURA.siteId) el.dataset.site = AURA.siteId;
    document.head.appendChild(el);

    // Нарочно НЕ го махаме при unmount: чатът държи разговор и
    // размонтирането при навигация би го затваряло насред изречение.
  }, []);

  return null;
}
