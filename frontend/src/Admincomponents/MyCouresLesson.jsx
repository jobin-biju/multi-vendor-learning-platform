import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import url from '../Vendor/ImageUrl';

function CourseLessons() {
  const { state } = useLocation();
  const courseid = state?.courseid;
  const coursetitle = state?.title;
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseid) return;
    fetch(`http://localhost:4000/multivendor/lessons/${courseid}`)
      .then(res => res.json())
      .then(data => setLessons(data || []));
  }, [courseid]);

  const hasLessons = lessons && lessons.length > 0;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: 'linear-gradient(to bottom right, #1e3a8a, #2563eb)',
          color: '#fff',
          padding: '30px 20px',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#fff',
            color: '#1e3a8a',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            marginBottom: '30px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={e => (e.target.style.background = '#e0e7ff')}
          onMouseOut={e => (e.target.style.background = '#fff')}
        >
          ← Back
        </button>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '10px' }}>{coursetitle}</h2>
        <p style={{ fontSize: '1rem', color: '#cbd5e1' }}>
          {lessons.length} Lesson{lessons.length !== 1 ? 's' : ''}
        </p>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px' }}>
        <h1
          style={{
            fontSize: '2.2rem',
            color: '#1e293b',
            marginBottom: '40px',
            fontWeight: 700,
            textAlign: 'center',
            letterSpacing: '0.8px',
          }}
        >
          Lesson Details
        </h1>

        {!hasLessons ? (
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.2rem' }}>No lessons found.</p>
        ) : (
          <div
            style={{
              overflowX: 'auto',
              borderRadius: '16px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              background: '#fff',
              padding: '20px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '16px', overflow: 'hidden' }}>
              <thead style={{ background: '#e2e8f0' }}>
                <tr>
                  {['Title', 'Duration', 'Summary', 'Section', 'Video'].map(header => (
                    <th
                      key={header}
                      style={{
                        borderBottom: '2px solid #cbd5e1',
                        padding: '14px',
                        textAlign: 'left',
                        color: '#1e3a8a',
                        fontSize: '1rem',
                        fontWeight: 700,
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, idx) => (
                  <tr
                    key={lesson._id}
                    style={{
                      background: idx % 2 === 0 ? '#f9fafb' : '#fff',
                      transition: 'background 0.3s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseOut={e => (e.currentTarget.style.background = idx % 2 === 0 ? '#f9fafb' : '#fff')}
                  >
                    <td style={{ padding: '12px', color: '#334155' }}>{lesson.coursetitle}</td>
                    <td style={{ padding: '12px', color: '#334155' }}>{lesson.courseduration}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>{lesson.summary}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      {lesson.sectionview?.section || <span style={{ color: '#9ca3af' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <video
                        src={url + lesson.coursevideo}
                        controls
                        width="180"
                        style={{
                          borderRadius: '10px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          background: '#000',
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseLessons;
