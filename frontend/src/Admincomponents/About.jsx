import React from 'react'

function About() {
  return (
    <div className="main-wrapper">
      <section className="aboutus-style-01 position-relative">
            <div className="container pt-lg-4">
                <div className="row align-items-center mt-n1-9">
                    <div className="col-md-12 col-lg-6 mt-1-9 order-2 order-lg-1">
                        <div className="position-relative">
                            <div className="position-relative">
                                <div className="image-hover">
                                    <img src="img/content/about-03.jpg" alt="..." className="ps-sm-10 position-relative z-index-1"/>
                                </div>
                                <img src="img/content/about-02.jpg" alt="..." className="img-2 d-none d-xl-block"/>
                                <img src="img/bg/bg-07.png" className="bg-shape1 d-none d-sm-block" alt="..."/>
                            </div>
                            <div className="d-none d-sm-block">
                                <div className="about-text">
                                    <div className="about-counter">
                                        <span className="countup">9</span> +
                                    </div>
                                    <p>YEARS EXPERIENCE JUST ACHIVED</p>
                                </div>
                            </div>
                        </div>   
                    </div>
                    <div className="col-md-12 col-lg-6 mt-1-9 order-2 order-lg-1">
                        <div className="section-heading text-start mb-2">
                            <span className="sub-title">welcome!</span>
                        </div>
                        <h2 className="font-weight-800 h1 mb-1-9 text-primary">Learn whenever, anyplace, at your own speed.</h2>
                        <p className="about-border lead fst-italic mb-1-9">A spot to furnish understudies with sufficient information and abilities in an unpredictable world.</p>
                        <blockquote>
                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
                        </blockquote>
                        <div className="dotted-seprator pt-1-9 mt-1-9"></div>
                        <div className="row">
                            <div className="col-sm-6 col-12 mb-3 mb-sm-0">
                                <div className="media">
                                    <i className="ti-mobile display-15 text-secondary"></i>
                                    <div className="media-body align-self-center ms-3">
                                        <h4 className="mb-1 h5">Phone Number</h4>
                                        <p className="mb-0">(123)-456-789</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-12">
                                <div className="media">
                                    <i className="ti-email display-15 text-secondary"></i>
                                    <div className="media-body align-self-center ms-3">
                                        <h4 className="mb-1 h5">Email Address</h4>
                                        <p className="mb-0">Info@mail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shape18">
                    <img src="img/bg/bg-01.jpg" alt="..."/>
                </div>
                <div className="shape20">
                    <img src="img/bg/bg-02.jpg" alt="..."/>
                </div>
            </div>
        </section>
    </div>
  )
}

export default About
