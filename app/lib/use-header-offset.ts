import {useEffect} from 'react';

/**
 * Записва височината на залепения хедър в CSS променлива `--mm-header`.
 *
 * ЗАЩО НЕ Е ПРОСТО ЧИСЛО
 * Лявата колона с филтрите също е sticky и трябва да започва точно под
 * хедъра. На desktop той е 159px (лента + търсачка + навигация), но на
 * телефон е друг, а при промяна в хедъра числото щеше да остане да лъже
 * тихо. Затова се мери на живо и се обновява при преоразмеряване.
 *
 * Пише на documentElement, а не в inline стил на компонента: така една и
 * съща стойност се ползва от всичко залепено на страницата.
 */
export function useHeaderOffset() {
  useEffect(() => {
    const read = () => {
      const header = Array.from(document.querySelectorAll('header')).find(
        (el) => getComputedStyle(el).position === 'sticky',
      );
      const h = header?.getBoundingClientRect().height ?? 0;
      document.documentElement.style.setProperty('--mm-header', `${Math.round(h)}px`);
    };

    read();
    window.addEventListener('resize', read);

    // Хедърът може да смени височина и без resize — например когато
    // шрифтът се зареди и редовете се пренаредят.
    const header = Array.from(document.querySelectorAll('header')).find(
      (el) => getComputedStyle(el).position === 'sticky',
    );
    const observer = header ? new ResizeObserver(read) : null;
    if (header && observer) observer.observe(header);

    return () => {
      window.removeEventListener('resize', read);
      observer?.disconnect();
    };
  }, []);
}
