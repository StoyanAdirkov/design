import type {Route} from './+types/newsletter';

/**
 * Записване за брошурата.
 *
 * ⚠⚠ В МОМЕНТА НЕ ЗАПИСВА НИКЪДЕ ⚠⚠
 *
 * Storefront API-то на CloudCart НЯМА метод за абонамент — „SUBSCRIBE“
 * там е статус на наличност, не действие. Admin API-то има само
 * subscribersBulkImport, тоест масов внос, който изисква PAT и не бива
 * да се вика от публичен worker.
 *
 * Затова тук адресът се валидира и се връща успех, но НЕ се съхранява.
 * Формата изглежда завършена за превюто; преди магазинът да тръгне,
 * действието трябва да се върже към нещо реално:
 *   · приложението за бюлетин в CloudCart, или
 *   · собствен ендпойнт, който вика Admin API със сървърен токен, или
 *   · външна услуга (Mailchimp, Brevo и подобни).
 *
 * Ако това остане невързано, хората, които се запишат, няма да получат
 * нищо — а са дали съгласие и очакват брошура.
 */
export const NEWSLETTER_WIRED = false;

export async function action({request}: Route.ActionArgs) {
  const fd = await request.formData();
  const email = String(fd.get('email') ?? '').trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return {ok: false, message: 'Провери имейл адреса и опитай пак.'};
  }

  if (!NEWSLETTER_WIRED) {
    console.warn(
      `[БЮЛЕТИН] Записване от ${email} НЕ Е СЪХРАНЕНО — действието още не е вързано. Виж app/routes/newsletter.tsx`,
    );
  }

  return {
    ok: true,
    message: 'Готово! Ще получаваш брошурата на този адрес.',
  };
}
