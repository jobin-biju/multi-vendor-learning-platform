import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    // Validation
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const data = { email, password };

    fetch('http://localhost:4000/multivendor/login', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
      setLoading(false);
      if (typeof result === 'object' && result.usertype !== undefined) {
        // Note: localStorage not available in Claude artifacts
        localStorage.setItem("tourstorage", JSON.stringify(result));
        window.location.href = "/";
      } else {
        setErrorMsg(result);
      }
    })
    .catch(err => {
      setLoading(false);
      console.error("Login error:", err);
      setErrorMsg("Server error. Please try again later.");
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      backgroundColor: '#f8fafc'
    }}>
      {/* Left Side - Hero Section */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, #06b6d4, #10b981)',
          borderRadius: '50%',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, #f97316, #ef4444)',
          borderRadius: '50%',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(45deg, #06b6d4, #10b981)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px'
            }}>
              <span style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>e</span>
            </div>
            <div>
              <h1 style={{
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>eLEARN</h1>
              <p style={{
                color: '#94a3b8',
                fontSize: '14px',
                margin: 0,
                fontWeight: '500'
              }}>READ AND GROW</p>
            </div>
          </div>
          
          <h2 style={{
            color: 'white',
            fontSize: '36px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Welcome Back to Your Learning Journey
          </h2>
          
          <p style={{
            color: '#cbd5e1',
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '40px'
          }}>
            Transform your learning experience with our comprehensive online education platform. Continue where you left off and unlock your potential.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#06b6d4',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>10K+</div>
              <div style={{
                color: '#94a3b8',
                fontSize: '14px'
              }}>Students</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#10b981',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>500+</div>
              <div style={{
                color: '#94a3b8',
                fontSize: '14px'
              }}>Courses</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#f97316',
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>95%</div>
              <div style={{
                color: '#94a3b8',
                fontSize: '14px'
              }}>Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        maxWidth: '600px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px'
        }}>
          <div style={{
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#1e293b',
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              Sign In
            </h2>
            <p style={{
              color: '#64748b',
              fontSize: '16px',
              margin: 0
            }}>
              Enter your credentials to access your account
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                background: '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#06b6d4';
                e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <label style={{
                color: '#374151',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                Password
              </label>
              <a href="/forgotpassword" style={{
                color: '#06b6d4',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
                background: '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#06b6d4';
                e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #06b6d4, #10b981)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '32px',
              transform: loading ? 'none' : 'translateY(0)',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.3)';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <p style={{
              color: '#64748b',
              fontSize: '15px',
              margin: 0
            }}>
              Don't have an account?{' '}
              <a href="/register" style={{
                color: '#06b6d4',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Sign up for free
              </a>
            </p>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '24px'
          }}>
            <a href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Login;