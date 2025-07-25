import React, { useEffect, useState } from 'react';

function ApptitudeCertificate() {
  const [certificates, setCertificates] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));

  useEffect(() => {
    const fetchCertificates = async () => {
      const user = { userId: auth.vendorid };
      const response = await fetch('http://localhost:4000/multivendor/getApptitudeCertificate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const result = await response.json();
      setCertificates(result);
    };

    fetchCertificates();
  }, [auth.vendorid]);

  const handlePayment = async (item) => {
    const res = await fetch('http://localhost:4000/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1500 }) // ₹1500
    });
    const order = await res.json();

    const options = {
      key: 'RAZORPAY_KEY_ID',
      amount: order.amount,
      currency: 'INR',
      name: 'Aptitude Certificate',
      description: 'Certificate Generation Fee',
      order_id: order.id,
      handler: async function (response) {
        await fetch('http://localhost:4000/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...response,
            userId: auth.vendorid,
            score: item.score
          })
        });
        alert('Payment Successful! Check your email.');
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const highestScore = certificates.length > 0 ? Math.max(...certificates.map(item => item.score)) : null;

  return (
    <div style={{ padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#111827' }}>Request Aptitude Certificate</h2>
      <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: 'auto' }}>
        {certificates.map((item, index) => (
          <li key={index} style={{ backgroundColor: '#fff', marginBottom: '20px', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <p><strong>Name:</strong> {item.userId?.name}</p>
            <p><strong>Score:</strong> {item.score}</p>
            {item.score === highestScore && (
              <button
                onClick={() => handlePayment(item)}
                style={{
                  marginTop: '12px',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Request Certificate (₹1500)
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApptitudeCertificate;
