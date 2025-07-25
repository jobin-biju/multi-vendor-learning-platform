import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function Contact() {
  return (
<>
<div class="main-wrapper">
    <Navbar/>
    <section class="page-title-section bg-img cover-background top-position1 left-overlay-dark" data-overlay-dark="9" data-background="img/bg/bg-04.jpg">
            <div class="container">
                <div class="row text-center">
                    <div class="col-md-12">
                        <h1>Contact</h1>
                    </div>
                    <div class="col-md-12">
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="#!">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        <section class="contact-form pb-0">
            <div class="container mb-2-9 mb-md-6 mb-lg-7">
                <div class="section-heading">
                    <span class="sub-title">OUR CONTACTS</span>
                    <h2 class="mb-9 display-16 display-sm-14 display-lg-10 font-weight-800">We`re here to Help You</h2>
                    <div class="heading-seperator"><span></span></div>
                </div>
                <div class="row mt-n2-9 mb-md-6 mb-lg-7">
                    <div class="col-lg-4 mt-2-9">
                        <div class="contact-wrapper bg-light rounded position-relative h-100 px-4">
                            <div class="mb-4">
                                <i class="contact-icon ti-email"></i>
                            </div>
                            <div>
                                <h4>Email Here</h4>
                                <ul class="list-unstyled p-0 m-0">
                                    <li><a href="#!">example@cloud.com</a></li>
                                    <li><a href="#!">info@domain.com</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mt-2-9">
                        <div class="contact-wrapper bg-light rounded position-relative h-100 px-4">
                            <div class="mb-4">
                                <i class="contact-icon ti-map-alt"></i>
                            </div>
                            <div>
                                <h4>Location Here</h4>
                                <ul class="list-unstyled p-0 m-0">
                                    <li>New York —<br/> 18 N 3rd E Street Downey, Lechase Park, United States.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 mt-2-9">
                        <div class="contact-wrapper bg-light rounded position-relative h-100 px-4">
                            <div class="mb-4">
                                <i class="contact-icon ti-mobile"></i>
                            </div>
                            <div>
                                <h4>Call Here</h4>
                                <ul class="list-unstyled p-0 m-0">
                                    <li><a href="#!">+44 205-658-1823</a></li>
                                    <li><a href="#!">(+44) 123 456 789</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="bg-very-light-gray py-md-8 pb-lg-0">
            <div class="container">
                <div class="row align-items-end">
                    <div class="col-lg-6 d-none d-lg-block">
                        <img src="img/content/contact-img-01.jpg" alt="..."/>
                    </div>
                    <div class="col-lg-6">
                        <div class="faq-form">
                            <h2 class="mb-4 text-primary">Get In Touch</h2>
                            <form class="contact quform" action="quform/contact.php" method="post" enctype="multipart/form-data" onclick="">
                                <div class="quform-elements">
                                    <div class="row">

                                        {/* <!-- Begin Text input element --> */}
                                        <div class="col-md-6">
                                            <div class="quform-element form-group">
                                                <label for="name">Your Name <span class="quform-required">*</span></label>
                                                <div class="quform-input">
                                                    <input class="form-control" id="name" type="text" name="name" placeholder="Your name here" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Text input element --> */}

                                        {/* <!-- Begin Text input element --> */}
                                        <div class="col-md-6">
                                            <div class="quform-element form-group">
                                                <label for="email">Your Email <span class="quform-required">*</span></label>
                                                <div class="quform-input">
                                                    <input class="form-control" id="email" type="text" name="email" placeholder="Your email here" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Text input element --> */}

                                        {/* <!-- Begin Text input element --> */}
                                        <div class="col-md-6">
                                            <div class="quform-element form-group">
                                                <label for="subject">Your Subject <span class="quform-required">*</span></label>
                                                <div class="quform-input">
                                                    <input class="form-control" id="subject" type="text" name="subject" placeholder="Your subject here" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Text input element --> */}

                                        {/* <!-- Begin Text input element --> */}
                                        <div class="col-md-6">
                                            <div class="quform-element form-group">
                                                <label for="phone">Contact Number</label>
                                                <div class="quform-input">
                                                    <input class="form-control" id="phone" type="text" name="phone" placeholder="Your phone here" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Text input element --> */}

                                        {/* <!-- Begin Textarea element --> */}
                                        <div class="col-md-12">
                                            <div class="quform-element form-group">
                                                <label for="message">Message <span class="quform-required">*</span></label>
                                                <div class="quform-input">
                                                    <textarea class="form-control" id="message" name="message" rows="3" placeholder="Tell us a few words"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Textarea element --> */}

                                        {/* <!-- Begin Captcha element --> */}
                                        <div class="col-md-12">
                                            <div class="quform-element">
                                                <div class="form-group">
                                                    <div class="quform-input">
                                                        <input class="form-control" id="type_the_word" type="text" name="type_the_word" placeholder="Type the below word" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <div class="quform-captcha">
                                                        <div class="quform-captcha-inner">
                                                            <img src="quform/images/captcha/courier-new-light.png" alt="..."/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Captcha element --> */}

                                        {/* <!-- Begin Submit button --> */}
                                        <div class="col-md-12">
                                            <div class="quform-submit-inner">
                                                <button class="butn secondary" type="submit"><i class="far fa-paper-plane icon-arrow before"></i><span class="label">Send Message</span><i class="far fa-paper-plane icon-arrow after"></i></button>
                                            </div>
                                            <div class="quform-loading-wrap text-start"><span class="quform-loading"></span></div>
                                        </div>
                                        {/* <!-- End Submit button --> */}

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="p-0">
            <iframe width="100%" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=Logiprompt%20Pro%20Academy,%20Kazhakkoottam,%20Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
        </section>
        <Footer/>  
</div>
</>
  )
}

export default Contact
