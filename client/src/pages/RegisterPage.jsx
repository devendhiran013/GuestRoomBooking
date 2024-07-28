import React, { useEffect, useState } from 'react';
import '../styles/Register.scss';
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "");
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) return;

    try {
      console.log('Submitting form data:', formData); // Debugging log

      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role, // Include role in the request body
        }),
      });
      if (response.ok) {
        console.log('Registration successful');
        navigate("/login");
      } else {
        console.log('Registration failed: ', response.statusText);
      }
    } catch (err) {
      console.log('Registration failed', err.message);
    }
  };

  return (
    <div className='register'>
      <div className='register_content'>
        <form className='register_content_form' onSubmit={handleSubmit}>
          <input
            placeholder='FIRST NAME'
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder='LAST NAME'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder='Confirm Password'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}

          {/* Role Selector */}
          <div className='role-selector'>
            <label>
              <input
                type="radio"
                name="role"
                value="user"
                checked={formData.role === "user"}
                onChange={handleChange}
              />
              User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === "admin"}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>

          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
