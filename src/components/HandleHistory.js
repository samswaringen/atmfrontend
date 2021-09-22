import React, {useState, useEffect, useContext} from 'react'
import { AtmObject } from '../App'
import HistoryList from './HistoryList';

function HandleHistory(){
    const atmObject = useContext(AtmObject)
    const {account, user} = atmObject;
    return (
        <div className = "history-item">
            <HistoryList />
        </div>
    )
}

export default HandleHistory