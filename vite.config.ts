import {defineConfig, loadEnv} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import {nitrogen} from '@cloudcart/nitrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({mode}) => {
  // '.' вместо process.cwd(): проектът няма @types/node и `process`
  // не е типизиран, а loadEnv и без това резолва пътя спрямо cwd.
  const env = loadEnv(mode, '.', '');

  /**
   * Липсваща замяна в Nitrogen Vite плъгина.
   *
   * Плъгинът копира всички .env променливи в process.env, но после
   * СТАТИЧНО заменя в бъндъла само пет ключа: SESSION_SECRET,
   * PUBLIC_STORE_DOMAIN, PUBLIC_STOREFRONT_API_TOKEN,
   * PRIVATE_STOREFRONT_API_TOKEN и NODE_TLS_REJECT_UNAUTHORIZED.
   *
   * PUBLIC_API_ORIGIN не е сред тях, затова `process.env.PUBLIC_API_ORIGIN`
   * вътре в getContext остава незаменено, връща undefined и клиентът пада
   * обратно на PUBLIC_STORE_DOMAIN. В production няма такъв проблем —
   * server.ts подава променливата от Worker env.
   *
   * Резултатът за нас: dev не може да заобиколи Cloudflare защитата на
   * www.maxxmart.eu, защото упорито вика точно нея. Затова добавяме
   * замяната ръчно. Дефинира се само когато има стойност — празен низ
   * не е nullish и би счупил `??` веригата надолу.
   */
  const apiOriginDefine = env.PUBLIC_API_ORIGIN
    ? {'process.env.PUBLIC_API_ORIGIN': JSON.stringify(env.PUBLIC_API_ORIGIN)}
    : {};

  return {
    define: apiOriginDefine,
    plugins: [tailwindcss(), nitrogen(), reactRouter(), tsconfigPaths()],
  };
});
