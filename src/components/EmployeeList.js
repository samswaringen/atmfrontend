import React, { useContext, useState, useEffect } from 'react'
import { AtmObject } from '../App'
import {Card,Dropdown} from 'react-bootstrap'
import { useLazyQuery, useMutation,  gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

function EmployeeList() {
    const atmObject = useContext(AtmObject)
    const { account, setAccount, isAdmin } = atmObject;

    const history = useHistory()

    const [accts, setAccts] = useState([])

    const GET_EMPS = gql`
    query GET_EMPS {
        empAccounts {
        id
        name
        username
        email
        password
        workHistory {
            id
            type
            dateTime
        }
        }
        }
    `;

    const [empAccounts,{loading,error,data}] = useLazyQuery(GET_EMPS,{
        fetchPolicy: "no-cache"
        })

        useEffect(()=>{
            empAccounts()
        },[])
    
        useEffect(()=>{
            if(!loading && data){
                setAccts(data.empAccounts)
            }
        },[data])
    return (
        <div>
            {accts.map((item, index)=><div key = {index} className="fourColGrid"><div className="col1">{item.username}</div> <div className="col2">{item.id}</div> <div className="col3">{item.name}</div><div>{(new Date(item.workHistory[0].dateTime).getMonth())+1}/{new Date(item.workHistory[0].dateTime).getDate()}/{new Date(item.workHistory[0].dateTime).getFullYear()}</div></div>)}
        </div>
    )
}

export default EmployeeList
