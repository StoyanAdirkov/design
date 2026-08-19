import {useCallback, useEffect, useState} from 'react';
import {STORES, type Store} from './stores';

/**
 * Избраният от клиента обект за взимане.
 *
 * Пази се в localStorage, за да го помни между страници и посещения —
 * човек избира обекта си веднъж, не на всеки продукт. Praktiker и
 * Toolstation правят същото.
 *
 * Чете се СЛЕД монтиране, а не при рендиране: localStorage го няма на
 * сървъра и четенето му при първия рендер би дало разминаване между
 * сървърния и клиентския HTML.
 */
const KEY = 'maxxmart:store';

export function useSelectedStore() {
  const [name, setName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setName(window.localStorage.getItem(KEY));
    } catch {
      // частен режим или блокирано хранилище — просто няма избран обект
    }
    setReady(true);
  }, []);

  const select = useCallback((store: Store | null) => {
    setName(store?.name ?? null);
    try {
      if (store) window.localStorage.setItem(KEY, store.name);
      else window.localStorage.removeItem(KEY);
    } catch {
      // без хранилище изборът важи само за текущата страница
    }
  }, []);

  const store = name ? (STORES.find((s) => s.name === name) ?? null) : null;

  return {store, select, ready};
}
