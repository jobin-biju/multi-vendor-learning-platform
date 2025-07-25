import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Courselist from './Courselist'
import { useEffect } from 'react';

function Course() {
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
  return (
    <div>
        <div className="main-wrapper">
        <Navbar/>
        <section  className="page-title-section bg-img cover-background top-position1 left-overlay-dark"  data-overlay-dark="9" style={{ backgroundImage: "url('img/bg/bg-04.jpg')" }} >
            <div className="container">
                <div className="row text-center">
                    <div className="col-md-12">
                        <h1>Courses Grid</h1>
                    </div>
                    <div className="col-md-12">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="#!">Courses Grid</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <Courselist/>
        </div>
    </div>
  )
}


export default Course
