import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from "@web3-react/core"
import { getEmployeesContract, getTokenContract, getBadgesContract } from '../lib/getContracts'

const UserProfile = () => {

    const [user, setUser] = useState({})
    const [badgeList, setBadgeList] = useState([])
    const [isLoaded, setLoaded] = useState(false)

    const { active, account, library } = useWeb3React()
    
    const router = useRouter()

    useEffect(async () => {

        if (active && account) {
            await getEmployee()
            await getBadges()
            setLoaded(true)
        }

    }, [active])

    useEffect(async () => {

        if (account && user.account && account != user.account) {

            if (router.query.account === user.account) {
                window.location.assign(window.location.href.replace(user.account, account))            
            } else {
                window.location.reload(false)
            }
        }        

    }, [account])

    const getBadgeMetadata = async (uri) => {

        const res = await fetch(uri)

        const metadata = await res.json()

        return metadata

    }

    const getBadges = async () => {

        const employeesContract = await getEmployeesContract(library)
        const e = await employeesContract.methods.getEmployees(account).call({ from: account })

        const badgeContract = await getBadgesContract(library)

        setBadgeList([])

        e.badges.map(async (b) => {

            const uri = await badgeContract.methods.uri(b).call({ from: account });

            const metadata = await getBadgeMetadata(uri)

            const badge = {
                id: metadata.id,
                name: metadata.name,
                imageUrl: metadata.image
            }

            setBadgeList(prev => [...prev, badge])
        })
    }

    const getEmployee = async () => {

        const tokenContract = await getTokenContract(library)
        const balance = await tokenContract.methods.balanceOf(account).call({ from: account })

        const employeesContract = await getEmployeesContract(library)
        const e = await employeesContract.methods.getEmployees(account).call({ from: account })

        if (e.name && e.email) {
            setUser({ ...user, account, isOnboarded: true, id: e.id, name: e.name, email: e.email, image: e.image, balance: library.utils.fromWei(balance) })
        } else {
            window.location.assign('/')
        }        
    }

    return (
        <>
        { isLoaded &&
            <div className="row justify-content-center mt-3" style={{ paddingLeft: "5.5rem", paddingRight: "5.5rem"}}>
                <div className="col-2 h-150 pr-0 img-cover" style={{ borderRadius: "8px 0px 0px 8px" }}>
                    <img src={`${user.image}`} className="img-fluid center" style={{ maxWidth: "100%", height: "auto" }} alt="user" />
                </div>
                <div className="col-6 bg-white p-4">
                    <h3 className="text-w-600">{user.name}</h3>
                    <p>{user.email}</p>
                    <p className="my-0 text-muted" style={{fontSize: "small", fontWeight: 600}}>XABER: {
                        user.balance === 0 ? <span className="text-dark">0</span> : <span className="text-success">+{user.balance}</span>
                    }
                    </p>
                    
                </div>
                <div className="col-4 pr-0 py-1 bg-white text-center" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div className="row">
                        {
                            badgeList.sort((x, y) => x.id > y.id ? 1 : -1).map(b => {

                                return (
                                    <div key={`badge-${b.id}`} className="col text-uppercase"><img src={b.imageUrl} width="50" /><br />{b.name}</div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        }    
        </>
    )
}

export default UserProfile;