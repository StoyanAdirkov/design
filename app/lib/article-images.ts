// Снимки на статиите от блога, по handle.
//
// ЗАЩО е нужен този файл: Storefront API-то ВРЪЩА обект за снимка, но с
// празен url — `{id, url: '', altText, width: null, height: null}`.
// Тоест статиите имат снимки в админа, но storefront-ът не дава адрес и
// всички карти падаха на иконата-заместител.
//
// Адресите са сглобени от Admin API-то (Article.image дава име на файл,
// напр. „4.jpeg“) по пътя /cdn/img/articles/<stem>/<file>. Всеки от
// 20-те е проверен, че връща 200.
//
// Ползва се платформеният хост, а не www.maxxmart.eu — същата причина
// като при API-то: www периодично влиза в Cloudflare challenge.
//
// Ако CloudCart поправи storefront заявката, този файл става излишен —
// компонентът вече предпочита url-а от API-то, ако е непразен.

export const ARTICLE_IMAGES: Record<string, string> = {
  'koledno-parti-sdrujenie-toplivo':
    'https://maxxmart.cloudcart.net/cdn/img/articles/4/4.jpeg?width=900&height=600',
  'baufest-rofix-i-priyateli-2019':
    'https://maxxmart.cloudcart.net/cdn/img/articles/1/1.jpeg?width=900&height=600',
  'ledeno-studena-nagrada-za-istinskiya-maystor-ot-ceresit-i-maxxmart':
    'https://maxxmart.cloudcart.net/cdn/img/articles/2/2.jpeg?width=900&height=600',
  'goreshti-oferti-za-spokoyni-sanishta':
    'https://maxxmart.cloudcart.net/cdn/img/articles/3/3.jpeg?width=900&height=600',
  'razprodajba-na-globus-flex-fuga':
    'https://maxxmart.cloudcart.net/cdn/img/articles/5/5.jpeg?width=900&height=600',
  'specialni-ceni-na-globus-g4-36-interiorna-boya-za-vlajni-pomeshteniya-1':
    'https://maxxmart.cloudcart.net/cdn/img/articles/7/7.jpeg?width=900&height=600',
  'chestita-baba-marta':
    'https://maxxmart.cloudcart.net/cdn/img/articles/8/8.jpeg?width=900&height=600',
  'plati-1-vzemi-2-bitumen-uplatnitel-globus-g5-33':
    'https://maxxmart.cloudcart.net/cdn/img/articles/9/9.jpeg?width=900&height=600',
  'betonkontakt-ceresit-ct-19-s-10-otstapka-v-maxxmart':
    'https://maxxmart.cloudcart.net/cdn/img/articles/10/10.jpeg?width=900&height=600',
  'nacionalna-kampaniya-valeriy-sim-grup':
    'https://maxxmart.cloudcart.net/cdn/img/articles/11/11.jpeg?width=900&height=600',
  'tonirasht-centar-v-maxxmart':
    'https://maxxmart.cloudcart.net/cdn/img/articles/12/12.jpeg?width=900&height=600',
  'plati-1-kg-vzemi-2-kg-gavkava-fugirashta-smes-globus-g1-77-flex-fuga':
    'https://maxxmart.cloudcart.net/cdn/img/articles/14/14.jpeg?width=900&height=600',
  'denyat-na-globus-v-maxxmart-gorna-banya':
    'https://maxxmart.cloudcart.net/cdn/img/articles/15/15.jpeg?width=900&height=600',
  'grabni-tvoya-moment-s-maxxmart':
    'https://maxxmart.cloudcart.net/cdn/img/articles/16/16.jpeg?width=900&height=600',
  'globus-day-v-maxxmart-gorna-banya':
    'https://maxxmart.cloudcart.net/cdn/img/articles/17/17.jpeg?width=900&height=600',
  'produktovi-prezentacii-v-maxxmart-s-mapei':
    'https://maxxmart.cloudcart.net/cdn/img/articles/18/18.jpeg?width=900&height=600',
  'promociya-pri-pokupka-na-pokrivna-sistema-bramak':
    'https://maxxmart.cloudcart.net/cdn/img/articles/19/19.jpeg?width=900&height=600',
  'produktovi-prezentacii-v-maxxmart-s-mapei-1':
    'https://maxxmart.cloudcart.net/cdn/img/articles/20/20.jpeg?width=900&height=600',
  'globus-day-v-maxxmart-lyulin':
    'https://maxxmart.cloudcart.net/cdn/img/articles/21/21.png?width=900&height=600',
  'denyat-na-globus-v-maxxmart-lyulin':
    'https://maxxmart.cloudcart.net/cdn/img/articles/22/22.jpeg?width=900&height=600',
};
