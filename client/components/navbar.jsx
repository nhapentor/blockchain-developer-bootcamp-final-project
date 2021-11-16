import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import { injected } from "./wallet/connectors"
import { updateEmployeeSignature } from '../lib/api';
import { getTokenContract } from '../lib/getContracts';

const Navbar = ({ employee }) => {

  const t = useTranslations()

  const { active, account, library, activate, deactivate } = useWeb3React()

  const [ profile, setProfile ]  = useState({
    tokenName: '',
    tokenAmount: 0,
    account: ''
  })

  const [isActive, setActive] = useState(active)

  useEffect(() => {

    setActive(active && account)
    
  }, [active, account])

  useEffect(async () => {

    if (isActive) {
      const token = await getTokenContract(library)
      const tokenName = await token.methods.name().call({from: account})
      const tokenAmount = await token.methods.balanceOf(account).call({from: account})
  
      setProfile({
        account,
        tokenName,
        tokenAmount: library.utils.fromWei(tokenAmount)
      })
    }

  }, [isActive])

  async function connect() {
    try {
      await activate(injected)
      window.localStorage.setItem('connectorIdv2', 'injected')
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      deactivate()
      window.localStorage.removeItem('connectorIdv2')
      //await updateEmployeeSignature(employee.id, '', 0)
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
              <li className="nav-item">
                <span className="nav-link active">{`${profile.tokenName}: +${profile.tokenAmount}`}</span>
              </li>
              <li className="nav-item dropdown">
                <a 
                className="nav-link dropdown-toggle badge rounded-pill bg-light text-dark" 
                style={{ fontSize: "medium", fontWeight: 600, lineHeight: 1.5}} 
                href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {`${profile.account.slice(0, 5)}...${profile.account.slice(-4)}`}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarScrollingDropdown">
                  {/* <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><hr className="dropdown-divider" /></li> */}
                  
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