import { useState, useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';

import getGsnProvider from '../../lib/getRelayProvider'
import { getTokenContract, getDiscussionContract, getDiscussionBoardContract } from '../../lib/getContracts';

export default () => {

    const [isActive, setActive] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [reward, setReward] = useState(0)
    const [exceedBalance, setExceedBalance] = useState(false) 
    const [approveAmount, setApproveAmount] = useState(0)

    const [availableBalance, setAvailableBalance] = useState(0)

    const [step, setStep] = useState(1)

    const { active, account, library } = useWeb3React()

    useEffect(async () => {
        setActive(active && account)
    }, [active, account])

    useEffect(async () => {

        if (isActive) {

            const gsnWeb3 = await getGsnProvider()
            const tokenContract = await getTokenContract(gsnWeb3)
            
            const balance = await tokenContract.methods.balanceOf(account).call({from: account}) 
            
            setAvailableBalance(library.utils.fromWei(balance))
        }
    }, [isActive])

    const onTitleChanged = async (e) => {
        setTitle(e.target.value)

        console.log(!e.target.value || !description)
    }

    const onDescriptionChanged = async (e) => {
        setDescription(e.target.value)

        console.log(!e.target.value || !title)
    }

    const onRewardChanged = async (e) => {

        const value = e.target.value
        const isExceeded = Number(value) > Number(availableBalance)

        setReward(value)
        setExceedBalance(isExceeded)

        if (!isExceeded) {

            const discussionBoardContract = await getDiscussionBoardContract(library)
            const tokenContract = await getTokenContract(library)

            let allowance = await tokenContract.methods.allowance(account, discussionBoardContract.options.address).call({from: account})
            allowance = library.utils.fromWei(allowance.toString())
             
            const requireApproval = value - allowance

            setApproveAmount(requireApproval > 0 ? value : 0)
        }
    }

    const onApproveAmountClicked = async () => {

        const gsnWeb3 = await getGsnProvider()
        const boardContract = await getDiscussionBoardContract(gsnWeb3)
        const tokenContract = await getTokenContract(gsnWeb3)

        if (approveAmount > 0) {
            await tokenContract.methods.approve(boardContract.options.address, library.utils.toWei((approveAmount).toString())).send({from: account})
            setApproveAmount(0)
        }


    }

    const onSubmitClicked = async () => {

        const gsnWeb3 = await getGsnProvider()        
        const discussionBoardContract = await getDiscussionBoardContract(gsnWeb3)
        await discussionBoardContract.methods.createDiscussion(title, description, library.utils.toWei((reward.toString()))).send({from: account})

        window.location.assign('/')
    }

    const onNextStep = () => {
        setStep(step + 1 )
    }

    const onPreviousStep = () => {
        setStep(step - 1)
    }

    return (
        <>
        <div className="container">
        {active && <>
                    <div className="row justify-content-center">                            
                                <div className="col-6 text-center p-0 mt-3 mb-2">
                                    <div className="card px-0 py-0 mt-3 mb-3">
                                        <div className="card-header">Start a New Discussion</div>

                                        <form id="msform">
                                            <ul id="progressbar">
                                                <li className={step > 0 ? "active": ""} id="comment"><strong>Topic</strong></li>
                                                <li className={step > 1 ? "active": ""} id="money"><strong>Giveaway Reward</strong></li>
                                                <li className={step > 2 ? "active": ""} id="confirm"><strong>Finish</strong></li>
                                            </ul>                                    
                                            <fieldset style={{display: step === 1 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">What do you want to discuss?</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 1 / 3</p>
                                                        </div>
                                                    </div> 
                                                    <div className="mt-4">
                                                        <label className="fieldlabels">Topic:</label> 
                                                        <input type="text" className="form-control" name="name" onChange={onTitleChanged} />
                                                        <label className="fieldlabels">Details:</label> 
                                                        <textarea row="12" className="form-control" onChange={onDescriptionChanged} />
                                                    </div>
                                                </div> 
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" disabled={!title || !description} value="Next" onClick={onNextStep} />
                                                </div>
                                            </fieldset>
                                            <fieldset style={{display: step === 2 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">How much XABER to giveaway?</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 2 / 3</p>
                                                        </div>
                                                    </div> 
                                            <div className="mt-4">
                                                <div>
                                                <label className="fieldlabels">Amount in XABER:</label>
                                                <span className={`float-end${exceedBalance? " text-danger": " text-muted"}`}>{`Available Balance: +${availableBalance}`}</span>
                                                </div>
                                                <input type="number" step="0.1" min="0" max={availableBalance} value={reward} onChange={onRewardChanged} />
                                                <div className={`${!exceedBalance && approveAmount > 0 ? "": " d-none"}`}>
                                                <input type="button" className="btn btn-sm btn-outline-sec w-120 p-1 my-0" value="Approve" onClick={onApproveAmountClicked} />
                                                 <span className="text-muted mx-3">To allow locking your balance for giving away reward</span>
                                                </div>
                                            </div>
                                                </div> 
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" value="Next" onClick={onNextStep} disabled={exceedBalance || reward == 0 || approveAmount > 0} />
                                                    <input type="button" name="previous" className="previous action-button-previous" value="Previous" onClick={onPreviousStep} />
                                                </div>
                                            </fieldset>
                                            <fieldset style={{display: step === 3 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">Confirm</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 3 / 3</p>
                                                        </div>
                                                    </div>
                                                    <div className="row justify-content-center my-2">
                                                        <div className="col-3 text-center">
                                                            <i className="fa fas fa-check" style={{fontSize: "64px", color: "#ad49fb"}}></i>                                                            
                                                        </div>                                                        
                                                    </div>
                                                    <div className="row justify-content-center">
                                                        <div className="col-12 text-center">
                                                            <h5 className="purple-text text-center">Post your discussion!</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" value="Finish" onClick={onSubmitClicked} />
                                                    <input type="button" name="previous" className="previous action-button-previous" value="Previous" onClick={onPreviousStep} />
                                                </div>
                                            </fieldset>
                                        </form>                            
                                    </div>
                                </div>
                            </div>
                    </>

                    
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