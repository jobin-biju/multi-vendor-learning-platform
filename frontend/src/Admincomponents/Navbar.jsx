import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  const location = useLocation();
  const navigate = useNavigate();

  // Update auth state on route change
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('tourstorage'));
    setAuth(stored);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="header-style1 menu_area-light">
      <div className="navbar-default border-bottom border-color-light-white">
        <div className="top-search bg-primary">
          <div className="container">
            <form className="search-form" action="search.html" method="GET" acceptCharset="utf-8">
              <div className="input-group">
                <span className="input-group-addon cursor-pointer">
                  <button className="search-form_submit fas fa-search text-white" type="submit"></button>
                </span>
                <input type="text" className="search-form_input form-control" name="s" autoComplete="off" placeholder="Type & hit enter..." />
                <span className="input-group-addon close-search mt-1"><i className="fas fa-times"></i></span>
              </div>
            </form>
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-12">
              <div className="menu_area alt-font">
                <nav className="navbar navbar-expand-lg navbar-light p-0">
                  <div className="navbar-header navbar-header-custom">
                    <Link to="/" className="navbar-brand">
                      <img id="logo" src="img/logos/logo-inner.png" alt="logo" />
                    </Link>
                  </div>

                  <div className="navbar-toggler bg-primary"></div>

                  {/* Guest Navbar */}
                  {!auth && (
                    <>
                      <ul className="navbar-nav ms-auto" id="nav">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                      </ul>
                      <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
                        <ul>
                          <li className=""><a href="#"><i className=""></i></a></li>
                          <li className="d-none d-xl-inline-block">
                            <Link to="/options" className="butn md text-white">
                              <i className="fas fa-plus-circle icon-arrow before"></i>
                              <span className="label">SignUp</span>
                              <i className="fas fa-plus-circle icon-arrow after"></i>
                            </Link>
                          </li>&nbsp;&nbsp;
                          <li className="d-none d-xl-inline-block">
                            <Link to="/login" className="butn md text-white">
                              <i className="fas fa-plus-circle icon-arrow before"></i>
                              <span className="label">Login</span>
                              <i className="fas fa-plus-circle icon-arrow after"></i>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* User Navbar */}
                  {auth?.usertype === 1 && (
                    <>
                      <ul className="navbar-nav ms-auto" id="nav">
                        <li><Link to="/">Home</Link></li>
                        <li>
                          <Link to="#">Courses</Link>
                          <ul>
                            <li><Link to="/course">Course</Link></li>
                            <li><Link to="/viewcart">My Cart</Link></li>
                            <li><Link to="/mycourse">My Courses</Link></li>
                            <li><Link to="/mypayment">My Payments</Link></li>
                          </ul>
                        </li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/feedback">Feedback</Link></li>
                        <li><Link to="/chat">Chat</Link></li>
                        <li><Link to="/game">Apptitude</Link></li>
                      </ul>
                      <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
                        <ul>
                          {/* <li className="search"><a href="#"><i className="fas fa-search"></i></a></li> */}
                          <li className="d-none d-xl-inline-block">
                            <button onClick={handleLogout} className="butn md text-white" style={{ border: 'none', background: 'transparent' }}>
                              <i className="fas fa-plus-circle icon-arrow before"></i>
                              <span className="label">Logout</span>
                              <i className="fas fa-plus-circle icon-arrow after"></i>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Admin Navbar */}
                  {auth?.usertype === 0 && (
                    <ul className="navbar-nav ms-auto" id="nav">
                      <li><Link to="/admin">Admin</Link></li>
                    </ul>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
