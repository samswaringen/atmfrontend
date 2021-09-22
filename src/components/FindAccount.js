import React, { useContext, useState, useEffect } from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import { AtmObject } from '../App'
import {Card,Dropdown} from 'react-bootstrap'
import { useLazyQuery, useMutation,  gql } from "@apollo/client";
import { useHistory } from "react-router-dom";
import HistoryList from './HistoryList';
import AccountList from './AccountList';
import EmployeeList from './EmployeeList';


 
const initialState = {
    id: "",
    name: "",
    username: "",
    email: "",
    balance: 0,
    accountHistory: {}

}

const initialAccts = {
    "checking": {},
    "savings": {}

}
function FindAccount() {

    const atmObject = useContext(AtmObject)
    const { account, setAccount, isAdmin, setIsEmpDeposit, setIsEmpWithdraw, setIsEmpTransfer } = atmObject;

    const [isMakingSure, setIsMakingSure] = useState(false)
    const [fieldEdit, setFieldEdit] = useState('')
    const [editData, setEditData] = useState('')
    const [selected, setSelected] = useState(initialAccts)
    const [accountFound, setAccountFound] = useState(false)
    const [accountsFound, setAccountsFound] = useState(false)
    const [employeesFound, setEmployeesFound] = useState(false)
    const [addType, setAddType] = useState('Address:')
    const [checkSelect, setCheckSelect] = useState('')
    const [saveSelect, setSaveSelect] = useState('')


    const history = useHistory()


    const GET_ONE = gql`
    query GET_ONE($username : String!) {
        accountNoPW(username : $username){
            id
            routing
            name
            username
            email
            password
            pin
            contact{
              firstName
              lastName
              phoneNum
              mailing{
                streetName
                city
                state
                zip
              }
              billing{
                streetName
                city
                state
                zip
              }
            }
            balances {
              checking {
                acctName
                acctNumber
                acctType
                balance
              }
              savings {
                acctName
                acctNumber
                acctType
                balance
                interestRate
              }
              cards {
                acctName
                cardNumber
                acctType
                exp
                CVV
                pin
                balance
                totalBalance
              }
              coinWallets {
                  walletName
                  walletType
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
              investments{
                  acctName
                  type
                  id
                  value
              }
            }
            accountHistory {
              transID
              username
              dateTime
              info {
                acctType
                acctNumber
                type
                amount
                newBalance
              }
            }
        }
    }
    `;

    const EDIT_ACCOUNT_NAME = gql`
    mutation EDIT_ACCOUNT_NAME($id: String!, $firstName: String!, $lastName: String!){
        editAccountName(id:$id, firstName:$firstName, lastName:$lastName){
            name
        }
    }
    `

    const EDIT_ACCOUNT_EMAIL = gql`
    mutation EDIT_ACCOUNT_EMAIL($id: String!, $email: String!){
        editAccountEmail(id:$id, email:$email){
            name
        }
    }
    `
    const EDIT_ACCOUNT_PHONE = gql`
    mutation EDIT_ACCOUNT_PHONE($id: String!, $phoneNum: Int){
        editAccountPhone(id:$id, phoneNum:$phoneNum){
            name
        }
    }
    `
    const EDIT_ADDRESS = gql`
    mutation EDIT_ADDRESS($id: String!, $street: String, $city: String, $state: String, $zip: Int, $type: String){
        editAddress(id:$id, input: {streetName: $street, city:$city, state:$state, zip:$zip}, type:$type){
            name
        }
    }
    `

    const [editAccountName, {loading:nameLoading, error:nameError, data:nameData}] = useMutation(EDIT_ACCOUNT_NAME,{
        fetchPolicy: "no-cache"
        })

    const [editAccountEmail, {loading:emailLoading, error:emailError, data:emailData}] = useMutation(EDIT_ACCOUNT_EMAIL,{
        fetchPolicy: "no-cache"
        })
    
    const [editAccountPhone, {loading:phoneLoading, error:phoneError, data:phoneData}] = useMutation(EDIT_ACCOUNT_PHONE,{
        fetchPolicy: "no-cache"
        })
            
    const [editAddress, {loading:addressLoading, error:addressError, data:addressData}] = useMutation(EDIT_ADDRESS,{
        fetchPolicy: "no-cache"
        })

    const [accountNoPW,{ loading, error, data }] = useLazyQuery(GET_ONE,{
        fetchPolicy: "no-cache"
        }); 



    const initialValues = {username: ""}

    const onSubmit = (values)=>{
        setEmployeesFound(false)
        setAccountsFound(false)
        document.getElementById('idInput').value = ''
        document.getElementById('nameInput').value = ''
        document.getElementById('emailInput').value = ''
        document.getElementById('checkingInput').value = ''
        document.getElementById('savingsInput').value = ''
        document.getElementById('checkingNumInput').value = ''
        document.getElementById('savingsNumInput').value = ''
        if(loading){
            document.getElementById('idInput').placeholder = 'Loading...'
            document.getElementById('nameInput').placeholder = 'Loading...'
            document.getElementById('emailInput').placeholder = 'Loading...'
            document.getElementById('checkingInput').placeholder = 'Loading...'
            document.getElementById('savingsInput').placeholder = 'Loading...'
            document.getElementById('checkingNumInput').placeholder = 'Loading...'
            document.getElementById('savingsNumInput').placeholder = 'Loading...'
        }
        accountNoPW({variables: {username:values.username}})
    }

    const validate = (values)=>{
        let errors = {}; 
        return errors
    }

    const showAllAccts = ()=>{
        setAccountsFound(true)
        setEmployeesFound(false)
        setAccountFound(false)
        
    }

    const showAllEmps = ()=>{
        setEmployeesFound(true)
        setAccountsFound(false)
        setAccountFound(false)
    }

    const handleEdit = (id, field)=>{
        setFieldEdit(field)
        if(id === 'addressInput'){
            setEditData(`${document.getElementById(`addressInput`).value} ${document.getElementById(`cityStateInput`).value}`)
        }else{
            setEditData(document.getElementById(`${id}`).value)
        }
        setIsMakingSure(true)
    }

    const handleWithdraw = (e)=>{
        setIsEmpWithdraw(true)
        history.push("/components/EnterPin")
    }

    const handleDeposit = (e)=>{
        setIsEmpDeposit(true)
        history.push("/components/EnterPin")
    }

    const handleTransfer = ()=>{
        setIsEmpTransfer(true)
        history.push("/components/EnterPin")
    }

    const handleAcctSelect = (acctType,acct)=>{
        setSelected(selected, selected[acctType] = account)
        if(acctType === "checking"){
            document.getElementById('checkingInput').placeholder = acct.balance
            document.getElementById('checkingNumInput').value = acct.acctNumber
            setCheckSelect(acct.acctName)
        }else if (acctType === "savings"){
            document.getElementById('savingsInput').placeholder = acct.balance
            document.getElementById('savingsNumInput').value = acct.acctNumber
            setSaveSelect(acct.acctName)
        }
    }

    const handleAddType = (type)=>{
        setAddType(type)
        if(type === 'billing'){
            document.getElementById('addressInput').value = data.accountNoPW.contact.billing.streetName
            document.getElementById('cityStateInput').value = `${data.accountNoPW.contact.billing.city}, ${data.accountNoPW.contact.billing.state} ${data.accountNoPW.contact.billing.zip}`
        }else if(type =='mailing'){
            document.getElementById('addressInput').value = data.accountNoPW.contact.mailing.streetName
            document.getElementById('cityStateInput').value = `${data.accountNoPW.contact.mailing.city}, ${data.accountNoPW.contact.mailing.state} ${data.accountNoPW.contact.mailing.zip}`
        }
    }

    const cancel = ()=>{
        setIsMakingSure(false)
    }

    const confirmEdit = ()=>{
        if(fieldEdit === 'name'){
            let firstName = editData.split(" ")[0]
            let lastName = editData.split(" ")[1]
            editAccountName({variables : {id: account.id, firstName: firstName, lastName: lastName }})
        }else if(fieldEdit === 'email'){
            editAccountEmail({variables : {id: account.id, email: editData}})
        }else if(fieldEdit === 'phone'){
            editAccountPhone({variables : {id: account.id, phoneNum: editData}})
        }else if(fieldEdit === 'address'){
            console.log("working on it", editData.split(' '))
            let street = `${editData.split(' ')[0]} ${editData.split(' ')[1]} ${editData.split(' ')[2]}`
            let cityComma = editData.split(' ')[3]
            let city = cityComma.split(',')[0]
            let state = editData.split(' ')[4]
            let zip = Number(editData.split(' ')[5])
            editAddress({variables : {id: account.id, street: street, city: city, state: state, zip: zip, type: addType}})
        }
        setIsMakingSure(false)
    }

    useEffect(()=>{
        setAccount('')
        document.getElementById('idInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('routingInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('nameInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('emailInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('checkingInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('savingsInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('checkingNumInput').placeholder = `Error! Account Doesn't Exist`
        document.getElementById('savingsNumInput').placeholder = `Error! Account Doesn't Exist`
    },[error])


    useEffect(async()=>{
        if(!loading && data){
            console.log("checking on account info:",account)
            setAccount(data.accountNoPW)
            setAccountFound(true)
            document.getElementById('idInput').placeholder = data.accountNoPW.id
            document.getElementById('routingInput').value = data.accountNoPW.routing
            document.getElementById('emailInput').value = data.accountNoPW.email
            document.getElementById('checkingInput').value = data.accountNoPW.balances.checking.balance
            document.getElementById('savingsInput').value = data.accountNoPW.balances.savings.balance
            document.getElementById('checkingNumInput').value = data.accountNoPW.balances.checking.acctNumber
            document.getElementById('savingsNumInput').value = data.accountNoPW.balances.savings.acctNumber
            if(data.accountNoPW.contact.firstName === null){
                document.getElementById('nameInput').value = "None Set"
                document.getElementById('phoneInput').value = "None Set"
                document.getElementById('addressInput').value = "None Set"
                document.getElementById('cityStateInput').value = "None Set"
            }else{
                setAddType("billing")
                document.getElementById('nameInput').value = `${data.accountNoPW.contact.firstName} ${data.accountNoPW.contact.lastName}`
                document.getElementById('phoneInput').value = data.accountNoPW.contact.phoneNum
                document.getElementById('addressInput').value = data.accountNoPW.contact.billing.streetName
                document.getElementById('cityStateInput').value = `${data.accountNoPW.contact.billing.city}, ${data.accountNoPW.contact.billing.state} ${data.accountNoPW.contact.billing.zip}`
            }


        }
    },[data])

    useEffect(()=>{
        setIsEmpWithdraw(false)
        setIsEmpTransfer(false)
        setIsEmpDeposit(false)
        if(account.id !=null){
            document.getElementById('usernameInput').placeholder = account.username   
            document.getElementById('idInput').placeholder = account.id
            document.getElementById('routingInput').placeholder = account.routing
            document.getElementById('nameInput').placeholder = account.name
            document.getElementById('emailInput').placeholder = account.email
        }else{
            document.getElementById('usernameInput').placeholder = "Enter Username"   
            document.getElementById('idInput').placeholder = `Account ID`
            document.getElementById('routingInput').placeholder = "Routing #"
            document.getElementById('nameInput').placeholder = `Account Name`
            document.getElementById('emailInput').placeholder = `Account Email`
            document.getElementById('checkingInput').placeholder = `Checking Balance`
            document.getElementById('savingsInput').placeholder = `Savings Balance`
            document.getElementById('checkingNumInput').placeholder = `Checking Account#`
            document.getElementById('savingsNumInput').placeholder = `Savings Account#`
        }
    },[])


    return (
        <Card id="findAccount">
            <Formik 
                initialValues ={initialValues}
                onSubmit = {onSubmit}
               validate = {validate}
               
                >
                {
                    formik =>{
                        return (   
                            <div >
                                <h3>Find Account</h3>
                                <Form id="findAccountForm">
                                    <div className="col1 row1">Username:</div>
                                        <Field name="username" className="col2 row1" id="usernameInput" type='input' placeholder="Enter Username"></Field>
                                        <button className="submit-btn col3 row1" type="submit" onSubmit={onSubmit}>Search</button>
                                        {!loading && data &&
                                        <button className="col4 row1" onClick = {()=>handleEdit('usernameInput')}>Edit</button>
                                        }
                                        <div className= "error-signin row2"><ErrorMessage name="username" /></div>
                                    
                                    <div className="col1 row3">ID:</div>
                                        <Field name="id" className="col2 row3" id="idInput" type='input' placeholder="Account ID"></Field>

                                    <div className="col1 row4">Routing #:</div>
                                        <Field name="routing" className="col2 row4" id="routingInput" type='input' placeholder="Routing Number"></Field>
                                    <>
                                    <div className="col1 row5">
                                        <Dropdown>
                                            <Dropdown.Toggle style={{backgroundColor:'black', border:'1px solid black', width:'175px'}}>
                                                Checking {checkSelect}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {!loading && data &&
                                                    data.accountNoPW.balances.checking.map(item=><Dropdown.Item onClick={()=>handleAcctSelect("checking",item)}>{item.acctName}</Dropdown.Item>)   
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                        <Field name="checkingNum" className="col2 row5" id="checkingNumInput" type='number' placeholder="Checking Account#"></Field>
                                    </>
                                    <>
                                    <div className="col1 row6">Checking Balance $</div>
                                        <Field name="checking" className="col2 row6" id="checkingInput" type='number' placeholder="Checking Balance"></Field>
                                            <button className="submit-btn col3 row5" type="submit" onClick = {handleTransfer} disabled = {!(formik.dirty && formik.isValid && data)}>Transfer</button>
                                            <button className="submit-btn col3 row6" type="submit" onClick = {handleWithdraw} disabled = {!(formik.dirty && formik.isValid && data)}>Withdraw</button>
                                            <button className="submit-btn col4 row6" type="submit" onClick = {handleDeposit} disabled = { !(formik.dirty && formik.isValid && data)}>Deposit</button>  
                                    </>
                                    <>
                                    <div className="col1 row7">
                                    <Dropdown>
                                            <Dropdown.Toggle style={{backgroundColor:'black', border:'1px solid black', width:'175px'}}>
                                                Savings {saveSelect}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {!loading && data &&
                                                   data.accountNoPW.balances.savings.map(item=><Dropdown.Item onClick={()=>handleAcctSelect("savings",item)}>{item.acctName}</Dropdown.Item>)   
                                                }
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                        <Field name="savingsNum" className="col2 row7" id="savingsNumInput" type='number' placeholder="Savings Account#"></Field>
                                    </>
                                    <>
                                    <div className="col1 row8">Savings Balance $</div>
                                        <Field name="savings" className="col2 row8" id="savingsInput" type='number' placeholder="Savings Balance"></Field>
                                        <button className="submit-btn col3 row5" type="submit" onClick = {handleTransfer} disabled = {!(formik.dirty && formik.isValid && data)}>Transfer</button>
                                        <button className="submit-btn col3 row8" type="submit" onClick = {handleWithdraw} disabled = {!(formik.dirty && formik.isValid && data)}>Withdraw</button>
                                        <button className="submit-btn col4 row8" type="submit" onClick = {handleDeposit} disabled = { !(formik.dirty && formik.isValid && data)}>Deposit</button>  
                                    </>
                                    
                                    <div className="col1 row9">Email:</div>
                                        <Field name="email" className="col2 row9" id="emailInput" type='email' placeholder="Account Email"></Field>
                                        <button className="submit-btn col3 row9" type="submit" onClick = {()=>handleEdit('emailInput', 'email')}>Edit</button>
                                    
                                    <div className="col1 row10">Name:</div>
                                        <Field name="name" className="col2 row10" id="nameInput" type='input' placeholder="Account Name"></Field>
                                        <button className="submit-btn col3 row10" type="submit" onClick = {()=>handleEdit('nameInput', 'name')}>Edit</button>
                                        <div className="col1 row11">Phone#:</div>
                                        <Field name="phone" className="col2 row11" id="phoneInput" type='input' placeholder="Phone Number"></Field>
                                        <button className="submit-btn col3 row11" type="submit" onClick = {()=>handleEdit('phoneInput', 'phone')}>Edit</button>
                                    <div className="col1 row12">
                                    <Dropdown>
                                            <Dropdown.Toggle style={{backgroundColor:'black', border:'1px solid black', width:'175px'}}>
                                                {addType}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={()=>handleAddType('mailing')}>Mailing</Dropdown.Item>
                                                <Dropdown.Item onClick={()=>handleAddType('billing')}>Billing</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                        <Field name="address" className="col2 row12" id="addressInput" type='input' placeholder="Account Address"></Field>
                                        <Field name="cityState" className="col2 row13" id="cityStateInput" type='input' placeholder="Account City/State"></Field>
                                        <button className="submit-btn col3 row13" type="submit" onClick = {()=>handleEdit('addressInput', 'address')}>Edit</button>
                                    { accountFound &&
                                        <div className= "cust-acct-history col5 row-span"><HistoryList /></div>
                                    }
                                    { accountsFound &&
                                        <div className= "cust-acct-history col5 row-span">
                                            <AccountList />
                                        </div>
                                    }
                                    { employeesFound &&
                                        <div className= "cust-acct-history col5 row-span">
                                            <EmployeeList />
                                        </div>
                                    }
                                    {isAdmin && 
                                        <>
                                            <button type = "button" className="submit-btn col3 row2" onClick={showAllAccts}>Accounts</button>
                                            <button type = "button" className="submit-btn col4 row2" onClick={showAllEmps}>Employees</button>
                                        </>
                                    }
                                </Form>
                                
                                {isMakingSure &&
                                    <div>
                                        Are you sure you want to change the customer's <strong>{fieldEdit}</strong> to <strong>{editData}</strong>?
                                        <button type="button" onClick={confirmEdit}>Confirm</button>
                                        <button type="button" onClick={cancel}>Cancel</button>
                                    </div>
                                }
                            </div>
                            
                        )
                    }
                }
            </Formik>
        </Card>
    )
}

export default FindAccount
