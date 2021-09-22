import React, { useContext, useEffect } from 'react'
import { AtmObject } from '../App'
import { useHistory } from "react-router-dom";
import Card from 'react-bootstrap/Card'


function Loading() {
    return (
        <Card id="loading">
            Loading...
        </Card>
    )
}

export default Loading
