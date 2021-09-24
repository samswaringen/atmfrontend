import React, { useContext, useState, useEffect } from 'react'
import { AtmObject } from '../App'
import { useHistory } from "react-router-dom";
import RecentTrans from './RecentTrans';
import Card from 'react-bootstrap/Card'

function Withdraw() {
    const atmObject = useContext(AtmObject)
    const { withdraw, account, user } = atmObject;

    const history = useHistory()
    
    const routeQuick = ()=>{
        history.push('/components/QuickCash')
    }

    const routeOther = ()=>{
        history.push('/components/OtherWithdraw')
    }

    return (
        <Card id="withdraw-div">
            <div className="withdraw-title-div"><h2 className = "account-balance">Account Balances</h2></div>
            <div className="account-list-div">
                <div>Checking {account.balances.checking.map((item, index)=><div key = {index} className="account-and-balance">{item.acctName}: ${Number(item.balance).toFixed(2)}</div>)}</div>
                <div >Savings {account.balances.savings.map((item, index)=><div key = {index} className="account-and-balance">{item.acctName}: ${Number(item.balance).toFixed(2)}</div>)}</div>
            </div>

            <button className = "withdraw-btn" onClick = {routeQuick}>Quick Cash</button>
            <button className = "withdraw-btn" onClick = {routeOther}>Other Amount</button>    
        </Card>
    )
};

export default Withdraw