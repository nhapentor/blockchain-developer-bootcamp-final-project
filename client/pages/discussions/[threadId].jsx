import { useRouter } from 'next/router'
import { useWeb3React } from "@web3-react/core"
import getGsnProvider from '../../lib/getRelayProvider'
import { useEffect, useState } from 'react';
import UserProfile from '../../components/userProfile';

import { 
  getTokenContract, 
  getDiscussionContract,  
  getEmployeesContract } from '../../lib/getContracts'

export default () => {

    const [ replies, setReplies ] = useState(new Array())
    const [ message, setMessage ] = useState('')

    const [ discussion, setDiscussion ] = useState({})

    const router = useRouter()
    const { threadId } = router.query

    const { active, account, library } = useWeb3React()

    useEffect(async () => {
      if (active && account) {
          await getDiscussion(threadId)
      }
    }, [active, account])

    const getDiscussion = async (address) => {

        const tokenContract = await getTokenContract(library)
        const disscussionConstract = await getDiscussionContract(library, address)
        const employeeContract = await getEmployeesContract(library) 

        const ownerAddress = await disscussionConstract.methods.owner().call({ from: account })
        const owner = await employeeContract.methods.employees(ownerAddress).call({ from: account })
    
        const discuss = {
            title: await disscussionConstract.methods.title().call({ from: account }),
            description: await disscussionConstract.methods.description().call({ from: account }),
            owner: owner.name || ownerAddress, 
            ownerAddress,
            reward: library.utils.fromWei(await tokenContract.methods.balanceOf(address).call({ from: account })),
            replyCount: await disscussionConstract.methods.replyCount().call({ from: account }), 
            address,
            isClosed: await disscussionConstract.methods.isClosed().call({ from: account })
        }

        setDiscussion(discuss)


        getAllReplies(address)
    }

    const getAllReplies = async (address) => {

      const disscussionConstract = await getDiscussionContract(library, address)
      const employeeContract = await getEmployeesContract(library) 

      const ownerAddress = await disscussionConstract.methods.owner().call({ from: account })
      const isClosed = await disscussionConstract.methods.isClosed().call({ from: account })
      const approvedReply = await disscussionConstract.methods.approvedReply().call({ from: account })

      const allReplies  = await disscussionConstract.methods.getAllReplies().call({ from: account })
      
      setReplies([])

      allReplies.map(async (r, index) => {

        const replier = await employeeContract.methods.employees(r.replier).call({ from: account })

        const reply = {
          index,
          message: r.message,
          replier: replier.name || r.replier,
          isSelfReply: r.replier === ownerAddress,
          isApproved: isClosed && index == approvedReply
        }

        setReplies(reps => [...reps, reply])

      })

      
    }

    const onSubmit = async () => {

      const gsnWeb3 = await getGsnProvider()

      const discussionContract = await getDiscussionContract(gsnWeb3, threadId)

      await discussionContract.methods.addReply(message).send({from: account})

      window.location.reload(false)

    }

    const onMessageChanged = async (e) => {
      setMessage(e.target.value)
    }

    const onApproveClicked = async (idx) => {

      const gsnWeb3 = await getGsnProvider()

      const discussionContract = await getDiscussionContract(gsnWeb3, threadId)

      await discussionContract.methods.approveReply(idx).send({from: account})

      window.location.reload(false)
      
    }

  return (<>
    <div className="container">
      <UserProfile />
      <div className="row justify-content-center mt-3">
        <div className="col-6 bg-white p-0" style={{ borderRadius: "8px" }} >
          <div className="card">
            <div className="card-header">
              <strong className="card-title">{discussion.title}</strong>
            </div>
            <div className="card-body">
              <p className="card-text mt-2 mb-4">{discussion.description}</p>
              <div>
                <span className="badge bg-light text-dark">{`${discussion.replyCount} replies`}</span>
                <span className="float-end" style={{ fontSize: "12px", fontWeight: "600" }}>{`${discussion.owner}`}</span>
                {discussion.isClosed
                  ? <span className="badge bg-secondary mx-1">closed</span>
                  :
                  <span className="badge bg-success mx-1">{`+${discussion.reward} XBR`}</span>
                }
              </div>
            </div>
          </div>
          {!discussion.isClosed &&
            <div className="card">
              <div className="card-body">
                <hr className="mt-0" />
                <div className="mb-3">
                  <textarea className="form-control" rows="3" value={message} onChange={onMessageChanged} placeholder="Share your thoughs here..."></textarea>
                </div>
                <button className="form-control btn btn-sm btn-gra w-120 float-end" onClick={onSubmit}>Submit</button>
              </div>
            </div>
          }
        </div>
      </div>

      {
        replies.map((r, idx) => {
          return (
            <div key={idx} className="row justify-content-center mt-3">
              <div className="col-6 bg-white p-0" style={{ borderRadius: "8px" }} >
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">{r.message}</p>
                    <div>
                      {!discussion.isClosed && !r.isSelfReply && account === discussion.ownerAddress &&
                        <button className="btn btn-sm btn-outline-sec" onClick={() => onApproveClicked(idx)}>approve</button>
                      }
                      {discussion.isClosed && r.isApproved &&
                        <span className="badge bg-success">approved</span>
                      }
                      <span className="float-end" style={{ fontSize: "12px", fontWeight: "600" }}>{`${r.replier}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  </>
  )
    
    }
    
    export async function getServerSideProps() {
    
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