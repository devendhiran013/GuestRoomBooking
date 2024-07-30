import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.scss'; 
import { setLogin } from '../redux/state'; 
import draw from "../assests/draw2.webp"; 
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
    <div className="container-fluid p-3 my-5 h-custom">
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={draw}
            className="img-fluid"
            alt="Sample"
          />
        </div>

        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="w-75"> {/* Restrict width of form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-between mb-4">
               
                
              </div>

              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="text-center text-md-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg px-5" disabled={isButtonDisabled}>
                  LOG IN
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Don't have an account? <a href="/register" className="link-danger">Register</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
