import React, { useState } from 'react';
import '../styles/Login.scss';
import { setLogin } from '../redux/state';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loggedIn = await response.json();
      if (response.ok) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        navigate('/');
      } else {
        setError(loggedIn.message || 'Login Failed');
        setIsButtonDisabled(false);
      }
    } catch (err) {
      console.log('Login Failed', err.message);
      setError('Login Failed');
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className='login'>
      <div className='login_content'>
        <form className='login_content_form' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type='submit' disabled={isButtonDisabled}>LOG IN</button>
        </form>
        <a href='/register'>Don't have an account? Sign Up Here</a>
      </div>
    </div>
  );
};

export default LoginPage;
