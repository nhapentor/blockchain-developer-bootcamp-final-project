
import { getEmployeeByAccount, createEmployee, updateEmployee } from '../../lib/api'
import { useTranslations } from 'next-intl'
import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const EmployeePage = ({ employee }) => {

    const [isAuthenticated, setAuthenticated] = useState(false)

    const t = useTranslations()

    const router = useRouter()

    const { active, account, library } = useWeb3React()


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
                    await saveSignedMessage(signature, now)
                    authenticate()
                })()
                
            } else {
                console.log(err)
            }
          }
        )
  
    };


    const saveSignedMessage = async (signature, timestamp) => {
        employee = { ...employee, signature, timestamp }
        await updateEmployee(employee)
    }

    useEffect(() => {

        setAuthenticated(employee && employee.signedMessage && employee.signedMessageTimestamp)

    }, [employee])

    return (
        <>
            { isAuthenticated ? 
            <>
                <h1>{employee.account}</h1>
                <h2>{employee.email}</h2>
            </> :
            <>          
                <a onClick={() => handleSignMessage()} className="btn btn-gra btn-sm w-150">{t('Sign Message')}</a>            
            </>
            }
        </>
    )
}

export default EmployeePage

export async function getServerSideProps({ params }) {

    const messages = require('../../lib/i18n/en.json');
    let data = await getEmployeeByAccount(params.account)

    if (!data) {
        data = await createEmployee({ account: params.account})
    } else {
        data = await updateEmployee(data)
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