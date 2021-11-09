import Link from 'next/link'
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { injected } from "./wallet/connectors"
import { updateEmployeeSignature } from '../lib/api';

const Navbar = ({ employee }) => {

  const t = useTranslations()

  const { active, account, activate, deactivate } = useWeb3React()

  const [isActive, setActive] = useState(active)

  useEffect(() => {
    setActive(active && account)
  }, [active])

  async function connect() {
    try {
      await activate(injected)
      window.localStorage.setItem('connectorIdv2', 'injected')

      console.log(active)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      
      await updateEmployeeSignature(employee.id, '', 0)

      window.localStorage.removeItem('connectorIdv2')

      console.log(active)
    } catch (ex) {
      console.log(ex)
    }
  }


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy">
      <div className="container">
        <a className="navbar-brand" href="#">Employee Engagement</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li> */}
          </ul>
          <div className="d-flex">
            {
              !isActive 
              ? <a onClick={() => connect()} className="btn btn-gra btn-sm w-150">{t('Connect Wallet')}</a>
              : <a onClick={() => disconnect()} className="btn btn-gra btn-sm w-150">{t('Disconnect Wallet')}</a>
            }
          </div>

        </div>
      </div>
    </nav>

  )
}

export default Navbar;