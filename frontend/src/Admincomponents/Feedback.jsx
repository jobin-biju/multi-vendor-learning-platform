import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function Feedback() {
    useEffect(() => {
    if (sessionStorage.getItem("reload") === "true") {
      sessionStorage.removeItem("reload");
      window.location.reload();
    }
  }, []);
  const [vendor, setVendor] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null); // null | 'admin' | 'vendor'
  const [formData, setFormData] = useState({
    vendorId: '',
    instructorId: '',
    title: '',
    description: ''
  });

  const auth = JSON.parse(localStorage.getItem('tourstorage'));

  useEffect(() => {
    if (selectedRole === 'vendor') {
      const data = {
        user: auth.vendorid
      };
      fetch("http://localhost:4000/multivendor/viewvendor", {
        method: 'POST',
        headers: {
          Accept: "application/json",
          'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((result) => {
          setVendor(result);
        });
    }
  }, [selectedRole]);

  const handleSubmit = () => {
    const dataToSend = {
      userId: auth.vendorid,
      type: selectedRole,
      vendorId: selectedRole === 'vendor' ? formData.vendorId : undefined,
      instructorId: selectedRole === 'vendor' ? formData.instructorId : undefined,
      title: selectedRole === 'admin' ? formData.title : undefined,
      description: formData.description
    };

    fetch("http://localhost:4000/multivendor/submitfeedback", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(dataToSend)
    })
      .then(res => res.json())
      .then(result => {
        alert("Feedback submitted successfully!");
        setFormData({
          vendorId: '',
          instructorId: '',
          title: '',
          description: ''
        });
      });
  };

  // Styles
  const containerStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '40px',
    background: '#2FBFA7',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    color: '#fff'
  };

  const titleStyle = {
    color: '#fff',
    fontSize: '32px',
    fontWeight: '300',
    margin: '0 0 10px 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  };

  const subtitleStyle = {
    color: '#fff',
    fontSize: '16px',
    opacity: '0.9',
    fontWeight: '300'
  };

  const roleButtonContainerStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginBottom: '40px'
  };

  const roleButtonStyle = (isSelected) => ({
    padding: '15px 30px',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isSelected 
      ? 'linear-gradient(135deg, #48cc6c, #42a85f)' 
      : 'rgba(255,255,255,0.2)',
    color: isSelected ? '#fff' : '#fff',
    backdropFilter: 'blur(10px)',
    boxShadow: isSelected 
      ? '0 8px 25px rgba(72,204,108,0.4)' 
      : '0 4px 15px rgba(0,0,0,0.1)',
    transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
    border: '1px solid rgba(255,255,255,0.3)'
  });

  const formContainerStyle = {
    background: 'rgba(255,255,255,0.95)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  };

  const formTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '30px',
    textAlign: 'center',
    position: 'relative'
  };

  const formTitleUnderlineStyle = {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '3px',
    background: 'linear-gradient(135deg, #56ab91, #4a9b8d)',
    borderRadius: '2px'
  };

  const inputGroupStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px 20px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: '#fff',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const inputFocusStyle = {
    outline: 'none',
    borderColor: '#56ab91',
    boxShadow: '0 0 0 3px rgba(86,171,145,0.1)'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 15px center',
    backgroundSize: '20px',
    paddingRight: '50px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
    lineHeight: '1.6'
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '18px',
    background: '#fff',
    color: '#4a9b8d',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '20px',
    boxShadow: '0 8px 25px rgba(86,171,145,0.15)'
  };

  const submitButtonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(86,171,145,0.4)'
  };

  // Get unique vendors by venid._id
const uniqueVendors = vendor
  .filter(item => item.venid && item.venid._id)
  .filter((item, idx, arr) =>
    arr.findIndex(v => v.venid._id === item.venid._id) === idx
  );

// Get unique instructors by instructorid._id
const uniqueInstructors = vendor
  .filter(item => item.instructorid && item.instructorid._id)
  .filter((item, idx, arr) =>
    arr.findIndex(v => v.instructorid._id === item.instructorid._id) === idx
  );

  return (
    <>
    <Navbar/>
            <section  className="page-title-section bg-img cover-background top-position1 left-overlay-dark"  data-overlay-dark="9" style={{ backgroundImage: "url('img/bg/bg-04.jpg')" }} >
            <div className="container">
                <div className="row text-center">
                    <div className="col-md-12">
                        <h1>Feedback</h1>
                    </div>
                    <div className="col-md-12">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="#!">Feedback</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Feedback Center</h1>
        <p style={subtitleStyle}>Share your thoughts and help us improve</p>
      </div>

      <div style={roleButtonContainerStyle}>
        <button 
          style={roleButtonStyle(selectedRole === 'admin')}
          onClick={() => setSelectedRole('admin')}
          onMouseEnter={(e) => {
            if (selectedRole !== 'admin') {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedRole !== 'admin') {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          Admin Feedback
        </button>
        <button 
          style={roleButtonStyle(selectedRole === 'vendor')}
          onClick={() => setSelectedRole('vendor')}
          onMouseEnter={(e) => {
            if (selectedRole !== 'vendor') {
              e.target.style.background = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedRole !== 'vendor') {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          Vendor Complaint
        </button>
      </div>

      {selectedRole === 'vendor' && (
        <div style={formContainerStyle}>
          <h2 style={formTitleStyle}>
            Vendor Complaint Form
            <div style={formTitleUnderlineStyle}></div>
          </h2>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Select Vendor</label>
            <select 
              style={selectStyle}
              value={formData.vendorId} 
              onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Choose a vendor...</option>
              {uniqueVendors.map(item => (
                <option key={item.venid._id} value={item.venid._id}>
                  {item.venid.name}
                </option>
              ))}
            </select>
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Select Instructor</label>
            <select 
              style={selectStyle}
              value={formData.instructorId} 
              onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Choose an instructor...</option>
              {uniqueInstructors.map(item => (
                <option key={item.instructorid._id} value={item.instructorid._id}>
                  {item.instructorid.name}
                </option>
              ))}
            </select>
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Your Feedback</label>
            <textarea
              style={textareaStyle}
              placeholder="Please describe your complaint in detail. Include specific examples and suggestions for improvement..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      )}

      {selectedRole === 'admin' && (
        <div style={formContainerStyle}>
          <h2 style={formTitleStyle}>
            Admin Feedback Form
            <div style={formTitleUnderlineStyle}></div>
          </h2>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Feedback Title</label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Enter a brief title for your feedback..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Detailed Description</label>
            <textarea
              style={textareaStyle}
              placeholder="Please provide detailed feedback about the system, features, or any suggestions you have..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      )}

      {selectedRole && (
        <button 
          style={submitButtonStyle}
          onClick={handleSubmit}
          onMouseEnter={(e) => Object.assign(e.target.style, submitButtonHoverStyle)}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 25px rgba(86,171,145,0.3)';
          }}
        >
          Submit Feedback
        </button>
      )}
      <div><Link to='/viewreply'> view</Link></div>
    </div>
    <Footer/>
    </>
  );
}

export default Feedback;