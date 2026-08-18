import {useLoaderData, redirect, useFetchers, data as routeData} from 'react-router';
import type {Route} from './+types/cart';
import {getContext} from '~/lib/context';
import type {CartData} from '@cloudcart/nitrogen';
import {CartMain} from '~/components/CartMain';
import {CartSummary} from '~/components/CartSummary';

export const meta: Route.MetaFunction = () => [{title: 'Nitrogen | Cart'}];

export async function loader({context, request}: Route.LoaderArgs) {
  const ctx = await getContext(context, request);
  const cart = await ctx.cart.get();
  return {cart};
}

export async function action({request, context}: Route.ActionArgs) {
  const ctx = await getContext(context, request);
  const fd = await request.formData();
  const act = String(fd.get('action'));
  let cart: CartData;
  let errors: Array<{message: string}> = [];

  try {
    switch (act) {
      case 'ADD_TO_CART': {
        const result = await ctx.cart.addLines([{merchandiseId: String(fd.get('merchandiseId')), quantity: Number(fd.get('quantity') || 1)}]);
        cart = result.cart;
        errors = result.userErrors;
        break;
      }
      // Добавя няколко артикула наведнъж и прилага кода за отстъпка.
      // Отделно действие, защото ADD_TO_CART борави с един merchandiseId,
      // а комплектът трябва да влезе в количката като едно събитие —
      // иначе купувачът вижда как количката се отваря три пъти.
      case 'ADD_BUNDLE': {
        const ids = fd.getAll('merchandiseId').map(String).filter(Boolean);
        const result = await ctx.cart.addLines(
          ids.map((merchandiseId) => ({merchandiseId, quantity: 1})),
        );
        cart = result.cart;
        errors = result.userErrors;

        const code = String(fd.get('discountCode') ?? '').trim();
        if (code && !errors.length) {
          try {
            const withCode = await ctx.cart.updateDiscountCodes([code]);
            cart = withCode.cart ?? cart;
          } catch (error) {
            // Липсващ или изтекъл код не бива да проваля добавянето —
            // артикулите вече са в количката.
            console.error('Кодът за отстъпка не се приложи:', error);
          }
        }
        break;
      }
      case 'UPDATE_CART': {
        const result = await ctx.cart.updateLines([{id: String(fd.get('lineId')), quantity: Number(fd.get('quantity'))}]);
        cart = result.cart;
        errors = result.userErrors;
        break;
      }
      case 'REMOVE_FROM_CART': {
        const result = await ctx.cart.removeLines([String(fd.get('lineId'))]);
        cart = result.cart;
        errors = result.userErrors;
        break;
      }
      default:
        cart = await ctx.cart.get();
    }
  } catch (error) {
    console.error('Cart action error:', error);
    cart = await ctx.cart.get();
    errors = [{message: error instanceof Error ? error.message : 'An error occurred'}];
  }

  const headers = new Headers();
  if (ctx.session.isPending) {
    headers.set('Set-Cookie', await ctx.session.commit());
  }

  if (fd.get('redirectTo')) {
    return redirect(String(fd.get('redirectTo')), {status: 303, headers});
  }

  return routeData({cart, errors}, {headers});
}

export default function CartPage() {
  const {cart} = useLoaderData<typeof loader>();

  const fetchers = useFetchers();
  const cartErrors = fetchers
    .filter((f) => f.formAction === '/cart' && f.data?.errors?.length)
    .flatMap((f) => f.data.errors as Array<{message: string}>);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight mb-5">Cart</h1>
      {cartErrors.length > 0 && <CartErrors errors={cartErrors} />}
      <CartMain cart={cart} layout="page" />
      {cart && cart.totalQuantity > 0 && (
        <CartSummary cart={cart} layout="page" />
      )}
    </div>
  );
}

function CartErrors({errors}: {errors: Array<{message: string}>}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg py-3 px-4 mb-4 text-red-600 text-[0.85rem]">
      {errors.map((error, i) => (
        <p key={i}>{error.message}</p>
      ))}
    </div>
  );
}
