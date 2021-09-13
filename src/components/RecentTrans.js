import React, { useContext } from 'react'
import { AtmObject } from '../App'

function RecentTrans({deposit, withdraw}) {
    const atmObject = useContext(AtmObject);
    const { account, user} = atmObject
    let accHist = [];

    if(withdraw === 'withdraw' && deposit ===''){
        account.accountHistory.map(item=>{
            if(item.info.type === "withdraw" || item.info.type === "withdraw*QC") accHist.push(item);
        })
    }else if(deposit === 'deposit' && withdraw === ''){
        account.accountHistory.map(item=>{
        if(item.info.type === "deposit") accHist.push(item);
        })
    }else{
        accHist = account.accountHistory
    }
    
    return (
        <div className = 'recent-trans'>
            {(accHist.length<5) ? accHist.map((item, index)=>(item.info.type === "deposit")?<div key={index}>{`Deposited: $${item.info.amount} | New Balance: $${Number(item.info.newBalance).toFixed(2)}`}</div> : <div key={index}>{`Withdraw: $${item.info.amount} | New Balance: $${Number(item.info.newBalance).toFixed(2)}`}</div>) : accHist.slice(accHist.length-5, accHist.length).map((item,index)=>(item.info.type === "deposit")?<div key={index}>{`Deposited: $${item.info.amount} | New Balance: $${Number(item.info.newBalance).toFixed(2)}`}</div> : <div key={index}>{`Withdraw: $${item.info.amount} | New Balance: $${Number(item.info.newBalance).toFixed(2)}`}</div>)}
        </div>
    )
}

export default RecentTrans
