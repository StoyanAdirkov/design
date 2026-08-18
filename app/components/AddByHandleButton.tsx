import {useFetcher} from 'react-router';
import {useEffect, type ReactNode} from 'react';
import {useAside} from './Aside';

/**
 * „Купи“ за карти, които не знаят варианта на продукта.
 *
 * Списъчните заявки на CloudCart връщат само осем полета — без варианти,
 * тегло и колекции. Затова картите в каруселите не могат да сглобят
 * merchandiseId и допреди това показваха „Избери“.
 *
 * Тук пращаме handle-а, а сървърът разрешава варианта. Продукт с няколко
 * разновидности се препраща към страницата си, вместо да се гадае.
 */
export function AddByHandleButton({
  handle,
  children = 'Купи',
  className,
  disabled,
}: {
  handle: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const fetcher = useFetcher();
  const {open} = useAside();
  const isAdding = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) open('cart');
  }, [fetcher.state, fetcher.data, open]);

  return (
    <fetcher.Form method="post" action="/cart">
      <input type="hidden" name="action" value="ADD_BY_HANDLE" />
      <input type="hidden" name="handle" value={handle} />
      <input type="hidden" name="quantity" value="1" />
      <button type="submit" className={className} disabled={disabled || isAdding}>
        {isAdding ? 'Добавя се…' : children}
      </button>
    </fetcher.Form>
  );
}
