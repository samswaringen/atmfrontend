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

    const onSubmit = async(values)=>{
        console.log("values:",values)
        console.log("account in contact", account)
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
    const initialValues = {
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
                                        <Field name= "pin" type='number' placeholder="Enter Pin 4-8 chars" ></Field>
                                        <div className= "error"><ErrorMessage name = 'pin'/></div>
                                    </div>
                                    <div className= "field-div">
                                        <Field name= "confirmPin" type='number' placeholder="Confirm Pin" ></Field>
                                        <div className= "error"><ErrorMessage name = 'confirmPin'/></div>
                                    </div>
                                    <div className= "field-div">
                                        <Field name= "firstName" type='input' placeholder="First Name" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">
                                        <Field name= "lastName" type='input' placeholder="Last Name" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">
                                        <Field name= "phoneNum" type='input' placeholder="Phone Number" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">                          
                                        <Field name= "billing" type='input' placeholder="Billing Address" ></Field>                          
                                        <Field name= "billingCity" type='input' placeholder="City" ></Field>                     
                                        <Field name= "billingState" type='input'placeholder="State" ></Field>                          
                                        <Field name= "billingZip" type='input' placeholder="Zip" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div">                            
                                        <Field name= "mailing" type='input' placeholder="Mailing Address" ></Field>                                                             
                                        <Field name= "mailingCity" type='input'  placeholder="City" ></Field>                                                              
                                        <Field name= "mailingState" type='input' placeholder="State" ></Field>                          
                                        <Field name= "mailingZip" type='input' placeholder="Zip" ></Field>
                                        <div className= "error"><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/><ErrorMessage name = 'username'/></div>
                                    </div>
                                    <div className= "field-div"> 
                                        Same as Billing
                                        <Field type="checkbox"></Field>
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
