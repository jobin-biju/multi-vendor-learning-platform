
const { title } = require("process")
const {categoryModel, vendorModel,userModel, vendorLoginModel, instructorModel, courseModel, sectionModel, lessonModel} = require("../model/form.model")
const path = require("path")
const { log } = require("console")



//ADMIN

// ADD CATEGORY
exports.CategoryIndex = async (req,res)=>{
    try{
       await categoryModel.create(req.body)
       
        res.json("Success")
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
}
// View CATEGORY
exports.viewCategory = async (req,res)=>{
    try{
        const data = await categoryModel.find()
        res.json(data)
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
}
// Delete CATEGORY
exports.deleteCategory = async (req,res)=>{
    try{
        await categoryModel.findByIdAndDelete(req.body.id)
        res.json("Deleted Successfully")
    }
    catch(err){
        console.log(err);
        res.json(err);
        
    }
}
// Edit CATEGORY
exports.categoryEditByid = async (req,res)=>{
    try{
        let edit = await categoryModel.findById(req.body.id)
        res.json(edit)
    }
    catch(err){
        console.log(err);;
        
    }
}
// Update CATEGORY
exports.categoryUpadte = async (req,res) =>{
    try{
        let update = await categoryModel.findByIdAndUpdate(req.body.id,req.body)
        res.json("Updated Successfully")
    }
    catch{
        console.log(err);
        res.json(err)
    }
}

//REGISTER AND LOGIN INSERT(AUTH)

exports.vendorRgIndex = async(req,res)=>{
    try{
        const vendorRegister={
            name:req.body.name,
            phone:req.body.phone,
            approvestatus:req.body.approvestatus
        }
        console.log("err");
        const venreg = await vendorModel.create(vendorRegister)
        
        const vendorLogin={
            email: req.body.email,
            password: req.body.password,
            usertype: req.body.usertype,
            regType:"vendorRegister",
            vendorid: venreg._id
        }
        await vendorLoginModel.create(vendorLogin)
        res.json("Success")
    }
    catch(err){
        console.error(err)
    }
}

//VENDOR VIEW

exports.vendorView = async(req,res)=>{
    try{
        let data = await vendorLoginModel.find({usertype:0}).populate("vendorid")
        res.json(data)
    }
    catch(err){
        console.log(err);
        
    }
}
//STUDENT VIEW
exports.studentView = async(req,res)=>{
    try{
        let data = await vendorLoginModel.find({usertype:1}).populate("vendorid")
        res.json(data)
    }
    catch(err){
        console.log(err);
        
    }
}


//APPROVAL STATUS
exports.approveStatus = async (req, res) => {
    try {
      const { id, approvestatus } = req.body;
      const updatedVendor = await vendorModel.findOneAndUpdate({ _id: id },{ approvestatus: approvestatus }
        
      );
  
      console.log("Updated", updatedVendor);
      res.json({ message: "Approval status updated", vendor: updatedVendor });
    } catch (err) {
      console.error("Error occured:", err);
      
    }
  };
  exports.approveReject = async (req, res) => {
    try {
      const { id, approvestatus } = req.body;
      const updatedVendor = await vendorModel.findOneAndUpdate({ _id: id },{ approvestatus: approvestatus }
        
      );
  
      console.log("Updated", updatedVendor);
      res.json({ message: "Approval status updated", vendor: updatedVendor });
    } catch (err) {
      console.error("Error occured:", err);
      
    }
  };

  
//LOGIN SESSION

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find the user
    const user = await vendorLoginModel.findOne({ email });

    if (!user) {
      return res.json("User not found");
    }

    if (user.password !== password) {
      return res.json("Wrong Password");
    }

    // Step 2: If usertype is vendor (0), populate vendorid
    if (user.usertype === 0) {
      const populatedUser = await vendorLoginModel.findOne({ email }).populate('vendorid');

      if (!populatedUser.vendorid || populatedUser.vendorid.approvestatus !== 1) {
        return res.json("Vendor not approved");
      }

      // Approved vendor — login success
      req.session.user = populatedUser;
      return res.json(populatedUser);
    }

    // Step 3: For other usertypes — login directly
    req.session.user = user;
    return res.json(user);

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json("Server error");
  }
}


  //USER REGISTER
  exports.userRegister = async (req,res) =>{
    try{
        const userRegister={
            name:req.body.name,
            phone:req.body.phone,
        };
        console.log("User Registration");
        const userReg = await userModel.create(userRegister);

        const vendorLogin={
            email: req.body.email,
            password: req.body.password,
            usertype: req.body.usertype,
            regType:"userRegister",
            vendorid: userReg._id
        }
        await vendorLoginModel.create(vendorLogin)
        res.json("Success")
    }
    catch(err){
        console.error(err)
    }
  }

  //CATEREGORY VIEW FOR USER
  exports.categoryViewAdmin = async(req,res)=>{
    try{
        let data = await categoryModel.find()
        console.log(data);
        
        res.json(data)
    }
    catch(err){
        console.log(err);
        
    }
}

