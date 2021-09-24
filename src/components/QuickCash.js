import React, { useState, useContext, useEffect } from 'react'
import { AtmObject } from '../App';
import RecentTrans from './RecentTrans';
import Card from 'react-bootstrap/Card'
import { useMutation,  gql } from "@apollo/client";
import { makeid } from './idgenerator';

function QuickCash() {
    const atmObject = useContext(AtmObject)
    const { setWithdraw, account, setAccount, user} = atmObject

    const [isSelected, setIsSelected] = useState(false)
    const [accountSelected, setAccountSelected] = useState("")
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

    const [addTransaction,{loading, error, data}] = useMutation(ADD_TRANS)
    const [addToAllData,{loading:loadingAll, error: errorAll, data: dataAll}] = useMutation(ADD_ALL_DATA)



    const withdrawMoney = (e)=>{
    let amount = e.target.value;
    if((account.balances[accountSelected][accountIndex].balance - amount) < 0){
        return alert(`You don't have the funds!`)
    }else{
        let newAmount = account.balances[accountSelected][accountIndex].balance - Number(amount);
        let transID = makeid(30)
        let newDate = new Date()
        let transType = "withdraw*QC"
        addTransaction({variables:{id : account.id, balance : newAmount, transID:transID, username: account.username, dateTime: newDate, type: "withdraw*QC", amount: Number(amount), newBalance: newAmount, acctType: accountSelected, acctIndex: accountIndex, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
        addToAllData({variables:{transID:transID, username:account.username, dateTime: newDate, type: "withdraw*QC", amount: Number(amount), newBalance: newAmount, acctType: accountSelected, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
        setAccount(account, account.balances[accountSelected][accountIndex].balance = newAmount);
        setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances[accountSelected][accountIndex].acctNumber, acctType: accountSelected, type: "withdraw*QC", amount: Number(amount), newBalance: newAmount}}));
        setWithdraw(amount);

        }
    }

    const selectAccount=(selected, index)=>{
        setAccountSelected(selected)
        setAccountIndex(index)
        setIsSelected(true)
    }
    const goBack =()=>{
        setIsSelected(false)
    }



    return (
        <Card  id = 'addStuff'> 
        { !isSelected && 
            <>
                <div className="select-title">Select Account</div>
                <div className="deposit-account-title">Checking</div> <div>{account.balances.checking.map((item, index)=><div key = {index} className = "add-account-items" type="button" onClick={()=>selectAccount("checking", index)}><div className = "add-account-items-inner">{item.acctName}: ${Number(item.balance).toFixed(2)}</div></div>)}</div>
                <div className="deposit-account-title">Savings </div> <div>{account.balances.savings.map((item, index)=><div key = {index} className = "add-account-items" type="button" onClick={()=>selectAccount("savings", index)}><div className = "add-account-items-inner">{item.acctName}: ${Number(item.balance).toFixed(2)}</div></div>)}</div>
            </>
        }{ isSelected &&
            <>
            <h4 className = "account-balance"><span className="account-selected-title">Account Selected<br/></span><span className='balance-amount'>{account.balances[accountSelected][accountIndex].acctName} {account.balances[accountSelected][accountIndex].acctNumber}</span></h4>
            <div type="button" className = "change-account-quick" onClick={goBack}><p>&larr; Change Account</p></div>
            <h3 className = "account-balance"><span className="account-selected-title">Account Balance<br/></span><span className='balance-amount'>${account.balances[accountSelected][accountIndex].balance.toLocaleString('en-us')}</span></h3>
                <div id= "quickcash-div">
                    Select an amount:
                    <div>
                        <button className = "quick-btn" value= '20' onClick={withdrawMoney}>$20</button>
                        <button className = "quick-btn" value= '80' onClick={withdrawMoney}>$80</button>
                    </div>
                    <div>
                    <button className = "quick-btn" value= '40' onClick={withdrawMoney}>$40</button>
                    <button className = "quick-btn" value= '100' onClick={withdrawMoney}>$100</button>
                    </div>
                    <div>
                        <button className = "quick-btn" value= '60' onClick={withdrawMoney}>$60</button>
                        <button className = "quick-btn" value= '200' onClick={withdrawMoney}>$200</button>
                    </div> 
                </div>
            </>
        }
        </Card>
    )
}

export default QuickCash
