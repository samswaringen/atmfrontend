import React, { useContext, useState, useEffect } from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import { AtmObject } from '../App'
import Card from 'react-bootstrap/Card'
import { useLazyQuery,  gql } from "@apollo/client";
import { useHistory } from "react-router-dom";
import superagent from 'superagent'
import Cookies from 'universal-cookie';
import Loading from './Loading';

import GoogleLogin from './GoogleLogin';


const SignIn = ()=> {
    const atmObject = useContext(AtmObject);
    const { setIsVerified, setAccount, setEmployee, setSelectedDiv, setSelected, isEmployee, isCustomer, setIsCustomer, setIsAdmin} = atmObject

    const history = useHistory()

    const cookies = new Cookies();

    const [showPw, setShowPw] = useState(false)

    const GET_ONE = gql`
    query GET_ONE($username : String!, $password : String!) {
        accountByUN(username : $username, password: $password){
          id
          role
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
    
    const GET_ONE_EMP = gql`
    query GET_ONE_EMP($username : String!, $password : String!) {
        empAccountByUN(username : $username, password: $password){
            id
            clockedStatus
            role
            name
            username
            email
            password
            workHistory{
                type
                dateTime
            }
        }
    }
    `;

    const [accountByUN,{ loading: getLoading, error : getError, data: getData }] = useLazyQuery(GET_ONE,{
        fetchPolicy: "no-cache"
      });
    
    const [empAccountByUN,{ loading: empLoading, error : empError, data: empData }] = useLazyQuery(GET_ONE_EMP,{
        fetchPolicy: "no-cache"
      });

      

    useEffect(()=>{
        if(!getLoading && getData){
            if(getData.accountByUN.contact.firstName === null){
                history.push("/components/ContactInfo")
            }
            setAccount(getData.accountByUN)
            setIsVerified(true)
        }
    },[getData])
    
    useEffect(()=>{
        console.log("here")
    },[getLoading])
    useEffect(()=>{
        if(!empLoading && empData){
            setEmployee(empData.empAccountByUN)
            if(empData.empAccountByUN.role === "admin"){
                setIsAdmin(true)
            }
            setIsVerified(true)
        }
    
    },[empData])

    const createAccount = ()=>{
        history.push('/components/CreateAccount')
    }

    const showHidden = (e)=>{
        setShowPw(!showPw)
        showPw ? e.target.innerHTML = 'Show' : e.target.innerHTML = "Hide"
    }
    
    const initialValues = {username: "", password: ""}

    const onSubmit = (values)=>{
        if(isEmployee){
            superagent
            .post("https://atm-auth-server.herokuapp.com/loginemp")
            .send({username: values.username, password: values.password})
            .end(function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                    if(res.text === "Username or password incorrect"){
                        document.getElementById('username-error').innerHTML = "Username or password incorrect"
                        return
                    }
                    let tokenArr = res.body.accessToken.split('.')
                    cookies.set("tokenHead", `${tokenArr[0]}.${tokenArr[1]}`, {path: "/", sameSite: 'strict'})
                    cookies.set('tokenSig', tokenArr[2], {path: "/", sameSite: 'strict', secure: true})
                    empAccountByUN({variables :{username: values.username, password: values.password}})
                    setSelectedDiv('employee home-nav-div')
                    setSelected('Employee Home')
                }
            });           
            
            
        }else{
            superagent
                .post("https://atm-auth-server.herokuapp.com/login")
                .send({username: values.username, password: values.password})
                .end(function (err, res) {
                    if (err) {
                      console.log(err);
                    } else {
                    if(res.text === "Username or password incorrect"){
                        document.getElementById('username-error').innerHTML = "Username or password incorrect"
                        return
                    }
                      let tokenArr = res.body.accessToken.split('.')
                      cookies.set("tokenHead", `${tokenArr[0]}.${tokenArr[1]}`, {path: "/", sameSite: 'strict'})
                      cookies.set('tokenSig', tokenArr[2], {path: "/", sameSite: 'strict', secure: true})
                      accountByUN({variables :{username: values.username, password: values.password}})
                    }
                }); 
                setSelectedDiv('home-nav-div')
                setSelected('Home')         
            
        }
    }
    const validate = (values)=>{
        let errors = {};
        if(!values.username) {
            errors.username = 'Required'
        } 
        if(!values.password) {
            errors.password = 'Required'
        }else if(values.password.length < 8) {
            errors.password = "Password must be 8 or More Characters"
        } 
        return errors
    }


    return (
        <div>
        <Card id="signin-form">
            <Formik 
                initialValues ={initialValues}
                onSubmit = {onSubmit}
                validate = {validate}
                >
                {
                    formik =>{
                        return (    
                            <div id="sign-in">
                                {!getLoading && !empLoading && <>
                                <h3>Sign In</h3>
                                <Form>
                                    <div className= "field-div">
                                        <Field name="username" type='input' placeholder="Enter Username"></Field>
                                        <div  className= "error-signin"><div id="username-error"></div><ErrorMessage  name="username" /></div>
                                    </div>
                                    <div className= "field-div">
                                        <Field name="password" type={showPw ? 'text' : 'password'} placeholder="Enter Password"></Field><div id = "showPassSignin" type="button" onClick={showHidden}>Show</div>
                                        <div className= "error-signin"><ErrorMessage name="password" /></div>
                                    </div>
                                    <button className="submit-btn" type="submit" disabled = {!(formik.dirty && formik.isValid) || getLoading || empLoading}>Login</button>
                                     {!isEmployee && <GoogleLogin />}
                                </Form>
                                </>
                                }
                                { getLoading || empLoading && <>
                                    <Loading />
                                </>
                                }
                            </div>
                        )
                    }
                }
            </Formik>
           
        </Card>
         { isCustomer && <div>Don't have an Account? <div className="create-account-button" type="button" onClick={createAccount}>Create One</div> </div> }
        </div>
    )
    

    }

export default SignIn
