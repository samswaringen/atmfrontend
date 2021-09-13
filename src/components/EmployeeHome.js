import React, { useContext, useEffect } from 'react'
import { AtmObject } from '../App'
import SignIn from './SignIn'
import { useHistory } from "react-router-dom";
import Card from 'react-bootstrap/Card'
import RecentHours from './RecentHours';
import { useLazyQuery,  gql, useMutation } from "@apollo/client";

function EmployeeHome() {
    const atmObject = useContext(AtmObject);
    const { account, clockedIn, setClockedIn, isVerified, isEmployee, employee, setEmployee, isAdmin} = atmObject

    let history = useHistory()

    const ADD_CLOCK = gql`
    mutation ADD_CLOCK(
        $id: String!,
        $clockedStatus: Boolean,
        $clockId: String!,
        $type : String!,
        $dateTime : String!
        ){
        addClock(id:$id, clockedStatus:$clockedStatus,input:{
          id:$clockId,
          type:$type
          dateTime: $dateTime
        }){
          id
          clockedStatus
          username
          workHistory{
            id
            type
            dateTime
          }
        }
      }
      `
    const [addClock,{loading,error,data}]= useMutation(ADD_CLOCK)

    useEffect(()=>{
        console.log("isAdmin?:",isAdmin)
    },[])


    const clockInorOut = ()=>{
        let d = new Date()
        let year = d.getFullYear()
        let month = d.getMonth()
        let day = d.getDate()
        let clockId = `${day}-${month}-${year}`
        if(clockedIn){
            console.log('clocked out!')
            let type = "out"
            addClock({variables:{id:employee.id, clockedStatus: false, clockId: clockId, type: type, dateTime: d}})
            setEmployee(employee, employee.clockedStatus = false, employee.workHistory.push({id: clockId,type: "out", dateTime: d}))
            setClockedIn(false)
        }else {
            console.log('clocked in!')
            let type = "in"
            addClock({variables:{id:employee.id,clockedStatus: true, clockId: clockId, type: type, dateTime: d}})
            setEmployee(employee, employee.clockedStatus = true, employee.workHistory.push({id: clockId,type: "in", dateTime: d}))
            setClockedIn(true)
        }
    }

    return (
        <Card id = "home">
            {isVerified ? 
            (<div id="emp-home-div">
                <h1 id="greeting">Hello {account.name}!</h1>
                <button type = "button" id="clockInOut" onClick = {clockInorOut}>Clock In/Out</button>
                <div id="recent-hours">Recent Hours <RecentHours/></div>
            </div>)
             : 
            (<div id="emp-home-unverified">
                <h2 id="welcome">React Banking System: Employee Portal</h2> 
                <SignIn />
            </div>)
            }                                   
        </Card>
    )
}

export default EmployeeHome
