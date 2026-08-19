// Категорийна навигация на maxxmart — извлечена от менюто на www.maxxmart.eu.
// Слъговете съвпадат 1:1 с handle-ите на колекциите в Storefront API.
//
// ВАЖНО: живото меню съдържа записи с href="javascript:;" — пунктове без
// реална категория зад тях. Тук са изхвърлени 69 такива възела: рендирането
// им дава мъртви линкове и дублирани React ключове. Ако клиентът иска да се
// появят, първо трябва да им се направят категории в админа.

export interface NavNode {
  title: string;
  url: string;
  children?: NavNode[];
}

export interface NavCategory extends NavNode {
  /** кратък етикет за лентата */
  label: string;
  /** ключ на иконата в CategoryIcon */
  icon: string;
  /**
   * Снимка за панела вдясно в мегаменюто.
   *
   * Само 12 на брой — по една на главна категория. Миниатюри до всяка
   * от 67-те подкатегории биха искали 67 снимки и биха удължили и без
   * това високото меню; панелът вдясно ползва хоризонталното място,
   * което при повечето категории стои празно.
   *
   * Лиценз: Unsplash License, свободна за търговска употреба. Хостват се
   * локално в public/nav/, а не се дърпат от чужд сървър.
   */
  image?: string;
}

export const CATEGORY_NAV: NavCategory[] = [
  {
    title: 'Строителство',
    label: 'Строителство',
    icon: 'building',
    image: '/nav/stroitelstvo.jpg',
    url: '/collections/stroitelstvo',
    children: [
      {
        title: 'Сухи строителни смеси',
        url: '/collections/suhi-stroitelni-smesi',
        children: [
          {title: 'Цимент', url: '/collections/cimenti'},
          {title: 'Гипс', url: '/collections/gipsovi-produkti'},
          {title: 'Бетон', url: '/collections/beton'},
          {title: 'Лепила за плочки и фуги', url: '/collections/za-fayans-i-keramika'},
          {title: 'Лепило-шпакловъчни смеси за топлоизолация', url: '/collections/za-toploizolacii'},
          {title: 'Зидарски разтвори и лепила', url: '/collections/zidarski-raztvori-i-lepila'},
          {title: 'Шпакловки', url: '/collections/shpaklovki'},
          {title: 'Машинни мазилки за вътрешно приложение', url: '/collections/mazilki'},
          {title: 'Замазки', url: '/collections/beton-ciment-raztvori-zamazki'},
          {title: 'Добавки за бетони и разтвори', url: '/collections/dobavki-za-betoni-i-raztvori'},
        ],
      },
      {
        title: 'Топлоизолация',
        url: '/collections/izolacionni-materiali',
        children: [
          {title: 'Експандиран пенополистирол (EPS)', url: '/collections/ekspandiran-penopolistirol-eps'},
          {title: 'Минерални вати', url: '/collections/mineralni-vati'},
          {title: 'Аксесоари за топлоизолация', url: '/collections/aksesoari-za-toploizolacionni-sistemi'},
        ],
      },
      {
        title: 'Хидроизолация',
        url: '/collections/hidroizolacii',
        children: [
          {title: 'Мазана/течна хидроизолация', url: '/collections/techni-i-pastoobrazni-hidroizolacii'},
          {title: 'Хидроизолационни ленти', url: '/collections/hidroizolacionni-mushami-lenti-folia-i-uplatneniya'},
        ],
      },
      {
        title: 'Груб строеж',
        url: '/collections/materiali-za-grub-stroej',
        children: [
          {title: 'Керамични блокове (тухли)', url: '/collections/keramichni-blokove-tuhli'},
          {title: 'Газобетонни блокчета (газобетон)', url: '/collections/gazobetonni-blokcheta-gazobeton'},
          {title: 'Щурцове', url: '/collections/shturcove'},
          {title: 'Коминни тела', url: '/collections/keramichni-kominni-tela'},
          {title: 'Бетонови изделия', url: '/collections/betonovi-izdeliya'},
          {title: 'Метали', url: '/collections/metali'},
        ],
      },
      {
        title: 'Материали за покриви',
        url: '/collections/materiali-za-pokrivi',
        children: [
          {title: 'Керемиди', url: '/collections/keramichni-keremidi'},
          {title: 'Покривни прозорци', url: '/collections/pokrivni-prozorci-kapanduri-i-aksesoari'},
          {title: 'Улуци и водосточни тръби', url: '/collections/oluci-i-vodostoci'},
          {title: 'Изолационни ленти и фолиа', url: '/collections/izolacionni-lenti-i-folia'},
          {title: 'Елементи и аксесоари за покриви', url: '/collections/aksesoari-za-betonovi-keremidi'},
        ],
      },
      {
        title: 'Сухо строителство',
        url: '/collections/elementi-za-suho-stroitelstvo',
        children: [
          {title: 'Плоскости от гипскартон', url: '/collections/ploskosti-ot-gipskarton'},
          {title: 'Профили за гипскартон', url: '/collections/profili-za-gipskarton'},
          {title: 'Монтажни елементи за гипскартон', url: '/collections/lenti-uplatneniya-i-krepeji-za-gipskarton'},
          {title: 'Лепила и Шпакловачни смеси за гипскартон', url: '/collections/lepila-i-shpaklovki-za-gipskarton'},
          {title: 'Окачени тавани', url: '/collections/okacheni-tavani'},
        ],
      },
      {
        title: 'Силикони, пяни и лепила',
        url: '/collections/silikoni-pyani-i-lepila',
        children: [
          {title: 'Силикони и Уплътнители', url: '/collections/uplatniteli'},
          {title: 'Лепила', url: '/collections/montajni-lepila'},
          {title: 'Монтажни пяни', url: '/collections/montajni-pyani'},
        ],
      },
      {
        title: 'Крепежни елементи',
        url: '/collections/krepejni-elementi',
        children: [
          {title: 'Дюбели', url: '/collections/dyubeli'},
          {title: 'Винтове', url: '/collections/vintove'},
          {title: 'Болтове', url: '/collections/boltove'},
          {title: 'Гайки', url: '/collections/gayki'},
          {title: 'Шайби', url: '/collections/shaybi'},
          {title: 'Нитове', url: '/collections/nitove'},
          {title: 'Пирони и гвоздеи', url: '/collections/pironi-i-gvozdei'},
          {title: 'Куки', url: '/collections/kuki'},
          {title: 'Анкери', url: '/collections/ankeri'},
          {title: 'Шпилки', url: '/collections/shpilki'},
          {title: 'Халки', url: '/collections/halki'},
          {title: 'Скоби', url: '/collections/skobi'},
          {title: 'Фиксатори', url: '/collections/fiksatori'},
          {title: 'Комплекти', url: '/collections/drugi-2'},
        ],
      },
    ],
  },
  {
    title: 'Бои, лакове и мазилки',
    label: 'Бои и мазилки',
    icon: 'paint',
    image: '/nav/boi.jpg',
    url: '/collections/boi-lakove-i-mazilki',
    children: [
      {
        title: 'Интериорни бои',
        url: '/collections/interiorni-produkti',
        children: [
          {title: 'За стени и тавани', url: '/collections/vododispersni-boi-za-steni-i-fasadi'},
          {title: 'Оцветители и пигменти за тониране', url: '/collections/ocvetiteli-i-pigmenti-za-tonirane'},
          {title: 'Тебеширени бои', url: '/collections/tebeshireni-boi'},
        ],
      },
      {
        title: 'Фасадни бои и мазилки',
        url: '/collections/fasadni-boi-i-mazilki',
        children: [
          {title: 'Фасадни бои', url: '/collections/fasadni-boi'},
          {title: 'Мазилки', url: '/collections/fasadni-boi-i-mazilki'},
        ],
      },
      {
        title: 'Бои за метал и дърво',
        url: '/collections/boi-za-metal-i-darvo',
        children: [
          {title: 'На алкидна основа', url: '/collections/na-alkidna-osnova'},
          {title: 'На водна основа', url: '/collections/na-vodna-osnova'},
          {title: 'Спрей бои', url: '/collections/spreyove'},
        ],
      },
      {
        title: 'Лакове и импрегнатори',
        url: '/collections/lakove-i-impregnatori',
        children: [
          {title: 'Лакове', url: '/collections/lakove-za-darvo'},
          {title: 'Импрегнатори', url: '/collections/impregnatori'},
          {title: 'Безири и байцове', url: '/collections/beziri-i-baycove'},
          {title: 'Масла', url: '/collections/masla'},
        ],
      },
      {
        title: 'Грундове и разредители',
        url: '/collections/grundove-i-razrediteli',
        children: [
          {title: 'Грундове', url: '/collections/grundove'},
          {title: 'Разредители', url: '/collections/obezmasliteli-razrediteli-i-antifrizi'},
          {title: 'Преобразуватели за ръжда', url: '/collections/preobrazuvateli-za-rajda'},
        ],
      },
      {
        title: 'Специални бои',
        url: '/collections/specialni-boi',
        children: [
          {title: 'Китове и Пасти', url: '/collections/kitove-i-pasti-za-obrabotka'},
        ],
      },
      {
        title: 'Бояджийски инструменти и принадлежности',
        url: '/collections/boyadjiyski-instrumenti-i-prinadlejnosti',
        children: [
          {title: 'Четки', url: '/collections/chetki'},
          {title: 'Валяци', url: '/collections/valyaci'},
          {title: 'Баданарки', url: '/collections/badanarki'},
          {title: 'Ванички и решетки', url: '/collections/vani-teleskopidrajki-i-dr'},
          {title: 'Телескопи и дръжки', url: '/collections/vani-teleskopi-drajki-i-dr'},
          {title: 'Комплекти', url: '/collections/komplekti'},
        ],
      },
    ],
  },
  {
    title: 'Инструменти',
    label: 'Инструменти',
    icon: 'tool',
    image: '/nav/instrumenti.jpg',
    url: '/collections/instrumenti-krepejni-elementi-pomoshtni-sredstva',
    children: [
      {
        title: 'Ръчни инструменти',
        url: '/collections/rachni-instrumenti',
        children: [
          {title: 'Отвертки', url: '/collections/otvertki'},
          {title: 'Чукове', url: '/collections/chukove'},
          {title: 'Клещи', url: '/collections/kleshti-i-styagi'},
          {title: 'Гаечни ключове', url: '/collections/gaechni-klyuchove'},
          {title: 'Режещи инструменти', url: '/collections/rejeshti-instrumenti'},
          {title: 'Такери и Нитачки', url: '/collections/takeri-i-nitachki'},
          {title: 'Измервателни инструменти', url: '/collections/izmervatelni-instrumenti'},
          {title: 'Шлифовъчни инструменти', url: '/collections/pili-chetki-rendeta'},
          {title: 'Тресчотки', url: '/collections/treschotki'},
          {title: 'Инструменти за зидария', url: '/collections/instrumenti-za-zidariya'},
          {title: 'Инструменти за стягане', url: '/collections/instrumenti-za-styagane'},
          {title: 'Лебедки и макари', url: '/collections/lebedki-i-makari'},
          {title: 'Специални инструменти', url: '/collections/instrumenti-za-probivane-i-rezbovane'},
          {title: 'Куфари за инструменти', url: '/collections/kufari-i-prinadlejnosti-za-instrumenti'},
        ],
      },
      {
        title: 'Електро - механични инструменти',
        url: '/collections/elektro-mehanichni-instrumenti',
        children: [
          {title: 'Бормашини', url: '/collections/bormashini'},
          {title: 'Винтоверти', url: '/collections/vintoverti'},
          {title: 'Ъглошлайфи', url: '/collections/agloshlayfi'},
          {title: 'Шлайфмашини', url: '/collections/shlayfmashini'},
          {title: 'Виброшлайфи', url: '/collections/vibroshlayfi'},
          {title: 'Перфоратори', url: '/collections/perforatori'},
          {title: 'Ел. рендета', url: '/collections/el-rendeta'},
          {title: 'Поялници', url: '/collections/poyalnici'},
          {title: 'Горелки', url: '/collections/drugi-mehanichni-instrumenti'},
          {title: 'Циркуляри', url: '/collections/cirkulyari'},
          {title: 'Прободни триони', url: '/collections/probodni-trioni'},
          {title: 'Саблени триони', url: '/collections/sableni-trioni'},
          {title: 'Пистолети за горещ въздух', url: '/collections/pistoleti-za-toplo-lepene'},
          {title: 'Водоструйки и Пароструйки', url: '/collections/vodostruyki'},
          {title: 'Заваръчни апарати', url: '/collections/zavarachni-aparati'},
          {title: 'Миксери', url: '/collections/mikseri'},
          {title: 'Къртачи', url: '/collections/kartachi'},
          {title: 'Фрези', url: '/collections/frezi'},
          {title: 'Пистолети за боядисване', url: '/collections/pistoleti-za-boyadisvane'},
          {title: 'Лазерни ролетки', url: '/collections/lazerni-roletki'},
          {title: 'Прахосмукачки за пепел', url: '/collections/prahosmukachki-za-pepel'},
          {title: 'Други електроинструменти', url: '/collections/mashini-za-obduhvane'},
        ],
      },
      {
        title: 'Консумативи за електроинструменти',
        url: '/collections/aksesoari-za-elektroinstrumenti',
        children: [
          {title: 'Батерии и зарядни', url: '/collections/baterii-i-zaryadni-ustroystva'},
          {title: 'Консумативи за рязане и шлайфане', url: '/collections/aksesoari-za-ryazane-i-shlayfane'},
          {title: 'Консумативи за заваряване и запояване', url: '/collections/aksesoari-za-zavaryavane-i-zapoyavane'},
          {title: 'Свредла', url: '/collections/svredla'},
          {title: 'Бъркалки', url: '/collections/sredstva-za-razbarkvane'},
          {title: 'Други консумативи', url: '/collections/drugi-aksesoari'},
        ],
      },
      {
        title: 'Помощни работни средства',
        url: '/collections/pomoshtni-rabotni-materiali-i-inventar',
        children: [
          {title: 'Тиксо, Ленти и Изолирбанд', url: '/collections/lenti-izolirband-tikso-1'},
          {title: 'Въжета и синджири', url: '/collections/vajeta-i-sindjiri'},
          {title: 'Строителни колички и подвигачи', url: '/collections/stroitelni-kolichki-i-povdigachi'},
          {title: 'Дръжки за инструменти', url: '/collections/drajki-za-instrumenti'},
          {title: 'Стълби', url: '/collections/stalbi'},
          {title: 'Съдове за разтвори', url: '/collections/sadove-za-raztvori'},
          {title: 'Предпазни средства', url: '/collections/pokrivala-predpazno-folio-i-polietilen'},
          {title: 'Пистолети за монтажна пяна и силикони', url: '/collections/pistoleti-za-montajna-pyana-i-silikoni'},
          {title: 'Технически спрейове и смазки', url: '/collections/tehnicheski-spreyove-i-smazki'},
        ],
      },
    ],
  },
  {
    title: 'ВиК',
    label: 'ВиК',
    icon: 'pipe',
    image: '/nav/vik.jpg',
    url: '/collections/ovk-vik',
    children: [
      {
        title: 'Водопровод',
        url: '/collections/vodoprovod',
        children: [
          {title: 'ПВЦ Тръби и фитинги', url: '/collections/pvc-trabi-i-fitingi'},
          {title: 'ППР Тръби и фитинги', url: '/collections/fitingi-i-aksesoari-za-polipropilenov-vodoprovod'},
          {title: 'Кранове, канелки и месингови компоненти', url: '/collections/mesingovi-armaturi'},
          {title: 'Гъвкави връзки', url: '/collections/gavkavi-vrazki'},
          {title: 'Помпи и хидрофори', url: '/collections/pompi-hidrofori-klapani-i-druga-armatura'},
          {title: 'Уплътнители, Ленти и Конци', url: '/collections/uplatnitelni-lenti-konci-kalchishta-i-dr'},
          {title: 'Маншони', url: '/collections/manshoni'},
        ],
      },
      {
        title: 'Вентилация',
        url: '/collections/ventilaciya',
        children: [
          {title: 'Въздуховоди', url: '/collections/elementi-za-vazduhovod'},
          {title: 'Вентилатори и аспиратори', url: '/collections/ventilatori-i-aspiratori-1'},
          {title: 'Ревизии и решетки', url: '/collections/revizii-i-reshetki'},
          {title: 'Аксесоари за вентилация', url: '/collections/aksesoari-i-konsumativi-za-ventilaciya'},
        ],
      },
      {
        title: 'Канализация',
        url: '/collections/kanalizaciya',
        children: [
          {title: 'Системи и елементи за отводняване', url: '/collections/sistemi-i-elementi-za-otvodnyavane'},
          {title: 'Аксесоари за канализация', url: '/collections/aksesoari-za-kanalizaciya'},
        ],
      },
      {
        title: 'Сифони',
        url: '/collections/sifoni',
        children: [
          {title: 'Рогови сифони', url: '/collections/rogovi-sifoni'},
          {title: 'Линейни сифони', url: '/collections/lineyni-sifoni'},
          {title: 'Прави сифони', url: '/collections/pravi-sifoni'},
          {title: 'Сифони за мивка и вана', url: '/collections/sifoni-za-mivka-i-vana'},
          {title: 'Решетки и аксесоари', url: '/collections/reshetki-i-aksesoari'},
        ],
      },
      {
        title: 'Бойлери',
        url: '/collections/ovk-vik',
        children: [
          {title: 'Обемни бойлери', url: '/collections/obemni-boyleri'},
          {title: 'Проточни бойлери', url: '/collections/protochni-boyleri'},
          {title: 'Под и над мивка', url: '/collections/pod-i-nad-mivka'},
        ],
      },
    ],
  },
  {
    title: 'Отопление и ел.уреди',
    label: 'Отопление',
    icon: 'flame',
    image: '/nav/otoplenie.jpg',
    url: '/collections/otoplenie',
    children: [
      {
        title: 'Ел. уреди',
        url: '/collections/el-uredi-za-otoplenie',
        children: [
          {title: 'Конвектори', url: '/collections/konvektori'},
          {title: 'Духалки', url: '/collections/duhalki'},
          {title: 'Калорифери', url: '/collections/kaloriferi'},
          {title: 'Отоплители за баня и лири', url: '/collections/otopliteli-za-banya'},
        ],
      },
      {
        title: 'Газови печки',
        url: '/collections/gaz-za-otoplenie',
      },
      {
        title: 'Аксесоари за отопление',
        url: '/collections/fitingi-i-aksesoari-za-okomplektovka-na-radiatori',
      },
    ],
  },
  {
    title: 'Осветление и ел.материали',
    label: 'Осветление',
    icon: 'bulb',
    image: '/nav/osvetlenie.jpg',
    url: '/collections/elektromateriali-i-osvetlenie',
    children: [
      {
        title: 'Вътрешни осветителни тела',
        url: '/collections/bitovi-osvetitelni-tela-1',
        children: [
          {title: 'Луни', url: '/collections/luni'},
          {title: 'Плафони', url: '/collections/plafoni'},
          {title: 'Полилеи', url: '/collections/polilei'},
          {title: 'Спотове', url: '/collections/spotove'},
          {title: 'Аплици', url: '/collections/aplici-1'},
          {title: 'Пендели и основи', url: '/collections/pendeli-i-osnovi-1'},
          {title: 'Настолни лампи', url: '/collections/nastolni-lampi-1'},
          {title: 'Лампиони', url: '/collections/lampioni'},
          {title: 'Осветление за баня', url: '/collections/osvetlenie-za-banya'},
          {title: 'LED ленти и светещи кабели', url: '/collections/sveteshti-kabeli-i-led-lenti'},
          {title: 'LED Прожектори', url: '/collections/projektori'},
          {title: 'LED панели', url: '/collections/led-paneli'},
        ],
      },
      {
        title: 'Външни осветителни тела',
        url: '/collections/vanshni-i-promishleni-osvetitelni-tela-1',
        children: [
          {title: 'Градинско осветление', url: '/collections/gradinsko-osvetlenie'},
          {title: 'Прожектори', url: '/collections/projektori-1'},
          {title: 'Аварийно осветление', url: '/collections/avariyno-osvetlenie'},
          {title: 'Соларни лампи', url: '/collections/solarni-lampi'},
          {title: 'Фасадни лампи', url: '/collections/fasadni-lampi'},
          {title: 'Работни лампи и фенери', url: '/collections/rabotni-lampi-i-feneri'},
        ],
      },
      {
        title: 'Крушки и пури',
        url: '/collections/iztochnici-na-svetlina',
        children: [
          {title: 'Енергоспестяващи крушки', url: '/collections/energospestyavashti-lampi'},
          {title: 'LED крушки', url: '/collections/led-lampi'},
          {title: 'Винтидж крушки', url: '/collections/dekorativni-osvetitelni-tela'},
          {title: 'Халогенни крушки', url: '/collections/halogenni-lampi'},
          {title: 'Крушки за ел.уреди', url: '/collections/krushki-za-eluredi'},
          {title: 'LED пури', url: '/collections/led-puri'},
          {title: 'Луминисцентни пури', url: '/collections/luminiscentni-osvetitelni-tela'},
        ],
      },
      {
        title: 'Електроматериали',
        url: '/collections/el-izdeliya-za-bita',
        children: [
          {title: 'Разклонители и адаптери', url: '/collections/razkloniteli-i-saediniteli'},
          {title: 'Щепсели и куплунги', url: '/collections/shtepseli-i-kuplungi'},
          {title: 'Ел. Апаратура', url: '/collections/el-aparatura'},
          {title: 'Инсталационни материали', url: '/collections/instalacionni-materiali-1'},
          {title: 'Домашни системи и елементи', url: '/collections/signalni-uredbi-domofoni-zvanci-i-drugi'},
          {title: 'Ключове и Контакти', url: '/collections/klyuchove-i-kontakti'},
          {title: 'Индустриални щепсели и контакти', url: '/collections/industrialni-shtepseli-i-kontakti'},
        ],
      },
      {
        title: 'Батерии и фенери',
        url: '/collections/baterii',
      },
      {
        title: 'Кабелни системи',
        url: '/collections/kabelni-sistemi',
        children: [
          {title: 'Кабели', url: '/collections/kabeli-i-kabelna-aparatura-1'},
          {title: 'Кабелканали', url: '/collections/kabelkanali-i-kabelskari'},
          {title: 'Кабелни накрайници и муфи', url: '/collections/kabelni-nakraynici-i-mufi'},
          {title: 'Удължители и макари', url: '/collections/udaljiteli-i-makari'},
        ],
      },
    ],
  },
  {
    title: 'Баня',
    label: 'Баня',
    icon: 'bath',
    image: '/nav/banya.jpg',
    url: '/collections/banya-i-kuhnya',
    children: [
      {
        title: 'Смесители и Душове',
        url: '/collections/smesiteli',
        children: [
          {title: 'Смесители', url: '/collections/smesiteli-1'},
          {title: 'Душове', url: '/collections/dushove'},
        ],
      },
      {
        title: 'Санитарна керамика',
        url: '/collections/sanitarno-oborudvane',
        children: [
          {title: 'Тоалетни чинии и моноблокове', url: '/collections/toaletni-chinii-i-monoblokove'},
          {title: 'Структури за вграждане', url: '/collections/strukturi-za-vgrajdane'},
          {title: 'Тоалетни казанчета', url: '/collections/toaletni-kazancheta'},
          {title: 'Тоалетни седалки', url: '/collections/toaletni-sedalki'},
          {title: 'Умивалници', url: '/collections/umivalnici'},
          {title: 'Аксесоари', url: '/collections/instalacionni-aksesoari-za-sanitarno-oborudvane'},
        ],
      },
      {
        title: 'Мебели за баня',
        url: '/collections/mebeli-za-banya',
        children: [
          {title: 'Шкафове', url: '/collections/mebeli-pvc'},
          {title: 'Огледала', url: '/collections/ogledala'},
        ],
      },
      {
        title: 'Аксесоари за баня',
        url: '/collections/dopalnitelno-oborudvane-za-bani',
        children: [
          {title: 'Органайзери и Закачалки', url: '/collections/organayzeri-i-zakachalki'},
          {title: 'Етажерки и полици', url: '/collections/raftove-i-zakachalki'},
          {title: 'Четки и поставки за тоалетна хартия', url: '/collections/postavki-chetki-koshcheta'},
          {title: 'Сапунерки, чаши и дозатори', url: '/collections/dozatori-sapunerki-chashi'},
          {title: 'Корнизи и завеси', url: '/collections/kornizi-i-zavesi'},
          {title: 'Постелки', url: '/collections/postelki'},
          {title: 'Ръкохватки', url: '/collections/rakohvatki-i-stoyki'},
          {title: 'Табели', url: '/collections/drugi-1'},
        ],
      },
    ],
  },
  {
    title: 'Подови и стенни покрития',
    label: 'Подови покрития',
    icon: 'floor',
    image: '/nav/podovi.jpg',
    url: '/collections/podovi-pokritiya',
    children: [
      {
        title: 'Плочки и Фриз',
        url: '/collections/plochki-i-friz',
        children: [
          {title: 'Гранитогрес', url: '/collections/granitogres'},
          {title: 'Фаянс', url: '/collections/fayans-1'},
          {title: 'Аксесоари', url: '/collections/fiksatori-za-sanitaren-fayans'},
        ],
      },
      {
        title: 'Подови настилки',
        url: '/collections/podovi-nastilki',
        children: [
          {title: 'Ламинат', url: '/collections/laminat'},
          {title: 'Подложки за ламинат', url: '/collections/aksesoari-za-podovi-pokritiya'},
          {title: 'Подови первази и аксесоари', url: '/collections/podovi-pervazi-i-aksesoari-za-tyah'},
          {title: 'Преходни лайсни', url: '/collections/prehodni-laysni'},
          {title: 'Балатуми', url: '/collections/balatumi'},
          {title: 'Мокет', url: '/collections/moket'},
        ],
      },
      {
        title: 'Стенни облицовки',
        url: '/collections/stenni-oblicovki',
        children: [
          {title: 'Тапети и фототапети', url: '/collections/tapeti-i-fototapeti'},
          {title: 'Ламперия', url: '/collections/lamperiya'},
        ],
      },
      {
        title: 'Таванни плоскости',
        url: '/collections/tavanni-ploskosti',
        children: [
          {title: 'Таванни пана', url: '/collections/tavanni-pana'},
          {title: 'Топлоизолационни пана', url: '/collections/toploizolacionni-pana'},
          {title: 'XPS корнизи', url: '/collections/xps-kornizi'},
        ],
      },
    ],
  },
  {
    title: 'Работно облекло',
    label: 'Работно облекло',
    icon: 'helmet',
    image: '/nav/obleklo.jpg',
    url: '/collections/pomoshtni-rabotni-sredstva',
    children: [
      {
        title: 'Ръкавици',
        url: '/collections/rakavici',
      },
      {
        title: 'Обувки',
        url: '/collections/obuvki',
      },
      {
        title: 'Работни дрехи',
        url: '/collections/rabotno-obleklo',
      },
      {
        title: 'Защитни принадлежности',
        url: '/collections/predpazni-sredstva',
        children: [
          {title: 'Предпазни очила', url: '/collections/rakavici-i-predpazni-sredstva'},
          {title: 'Маски', url: '/collections/maski'},
          {title: 'Каски и шлемове', url: '/collections/kaski-i-shlemove'},
          {title: 'Антифони', url: '/collections/antifoni'},
          {title: 'Дъждобрани', url: '/collections/dajdobrani'},
          {title: 'Колани и наколенки', url: '/collections/kolani'},
        ],
      },
    ],
  },
  {
    title: 'Авто',
    label: 'Авто',
    icon: 'car',
    image: '/nav/avto.jpg',
    url: '/collections/avto',
    children: [
      {
        title: 'Чистачки',
        url: '/collections/chistachki',
        children: [
          {title: 'Плоски и Конвенционални чистачки', url: '/collections/ploski-i-konvencionalni-chistachki'},
          {title: 'Течности за чистачки', url: '/collections/technosti-za-chistachki'},
        ],
      },
      {
        title: 'Масла и добавки',
        url: '/collections/masla-i-dobavki',
        children: [
          {title: 'Моторни масла', url: '/collections/motorni-masla'},
          {title: 'Антифриз', url: '/collections/antifriz'},
          {title: 'Добавки', url: '/collections/dobavki'},
        ],
      },
      {
        title: 'Ел. принадлежности',
        url: '/collections/el-prinadlejnosti',
        children: [
          {title: 'Авто крушки', url: '/collections/avto-krushki'},
          {title: 'Кабели за стартов ток', url: '/collections/kabeli-za-startov-tok'},
        ],
      },
      {
        title: 'Акумулатори и аксесоари',
        url: '/collections/akumulatori-i-aksesoari',
        children: [
          {title: 'Аксесоари за акумулатори', url: '/collections/aksesoari-za-akumulatori'},
        ],
      },
      {
        title: 'Авто интериор',
        url: '/collections/avto-interior',
      },
      {
        title: 'Авто принадлежности',
        url: '/collections/avto-prinadlejnosti',
      },
    ],
  },
  {
    title: 'Градина',
    label: 'Градина',
    icon: 'garden',
    image: '/nav/gradina.jpg',
    url: '/collections/gradina',
    children: [
      {
        title: 'Ръчни инструменти',
        url: '/collections/gradinski-rachni-instrumenti-i-aksesoari',
        children: [
          {title: 'Лопати', url: '/collections/lopati'},
          {title: 'Мотики', url: '/collections/motiki'},
          {title: 'Гребла', url: '/collections/grebla'},
          {title: 'Ръчни пръскачки', url: '/collections/rachni-praskachki'},
          {title: 'Кирки', url: '/collections/sechiva'},
          {title: 'Брадви', url: '/collections/bradvi'},
          {title: 'Сърпове и Косачи', url: '/collections/sarpove'},
          {title: 'Лозарски ножици и триони', url: '/collections/lozarski-nojici'},
          {title: 'Аксесоари и консумативи', url: '/collections/aksesoari-i-konsumativi-za-gradinata'},
        ],
      },
      {
        title: 'Механизирани интрументи',
        url: '/collections/gradinski-mehanizirani-instrumenti-i-aksesoari',
        children: [
          {title: 'Механични триони', url: '/collections/mehanichni-trioni'},
          {title: 'Моторни пръскачки', url: '/collections/motorni-praskachki'},
          {title: 'Мотофрези', url: '/collections/motofrezi'},
          {title: 'Тримери и косачки', url: '/collections/trimeri-i-kosachki'},
          {title: 'Храсторези и механични ножици', url: '/collections/hrastorezi-i-mehanichni-nojici'},
          {title: 'Аксесоари за механизирани инструменти', url: '/collections/aksesoari-za-gradinski-mehanizirani-instrumenti'},
        ],
      },
      {
        title: 'Системи и елементи за напояване',
        url: '/collections/sistemi-i-elementi-za-napoyavane',
        children: [
          {title: 'Градински маркучи', url: '/collections/gradinski-markuchi'},
          {title: 'Лейки и Пулверизатори', url: '/collections/leyki-i-pulverizatori'},
          {title: 'Капково напояване', url: '/collections/sistemi-i-elementi-za-kapkovo-napoyavane'},
          {title: 'Аксесоари', url: '/collections/gradinski-markuchi-i-aksesoari'},
        ],
      },
      {
        title: 'Къмпинг и Барбекю',
        url: '/collections/sredstva-za-kamping-i-otdih-sred-prirodata',
        children: [
          {title: 'Барбекюта и консумативи', url: '/collections/barbekyuta'},
          {title: 'Оборудване за къмпинг', url: '/collections/barbekyuta-i-konsumativi-za-tyah'},
          {title: 'Палатки и спални чували', url: '/collections/palatki'},
        ],
      },
      {
        title: 'Градинарство и декорация',
        url: '/collections/gradinarstvo-i-dekoraciya',
        children: [
          {title: 'Семена и разсади', url: '/collections/semena'},
          {title: 'Торове', url: '/collections/torove'},
          {title: 'тревни смески', url: '/collections/trevni-smeski'},
          {title: 'Борба с вредители', url: '/collections/preparati-za-zashtita-1'},
          {title: 'Декоративни камъчета, фигури и изкуствени цветя', url: '/collections/dekoracii'},
          {title: 'Саксии, кашпи и сандъчета', url: '/collections/saksii-kashpi-sandacheta-cvetarnici-1'},
        ],
      },
      {
        title: 'Градински настилки и елементи за ограждане',
        url: '/collections/gradinski-nastilki-i-sredstva-i-elementi-za-ograjdane',
        children: [
          {title: 'Мрежи', url: '/collections/mreji'},
          {title: 'Парапети и прегради', url: '/collections/parapeti-i-pregradi'},
        ],
      },
      {
        title: 'Градински мебели',
        url: '/collections/gradinski-mebeli',
        children: [
          {title: 'Маси', url: '/collections/masi'},
          {title: 'Столове', url: '/collections/stolove'},
          {title: 'Комплекти', url: '/collections/komplekti-5'},
          {title: 'Люлки', url: '/collections/lyulki'},
          {title: 'Чадъри и шатри', url: '/collections/chadari'},
        ],
      },
      {
        title: 'Оранжерии и парници',
        url: '/collections/drugi-5',
      },
    ],
  },
  {
    title: 'За Дома',
    label: 'За дома',
    icon: 'home',
    image: '/nav/za-doma.jpg',
    url: '/collections/interior-i-obzavejdane',
    children: [
      {
        title: 'Битова химия и Уреди за почистване',
        url: '/collections/bitova-himiya',
        children: [
          {title: 'Измиване и почистване на дома', url: '/collections/preparati-za-pochistvane-na-bani-i-kuhni'},
          {title: 'Средства за почистване', url: '/collections/sredstva-i-uredi-za-pochistvane'},
          {title: 'Уреди за почистване', url: '/collections/chetki-mopove-metli'},
          {title: 'Лична хигиена', url: '/collections/sapuni-gelove-shampoani'},
        ],
      },
      {
        title: 'Текстил',
        url: '/collections/tekstil',
        children: [
          {title: 'Одеяла и спално бельо', url: '/collections/odeala'},
          {title: 'Възглавници', url: '/collections/zavivki-i-vazglavnici'},
          {title: 'Покривки, тишлайфери и мушами', url: '/collections/mushami-i-pokrivki'},
          {title: 'Текстил за баня', url: '/collections/tekstil-za-banya'},
        ],
      },
      {
        title: 'Мебели',
        url: '/collections/mebeli',
        children: [
          {title: 'Столове и табуретки', url: '/collections/stolove-i-taburetki'},
        ],
      },
      {
        title: 'Корнизи, пердета и щори',
        url: '/collections/kornizi',
        children: [
          {title: 'Корнизи', url: '/collections/kornizi-1'},
        ],
      },
      {
        title: 'Кухня',
        url: '/collections/kuhnya',
        children: [
          {title: 'Домакински ел. уреди', url: '/collections/domakinski-el-uredi'},
          {title: 'Кухненски мивки и смесители', url: '/collections/kuhnenski-mivki-i-smesiteli'},
        ],
      },
      {
        title: 'Домашни потреби',
        url: '/collections/domashni-potrebi',
        children: [
          {title: 'Съдове за готвене', url: '/collections/sadove-za-prigotvyane-na-hrana'},
          {title: 'Съдове за сервиране', url: '/collections/sadove-za-servirane'},
          {title: 'Съдове за съхранение', url: '/collections/burkani-i-kutii'},
          {title: 'Прибори за хранене', url: '/collections/pribori'},
          {title: 'Дъски и Ножове за рязане', url: '/collections/nojove-i-daski-za-ryazane'},
          {title: 'Кухненски принадлежности', url: '/collections/prinadlejnosti-za-kuhnya'},
          {title: 'Кошове и Чували за боклук', url: '/collections/paneri-koshove'},
          {title: 'Сушилници и Органайзери', url: '/collections/sushilnici-i-organayzeri'},
          {title: 'Други принадлежности', url: '/collections/drugi-3'},
        ],
      },
      {
        title: 'Килими, пътеки и изтривалки',
        url: '/collections/kilimi-i-pateki',
      },
      {
        title: 'Декорации',
        url: '/collections/materiali-i-elementi-za-dekoracii',
        children: [
          {title: 'Декоративни профили', url: '/collections/dekorativni-profili'},
          {title: 'Самозалепващо фолио', url: '/collections/samozalepvashto-folio-za-dekoraciya-stikeri'},
        ],
      },
    ],
  },
];

