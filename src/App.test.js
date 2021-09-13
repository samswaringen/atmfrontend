import { render, screen } from '@testing-library/react';
import userEvent  from '@testing-library/user-event';
import App from './App';

test('Check if Create Account works', () => {
  const { getByText,  getByPlaceholderText} = render(<App />);
  //Check Creat Account navbar link works
  const create = getByText('Create Account')
  userEvent.click(create)
  
  //grab hold of input fields
  const username = getByPlaceholderText('Create Username')
  const name = getByPlaceholderText('Greeting Name')
  const email = getByPlaceholderText('Enter Email')
  const password = getByPlaceholderText('Create Password')
  const verify = getByPlaceholderText('Verify Password')

  //simulate user typing into fields
  userEvent.type(username, "admin")
  userEvent.type(name, "admin")
  userEvent.type(email, "admin@email.com")
  userEvent.type(password, "12345678")
  userEvent.type(verify, "12345678")

  //if above works, submit button becomes enabed and is clickble
  //test clicking submit
  const submit = getByText('Submit')
  expect(submit).toBeInTheDocument
  userEvent.click(submit)
  
  //if all works it will load success screen
  expect('Success').toBeInTheDocument
});
