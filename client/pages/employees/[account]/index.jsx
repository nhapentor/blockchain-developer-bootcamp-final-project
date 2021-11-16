
import { getEmployeeByAccount, createEmployee, updateEmployee, updateEmployeeSignature, uploadMedia } from '../../../lib/api'
import { useTranslations } from 'next-intl'
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getRankByPoints, getNextRankByPoints } from '../../../lib/ranks'
import getContract from '../../../lib/getContract'
import contractDefinition from '../../../../build/contracts/XABER.json'
import employeesContractDefinition from '../../../../build/contracts/Employees.json'
import getGsnProvider from '../../../lib/getRelayProvider'

const EmployeePage = ({ employee }) => {

    const [amount, setAmount] = useState(0.0)
    const [receiver, setReceiver] = useState("")

    const [isAuthenticated, setAuthenticated] = useState(false)

    const [progess, setProgress] = useState("1%")

    const [user, setUser] = useState(employee)

    const t = useTranslations()

    const router = useRouter()

    const [onboardStep, setOnboardStep] = useState(1)

    const { active, account, library } = useWeb3React()

    const [avatarImage, setAvatarImage] = useState()
    const [avatarImageSrc, setAvatarImageSrc] = useState('')

    const [warnEmail, setWarnEmail] = useState(false)

    useEffect(() => {
        if (!active) {
            router.push(`/`)
        } else {
            authenticate()
        }

    }, [active])

    const authenticate = () => {        
        if (employee && employee.account && employee.signature && employee.timestamp) {                    
            library.eth.personal.ecRecover(t('Message to be signed', { timestamp: employee.timestamp }), employee.signature)
            .then((acc) => {
                setAuthenticated(acc === employee.account.toLowerCase())
                getPoints()
            })                       
        } 
    }

    const handleSignMessage = () => {

        const now = Date.now()

        library.eth.personal.sign(
          t('Message to be signed', { timestamp: now }), account,
          (err, signature) => {
            if (!err) {
                (async() => { 
                    await updateEmployeeSignature(employee.id, signature, now)                    
                    employee = { ...employee, signature, timestamp: now }
                    authenticate()
                })()                
            } else {
                console.log(err)
            }
          }
        )
  
    };

    const onAmountChanged = async (e) => {
        setAmount(e.target.value)  
    };

    const onReceiverChanged = async (e) => {
        setReceiver(e.target.value)  
    }

    const onTransfer = async (e) => {
        const w3 = await getGsnProvider()
        const contract = await getContract(w3, contractDefinition)
        await contract.methods.transfer(library.utils.toChecksumAddress(receiver), library.utils.toWei(amount)).send({ from: account })
        getPoints()
    }

    const onImageChange = async (e) => {
        setAvatarImage(e.target.files[0])  
        setAvatarImageSrc(URL.createObjectURL(e.target.files[0]))
    }

    const onNextStep = () => {
        setOnboardStep(onboardStep + 1 )
    }

    const onPreviousStep = () => {
        setOnboardStep(onboardStep - 1)
    }

    const onNameChange = (e) => {
        employee.name = e.target.value
        setUser({...user, name: e.target.value})

    }

    const onEmailChange = (e) => {
        employee.email = e.target.value

        if (validateEmail(employee.email)) {
            setUser({...user, email: e.target.value})
            setWarnEmail(false)
        } else {
            setUser({...user, email: ''})
            setWarnEmail(true)
        }
    }

    const onFinish = async () => {


        const media = await uploadMedia(avatarImage)

        const data = { id: employee.id, name: employee.name, email: employee.email, avatar: {id: media.id}, isOnboarded: true }
       

        const w3 = await getGsnProvider()
        const contract = await getContract(w3, employeesContractDefinition)

        const res = await contract.methods.addEmployee(data.id, data.name, data.email).send({ from: account })
        
        const tokenContract = await getContract(library, contractDefinition)
            
        const balance = await tokenContract.methods.balanceOf(account).call({ from: account })

        await updateEmployee(data)
        setUser({...user, name: employee.name, email: employee.email, avatar: {id: media.id, url: media.url}, isOnboarded: true, points: balance / 1e18 })

    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const getPoints = () => {

        (async () => {
            const contract = await getContract(library, contractDefinition)
            
            const balance = await contract.methods.balanceOf(account).call({ from: account })

            setUser({...user, points: balance / 1e18})
        })();

    }

    useEffect(() => {
        switch(onboardStep) {
            case 1: {
                setProgress("1%")
                break
            }
            case 2: {
                setProgress("50%")
                break
            }
            case 3: {
                setProgress("100%")
            }
        }
    }, [onboardStep])

    return (
        <>
            { isAuthenticated ? 
                <>
                    <div className="container">
                        {
                            user.isOnboarded ?
                                <>
                                    <div className="row justify-content-center mt-3">
                                        <div className="col-2 h-150 pr-0 img-cover" style={{ borderRadius: "8px 0px 0px 8px" }}>
                                            <img src={`http://localhost:1338${user.avatar.url}`} className="img-fluid center" style={{ maxWidth: "100%", height: "auto" }} alt="user" />
                                        </div>
                                        <div className="col-6 bg-white p-4">
                                            <h3 className="text-w-600">{user.name}</h3>
                                            <p>{user.email}</p>
                                        </div>
                                        <div className="col-2 h-150 pr-0 py-1 bg-white text-center" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <div>
                                                <img src={getRankByPoints(user.points).imageUrl} width="50" />
                                                <div>rank: <strong>{getRankByPoints(user.points).rank}</strong></div>
                                                <div>points: <strong>{user.points}</strong></div>
                                            </div>

                                        </div>
                                        <div className="col-2 h-150 pr-0 bg-white text-center" style={{ borderRadius: "0px 8px 8px 0px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <figure className="pie-chart" style={{ background: `radial-gradient(circle closest-side, white 0, white 52.8%, transparent 52.8%, transparent 60%, white 0 ), conic-gradient(#ad49fb 0, #ad49fb ${100 - ((getNextRankByPoints(user.points).points - user.points) / (getNextRankByPoints(user.points).points - (getRankByPoints(user.points).points)) * 100)}%, #ccc 0, #ccc 100% )` }}>
                                                <div className="caption-inside" >
                                                    <img src={getNextRankByPoints(user.points).imageUrl} width="50" />
                                                    <div>{getNextRankByPoints(user.points).rank}</div>
                                                    <div>+{getNextRankByPoints(user.points).points - user.points}</div>
                                                </div>
                                            </figure>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center mt-3">
                                        <div className="col-6 bg-white p-0" style={{ borderRadius: "8px" }} >
                                            <div className="card">
                                                <div className="card-body">
                                                    <input type="text" value={amount} onChange={onAmountChanged} placeholder="0.01" />
                                                    <input type="text" value={receiver} onChange={onReceiverChanged} placeholder="0x..." />
                                                    <button className="btn btn-gra btn-sm w-150" onClick={onTransfer}>Send</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-center mt-3">
                                        <div className="col-6 bg-white p-0" style={{ borderRadius: "8px" }} >
                                            <div className="card">
                                                <div className="card-header">Latest Events</div>
                                                <div className="card-body">
                                                    <div style={{ display: "flex" }}>
                                                        <div style={{ width: "15%" }}>
                                                            <img src="https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/apex_testing/2d3d525254af58a32f2325da207505ea_badge.png" width="100%" />
                                                        </div>
                                                        <div style={{ flexGrow: 1, paddingLeft: "1rem" }}>
                                                            <h5 className="card-title">Lorem ipsum dolor sit amet</h5>
                                                            <p className="card-text">un testo segnaposto utilizzato nel settore della tipografia e della stampa.</p>
                                                            <p style={{ fontSize: "12px", fontWeight: "600" }}>+120 points</p>
                                                            {/* <a href="#" className="btn btn-gra btn-sm w-150">Go somewhere</a> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div style={{ display: "flex" }}>
                                                        <div style={{ width: "15%" }}>
                                                            <img src="https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/behavioral-triggers-in-journey-builder/5d4075dd3f70a1835b23acb1bb4e907c_badge.png" width="100%" />
                                                        </div>
                                                        <div style={{ flexGrow: 1, paddingLeft: "1rem" }}>
                                                            <h5 className="card-title">Sed do eiusmod tempor incididunt</h5>
                                                            <p className="card-text">Lorem Ipsum è considerato il testo segnaposto standard sin dal.</p>
                                                            <p style={{ fontSize: "12px", fontWeight: "600" }}>+150 points</p>
                                                            {/* <a href="#" className="btn btn-gra btn-sm w-150">Go somewhere</a> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div style={{ display: "flex" }}>
                                                        <div style={{ width: "15%" }}>
                                                            <img src="https://res.cloudinary.com/hy4kyit2a/f_auto,fl_lossy,q_70/learn/modules/accounts_contacts_lightning_experience/b84df67136a004253f0624ee68e0c9f2_badge.png" width="100%" />
                                                        </div>
                                                        <div style={{ flexGrow: 1, paddingLeft: "1rem" }}>
                                                            <h5 className="card-title">At vero eos et accusamus et iusto odio</h5>
                                                            <p className="card-text">Nam libero tempore, cum soluta nobis est eligendi optio cumque.</p>
                                                            <p style={{ fontSize: "12px", fontWeight: "600" }}>+180 points</p>
                                                            {/* <a href="#" className="btn btn-gra btn-sm w-150">Go somewhere</a> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                        :
                        <>
                            <div className="row justify-content-center">                            
                                <div className="col-6 text-center p-0 mt-3">
                                    <div className="card px-4 py-4 my-2">
                                        <div className="mb-1" style={{display: "flex", width: "100%"}}>
                                            <div>
                                                <img src="/img/ranks/rank-scout.png" height="50"/>
                                            </div>
                                            <div className="px-1" style={{flexGrow: 1, alignSelf: "end"}}>
                                                <div className="progress">
                                                    <div className="progress-bar progress-bar-striped" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={{width: progess}}></div>
                                                </div>
                                                <div>Complete all steps to unlock the next rank</div>
                                            </div>
                                            <div>
                                                <img src="/img/ranks/rank-hiker.png" height="50"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">                            
                                <div className="col-6 text-center p-0 mt-3 mb-2">
                                    <div className="card px-0 py-0 mt-3 mb-3">
                                        <div className="card-header">Setup Your Account</div>

                                        <form id="msform">
                                            <ul id="progressbar">
                                                <li className={onboardStep > 0 ? "active": ""} id="personal"><strong>Profile</strong></li>
                                                <li className={onboardStep > 1 ? "active": ""} id="payment"><strong>Photo</strong></li>
                                                <li className={onboardStep > 2 ? "active": ""} id="confirm"><strong>Confirmation</strong></li>
                                            </ul>                                    
                                            <fieldset style={{display: onboardStep === 1 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">Fill in your information</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 1 / 3</p>
                                                        </div>
                                                    </div> 
                                                    <div className="mt-4">
                                                        <label className="fieldlabels">Name:</label> 
                                                        <input type="text" className="form-control" name="name" onChange={onNameChange} />

                                                        <div>
                                                            <label className="fieldlabels">Email:</label>
                                                            <span className={`float-end${warnEmail ? " text-danger": " d-none"}`}>Invalid email format</span>
                                                        </div>
                                                        <input type="email" pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/" className="form-control" name="email" onChange={onEmailChange} />
                                                    </div>
                                                </div> 
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" value="Next" onClick={onNextStep} disabled={!user.name || !user.email} />
                                                </div>
                                            </fieldset>
                                            <fieldset style={{display: onboardStep === 2 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">Upload your profile photo</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 2 / 3</p>
                                                        </div>
                                                    </div> 
                                                    <div className="mt-4 text-center">
                                                        <div className="m-1 bg-light" style={{ height: "200px", width: "200px", display: "inline-block", borderRadius: "0.25em"}}>
                                                            <img src={avatarImageSrc} style={{ height: "200px", objectFi: "contain" }} className={avatarImageSrc ? '': 'd-none'} />
                                                        </div> 
                                                        <div>                                                       
                                                        <label for="file-ip-1" className="btn btn-sm btn-outline-sec w-120 border border-secondary">Upload</label>
                                                        <input id="file-ip-1" className="d-none" type="file" name="pic" accept="image/*" onChange={onImageChange} />
                                                        </div>
                                                    </div>
                                                </div> 
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" value="Next" onClick={onNextStep} disabled={!avatarImage} />
                                                    <input type="button" name="previous" className="previous action-button-previous" value="Previous" onClick={onPreviousStep} />
                                                </div>
                                            </fieldset>
                                            <fieldset style={{display: onboardStep === 3 ? "block" : "none"}}>
                                                <div className="form-card">
                                                    <div className="row">
                                                        <div className="col-7">
                                                            <p className="h5">Confirm your information</p>
                                                        </div>
                                                        <div className="col-5">
                                                            <p className="text-end h5 text-muted">Step 3 / 3</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 text-center">
                                                        <div className="m-1 bg-light" style={{ height: "200px", width: "200px", display: "inline-block", borderRadius: "0.25em"}}>
                                                            <img src={avatarImageSrc} style={{ height: "200px", objectFi: "contain" }} className={avatarImageSrc ? '': 'd-none'} />
                                                        </div> 
                                                    </div>
                                                    <p className="text-center my-2"><strong>Name:</strong>{user.name}</p>
                                                    <p className="text-center my-2"><strong>Email:</strong> {user.email}</p>
                                                </div>
                                                <div style={{ padding: "16px" }}>
                                                    <input type="button" name="next" className="next action-button" value="Finish" onClick={onFinish} />
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

            </> :
            <div className="container">
                <div className="row justify-content-center">                            
                    <div className="col-6 text-center p-0 mt-3">
                        <div className="card px-4 py-4 my-2 text-center">
                        <p>Sign message to continue</p>

                        <p><a onClick={() => handleSignMessage()} className="btn btn-gra btn-sm w-150">{t('Sign Message')}</a></p>
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default EmployeePage

export async function getServerSideProps({ params }) {

    const messages = require('../../../lib/i18n/en.json');
    let data = await getEmployeeByAccount(params.account)

    if (!data) {
        data = await createEmployee({ account: params.account})
    }  
    
    return {
      props: {
          employee: {
            ...data
          },
          messages
      }
    }
  }