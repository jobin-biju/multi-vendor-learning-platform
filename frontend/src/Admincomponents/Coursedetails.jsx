import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Play, CheckCircle, Star, Clock, Users, BookOpen, Award, User, Tag } from 'lucide-react';

function CourseDetail() {
  const { state } = useLocation(); // Course data passed from Courselist
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [isPurchased, setIsPurchased] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [auth] = useState(JSON.parse(localStorage.getItem('tourstorage')));
  const [loading, setLoading] = useState(true);

   const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    window.history.back();
  };

  console.log(auth.vendorid, "user");

  useEffect(() => {
    if (state?._id && auth?.vendorid) {
      fetch(`http://localhost:4000/multivendor/checkcart?userid=${auth.vendorid}&courseid=${state._id}`)
        .then(res => res.json())
        .then(data => {
          setInCart(data.status === 1); // backend should return { status: 1 } if in cart
        })
        .catch(err => {
          console.error("Failed to check cart status:", err);
        });
    }
  }, [state, auth]);

  useEffect(() => {
    if (state?._id && auth?.vendorid) {
      fetch(`http://localhost:4000/multivendor/checkpurchase?userid=${auth.vendorid}&courseid=${state._id}`)
        .then(res => res.json())
        .then(data => {
          setIsPurchased(data.status === 1);
        })
        .catch(err => {
          console.error("Failed to check purchase status:", err);
        });
    }
  }, [state, auth]);

  useEffect(() => {
    if (state?._id) {
      fetch(`http://localhost:4000/multivendor/lessons/${state._id}`)
        .then(res => res.json())
        .then(data => {
          setLessons(data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch lessons:", err);
          setLoading(false);
        });
    }
  }, [state]);

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

  const initPay = (data) => {
    const options = {
      key: "rzp_test_4Ex6Tyjkp79GFy",
      amount: data.amount,
      currency: data.currency,
      name: state.title,
      description: "Course purchase",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL = "http://localhost:4000/api/payment/verify";

          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            user_id: auth.vendorid,
            course_id: state._id,
            amount: state.discountprice,
            venid: state.venid,
            instructorid: state.instructorid?._id,
            status: 1
          };

          const res = await fetch(verifyURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await res.json();
          console.log("Payment verification result:", result);

        } catch (error) {
          console.error(error)
        }
      }
    }
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async () => {
    try {
      const orderURL = "http://localhost:4000/api/payment/orders";
      const response = await fetch(orderURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: state.discountprice })
      });
      const data = await response.json();
      console.log(data);
      initPay(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddToCart = () => {
    let para = {
      courseid: state._id,
      userid: auth.vendorid,
      status: 1
    }
    fetch("http://localhost:4000/multivendor/addtocart", {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json"
      },
      body: JSON.stringify(para)
    }).then((res) => res.json())
      .then((result) => {
        console.log(result)
        setInCart(true);
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const discountPercentage = state.price && state.discountprice ? 
    Math.round(((state.price - state.discountprice) / state.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Hero */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src={`http://localhost:4000/${state.thumbnail}`}
                  alt={state.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {discountPercentage}% OFF
                  </div>
                )}
                {isPurchased && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Purchased
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{state.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{state.shortdescription}</p>
                
                {/* Course Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <Award className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">{state.level}</div>
                    <div className="text-xs text-gray-600">Level</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">{lessons.length}</div>
                    <div className="text-xs text-gray-600">Lessons</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">1.2k+</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <Star className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">4.8</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {state.categoryid?.category}
                  </span>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">About This Course</h3>
                  <p className="text-gray-600 leading-relaxed">{state.description}</p>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Meet Your Instructor</h3>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {state.instructorid?.profile ? (
                    <img
                      src={`http://localhost:4000/${state.instructorid.profile}`}
                      alt={state.instructorid.name}
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{state.instructorid?.name}</h4>
                  <p className="text-gray-600">Expert Instructor</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      4.9 Rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      50k+ Students
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Course Content</h3>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson._id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800 mb-2">{lesson.coursetitle}</h4>
                        <p className="text-gray-600 text-sm mb-2">{lesson.summary}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lesson.courseduration}
                          </span>
                          {lesson.sectionview?.section && (
                            <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
                              {lesson.sectionview.section}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-4xl font-bold text-green-600">₹{state.discountprice}</span>
                    {state.price > state.discountprice && (
                      <span className="text-xl text-gray-400 line-through">₹{state.price}</span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <p className="text-sm text-green-600 font-medium">Save {discountPercentage}% today!</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 mb-8">
                  {isPurchased ? (
                    <><button 
                      onClick={() => navigate('/courselesson', { state: { courseid: state._id, title: state.title } })}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Learning
                    </button>
                    <button 
                      onClick={() => navigate('/assessment', { state: { courseid: state._id, title: state.title, shortdescription: state.shortdescription } })}
                      className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Take Assessment 
                    </button></>
                  ) : (
                    <>
                      <button 
                        onClick={handlePay}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Buy Now
                      </button>
                      
                      {inCart ? (
                        <button 
                          disabled
                          className="w-full bg-green-100 text-green-600 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Added to Cart
                        </button>
                      ) : (
                        <button 
                          onClick={handleAddToCart}
                          className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Money Back Guarantee */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">30-Day Money Back Guarantee</span>
                  </div>
                  <p className="text-sm text-green-600">Full refund if you're not satisfied</p>
                </div>

                {/* Course Features */}
                <div className="mt-8 space-y-3">
                  <h4 className="font-semibold text-gray-800 mb-4">This course includes:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lifetime access
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Mobile and desktop access
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Certificate of completion
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Direct instructor support
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;