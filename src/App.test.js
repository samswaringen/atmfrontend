import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent  from '@testing-library/user-event';
import App from './App';

test('Check if Create Account works', async() => {
  const { getByText,  getByPlaceholderText} =  render(<App />)


  //Check Create Account navbar link works
  const create = getByText('Create One')
  act(()=>{
    userEvent.click(create)
  })

  
  //grab hold of input fields
    const username = getByPlaceholderText('Create Username')
    const name = getByPlaceholderText('Greeting Name')
    const email = getByPlaceholderText('Enter Email')
    const password = getByPlaceholderText('Create Password')
    const verify = getByPlaceholderText('Verify Password')



    //simulate user typing into fields
    act(()=>{
      userEvent.type(username, "admin")
      userEvent.type(name, "admin")
      userEvent.type(email, "admin@email.com")
      userEvent.type(password, "12345678")
      userEvent.type(verify, "12345678")
    })


  //if above works, submit button becomes enabed and is clickble
  //test clicking submit
  const submit = getByText('Submit')
  await waitFor(() =>{
    expect(submit).toBeInTheDocument
  })
  act(()=>{
  userEvent.click(submit)
  })
  
  //if all works it will load success screen
  await waitFor(() =>{
    expect('Success').toBeInTheDocument
  })
});
