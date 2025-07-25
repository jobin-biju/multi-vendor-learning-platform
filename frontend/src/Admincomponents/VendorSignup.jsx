import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const VendorRegistration = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for validation errors
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  // State for form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {
      name: '',
      phone: '',
      email: '',
      password: ''
    };
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      tempErrors.name = 'Name is required';
      isValid = false;
    } else if (name.trim().length < 3) {
      tempErrors.name = 'Name must be at least 3 characters';
      isValid = false;
    }

    // Phone validation
    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.trim())) {
      tempErrors.phone = 'Phone number must be 10 digits';
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())) {
      tempErrors.email = 'Invalid email address';
      isValid = false;
    }

    // Password validation
    if (!password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleForm = (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitStatus('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      let data = {
        name: name,
        phone: phone,
        approvestatus: 0,
        email: email,
        password: password,
        usertype: 0
      };
      
      fetch('http://localhost:4000/multivendor/vendoreg', {
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Server error');
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setSubmitStatus('success');
        setSubmitMessage('Registration successful! You can now login.');
        
        // Clear form data
        setName('');
        setPhone('');
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        console.error('Error:', error);
        setSubmitStatus('error');
        setSubmitMessage('Registration failed. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url("https://img.freepik.com/free-vector/hand-drawn-teachers-day-background_23-2149078622.jpg?t=st=1744035810~exp=1744039410~hmac=0378dd5c364f3e46f466652428fc6754792578e2f610a136004adb0d287678fc&w=1380")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Helvetica, Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '35px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: '16px',
        backdropFilter: 'blur(8px)',
        marginLeft: '520px'
      }}>
        <Link to={'/'} style={{
          display: 'flex',
          alignItems: 'center',
          color: '#2fbfa7',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
        <div style={{ textAlign: 'center', marginBottom: '35px', position: 'relative' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: '#2fbfa7',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 15px auto',
            boxShadow: '0 4px 12px rgba(47, 191, 167, 0.3)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="white" />
              <path d="M12 13C7.03 13 3 17.03 3 22H21C21 17.03 16.97 13 12 13Z" fill="white" />
            </svg>
          </div>

          <h1 style={{
            color: '#1e7d75', 
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Vendor Registration
          </h1>
          <p style={{
            color: '#4b5563',
            fontSize: '15px',
            lineHeight: '1.5'
          }}>
            Register to provide your services
          </p>
        </div>

        {submitMessage && (
          <div style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: submitStatus === 'success' ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 0, 0, 0.1)',
            color: submitStatus === 'success' ? '#00833d' : '#d32f2f',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleForm}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Name
            </label>
            <input
              type="text"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.name ? '2px solid #d32f2f' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              required
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.phone ? '2px solid #d32f2f' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                {errors.phone}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Email
            </label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.email ? '2px solid #d32f2f' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: errors.password ? '2px solid #d32f2f' : '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: isSubmitting ? '#94e0d8' : '#2fbfa7',
                backgroundImage: isSubmitting ? 'none' : 'linear-gradient(to right, #2fbfa7, #27a592)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(47, 191, 167, 0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {isSubmitting ? 'Registering...' : 'Register Vendor'}
            </button>
          </div>

          <div style={{
            textAlign: 'center',
            paddingTop: '18px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link to={'/login'} style={{
                color: '#2fbfa7',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'color 0.2s'
              }}>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistration;