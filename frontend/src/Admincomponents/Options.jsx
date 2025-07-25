import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupOptions = () => {
  const navigate = useNavigate();

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #2fbfa7, #ff7029)',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    animation: 'fadeIn 1s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
  };

  const glowStyle = {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 80%)',
    borderRadius: '50%',
    top: '-100px',
    left: '-100px',
    animation: 'rotateGlow 20s linear infinite',
  };

  const headingStyle = {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  const subheadingStyle = {
    fontSize: '20px',
    marginBottom: '50px',
    maxWidth: '700px',
    lineHeight: '1.6',
  };

  const optionContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '40px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const optionStyle = {
    padding: '40px 50px',
    backgroundColor: '#ffffff',
    color: '#2fbfa7',
    borderRadius: '20px',
    cursor: 'pointer',
    minWidth: '200px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.4s ease, background-color 0.4s ease, color 0.4s ease',
    fontSize: '22px',
    fontWeight: '700',
    animation: 'slideUp 0.8s ease forwards',
    transform: 'translateY(20px)',
  };

  return (
    <div style={containerStyle}>
      <div style={glowStyle}></div>
      <h1 style={headingStyle}>Welcome to the Learning Hub</h1>
      <p style={subheadingStyle}>
        Step into the future of education. Choose your role and explore endless possibilities as a Learner or become a content-driven Vendor.
      </p>
      <div style={optionContainerStyle}>
        <div
          style={optionStyle}
          onClick={() => navigate('/register')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#2fbfa7';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(20px)';
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#2fbfa7';
          }}
        >
          👨‍🎓 Learner
        </div>
        <div
          style={{ ...optionStyle, color: '#ff7029' }}
          onClick={() => navigate('/vendorsignup')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#ff7029';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(20px)';
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#ff7029';
          }}
        >
          🧑‍💼 Vendor
        </div>
      </div>
    </div>
  );
};

export default SignupOptions;
