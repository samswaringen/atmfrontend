import React, { useState, useEffect } from 'react'
import { useLazyQuery,  gql } from "@apollo/client";


function AccountList() {

    const [accts, setAccts] = useState([])


    const GET_ACCOUNTS = gql`
    query GET_ACCOUNTS {
        accounts {
            id
            role
            routing
            name
            username
            email
            password
            pin
            contact {
                firstName
                lastName
                phoneNum
                mailing {
                    streetName
                    city
                    state
                    zip
                }
                billing {
                    streetName
                    city
                    state
                    zip
                }
            }
            balances {
                checking {
                    acctName
                    acctType
                    balance
                    acctNumber
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
            investments {
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

    const [accounts,{ loading, error, data }] = useLazyQuery(GET_ACCOUNTS,{
        fetchPolicy: "no-cache"
        }); 

    useEffect(()=>{
        accounts()
    })

    useEffect(()=>{
        if(!loading && data){
            setAccts(data.accounts)
        }
    },[data])

    return (
        <div>
            {accts.map((item, index)=><div key ={index} className="fourColGrid"><div classname="col1">{item.username}</div><div classname="col2">{item.id}</div> <div classname="col3">{item.routing}</div><div>{(new Date(item.accountHistory[0].dateTime).getMonth())+1}/{new Date(item.accountHistory[0].dateTime).getDate()}/{new Date(item.accountHistory[0].dateTime).getFullYear()}</div></div>)}
        </div>
    )
}

export default AccountList
