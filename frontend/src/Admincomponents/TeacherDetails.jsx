import React from 'react'
import Navbar from './Navbar'

function TeacherDetails() {
  return (
    <>
<div class="main-wrapper">

    <Navbar/>
    <section class="page-title-section bg-img cover-background top-position1 left-overlay-dark" data-overlay-dark="9" data-background="img/bg/bg-04.jpg">
            <div class="container">
                <div class="row text-center">
                    <div class="col-md-12">
                        <h1>Instructors Details</h1>
                    </div>
                    <div class="col-md-12">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="#!">Instructors Details</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    <section>
        <div className='container'>
        <div class="row mb-1-9 mb-xl-2-9">
                    <div class="col-lg-5 mb-1-9 mb-md-2-5 mb-lg-0">
                        <div class="instructor-img-wrapper mb-50 md-mb-0">
                            <div class="mb-1-6 mb-xl-1-9">
                                <img class="border-radius-5" src="img/team/team-02.jpg" alt="..."/>
                            </div>
                            <div class="text-center">
                                <h3 class="font-weight-800 display-26 display-md-25 display-xl-24 text-primary">Balsam Samira</h3>
                                <p class="alt-font text-secondary font-weight-700 mb-2">Chief Instructor</p>
                                <ul class="personal-info">
                                    <li>
                                        <i class="ti-email"></i>
                                        <a href="mailto:info@yourwebsite.com" class="text-primary">info@yourwebsite.com</a>
                                    </li>
                                    <li>
                                        <i class="ti-mobile"></i>
                                        <a href="tel:+442056581823" class="text-primary">+44 205-658-1823</a>
                                    </li>
                                </ul>
                            </div>
                            <ul class="social-box">
                                <li><a href="#!"><i class="fab fa-facebook-f"></i></a></li>
                                <li><a href="#!"><i class="fab fa-twitter"></i></a></li>
                                <li><a href="#!"><i class="fab fa-instagram"></i></a></li>
                                <li><a href="#!"><i class="fab fa-youtube"></i></a></li>
                                <li><a href="#!"><i class="fab fa-linkedin-in"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-7">
                        <div class="ps-lg-1-9 ps-xl-6">
                            <div class="row mb-1-9 mb-xl-2-9">
                                <div class="col-lg-12">
                                    <h4 class="teacher-name">Eliena Rose</h4>
                                    <p class="lead text-secondary font-weight-700">A certified instructor From eLearn</p>
                                    <h4 class="text-dark">About Me:</h4>
                                    <p class="alt-font text-color font-weight-500">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat.</p>
                                    <p class="alt-font text-color mb-0 font-weight-500">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
                                    </p>
                                </div>
                            </div>
                            <div class="row mb-1-9 mb-xl-2-9">
                                <div class="col-lg-12">
                                    <ul class="course-info-list">
                                        <li>
                                            <h2 class="countup text-secondary font-weight-800 display-18">12</h2>
                                            <p class="alt-font font-weight-700 text-color display-30 mb-0">Courses</p>
                                        </li>
                                        <li>
                                            <h2 class="countup text-secondary font-weight-800 display-18">120</h2>
                                            <p class="alt-font font-weight-700 text-color display-30 mb-0">Students</p>
                                        </li>
                                        <li>
                                            <h2 class="countup text-secondary font-weight-800 display-18">4.5</h2>
                                            <p class="alt-font font-weight-700 text-color display-30 mb-0">Ratings</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-1-6 mb-md-0 mb-lg-1-9 mb-lg-0">
                                    <h4 class="text-dark">Education:</h4>
                                    <ul class="instructor-details-info">
                                        <li>
                                            <i class="ti-book"></i>
                                            <p class="mb-0 text-primary font-weight-800 display-29">Harvard University</p>
                                            <span class="text-color alt-font text-capitalize display-30">Bachelor in Mathematics</span>
                                        </li>
                                        <li>
                                            <i class="ti-book"></i>
                                            <p class="mb-0 text-primary font-weight-800 display-29">University of Toronto</p>
                                            <span class="text-color alt-font text-capitalize display-30">Bachelor in English</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h4 class="text-dark">Experience:</h4>
                                    <ul class="instructor-details-info">
                                        <li>
                                            <i class="ti-briefcase"></i>
                                            <p class="mb-0 text-primary font-weight-800 display-29">Harvard University</p>
                                            <span class="text-color alt-font text-capitalize display-31">2021 - 2022</span>
                                        </li>
                                        <li>
                                            <i class="ti-briefcase"></i>
                                            <p class="mb-0 text-primary font-weight-800 display-29">University of Toronto</p>
                                            <span class="text-color alt-font text-capitalize display-30">2022 - 2023</span>
                                        </li>
                                    </ul>
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

export default TeacherDetails
