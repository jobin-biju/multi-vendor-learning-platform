const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const vendorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    approvestatus: {
        type: Number,
        required: true
    }
})

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
    },
    qualification: {
        type: String,
    }

})

const instructorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    profile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    vid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendorRegister'
    }
})

const LoginSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    vendorid: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'regType'
    },
    regType: {
        type: String,
        enum: ['vendorRegister', "userRegister", "instructorRegister"],
        required: true
    },
    usertype: {
        type: Number,
        required: true
    },
    resetToken: {
        type: String
    },
    tokenExpiration: {
        type: Date
    }

})

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    shortdescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    level: {
        type: String,
        required: true
    },
    instructorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instructorRegister",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountprice: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    venid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendorRegister'
    }
})

const sectionSchema = mongoose.Schema({
    section: {
        type: String,
        required: true
    }
})

const lessonSchema = mongoose.Schema({
    sectionview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: false
    },
    courseName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    coursetitle: {
        type: String,
        required: true
    },
    coursevideo: {
        type: String,
        required: true
    },
    courseduration: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: true
    },
    insid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "instructorRegister",
    }

})

// const purchaseSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userRegister', required: true },
//   courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
//   amount: Number,
//   paymentId: String,
//   orderId: String,
//   signature: String,
//   status: { type: String, default: 'success' },
//   createdAt: { type: Date, default: Date.now }
// });

const cartSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userRegister'
    },
    courseid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    status: {
        type: Number,
        required: true
    }
})

const FeedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userRegister', // Adjust according to your actual user collection
        required: true,
    },
    type: {
        type: String,
        enum: ['admin', 'vendor'],
        required: true,
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendorRegister', // Adjust collection name
        required: function () {
            return this.type === 'vendor';
        },
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'instructorRegister', // Adjust collection name
        required: function () {
            return this.type === 'vendor';
        },
    },
    title: {
        type: String,
        required: function () {
            return this.type === 'admin';
        },
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const replySchema = new mongoose.Schema({
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feedback',
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userRegister',
        required: false
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userRegister',
        required: false
    },
    reply: {
        type: String,
        required: true
    },
    repliedAt: {
        type: Date,
        default: Date.now
    },

});
// const purchaseModel = mongoose.model('purchase', purchaseSchema);
const replyModel = mongoose.model('reply', replySchema);
const feedbackModel = mongoose.model('feedback', FeedbackSchema);
const cartModel = mongoose.model('cart', cartSchema);
const lessonModel = mongoose.model('lesson', lessonSchema)
const sectionModel = mongoose.model('section', sectionSchema)
const courseModel = mongoose.model('course', courseSchema)
const userModel = mongoose.model('userRegister', userSchema)
const vendorModel = mongoose.model('vendorRegister', vendorSchema)
const instructorModel = mongoose.model('instructorRegister', instructorSchema)
const vendorLoginModel = mongoose.model('vendorLogin', LoginSchema)
const categoryModel = mongoose.model('category', categorySchema)
module.exports = { categoryModel, vendorLoginModel, vendorModel, userModel, instructorModel, courseModel, sectionModel, lessonModel, cartModel, feedbackModel, replyModel };