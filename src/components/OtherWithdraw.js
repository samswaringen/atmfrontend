import React, { useContext, useState, useEffect } from 'react'
import { AtmObject } from '../App';
import RecentTrans from './RecentTrans';
import Card from 'react-bootstrap/Card'
import { useMutation,  gql } from "@apollo/client";
import { makeid } from './idgenerator';

function OtherWithdraw() {
    const atmObject = useContext(AtmObject)
    const { withdraw, setWithdraw, account, setAccount } = atmObject;

    const [valueEntered, setValueEntered] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [accountSelected, setAccountSelecetd] = useState("")
    const [accountIndex, setAccountIndex] = useState(0)

    const ADD_TRANS = gql`
    mutation ADD_TRANS($id: String!, $balance: Float!, $transID: String!, $dateTime: String!, $type: String, $amount: Float, $newBalance: Float, $username: String, $acctType: String!,  $acctNumber:Int!, $acctIndex: Int!) {
        addTransaction(id: $id, acctType:$acctType, acctIndex:$acctIndex, balance:$balance, input: {transID: $transID, username: $username, dateTime: $dateTime, info: {acctNumber: $acctNumber, acctType: $acctType, type: $type, amount: $amount, newBalance: $newBalance}}) {
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

    const [addTransaction,{loading:loadingTrans, error: errorTrans, data: dataTrans}] = useMutation(ADD_TRANS)
    const [addToAllData,{loading:loadingAll, error: errorAll, data: dataAll}] = useMutation(ADD_ALL_DATA)


    const withdrawMoney = ()=>{
        let withdraw = Number(document.getElementById('withdraw').value)
        if(document.getElementById('withdraw').value === ' '){
            alert("Your deposit is Not a Number")
            return
        }
        if(withdraw < 0){
            alert("You cannot deposit a negative amount")
            return
        }
        if((account.balances[accountSelected][accountIndex].balance - withdraw) < 0){
            return alert(`You don't have the funds!`)
        }else{
            let newAmount = account.balances[accountSelected][accountIndex].balance - withdraw;
            let transID = makeid(30)
            let newDate = new Date()
            addTransaction({variables:{id : account.id, balance : newAmount, transID:transID, username: account.username, dateTime: newDate, type: "withdraw", amount: withdraw, newBalance: newAmount, acctType: accountSelected, acctIndex: accountIndex, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
            addToAllData({variables:{transID:transID, username:account.username, dateTime: newDate, type: "withdraw", amount: withdraw, newBalance: newAmount, acctType: accountSelected, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
            setAccount(account, account.balances[accountSelected][accountIndex].balance = newAmount);
            setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances[accountSelected][accountIndex].acctNumber, acctType: accountSelected, type: "withdraw", amount: withdraw, newBalance: newAmount}}));
            setWithdraw(withdraw);
            document.getElementById('withdraw').value = 0;
        }
    }

    const handleWithdraw = ()=>{
        (document.getElementById('withdraw').value != '') ? setValueEntered(true) : setValueEntered(false)
        let newwithdraw = document.getElementById('withdraw').value;
        setWithdraw(newwithdraw);
    }

    const selectAccount=(selected, index)=>{
        setAccountSelecetd(selected)
        setAccountIndex(index)
        setIsSelected(true)
    }
    const goBack =()=>{
        setIsSelected(false)
    }


    return (
        <Card id="other-withdraw-card">
            { !isSelected && 
            <>
                <div className="select-title">Select Account</div>
                <div className="deposit-account-title">Checking</div> <div>{account.balances.checking.map((item, index)=><div className = "add-account-items" key = {index} type="button" onClick={()=>selectAccount("checking", index)}><div className = "add-account-items-inner">{item.acctName}: ${Number(item.balance).toFixed(2)}</div></div>)}</div>
                <div className="deposit-account-title">Savings </div> <div> {account.balances.savings.map((item, index)=><div className = "add-account-items" key = {index} type="button" onClick={()=>selectAccount("savings", index)}><div className = "add-account-items-inner">{item.acctName}: ${Number(item.balance).toFixed(2)}</div></div>)}</div>
            </>
            }{ isSelected &&
            <>
                <h4 className = "account-balance"><span className="account-selected-title">Account Selected<br/></span><span className='balance-amount'>{account.balances[accountSelected][accountIndex].acctName} {account.balances[accountSelected][accountIndex].acctNumber}</span></h4>
                <h3 className = "account-balance"><span className="account-selected-title">Account Balance<br/></span><span className='balance-amount'>${account.balances[accountSelected][accountIndex].balance.toLocaleString('en-us')}</span></h3>
                <div id = "other-withdraw">
                    <span className="font-size-20">$</span> <input type = 'number' id = 'withdraw' onChange = {handleWithdraw} placeholder="Withdraw Amount"></input>
                    <button id = 'other-button'onClick = {withdrawMoney} disabled = {!valueEntered}>Withdraw</button>
                </div>
                <div type="button" className = "change-account-other" onClick={goBack}>&larr; Change Account</div>
            </>
            }
        </Card>
    )
}

export default OtherWithdraw
