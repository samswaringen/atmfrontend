import React from 'react'
import { useHistory } from "react-router-dom";


function Success() {
    const history = useHistory()

    setTimeout(()=>{
        history.push("/components/Home")
    },2000)
    return (
        <div>
            Success!<br/>Redirecting to Sign In...
        </div>
    )
}

export default Success