//INSTRUCTOR REGISTRATION IMAGE IS USED FOR UPLOAD
exports.instructorRegister = async (req,res)=>{
    try{
        const file = req.files?.profile;
        if(!file) {
            return res.status(400).json({error: "file not found"})
        }
        const fileName = file.name;
        const imagePath = path.join(__dirname, "../asset/",fileName);

        file.mv(imagePath, async(err)=>{
            if(err){
                console.error("File upload error:",err);
                return res.status(500).json({error: "File upload failed"})
            }
            try{
                const instructorRegister={
                    name:req.body.name,
                    phone:req.body.phone,
                    profile: fileName,
                    role:req.body.role,
                    dob:req.body.dob,
                    gender:req.body.gender,
                    address:req.body.address,
                    education:req.body.education,
                    vid:req.body.vid
                };
                const instructor = await instructorModel.create(instructorRegister);
                const vendorLogin={
                    email: req.body.email,
                    password: req.body.password,
                    usertype: req.body.usertype,
                    regType:"instructorRegister",
                    vendorid: instructor._id
                }
                await vendorLoginModel.create(vendorLogin)
                res.json("Success")
                
            }
            catch(dbErr){
                console.error("Database error:",dbErr);
                res.status(500).json({error: "Database error"})
            }
        });
    }catch(err){
        console.error(err)
    }
}

