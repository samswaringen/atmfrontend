import React, { useContext, useState, useEffect } from 'react'
import { AtmObject } from '../App'
import { useMutation, useLazyQuery,  gql } from "@apollo/client";
import { useHistory } from "react-router-dom";
import superagent from 'superagent'
import Cookies from 'universal-cookie';
import googlelogo from '../googlelogo.png'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { makeid } from './idgenerator';
import dotenv from 'dotenv';

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

function GoogleLogin() {
  const atmObject = useContext(AtmObject);
  const { setIsVerified, setAccount, setEmployee, setSelectedDiv, setSelected, isEmployee, isCustomer, setIsCustomer, setIsAdmin} = atmObject

  const [routing, setRouting] = useState(0)
  const [routingEq, setRoutingEq] = useState(0)
  const [acctNumber, setAcctNumber] = useState(0)
  const [acctNumberEq, setAcctNumberEq] = useState(0)

  const cookies = new Cookies();

  const history = useHistory()

  const GET_ONE_GOOGLE = gql`
    query GET_ONE_GOOGLE($email : String!) {
        accountByEmail(email : $email){
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

    const [accountByEmail,{ loading: emailLoading, error : emailError, data: emailData }] = useLazyQuery(GET_ONE_GOOGLE,{
      fetchPolicy: "no-cache"
    });

    useEffect(()=>{
      superagent
          .post("https://atm-auth-server.herokuapp.com/number")
          //.post('http://localhost:9002/number')
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
          //.post('http://localhost:9002/number')
          .send({id:"routing"})
          .end(function (err, res) {
              if (err) {
                console.log(err);
              } else {
                  console.log("routing",res.body.number)
                  setRouting(res.body.number)
                  setRoutingEq(res.body.equation)
              }
          })
  },[])

  useEffect(()=>{
    if(!emailLoading && emailData){
      setAccount(emailData.accountByEmail)
      setIsVerified(true)
        if(emailData.accountByEmail.contact.firstName === null){
            history.push("/components/ContactInfo")
        }

    }
},[emailData])

  const login = ()=>{
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      cookies.set("gapi", token, {path: "/", sameSite: 'strict'}) 
      superagent
        .post("https://atm-auth-server.herokuapp.com/loginGoogle")
        //.post("http://localhost:9002/loginGoogle")
        .send({email: result.user.email})
        .end(function (err, res) {
            if (err) {
                console.log(err);
            }else {
                if(res.text === "Username or password incorrect"){
                    document.getElementById('username-error').innerHTML = "Username or password incorrect"
                    return
                }else if(res.text === "make account"){
                  createGoogleAccount(result.user.email)
                }else{
                  let tokenArr = res.body.accessToken.split('.')
                  cookies.set("tokenHead", `${tokenArr[0]}.${tokenArr[1]}`, {path: "/", sameSite: 'strict'})
                  cookies.set('tokenSig', tokenArr[2], {path: "/", sameSite: 'strict', secure: true})
                  accountByEmail({variables :{email:result.user.email}})
                }
            }
        }); 
      setSelectedDiv('home-nav-div')
      setSelected('Home')         
      // The signed-in user info.
      const user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  
  }

  const createGoogleAccount = (email)=>{
    console.log("creating account from google")
    let id = makeid(15)
    console.log("numbers",routing, acctNumber)
    console.log("equations",routingEq, acctNumberEq)
    let newRouting = routing + routingEq
    let newChecking = acctNumber + acctNumberEq
    let newSavings = newChecking + 1
    let newDate = new Date()

    let input = {
      id: id, 
      dateTime: newDate,
      routing: newRouting,
      email: email, 
      username: email, 
      name: email, 
      password:makeid(20),
      chkAcctNumber: newChecking,
      savAcctNumber: newSavings
    }
    let google = true
    superagent
          .post("https://atm-auth-server.herokuapp.com/createuser")
          //.post("http://localhost:9002/createuser")
          .send({input, google} )
          .end(function (err, res) {
              if (err) {
                console.log(err);
              } else {
                  let tokenArr = res.body.accessToken.split('.')
                  cookies.set("tokenHead", `${tokenArr[0]}.${tokenArr[1]}`, {path: "/", sameSite: 'strict'})
                  cookies.set('tokenSig', tokenArr[2], {path: "/", sameSite: 'strict', secure: true})
                  accountByEmail({variables :{email:email}})
              }

      })   
  }

  return (
    <div>
        <button className="submit-btn" onClick={login}>Login w/ <img src={googlelogo}></img></button>
    </div>
  );
}


export default GoogleLogin
