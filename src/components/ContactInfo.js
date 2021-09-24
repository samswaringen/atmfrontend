import React, { useState, useContext, useEffect } from 'react'
import {Formik, Form, Field, ErrorMessage } from 'formik'
import { useMutation,  gql } from "@apollo/client";
import { AtmObject } from '../App'
import { useHistory } from "react-router-dom";

function ContactInfo() {
        const atmObject = useContext(AtmObject);
        const { account, setAccount, isEmployee} = atmObject

        const history = useHistory()

    const EDIT_CONTACT_INFO = gql`
    mutation EDIT_CONTACT_INFO($id: String, $firstName: String,$lastName: String,$phoneNum: Int,$mailing: String,$mailingCity: String,$mailingState: String,$mailingZip: Int,$billing: String,$billingCity: String,$billingState: String,$billingZip: Int){
        editContactInfo(id:$id, input:{
          firstName:$firstName,
          lastName:$lastName,
          phoneNum:$phoneNum,
          mailing:{
            streetName:$mailing,
            city: $mailingCity,
            state: $mailingState,
            zip:$mailingZip,
          }
          billing:{
            streetName:$billing,
            city: $billingCity,
            state: $billingState,
            zip:$billingZip,
          }
        }
        ){
          id
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
        }
      }
      `;

      const EDIT_ACCOUNT_PIN = gql`
        mutation EDIT_ACCOUNT_PIN($id:String!, $pin: String!){
            editAccountPin(id: $id, pin:$pin){
                id
                username
                pin
            }
        }
      `

    const [editContactInfo,{loading,error,data}] = useMutation(EDIT_CONTACT_INFO)
    const [editAccountPin,{loading:loadPin,error:errorPin,data:dataPin}] = useMutation(EDIT_ACCOUNT_PIN)

    let initialValues = {}

    useEffect(()=>{
        if(account.contact.firstName != null){     
            initialValues = {
                firstName: account.contact.firstName,
                lastName: account.contact.lastName,
                phoneNum: account.contact.phoneNum,
                mailing: account.contact.mailing.streetName,
                mailingCity: account.contact.mailing.city,
                mailingState: account.contact.mailing.state,
                mailingZip: account.contact.mailing.zip,
                billing: account.contact.billing.streetName,
                billingCity: account.contact.billing.city,
                billingState: account.contact.billing.state,
                billingZip: account.contact.billing.zip,
                pin: "",
                confirmPin: ""
            }
            document.getElementById('pin').placeholder = account.pin
            document.getElementById('firstName').value = account.contact.firstName
            document.getElementById('lastName').value = account.contact.lastName
            document.getElementById('phoneNum').value = account.contact.phoneNum
            document.getElementById('mailing').value = account.contact.mailing.streetName
            document.getElementById('mailingCity').value = account.contact.mailing.city
            document.getElementById('mailingState').value = account.contact.mailing.state
            document.getElementById('mailingZip').value = account.contact.mailing.zip
            document.getElementById('billing').value = account.contact.billing.streetName
            document.getElementById('billingCity').value = account.contact.billing.city
            document.getElementById('billingState').value = account.contact.billing.state
            document.getElementById('billingZip').value = account.contact.billing.zip
        }else{
            initialValues = {
                firstName:"",
                lastName:"",
                phoneNum:"",
                mailing:"",
                mailingCity:"",
                mailingState:"",
                mailingZip:"",
                billing:"",
                billingCity:"",
                billingState:"",
                billingZip:"",
                pin: "",
                confirmPin: ""
            }
        }
    },[])

    const handleSame = (e)=>{
        document.getElementById('mailing').value = document.getElementById('billing').value
        document.getElementById('mailingCity').value = document.getElementById('billingCity').value
        document.getElementById('mailingState').value = document.getElementById('billingState').value
        document.getElementById('mailingZip').value = document.getElementById('billingZip').value
    }

    const onSubmit = async(values)=>{
        await editContactInfo({variables:{id: account.id,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNum: Number(values.phoneNum),
            mailing: values.mailing,
            mailingCity: values.mailingCity,
            mailingState: values.mailingState,
            mailingZip: Number(values.mailingZip),
            billing: values.billing,
            billingCity: values.billingCity,
            billingState: values.billingState,
            billingZip: Number(values.billingZip)  
        }})
        await editAccountPin({variables:{id:account.id, pin: String(values.pin)}})
        setAccount(account, account.contact = {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNum: Number(values.phoneNum),
                mailing:{
                  streetName: values.mailing,
                  city: values.mailingCity,
                  state: values.mailingState,
                  zip:Number(values.mailingZip),
                },
                billing:{
                  streetName:values.billing,
                  city: values.billingCity,
                  state: values.billingState,
                  zip:Number(values.billingZip),
                }
        })
        if(isEmployee){
            history.push('/components/FindAccount')
        }else{
            history.push('/components/Home')
        }    
    }
    const validate = (values)=>{
        let errors = {}
        if(String(values.pin).split("").length<4){
            errors.pin = "Must be at least 4 numbers"
        }else if(String(values.pin).split("").length>8){
            errors.pin = "Must be less than 8 numbers"
        }
        if(values.confirmPin != values.pin){
            errors.pin = "Don't Match!"
            errors.confirmPin = "Don't Match!"
        }
        return errors
    }


    return (
        <div>
            <Formik
                initialValues = {initialValues}
                onSubmit = {onSubmit}
                validate = {validate}
                >
                {
                    formik =>{
                        return(
                            <div id="contact-Field">
                                <h2 id="create-title">Enter Contact Info</h2> 
                                <Form>
                                <div className= "field-div">
                                        Enter Pin:
                                        <Field id = "pin" name= "pin" type='number' placeholder="Enter Pin 4-8 chars" ></Field>
                                        <div className= "error"><ErrorMessage name = 'pin'/></div>
                                    </div>
                                    <div className= "field-div">
                                        Confirm Pin:
                                        <Field id = "confirmPin" name= "confirmPin" type='number' placeholder="Confirm Pin" ></Field>
                                        <div className= "error"><ErrorMessage name = 'confirmPin'/></div>
                                    </div>
                                    <div className= "field-div">
                                        First Name:
                                        <Field id ="firstName" name= "firstName" type='input' placeholder="First Name" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">
                                        Last Name:
                                        <Field id = "lastName" name= "lastName" type='input' placeholder="Last Name" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">
                                        Phone Number:
                                        <Field id = "phoneNum" name= "phoneNum" type='input' placeholder="Phone Number" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">
                                        Billing:                    
                                        <Field name= "billing" id = "billing" type='input' placeholder="Billing Address" ></Field>                          
                                        <Field name= "billingCity" id = "billingCity" type='input' placeholder="City" ></Field>                     
                                        <Field name= "billingState" id = "billingState" type='input'placeholder="State" ></Field>                          
                                        <Field name= "billingZip" id = "billingZip" type='input' placeholder="Zip" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">   
                                         Mailing:                        
                                        <Field name= "mailing" id = "mailing" type='input' placeholder="Mailing Address" ></Field>                                                             
                                        <Field name= "mailingCity" id = "mailingCity" type='input'  placeholder="City" ></Field>                                                              
                                        <Field name= "mailingState" id = "mailingState" type='input' placeholder="State" ></Field>                          
                                        <Field name= "mailingZip" id = "mailingZip" type='input' placeholder="Zip" ></Field>
                                        <button id = "sameDiv" name= "sameDiv" type="button" onClick={handleSame}>Same as Billing</button>
                                        <div className= "error"><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/></div>
                                        
                                    </div>
                                    
                                    <button id= "create-submit" className="submit-btn" type="submit" disabled = {!(formik.dirty && formik.isValid)}>Submit</button>
                                </Form>
                        </div>
                        )
                    }
                }
            </Formik>
        </div>
    )
}

export default ContactInfo
