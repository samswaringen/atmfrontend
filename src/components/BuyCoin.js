import React, {useContext, useState} from 'react'
import { AtmObject } from '../App'
import { useHistory } from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap'
import { useMutation,  gql } from "@apollo/client";
import { makeid } from './idgenerator';

function BuyCoin({ coin, wallet, walletIndex }) {
    const atmObject = useContext(AtmObject)
    const {account, setAccount} = atmObject;

    const [clicked, setClicked] = useState(false)
    const [isFiat, setIsFiat] = useState(true)
    const [price, setPrice] = useState(0)
    const [coinAmount, setCoinAmount] = useState(0)
    const [buyValue, setBuyValue] = useState(0)
    const [isConfirm, setIsConfirm] = useState(false)
    const [accountFrom, setAccountFrom] = useState()
    const [accountSelected, setAccountSelected] = useState(false)
    const [accountIndex, setAccountIndex] = useState(0)

    const history = useHistory();

    const ADD_COIN = gql`
    mutation ADD_COIN($id: String, $walletName: String, $coinName: String, $coinID: String, $balance: Float, $coinTransID: String, $dateTime: String, $type: String, $amount: Float) {
        addCoin(id: $id, walletName: $walletName, input: {coinName: $coinName, id: $coinID, balance: $balance, activity: {id: $coinTransID, dateTime: $dateTime, type: $type, amount: $amount}}) {
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
      }
      `
      const EDIT_COIN = gql`
      mutation EDITCOIN($id: String, $walletName: String, $coinIndex: Int, $balance: Float, $coinTransID: String, $dateTime: String, $type: String, $amount: Float) {
        editCoin(id: $id, walletName: $walletName, coinIndex: $coinIndex, balance: $balance, input: {id: $coinTransID, dateTime: $dateTime, type: $type, amount: $amount}) {
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
      }
      `

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

    
    const [addCoin,{loading,error,data}] = useMutation(ADD_COIN)
    const [editCoin,{loading:loadEdit,error:erorEdit,data: dateEdit}] = useMutation(EDIT_COIN)
    const [addTransaction,{loading:loadingTrans, error: errorTrans, data: dataTrans}] = useMutation(ADD_TRANS)

    const buy = ()=>{
            setClicked(!clicked)
            console.log("price",coin)
            setPrice(Number(coin.priceUsd))
            setIsConfirm(false)
    }
    
    const handlePurchase = (e)=>{
        setBuyValue(Number(e.target.value))
        setCoinAmount((Number(e.target.value)/price).toFixed(8))
    }
    const handleCheckBox = (account, index)=>{
        setAccountIndex(index)
        setAccountSelected(!accountSelected)
        setAccountFrom(account)
    }
    const cancelConfirm = ()=>{
        setIsConfirm(false)
    }

    const confirm = ()=>{
        setIsConfirm(true)
        
    }
    const purchase = ()=>{
        if(accountFrom.balance < buyValue){
            return alert(`You don't have the funds!`)
        }
        let transID = makeid(30)
        let newDate = new Date()
        let coinIndex, acctCoin;
        wallet.coins.map((item,index)=>{
            if(item.coinName === coin.name){
                acctCoin = item
                coinIndex = index
            }
        }) 
        let newAmount = accountFrom.balance - buyValue
        console.log("coinAmount", coinAmount)
        addTransaction({variables : {
            id : account.id, 
            balance : newAmount, 
            transID: transID, 
            username: account.username, 
            dateTime: newDate, 
            type: "coin purchase", 
            amount: buyValue, 
            newBalance: newAmount, 
            acctType: "checking", 
            acctIndex: accountIndex, 
            acctNumber: account.balances.checking[accountIndex].acctNumber
        }})
        if(!acctCoin || acctCoin.length === 0){
            addCoin({variables : {
                id:account.id,
                walletName: wallet.walletName,
                coinName: coin.name,
                coinID: coin.id,
                balance: Number(coinAmount),
                coinTransID: transID,
                dateTime: newDate,
                type: "buy",
                amount: Number(coinAmount)
            }})
            setAccount(account, account.balances.checking[accountIndex].balance = newAmount, account.balances.coinWallets[walletIndex].coins.push({coinName:coin.name, id: coin.id, balance: Number(coinAmount), activity: [{id:transID, dateTime: newDate, type:"buy", amount: Number(coinAmount)}]}));
            setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances.checking[accountIndex].acctNumber, acctType: "checking", type: "coin purchase", amount: coinAmount, newBalance: newAmount}}));
        }else {
            let coinBalance = Number(acctCoin.balance) + Number(coinAmount)
            editCoin({variables : {
                id:account.id,
                walletName: wallet.walletName,
                coinName: coin.name,
                coinIndex: coinIndex,
                balance: coinBalance,
                coinTransID: transID,
                dateTime: newDate,
                type: "buy",
                amount: Number(coinAmount),
            }})
            setAccount(account, account.balances.checking[accountIndex].balance = newAmount, account.balances.coinWallets[walletIndex].coins[coinIndex].balance = coinBalance);
            setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances.checking[accountIndex].acctNumber, acctType: "checking", type: "coin purchase", amount: coinAmount, newBalance: newAmount}}));
        }
        setIsConfirm(false)  
        setClicked(!clicked) 
    }


    return (
        <div>
        <button className= "buy-btn" onClick={buy}>
            Buy
        </button>
        {clicked && 
            <Modal.Dialog className="buy-modal">
            <Modal.Header>
                <Modal.Title>{`Buy ${coin.name}`}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {!isConfirm ? <>
                {`Available Funds in checking Accounts:`}{account.balances.checking.map((item, index)=><div><input type="checkbox" id={item.acctNumber} onChange={()=>handleCheckBox(item, index)}></input><label>{item.acctName} ${item.balance}</label></div>)}
                <input id = 'purchase-input' type='number' placeholder='Enter Amount' onChange={handlePurchase}></input>
                {isFiat ? <div>{`Total ${coin.id}: ${coinAmount}`}</div> : <div></div>}
                </> :
                 <>
                    Are you sure you want to purchase {coinAmount} of {coin.name} at ${Number(coin.priceUsd).toFixed(2)}/per from {accountFrom.acctName} {accountFrom.acctNumber}
                </>
                }
            </Modal.Body>

            <Modal.Footer>
                {!isConfirm ? 
                    <>
                        <Button variant="secondary" onClick={buy}>Close</Button>
                        <Button variant="primary" onClick={confirm} disabled = {!accountSelected}>Confirm Purchase</Button>
                    </> : <>
                        <Button variant="secondary" onClick={cancelConfirm}>Cancel</Button>
                        <Button variant="primary" onClick={purchase}>Purchase</Button>
                    </>
                }
                
            </Modal.Footer>
            </Modal.Dialog>
        }
        </div>
    )
}

export default BuyCoin
