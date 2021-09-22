import React, { useState, useContext, useEffect } from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import { AtmObject } from '../App'
import { useHistory } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import { useMutation, useLazyQuery,  gql } from "@apollo/client";
import superagent from 'superagent'
import { makeid } from './idgenerator';
import Cookies from 'universal-cookie';

function CreateAccount() {
    const atmObject = useContext(AtmObject);
    const { account, setAccount, setSelectedDiv, isEmployee, isEmpCreate, isAdmin } = atmObject

    const [showPw, setShowPw] = useState(false)
    const [showVerPw, setShowVerPw] = useState(false)
    const [routing, setRouting] = useState(0)
    const [routingEq, setRoutingEq] = useState(0)
    const [acctNumber, setAcctNumber] = useState(0)
    const [acctNumberEq, setAcctNumberEq] = useState(0)

    const history = useHistory();

    const cookies = new Cookies();

    const initialValues = {
        username: "", 
        name: '',  
        email:"", 
        password: "",
        verifyPassword: "",
        role: "Choose Role"
    }

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

    
    const EDIT_NUM =gql`
        mutation EDIT_NUM(
            $id: String!,
            $number: Float!,
            $equation: Int!
        ){
        editNumberGen(id: $id, input:{
            id: $id,
            number: $number,
            equation: $equation
            }){
                id
                number
                equation
            }
        }
    `;


    const [editNumberGen,{loading: editLoading, error: editError, data: editData}] = useMutation(EDIT_NUM)
    const [accountNoPW,{ loading, error, data }] = useLazyQuery(GET_ONE,{
        fetchPolicy: "no-cache"
        }); 

    useEffect(()=>{
        if(!loading && data){
            setAccount(data.accountNoPW)
            history.push('/components/ContactInfo')
        }
    }, [data])

    useEffect(()=>{
        if(isEmployee){
            setAccount({})
        }
        superagent
            .post("https://atm-auth-server.herokuapp.com/number")
            .send({id:"accounts"})
            .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                    setAcctNumber(res.body.number)
                    setAcctNumberEq(res.body.equation)
                }
            })
        superagent
            .post("https://atm-auth-server.herokuapp.com/number")
            .send({id:"routing"})
            .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                    setRouting(res.body.number)
                    setRoutingEq(res.body.equation)
                }
            })
    },[])



    const showHidden = (e)=>{
        setShowPw(!showPw)
        showPw ? e.target.innerHTML = 'Show' : e.target.innerHTML = "Hide"
    }

    const showVerHidden = (e)=>{
        setShowVerPw(!showVerPw)
        showVerPw ? e.target.innerHTML = 'Show' : e.target.innerHTML = "Hide"
    }

    const onSubmit = (values)=>{
        console.log("values:",values)
        let id = makeid(15)
        let empId = makeid(20)
        let newRouting = routing + routingEq
        let newChecking = acctNumber + acctNumberEq
        let newSavings = newChecking + 1
        let newDate = new Date()
        let input = {
            id: id, 
            dateTime: newDate,
            routing: newRouting,
            email: values.email, 
            username: values.username, 
            name: values.name, 
            password:values.password,
            chkAcctNumber: newChecking,
            savAcctNumber: newSavings
        }
        if(isEmpCreate){
            input = {
                id: empId,
                dateTime: newDate,
                role: values.role,
                name: values.name,
                username: values.username,
                email: values.email,
                password: values.password
            }
            superagent
            .post("https://atm-auth-server.herokuapp.com/createemp")
            .send({input})
            .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                }
            })       
        }else if(isEmployee){
            superagent
            .post("https://atm-auth-server.herokuapp.com/createuser")
            .send({input})
            .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                    editNumberGen({variables:{id: "accounts", number: newSavings, equation: acctNumberEq }})
                    editNumberGen({variables:{id: "routing", number: newRouting, equation: routingEq}})
                    accountNoPW({variables: {username: res.req._data.input.username}})
                    
                }
            })       
        }else{
            document.getElementById('online banking-nav-div').classList.add('title-background')
            document.getElementById('Online Banking').classList.add('marble')
            document.getElementById('Online Banking').classList.add('black-border-bottom')
            setSelectedDiv('online banking-nav-div')
            superagent
            .post("https://atm-auth-server.herokuapp.com/createuser")
            .send({input})
            .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                    let tokenArr = res.body.accessToken.split('.')
                    cookies.set("tokenHead", `${tokenArr[0]}.${tokenArr[1]}`, {path: "/", sameSite: 'strict'})
                    cookies.set('tokenSig', tokenArr[2], {path: "/", sameSite: 'strict', secure: true})
                    editNumberGen({variables:{id: "accounts", number: newSavings, equation: acctNumberEq}})
                    editNumberGen({variables:{id: "routing", number: newRouting, equation: routingEq}})
                    history.push('/components/Success') 
                }
 
        })   
    }
}

    const validate = (values)=>{
        let errors = {};
        if(!values.username) {
            errors.username = 'Required'
        }
        if(!values.name) {
            errors.name = 'Required'
        } 
        if(!values.email) {
            errors.email = 'Required'
        }else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]{2,4}$/.test(values.email)) { 
             errors.email = "Not a valid email"
        } 
        if(!values.password) {
            errors.password = 'Required'
        }else if(!/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(values.password)) {
            errors.password = "Password must contain at least 8 characters, one uppercase, one number and one special character"
        }
        if(!values.password) {
            errors.verifyPassword = 'Required'
        }else if(values.password != values.verifyPassword){
            errors.verifyPassword = "Passwords don't match!"
        } 
        return errors
    }

    return (
        <Card id="signup-form">
            <Formik
                initialValues = {initialValues}
                onSubmit = {onSubmit}
                validate = {validate}
                >
                {
                    formik =>{
                        return(
                            <div id="sign-up">
                            {!isEmpCreate ? <h2 id="create-title">Create Account</h2> : <h2 id="create-title">Create Employee</h2>}
                            <Form>
                                <div className= "field-div">
                                    <Field id = "create-username" name="username" type='input' placeholder="Create Username" ></Field>
                                    <div className= "error"><ErrorMessage name = 'username'/><ErrorMessage name = 'checkUser'/></div>
                                </div>
                                { isEmpCreate && <>
                                    <div className= "field-div">
                                        <Field id = "emp-role-select" name="role" as="select">
                                            <option value="choose">ChooseRole</option>
                                            <option value="employee">Employee</option>
                                            <option value="manager">Manager</option>
                                            <option value="admin">Admin</option>
                                        </Field>
                                        <div className= "error"><ErrorMessage name = 'role'/><ErrorMessage name = 'checkRole'/></div>
                                    </div>
                                </>
                                }
                                <div className= "field-div">
                                    <Field id = "create-name" name="name" type='input' placeholder="Greeting Name"></Field>
                                    <div className= "error"><ErrorMessage name = 'name'/></div>
                                </div>
                                <div className= "field-div">
                                    <Field id = "create-email" name="email" type='email' placeholder="Enter Email"></Field>
                                    <div className= "error"><ErrorMessage name = 'email'/></div>
                                </div>
                                <div className= "field-div">
                                    <Field id = "create-password" name="password" type={showPw ? 'text' : 'password'} placeholder="Create Password" ></Field>
                                    { isEmpCreate ?
                                        <div id = "showPassSpan" type="button" onClick={showHidden}>Show</div>
                                        :
                                        <div id = "showPassSpanCust" type="button" onClick={showHidden}>Show</div>
                                    }
                                    <div className= "error"><ErrorMessage name = 'password'/></div>
                                </div>
                                <div className= "field-div">
                                    <Field id = "create-verify" name="verifyPassword" type={showVerPw ? 'text' : 'password'} placeholder="Verify Password"></Field>
                                    { isEmpCreate ?
                                        <div id = "showPassVerSpan" type="button" onClick={showVerHidden}>Show</div>
                                        :
                                        <div id = "showPassSpanVerCust" type="button" onClick={showVerHidden}>Show</div>
                                    }
                                    <div className= "error"><ErrorMessage name = 'verifyPassword'/></div>
                                </div>
                                <button id= "create-submit" className="submit-btn" type="submit" disabled = {!(formik.dirty && formik.isValid)}>Submit</button>
                            </Form>
                        </div>
                        )
                    }
                }
            </Formik>
        </Card>
    )
}

export default CreateAccount
