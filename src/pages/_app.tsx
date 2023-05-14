import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Noto_Sans_TC, Ubuntu } from 'next/font/google';
import localFont from 'next/font/local';
import { Chakra } from '@/components';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { useAuthStore } from '@/store';

const noto_sans_tc = Noto_Sans_TC({
  weight: ['100', '300', '400', '500', '700', '900'],
  preload: false,
  variable: '--font-noto_sans_tc'
});

const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  preload: false,
  variable: '--font-ubuntu'
});

const alkatra = localFont({
  src: [
    {
      path: '../../public/fonts/Alkatra-Regular.ttf',
      weight: '400'
    },
    {
      path: '../../public/fonts/Alkatra-Medium.ttf',
      weight: '500'
    },
    {
      path: '../../public/fonts/Alkatra-SemiBold.ttf',
      weight: '600'
    },
    {
      path: '../../public/fonts/Alkatra-Bold.ttf',
      weight: '700'
    }
  ],
  variable: '--font-alkatra'
});

type AppPropsWithLayout = AppProps & {
  Component: App.NextPageWithLayout;
};

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider session={session}>
      <SWRConfig>
        <main
          className={`${ubuntu.variable} ${noto_sans_tc.variable} ${alkatra.variable} flex min-h-screen flex-col font-sans text-gray-900`}
        >
          <Chakra>{getLayout(<Component {...pageProps} />)}</Chakra>
        </main>
      </SWRConfig>
    </SessionProvider>
  );
}
