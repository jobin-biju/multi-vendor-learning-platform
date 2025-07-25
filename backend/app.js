require('dotenv').config();
var express = require('express');
var cors = require('cors');
const dotenv = require('dotenv');
const paymentRoute = require('./routes/payment.routes')
var bodyParser = require('body-parser');
var app = express();
dotenv.config()//setting up enivronment variable for payment
var fileUpload = require('express-fileupload');
const database = require('./config/database');
var formRouter = require('./routes/form.routes');
var chatRouter = require('./routes/chat.routes');
var session = require('express-session');
const { send } = require('./controller/chat.controller');
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())



// parse application/json
app.use(bodyParser.json())
app.use(express.static('asset'))
app.use(fileUpload())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

database()
app.use("/api/payment", paymentRoute)
app.use("/multivendor", formRouter)
app.use("/chat", chatRouter)
app.use('/api/auth', sendgridRoutes = require('./routes/sendgrid.routes'));
app.use('/api', videoProgressRoutes = require('./routes/videoprogress.routes'));

app.listen(4000)