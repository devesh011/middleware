const { render, screen, fireEvent, waitFor  } = require('@testing-library/react');
const axios = require('axios');
import LoginPage from '../src/app/login/page';
import SignupPage from '../src/app/signup/page';
import userEvent from '@testing-library/user-event';
import  {useRouter}  from 'next/navigation';
import {toBeInTheDocument,getByRole,getByText,getByTestId} from '@testing-library/jest-dom';
jest.mock('axios');

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

describe('SignupPage Component', () => {

  test('renders SignupPage without crashing', () => {
    render(<SignupPage />);

  });
  
  test('disables signup button initially', () => {
    render(<SignupPage />);
    const signupButton = screen.getByRole('button', { name: 'Sign_up' });
    expect(signupButton).toBeDisabled();
  });

  test('enables signup button when all fields are filled', () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    const signupButton = screen.getByRole('button', { name: 'Sign_up' });
    expect(signupButton).toBeEnabled();
  });

  test('displays error messages for invalid inputs', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign_up' }));
    // Wait for async validation to finish
     waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('submits form when all inputs are valid', async () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign_up' }));

    await waitFor(() => {
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });
    // Redirected to login page
    expect(window.location.pathname).toBe('/');
  });
    
});

describe('LoginPage', () => {

  test('renders LoginPage correctly', () => {
    render(<LoginPage />);
    // Check if the necessary elements are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
  });

  test('disables login button initially', () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button', { name: 'Log in' });
    expect(loginButton).toBeDisabled();
  });

  test('displays error messages for invalid email and password inputs', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    // Wait for async validation to finish
     waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('submits form when all inputs are valid', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    // Mock the API call to avoid actual network request
    await waitFor(() => {
      // Assert if API call was made, you may need to mock axios.post
      // Expect redirection to profile page after successful login
      expect(screen.getByText('Processing')).toBeInTheDocument();
    });
    // Redirected to profile page
    expect(window.location.pathname).toBe('/');
  });

 test('enables login button when email and password fields are filled', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    const loginButton = screen.getByRole('button', { name: 'Log in' });
    expect(loginButton).toBeEnabled();
  });

  test('should display error messages for empty email and password', async () => {
    render(<LoginPage />);
    
    // Simulate submitting the form with empty email and password
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    // Assert that the error messages are displayed
     waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });
});