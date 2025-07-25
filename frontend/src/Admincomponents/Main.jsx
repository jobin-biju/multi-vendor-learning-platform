import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import Information from './Information'
import About from './About'
import Category from './Category'
import Instructor from './Instructor'
import Testimonial from './Testimonial'
import Footer from './Footer'
import Chatbot from './Chatbot'
import Elearn from './Elearn'

function Main() {
useEffect(() => {
  if (sessionStorage.getItem("reload") === "true") {
    sessionStorage.removeItem("reload");
    
    // Show loading overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: white; z-index: 9999; display: flex;
      align-items: center; justify-content: center;
    `;
    overlay.innerHTML = '<div>Loading...</div>';
    document.body.appendChild(overlay);
    
    // Immediate reload
    window.location.replace(window.location.href);
  }
}, []);
useEffect(() => {
  const style = document.createElement('style');
  style.innerHTML = `body.reloading * { display: none !important; }`;
  document.head.appendChild(style);
}, []);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const intervalRef = useRef(null);
    const carouselRef = useRef(null);

    const slides = [
        {
            id: 1,
            background: "img/banner/slide1.jpg",
            subtitle: "Enjoy smooth learning",
            title: "Best Education Site Ever!",
            description: "Transform your learning experience with our comprehensive online education platform."
        },
        {
            id: 2,
            background: "img/banner/slide2.jpg",
            subtitle: "Enjoy smooth learning",
            title: "Learn From Best Online Training",
            description: "Get access to world-class instructors and cutting-edge learning materials."
        },
        {
            id: 3,
            background: "img/banner/slide3.jpg",
            subtitle: "Enjoy smooth learning",
            title: "More than 50+ Online Courses",
            description: "Choose from a wide variety of courses designed to boost your career."
        }
    ];

    // Auto-play functionality
    useEffect(() => {
        if (isAutoPlaying && !isTransitioning) {
            intervalRef.current = setInterval(() => {
                nextSlide();
            }, 5000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isAutoPlaying, isTransitioning, currentSlide]);

    // Navigation functions
    const goToSlide = (index) => {
        if (isTransitioning || index === currentSlide) return;
        
        setIsTransitioning(true);
        setCurrentSlide(index);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1000);
    };

    const nextSlide = () => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        setCurrentSlide(prev => (prev + 1) % slides.length);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1000);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1000);
    };

    // Touch handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        }
        if (isRightSwipe) {
            prevSlide();
        }
        
        setTouchStart(0);
        setTouchEnd(0);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                prevSlide();
            } else if (event.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
        <div className="main-wrapper">
            
            <Navbar/>
            <section className="top-position1 p-0">
                <div className="container-fluid px-0">
                    <div 
                        ref={carouselRef}
                        className="modern-carousel position-relative overflow-hidden"
                        style={{ height: '100vh', minHeight: '600px' }}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Slides */}
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className="carousel-slide position-absolute w-100 h-100"
                                style={{
                                    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${slide.background}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    top: 0,
                                    left: 0,
                                    opacity: currentSlide === index ? 1 : 0,
                                    visibility: currentSlide === index ? 'visible' : 'hidden',
                                    transition: 'opacity 1s ease-in-out, visibility 1s ease-in-out',
                                    zIndex: currentSlide === index ? 2 : 1
                                }}
                            >
                                <div className="container h-100">
                                    <div className="row h-100 align-items-center">
                                        <div className="col-lg-8 col-xl-7">
                                            <div 
                                                className="slide-content text-white"
                                                style={{
                                                    transform: currentSlide === index ? 'translateY(0)' : 'translateY(50px)',
                                                    opacity: currentSlide === index ? 1 : 0,
                                                    transition: 'all 1.2s ease-out',
                                                    transitionDelay: currentSlide === index ? '0.3s' : '0s'
                                                }}
                                            >
                                                <span 
                                                    className="subtitle d-block mb-3"
                                                    style={{
                                                        fontSize: '1.2rem',
                                                        color: '#ff6b35',
                                                        fontWeight: '500',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '2px',
                                                        transform: currentSlide === index ? 'translateX(0)' : 'translateX(-30px)',
                                                        opacity: currentSlide === index ? 1 : 0,
                                                        transition: 'all 0.8s ease-out',
                                                        transitionDelay: currentSlide === index ? '0.5s' : '0s'
                                                    }}
                                                >
                                                    {slide.subtitle}
                                                </span>
                                                
                                                <h1 
                                                    className="main-title mb-4"
                                                    style={{
                                                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                                        fontWeight: '800',
                                                        lineHeight: '1.2',
                                                        marginBottom: '2rem',
                                                        transform: currentSlide === index ? 'translateX(0)' : 'translateX(-50px)',
                                                        opacity: currentSlide === index ? 1 : 0,
                                                        transition: 'all 1s ease-out',
                                                        transitionDelay: currentSlide === index ? '0.7s' : '0s'
                                                    }}
                                                >
                                                    {slide.title}
                                                </h1>
                                                
                                                <p 
                                                    className="slide-description mb-4"
                                                    style={{
                                                        fontSize: '1.1rem',
                                                        lineHeight: '1.6',
                                                        maxWidth: '500px',
                                                        color: 'rgba(255,255,255,0.9)',
                                                        transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)',
                                                        opacity: currentSlide === index ? 1 : 0,
                                                        transition: 'all 0.8s ease-out',
                                                        transitionDelay: currentSlide === index ? '0.9s' : '0s'
                                                    }}
                                                >
                                                    {slide.description}
                                                </p>
                                                
                                                <div 
                                                    className="slide-buttons"
                                                    style={{
                                                        transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
                                                        opacity: currentSlide === index ? 1 : 0,
                                                        transition: 'all 0.6s ease-out',
                                                        transitionDelay: currentSlide === index ? '1.1s' : '0s'
                                                    }}
                                                >
                                                    <button 
                                                        className="btn btn-primary me-3"
                                                        style={{
                                                            background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                                                            border: 'none',
                                                            padding: '12px 30px',
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            borderRadius: '50px',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.transform = 'translateY(-2px)';
                                                            e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
                                                        }}
                                                    >
                                                        Get Started
                                                    </button>
                                                    
                                                    <button 
                                                        className="btn btn-outline-light"
                                                        style={{
                                                            padding: '12px 30px',
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            borderRadius: '50px',
                                                            borderWidth: '2px',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.background = 'white';
                                                            e.target.style.color = '#333';
                                                            e.target.style.transform = 'translateY(-2px)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.background = 'transparent';
                                                            e.target.style.color = 'white';
                                                            e.target.style.transform = 'translateY(0)';
                                                        }}
                                                    >
                                                        Learn More
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Navigation Arrows */}
                        <button
                            className="carousel-arrow prev-arrow position-absolute"
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            style={{
                                left: '30px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                opacity: isTransitioning ? 0.5 : 0.8
                            }}
                            onMouseOver={(e) => !isTransitioning && (e.target.style.background = 'rgba(255, 255, 255, 0.2)', e.target.style.opacity = '1', e.target.style.transform = 'translateY(-50%) scale(1.1)')}
                            onMouseOut={(e) => !isTransitioning && (e.target.style.background = 'rgba(255, 255, 255, 0.1)', e.target.style.opacity = '0.8', e.target.style.transform = 'translateY(-50%) scale(1)')}
                        >
                            &#8249;
                        </button>

                        <button
                            className="carousel-arrow next-arrow position-absolute"
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            style={{
                                right: '30px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '2px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',
                                color: 'white',
                                fontSize: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                opacity: isTransitioning ? 0.5 : 0.8
                            }}
                            onMouseOver={(e) => !isTransitioning && (e.target.style.background = 'rgba(255, 255, 255, 0.2)', e.target.style.opacity = '1', e.target.style.transform = 'translateY(-50%) scale(1.1)')}
                            onMouseOut={(e) => !isTransitioning && (e.target.style.background = 'rgba(255, 255, 255, 0.1)', e.target.style.opacity = '0.8', e.target.style.transform = 'translateY(-50%) scale(1)')}
                        >
                            &#8250;
                        </button>

                        {/* Dots Indicator */}
                        <div 
                            className="carousel-indicators position-absolute d-flex justify-content-center align-items-center"
                            style={{
                                bottom: '40px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10,
                                gap: '15px'
                            }}
                        >
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className="indicator-dot"
                                    onClick={() => goToSlide(index)}
                                    disabled={isTransitioning}
                                    style={{
                                        width: currentSlide === index ? '40px' : '15px',
                                        height: '6px',
                                        borderRadius: '3px',
                                        border: 'none',
                                        background: currentSlide === index 
                                            ? 'linear-gradient(45deg, #ff6b35, #f7931e)' 
                                            : 'rgba(255, 255, 255, 0.5)',
                                        cursor: 'pointer',
                                        transition: 'all 0.4s ease',
                                        opacity: isTransitioning ? 0.5 : 1,
                                        boxShadow: currentSlide === index ? '0 2px 10px rgba(255, 107, 53, 0.5)' : 'none'
                                    }}
                                    onMouseOver={(e) => {
                                        if (currentSlide !== index && !isTransitioning) {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                                            e.target.style.width = '25px';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (currentSlide !== index && !isTransitioning) {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                                            e.target.style.width = '15px';
                                        }
                                    }}
                                ></button>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div 
                            className="carousel-progress position-absolute"
                            style={{
                                bottom: '0',
                                left: '0',
                                width: '100%',
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                zIndex: 10
                            }}
                        >
                            <div 
                                className="progress-fill"
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                                    width: `${((currentSlide + 1) / slides.length) * 100}%`,
                                    transition: 'width 0.3s ease'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="triangle-shape top-15 right-10 z-index-9 d-none d-md-block"></div>
                <div className="square-shape top-25 left-5 z-index-9 d-none d-xl-block"></div>
                <div className="shape-five z-index-9 right-10 bottom-15"></div>
            </section>
            <br /><br />
            <Information/>
            <About/>
            <Category/>
            <Instructor/>
            <Testimonial/>
            <Chatbot/>
            <Elearn/>
            <Footer/>
        </div>
        </>
    )
}

export default Main