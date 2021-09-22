import React, { useContext} from 'react'
import { AtmObject } from '../App'
import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie';

function Logout() {
    const atmObject = useContext(AtmObject)
    const { setIsVerified, setSelectedDiv, setSelected, isEmployee, setIsCustomer, setAccount, setEmployee, setIsATM, setIsAdmin , setIsEmpCreate} = atmObject
    const history = useHistory()

    const cookies = new Cookies();

    cookies.remove('tokenHead', {path: '/',sameSite: 'strict'})
    cookies.remove('tokenSig', {path: '/',sameSite: 'strict', secure: true})
    setSelectedDiv('online banking-nav-div')
    setSelected('Online Banking')
    setIsVerified(false);
    setIsCustomer(true)
    setIsATM(false)
    setIsAdmin(false)
    setIsEmpCreate(false)
    setAccount('')
    setEmployee('')
    if(!isEmployee){
        document.getElementById('Home').classList.add('marble')
        document.getElementById('Home').classList.add('black-border-bottom')
        document.getElementById('home-nav-div').classList.add('title-background')
    }
    setTimeout(()=>{
        history.push('/components/Home')
    },1000)
    return (
        <div>
            You've Been Logged out
        </div>
    )
}

export default Logout
