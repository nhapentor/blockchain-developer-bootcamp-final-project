import { useEffect } from "react";
import { NextIntlProvider } from 'next-intl';
import { Web3ReactProvider } from '@web3-react/core'
import MetamaskProvider from "../components/wallet/MetaMaskProvider";
import Web3 from 'web3'
import Head from 'next/head'

import "bootstrap/dist/css/bootstrap.css";
import '../styles/style.css'
import '../styles/style-index.css'
import '../styles/style-team.css'
import '../styles/index.css';

import Layout from '../components/layout'

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);


  return (
    <>
      <div>
        <Head>
          <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet" key="test" />
        </Head>
      </div>
      <NextIntlProvider messages={pageProps.messages}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <MetamaskProvider>
            <Layout employee={pageProps.employee}>
              <Component {...pageProps} />
            </Layout>
          </MetamaskProvider>
        </Web3ReactProvider>
      </NextIntlProvider>
    </>
  )
}

export default MyApp