/** Промо линкове, които клиентът иска да останат в лентата */
export const PROMO_NAV: NavNode[] = [
  {title: 'Брошура', url: '/pages/httpsmaxxmarteupreviewpage71116'},
  {title: 'Промо Карта', url: '/pages/promocards'},
];

/** Помощни линкове за горната лента */
export const UTILITY_NAV: NavNode[] = [
  {title: 'Магазини', url: '/pages/magazini'},
  {title: 'Новини', url: '/blogs/novini'},
  {title: 'Кариери', url: '/pages/karieri'},
  {title: 'За нас', url: '/pages/za-nas'},
  {title: 'Контакти', url: '/pages/contacts'},
];

/**
 * Пътят от главната категория до дадена, по handle.
 *
 * Storefront API-то връща на продукта САМО най-долната му категория, без
 * родителите ѝ — проверено: Baumit DuoContact дава единствено
 * „za-toploizolacii“. Затова трохите се сглобяват от дървото по-горе,
 * което и без това е извлечено от менюто на живия сайт.
 *
 * Връща празен масив, ако категорията не е в менюто — тогава трохите
 * падат обратно на това, което API-то е дало.
 */
export function findCategoryPath(handle: string): NavNode[] {
  const target = `/collections/${handle}`;

  for (const top of CATEGORY_NAV) {
    if (top.url === target) return [top];

    for (const sub of top.children ?? []) {
      if (sub.url === target) return [top, sub];

      for (const leaf of sub.children ?? []) {
        if (leaf.url === target) return [top, sub, leaf];
      }
    }
  }

  return [];
}
