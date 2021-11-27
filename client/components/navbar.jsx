import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { injected } from "./wallet/connectors"
import { getEmployeesContract } from '../lib/getContracts';

const Navbar = () => {

  const t = useTranslations()
  const router = useRouter()

  const { active, account, library, activate, deactivate } = useWeb3React()

  const [ profile, setProfile ]  = useState({
    account: '',
    isOnboarded: false
  })

  const [isActive, setActive] = useState(active)

  useEffect(() => {

    setActive(active && account)
    
  }, [active, account])

  useEffect(async () => {

    if (isActive) {

      const employeesContract = await getEmployeesContract(library)
      const employee = await employeesContract.methods.getEmployee(account).call({ from: account })

      const signedMessage = (() => {
        if (window.localStorage.getItem("signedMessage")) {
          return JSON.parse(window.localStorage.getItem("signedMessage"))
        } else {
          return undefined
        }
      })()

      if (signedMessage && signedMessage.signature && signedMessage.timestamp) {
        library.eth.personal.ecRecover(t('Message to be signed', { timestamp: signedMessage.timestamp }), signedMessage.signature)
          .then((acc) => {
            (async () => {
              if (acc !== account.toLowerCase()) {
                router.push("/")
              }
            })()
          })
      }

      setProfile({
        account,
        isOnboarded: Number(employee.id) !== 0
      })
    }

  }, [isActive])

  async function connect() {
    try {
      await activate(injected)
      window.localStorage.setItem('connectorIdv2', 'injected')
      window.localStorage.setItem('signature', JSON.stringify({ message: "zczc", nonce: 123 }))
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      window.localStorage.removeItem('connectorIdv2')
      window.localStorage.removeItem('signedMessage')
      router.push("/")
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy">
      <div className="container">
        <a className="navbar-brand" href="/">Employee-X</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          </ul>
          <div className="d-flex">
            {!isActive && <a onClick={() => connect()} className="btn btn-gra btn-sm w-150">{t('Connect Wallet')}</a> }
            { isActive && 
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a 
                className="nav-link dropdown-toggle badge rounded-pill bg-light text-dark" 
                style={{ fontSize: "medium", fontWeight: 600, lineHeight: 1.5}} 
                href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {`${profile.account.slice(0, 5)}...${profile.account.slice(-4)}`}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarScrollingDropdown">
                  {profile.isOnboarded && 
                    <>
                      <li><a className="dropdown-item" href={`/employees/${account}/transfer`}>Transfer</a></li>
                      <li><a className="dropdown-item" href={`/redemption`}>Redeem Badges</a></li>

                      <li><hr className="dropdown-divider" /></li>
                    </>
                  }
                  <li><a onClick={() => disconnect()} className="dropdown-item">{t('Disconnect Wallet')}</a></li>
                </ul>
              </li>
            </ul>
            }
          </div>
        </div>
      </div>
    </nav>

  )
}

export default Navbar;