import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url from '../Vendor/ImageUrl';

function MyCourseView() {
  const [mycourses, setMycourses] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  const navigate = useNavigate();

  useEffect(() => {
    let ids = { userid: auth.vendorid };
    fetch('http://localhost:4000/multivendor/getmycourses', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        setMycourses(result);
      });
  }, [auth.vendorid]);

  const handleCourseClick = (course) => {
    navigate('/courselessons', {
      state: {
        courseid: course._id,
        title: course.title || course.name || course.coursetitle,
      },
    });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Sidebar */}
      <div
        style={{
          width: 260,
          background: 'linear-gradient(180deg, #1e3a8a, #2563eb)',
          color: '#fff',
          padding: '30px 20px',
          boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#fff',
            color: '#1e3a8a',
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            marginBottom: '30px',
            cursor: 'pointer',
            transition: 'background 0.3s',
          }}
        >
          ← Back
        </button>
        <h2 style={{ fontSize: '1.7rem', marginBottom: '10px' }}>My Learning</h2>
        <p style={{ fontSize: '1rem', color: '#e0e7ff' }}>
          {mycourses.length} Course{mycourses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1
          style={{
            fontSize: '2.2rem',
            color: '#1e293b',
            marginBottom: '30px',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.5px',
          }}
        >
          Your Learning Dashboard
        </h1>

        {mycourses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>No courses found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {mycourses.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.07)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.07)';
                }}
              >
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <img
                    src={url + item.thumbnail}
                    alt="Course Thumbnail"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{ padding: '18px 20px' }}>
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '10px',
                    }}
                  >
                    {item.title || item.name || item.coursetitle || 'Untitled Course'}
                  </h3>
                  <button
                    onClick={() => handleCourseClick(item)}
                    style={{
                      padding: '8px 14px',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      transition: 'background 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    Start Learning →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourseView;