import { useState, useEffect} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Typeahead } from 'react-bootstrap-typeahead'
import getGsnProvider from '../../../lib/getRelayProvider'
import { getTokenContract } from '../../../lib/getContracts';
import { getAllEmployees } from '../../../lib/api'
import UserProfile from '../../../components/userProfile'

export default ({ employees }) => {

    const [isActive, setActive] = useState(false)
    const [amount, setAmount] = useState(0)
    const [exceedBalance, setExceedBalance] = useState(false) 
    const [availableBalance, setAvailableBalance] = useState(0)
    const [ colleague, setColleague ] = useState([])


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

    const onAmountChanged = async (e) => {

        const value = e.target.value
        const isExceeded = Number(value) > Number(availableBalance);

        setAmount(value)
        setExceedBalance(isExceeded)

    }

    const onSubmitClicked = async () => {

        const gsnWeb3 = await getGsnProvider()        
        const tokenContract = await getTokenContract(gsnWeb3)
        await tokenContract.methods.transfer(library.utils.toChecksumAddress(colleague[0].account), library.utils.toWei(amount.toString())).send({ from: account })

        window.location.assign(`/employees/${account}`)
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
                    <UserProfile />
                    <div className="row justify-content-center">                            
                                <div className="col-6 text-center p-0 mt-3 mb-2">
                                    <div className="card px-0 py-0 mt-3 mb-3">
                                        <div className="card-header">Send XABER to your colleague</div>

                                        <form id="msform">
                                            <ul id="progressbar">
                                                <li className={step > 0 ? "active": ""} id="personal"><strong>Receiver</strong></li>
                                                <li className={step > 1 ? "active": ""} id="money"><strong>Amount</strong></li>
                                                <li className={step > 2 ? "active": ""} id="confirm"><strong>Comfirmation</strong></li>
                                            </ul>                                    
                                            <fieldset style={{display: step === 1 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">Who are you sending to?</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 1 / 3</p>
                                                        </div>
                                                    </div> 
                                                    <div className="mt-4">
                                                        <Typeahead
                                                            id="input-colleague"
                                                            onChange={setColleague}
                                                            selected={colleague}
                                                            minLength={2}
                                                            labelKey="name"
                                                            options={employees}
                                                            placeholder="Find your colleauge..."
                                                        />
                                                    </div>
                                                </div> 
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" disabled={colleague.length === 0} value="Next" onClick={onNextStep} />
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
                                                <input type="number" step="0.1" min="0" max={availableBalance} value={amount} onChange={onAmountChanged} />
                                            </div>
                                                </div> 
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" value="Next" onClick={onNextStep} disabled={exceedBalance || amount == 0} />
                                                    <input type="button" name="previous" className="previous action-button-previous" value="Previous" onClick={onPreviousStep} />
                                                </div>
                                            </fieldset>
                                            <fieldset style={{display: step === 3 ? "block" : "none"}}>                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">Confirm your transfer</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 3 / 3</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-center my-2"><strong>Transfer to:</strong> {colleague.length ? colleague[0].name: ''}</p>
                                                    <p className="text-center my-2"><strong>Transfer amount:</strong> {`+${amount} XABER`}</p>
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

export async function getServerSideProps({ params }) {

    const employees = await getAllEmployees()

    const messages = require('../../../lib/i18n/en.json');
  
    return {
      props: {
        // You can get the messages from anywhere you like, but the recommended
        // pattern is to put them in JSON files separated by language and read 
        // the desired one based on the `locale` received from Next.js. 
        messages,
        employees: employees.filter(e => e.account !== params.account)
      }
    }
}