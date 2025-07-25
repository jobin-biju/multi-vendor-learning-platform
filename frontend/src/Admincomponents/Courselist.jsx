import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import url from '../Vendor/ImageUrl';
import { Star, Clock, User, BookOpen, Award, ChevronRight } from 'lucide-react';

function Courselist() {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Clean Professional Styles with Teal Theme
  const styles = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#f8fffe',
      paddingTop: '40px',
      paddingBottom: '60px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      position: 'relative'
    },
    headerSection: {
      textAlign: 'center',
      marginBottom: '48px',
      paddingBottom: '32px',
      borderBottom: '1px solid #e0f2f1'
    },
    mainTitle: {
      fontSize: '2.75rem',
      fontWeight: '700',
      color: '#0d4f4c',
      marginBottom: '16px',
      letterSpacing: '-0.025em',
      lineHeight: '1.1'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#4a7c7a',
      fontWeight: '400',
      maxWidth: '600px',
      margin: '0 auto 32px',
      lineHeight: '1.6'
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '48px',
      flexWrap: 'wrap'
    },
    statItem: {
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#4db6ac',
      display: 'block',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#4a7c7a',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '28px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(77, 182, 172, 0.08), 0 1px 4px rgba(77, 182, 172, 0.04)',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(77, 182, 172, 0.1)',
      position: 'relative'
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 32px rgba(77, 182, 172, 0.15), 0 2px 8px rgba(77, 182, 172, 0.08)',
      borderColor: 'rgba(77, 182, 172, 0.2)'
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      height: '200px',
      backgroundColor: '#f0fdfc'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    },
    imageHover: {
      transform: 'scale(1.05)'
    },
    categoryBadge: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      backgroundColor: '#4db6ac',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      boxShadow: '0 2px 8px rgba(77, 182, 172, 0.3)'
    },
    difficultyBadge: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: '#0d4f4c',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '0.75rem',
      fontWeight: '600',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(77, 182, 172, 0.2)'
    },
    cardContent: {
      padding: '28px 24px',
      position: 'relative'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      marginBottom: '12px',
      color: '#0d4f4c',
      cursor: 'pointer',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.4',
      transition: 'color 0.3s ease'
    },
    titleHover: {
      color: '#4db6ac'
    },
    instructorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '10px 16px',
      backgroundColor: '#f0fdfc',
      borderRadius: '10px',
      border: '1px solid rgba(77, 182, 172, 0.1)'
    },
    instructorIcon: {
      color: '#4db6ac',
      marginRight: '8px'
    },
    instructorText: {
      color: '#0d4f4c',
      fontSize: '0.9375rem',
      fontWeight: '500'
    },
    description: {
      color: '#4a7c7a',
      fontSize: '0.9375rem',
      marginBottom: '24px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: '1.5'
    },
    metadataContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '20px',
      borderTop: '1px solid #e0f2f1',
      flexWrap: 'wrap',
      gap: '12px'
    },
    metadataLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff8e1',
      padding: '6px 12px',
      borderRadius: '16px',
      border: '1px solid #ffecb3'
    },
    starIcon: {
      color: '#ff9800'
    },
    ratingText: {
      marginLeft: '6px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#e65100'
    },
    durationContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#e0f7fa',
      padding: '6px 12px',
      borderRadius: '16px',
      border: '1px solid #b2ebf2'
    },
    clockIcon: {
      color: '#00838f'
    },
    durationText: {
      marginLeft: '6px',
      fontSize: '0.875rem',
      color: '#006064',
      fontWeight: '500'
    },
    viewButton: {
      fontSize: '0.9375rem',
      fontWeight: '600',
      backgroundColor: '#4db6ac',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      textTransform: 'none',
      letterSpacing: '0.25px'
    },
    viewButtonHover: {
      backgroundColor: '#26a69a',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(77, 182, 172, 0.3)'
    },
    emptyContainer: {
      textAlign: 'center',
      padding: '80px 32px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(77, 182, 172, 0.08)',
      border: '1px solid rgba(77, 182, 172, 0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    },
    emptyIcon: {
      fontSize: '4rem',
      marginBottom: '24px',
      color: '#4db6ac'
    },
    emptyText: {
      fontSize: '1.375rem',
      color: '#0d4f4c',
      fontWeight: '600',
      marginBottom: '8px'
    },
    emptySubtext: {
      fontSize: '1rem',
      color: '#4a7c7a'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fffe'
    },
    spinner: {
      width: '64px',
      height: '64px',
      border: '3px solid rgba(77, 182, 172, 0.2)',
      borderRadius: '50%',
      borderTop: '3px solid #4db6ac',
      animation: 'spin 1s linear infinite',
      marginBottom: '24px'
    },
    loadingText: {
      color: '#0d4f4c',
      fontSize: '1.125rem',
      fontWeight: '500'
    },
    // Clean responsive breakpoints
    '@media (max-width: 768px)': {
      mainTitle: {
        fontSize: '2.25rem'
      },
      gridContainer: {
        gridTemplateColumns: '1fr',
        gap: '20px'
      },
      statsContainer: {
        gap: '32px'
      },
      cardContent: {
        padding: '24px 20px'
      },
      container: {
        padding: '0 16px'
      }
    }
  };

  // Clean keyframes
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = keyframes;
    document.head.appendChild(styleElement);

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/multivendor/courseview')
      .then((res) => res.json())
      .then((result) => {
        setCourse(result || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = (item) => {
    navigate('/course-detail', { state: item });
  };

  // Clean hover states
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTitle, setHoveredTitle] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading courses...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.headerSection}>
          <h1 style={styles.mainTitle}>Professional Course Catalog</h1>
          <p style={styles.subtitle}>
            Enhance your skills with our comprehensive collection of industry-leading courses designed by experts for professionals.
          </p>
          
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{course.length}</span>
              <span style={styles.statLabel}>Available Courses</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>15K+</span>
              <span style={styles.statLabel}>Active Students</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>4.8</span>
              <span style={styles.statLabel}>Average Rating</span>
            </div>
          </div>
        </div>
        
        {course.length === 0 ? (
          <div style={styles.emptyContainer}>
            <BookOpen size={64} style={styles.emptyIcon} />
            <p style={styles.emptyText}>No courses available</p>
            <p style={styles.emptySubtext}>New courses will be added soon. Stay tuned!</p>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            {course.map((item) => (
              <div 
                key={item._id} 
                style={{
                  ...styles.card,
                  ...(hoveredCard === item._id ? styles.cardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(item._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={url + item.thumbnail}
                    alt={item.title}
                    style={{
                      ...styles.image,
                      ...(hoveredImage === item._id ? styles.imageHover : {})
                    }}
                    onClick={() => handleClick(item)}
                    onMouseEnter={() => setHoveredImage(item._id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  />
                  <div style={styles.categoryBadge}>
                    {item.category || 'Course'}
                  </div>
                  <div style={styles.difficultyBadge}>
                    {item.difficulty || 'Intermediate'}
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <h3 
                    onClick={() => handleClick(item)} 
                    style={{
                      ...styles.title,
                      ...(hoveredTitle === item._id ? styles.titleHover : {})
                    }}
                    onMouseEnter={() => setHoveredTitle(item._id)}
                    onMouseLeave={() => setHoveredTitle(null)}
                  >
                    {item.title}
                  </h3>
                  
                  <div style={styles.instructorContainer}>
                    <User size={16} style={styles.instructorIcon} />
                    <p style={styles.instructorText}>
                      {item.instructorid?.name || 'Professional Instructor'}
                    </p>
                  </div>
                  
                  <p style={styles.description}>
                    {item.shortdescription || 'A comprehensive course designed to enhance your professional skills and advance your career prospects.'}
                  </p>
                  
                  <div style={styles.metadataContainer}>
                    <div style={styles.metadataLeft}>
                      <div style={styles.ratingContainer}>
                        <Star size={14} style={styles.starIcon} />
                        <span style={styles.ratingText}>
                          {item.rating || '4.8'}
                        </span>
                      </div>
                      
                      <div style={styles.durationContainer}>
                        <Clock size={14} style={styles.clockIcon} />
                        <span style={styles.durationText}>
                          {item.duration || '6h 30m'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleClick(item)}
                      style={{
                        ...styles.viewButton,
                        ...(hoveredButton === item._id ? styles.viewButtonHover : {})
                      }}
                      onMouseEnter={() => setHoveredButton(item._id)}
                      onMouseLeave={() => setHoveredButton(null)}
                    >
                      View Course
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courselist;