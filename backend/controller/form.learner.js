const { courseModel, cartModel, lessonModel, userModel, vendorLoginModel, vendorModel, instructorModel, feedbackModel, replyModel } = require("../model/form.model");
const mongoose = require("mongoose");
const { aptitudeModel } = require("../model/aptitude.model");
const { paymentModel } = require("../model/payment.model");
const completionModel = require("../model/completion.model");
exports.viewCourse = async (req, res) => {
  try {
    const courses = await courseModel.find().populate('categoryid').populate('instructorid');
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.viewCourseById = async (req, res) => {
  try {
    const course = await courseModel
      .findById()
      .populate('categoryid')
      .populate('instructorid')
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
};

// LessonController.js
exports.getLessonsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await lessonModel.find({ courseName: courseId }).populate('sectionview'); // optional populate
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

//USER PROFILE VIEW
exports.userProfile = async (req, res) => {
  try {
    const { userid } = req.body;

    // 1. Fetch user from userModel using vendorid
    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Fetch email from vendorLoginModel using vendorid
    const login = await vendorLoginModel.findOne({ vendorid: userid });
    if (!login) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // 3. Send combined data
    res.json({
      name: user.name,
      phone: user.phone,
      email: login.email,
      address: user.address,
      gender: user.gender,
      qualification: user.qualification
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { vendorid, name, phone, email, address, gender, qualification } = req.body;

    // 1. Update user profile
    const user = await userModel.findByIdAndUpdate(
      vendorid,
      { name, phone, address, gender, qualification },
      { new: true }
    );

    // 2. Update email in vendor login
    await vendorLoginModel.findOneAndUpdate(
      { vendorid },
      { email }
    );

    res.json({
      name: user.name,
      phone: user.phone,
      email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

//insert cart
exports.insertCart = async (req, res) => {
  try {
    const cart = await cartModel.create(req.body);
    res.json(cart)
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert cart' })
  }
}


exports.checkPurchase = async (req, res) => {
  try {
    const { userid, courseid } = req.query;
    // Replace PurchaseModel with your actual purchase/order model
    const purchase = await paymentModel.findOne({ user_id: userid, course_id: courseid, status: 1 });
    if (purchase) {
      res.json({ status: 1 });
    } else {
      res.json({ status: 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check purchase status' });
  }
};

//view cart
exports.viewCart = async (req, res) => {
  try {
    const { userid } = req.body;

    const cartItems = await cartModel.find({ userid })
      .populate('courseid') // Get full course details
      .exec();

    res.json(cartItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

//Delete cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    if (!cartId) return res.status(400).json({ error: 'Cart item ID is required' });

    await cartModel.findByIdAndDelete(cartId);
    res.json({ success: true, message: 'Removed from cart' });
  } catch (err) {
    console.error("Remove Cart Error:", err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

// In your controller
exports.checkCart = async (req, res) => {
  const { userid, courseid } = req.query;
  const cart = await cartModel.findOne({ userid, courseid, status: 1 });
  res.json({ status: cart ? 1 : 0 });
};


// Get all lessons for a course
// Get all lessons for a course (POST, courseid in body)
exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseid } = req.body; // Get courseid from POST body
    const lessons = await lessonModel.find({ courseName: courseid });
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// Get all payments for courses owned by this vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const { vendorid } = req.params;
    // Find all courses by this vendor
    const courses = await courseModel.find({ vendorid });
    const courseIds = courses.map(c => c._id);
    // Find all payments for these courses
    const payments = await paymentModel
      .find({ course_id: { $in: courseIds }, status: 1 })
      .populate('user_id')    // populate buyer info
      .populate('course_id'); // populate course info
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

//get all payments  for course for vendor
exports.vendorCoursePayment = async (req, res) => {
  try {
    const { venid } = req.body;
    const payments = await paymentModel.find({ venid })
      .populate('course_id') // ✅ correct field name
      .populate('user_id');  // ✅ correct field name
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

//view learner
exports.viewLearner = async (req, res) => {
  try {
    const { instructorid } = req.body;
    const course = await paymentModel.find({ instructorid })
      .populate('course_id')
      .populate('user_id');
    res.json(course);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch learner' })
  }
}

exports.viewvendorfeedback = async (req, res) => {
  try {
    const { vendorid } = req.body;
    const payment = await paymentModel.find({ vendorid })
      .populate('venid')
      .populate('instructorid')
    res.json(payment);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch vendor' })
  }
}




exports.submitFeedback = async (req, res) => {
  try {
    const newFeedback = new feedbackModel(req.body);
    await newFeedback.save();
    res.json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting feedback.' });
  }
};


exports.getAdminFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackModel
      .find({ type: 'admin' })
      .populate('userId', 'name'); // populate name from user collection

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin feedback' });
  }
};

exports.saveReply = async (req, res) => {
  try {
    const { feedbackId, auth, reply } = req.body;

    if (!feedbackId || !auth || !reply) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the feedback to get the userId
    const feedback = await feedbackModel.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    const newReply = new replyModel({
      feedbackId,
      adminId: auth, // admin ID from localStorage
      userId: feedback.userId, // user who gave feedback
      reply
    });

    await newReply.save();

    res.json({ message: "Reply saved successfully" });

  } catch (err) {
    console.error("Error saving reply:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.postReply = async (req, res) => {
  const { reply, auth, feedbackId } = req.body;
  try {
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });

    const replyDoc = new Reply({
      reply,
      adminId: auth,
      userId: feedback.userId,
      feedbackId,
      repliedAt: new Date()
    });

    await replyDoc.save();
    res.json({ message: 'Reply sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
};



exports.getuserReply = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const replies = await replyModel.find({ userId })
      .populate('feedbackId', 'description')
      .populate('userId', 'name');

    res.json(replies);
  } catch (err) {
    console.error('Error in getuserReply:', err);
    res.status(500).json({ error: "Failed to fetch replies" });
  }
};

exports.viewreplyvendor = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Find feedbacks where vendorId matches and type is "vendor"
    const feedbacks = await feedbackModel.find({
      vendorId: userId,
      type: "vendor"
    }).populate('userId', 'name');

    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching vendor feedbacks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.addvendorreply = async (req, res) => {
  try {
    const { userId, feedbackId, reply } = req.body;
    if (!userId || !feedbackId || !reply) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the reply
    const newReply = new replyModel({
      userId,
      feedbackId,
      reply,
    });
    await newReply.save();

    // Update the feedback status to 1
    const updated = await feedbackModel.findByIdAndUpdate(
      feedbackId,
      { status: 1 },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ message: "Reply saved and feedback status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save reply" });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId, status } = req.body;
    if (!feedbackId || typeof status === 'undefined') {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated = await feedbackModel.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ message: "Feedback status updated", feedback: updated });
  } catch (err) {
    console.error("Error updating feedback status:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getMyCourses = async (req, res) => {
  try {
    const { userid } = req.body;
    if (!userid) return res.status(400).json([]);

    // Find all payments for this user
    const payments = await paymentModel.find({ user_id: userid });

    // Extract course IDs from payments
    const courseIds = payments.map(p => p.course_id);

    // Find all courses with those IDs
    const courses = await courseModel.find({ _id: { $in: courseIds } });

    res.json(courses); // <-- This should be an array!
  } catch (err) {
    res.status(500).json([]);
  }
};

exports.getLessonsByCourse = async (req, res) => {
  const { courseid } = req.params;

  console.log("🔍 Course ID from request:", courseid);

  if (!mongoose.Types.ObjectId.isValid(courseid)) {
    console.log("❌ Invalid ObjectId");
    return res.status(400).json({ error: 'Invalid course ID format' });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(courseid);
    console.log("✅ Valid ObjectId:", objectId);

    const lessons = await lessonModel
      .find({ courseName: objectId })
      .populate('sectionview');

    console.log("📚 Lessons fetched:", lessons.length);
    return res.status(200).json(lessons);
  } catch (err) {
    console.error("🔥 Error occurred:", err.message);
    return res.status(500).json({ error: err.message });
  }
};


exports.submitAptitudeScore = async (req, res) => {
  try {
    const { userid, score } = req.body;

    if (!userid || typeof score !== 'number') {
      return res.status(400).json({ error: 'userid and score are required' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userid);

    // Count previous attempts
    const attemptCount = await aptitudeModel.countDocuments({ userId: userObjectId });

    // Create new score entry
    const newScore = new aptitudeModel({
      userId: userObjectId,
      score,
      attempted: attemptCount + 1, // incremented count
    });

    await newScore.save();

    res.json({
      success: true,
      message: 'Score saved',
      score: newScore,
      attemptNumber: attemptCount + 1
    });
  } catch (err) {
    console.error('❌ Error in submitAptitudeScore:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

exports.getUserReport = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const report = await aptitudeModel.find({ userId }).sort({ submittedAt: 1 });
    res.json(report);
  } catch (err) {
    console.error('Error in getUserReport:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.completion = async (req, res) => {
  try {
    const { userId, instructorId, courseId, completedLessons, totalLessons } = req.body;

    console.log('Received completion data:', {
      userId,
      instructorId,
      courseId,
      completedLessons,
      totalLessons
    });

    if (!userId || !courseId || !instructorId || !completedLessons || !totalLessons) {
      return res.status(400).json({ error: 'Missing required fields' });
    }


    const completionDoc = await completionModel.findOneAndUpdate(
      { userId, courseId },
      {
        userId,
        instructorId,
        courseId,
        completedLessons,
        totalLessons,
      },
      { upsert: true, new: true }
    );

    const completionPercentage = (completedLessons.length / totalLessons) * 100;

    const user = await userModel.findById(userId);
    console.log(user, "from the backnd");

    res.json({
      user: user?.name || 'Unknown User',
      // course: course?.title || 'Unknown Course',
      completionPercentage: completionPercentage.toFixed(2) + '%',
      completedLessons: completionDoc.completedLessons,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save or fetch completion data' });
  }
};


// GET /api/completions/instructor/:instructorId
const LessonCompletion = require('../model/completion.model.js');

exports.getCompletionsForInstructor = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const completions = await LessonCompletion.find({ instructorId })
      .populate({ path: 'userId', model: 'userRegister', select: 'name' })
      .populate({ path: 'courseId', model: 'course', select: 'title' });

    console.log("Populated Sample:", JSON.stringify(completions[0], null, 2));

    const result = completions.map(item => ({
      user: item.userId?.name || 'Unknown User',
      userId: item.userId?._id || item.userId || '',
      course: item.courseId?.title || 'Unknown Course',
      courseId: item.courseId?._id || '',
      completionPercentage: item.totalLessons
        ? ((item.completedLessons.length / item.totalLessons) * 100).toFixed(2) + '%'
        : '0.00%',
      completedLessonsCount: item.completedLessons.length,
      totalLessons: item.totalLessons,
    }));

    res.json({ data: result });
  } catch (error) {
    console.error('Error fetching completions:', error);
    res.status(500).json({ error: 'Failed to fetch completion data' });
  }
};


//get my payments for user
exports.getPayments = async (req, res) => {
  try {
    const { userId } = req.body;
    const data = await paymentModel
      .find({ user_id: userId })
      .populate({
        path: 'user_id', // userRegister collection
        select: 'name email phone'
      })
      .populate({
        path: 'course_id',
        select: 'title'
      })
      .populate({
        path: 'instructorid',
        select: 'name'
      })
      .populate({
        path: 'venid',
        select: 'name'
      });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};


//apptitude certificate
exports.getApptitudeCertificate = async (req, res)=>{
  try {
    const {userId} = req.body;
    const data = await aptitudeModel.find({userId}).populate('userId')
    res.json(data);
  }
  catch(err){
    console.error(err)
  }
}

exports.adminViewCourses = async (req, res) => {
  try {
    const courses = await courseModel.find().populate('venid','name' );
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};