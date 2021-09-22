import React, {useState, useEffect, useContext} from 'react'
import useInterval from '../hooks/useInterval'
import axios from 'axios'
import { AtmObject } from '../App';
import {Modal, Button, Card} from 'react-bootstrap'
import { useMutation,  gql } from "@apollo/client";
import { makeid } from './idgenerator';
import BuyCoin from './BuyCoin';
import SellCoin from './SellCoin';

function CoinWallets() {
    const atmObject = useContext(AtmObject)
    const {account} = atmObject
    const [clicked, setClicked] = useState(false)
    const [price, setPrice] = useState(0)
    const [coinAmount, setCoinAmount] = useState(0)
    const [coinData, setCoinData] = useState([])
    const [wallet, setWallet] = useState()
    const [selected, setSelected] = useState(false)
    const [walletIndex, setWalletIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)



    const getCoinName = async()=>{
        var config = {
            method: 'get',
            url: 'https://api.coincap.io/v2/assets'
          };
          
        let reqData = await axios(config)
        if(reqData.data.data){
            setCoinData(reqData.data.data)
        }
      }

    const selectWallet = (obj, index)=>{
        setWalletIndex(index)
        setWallet(obj)
        setSelected(true)   
    }

    const handlePurchase = (e)=>{
        setCoinAmount((Number(e.target.value)/price).toFixed(8))
    }


    const buy = (coin)=>{
        setClicked(!clicked)
        console.log("price",coin)
        setPrice(Number(coin.priceUsd))
    }

    const purchase = ()=>{
        console.log("purchased!")
    }

    useEffect(()=>{
        getCoinName()
    },[])

    useInterval(()=>{
        getCoinName();
      }, 20000)

      useEffect(()=>{
        if(coinData.length > 0){
            setIsLoading(false)
        }
      }, [coinData])

    return (
        <Card id="coin-wallet-div">
            <div id="coin-wallet-list">
                <h3>List of Wallets</h3>
                {account.balances.coinWallets.map((item, index)=>
                    <div className = "coin-wallet-select" onClick={()=>selectWallet(item,index)}>
                        {item.walletName}
                    </div>
                )}
            </div>
            <div id="checking-account-list">
                <h3>Accounts for Funding</h3>
                {account.balances.checking.map(item=>
                    <div>
                        {item.acctNumber} {item.acctName} ${Number(item.balance).toFixed(2)}
                    </div>
                )}
            </div>
            { !selected &&
                <div id="coins-available"><h3 className="coin-wallet-title">Select Wallet </h3>
                And your Coins will show here</div>
            }
            { selected &&
                <div id="coins-available"><h3 className="coin-wallet-title">Coins</h3>{account.balances.coinWallets[walletIndex].coins.map((coin)=>
                    <div className="coin-in-wallet">
                        {coin.coinName} {!isLoading ? coin.balance : "Loading..."} 
                        {coinData && 
                            <div>
                                <SellCoin coinData={coinData} coin={coin} wallet = {wallet} setIsLoading = {setIsLoading} walletIndex = {walletIndex}/>
                            </div>}
                    </div>
                    )}
                </div>
            }
            <div id="coin-list"><h3>Coin Prices</h3>
                {coinData.map((coin)=>
                    <div className="twelveColGrid " onClick={()=>buy(coin)} >
                        <div className="col12">
                            {coin.symbol}
                        </div>
                        <div className="col27">
                            {coin.name}
                        </div>
                        <div className="col710">
                            ${Number(coin.priceUsd).toFixed(2)}
                        </div>
                        { wallet &&
                        <div className="colAll">
                            <BuyCoin coin={coin} wallet = {wallet}  walletIndex = {walletIndex}/>
                        </div>
                        }
                    </div>
                )}
            </div>
        </Card>
    )
}

export default CoinWallets
