import React, {useState, useEffect, useContext} from 'react'
import { AtmObject } from '../App'
import {Dropdown} from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import { useMutation,  gql } from "@apollo/client";
import { makeid } from './idgenerator';


function Transfer() {
    const atmObject = useContext(AtmObject)
    const { account, setAccount } = atmObject;

    const [betweenAccounts, setBetweenAccounts] = useState(false)
    const [toSomeone, setToSomeone] = useState(false)
    const [selected, setSelected] = useState(true)
    const [accountFrom, setAccountFrom] = useState('Account')
    const [accountTo, setAccountTo] = useState('Account')
    const [isMakingSureLocal, setIsMakingSureLocal] = useState(false)
    const [isMakingSureSend, setIsMakingSureSend] = useState(false)
    const [transferAmount, setTransferAmount] = useState(0)
    const [recRouting, setRecRouting] = useState(0)
    const [recAccount, setRecAccount] = useState(0)
    const [accountFromIndex, setAccountFromIndex] = useState(0)
    const [accountToIndex, setAccountToIndex] = useState(0)


    let history = useHistory()

    const TRANSFER_TO_SOMEONE = gql`
        mutation TRANSFER_TO_SOMEONE($id: String!, $dateTime: String, $routing: Int!, $acctNumber: Float!, $amount: Float!, $fromAcct: Int!, $fromAcctType: String!, $transID: String!, $fromAcctIndex: Int! ){
            transferToSomeone(id: $id, dateTime: $dateTime, routing: $routing, acctNumber: $acctNumber, amount:$amount, fromAcct: $fromAcct, fromAcctType: $fromAcctType, transID: $transID, fromAcctIndex: $fromAcctIndex){
            ok
            }
        }
      
    `

    const TRANSFER_TRANS = gql`
    mutation TRANSFER_TRANS($id: String!, $fromBal: Float!, $toBal: Float!, $transID: String!, $dateTime: String!, $type: String, $amount: Float, $newBalance: Float, $username: String, $acctFrom: String!, $acctTo: String!,  $acctNumber:Int!, $accountFromIndex: Int, $accountToIndex: Int) {
        transferTransaction(id: $id, acctFrom:$acctFrom, acctTo:$acctTo, fromBal: $fromBal, toBal:$toBal, accountFromIndex:$accountFromIndex, accountToIndex:$accountToIndex, input: {transID: $transID, username: $username, dateTime: $dateTime, info: {acctNumber: $acctNumber, acctType: $acctTo, type: $type, amount: $amount, newBalance: $newBalance}}) {
        id
        username
        accountHistory {
            transID
            dateTime
            info {
            acctNumber
            acctType
            type
            amount
            newBalance
            }
        }
        }
    }
    `;


    const ADD_ALL_DATA = gql`
    mutation ADD_All_DATA($transID: String!, $username: String!, $dateTime: String!, $type: String!, $amount: Float!, $newBalance: Float!, $acctType: String!, $acctNumber: Int!) {
        addToAllData(input: {transID: $transID, username: $username, dateTime: $dateTime, info: {acctNumber: $acctNumber, acctType: $acctType, type: $type, amount: $amount, newBalance: $newBalance}}) {
            transID
            dateTime
            info {
                acctNumber
                acctType
                type
                amount
                newBalance
            }
        }
    }
    `;

    const [transferTransaction,{loading:loadingTrans, error: errorTrans, data: dataTrans}] = useMutation(TRANSFER_TRANS)
    const [transferToSomeone,{loading:loadingSend, error: errorSend, data: dataSend}] = useMutation(TRANSFER_TO_SOMEONE)
    const [addToAllData,{loading:loadingAll, error: errorAll, data: dataAll}] = useMutation(ADD_ALL_DATA)

    const setTransfer = (transfer)=>{
        setSelected(false)
        if(transfer === 'between'){
            setBetweenAccounts(true)
        }else{
            setToSomeone(true)
        }   
    }

    const selectAccount = (account, fromTo, index)=>{
        if(fromTo === 'from'){
            switch(account){
                case "checking" :
                    setAccountFrom("checking")
                    setAccountFromIndex(index)
                    break;
                case "savings" :
                    setAccountFrom("savings")
                    setAccountFromIndex(index)
                    break;
                case "cards" :
                    setAccountFrom("cards")
                    setAccountFromIndex(index)
                    break;
                case "coins" :
                    setAccountFrom("coins")
                    setAccountFromIndex(index)
                    break;
                case "investments" :
                    setAccountFrom("investments")
                    setAccountFromIndex(index)
                    break;
            }
            if(account === accountTo){
                setAccountTo("Account")
            }
        }else{
            switch(account){
                case "checking" :
                    setAccountTo("checking")
                    setAccountToIndex(index)
                    break;
                case "savings" :
                    setAccountTo("savings")
                    setAccountToIndex(index)
                    break;
                case "cards" :
                    setAccountTo("cards")
                    setAccountToIndex(index)
                    break;
                case "coins" :
                    setAccountTo("coins")
                    setAccountToIndex(index)
                    break;
                case "investments" :
                    setAccountTo("investments")
                    setAccountToIndex(index)
                    break;
            }
        }
    }

    const cancel = ()=>{
        setIsMakingSureLocal(false)
        setIsMakingSureSend(false)
    }

    const confirmTransToSomeone = ()=>{
        setIsMakingSureSend(true)
    }
    const transToSomeone = ()=>{
        let fromBalance = account.balances[accountFrom][accountFromIndex].balance - transferAmount
        let transID = makeid(30)
        let newDate = new Date()
        transferToSomeone({variables : {id: account.id, dateTime: newDate,routing: recRouting, acctNumber: recAccount, amount:transferAmount, fromAcct: account.balances[accountFrom][accountFromIndex].acctNumber, fromAcctType: accountFrom, transID: transID, fromAcctIndex: accountFromIndex}})
        setAccount(account, account.balances[accountFrom][accountFromIndex].balance = fromBalance);
        setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances[accountFrom][accountFromIndex].acctNumber, acctType: accountFrom, type: `transferTo${recRouting}`, amount: transferAmount, newBalance: fromBalance}}));
        setIsMakingSureSend(false)
    }

    const confirmTransfer = ()=>{
        setIsMakingSureLocal(true)
    }

    const transfer = ()=>{
        let fromBalance = account.balances[accountFrom][accountFromIndex].balance - transferAmount
        let toBalance = account.balances[accountTo][accountToIndex].balance + transferAmount
        let transID = makeid(25)
        let newDate = new Date()
        transferTransaction({variables:{id : account.id, acctFrom: accountFrom, acctTo: accountTo, fromBal: fromBalance, toBal: toBalance, transID:transID, username: account.username, dateTime: newDate, type: `transfer from ${accountFrom}`, amount: transferAmount, newBalance: toBalance, acctType: accountTo, acctNumber: account.balances[accountTo][accountToIndex].acctNumber, accountFromIndex: accountFromIndex, accountToIndex: accountToIndex}})
        addToAllData({variables:{transID:transID, username:account.username, dateTime: newDate, type: `transfer from ${accountFrom}`, amount: transferAmount, newBalance: toBalance, acctType: accountTo, acctNumber: account.balances[accountTo][accountToIndex].acctNumber}})
        setAccount(account, account.balances[accountTo][accountToIndex].balance = toBalance, account.balances[accountFrom][accountFromIndex].balance = fromBalance);
        setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances[accountTo][accountToIndex].acctNumber, acctType: accountTo, type: `transfer from ${accountFrom}`, amount: transferAmount, newBalance: toBalance}}));
        setIsMakingSureLocal(false)
    }


    const goBack = ()=>{
        setSelected(true)
        setBetweenAccounts(false)
        setToSomeone(false)
        setAccountFrom("Account")
        setAccountTo("Account")
    }

    const handleAmount =(e)=>{
        setTransferAmount(Number(e.target.value))
    }
    const handleRouting =(e)=>{
        setRecRouting(Number(e.target.value))
    }
    const handleAccount =(e)=>{
        setRecAccount(Number(e.target.value))
    }


        return (
            <div>
                <div className="select-title">Transfer?</div>
                { selected &&
                    <>
                        <div className = "add-account-items" type="button" onClick={()=>setTransfer('between')}><div className = "add-account-items-inner">Between Accounts</div></div>
                        <div className = "add-account-items" type="button" onClick={()=>setTransfer('toSomeone')}><div className = "add-account-items-inner">To Someone Else</div></div>
                    </>
                }

                { betweenAccounts &&
                    <>
                    <div>
                    From
                        <Dropdown >
                            <Dropdown.Toggle style={{backgroundColor:'black', border:'1px solid black', width:'175px'}}>
                                {accountFrom}: ${(accountFrom != "Account") && account.balances[accountFrom][accountFromIndex].balance}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {<>
                                    {<Dropdown.Header>Checking</Dropdown.Header>}
                                    {account.balances.checking.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('checking', 'from', index)}><strong>{item.acctName}</strong> Balance: ${item.balance}</Dropdown.Item>)}
                                </>
                                }{<>
                                {<Dropdown.Header>Savings</Dropdown.Header>}
                                    {account.balances.savings.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('savings', 'from', index)}><strong>{item.acctName}</strong> Balance: ${item.balance}</Dropdown.Item>)}
                                    </>
                                }{ (account.balances.cards) &&
                                    account.balances.cards.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('cards', 'from', index)}>Card: {item.acctName}</Dropdown.Item>)
                                }{ (account.balances.coins) &&
                                    account.balances.coins.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('coins', 'from', index)}>Coin: {item.coinName}</Dropdown.Item>)
                                }{ (account.balances.investments) &&
                                    account.balances.investments.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('investments', 'from', index)}>Investment: {item.acctName}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </div>
                    <div>
                    To
                        <Dropdown >
                            <Dropdown.Toggle style={{backgroundColor:'black', border:'1px solid black', width:'175px'}}>
                            {accountTo}: ${(accountTo != "Account") && account.balances[accountTo][accountToIndex].balance}
                            </Dropdown.Toggle>
                            <Dropdown.Menu >
                                {<>
                                    {<Dropdown.Header>Checking</Dropdown.Header>}
                                   {account.balances.checking.map((item,index)=> 
                                    <>
                                        {(index === accountFromIndex && accountFrom === "checking") ? <div key = {index}></div> : <Dropdown.Item key = {index} onClick = {()=>selectAccount('checking', 'to', index)}><strong>{item.acctName}</strong> Balance: ${item.balance}</Dropdown.Item> }
                                    </>
                                    )}
                                    </>
                                }{<>
                                    {<Dropdown.Header>Savings</Dropdown.Header>}
                                    {account.balances.savings.map((item,index)=>
                                    <>
                                        {(index === accountFromIndex && accountFrom === "savings") ? <div key = {index}></div> : <Dropdown.Item key = {index} onClick = {()=>selectAccount('savings', 'to', index)}><strong>{item.acctName}</strong> Balance: ${item.balance}</Dropdown.Item> }
                                    </>
                                        )}
                                    </>
                                }{ (account.balances.cards) &&
                                    account.balances.cards.map((item,index)=>
                                    <>
                                        {(index === accountFromIndex && accountFrom === "cards") ? <div key = {index}></div> : <Dropdown.Item key = {index} onClick = {()=>selectAccount('cards', 'to', index)}>Card: {item.acctName}</Dropdown.Item> }
                                    </>
                                    )
                                }{ (account.balances.coins) &&
                                    account.balances.coins.map((item,index)=>
                                    <>
                                        {(index === accountFromIndex && accountFrom === "coins") ? <div key = {index}></div> : <Dropdown.Item key = {index} onClick = {()=>selectAccount('coins', 'to', index)}>Coin: {item.coinName}</Dropdown.Item>}
                                    </>
                                    )
                                }{ (account.balances.investments) &&
                                    account.balances.investments.map((item,index)=>
                                    <>
                                        {(index === accountFromIndex && accountFrom === "investments") ? <div key = {index}></div> : <Dropdown.Item key = {index} onClick = {()=>selectAccount('investments', 'to', index)}>Investment: {item.acctName}</Dropdown.Item>}
                                    </>
                                    )
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div><br/>
                    <input type="number" placeholder="Amount" onChange={handleAmount}></input><br/>
                    <button type="submit" onClick={confirmTransfer}>Submit</button>
                    <button type="button" onClick={goBack}>Go Back</button>
                    </>

                }
                { toSomeone &&
                    <>
                    <div>
                    From
                        <Dropdown>
                            <Dropdown.Toggle style={{backgroundColor:'black', border:'1px solid black', width:'175px'}}>
                            {accountFrom}: ${(accountFrom != "Account") && account.balances[accountFrom][accountFromIndex].balance}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {<> {<Dropdown.Header>Checking</Dropdown.Header>}
                                    {account.balances.checking.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('checking', 'from', index)}><strong>{item.acctName}</strong> Balance: {item.balance}</Dropdown.Item>)}
                                </>
                                }{<> {<Dropdown.Header>Checking</Dropdown.Header>}
                                   {account.balances.savings.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('savings', 'from', index)}><strong>{item.acctName}</strong> Balance: {item.balance}</Dropdown.Item>)}
                                    </>
                                }{ (account.balances.cards) &&
                                    account.balances.cards.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('cards', 'from', index)}>Card: {item.acctName}</Dropdown.Item>)
                                }{ (account.balances.coins) &&
                                    account.balances.coins.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('coins', 'from', index)}>Coin: {item.coinName}</Dropdown.Item>)
                                }{ (account.balances.investments) &&
                                    account.balances.investments.map((item,index)=><Dropdown.Item key = {index} onClick = {()=>selectAccount('investments', 'from', index)}>Investment: {item.acctName}</Dropdown.Item>)
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <input type="number" placeholder="Amount" onChange={handleAmount}></input>
                    <div><div>To</div>
                        <input type="number" placeholder="Enter Routing#" onChange={handleRouting}></input><br/>
                        <input type="number" placeholder="Enter Account#" onChange={handleAccount}></input><br/>
                        <button type="submit" onClick={confirmTransToSomeone}>Submit</button>
                        <button type="button" onClick={goBack}>Go Back</button>
                    </div>
                    </>

                }
                {isMakingSureLocal &&
                    <div>
                        Are you sure you want to transfer {transferAmount} from {accountFrom} to {accountTo}?
                            <button type="button" onClick={transfer}>Confirm</button>
                            <button type="button" onClick={cancel}>Cancel</button>
                    </div>
                }
                {isMakingSureSend &&
                    <div>
                        Are you sure you want to transfer {transferAmount} from {accountFrom} to Routing:{recRouting} Account:{recAccount}?
                            <button type="button" onClick={transToSomeone}>Confirm</button>
                            <button type="button" onClick={cancel}>Cancel</button>
                    </div>
                }
            </div>
        )
}

export default Transfer
