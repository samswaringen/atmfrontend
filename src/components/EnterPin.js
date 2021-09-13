import { useLazyQuery, gql } from '@apollo/client';
import React, { useState, useContext, useEffect} from 'react'
import { AtmObject } from '../App';
import { useHistory } from "react-router-dom";
import superagent from 'superagent'
import Cookies from 'universal-cookie';

function EnterPin() {
    const atmObject = useContext(AtmObject);
    const {setIsVerified, setAccount, setSelectedDiv, setSelected, account, isEmployee, isAdmin, isEmpWithdraw, isEmpDeposit, isEmpTransfer} = atmObject;
    const [pinDisplay, setPinDisplay] = useState('')
    const [pinCode, setPinCode] = useState([])
    const [username, setUsername] = useState('')

    const history = useHistory()

    const cookies = new Cookies();

    const ACCOUNT_BY_PIN = gql`
        query ACCOUNT_BY_PIN($username:String, $pin: String){
            accountByPin(username:$username, pin: $pin){
                id
                role
                routing
                name
                username
                email
                password
                pin
                contact{
                    firstName
                    lastName
                    phoneNum
                    mailing{
                    streetName
                    city
                    state
                    zip
                    }
                    billing{
                    streetName
                    city
                    state
                    zip
                    }
                }
                balances {
                    checking {
                    acctName
                    acctNumber
                    acctType
                    balance
                    }
                    savings {
                    acctName
                    acctNumber
                    acctType
                    balance
                    interestRate
                    }
                    cards {
                    acctName
                    cardNumber
                    acctType
                    exp
                    CVV
                    pin
                    balance
                    totalBalance
                    }
                    coinWallets {
                        walletName
                        walletType
                        coins {
                        coinName
                        id
                        balance
                        activity {
                            id
                            dateTime
                            type
                            amount
                        }
                        }
                    }
                    investments{
                        acctName
                        type
                        id
                        value
                    }
                }
                accountHistory {
                    transID
                    username
                    dateTime
                    info {
                        acctType
                        acctNumber
                        type
                        amount
                        newBalance
                    }
                }
            }
        }
    `
    const ACCOUNT_BY_PIN_AUTH = gql`
        query ACCOUNT_BY_PIN_AUTH($username:String, $pin: String){
            accountByPinAuth(username:$username, pin: $pin){
                id
                role
                routing
                name
                username
            }
        }
    `

    const [accountByPin, {loading,error,data}] = useLazyQuery(ACCOUNT_BY_PIN,{
        fetchPolicy: "no-cache"
      })
    const [accountByPinAuth, {loading:loadAuth, error:errorAuth, data:dataAuth}] = useLazyQuery(ACCOUNT_BY_PIN_AUTH,{
        fetchPolicy: "no-cache"
      })

    useEffect(()=>{
        if(!loading && data){
            console.log("data:",data)
            setAccount(data.accountByPin)
            setIsVerified(true)
            history.push("/components/Home")
        }
    },[data])

    useEffect(()=>{
        if(!loadAuth && dataAuth){
            if(isEmpDeposit){
                history.push('/components/Deposit')
            }
            else if(isEmpWithdraw){
                history.push('/components/OtherWithdraw')
            }
            else if(isEmpTransfer){
                history.push('/components/Transfer')
            }
        }
    },[dataAuth])

    useEffect(()=>{
        if(isEmployee || isAdmin){
            document.getElementById('username-pin-input').value = account.username
            setUsername(account.username)
        }
    },[])

    const selectNumber = (e)=>{
        let len = pinDisplay.length;
        let asteriskArr = Array(len).fill('*');
        asteriskArr.push(e.target.value)
        setPinDisplay(asteriskArr.join(''))
        setPinCode([...pinCode, e.target.value])
    }
    const handleUN = (e)=>{
        setUsername(e.target.value)
    }
    const clearPin = ()=>{
        setPinDisplay('');
        setPinCode([]);
    }
    const undoPin = ()=>{
        setPinDisplay(pinDisplay.slice(0,pinDisplay.length-1));
        setPinCode([...pinCode.slice(0,pinCode.length-1)]);
    }
    const enterPin = ()=>{
        if(isEmployee || isAdmin){
            accountByPinAuth({variables: {username:username, pin: pinCode.join('')}})

        }else{
            if(pinCode.length < 4) { 
                document.getElementById('pin-title').innerHTML = 'Pin must be 4 or More'
                document.getElementById('pin-title').style.color = 'red'
            }else{
                superagent
                    .post("https://atm-auth-server.herokuapp.com/loginatm")
                    .send({username: username, pin: pinCode.join('')})
                    .end(function (err, res) {
                        if (err) {
                        console.log(err);
                        }else {
                            console.log("res for sign in", res)
                            if(res.text === "Username or pin incorrect"){
                                document.getElementById('username-error').innerHTML = "Username or pin incorrect"
                                setPinCode([])
                                return
                            }
                            let tokenArr = res.body.accessToken.split('.')
                            cookies.set("tokenHead", `${tokenArr[0]}.${tokenArr[1]}`, {path: "/", sameSite: 'strict'})
                            cookies.set('tokenSig', tokenArr[2], {path: "/", sameSite: 'strict', secure: true})
                            accountByPin({variables:{username: username, pin: pinCode.join('')}})
                            setSelected("Home")
                            setSelectedDiv("home-nav-div")
                        }
                    });           
                setPinDisplay('')
            }
        }
    }

    return (
        <div id="atm-pin-div">
            <h3>ATM</h3>
            <br/>
            <div id="username-atm-input">
                <input id="username-pin-input" type="text" placeholder="Username" onChange={handleUN}></input>
                <div className= "error-signin" id="username-error"></div>
            </div>
            <div id="inner-verification">
                    <input id="pin-display-input" type="text" value={pinDisplay} placeholder="Enter Pin"></input>
                <div id = "keypad">
                    <div className = "grid-row">
                        <button key = '1' className = "keypad-btn" onClick = {selectNumber} value = '1' >1</button>
                        <button key = '2' className = "keypad-btn" onClick = {selectNumber} value = '2'>2</button>
                        <button key = '3' className = "keypad-btn" onClick = {selectNumber} value = '3'>3</button>
                        </div>
                        <div className = "grid-row">
                            <button key = '4' className = "keypad-btn" onClick = {selectNumber} value = '4'>4</button>
                            <button key = '5' className = "keypad-btn" onClick = {selectNumber} value = '5'>5</button>
                            <button key = '6' className = "keypad-btn" onClick = {selectNumber} value = '6'>6</button>
                        </div>
                        <div className = "grid-row">
                            <button key = '7' className = "keypad-btn" onClick = {selectNumber} value = '7'>7</button>
                            <button key = '8' className = "keypad-btn" onClick = {selectNumber} value = '8'>8</button>
                            <button key = '9' className = "keypad-btn" onClick = {selectNumber} value = '9'>9</button>
                        </div>
                        <div className = "grid-row">
                            <button key = 'clear' className = "keypad-btn" onClick = {clearPin}>Clear</button>
                            <button key = '0' className = "keypad-btn" onClick = {selectNumber} value = '0'>0</button>
                            <button key = '<' className = "keypad-btn" onClick = {undoPin}>&lt;</button>
                        </div>
                        <div id = "submit-pin">
                            <button id = "submit-btn" onClick = {enterPin}>Submit</button>
                        </div>
                    </div>
            </div>   
        </div>
    )
}

export default EnterPin
