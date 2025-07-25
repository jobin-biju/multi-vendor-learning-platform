import { useEffect, useState } from 'react';

function Viewreply() {
  const [viewreply, setViewreply] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = JSON.parse(localStorage.getItem('tourstorage'));
  const ADMIN_ID = "67ff4b2802deb78259bc0fd5";

  useEffect(() => {
    if (!auth?.vendorid) {
      console.warn("No vendorid found in localStorage");
      setLoading(false);
      return;
    }

    const data = {
      userId: auth.vendorid
    };

    fetch('http://localhost:4000/multivendor/viewreply', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        const sorted = [...result].sort((a, b) => new Date(b.repliedAt) - new Date(a.repliedAt));
        setViewreply(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching replies:", err);
        setLoading(false);
      });
  }, [auth?.vendorid]);

  // Separate admin and vendor replies
  const adminReplies = viewreply.filter(item => item.adminId === ADMIN_ID);
  const vendorReplies = viewreply.filter(item => item.adminId !== ADMIN_ID);

  const renderReplyCard = (item, idx, type) => (
    <div
      key={idx}
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
    >
      {/* Decorative accent line */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '3px',
        background: type === 'admin' 
          ? 'linear-gradient(90deg, #dc2626, #ef4444)' 
          : 'linear-gradient(90deg, #2563eb, #3b82f6)'
      }}></div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: type === 'admin' 
            ? 'linear-gradient(135deg, #dc2626, #ef4444)' 
            : 'linear-gradient(135deg, #2563eb, #3b82f6)',
          marginRight: '10px',
          boxShadow: `0 2px 6px ${type === 'admin' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`
        }}></div>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#374151',
          textTransform: 'uppercase',
          letterSpacing: '0.8px'
        }}>
          {type === 'admin' ? 'Admin Reply' : 'Vendor Reply'}
        </span>
        <div style={{
          marginLeft: 'auto',
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: type === 'admin' 
            ? 'linear-gradient(135deg, #fef2f2, #fee2e2)' 
            : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}>
          {type === 'admin' ? '👑' : '🏪'}
        </div>
      </div>
      
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
        borderRadius: '10px',
        padding: '18px',
        marginBottom: '20px',
        border: '1px solid #f1f5f9',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
          opacity: '0.5'
        }}></div>
        <p style={{ 
          margin: '0', 
          fontSize: '15px', 
          lineHeight: '1.6',
          color: '#111827',
          fontWeight: '500'
        }}>
          {item.reply}
        </p>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px'
      }}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fafbfc',
          borderRadius: '8px',
          borderLeft: `3px solid ${type === 'admin' ? '#dc2626' : '#2563eb'}`
        }}>
          <p style={{ 
            margin: '0 0 6px 0', 
            fontSize: '11px', 
            color: '#6b7280',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            💬 Feedback
          </p>
          <p style={{ 
            margin: '0', 
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.5',
            fontWeight: '500'
          }}>
            {item.feedbackId?.description || 'No description available'}
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div style={{
            padding: '10px 12px',
            backgroundColor: '#fafbfc',
            borderRadius: '8px'
          }}>
            <p style={{ 
              margin: '0 0 4px 0', 
              fontSize: '11px', 
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              👤 User
            </p>
            <p style={{ 
              margin: '0', 
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500'
            }}>
              {item.userId?.name || 'Unknown'}
            </p>
          </div>
          
          <div style={{
            padding: '10px 12px',
            backgroundColor: '#fafbfc',
            borderRadius: '8px'
          }}>
            <p style={{ 
              margin: '0 0 4px 0', 
              fontSize: '11px', 
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📅 Date
            </p>
            <p style={{ 
              margin: '0', 
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500'
            }}>
              {new Date(item.repliedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ 
            fontSize: '16px', 
            margin: 0, 
            fontWeight: '600',
            color: '#374151'
          }}>
            Loading replies...
          </p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #e5e7eb',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, #2563eb, #dc2626)'
        }}></div>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #1f2937, #374151)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Reply Management Dashboard
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Monitor and manage all your conversations in one place
        </p>
      </div>

      {viewreply.length === 0 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 140px)',
          padding: '32px'
        }}>
          <div style={{
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '48px 32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              📭
            </div>
            <h3 style={{
              fontSize: '22px',
              margin: '0 0 12px 0',
              fontWeight: '700',
              color: '#111827'
            }}>
              No replies found
            </h3>
            <p style={{
              fontSize: '16px',
              margin: '0',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              Your reply conversations will appear here once you start engaging
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 'calc(100vh - 140px)'
        }}>
          {/* Left Side - Vendor Replies */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              color: '#ffffff',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)'
              }}></div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  backdropFilter: 'blur(10px)'
                }}>
                  V
                </div>
                <div>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    margin: '0',
                    color: '#ffffff'
                  }}>
                    Vendor Replies
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    margin: '4px 0 0 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500'
                  }}>
                    {vendorReplies.length} active {vendorReplies.length === 1 ? 'conversation' : 'conversations'}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '24px',
              height: 'calc(100vh - 220px)',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)'
            }}>
              {vendorReplies.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '60px 20px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '24px'
                  }}>
                    🏪
                  </div>
                  <p style={{
                    fontSize: '18px',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    No vendor replies yet
                  </p>
                  <p style={{
                    fontSize: '14px',
                    margin: '0',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    Vendor conversations will appear here
                  </p>
                </div>
              ) : (
                vendorReplies.map((item, idx) => renderReplyCard(item, idx, 'vendor'))
              )}
            </div>
          </div>

          {/* Right Side - Admin Replies */}
          <div style={{
            backgroundColor: '#ffffff',
            position: 'relative'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #dc2626, #ef4444)',
              color: '#ffffff',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)'
              }}></div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  backdropFilter: 'blur(10px)'
                }}>
                  A
                </div>
                <div>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    margin: '0',
                    color: '#ffffff'
                  }}>
                    Admin Replies
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    margin: '4px 0 0 0',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '500'
                  }}>
                    {adminReplies.length} active {adminReplies.length === 1 ? 'conversation' : 'conversations'}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '24px',
              height: 'calc(100vh - 220px)',
              overflowY: 'auto',
              background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)'
            }}>
              {adminReplies.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '60px 20px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '24px'
                  }}>
                    👑
                  </div>
                  <p style={{
                    fontSize: '18px',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    No admin replies yet
                  </p>
                  <p style={{
                    fontSize: '14px',
                    margin: '0',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    Admin conversations will appear here
                  </p>
                </div>
              ) : (
                adminReplies.map((item, idx) => renderReplyCard(item, idx, 'admin'))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Viewreply;