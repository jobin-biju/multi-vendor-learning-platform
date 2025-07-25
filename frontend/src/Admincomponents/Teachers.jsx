import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function Teachers() {
return (
<>
            <div className="main-wrapper">
            <Navbar/>
            <section 
                className="page-title-section bg-img cover-background top-position1 left-overlay-dark"  data-overlay-dark="9"  style={{ backgroundImage: "url('img/banner/slide2.jpg')" }}>
                    <div className="container">
                            <div className="row text-center">
                                    <div className="col-md-12">
                                            <h1>Instructors</h1>
                                    </div>
                                    <div className="col-md-12">
                                            <ul>
                                                    <li><a href="index.html">Home</a></li>
                                                    <li><a href="#!">Instructors</a></li>
                                            </ul>
                                    </div>
                            </div>
                    </div>
            </section>
            <section>
            <div class="container">
                <div class="section-heading">
                    <span class="sub-title">Instructors</span>
                    <h2 class="h1 mb-0">Experience Instructors</h2>
                </div>
                <div class="row">
                <div className="col-lg-4 col-md-6 mb-1-6 mb-md-1-9">
    <div className="team-style1 text-center">
        <img src="img/team/team-01.jpg" className="border-radius-5" alt="..." />
        <div className="team-info">
            <h3 className="text-primary mb-1 h4">Murilo Souza</h3>
            <span className="font-weight-600 text-secondary">Web Designer</span>
        </div>
        <div className="team-overlay">
            <div className="d-table h-100 w-100">
                <div className="d-table-cell align-middle">
                    <h3>
                        <Link to="/teachdetails" className="text-white">
                            About Murilo Souza
                        </Link>
                    </h3>
                    <p className="text-white mb-0">
                        I preserve each companion certification and I'm an authorized AWS solutions architect professional.
                    </p>
                    <ul className="social-icon-style1">
                        <li><a href="#!"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="#!"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="#!"><i className="fab fa-youtube"></i></a></li>
                        <li><a href="#!"><i className="fab fa-linkedin-in"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>

                    <div class="col-lg-4 col-md-6 mb-1-6 mb-md-1-9">
                        <div class="team-style1 text-center">
                            <img src="img/team/team-02.jpg" class="border-radius-5" alt="..."/>
                            <div class="team-info">
                                <h3 class="text-primary mb-1 h4">Balsam Samira</h3>
                                <span class="font-weight-600 text-secondary">Photographer</span>
                            </div>
                            <div class="team-overlay">
                                <div class="d-table h-100 w-100">
                                    <div class="d-table-cell align-middle">
                                        <h3><a href="/" class="text-white">About Balsam Samira</a></h3>
                                        <p class="text-white mb-0">I preserve each companion certification and I'm an authorized AWS solutions architect professional.</p>
                                        <ul class="social-icon-style1">
                                            <li><a href="#!"><i class="fab fa-facebook-f"></i></a></li>
                                            <li><a href="#!"><i class="fab fa-twitter"></i></a></li>
                                            <li><a href="#!"><i class="fab fa-youtube"></i></a></li>
                                            <li><a href="#!"><i class="fab fa-linkedin-in"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-1-6 mb-md-1-9">
                        <div class="team-style1 text-center">
                            <img src="img/team/team-03.jpg" class="border-radius-5" alt="..."/>
                            <div class="team-info">
                                <h3 class="text-primary mb-1 h4">Rodrigo Ribeiro</h3>
                                <span class="font-weight-600 text-secondary">Psychologist</span>
                            </div>
                            <div class="team-overlay">
                                <div class="d-table h-100 w-100">
                                    <div class="d-table-cell align-middle">
                                        <h3><a href="/" class="text-white">About Rodrigo Ribeiro</a></h3>
                                        <p class="text-white mb-0">I preserve each companion certification and I'm an authorized AWS solutions architect professional.</p>
                                        <ul class="social-icon-style1">
                                            <li><a href="#!"><i class="fab fa-facebook-f"></i></a></li>
                                            <li><a href="#!"><i class="fab fa-twitter"></i></a></li>
                                            <li><a href="#!"><i class="fab fa-youtube"></i></a></li>
                                            <li><a href="#!"><i class="fab fa-linkedin-in"></i></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
            </div>

</>  
)
}

export default Teachers
