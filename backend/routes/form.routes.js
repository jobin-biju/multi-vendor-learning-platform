var express = require('express');
var router = express.Router();

const formController = require('../controller/form.controller')
const learnerController = require('../controller/form.learner')

router.post('/category', formController.CategoryIndex)
router.get('/viewcategory', formController.viewCategory)
router.post('/deletecategory', formController.deleteCategory)
router.post('/editcategory', formController.categoryEditByid)
router.post('/updatecategory', formController.categoryUpadte)
router.post('/vendoreg', formController.vendorRgIndex)
router.get('/vendorview', formController.vendorView)
router.post('/approve', formController.approveStatus)
router.post('/login', formController.login)
router.post('/userRegister', formController.userRegister)
router.get('/viewcategory', formController.categoryViewAdmin)
router.get('/viewstudent', formController.studentView)
router.post('/addinstructor', formController.instructorRegister)
router.post('/viewinstructor', formController.instructorView)
router.post('/deleteinstructor', formController.instructorDelete)
router.post('/addcourse', formController.addCourse)
router.post('/getcourse', formController.viewCourse)
router.post('/deletecourse', formController.deleteViewedCourse)
router.post('/editcourse', formController.editCourse)
router.get('/getcategoriesandinstructors', formController.getCategoriesAndInstructors)
router.post('/updatecourse', formController.courseupdate)
router.post('/instructorcourseview', formController.instructorCourseView)
router.post('/addsection', formController.addSection)
router.get('/viewsection', formController.viewSection)
router.post('/lessoncourseview', formController.lessonCourseView)
router.post('/addlesson', formController.addcourselesson)
router.post('/viewlesson', formController.viewlesson)
router.get('/viewsec', formController.viewSection)
router.post('/editlesson', formController.editLesson)
router.post('/getassignedcourses', formController.getAssignedCourses);
router.get('/getallsections', formController.getAllSections);
router.post('/updatelesson', formController.updateLesson);
router.post('/deletelesson', formController.lessondelete);
// router.get('/courseview', formController.viewCourseForLearner);
// router.get('/courseview/:id', formController.getCourseById);
router.get('/courseview', learnerController.viewCourse)
router.get('/courseview/:id', learnerController.viewCourseById);
router.get('/lessons/:courseId', learnerController.getLessonsByCourseId);
router.post('/userprofile', learnerController.userProfile);
router.put('/updateprofile', learnerController.updateUserProfile)
router.post('/addtocart', learnerController.insertCart);
router.get('/checkpurchase', learnerController.checkPurchase);
router.post('/viewcart', learnerController.viewCart);
router.delete('/removecart/:id', learnerController.removeFromCart);
router.get('/checkcart', learnerController.checkCart);

router.post('/lessons', learnerController.getLessonsByCourse);
router.get('/vendororders/:vendorid', learnerController.getVendorOrders);
router.post('/views', learnerController.vendorCoursePayment)
router.post('/getlearner', learnerController.viewLearner)
router.post('/viewvendor', learnerController.viewvendorfeedback);

router.post('/submitfeedback', learnerController.submitFeedback);
router.get('/adminfeedback', learnerController.getAdminFeedback);
router.post('/reply', learnerController.saveReply);
router.post('/viewreply', learnerController.getuserReply);
router.post('/viewreviewins', learnerController.viewreplyvendor)
router.post('/reply', learnerController.addvendorreply);
router.post('/statusupdate', learnerController.updateFeedbackStatus)
// Get all courses purchased by a user
router.post('/getmycourses', learnerController.getMyCourses);

// Get all lessons for a specific course
router.get('/lessons/:courseid', learnerController.getLessonsByCourse);


router.post('/aptitudetest', learnerController.submitAptitudeScore)
router.post('/user', learnerController.getUserReport);
router.post('/completion', learnerController.completion);
router.post('/getcompletion', learnerController.getCompletionsForInstructor);

router.post('/getpayments', learnerController.getPayments);
router.post('/getApptitudeCertificate', learnerController.getApptitudeCertificate);



router.get('/adminviewcourse', learnerController.adminViewCourses);






module.exports = router