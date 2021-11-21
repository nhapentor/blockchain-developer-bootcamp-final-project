import React, { useEffect, useState } from 'react'
import { injected } from './connectors'
import { useWeb3React } from '@web3-react/core'
import Error from 'next/error'

function MetamaskProvider({ children }) {
  const { active: networkActive, error: networkError, activate: activateNetwork, chainId: chainId } = useWeb3React()
  const [loaded, setLoaded] = useState(false)
  const [err, setError] = useState("")

  useEffect(async () => {   

    const cId = await injected.getChainId()

    
    if (!injected.supportedChainIds.includes(parseInt(cId))) {
      setError("Unsupported Chain.")
    } else {
      setError("")
    }

    injected
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true)
        const connectorIdv2 = window.localStorage.getItem('connectorIdv2')
        if (isAuthorized && connectorIdv2 && !networkActive && !networkError) {          
          activateNetwork(injected)
        }
      })
      .catch((e) => {
        setLoaded(true)
      })
  }, [activateNetwork, networkActive, networkError, chainId])

  if (err) {
    console.log(err)
    return <Error title={"Unsupported Chain"} />
  } else if (loaded) {    
    return children
  } else return <>Loading</>
}

export default MetamaskProvider