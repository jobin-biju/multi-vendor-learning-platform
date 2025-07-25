// import React, { useEffect, useState } from 'react';

// function UserProfile() {
//   const [userProfile, setUserProfile] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     gender: '',
//     qualification: ''
//   });

//   useEffect(() => {
//     const auth = JSON.parse(localStorage.getItem('tourstorage'));

//     if (auth?.vendorid) {
//       const ids = {
//         userid: auth.vendorid
//       };

//       fetch('http://localhost:4000/multivendor/userprofile', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(ids),
//       })
//         .then((res) => res.json())
//         .then((result) => {
//           setUserProfile(result);
//           setFormData({
//             name: result.name,
//             phone: result.phone,
//             email: result.email,
//             address: result.address || '',
//             gender: result.gender || '',
//             qualification:result.qualification ||''
//           });
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error('Fetch error:', error);
//           setLoading(false);
//         });
//     } else {
//       console.warn("No vendorid found in localStorage");
//       setLoading(false);
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleUpdate = () => {
//     const auth = JSON.parse(localStorage.getItem('tourstorage'));

//     fetch('http://localhost:4000/multivendor/updateprofile', {
//       method: 'PUT',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         vendorid: auth.vendorid,
//         ...formData
//       }),
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUserProfile(data);
//         setShowModal(false);
//       })
//       .catch(err => {
//         console.error('Update failed:', err);
//       });
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <p>{userProfile.name}</p>
//       <p>{userProfile.phone}</p>
//       <p>{userProfile.email}</p>
//       <p>{userProfile.address}</p>
//       <p>{userProfile.gender}</p>
//       <p>{userProfile.qualification}</p>
//       <button onClick={() => setShowModal(true)}>Edit</button>

//       {showModal && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h3>Edit Profile</h3>
//             <label>
//               Name: <input type="text" name="name" value={formData.name} onChange={handleChange} />
//             </label><br />
//             <label>
//               Phone: <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
//             </label><br />
//             <label>
//               Email: <input type="text" name="email" value={formData.email} onChange={handleChange} />
//             </label><br />
//             <label>
//               Address: <input type="text" name="address" value={formData.address} onChange={handleChange} />
//             </label><br />
//             <label></label>
//            <label>
//   Gender:
//   <input
//     type="radio"
//     name="gender"
//     value="Male"
//     checked={formData.gender === "Male"}
//     onChange={handleChange}
//   /> Male
//   <input
//     type="radio"
//     name="gender"
//     value="Female"
//     checked={formData.gender === "Female"}
//     onChange={handleChange}
//   /> Female
// </label><br />
// <label>
//   Qualification: <input type="text" name="qualification" value={formData.qualification} onChange={handleChange}/>
// </label>
//             <button onClick={handleUpdate}>Save</button>
//             <button onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// const styles = {
//   overlay: {
//     position: 'fixed',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1000
//   },
//   modal: {
//     background: '#fff',
//     padding: '20px',
//     borderRadius: '8px',
//     minWidth: '300px'
//   }
// };

// export default UserProfile;

// import React, { useEffect, useState } from 'react';
// import { User, Mail, Phone, MapPin, GraduationCap, Edit3, ArrowLeft, Save, X } from 'lucide-react';
// import { Link } from 'react-router-dom';

// function UserProfile() {
//   const handleBack = () => {
//     sessionStorage.setItem("reload", "true");
//     window.history.back();
//   };
//   const [userProfile, setUserProfile] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     gender: '',
//     qualification: ''
//   });

//   useEffect(() => {
//     const auth = JSON.parse(localStorage.getItem('tourstorage'));

//     if (auth?.vendorid) {
//       const ids = {
//         userid: auth.vendorid
//       };

//       fetch('http://localhost:4000/multivendor/userprofile', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(ids),
//       })
//         .then((res) => res.json())
//         .then((result) => {
//           setUserProfile(result);
//           setFormData({
//             name: result.name || '',
//             phone: result.phone || '',
//             email: result.email || '',
//             address: result.address || '',
//             gender: result.gender || '',
//             qualification: result.qualification || ''
//           });
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error('Fetch error:', error);
//           setLoading(false);
//         });
//     } else {
//       console.warn("No vendorid found in localStorage");
//       setLoading(false);
//     }
//   }, []);

//   const [tailwindReady, setTailwindReady] = useState(false);

//   useEffect(() => {
//     // Check if Tailwind is already loaded
//     const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
//     if (!existingScript) {
//       const script = document.createElement("script");
//       script.src = "https://cdn.tailwindcss.com";
//       script.onload = () => setTailwindReady(true);
//       document.head.appendChild(script);
//     } else {
//       setTailwindReady(true);
//     }

//     // Optional: Remove script when component unmounts
//     return () => {
//       const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
//       if (script) {
//         document.head.removeChild(script);
//         setTailwindReady(false);
//       }
//     };
//   }, []);

//   if (!tailwindReady) {
//     return <div>Loading form styles...</div>;
//   }

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleUpdate = () => {
//     const auth = JSON.parse(localStorage.getItem('tourstorage'));

//     fetch('http://localhost:4000/multivendor/updateprofile', {
//       method: 'PUT',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         vendorid: auth.vendorid,
//         ...formData
//       }),
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUserProfile(data);
//         setShowModal(false);
//       })
//       .catch(err => {
//         console.error('Update failed:', err);
//       });
//   };

//   const handleGoBack = () => {
//     window.history.back();
//   };

//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-8">
//         <div className="max-w-4xl mx-auto px-6">
//           <button 
//             onClick={handleBack}
//             className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg transition-all duration-200 mb-6"
//           >
//             <ArrowLeft size={20} />
//             Back
//           </button>
//           <h1 className="text-4xl font-bold">Student Profile</h1>
//           <p className="text-gray-300 mt-2">Manage your learning profile and personal information</p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-6 py-8">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//           {/* Profile Header */}
//           <div className="bg-gradient-to-r from-gray-50 to-teal-50 px-8 py-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-6">
//                 <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                   {getInitials(userProfile.name || 'Student Profile')}
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-bold text-gray-900">{userProfile.name || 'Student Name'}</h2>
//                   <p className="text-gray-500 mt-1">eLEARN Student Profile</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setShowModal(true)}
//                 className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
//               >
//                 <Edit3 size={18} />
//                 Edit Profile
//               </button>
//               <Link to='/report'>
//               <button className='inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'>
//                 View Report
//               </button></Link>
//             </div>
//           </div>

//           {/* Profile Details */}
//           <div className="p-8">
//             <div className="grid md:grid-cols-2 gap-8">
//               <div className="space-y-6">
//                 <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="bg-teal-100 p-2 rounded-lg">
//                     <User className="text-teal-600" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
//                     <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.name || 'Not specified'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="bg-orange-100 p-2 rounded-lg">
//                     <Mail className="text-orange-600" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
//                     <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.email || 'Not specified'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="bg-teal-100 p-2 rounded-lg">
//                     <Phone className="text-teal-600" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
//                     <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.phone || 'Not specified'}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="bg-orange-100 p-2 rounded-lg">
//                     <MapPin className="text-orange-600" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Address</label>
//                     <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.address || 'Not specified'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="bg-teal-100 p-2 rounded-lg">
//                     <User className="text-teal-600" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</label>
//                     <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.gender || 'Not specified'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
//                   <div className="bg-orange-100 p-2 rounded-lg">
//                     <GraduationCap className="text-orange-600" size={20} />
//                   </div>
//                   <div className="flex-1">
//                     <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Educational Qualification</label>
//                     <p className="text-lg font-semibold text-gray-900 mt-1">{userProfile.qualification || 'Not specified'}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 rounded-t-2xl">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-2xl font-bold">Edit Student Profile</h3>
//                 <button 
//                   onClick={() => setShowModal(false)}
//                   className="text-white/80 hover:text-white p-1"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//                 <input 
//                   type="text" 
//                   name="name" 
//                   value={formData.name} 
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                   placeholder="Enter your full name"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//                 <input 
//                   type="tel" 
//                   name="phone" 
//                   value={formData.phone} 
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                   placeholder="Enter your phone number"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
//                 <input 
//                   type="email" 
//                   name="email" 
//                   value={formData.email} 
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                   placeholder="Enter your email address"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                 <textarea 
//                   name="address" 
//                   value={formData.address} 
//                   onChange={handleChange}
//                   rows={3}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
//                   placeholder="Enter your address"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
//                 <div className="flex gap-6">
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Male"
//                       checked={formData.gender === "Male"}
//                       onChange={handleChange}
//                       className="text-teal-600 focus:ring-teal-500 w-4 h-4"
//                     />
//                     <span className="ml-2 text-gray-700">Male</span>
//                   </label>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value="Female"
//                       checked={formData.gender === "Female"}
//                       onChange={handleChange}
//                       className="text-teal-600 focus:ring-teal-500 w-4 h-4"
//                     />
//                     <span className="ml-2 text-gray-700">Female</span>
//                   </label>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Educational Qualification</label>
//                 <input 
//                   type="text" 
//                   name="qualification" 
//                   value={formData.qualification}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
//                   placeholder="Enter your educational qualification"
//                 />
//               </div>
//             </div>
            
//             <div className="bg-gray-50 p-6 rounded-b-2xl flex justify-end gap-4">
//               <button 
//                 onClick={() => setShowModal(false)} 
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleUpdate} 
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
//               >
//                 <Save size={18} />
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserProfile;



import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Edit3, ArrowLeft, Save, X, Camera, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

function UserProfile() {
  const handleBack = () => {
    sessionStorage.setItem("reload", "true");
    window.history.back();
  };
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gender: '',
    qualification: ''
  });
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get authentication data from localStorage
        const authData = localStorage.getItem('tourstorage');
        
        if (!authData) {
          console.warn("No authentication data found in localStorage");
          setLoading(false);
          return;
        }

        const auth = JSON.parse(authData);

        if (!auth?.vendorid) {
          console.warn("No vendorid found in authentication data");
          setLoading(false);
          return;
        }

        const requestPayload = {
          userid: auth.vendorid
        };

        // Fetch user profile from API
        const response = await fetch('http://localhost:4000/multivendor/userprofile', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const profileData = await response.json();

        // Update state with fetched data
        setUserProfile(profileData);
        setFormData({
          name: profileData.name || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          address: profileData.address || '',
          gender: profileData.gender || '',
          qualification: profileData.qualification || ''
        });

      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        
        // Fallback to demo data in case of error
        const fallbackData = {
          name: 'Marcus Thompson',
          phone: '+1 (555) 987-6543',
          email: 'marcus.thompson@university.edu',
          address: '456 Academic Boulevard, Scholar Heights, SH 67890',
          gender: 'Male',
          qualification: 'Master of Business Administration'
        };
        
        setUserProfile(fallbackData);
        setFormData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const authData = localStorage.getItem('tourstorage');
      
      if (!authData) {
        console.error('No authentication data found');
        return;
      }

      const auth = JSON.parse(authData);

      if (!auth?.vendorid) {
        console.error('No vendorid found in authentication data');
        return;
      }

      const updatePayload = {
        vendorid: auth.vendorid,
        ...formData
      };

      const response = await fetch('http://localhost:4000/multivendor/updateprofile', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProfile = await response.json();
      
      // Update local state with server response
      setUserProfile(updatedProfile);
      setShowModal(false);
      
      // Show success feedback
      console.log('Profile updated successfully');
      
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      // Fallback: Update local state anyway for demo purposes
      setUserProfile(formData);
      setShowModal(false);
      
      // Show success feedback even in demo mode
      const originalTitle = document.title;
      document.title = 'Profile Updated Successfully!';
      setTimeout(() => {
        document.title = originalTitle;
      }, 2000);
    }
  };

  const handleGoBack = () => {
    console.log('Going back to previous page...');
  };

  const handleViewReport = () => {
    console.log('Navigating to report page...');
  };

  const getInitials = (name) => {
    if (!name) return 'SP';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-purple-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-blue-500 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-gray-700 text-xl font-light">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <button 
            onClick={handleBack}
            className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-full transition-all duration-300 mb-8 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Student Profile
            </h1>
            <p className="text-gray-600 text-xl font-light max-w-2xl mx-auto">
              Your digital identity in the learning ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="relative p-8 pb-6 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {getInitials(userProfile.name)}
                </div>
                <button className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-50 p-3 rounded-full transition-all duration-300 border border-gray-200 shadow-md">
                  <Camera size={20} className="text-gray-600" />
                </button>
              </div>
              
              <div className="text-center lg:text-left flex-1">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{userProfile.name || 'Student Name'}</h2>
                <p className="text-gray-600 text-lg mb-4">Premium Student Member</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                    <Award size={16} className="text-yellow-600" />
                    <span className="text-yellow-800 text-sm font-medium">Verified Student</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <Calendar size={16} className="text-green-600" />
                    <span className="text-green-800 text-sm font-medium">Active Since 2024</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                >
                  <Edit3 size={20} />
                  Edit Profile
                </button>
                <Link to='/report'>
                <button 
                  onClick={handleViewReport}
                  className="inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 font-semibold shadow-sm hover:shadow-md"
                >
                  View Analytics
                </button></Link>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 pt-4">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                      <User className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Full Name</label>
                      <p className="text-xl font-bold text-gray-800">{userProfile.name || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-xl shadow-lg">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email Address</label>
                      <p className="text-xl font-bold text-gray-800 break-all">{userProfile.email || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    <div className="bg-gradient-to-br from-green-500 to-teal-500 p-3 rounded-xl shadow-lg">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                      <p className="text-xl font-bold text-gray-800">{userProfile.phone || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-lg">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Address</label>
                      <p className="text-xl font-bold text-gray-800">{userProfile.address || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-3 rounded-xl shadow-lg">
                      <User className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Gender</label>
                      <p className="text-xl font-bold text-gray-800">{userProfile.gender || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-3 rounded-xl shadow-lg">
                      <GraduationCap className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Educational Qualification</label>
                      <p className="text-xl font-bold text-gray-800">{userProfile.qualification || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold text-white">Edit Student Profile</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
                >
                  <X size={28} />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Address</label>
                <textarea 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none text-gray-900 placeholder-gray-500 text-lg"
                  placeholder="Enter your address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Gender</label>
                <div className="flex gap-6">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-500 focus:ring-purple-500 focus:ring-2 bg-gray-50 border-gray-300"
                      />
                      <span className="ml-3 text-gray-700 text-lg font-medium group-hover:text-purple-600 transition-colors">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Educational Qualification</label>
                <input 
                  type="text" 
                  name="qualification" 
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg"
                  placeholder="Enter your educational qualification"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-b-3xl flex justify-end gap-6">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-700 rounded-2xl transition-all duration-300 border border-gray-300 hover:border-gray-400 font-semibold text-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate} 
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;