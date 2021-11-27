import React, { useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core"
import UserProfile from '../../components/userProfile'
import getGsnProvider from '../../lib/getRelayProvider'
import LoadingPage from '../../components/loader'
import ErrorAlert from '../../components/errorAlert'
import { 
    getTokenContract, 
    getBadgesContract,     
    getEmployeesContract} from '../../lib/getContracts'

export default () => {

  const { active, account, library } = useWeb3React()

  const [ badgeList, setBadgeList ] = useState([])

  const [ allowance, setAllowance ] = useState(0)

  const [ balance, setBalance ] = useState(0)

  const [processing, setProcessing] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [errMsg, setErrMsg] = useState("")


  useEffect(async () => {
    if (active && account) {
        await getAllBadges()
        await getTokenData()
        setPageLoading(false)
    }

  }, [active, account])


  const getTokenData = async () => {
      
    const tokenContract = await getTokenContract(library)
    const employeeContract = await getEmployeesContract(library)
    
    const allowanceInWei = await tokenContract.methods.allowance(account, employeeContract.options.address).call({from: account})
    setAllowance(await library.utils.fromWei(allowanceInWei))

    const balanceInWei = await tokenContract.methods.balanceOf(account).call({from: account})
    setBalance(await library.utils.fromWei(balanceInWei))
  }



  const getBadgeMetadata = async (uri) => {

    const res = await fetch(uri)

    const metadata = await res.json()

    return metadata

  }

  const getAllBadges = async () => {   
        
        const employeeContract = await getEmployeesContract(library)
        const badgeContract = await getBadgesContract(library)

        const availableBadges = await employeeContract.methods.getAvailableBadges().call({ from: account })

        setBadgeList([])
    
        availableBadges.map(async (badgeId) => {

            const uri = await badgeContract.methods.uri(badgeId).call({ from: account} )

            const metadata = await getBadgeMetadata(uri);

            const exchangeRateInWei = await employeeContract.methods.getBadgeExchangeRate(badgeId).call({ from: account} )

            const badge = {
                id: metadata.id,
                name: metadata.name,
                imageUrl: metadata.image,
                exchangeRate: library.utils.fromWei(exchangeRateInWei),
                isOwn: Number(await badgeContract.methods.balanceOf(account, badgeId).call({ from: account})) > 0
            }

            setBadgeList( prev => [...prev, badge])
        })

  }

  const onApproveAmountClicked = async (amount) => {

    setErrMsg("")
    setProcessing(true)

    try {
        const gsnWeb3 = await getGsnProvider()
        const tokenContract = await getTokenContract(gsnWeb3)
        const employeeContract = await getEmployeesContract(library)

        await tokenContract.methods.approve(employeeContract.options.address, library.utils.toWei((amount).toString())).send({from: account, gasPrice: '20000000000' })
        await getTokenData()
    } catch (err) {
        setErrMsg(err.message)
    }

    setProcessing(false)
  }

  const onRedeemClicked = async (badgeId) => {

    setErrMsg("")
    setProcessing(true)

    try {
        const gsnWeb3 = await getGsnProvider()
        const employeeContract = await getEmployeesContract(gsnWeb3)
    
        await employeeContract.methods.exchangeBadge(badgeId).send({from: account, gasPrice: '20000000000' })

        window.location.reload(false)
    } catch (err) {
        setErrMsg(err.message)
        setProcessing(false)
    }
  }

  return (    
      <div className="container">
          {active && !pageLoading && <>
              <UserProfile />
              <div className="row justify-content-center mt-3">
                  <div className="col-6 bg-white p-0" style={{ borderRadius: "8px" }} >
                    <ErrorAlert errMsg={errMsg} setErrMsg={setErrMsg} />
                    <div className="card-header">
                        <strong className="card-title">Redeem your XABER</strong>
                        </div>
                      <div className="row">
                          {
                              badgeList.length !== 0 &&
                              <>
                                  {
                                      badgeList.sort((x, y) => x.id > y.id ? 1 : -1).map((b) => {
                                          return (
                                              <div key={`b-${b.id}`} className="col-6 p-3" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", justifyContent: "space-between"}}>
                                                      <div className="text-center" style={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
                                                          <img src={b.imageUrl} style={{ maxWidth: "40%", flexGrow: 1}} />
                                                      </div>
                                                      <div className="card-body" style={{display: "flex", flexDirection: "column", justifyContent: "space-around", flex: "0 0 150px"}}>
                                                          <div>
                                                          <h5 className="card-title float-start text-uppercase">{b.name}</h5>
                                                          <p className={`card-text text-end${balance < Number(b.exchangeRate) ? ' text-danger' : ' text-success'}`} style={{ fontSize: "small", fontWeight: "400"}}>+{b.exchangeRate} XABER</p>
                                                          </div>
                                                          <div>
                                                          {
                                                              !b.isOwn && balance >= Number(b.exchangeRate) && (
                                                                  <>
                                                                      {       
                                                                          <button className="btn btn-sm btn-gra float-end" disabled={balance < Number(b.exchangeRate) || allowance < Number(b.exchangeRate)} onClick={() => onRedeemClicked(b.id)}>Redeem</button>
                                                                      }
                                                                      {
                                                                          allowance < Number(b.exchangeRate) && (<button className="mx-2 btn btn-sm btn-outline-sec float-end" onClick={() => onApproveAmountClicked(b.exchangeRate)}>Approve</button>)
                                                                      }
                                                                  </>)
                                                          }
                                                          {
                                                              b.isOwn &&
                                                              <>                                                                  
                                                                  <p className="text-muted text-end">You already have this one!</p>
                                                              </>
                                                          }
                                                          {
                                                              balance < Number(b.exchangeRate) &&
                                                              <>                                                                  
                                                                  <p className="text-muted text-end">Insufficient XABER!</p>
                                                              </>
                                                          }
                                                          </div>
                                                      </div>
                                              
                                              </div>
                                          )
                                      })
                                  }
                              </>
                          }
                      </div>
                  </div>
              </div>
          </>
          }
        { (processing || pageLoading) && <LoadingPage /> }
      </div>
  )

}


export async function getStaticProps() {

    const messages = require('../../lib/i18n/en.json');
  
    return {
      props: {
        // You can get the messages from anywhere you like, but the recommended
        // pattern is to put them in JSON files separated by language and read 
        // the desired one based on the `locale` received from Next.js. 
        messages
      }
    }
}