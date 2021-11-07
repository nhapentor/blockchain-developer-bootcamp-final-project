import React, { useEffect } from 'react'
import { useWeb3React } from "@web3-react/core"
import { injected } from "../components/wallet/connectors"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'

export default () => {

  const t = useTranslations()

  const router = useRouter()

  const { active, account, activate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
      window.localStorage.setItem('connectorIdv2', 'injected')
    } catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (active && account) {
      router.push(`/employees/${account}`)
    }
  }, [active, account])

  return (
    <div>
      <div>Connect wallet to use the platform</div>

      <div>
            {
              !active && <a onClick={() => connect()} className="btn btn-gra btn-sm w-150">{t('Connect Wallet')}</a>
            }
      </div>
    </div>
  )

}

export async function getStaticProps() {

  const messages = require('../lib/i18n/en.json');

  return {
    props: {
      // You can get the messages from anywhere you like, but the recommended
      // pattern is to put them in JSON files separated by language and read 
      // the desired one based on the `locale` received from Next.js. 
      messages
    }
  };
}