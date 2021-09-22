import React, {useContext, useState} from 'react'
import { AtmObject } from '../App'
import { useHistory } from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap'
import { useMutation,  gql } from "@apollo/client";
import { makeid } from './idgenerator';
import { SSL_OP_NETSCAPE_CA_DN_BUG } from 'constants';

function SellCoin({ coinData, coin, wallet, setIsLoading, walletIndex }) {
    const atmObject = useContext(AtmObject)
    const {account, setAccount} = atmObject;

    const [clicked, setClicked] = useState(false)
    const [price, setPrice] = useState(0)
    const [coinAmount, setCoinAmount] = useState(0)
    const [capitalAmount, setCapitalAmount] = useState(0)
    const [accountTo, setAccountTo] = useState()
    const [accountIndex, setAccountIndex] = useState(0)

    const history = useHistory();

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

    const [editCoin,{loading:loadEdit,error:erorEdit,data: dateEdit}] = useMutation(EDIT_COIN)
    const [addTransaction,{loading:loadingTrans, error: errorTrans, data: dataTrans}] = useMutation(ADD_TRANS)

    const sell=()=>{
        setClicked(!clicked)
        let sellCoin = coinData.filter(item=>item.name === coin.coinName)
        console.log("sellcoin:",sellCoin[0])
        setPrice(Number(sellCoin[0].priceUsd))
    }

    const handleSale = (e)=>{
        setCoinAmount(Number(e.target.value))
        setCapitalAmount((Number(e.target.value)*price).toFixed(8))
    }

    const handleCheckBox = (account, index)=>{
        setAccountIndex(index)
        setAccountTo(account)
    }

    const getCapital = ()=>{
        let transID = makeid(30)
        let newDate = new Date()
        let coinIndex, acctCoin;
        let sellCoin = coinData.filter(item=>item.name === coin.coinName)
        wallet.coins.map((item,index)=>{
            if(item.coinName === sellCoin[0].name){
                acctCoin = item
                coinIndex = index
                
            }
        })
        let newAmount = account.balances.checking[accountIndex].balance + Number(capitalAmount)
        addTransaction({variables : {
            id : account.id, 
            balance : newAmount, 
            transID: transID, 
            username: account.username, 
            dateTime: newDate, 
            type: "coin sale", 
            amount: Number(capitalAmount), 
            newBalance: newAmount, 
            acctType: "checking", 
            acctIndex: accountIndex, 
            acctNumber: account.balances.checking[accountIndex].acctNumber
        }})
        let coinBalance = Number(coin.balance) - Number(coinAmount)
        editCoin({variables : {
            id:account.id,
            walletName: wallet.walletName,
            coinName: coin.name,
            coinIndex: coinIndex,
            balance: coinBalance,
            coinTransID: transID,
            dateTime: newDate,
            type: "sell",
            amount: Number(coinAmount),
        }})
        setAccount(account, account.balances.checking[accountIndex].balance = newAmount, account.balances.coinWallets[walletIndex].coins[coinIndex].balance = coinBalance);
        setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances.checking[accountIndex].acctNumber, acctType: "checking", type: "coin sale", amount:  Number(capitalAmount), newBalance: newAmount}}));
        setIsLoading(true)
        setClicked(!clicked)
    }

    return (
        <div className="sell-div">
            <button className= "sell-btn" onClick={sell}>
                Sell
            </button>
            {clicked && 
                <Modal.Dialog className="sell-modal">
                <Modal.Header>
                    <Modal.Title>{`Sell ${coin.coinName}`}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                {`Accounts:`}{account.balances.checking.map((item, index)=><div><input type="checkbox" id={item.acctNumber} onChange={()=>handleCheckBox(item, index)}></input><label>{item.acctName} ${item.balance}</label></div>)}
                <input id = 'sell-input' type='number' placeholder='Enter Amount' onChange={handleSale}></input>
                <div>{`Total USD: ${capitalAmount}`}</div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={sell}>Close</Button>
                    <Button variant="primary" onClick={getCapital}>Sell</Button>
                </Modal.Footer>
                </Modal.Dialog>
            }
        </div>
    )
}

export default SellCoin
