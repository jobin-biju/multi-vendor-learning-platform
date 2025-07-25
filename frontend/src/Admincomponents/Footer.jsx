import React from 'react'

function Footer() {
  return (
    <div>
      <footer class="bg-dark">
            <div class="container">
                <div class="row">
                    <div class="col-md-6 col-lg-3 mb-2-5 mb-lg-0">
                        <a href="index.html" class="footer-logo">
                            <img src="img/logos/footer-light-logo.png" class="mb-4" alt="Footer Logo"/>
                        </a>
                        <p class="mb-1-6 text-white">
                            It's an ideal opportunity to begin investing your energy such that illuminates you.
                        </p>
                        <form class="quform newsletter" action="quform/newsletter-two.php" method="post" enctype="multipart/form-data" onclick="">

                            <div class="quform-elements">

                                <div class="row">

                                    {/* <!-- Begin Text input element --> */}
                                    <div class="col-md-12">
                                        <div class="quform-element mb-0">
                                            <div class="quform-input">
                                                <input class="form-control" id="email_address" type="text" name="email_address" placeholder="Subscribe with us"/>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Text input element --> */}

                                    {/* <!-- Begin Submit button --> */}
                                    <div class="col-md-12">
                                        <div class="quform-submit-inner">
                                            <button class="btn btn-white text-primary m-0 px-2" type="submit"><i class="fas fa-paper-plane"></i></button>
                                        </div>
                                        <div class="quform-loading-wrap text-start"><span class="quform-loading"></span></div>
                                    </div>
                                    {/* <!-- End Submit button --> */}

                                </div>

                            </div>

                        </form>
                    </div>
                    <div class="col-md-6 col-lg-2 mb-2-5 mb-lg-0">
                        <div class="ps-md-1-6 ps-lg-1-9">
                            <h3 class="text-primary h5 mb-2-2">About</h3>
                            <ul class="footer-list">
                                <li><a href="/">About Us</a></li>
                                <li><a href="/">Courses</a></li>
                                <li><a href="/">Instructor</a></li>
                                <li><a href="/">Event</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-3 mb-2-5 mb-md-0">
                        <div class="ps-lg-1-9 ps-xl-2-5">
                            <h3 class="text-primary h5 mb-2-2">Link</h3>
                            <ul class="footer-list">
                                <li><a href="/">News &amp; Blogs</a></li>
                                <li><a href="/">Portfolio</a></li>
                                <li><a href="/">FAQ's</a></li>
                                <li><a href="/">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <div class="ps-md-1-9">
                            <h3 class="text-primary h5 mb-2-2">Popular Courses</h3>
                            <div class="media footer-border">
                                <img class="pe-3 border-radius-5" src="img/content/footer-insta-01.jpg" alt="..."/>
                                <div class="media-body align-self-center">
                                    <h4 class="h6 mb-2"><a href="/" class="text-white text-primary-hover">Plan of learning experiences.</a></h4>
                                    <span class="text-white small">July. 30, 2025</span>
                                </div>
                            </div>
                            <div class="media">
                                <img class="pe-3 border-radius-5" src="img/content/footer-insta-02.jpg" alt="..."/>
                                <div class="media-body align-self-center">
                                    <h4 class="h6 mb-2"><a href="/" class="text-white text-primary-hover">A supportive learning community</a></h4>
                                    <span class="text-white small">Mar. 28, 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-bar text-center">
                    <p class="mb-0 text-white font-weight-500">&copy; <span class="current-year"></span> eLearn Powered by <a href="#!" class="text-secondary">Chitrakoot Web</a></p>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer
