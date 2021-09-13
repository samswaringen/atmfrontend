import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react'
import temple from './temple.png'
import Withdraw from './components/Withdraw'
import Deposit from './components/Deposit'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Navbar from './components/Navbar';
import EnterPin from './components/EnterPin';
import AccountHistory from './components/AccountHistory';
import Home from './components/Home'
import CreateAccount from './components/CreateAccount';
import Logout from './components/Logout'
import QuickCash from './components/QuickCash'
import OtherWithdraw from './components/OtherWithdraw';
import Success from './components/Success';
import EmployeeHome from './components/EmployeeHome';
import Card from 'react-bootstrap/Card'
import { ApolloProvider } from '@apollo/client'
import { client } from "./ApolloClient/client"
import FindAccount from './components/FindAccount';
import Transfer from './components/Transfer';
import AddAccount from './components/AddAccount';
import CoinWallets from './components/CoinWallets';
import ContactInfo from './components/ContactInfo';


export const AtmObject = React.createContext()

function ATM() {
    const [account, setAccount] = useState({})
    const [user, setUser] = useState('')
    const [employee, setEmployee] = useState('')
    const [accountBalance, setAccountBalance] = useState({});
    const [withdraw, setWithdraw] = useState(0);
    const [deposit, setDeposit] = useState(0);
    const [accountHistory, setAccountHistory] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const [empIsVerified, setEmpIsVerified] = useState(false);
    const [selected, setSelected] = useState('Online Banking')
    const [selectedDiv, setSelectedDiv] = useState('online banking-nav-div')
    const [clockedIn, setClockedIn] = useState(false)
    const [isEmployee, setIsEmployee] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEmpCreate, setIsEmpCreate] = useState(false)
    const [isCustomer, setIsCustomer] = useState(true)
    const [isATM, setIsATM] = useState(false)
    const [isEmpWithdraw, setIsEmpWithdraw] = useState(false)
    const [isEmpDeposit, setIsEmpDeposit] = useState(false)
    const [isEmpTransfer,setIsEmpTransfer] = useState(false)

    return (
        <ApolloProvider client={client}>
            <Router>
                <Card id= "brick-wall">
                    <Card id="atm-screen-div">
                        <div id = "temple"/>
                        <div id="atm-title">REACT BANK</div>
                        <AtmObject.Provider value={{
                               account:account,
                               setAccount:setAccount,
                               user:user,
                               setUser:setUser,
                               employee:employee,
                               setEmployee:setEmployee,
                               withdraw: withdraw,
                               setWithdraw: setWithdraw,       
                               deposit: deposit,
                               setDeposit: setDeposit,
                               isEmployee: isEmployee,
                               setIsEmployee: setIsEmployee,
                               isAdmin:isAdmin,
                               setIsAdmin: setIsAdmin,
                               isEmpCreate: isEmpCreate,
                               setIsEmpCreate:setIsEmpCreate,
                               isCustomer:isCustomer,
                               setIsCustomer: setIsCustomer,
                               isVerified: isVerified,
                               setIsVerified: setIsVerified,
                               isATM:isATM,
                               setIsATM:setIsATM,
                               empIsVerified: empIsVerified,
                               setEmpIsVerified: setEmpIsVerified,
                               accountBalance:accountBalance,
                               setAccountBalance: setAccountBalance,
                               accountHistory: accountHistory,
                               setAccountHistory: setAccountHistory,
                               selected:selected,
                               setSelected:setSelected,
                               selectedDiv:selectedDiv,
                               setSelectedDiv:setSelectedDiv,
                               clockedIn: clockedIn,
                               setClockedIn: setClockedIn,
                               isEmpWithdraw:isEmpWithdraw,
                               setIsEmpWithdraw:setIsEmpWithdraw,
                               isEmpDeposit:isEmpDeposit,
                               setIsEmpDeposit:setIsEmpDeposit,
                               isEmpTransfer:isEmpTransfer,
                               setIsEmpTransfer:setIsEmpTransfer
                            }}>
                            <Navbar />
                            <Card id = "atm-screen">
                                <Card id="interactive">
                                    <Route exact path="">
                                        <Redirect to="/components/Home" />
                                    </Route>
                                    <Route exact path="/">
                                        <Redirect to="/components/Home" />
                                    </Route>
                                    <Route path="/components/EmployeeHome">
                                        <EmployeeHome />
                                    </Route>
                                    <Route path="/components/FindAccount">
                                        <FindAccount />
                                    </Route>
                                    <Route path="/components/EnterPin">
                                        <EnterPin />    
                                    </Route>
                                    <Route path="/components/Home" >
                                        <Home />
                                    </Route>
                                    <Route path="/components/CreateAccount">
                                        <CreateAccount />
                                    </Route>
                                    <Route path="/components/ContactInfo">
                                        <ContactInfo />
                                    </Route>
                                    <Route path="/components/Success">
                                        <Success />
                                    </Route>
                                    <Route path="/components/Withdraw" >
                                        <Withdraw />
                                    </Route>
                                    <Route path="/components/QuickCash" >
                                        <QuickCash />
                                    </Route>
                                    <Route path="/components/OtherWithdraw" >
                                        <OtherWithdraw />
                                    </Route>
                                    <Route path="/components/Deposit" >
                                        <Deposit />
                                    </Route>   
                                    <Route path="/components/Transfer" >
                                        <Transfer />
                                    </Route>
                                    <Route path="/components/CoinWallets" >
                                        <CoinWallets />
                                    </Route>
                                    <Route path="/components/AddAccount" >
                                        <AddAccount />
                                    </Route>   
                                    <Route path="/components/AccountHistory" >
                                        <AccountHistory />
                                    </Route> 
                                    <Route path="/components/Logout" >
                                        <Logout />
                                    </Route>   
                                </Card>
                            </Card>
                        </AtmObject.Provider>
                    </Card>
                </Card>
            </Router>
        </ApolloProvider>
    )
}

export default ATM

