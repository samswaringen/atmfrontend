import React, { useContext, useEffect } from 'react'
import { AtmObject } from '../App'

function RecentHours() {
    const atmObject = useContext(AtmObject);
    const { account, employee} = atmObject
    return (
        <div>
            {employee.workHistory.map((item,index)=><div>Clock {item.type} on {(new Date(item.dateTime).getMonth())+1}-{new Date(item.dateTime).getDate()}-{new Date(item.dateTime).getFullYear()} at {new Date(item.dateTime).getHours()}:{new Date(item.dateTime).getMinutes()}:{new Date(item.dateTime).getSeconds()}</div>)}
        </div>
    )
}

export default RecentHours
