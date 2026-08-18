import type {ReactNode} from 'react';
import type {Shop, Menu, CartData} from '@cloudcart/nitrogen';
import {Header} from './Header';
import {Footer} from './Footer';

interface PageLayoutProps {
  shop: Shop;
  headerMenu: Menu | null;
  footerMenu: Menu | null;
  cart: Promise<CartData | null>;
  children: ReactNode;
}

export function PageLayout({shop, headerMenu, footerMenu, cart, children}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header shop={shop} menu={headerMenu} cart={cart} />
      <main className="flex-1 w-full px-4 py-6 sm:px-5 md:py-8 xl:px-8">{children}</main>
      <Footer shop={shop} menu={footerMenu} />
    </div>
  );
}
