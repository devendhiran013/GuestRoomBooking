import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import register1 from '../assests/register1.jpg'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
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
      console.log('Submitting form data:', formData);

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
          role: formData.role,
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
    <div style={{ margin: '0', padding: '0', boxSizing: 'border-box' }}>
      <div className="container-fluid" style={{ padding: '0' }}>
        <div className="p-4 bg-image" style={{
          backgroundImage: `url(${register1})`,
          height: '120px',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>

        <div className="card mx-auto mb-4 p-4 shadow-5" style={{
          width: '70%', 
          maxWidth: '700px',
          marginTop: '-80px', 
          background: 'hsla(0, 0%, 100%, 0.8)', 
          backdropFilter: 'blur(30px)', 
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}>
          <div className="card-body p-4 text-center">

            <h2 className="fw-bold mb-4">Sign up now</h2>

            <form onSubmit={handleSubmit} className="form-spacing">
              <div className="row">
                <div className="col-6">
                  <div className="mb-2">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="mb-2">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {!passwordMatch && (
                <p style={{ color: "red" }}>Passwords do not match</p>
              )}

              <div className="mb-2">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button className="btn btn-primary w-100 mb-2" type="submit" disabled={!passwordMatch}>
                Register
              </button>
            </form>

            <div className="text-center">
              <p>Already have an account? <a href="/login">Log In Here</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
