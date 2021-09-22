import React, { useContext, useEffect } from 'react'
import { AtmObject } from '../App'
import SignIn from './SignIn'
import { useHistory } from "react-router-dom";
import RecentTrans from "./RecentTrans"
import Card from 'react-bootstrap/Card'
import Cookies from 'universal-cookie';

function Home() {
    const atmObject = useContext(AtmObject);
    const { account, user, isVerified, isEmployee, setIsEmployee, isATM} = atmObject

    let history = useHistory()

    const cookies = new Cookies();

    const quickCash = ()=>{
        history.push('/components/QuickCash')
    }


    useEffect(()=>{ 
        if(!isVerified){
            cookies.remove('tokenHead', {path: '/',sameSite: 'strict'})
            cookies.remove('tokenSig', {path: '/',sameSite: 'strict', secure: true})
        }
        setIsEmployee(false)
        !isVerified && document.getElementById('online banking-nav-div').classList.add('title-background')
    },[])
    return (
        <Card id = "home">
            {isVerified ? 
            (<div id="home-div">
                <div id="profile-div">
                <h1 id="greeting">Hello {account.name}!</h1>
                <h5>Account Routing: {account.routing}</h5><br/>
                { isATM &&
                    <button id = "quickcash-shortcut" onClick={quickCash}>Quick Cash</button>
                }
                <div id="recent-transactions">Recent Transactions <RecentTrans withdraw={'withdraw'} deposit={"deposit"}/></div>
                </div>
                <div id="divider"></div>
                <div id="account-balances-div">
                    <h4 id = "account-balance">Account Balances</h4>
                    <h5 id = "account-balance">Checking </h5>
                        <div className='balance-amount'>
                            {<div className="fourColGrid">
                            <div className="col1">Account Name</div>
                                <div className="col2">Account Type</div>
                                <div className="col3">Account Number</div>
                                <div className="col4">Balance</div>
                            </div>}
                            {account.balances.checking.map((item, index)=> 
                            <div className="fourColGrid" key={index}>
                                <div className="col1">{item.acctName}</div>
                                <div className="col2">{item.acctType}</div>  
                                <div className="col3">{item.acctNumber}</div> 
                                <div className="col4">${item.balance.toLocaleString('en-us')}</div>
                            </div>)}
                        </div><br/>
                    <h5 id = "account-balance">Savings</h5> 
                        <div className='balance-amount'>
                            {<div className="fourColGrid">
                                <div className="col1">Account Name</div>
                                <div className="col2">Account Type</div>
                                <div className="col3">Account Number</div>
                                <div className="col4">Balance</div>
                            </div>}
                            {account.balances.savings.map((item, index)=> 
                            <div className="fourColGrid" key={index}>
                                <div className="col1">{item.acctName}</div>
                                <div className="col2">{item.acctType}</div>  
                                <div className="col3">{item.acctNumber}</div> 
                                <div className="col4">${item.balance.toLocaleString('en-us')}</div>
                            </div>)}
                        </div><br/>
                        {(account.balances.cards.length > 0) && <>
                            <h5 id = "account-balance">Cards</h5> 
                            <div className='balance-amount'>
                                {<div className="fourColGrid">
                                    <div className="col1">Account Name</div>
                                    <div className="col2">Account Type</div>
                                    <div className="col3">Card Number</div>
                                    <div className="col4">Available Balance</div>
                                </div>}
                                {account.balances.cards.map((item, index)=> 
                                    <div className="fourColGrid" key={index}>
                                        <div className="col1">{item.acctName}</div>
                                        <div className="col2">{item.acctType}</div>  
                                        <div className="col3">{item.cardNumber}</div> 
                                        <div className="col4">${item.balance.toLocaleString('en-us')}</div>
                                    </div>)}
                            </div><br/>
                            </>
                        }
                        {(account.balances.coinWallets.length > 1 || account.balances.coinWallets[0].coins.length > 0) && <> 
                                <h5 id = "account-balance">CoinWallets</h5>
                                    {account.balances.coinWallets.map((item, index)=>
                                        <div key={index}>
                                        <div className="fourColGrid">
                                            <div className="col1">{item.walletName}</div>
                                            <div className="col2">Coin ID</div>
                                            <div className="col3">Coin Name</div>
                                            <div className="col4">Balance</div>              
                                        </div>
                                            {item.coins.map((coin)=>
                                                <>{
                                                    <div className='balance-amount'>
                                                        
                                                        <div className="fourColGrid">
                                                            <div className="col2">{coin.id}</div>
                                                            <div className="col3">{coin.coinName}</div>  
                                                            <div className="col4">{(coin.balance).toFixed(8)}</div> 
                                                            
                                                        </div>
                                                    </div>
                                                }</>
                                            )}
                                        </div>
                                    )}
                            </> 
                        }
                        
                    
                </div>    
            </div>)
             : 
            (<div id="home-unverified">
                <h2 id="welcome">Welcome to the React Banking System</h2> 
                <SignIn />
            </div>)
            }                                   
        </Card>
    )
}

export default Home
