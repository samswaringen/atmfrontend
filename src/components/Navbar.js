import React, { useState, useContext, useEffect } from 'react'
import Nav from 'react-bootstrap/Nav'
import { AtmObject } from '../App'
import '../App.css'
import { Link } from "react-router-dom";

function Navbar() {
    const atmObject = useContext(AtmObject)
    const { isVerified, selected, setSelected, selectedDiv, setSelectedDiv, isEmployee, setIsEmployee, isAdmin, isCustomer, setIsCustomer, setIsEmpCreate, isATM, setIsATM } = atmObject


    const handleNav = (e)=>{
        let item = e.target.innerHTML;
        let itemDiv = `${e.target.innerHTML.toLowerCase()}-nav-div`;
        if(item === selected) {
            return
        }
        if(item === "ATM"){
            setIsATM(true)
            setIsEmployee(false)
            setIsCustomer(false)
        }
        if(item === 'Employee Home'){
            setIsEmployee(true)
            setIsCustomer(false)
            setIsATM(false)
            console.log("set employee as true")
        }
        if(item === 'Online Banking'){
            setIsEmployee(false)
            setIsCustomer(true)
            setIsATM(false)
            console.log("set employee as false")
        }
        if(item === "Create Account"){
            setIsEmpCreate(false)
        }
        if(item === "Create Employee"){
            setIsEmpCreate(true)
        }
        if(document.getElementById(selected)){
            document.getElementById(itemDiv).classList.add('title-background')
            document.getElementById(item).classList.add('marble')
            document.getElementById(item).classList.add('black-border-bottom')
            document.getElementById(selectedDiv).classList.remove('title-background')
            document.getElementById(selected).classList.remove('marble')
            document.getElementById(selected).classList.remove('black-border-bottom')
            setSelected(item)
            setSelectedDiv(itemDiv)
        }else{
            setSelected('Online Banking')
            setSelectedDiv('online banking-nav-div')
        }
        
    } 
    
    useEffect(()=>{
        document.getElementById('Online Banking').classList.add('marble')
        document.getElementById('Online Banking').classList.add('black-border-bottom')
    },[])

    useEffect(()=>{
        if(isVerified && !isEmployee){
            document.getElementById('home-nav-div').classList.add('title-background')
            document.getElementById("Home").classList.add('marble')
            document.getElementById("Home").classList.add('black-border-bottom')
        }
        if (isVerified && isEmployee){
            document.getElementById('employee home-nav-div').classList.add('title-background')
            document.getElementById("Employee Home").classList.add('marble')
            document.getElementById("Employee Home").classList.add('black-border-bottom')
        }
    },[isVerified])

    return (
        <div id="navbar-div">
                <Nav id = "nav-component" fill variant="tabs" defaultActiveKey="/online banking">
                {!isVerified  &&
                <>
                    <Nav.Item >
                        <Link to="/components/EnterPin"  onClick = {handleNav} ><div className="nav-title" id="ATM"><div className="inner-nav-div-title" id="atm-nav-div" >ATM</div></div></Link>
                    </Nav.Item>
                   <Nav.Item >
                        <Link to="/components/Home"  onClick = {handleNav} ><div className="nav-title" id="Online Banking"><div className="inner-nav-div-title" id="online banking-nav-div">Online Banking</div></div></Link>
                    </Nav.Item>
                    <Nav.Item >
                    <Link to="/components/EmployeeHome"  onClick = {handleNav}><div className="nav-title" id="Employee Home"><div className="inner-nav-div-title" id="employee home-nav-div">Employee Home</div></div></Link>
                </Nav.Item>
                </>
                }
                {
                    isVerified && isATM &&
                    <>
                    <Nav.Item >
                        <Link to="/components/Home"  onClick = {handleNav} ><div className="nav-title" id="Home"><div className="inner-nav-div-title" id="home-nav-div">Home</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/Withdraw" onClick = {handleNav}><div className="nav-title" id="Withdraw"><div className="inner-nav-div-title" id="withdraw-nav-div">Withdraw</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/Deposit" onClick = {handleNav}><div className="nav-title" id="Deposit"><div className="inner-nav-div-title" id="deposit-nav-div">Deposit</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/AccountHistory" onClick = {handleNav}><div className="nav-title" id="Account History"><div className="inner-nav-div-title" id="account history-nav-div">Account History</div></div></Link>
                    </Nav.Item>
                    <Nav.Item >
                        <Link to="/components/Logout"  onClick = {handleNav}><div className="nav-title" id="Logout"><div className="inner-nav-div-title" id="logout-nav-div">Logout</div></div></Link>
                    </Nav.Item>
                    </>
                }
                { isVerified && isCustomer &&
                <>
                   <Nav.Item >
                        <Link to="/components/Home"  onClick = {handleNav} ><div className="nav-title" id="Home"><div className="inner-nav-div-title" id="home-nav-div">Home</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/Deposit" onClick = {handleNav}><div className="nav-title" id="Deposit"><div className="inner-nav-div-title" id="deposit-nav-div">Deposit</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/Transfer" onClick = {handleNav}><div className="nav-title" id="Transfer"><div className="inner-nav-div-title" id="transfer-nav-div">Transfer</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/CoinWallets" onClick = {handleNav}><div className="nav-title" id="Coin Wallets"><div className="inner-nav-div-title" id="coin wallets-nav-div">Coin Wallets</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/AddAccount" onClick = {handleNav}><div className="nav-title" id="Add Account"><div className="inner-nav-div-title" id="add account-nav-div">Add Account</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/AccountHistory" onClick = {handleNav}><div className="nav-title" id="Account History"><div className="inner-nav-div-title" id="account history-nav-div">Account History</div></div></Link>
                    </Nav.Item>
                    <Nav.Item >
                        <Link to="/components/Logout"  onClick = {handleNav}><div className="nav-title" id="Logout"><div className="inner-nav-div-title" id="logout-nav-div">Logout</div></div></Link>
                    </Nav.Item>
                    </>
                }{ isVerified && isEmployee &&
                    <>
                    <Nav.Item >
                        <Link to="/components/EmployeeHome"  onClick = {handleNav}><div className="nav-title" id="Employee Home"><div className="inner-nav-div-title" id="employee home-nav-div">Employee Home</div></div></Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/FindAccount" onClick = {handleNav}><div className="nav-title" id="Find Account"><div className="inner-nav-div-title" id="find account-nav-div">Find Account</div></div></Link>
                        </Nav.Item>
                    <Nav.Item>
                        <Link to="/components/CreateAccount" onClick = {handleNav}><div className="nav-title" id="Create Account"><div className="inner-nav-div-title" id="create account-nav-div">Create Account</div></div></Link>
                    </Nav.Item>
                    {isAdmin && <Nav.Item>
                        <Link to="/components/CreateAccount" onClick = {handleNav}><div className="nav-title" id="Create Employee"><div className="inner-nav-div-title" id="create employee-nav-div">Create Employee</div></div></Link>
                    </Nav.Item> }
                    <Nav.Item >
                        <Link to="/components/Logout"  onClick = {handleNav}><div className="nav-title" id="Logout"><div className="inner-nav-div-title" id="logout-nav-div">Logout</div></div></Link>
                    </Nav.Item>
                    </>
                }
                </Nav>
        </div>
    )
}

export default Navbar
