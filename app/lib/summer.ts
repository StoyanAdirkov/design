/**
 * „Сезонни препоръки“ — ръчно подбрани артикули за лятото.
 *
 * Подборът е от реалния каталог: търсено през Admin API по летни ключови
 * думи (косачка, тример, маркуч, пръскачка, разпръсквач, барбекю, ножица,
 * количка), после филтрирано до активни продукти със снимка И с
 * наличност > 0. Всеки handle е проверен, че отваря /products/<handle>.
 *
 * Филтърът за наличност не е дребна подробност: първият ми подбор беше
 * подреден по преглеждания и излязоха все хитове с количество 0 —
 * каруселът се напълни с „Изчерпан“. В края на лятото доста градинска
 * техника е разпродадена.
 *
 * Подредбата е нарочна — покрива различни летни задачи, за да не е
 * каруселът пет вариации на една и съща косачка:
 * косене → поливане → напояване → барбекю → сянка → пръскане → рязане.
 *
 * Списъкът е сезонен по дефиниция. Наесен се сменя с есенен набор.
 */
export const SUMMER_PICKS: string[] = [
  'kosachka-raider-rd-lm18',
  'markuch-gradinski-12-13mm-25m-royal-herly',
  'izskachasht-turbo-razpraskvach-t-380',
  'prskachka-akumulatorna-16l-12v-8ah-35w-premium',
  'elektricheska-nojica-za-jiv-plet-easycut-42045',
  'benzinov-trimer-18kw-52cc-moller',
  'gradinska-nojica-bs',
  'gradinski-rakavici-s',
  'pribori-za-barbekyu-komplekt-vilitsa-shpatula-shchipka',
  'kolichka-s-shiroko-bandazhno-kolelo-i-60l-kosh-sinya-amts',
];
