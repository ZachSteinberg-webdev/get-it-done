if(process.env.NODE_ENV!=="production") {
	const dotenv = require('dotenv').config();
};
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const hmsTime = require('./utilities/hmsTime');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const PassportLocal = require('passport-local');
const User = require('./models/user-model');
const ToDoList = require('./models/to-do-list-model');
const ToDoListItem = require('./models/to-do-list-item-model');
const {
	logUserIn,
	isLoggedIn
} = require('./utilities/middleware');
const {
	isGuestSession,
	getGuestUser,
	exportGuestData
} = require('./utilities/guestMode');
const {
	CustomError,
	tryCatch,
	errorHandler
} = require('./utilities/errorHandling');
const flash = require('connect-flash');
const cookierParser = require('cookie-parser');
const router = express.Router();
const userRoutes = require('./routes/userRoutes.js');
const listRoutes = require('./routes/listRoutes.js');
const listItemRoutes = require('./routes/listItemRoutes.js');
const guestRoutes = require('./routes/guestRoutes.js');

const mongoDbUrl = process.env.MONGO_ATLAS_URL;

mongoose.connect(mongoDbUrl)
	.then(()=>{console.log(`${hmsTime()}: Mongo connection open.`)})
	.catch(error=>{console.log(`${hmsTime()}: Mongo error: ${error}`)});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(mongoSanitize());
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			"script-src": ["'self'", "'unsafe-inline'"]
		}
	},
	referrerPolicy: {
		policy: "same-origin"
	}
}));

app.use(cookierParser(process.env.COOKIE_PARSER_SECRET));

const store = MongoStore.create({
	mongoUrl: mongoDbUrl,
	touchAfter: 24*60*60,
	crypto: {
		secret: process.env.MONGO_STORE_SECRET
	}
});

store.on('error', function(e){
	console.log('Session store error', e);
});

app.use(session({
	store: store,
	name: 'u9r328293r8u34',
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie:{
		httpOnly: true,
		expires: process.env.SESSION_EXPIRATION,
		maxAge: Number(process.env.SESSION_MAX_AGE)
	}
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal({usernameField: 'loginUserEmail', passwordField: 'loginUserPassword'}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.registrationError = req.flash('registrationError');
	res.locals.registrationSuccess = req.flash('registrationSuccess');
	res.locals.loginError = req.flash('loginError');
	res.locals.loginSuccess = req.flash('loginSuccess');
	const guestActive = isGuestSession(req.session);
	if(guestActive){
		const guestUser = JSON.parse(JSON.stringify(getGuestUser(req.session)));
		if(!req.user){
			req.user = guestUser;
		}
		res.locals.currentUser = guestUser;
	}else{
		res.locals.currentUser = req.user;
	}
	res.locals.isGuest = guestActive;
	res.locals.guestData = guestActive ? exportGuestData(req.session) : null;
	const shouldClearGuestStorage = Boolean(req.session && req.session.clearGuestStorage);
	res.locals.clearGuestStorage = shouldClearGuestStorage;
	if(shouldClearGuestStorage){
		delete req.session.clearGuestStorage;
	}
	next();
});

// Router extensions
app.use(guestRoutes);
app.use(userRoutes);
app.use(listRoutes);
app.use(listItemRoutes);

app.get('/', (req, res)=>{
	res.redirect('/login');
});

app.get('/test', (req,res)=>{
	if(true===false){
		next();
	}else{
		throw new CustomError(404, 'Big time error situation!', 'TestError');
	}
});

// 404 route ----------------------------------------------------------------
app.all('/*', (req,res,next)=>{
	next(new CustomError(404, 'Page not found', '404Error'));
});

app.use((err,req,res,next)=>{
	errorHandler(err,req,res,next);
});
const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`App is listening on port ${port}!`)});
