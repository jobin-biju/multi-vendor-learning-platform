import React, { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaUserTie, FaSpinner } from 'react-icons/fa';

function VendorTable() {
  const [vendorView, setVendorView] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = () => {
    setLoading(true);
    fetch('http://localhost:4000/multivendor/vendorview')
      .then((res) => res.json())
      .then((result) => {
        setVendorView(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching vendors:', error);
        setLoading(false);
      });
  };

  const handleApprove = (id) => {
    setActionInProgress(id + '-approve');
    const data = {
      id: id,
      approvestatus: 1,
    };

    fetch('http://localhost:4000/multivendor/approve', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        console.log('Approve status ', result);
        fetchVendors(); // Refresh the data
        setActionInProgress(null);
      })
      .catch(error => {
        console.error(error);
        setActionInProgress(null);
      });
  };

  const handleReject = (id) => {
    setActionInProgress(id + '-reject');
    const data = {
      id: id,
      approvestatus: 2,
    };

    fetch('http://localhost:4000/multivendor/approve', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        console.log('Approve status ', result);
        fetchVendors(); // Refresh the data
        setActionInProgress(null);
      })
      .catch(error => {
        console.error(error);
        setActionInProgress(null);
      });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 0:
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 1:
        return <span className="badge bg-success">Approved</span>;
      case 2:
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="container-fluid py-4" style={{
      background: '#ffffff',
      minHeight: '100vh'
    }}>
      <div className="row mb-4">
        <div className="col">
          <div className="card shadow-sm" style={{
            borderRadius: '15px',
            overflow: 'hidden',
            animation: 'fadeIn 0.6s ease-in-out',
            border: 'none'
          }}>
            <div className="card-header d-flex justify-content-between align-items-center" style={{
              background: 'linear-gradient(90deg, #5e72e4 0%, #36b9d8 100%)',
              padding: '15px 20px',
              color: 'white'
            }}>
              <h4 className="mb-0 d-flex align-items-center">
                <FaUserTie className="me-2" /> Vendor Management
              </h4>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                  <div className="spinner-border" role="status" style={{ 
                    width: '3rem', 
                    height: '3rem',
                    color: '#5e72e4'
                  }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading vendors...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="px-4">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorView.length > 0 ? (
                        vendorView.map((item, index) => (
                          <tr key={index} style={{
                            animation: `slideIn 0.3s ease-out forwards`,
                            animationDelay: `${index * 0.05}s`,
                            opacity: 0
                          }}>
                            <td className="px-4">{index + 1}</td>
                            <td>
                              <div className="fw-bold">{item.vendorid.name}</div>
                            </td>
                            <td>{item.vendorid.phone}</td>
                            <td>{item.email}</td>
                            <td>{getStatusBadge(item.vendorid.approvestatus)}</td>
                            <td className="text-center">
                              {item.vendorid.approvestatus === 0 ? (
                                <div className="btn-group" role="group">
                                  <button 
                                    className="btn btn-sm me-2" 
                                    onClick={() => handleApprove(item.vendorid._id)}
                                    disabled={actionInProgress === item.vendorid._id + '-approve'}
                                    style={{
                                      transition: 'all 0.3s ease',
                                      transform: 'translateY(0)',
                                      background: '#36b9d8',
                                      color: 'white',
                                      borderColor: '#36b9d8'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(54, 185, 216, 0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  >
                                    {actionInProgress === item.vendorid._id + '-approve' ? (
                                      <FaSpinner className="fa-spin" />
                                    ) : (
                                      <>
                                        <FaCheck className="me-1" /> Approve
                                      </>
                                    )}
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => handleReject(item.vendorid._id)}
                                    disabled={actionInProgress === item.vendorid._id + '-reject'}
                                    style={{
                                      transition: 'all 0.3s ease',
                                      transform: 'translateY(0)'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  >
                                    {actionInProgress === item.vendorid._id + '-reject' ? (
                                      <FaSpinner className="fa-spin" />
                                    ) : (
                                      <>
                                        <FaTimes className="me-1" /> Reject
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : item.vendorid.approvestatus === 1 ? (
                                <div className="text-success fw-bold">
                                  <FaCheck className="me-1" /> Approved
                                </div>
                              ) : item.vendorid.approvestatus === 2 ? (
                                <div className="text-danger fw-bold">
                                  <FaTimes className="me-1" /> Rejected
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No vendors found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(15px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default VendorTable;
