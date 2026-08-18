import {createRequestHandler} from 'react-router';
import {createNitrogenContext} from '@cloudcart/nitrogen';

const handler = createRequestHandler(
  // @ts-expect-error — virtual module provided by React Router at build time
  () => import('virtual:react-router/server-build'),
  'production',
);

export default {
  async fetch(request: Request, env: Record<string, any>) {
    // Static assets (build/client) are attached to this Worker and served
    // directly by Cloudflare's edge before this handler runs, so here we only
    // handle SSR. (See the Nova deploy pipeline — assets are uploaded via the
    // Workers-for-Platforms assets-upload-session, not read from KV.)
    const context = await createNitrogenContext({
      request,
      env: {
        SESSION_SECRET: env.SESSION_SECRET ?? 'nitrogen-dev-secret',
        PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
        // When a custom domain is routed to this storefront, the Storefront
        // API is reached directly at the origin so the edge worker never
        // fetches its own domain (which would loop). Set by the platform on
        // "Route to this storefront"; falls back to PUBLIC_STORE_DOMAIN.
        //
        // ⚠ РЕЗЕРВЕН ВАРИАНТ, ДОБАВЕН СЛЕД ТРИ ПАДАНИЯ НА ПРЕВЮТО
        // www.maxxmart.eu периодично влиза в Cloudflare managed challenge.
        // Storefront API-то живее на същия домейн, затова worker-ът получава
        // 403 и ЦЕЛИЯТ сайт става 500 — не отделна страница, а всичко.
        // Проверено при всяко падане: www.maxxmart.eu/api/sf → 403,
        // maxxmart.cloudcart.net/api/sf → 200.
        //
        // Платформеният origin не е зад тази защита и е точно за това
        // предназначен. Ако някой зададе PUBLIC_API_ORIGIN в настройките
        // на storefront-а, неговата стойност печели.
        PUBLIC_API_ORIGIN: env.PUBLIC_API_ORIGIN || 'maxxmart.cloudcart.net',
        PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
        PRIVATE_STOREFRONT_API_TOKEN: env.PRIVATE_STOREFRONT_API_TOKEN,
      },
    });

    const response = await handler(request, context);

    if (context.session.isPending) {
      response.headers.set('Set-Cookie', await context.session.commit());
    }

    return response;
  },
};
