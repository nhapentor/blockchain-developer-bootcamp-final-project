import React, { useEffect, useState } from 'react'
import Link from "next/link"
import { useWeb3React } from "@web3-react/core"
import { 
    getTokenContract, 
    getDiscussionBoardContract, 
    getDiscussionContract,  
    getEmployeesContract } from '../../lib/getContracts'

export default () => {


  const { active, account, library } = useWeb3React()

  const [ discussionList, setDiscussionList ] = useState([])

  useEffect(async () => {
    if (active && account) {
        await getAllDiscussions()
    }
  }, [active, account])


  const getAllDiscussions = async () => {
    
        const tokenContract = await getTokenContract(library)
        const discussionBoardContract = await getDiscussionBoardContract(library)
        const allDiscussions = await discussionBoardContract.methods.getAllDiscussions().call({ from: account })

        setDiscussionList([])
    
        allDiscussions.map(async (address, index) => {

            const disscussionConstract = await getDiscussionContract(library, address)
            const employeeContract = await getEmployeesContract(library) 

            const ownerAddress = await disscussionConstract.methods.owner().call({ from: account })
            const employee = await employeeContract.methods.employees(ownerAddress).call({ from: account })

            const discusstion = {
                index,
                title: await disscussionConstract.methods.title().call({ from: account }),
                description: await disscussionConstract.methods.description().call({ from: account }),
                owner: employee.name || ownerAddress, 
                reward: library.utils.fromWei(await tokenContract.methods.balanceOf(address).call({ from: account })),
                replyCount: await disscussionConstract.methods.replyCount().call({ from: account }), 
                address,
                isClosed: await disscussionConstract.methods.isClosed().call({ from: account })
            }

            setDiscussionList( prev => [...prev, discusstion])
        })

  }

  return (    
      <div className="container">
          {active &&
              <div className="row justify-content-center mt-3">
                  <div className="col-6 bg-white p-0" style={{ borderRadius: "8px" }} >
                      <div className="card">
                          <div className="card-header">
                              <strong>Discussions</strong>
                              <Link href={`/discussions/new`}>
                                  <a className="btn btn-gra btn-sm w-120 float-end">New</a>
                              </Link>
                          </div>
                          {
                              discussionList.length !== 0 ?
                              discussionList.slice(0).reverse().map((d) => {

                                      return (
                                          <div key={`thread-${d.index}`} className="card-body" style={{borderBottom: `${d.index === 0 ? "0": "1px"} solid #ccc`}}>
                                              <Link href={`/discussions/${d.address}`}>
                                                  <a className="card-title">{d.title}</a>
                                              </Link>
                                              <p className="card-text mt-2 mb-4">{d.description}</p>
                                              <div>
                                                  <span className="badge bg-light text-dark">{`${d.replyCount} replies`}</span>
                                                  <span className="float-end" style={{ fontSize: "12px", fontWeight: "600" }}>{`${d.owner}`}</span>
                                                  { d.isClosed
                                                      ? <span className="badge bg-secondary mx-1">closed</span>
                                                      : <span className="badge bg-success mx-1">{`+${d.reward} XBR`}</span>
                                                  }
                                              </div>
                                          </div>
                                        )
                                      })
                                  :
                                  <>
                                      <div className="card-body">
                                          <p>No discussions....</p>
                                      </div>
                                  </>
                          }
                      </div>
                  </div>
              </div>
          }
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