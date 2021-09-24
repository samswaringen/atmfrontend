import React, {useContext} from 'react'
import { AtmObject } from '../App'

function HistoryList() {
    const atmObject = useContext(AtmObject)
    const {account} = atmObject;
    return (
        <div>
            {
                account.accountHistory.map((item, index)=>
                    (item.info.type === "withdraw" || item.info.type === "withdraw*QC") ?
                        <li key = {index} className = "sevenColGrid" style={{color:'red'}}>
                            <div className= "col1">{(new Date(item.dateTime).getMonth())+1}-{new Date(item.dateTime).getDate()}-{new Date(item.dateTime).getFullYear()}</div>
                            Withdrew 
                            <strong>${item.info.amount}</strong> 
                            <strong> from {item.info.acctType}</strong>  
                            <strong>{item.info.acctNumber}</strong> 
                            New Balance:
                            <strong>${Number(item.info.newBalance).toFixed(2)}</strong>
                        </li>
                    : (item.info.type === "deposit") ?
                        <li key = {index} className = "sevenColGrid" style={{color:'green'}}>
                            <div>{(new Date(item.dateTime).getMonth())+1}-{new Date(item.dateTime).getDate()}-{new Date(item.dateTime).getFullYear()}</div> 
                            Deposited 
                            <strong>${item.info.amount}</strong> 
                            <strong> to {item.info.acctType}</strong>  
                            <strong>{item.info.acctNumber}</strong>  
                            New Balance:
                            <strong>${Number(item.info.newBalance).toFixed(2)}</strong>
                        </li>
                    : (item.info.type === "coin sale") ?
                        <li key = {index} className = "sevenColGrid" style={{color:'black'}}>
                            <div>{(new Date(item.dateTime).getMonth())+1}-{new Date(item.dateTime).getDate()}-{new Date(item.dateTime).getFullYear()}</div>
                            {item.info.type} 
                            <strong>${(item.info.amount).toFixed(2)}</strong> 
                            <strong>to {item.info.acctType}</strong> 
                            <strong>{item.info.acctNumber}</strong> 
                            New Balance:
                            <strong>${Number(item.info.newBalance).toFixed(2)}</strong>
                        </li>
                    :  (item.info.type === "coin purchase") ?
                        <li key = {index} className = "sevenColGrid" style={{color:'black'}}>
                            <div>{(new Date(item.dateTime).getMonth())+1}-{new Date(item.dateTime).getDate()}-{new Date(item.dateTime).getFullYear()}</div>
                            {item.info.type} 
                            <strong>${(item.info.amount).toFixed(2)}</strong> 
                            <strong>from {item.info.acctType}</strong> 
                            <strong>{item.info.acctNumber}</strong> 
                            New Balance:
                            <strong>${Number(item.info.newBalance).toFixed(2)}</strong>
                        </li>
                    : <li key = {index} className = "sevenColGrid" style={{color:'black'}}>
                        <div>{(new Date(item.dateTime).getMonth())+1}-{new Date(item.dateTime).getDate()}-{new Date(item.dateTime).getFullYear()}</div>
                        {item.info.type} 
                        <strong>from {item.info.acctType}</strong> 
                        <strong>{item.info.acctNumber}</strong>
                        <strong>${item.info.amount}</strong>  
                        New Balance:
                        <strong>${Number(item.info.newBalance).toFixed(2)}</strong>
                    </li>
                )
            }
        </div>
    )
}

export default HistoryList
