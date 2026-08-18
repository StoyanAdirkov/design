import {Link} from 'react-router';
import {
  BuildingStorefrontIcon,
  TruckIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

/**
 * Блок „Доставка и взимане“ на продуктовата страница.
 *
 * Praktiker слага точно това до бутона — и то с конкретика: назован
 * магазин и срок („вземи от Практикер София Люлин – Днес“). Ние още
 * нямаме наличност по обект, затова обещанието тук е това, което
 * магазинът реално може да гарантира.
 *
 * Всички твърдения са от техните страници:
 *  · /page/porachka-i-dostavka — взимане от обект и доставка до 2 дни
 *  · /page/magazini — 26 обекта
 *  · /contacts — телефон 02 81 80 826
 */
export function DeliveryPromise() {
  return (
    <div className="mt-5 divide-y divide-gray-200 rounded-lg border border-gray-200">
      <div className="flex gap-3 p-4">
        <BuildingStorefrontIcon className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-[0.86rem] font-semibold text-dark">
            Вземи безплатно от магазин
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-gray-500">
            26 обекта в страната.{' '}
            <Link
              to="/pages/magazini"
              className="font-medium text-brand-dark hover:no-underline"
            >
              Виж кой е най-близо
            </Link>
          </p>
        </div>
      </div>

      <div className="flex gap-3 p-4">
        <TruckIcon className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-[0.86rem] font-semibold text-dark">
            Доставка до 2 работни дни
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-gray-500">
            С куриер до адрес. За палетни количества — със собствен транспорт.
          </p>
        </div>
      </div>

      <div className="flex gap-3 p-4">
        <PhoneIcon className="mt-0.5 size-5 shrink-0 text-brand" />
        <div>
          <p className="text-[0.86rem] font-semibold text-dark">
            Поръчай по телефона
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-gray-500">
            <a href="tel:+35928180826" className="font-medium text-brand-dark hover:no-underline">
              02 81 80 826
            </a>
            {' · '}пон–пет 08:30–17:30
          </p>
        </div>
      </div>
    </div>
  );
}