exports.instructorView = async (req, res) => {
    try {
        const { vid } = req.body;
        

        const instructors = await instructorModel.find({ vid });

        const results = await Promise.all(instructors.map(async (instructor) => {
            const vendorLogin = await vendorLoginModel.findOne({ vendorid: instructor._id });

            return {
                ...instructor.toObject(),
                email: vendorLogin?.email || "No email found"
            };
        }));

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

//INSTRUCTOR DELETE
exports.instructorDelete = async (req, res) => {
    try {
        const { id } = req.body;

        await instructorModel.findByIdAndDelete(id);

        await vendorLoginModel.findOneAndDelete({ vendorid: id });

        res.json("Deleted from both models successfully");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete" });
    }
};


//ADD COURSE
exports.addCourse = async (req,res)=>{
    try{
        const file = req.files?.thumbnail;
        if(!file){
            return res.status(400).json({error: "file not found"})
        }
        const fileName = file.name;
        const imagePath = path.join(__dirname, "../asset/",fileName);
        file.mv(imagePath, async(err)=>{
            if(err){
                console.error("File upload error:",err);
                return res.status(500).json({error: "File upload failed"})
            }
            try{
                const courseRegister={
                    title:req.body.title,
                    shortdescription:req.body.shortdescription,
                    description:req.body.description,
                    categoryid:req.body.categoryid,
                    level:req.body.level,
                    instructorid:req.body.instructorid,
                    price:req.body.price,
                    discountprice:req.body.discountprice,
                    thumbnail:fileName,
                    venid:req.body.vendorid,
                };
                await courseModel.create(courseRegister);
                res.json("Success")
            }
            catch(dbErr){
                console.error("Database error:",dbErr);
                res.status(500).json({error: "Database error"})
            }
        })
    } catch(err) {
        console.error("Unexpected error:", err);
        res.status(500).json({error: "Unexpected error occurred"});
    }
}

//VIEW COURSE ADDED BY VENDOR
exports.viewCourse = async (req, res) => {
    try {
        const { venid } = req.body;

        console.log("Received venid from frontend:", venid);

        if (!venid) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }

        const courses = await courseModel.find({ venid });

        console.log(`Found ${courses.length} courses for vendor ${venid}`);

        const results = await Promise.all(courses.map(async (course) => {
            const populatedCategory = await categoryModel.findById(course.categoryid);
            const populatedInstructor = await instructorModel.findById(course.instructorid);

            return {
                ...course.toObject(),
                category: populatedCategory || { name: "No category found" },
                instructorRegister: populatedInstructor || { name: "No instructor found" }
            };
        }));

        console.log("Final result sent to frontend:", results);

        res.status(200).json(results);
    } catch (err) {
        console.error("Error in viewCourse:", err);
        res.status(500).json({ message: "Server error" });
    }
};

//DELETE COURSE VIEWED BY VENDOR
exports.deleteViewedCourse = async (req,res)=>{
    try{
        let edit = await courseModel.findByIdAndDelete(req.body.id)
        res.json(edit)
    }
    catch(err){
        console.log(err);;
        
    }
}

//EDIT COURSE VIEWED BY VENDOR
exports.editCourse = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Course ID is required" });
        }

        // Find the course by ID and populate related fields
        const course = await courseModel
            .findById(id)
            .populate("categoryid", "category") // Populate category with its name
            .populate("instructorid", "name"); // Populate instructor with its name

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json(course);
    } catch (err) {
        console.error("Error in editCourse:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getCategoriesAndInstructors = async (req, res) => {
    try {
        const { vendorid } = req.query; // Assuming vendorid is sent as a query parameter

        // Fetch all categories
        const categories = await categoryModel.find({}, "category");

        // Fetch instructors added by the logged-in vendor
        // const instructors = await instructorModel.find({ vid: vendorid }, "name");
        const instructors = await instructorModel.find({ vid: vendorid }, "name");
console.log("🎯 Found instructors:", instructors.length);

        res.status(200).json({
            categories,
            instructors,
        });
    } catch (err) {
        console.error("Error in getCategoriesAndInstructors:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//COURSE UPDATE BY VENDOR
exports.courseupdate = async (req,res)=>{
    try{
        let courseupdate = {
            title:req.body.title,
            shortdescription:req.body.shortdescription,
            description:req.body.description,
            categoryid:req.body.category,
            level:req.body.level,
            instructorid:req.body.instructor,
            price:req.body.price,
            discountprice:req.body.discountprice,
        };
        if(req.files?.thumbnail){
            const file = req.files.thumbnail;
            const fileName = file.name;
            const imagePath = path.join(__dirname, "../asset/"+fileName);
            await file.mv(imagePath);
            courseupdate.thumbnail = fileName;
        }
        let update = await courseModel.findByIdAndUpdate(req.body.id,courseupdate);
        console.log("Updated", update);
        res.json({message: "Course updated successfully"});
    }
    catch(err){
        console.error("Error in course upadte:", err);
    }
}

//INSTRUCTOR COURSE VIEW
exports.instructorCourseView = async (req, res) => {
    try {
        const { instructorid } = req.body; // Get instructor ID from the request body

        if (!instructorid) {
            return res.status(400).json({ error: "Instructor ID is required" });
        }

        const instructor = await instructorModel.findOne({ _id: instructorid });

        if (!instructor) {
            return res.status(404).json({ error: "Instructor not found" });
        }

        const courses = await courseModel.find({ instructorid }).populate("categoryid", "category");

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this instructor" });
        }

        res.status(200).json(courses);
    } catch (err) {
        console.error("Error in instructorCourseView:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//ADD SECTION BY INSTRUCTOR
exports.addSection = async (req,res)=>{
    try{
       await sectionModel.create(req.body)
       
        res.json("Success")
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
}

//VIEW SECTION ADDED BY INSTRUCTOR
exports.viewSection = async (req,res)=>{
    try{
        const data = await sectionModel.find()
        res.json(data)
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
}
//VIEW COURSE TITLE FOR LESSON. THE COURSE ADD BY THE VENDOR
exports.lessonCourseView = async (req, res) => {
    try {
        const { instructorid } = req.body;

        const course = await courseModel.find({ instructorid }).populate("instructorid", "title");

        res.status(200).json(course);

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ADD LESSON BY INSTRUCTOR TO THE DATABASE
exports.addcourselesson = async (req,res)=>{
    try{
        const file = req.files?.coursevideo;
        if(!file){
            return res.status(400).json({error: "file not found"})
        }
        const fileName = file.name;
        const imagePath = path.join(__dirname, "../asset/",fileName);
        file.mv(imagePath, async(err)=>{
            if(err){
                console.error("File upload error:", err);
                return res.status(500).json({error: "File upload failed"})
            }
            try{
                const courselesson={
                    sectionview:req.body.sectionview1,
                    courseName:req.body.courseName1,
                    coursetitle:req.body.coursetitle,
                    coursevideo:fileName,
                    courseduration:req.body.courseduration,
                    summary:req.body.summary,
                    insid:req.body.insid, 
                }
                
                
                await lessonModel.create(courselesson);
                res.json("Success")
            }
            catch(dbErr){
                console.error("Database error:", dbErr);
                res.status(500).json({error: "Database error"})
            }
        })
    }catch(err){
        console.error("Unexpected error:", err);
        res.status(500).json({error: "Unexpected error occurred"})
    }
}

//VIEW LESSON ADDED BY INSTRUCTOR(INSTRUCTOR)
exports.viewlesson = async (req, res) => {
    try {
        const { insid } = req.body;
        console.log(insid, "Instructor ID");

        // Fetch lessons and populate related fields
        const data = await lessonModel
            .find({ insid })
            .populate("courseName", "title thumbnail") // Populate courseName with title and thumbnail
            .populate("sectionview", "section"); // Populate sectionview with the section field

        res.json(data);
    } catch (err) {
        console.error("Error in viewlesson:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//VIEW SECTION ADDED BY INSTRUCTOR
exports.viewSection = async (req,res)=>{
    try{
        const data = await sectionModel.find()
        res.json(data)
    }
    catch(err){
        console.log(err);
        res.json(err)
    }
}

//COURSE EDIT VIEW
exports.editLesson = async (req,res)=>{
    try{
        let data = await lessonModel.findById(req.body.id).populate("courseName").populate("sectionview", "section")
        res.json(data)
    }
    catch(err){
        console.log("error", err)
    }
}
exports.getAssignedCourses = async (req, res) => {
    try {
        const { vendorid } = req.body;
        console.log("Vendor ID received:", vendorid);

        if (!vendorid) {
            return res.status(400).json({ error: "Vendor ID is required" });
        }

        // Filter based on instructorid instead of assignedTo
        const courses = await courseModel.find({ instructorid: vendorid }, "title");
        console.log("Courses fetched:", courses);

        res.status(200).json(courses);
    } catch (err) {
        console.error("Error fetching assigned courses:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAllSections = async (req, res) => {
    try {
        // Fetch all sections
        const sections = await sectionModel.find({}, "section"); // Fetch only the section names
        res.status(200).json(sections);
    } catch (err) {
        console.error("Error fetching sections:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

//UPDATE LESSON BY INSTRUCTOR
exports.updateLesson = async (req, res)=>{
    try{
        let lessonupdate ={
            sectionview:req.body.sectionview,
            courseName:req.body.courseName,
            coursetitle:req.body.coursetitle,
            summary:req.body.summary,
        };
        if(req.files?.coursevideo){
            const file = req.files.coursevideo;
            const fileName = file.name;
            const imagePath = path.join(__dirname, "../asset/"+fileName);
            await file.mv(imagePath);
            lessonupdate.coursevideo = fileName;
        }
        let update = await lessonModel.findByIdAndUpdate(req.body.id, lessonupdate);
        console.log("Updated", update);
        res.json({message: "course updated successfully"});
    }
    catch(err){
        console.error("Error in course update:" ,err)

    }
}

//DELETE LESSON BY INSTRUCTOR

exports.lessondelete = (async (req, res) => {

    try {

        await lessonModel.findByIdAndDelete(req.body.id)
        res.json("deleted")

    }
    catch (err) {
        console.log(err);

    }
})




