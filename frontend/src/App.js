import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Main from './Admincomponents/Main';
import Table from './Admincomponents/Table';
import Information from './Admincomponents/Information';
import Course from './Admincomponents/Course';
import Register from './Admincomponents/Register';
import Login from './Admincomponents/Login';
import Instructor from './Admincomponents/Instructor';
import Teachers from './Admincomponents/Teachers';
import TeacherDetails from './Admincomponents/TeacherDetails';
import Contact from './Admincomponents/Contact';
import UserProfile from './Admincomponents/UserProfile';
import Home from './Admin/Home';
import EditCategory from './Admin/EditCategory';
import Category from './Admincomponents/Category';
import Options from './Admincomponents/Options'
import VendorSignup from './Admincomponents/VendorSignup'
import VendorSideBar from './Vendor/VendorSidebar'
import { useState } from 'react';
import EditCourse from './Vendor/EditCourse';
import InstructorHome from './Instructor/InstructorHome';
import EditLesson from './Instructor/EditLesson';
import CourseDetails from './Admincomponents/Coursedetails';
import MyCart from './Admincomponents/MyCart';
import CourseLesson from './Admincomponents/CourseLesson';
import Feedback from './Admincomponents/Feedback';
import Viewreply from './Admincomponents/Viewreply';
import Assessment from './Admincomponents/Assessment';
import LearnersChat from './Admincomponents/LearnersChat';
import MyCourseView from './Admincomponents/MyCourseView';
import MyCourseLesson from './Admincomponents/MyCouresLesson';
import Games from './Admincomponents/Games';
import AptitudeTest from './Admincomponents/AptitudeTest';
import UserReport from './Admincomponents/UserReport';
import ForgotPassword from './Admincomponents/ForgotPassword';
import ResetPassword from './Admincomponents/ResetPassword';
import MyPayments from './Admincomponents/MyPayments';
import ApptitudeCertificate from './Admincomponents/ApptitudeCertificate';
function App() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('tourstorage')))
  // console.log(auth, "nji");

  return (
    <div className="App">
      <BrowserRouter>
        {auth == null ? (
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/options" element={<Options />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/vendorsignup" element={<VendorSignup />} />
            <Route path='/forgotpassword' element={<ForgotPassword/>}/>
            <Route path='/reset-password/:token' element={<ResetPassword/>}/>
          </Routes>
        ) : auth.usertype == 1 ? (
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/course" element={<Course />} />
            <Route path="/ins" element={<Teachers />} />
            <Route path="/teachdetails" element={<TeacherDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/course-detail" element={<CourseDetails />} />
            <Route path='/viewcart' element={<MyCart />} />
            <Route path='/chat' element={<LearnersChat />} />
            <Route path="/courselesson" element={<CourseLesson />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path='/feedback' element={<Feedback />} />
            <Route path='/viewreply' element={<Viewreply />} />
            <Route path='/mycourse' element={<MyCourseView/>}/>
            <Route path='/courselessons' element={<MyCourseLesson/>}/>
            <Route path='/game' element={<Games/>}/>
            <Route path='/aptitudetest' element={<AptitudeTest/>}/>
            <Route path='/report' element={<UserReport/>}/>
            <Route path='/mypayment' element={<MyPayments/>}/>
            <Route path='/apptitude-certificate' element={<ApptitudeCertificate/>}/>
          </Routes>
        ) : auth.usertype == 2 ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/edit" element={<EditCategory />} />
            <Route path="/viewcategory" element={<Category />} />
          </Routes>
        ) : auth.usertype == 0 ? (
          <Routes>
            <Route path='/' element={<VendorSideBar />} />
            <Route path='/editcourse' element={<EditCourse />} />
          </Routes>
        ) : auth.usertype == 3 ? (
          <Routes>
            <Route path='/' element={<InstructorHome />} />
            <Route path='/editlesson' element={<EditLesson />} />
          </Routes>
        ) : null}
      </BrowserRouter>






      {/* <BrowserRouter>
        <Routes>
          <Route  path="/" element={<Main/>}/>
          <Route  path="/course" element={<Course/>}/>
          <Route  path="/register" element={<Register/>}/>
          <Route  path="/login" element={<Login/>}/>
          <Route  path="/ins" element={<Teachers/>}/>
          <Route  path="/teachdetails" element={<TeacherDetails/>}/>
          <Route  path="/contact" element={<Contact/>}/>
          <Route  path="/profile" element={<UserProfile/>}/>
          <Route  path="/admin" element={<Home/>}/>
          <Route  path="/edit" element={<EditCategory/>}/>
          <Route  path="/viewcategory" element={<Category/>}/>
          <Route path="/options" element={<Options/>}/>
          <Route path="/vendorsignup" element={<VendorSignup/>}/>


 
        </Routes>
      </BrowserRouter> */}
      {/* <Main/> */}

    </div>
  );
}

export default App;
