import React, {useState, useContext, useEffect} from 'react'
import { AtmObject } from '../App'
import RecentTrans from './RecentTrans';
import Card from 'react-bootstrap/Card'
import { useMutation,  gql } from "@apollo/client";
import axios from 'axios'
import { makeid } from './idgenerator';

 


function Deposit() {
    const atmObject = useContext(AtmObject)
    const { deposit, setDeposit, account, setAccount,isATM, isCustomer, isEmployee} = atmObject;

    const [valueEntered, setValueEntered] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [accountSelected, setAccountSelecetd] = useState("")
    const [accountIndex, setAccountIndex] = useState(0)
    const [isFile, setIsFile] = useState(false)
    const [selectedFile, setSelectedFile] = useState('')
    const [fileLink, setFileLink] = useState('')
    const [textArr, setTextArr] = useState([])
    const [isCash, setIsCash] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [isReady, setIsReady] = useState(false)

    const stream = require('getstream');

    const client = stream.connect( 
        'nftqy2gq8c63',  
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY29sZC1tYXRoLTMifQ.9fk2IH0x5LfpwFibLolT69ScOuJG8RVmefbP-dafrs4', 
        '1140378' 
      ); 

    const ADD_TRANS = gql`
    mutation ADD_TRANS($id: String!, $balance: Float!, $transID: String!, $dateTime: String!, $type: String, $amount: Float, $newBalance: Float, $username: String, $acctType: String!,  $acctNumber:Int!, $acctIndex:Int!) {
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

    const ADD_ALL_DATA = gql`
    mutation ADD_All_DATA($transID: String!, $username: String!, $dateTime: String!, $type: String!, $amount: Float!, $newBalance: Float!, $acctType: String!, $acctNumber: Int!) {
        addToAllData(input: {transID: $transID, username: $username, dateTime: $dateTime, info: {acctNumber: $acctNumber, acctType: $acctType, type: $type, amount: $amount, newBalance: $newBalance}}) {
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
    `;

    const [addTransaction,{loading:loadingTrans, error: errorTrans, data: dataTrans}] = useMutation(ADD_TRANS)
    const [addToAllData,{loading:loadingAll, error: errorAll, data: dataAll}] = useMutation(ADD_ALL_DATA)

    

    const handleDeposit = ()=>{
        if(isCheck){
            (document.getElementById('deposit').value != '' && isFile) ? setValueEntered(true) : setValueEntered(false)
        }else if(isCash){
            (document.getElementById('deposit').value != '') ? setValueEntered(true) : setValueEntered(false)
        }
        let newDeposit = document.getElementById('deposit').value;
        setDeposit(Number(newDeposit));
    }

    const handleCheck = async()=>{
        if(document.getElementById('file').files[0]){
            let res = await client.images.upload(document.getElementById('file').files[0]);
            setFileLink(res.file)
        }
        setSelectedFile(document.getElementById('file').files[0])
    }

    const handleType = (type)=>{
        if(type === "cash"){
            setIsCheck(false)
            setIsCash(true)
            setIsReady(true)
        }else if(type === "check"){
            setIsCash(false)
            setIsCheck(true)
            setIsReady(true)
        }
    }

    const selectAccount=(selected, index)=>{
        setAccountSelecetd(selected)
        setAccountIndex(index)
        setIsSelected(true)
    }

    const goBack =()=>{
        setIsSelected(false)
        setIsReady(false)
        setIsCash(false)
        setIsCheck(false)
    }

 
    const ocrSpace = require('ocr-space-api-wrapper')
    const getOCR = async()=>{
        var FormData = require('form-data');
        var data = new FormData();
        data.append('language', 'eng');
        data.append('isOverlayRequired', 'false');
        data.append('url', fileLink);
        data.append('iscreatesearchablepdf', 'false');
        data.append('issearchablepdfhidetextlayer', 'false');
        data.append('filetype', 'pdf');

        var config = {
        method: 'post',
        url: 'https://apipro1.ocr.space/parse/image',
        headers: { 
            'apikey': '17ad9f1b6188957', 
        },
        data : data
        };
       let res = await axios(config)
       setTextArr(res.data.ParsedResults[0].ParsedText.replace( /\r\n/g, " " ).split(" "))
        
    }

    useEffect(()=>{
        console.log('isAtm:',isATM)
    },[])

    useEffect(()=>{
        if(selectedFile != ""){
            setIsFile(true)
        } 
    },[selectedFile])
    
    useEffect(()=>{
        let checkAmount;
        let index = 0;
        if(textArr.length>0){
            textArr.map((item,i)=>{
                if(item === '$'){
                    index = i + 1
                }
            })
            checkAmount = Number(textArr[index].replace( /,/g, "" ))
        }
        if(checkAmount === deposit){
            console.log("both match")
            let newAmount = account.balances[accountSelected][accountIndex].balance + deposit;
            let transID = makeid(30)
            let newDate = new Date()
            addTransaction({variables:{id : account.id, balance : newAmount, transID:transID, username: account.username, dateTime: newDate, type: "deposit", amount: deposit, newBalance: newAmount, acctType: accountSelected, acctIndex: accountIndex, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
            addToAllData({variables:{transID:transID, username:account.username, dateTime: newDate, type: "deposit", amount: deposit, newBalance: newAmount, acctType: accountSelected, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
            setAccount(account, account.balances[accountSelected][accountIndex].balance = newAmount);
            setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances[accountSelected][accountIndex].acctNumber, acctType: accountSelected, type: "deposit", amount: deposit, newBalance: newAmount}}));
            setDeposit(0);
            setIsReady(false)
            setIsCash(false)
            setIsCheck(false)
        }else{
            console.log(`both dont match. check amount found ${checkAmount} but you entered ${deposit}. Did you want to proceed with the deposit amount?` )
        }
    },[textArr])

    const depositMoney = ()=>{
        if(isCheck || isCustomer){
            getOCR();
        }else if(isCash){
            let newAmount = account.balances[accountSelected][accountIndex].balance + deposit;
            let transID = makeid(30)
            let newDate = new Date()
            addTransaction({variables:{id : account.id, balance : newAmount, transID:transID, username: account.username, dateTime: newDate, type: "deposit", amount: deposit, newBalance: newAmount, acctType: accountSelected, acctIndex: accountIndex, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
            addToAllData({variables:{transID:transID, username:account.username, dateTime: newDate, type: "deposit", amount: deposit, newBalance: newAmount, acctType: accountSelected, acctNumber: account.balances[accountSelected][accountIndex].acctNumber}})
            setAccount(account, account.balances[accountSelected][accountIndex].balance = newAmount);
            setAccount(account, account.accountHistory.push({transID:transID, username:account.username, dateTime: newDate, info : {acctNumber: account.balances[accountSelected][accountIndex].acctNumber, acctType: accountSelected, type: "deposit", amount: deposit, newBalance: newAmount}}));
            setDeposit(0);
            setIsReady(false)
            setIsCash(false)
            setIsCheck(false)
        }
        if((document.getElementById('deposit').value) === ' '){
            alert("Your deposit is Not a Number")
            return
        }
        if(deposit < 0){
            alert("You cannot deposit a negative amount")
            return
        }
        document.getElementById('deposit').value = 0;
    }

    return(
        <Card id="deposit-div">
            { !isSelected && 
            <>
                <div className="select-title">Select Account</div>
                <div className="deposit-account-title">Checking</div> 
                <div className="deposit-account-list">{account.balances.checking.map((item, index)=><div className = "add-account-items" type="button" onClick={()=>selectAccount("checking", index)}><div className = "add-account-items-inner">{item.acctName}: ${Number(item.balance).toFixed(2)}</div></div>)}</div><br/>
                <div className="deposit-account-title">Savings</div> 
                <div className="deposit-account-list">{account.balances.savings.map((item, index)=><div className = "add-account-items" type="button" onClick={()=>selectAccount("savings", index)}><div className = "add-account-items-inner">{item.acctName}: ${Number(item.balance).toFixed(2)}</div></div>)}</div>
            </>
        }{ isSelected &&
            <>
                <h2 className = "account-balance">Account Balance<br/><span className='balance-amount'>${(account.balances[accountSelected][accountIndex].balance).toLocaleString('en-us')}</span></h2>
                <div type="button" className = "change-account-deposit" onClick={goBack}><p>&larr; Change Account</p></div>
               { isATM && <>
                        Deposit
                        {!isReady && <>
                            <button id="depositByCash" onClick={()=>handleType("cash")}> By Cash</button>
                            <button id="depositByCheck" onClick={()=>handleType("check")}> By Check</button>
                        </>
                        }
                        { isReady && <>
                            {isCheck && <button id="depositByCash" onClick={()=>handleType("cash")}> By Cash</button>}
                            {isCash && <button id="depositByCheck" onClick={()=>handleType("check")}> By Check</button>}
                            </>
                        }

                    { isCheck &&  <>
                        <label htmlFor="file">Upload image of check</label>
                        <input type="file" id="file" name="file" onChange={handleCheck}/>
                        <div><img src={fileLink} width={'300px'}></img></div>
                        </>
                    }
                    </>
                }
                { isEmployee && <>
                        Deposit
                        <button id="depositByCash" onClick={()=>handleType("cash")}> By Cash</button>
                        <button id="depositByCheck" onClick={()=>handleType("check")}> By Check</button>

                    { isCheck &&  <>
                        <label htmlFor="file">Upload image of check</label>
                        <input type="file" id="file" name="file" onChange={handleCheck}/>
                        <div><img src={fileLink} width={'300px'}></img></div>
                        </>
                    }
                    </>
                }
                { isCheck && isReady && <div id="deposit-amount-div">
                <span className="font-size-20">$</span><input type = 'number' id = 'deposit' onChange = {handleDeposit} placeholder="Deposit Amount"></input>
                    <button type = 'button' id = 'deposit-button' onClick = {depositMoney} disabled = {!valueEntered}>Deposit</button>
                </div>
                }
                { isCash && isReady && <div id="deposit-amount-div">
                <span className="font-size-20">$</span><input type = 'number' id = 'deposit' onChange = {handleDeposit} placeholder="Deposit Amount"></input>
                    <button type = 'button' id = 'deposit-button' onClick = {depositMoney} >Deposit</button>
                </div>
                }
                { isCustomer  && <>
                    <label htmlFor="file">Upload image of check</label>
                    <input type="file" id="file" name="file" onChange={handleCheck}/>
                    <div><img src={fileLink} width={'300px'}></img></div>
                    <div id="deposit-amount-div">
                    <span className="font-size-20">$</span><input type = 'number' id = 'deposit' onChange = {handleDeposit} placeholder="Deposit Amount"></input>
                    <button type = 'button' id = 'deposit-button' onClick = {depositMoney} >Deposit</button>
                </div>
                    </>
                }
            </>
        }
            
        </Card>
    )
};

export default Deposit