import React, { useState, useContext, useEffect } from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation,  gql } from "@apollo/client";
import { AtmObject } from '../App'
import { useHistory } from "react-router-dom";

function LoggedInAccount() {
    const atmObject = useContext(AtmObject);
    const { account, employee, isEmployee, isVerified} = atmObject

    const history = useHistory()
    return (
        <div id="logged-in-account">
            { !isVerified && <>
                Not Logged in
                </>
            }
           { isVerified && isEmployee &&
            <>
                Logged in as <strong>{employee.username}</strong>
            </>
           } 
           { isVerified && !isEmployee &&
            <>
                Logged in as <strong>{account.username}</strong>
            </>
           }
        </div>
    )
}

export default LoggedInAccount
