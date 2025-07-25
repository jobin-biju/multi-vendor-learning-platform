import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingCart, CreditCard, Tag, Package, ArrowLeft, Star, Clock, Users, Shield, CheckCircle } from 'lucide-react';

function MyCart() {
  const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    window.history.back();
  };
  const [cartitems, setCartItems] = useState([]);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    let cart = { userid: auth.vendorid };

    fetch("http://localhost:4000/multivendor/viewcart", {
      method: "POST",
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(cart)
    })
      .then((res) => res.json())
      .then((result) => {
        setCartItems(result);
        setLoading(false);
      });
  }, [auth.vendorid]);

  const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    // Check if Tailwind is already loaded
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    // Optional: Remove script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }

  const removeFromCart = async (id) => {
    await fetch(`http://localhost:4000/multivendor/removecart/${id}`, {
      method: "DELETE"
    });
    setCartItems(cartitems.filter(item => item._id !== id));
  };

  const totalCourses = cartitems.length;
  const originalTotal = cartitems.reduce((total, item) => {
    return total + (item.courseid?.price || 0);
  }, 0);
  const totalAmount = cartitems.reduce((total, item) => {
    const price = item.courseid?.discountprice || item.courseid?.price || 0;
    return total + price;
  }, 0);
  const totalSavings = originalTotal - totalAmount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              // onClick={() => window.history.back()}
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Courses
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-600">{totalCourses} {totalCourses === 1 ? 'course' : 'courses'} in cart</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartitems.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Discover our courses and start learning today</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartitems.map((item) => {
                  const course = item.courseid;
                  if (!course) return null;

                  const discountPercentage = course.discountprice && course.price > course.discountprice 
                    ? Math.round(((course.price - course.discountprice) / course.price) * 100)
                    : 0;

                  return (
                    <div key={item._id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden group">
                      <div className="flex flex-col sm:flex-row">
                        {/* Course Image */}
                        <div className="relative sm:w-64 h-48 sm:h-40 overflow-hidden bg-gray-100">
                          <img
                            src={`http://localhost:4000/${course.thumbnail}`}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {discountPercentage > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                              {discountPercentage}% OFF
                            </div>
                          )}
                        </div>

                        {/* Course Details */}
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                              {course.title}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ml-4 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.shortdescription}</p>

                          {/* Course Stats */}
                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                            {course.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{course.rating}</span>
                              </div>
                            )}
                            {course.students && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{course.students?.toLocaleString()} students</span>
                              </div>
                            )}
                            {course.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{course.duration}</span>
                              </div>
                            )}
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {discountPercentage > 0 ? (
                                <>
                                  <span className="text-2xl font-bold text-gray-900">₹{course.discountprice?.toLocaleString()}</span>
                                  <span className="text-lg text-gray-400 line-through">₹{course.price?.toLocaleString()}</span>
                                </>
                              ) : (
                                <span className="text-2xl font-bold text-gray-900">₹{course.price?.toLocaleString()}</span>
                              )}
                            </div>

                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm underline transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartitems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="text-gray-900">₹{originalTotal.toLocaleString()}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Discounts:</span>
                      <span className="text-green-600 font-medium">-₹{totalSavings.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    {totalSavings > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-1">You save ₹{totalSavings.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 mb-4">
                  Proceed to Checkout
                </button>

                {/* Guarantee */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">30-Day Money-Back Guarantee</span>
                  </div>
                  <p className="text-sm text-green-600">Full refund if you're not satisfied</p>
                </div>

                {/* Benefits */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">What you get:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Lifetime access to all courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Mobile and desktop access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>24/7 student support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyCart;