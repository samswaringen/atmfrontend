import React, {useState, useContext, useEffect} from 'react'
import { AtmObject } from '../App'
import {Card, Dropdown} from 'react-bootstrap'
import { useMutation, useLazyQuery,  gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

function AddAccount() {
    const atmObject = useContext(AtmObject)
    const { account, setAccount } = atmObject;


    const history = useHistory()

    const [selected, setSelected] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [isSavings, setIsSavings] = useState(false)
    const [isCard, setIsCard] = useState(false)
    const [isInvestment, setIsInvestment] = useState(false)
    const [isCoinWallet, setIsCoinWallet] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [accountName, setAccountName] = useState('')
    const [pin, setPin] = useState(0)
    const [acctNumber, setAcctNumber] = useState(0) 
    const [creditNumber, setCreditNumber] = useState(0)
    const [creditEq, setCreditEq] = useState(0)
    const [debitNumber, setDebitNumber] = useState(0)
    const [debitEq, setDebitEq] = useState(0)
    const [acctNumberEq, setAcctNumberEq] = useState(0)
    const [acctType, setAcctType] = useState('')
    const [acctLevel, setAcctLevel] = useState('')
    const [accountForLink, setAccountForLink] = useState("Accounts")
    const [accountNumForLink, setAccountNumForLink] = useState(0)
    const [balanceAllowed, setBalanceAllowed] = useState(0)


    const ADD_NEW_CHECKING = gql`
        mutation ADD_NEW_CHECKING($id: String!, $acctType: String!, $acctName: String, $acctNumber : Float, $balance : Float, $acctLevel: String){
            addNewChecking(id:$id, acctType:$acctType, input:{ acctName:$acctName, acctNumber:$acctNumber, acctType:$acctLevel, balance:$balance}){
                id
                username
                balances{
                    checking{
                      acctName
                      acctNumber
                      balance
                    }
                }
            }
        }
    `;
    const ADD_NEW_SAVINGS = gql`
        mutation ADD_NEW_SAVINGS($id: String!, $acctType: String, $acctName: String, $acctNumber: Float, $balance: Float, $interestRate: Float, $acctLevel: String) {
            addNewSavings(id: $id, acctType: $acctType, input: {acctName: $acctName, acctNumber: $acctNumber, acctType: $acctLevel, balance: $balance, interestRate: $interestRate}) {
            id
            username
            balances {
                savings {
                acctName
                acctType
                acctNumber
                balance
                interestRate
                }
            }
            }
        }
    `;
    const ADD_NEW_CARD = gql`
    mutation ADD_NEW_CARD($id: String!, $acctType: String, $acctName: String, $cardNumber: Float, $exp: String, $CVV: Int, $pin: Int, $acctLevel: String, $acctLink: Float, $balance: Float, $totalBalance: Float) {
        addNewCard(id: $id, acctType: $acctType, input: {acctName: $acctName, acctLink: $acctLink, cardNumber: $cardNumber, acctType: $acctLevel, exp: $exp, CVV: $CVV, pin: $pin, balance: $balance, totalBalance: $totalBalance}) {
          id
          username
          balances {
            cards {
              acctName
              acctLink
              cardNumber
              acctType
              exp
              CVV
              pin
              balance
              totalBalance
            }
          }
        }
      }
    `;
    const ADD_NEW_INVESTMENT = gql`
        mutation ADD_NEW_INVESTMENT($id: String, $acctType: String, $acctName: String, $type: String, $id: String, $value: Float){
            addNewInvestment(id:$id, acctType:$acctType, input:{acctName: $acctName, type: $type, id: $id, value: $value}){
                id
                username
                balances
            }
        }
    `;
    const ADD_NEW_COINWALLET = gql`
        mutation ADD_NEW_COINWALLET($id: String!, $acctType: String, $walletName: String!, $walletType: String!) {
            addNewCoinWallet(id: $id, acctType: $acctType, input: {walletName: $walletName, walletType: $walletType, coins: []}) {
            id
            username
            balances {
                coinWallets {
                walletName
                walletType
                }
            }
            }
        }
    `;
    const GET_ONE_NUM = gql`
        query GET_ONE_NUM($id:String!){
            numberGen(id:$id){
            id
            number
            equation
            }
        }
        `;
    
    const EDIT_NUM = gql`
        mutation EDIT_NUM(
            $id: String!,
            $number: Float!,
            $equation: Int!
        ){
        editNumberGen(id: $id, input:{
            id: $id,
            number: $number,
            equation: $equation
            }){
                id
                number
                equation
            }
        }
    `;

    const [addNewChecking,{loading:loadingChk,error: errorChk,data: dataChk}] = useMutation(ADD_NEW_CHECKING)
    const [addNewSavings,{loading: loadingSav,error: errorSav,data: dataSav}] = useMutation(ADD_NEW_SAVINGS)
    const [addNewCard,{loading:loadingCard,error:errorCard,data:dataCard}] = useMutation(ADD_NEW_CARD)
    const [addNewInvestment,{loading:loadingInv,error: errorInv,data:dataInv}] = useMutation(ADD_NEW_INVESTMENT)
    const [addNewCoinWallet,{loading: loadingCoin,error: errorCoin,data: dataCoin}] = useMutation(ADD_NEW_COINWALLET)
    const [numberGen,{loading: numLoading, error: numError, data: numData}] = useLazyQuery(GET_ONE_NUM)
    const [editNumberGen,{loading: editLoading, error: editError, data: editData}] = useMutation(EDIT_NUM)

    useEffect(()=>{
        numberGen({variables:{id:"accounts"}})
    },[])

    useEffect(()=>{
        if(!numLoading && numData){
            if(numData.numberGen.id === "accounts"){
                setAcctNumber(numData.numberGen.number)
                setAcctNumberEq(numData.numberGen.equation)
            }else if(numData.numberGen.id === "credit"){
                setCreditNumber(numData.numberGen.number)
                setCreditEq(numData.numberGen.equation)
            }else if(numData.numberGen.id === "debit"){
                setDebitNumber(numData.numberGen.number)
                setDebitEq(numData.numberGen.equation)
            }
        }

        
    },[numData])

    useEffect(()=>{
        if(!numLoading && numData){
            numberGen({variables:{id:"credit"}})
            }
    }, [acctNumber])

    useEffect(()=>{
        if(!numLoading && numData){
            numberGen({variables:{id:"debit"}})
            }
    },[creditNumber])

    const createAccount = (acct)=>{
        setSelected(true)
        switch(acct){
            case "checking":
                setIsChecking(true)
                break;
            case "savings":
                setIsSavings(true)
                break;
            case "cards":
                setIsCard(true)
                break;
            case "investment":
                setIsInvestment(true)
                break;
            case "coinWallets":
                setIsCoinWallet(true)
                break;
        }
    }

    const goBack = ()=>{
        setSelected(false)
        setIsChecking(false)
        setIsSavings(false)
        setIsCard(false)
        setIsInvestment(false)
        setIsCoinWallet(false)
        setIsConfirm(false)
    }

    const handleName = (e)=>{
        setAccountName(e.target.value)
    }

    const handlePin =(e)=>{
        setPin(e.target.value)
    }

    const selectAccount = (index)=>{
        setAccountForLink(account.balances.checking[index].acctName)
        setAccountNumForLink(account.balances.checking[index].acctNumber)
    }

    const genCVV = ()=>{
        let cvv = ''
        for(let i =0; i<3; i++){
            cvv += Math.floor(Math.random()*10)-1   
        }
        return Number(cvv)
    }

    const confirmAccount = (type, level)=>{
        switch(type){
            case "checking":
                setAcctType(type)
                setAcctLevel(level)
                setIsConfirm(true)
                setIsChecking(false)
                break;
            case "savings":
                setAcctType(type)
                setAcctLevel(level)
                setIsConfirm(true)
                setIsSavings(false)
                break;
            case "cards":
                if(level === "silver"){
                    setBalanceAllowed(5000)
                }else if(level === "gold"){
                    setBalanceAllowed(10000)
                }else if(level === "platinum"){
                    setBalanceAllowed(25000)
                }else if(level === "business"){
                    setBalanceAllowed(100000)
                }
                setAcctType(type)
                setAcctLevel(level)
                setIsConfirm(true)
                setIsCard(false)
                break;
            case "investment":
                setAcctType(type)
                setAcctLevel(level)
                break;
            case "coinWallets":
                setAcctType(type)
                setAcctLevel(level)
                setIsConfirm(true)
                setIsCoinWallet(false)
                break;
        }
    }

    const addAccount = ()=>{
        let newAcctNumber = acctNumber + acctNumberEq
        let newDebitNumber = debitNumber + debitEq
        let newCreditNumber = creditNumber + creditEq
        let cvv = genCVV()
        let date = new Date()
        let month = date.getMonth()
        let year = date.getFullYear()
        let exp = `${month}/${year+4}`
        let expC = `${month}/${year+6}`

        switch(acctType){
            case "checking":
                addNewChecking({variables : {id: account.id, acctType: acctType, acctLevel: acctLevel, acctName: accountName, acctNumber: newAcctNumber, balance: 0}})
                editNumberGen({variables:{id:"accounts",number: newAcctNumber, equation: acctNumberEq}})
                setAccount(account, account.balances.checking.push({ acctName: accountName, acctNumber : newAcctNumber, acctType: acctLevel, balance : 0}))
                history.push('/components/Success')
                break;
            case "savings":
                switch(acctLevel){
                    case "basic":
                        addNewSavings({variables : {id: account.id, acctType: acctType, acctLevel: acctLevel, acctName: accountName, acctNumber: newAcctNumber, balance: 0, interestRate: 0.1}})
                        editNumberGen({variables:{id:"accounts",number: newAcctNumber, equation: acctNumberEq}})
                        setAccount(account, account.balances.savings.push({ acctName: accountName, acctNumber : newAcctNumber, acctType: acctLevel, balance : 0, interestRate : 0.1}))
                        history.push('/components/Success')
                        break;
                    case "premium":
                        addNewSavings({variables : {id: account.id, acctType: acctType, acctLevel: acctLevel, acctName: accountName, acctNumber: newAcctNumber, balance: 0, interestRate: 0.2}})
                        editNumberGen({variables:{id:"accounts",number: newAcctNumber, equation: acctNumberEq}})
                        setAccount(account, account.balances.savings.push({ acctName: accountName, acctNumber : newAcctNumber, acctType: acctLevel, balance : 0, interestRate : 0.2}))
                        history.push('/components/Success')
                        break;
                    case "business":
                        addNewSavings({variables : {id: account.id, acctType: acctType, acctLevel: acctLevel, acctName: accountName, acctNumber: newAcctNumber, balance: 0, interestRate: 0.25}})
                        editNumberGen({variables:{id:"accounts",number: newAcctNumber, equation: acctNumberEq}})
                        setAccount(account, account.balances.savings.push({ acctName: accountName, acctNumber : newAcctNumber, acctType: acctLevel, balance : 0, interestRate : 0.25}))
                        history.push('/components/Success')
                        break;
                }
                break;
            case "cards":
                switch(acctLevel){
                    case "debit":
                        addNewCard({variables : {id: account.id, acctType: acctType,  acctName: accountName, cardNumber: newDebitNumber, exp: exp, CVV: cvv, pin: Number(pin), acctLevel: acctLevel,acctLink: accountNumForLink, balance: balanceAllowed, totalBalance: balanceAllowed }})
                        editNumberGen({variables:{id:"debit",number: newDebitNumber, equation: debitEq}})
                        setAccount(account, account.balances.cards.push({acctName: accountName, cardNumber: newDebitNumber, acctLink: accountNumForLink, acctType: acctLevel, exp: exp, CVV: cvv, pin: Number(pin), balance: balanceAllowed, totalBalance: balanceAllowed}))
                        setAccountForLink(0)
                        history.push('/components/Success')
                        break;
                    case "silver":
                    case "gold":
                    case "platinum":
                    case "business":
                        addNewCard({variables : {id: account.id, acctType: acctType,  acctName: accountName, cardNumber: newCreditNumber, exp: expC, CVV: cvv, pin: Number(pin), acctLevel: acctLevel,acctLink: accountNumForLink, balance: balanceAllowed, totalBalance: balanceAllowed }})
                        editNumberGen({variables:{id:"credit",number: newCreditNumber, equation: creditEq}})
                        setAccount(account, account.balances.cards.push({acctName: accountName, cardNumber: newCreditNumber, acctLink: accountNumForLink, acctType: acctLevel, exp: exp, CVV: cvv, pin: Number(pin), balance: balanceAllowed, totalBalance: balanceAllowed}))
                        history.push('/components/Success')
                        break;
                }
                break;
            case "investment":
                switch(acctLevel){
                    case "basic":
                        break;
                    case "basic":
                        break;
                    case "basic":
                        break;
                }
                break;
            case "coinWallets":
                addNewCoinWallet({variables : {id: account.id, acctType: acctType,  walletName: accountName, walletType: acctLevel}})
                setAccount(account, account.balances.coinWallets.push({walletName: accountName, walletType: acctLevel, coins:[]}))
                history.push('/components/Success')
                break;
        }
    }

    document.getElementById('')

    return (
        <Card id="add-account-card">
            { !selected && <>
                <div className="add-account-card-title"><h3>What Type of Account?</h3></div><br/>
            <div className = "add-account-items" type="button" onClick={()=>createAccount("checking")}><div className = "add-account-items-inner">Checking</div></div>
            <div className = "add-account-items" type="button" onClick={()=>createAccount("savings")}><div className = "add-account-items-inner">Savings</div></div>
            <div className = "add-account-items" type="button" onClick={()=>createAccount("cards")}><div className = "add-account-items-inner">Card</div></div>
            <div className = "add-account-items" type="button" onClick={()=>createAccount("investment")}><div className = "add-account-items-inner">Investment</div></div>
            <div className = "add-account-items" type="button" onClick={()=>createAccount("coinWallets")}><div className = "add-account-items-inner">Coin Wallet</div></div>
            </>}
            
            { isChecking &&
                <div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("checking", "basic")}><div className = "add-account-items-inner">Basic Checking</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("checking", "premium")}><div className = "add-account-items-inner">Premium Checking</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("checking", "business")}><div className = "add-account-items-inner">Business Checking</div></div>
                    <div className = "add-account-items" type="button" onClick={goBack}><div className = "add-account-items-inner">Go Back</div></div>
                </div>   
            }
            { isSavings && 
                <div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("savings", "basic")}><div className = "add-account-items-inner">Basic Savings</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("savings", "premium")}><div className = "add-account-items-inner">Premium Savings</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("savings", "business")}><div className = "add-account-items-inner">Business Savings</div></div>
                    <div className = "add-account-items" type="button" onClick={goBack}><div className = "add-account-items-inner">Go Back</div></div>
                </div>
            }
            { isCard &&
                <div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("cards", "debit")}><div className = "add-account-items-inner">React Debit</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("cards", "silver")}><div className = "add-account-items-inner">React Silver</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("cards", "gold")}><div className = "add-account-items-inner">React Gold</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("cards", "platinum")}><div className = "add-account-items-inner">React Platinum</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("cards", "business")}><div className = "add-account-items-inner">React Business</div></div>
                    <div className = "add-account-items" type="button" onClick={goBack}><div className = "add-account-items-inner">Go Back</div></div>
                </div>
            }
            { isInvestment &&
                <div>
                    <div className = "add-account-items"><div className = "add-account-items-inner">Stocks(Coming Soon!)</div></div>
                    <div className = "add-account-items"><div className = "add-account-items-inner">Options(Coming Soon!)</div></div>
                    <div className = "add-account-items"><div className = "add-account-items-inner">Futures(Coming Soon!)</div></div>
                    <div className = "add-account-items" type="button" onClick={goBack}><div className = "add-account-items-inner">Go Back</div></div>
                </div>  
            }
            { isCoinWallet &&
                <div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("coinWallets", "hot")}><div className = "add-account-items-inner">React Exchange Wallet</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("coinWallets", "cold")}><div className = "add-account-items-inner">React Cold Storage</div></div>
                    <div className = "add-account-items" type="button" onClick={()=>confirmAccount("coinWallets", "other")}><div className = "add-account-items-inner">Other Wallet</div></div>
                    <div className = "add-account-items" type="button" onClick={goBack}><div className = "add-account-items-inner">Go Back</div></div>
                </div> 
            }
            { isConfirm && (acctType != "cards") &&
                <div>
                    <h4>Please give the account a name: </h4><br/>
                    <input type="text" className="account-name-input" placeholder="Account Name" onChange={handleName}></input><br/>
                    <button type="button" onClick={addAccount} className="add-account-btn">Add Account</button><button  type="button" onClick={goBack} className="go-back-btn">Go Back</button>
                    
                </div>
            }
            {isConfirm && (acctType === "cards") &&
                <div className="card-input-div">
                    <div>Enter Account Name and Pin:</div>
                    <input className="account-name-input" type="text" placeholder="Account Name" onChange={handleName}></input>
                    <input className="account-name-input" type="number" placeholder="Enter 4-8 Digit Pin" onChange={handlePin}></input>
                    {(acctLevel === "debit") && 
                        <Dropdown>
                            <Dropdown.Toggle>
                                {accountForLink}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    account.balances.checking.map(((item,index)=><Dropdown.Item onClick={()=>selectAccount(index)}>{item.acctName}</Dropdown.Item>))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                    <button type="button" onClick={addAccount} className="add-account-btn">Add Account</button><button  type="button" onClick={goBack} className="go-back-btn">Go Back</button>
                </div>
            }
        </Card>
    )
}

export default AddAccount
