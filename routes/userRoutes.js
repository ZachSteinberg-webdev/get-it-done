const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const User = require('../models/user-model.js');
const ToDoList = require('../models/to-do-list-model');
const ToDoListItem = require('../models/to-do-list-item-model');
const passport = require('passport');
const mongoose = require('mongoose');
const {
	getUserFirstName,
	isLoggedIn,
	doUserUpdate,
	doPasswordUpdate,
	isNewUserNameDifferent,
	isNewUserEmailDifferent,
	doAfterSuccessCondition,
	doAfterFailureCondition,
	requireNonGuest
} = require('../utilities/middleware.js');
const {
	CustomError,
	tryCatch
} = require('../utilities/errorHandling');
const {
	isGuestSession,
	updateGuestDesktopItems,
	clearGuestSession,
	migrateGuestDataToUser,
	runGuestSessionMutation
} = require('../utilities/guestMode');


// Show registration screen
router.get('/register', tryCatch(async(req,res)=>{
	res.render('pages/register', {req});
}));

// Process registration submission
router.post('/register', tryCatch(async(req,res,next)=>{
	const {registrationUserName, registrationUserEmail, registrationUserPassword, registrationUserPasswordConfirmation}=req.body;
	if(registrationUserName===""){
		throw new CustomError(400, `You didn't provide a username. Please try again.`, 'registrationError', 'registrationRoute');
		return res.redirect('/register');
	}else if(registrationUserEmail===""){
		throw new CustomError(400, `You didn't provide an email address. Please try again.`, 'registrationError', 'registrationRoute');
		return res.redirect('/register');
	}else if(registrationUserPassword===""){
		throw new CustomError(400, `You didn't provide a password. Please try again.`, 'registrationError', 'registrationRoute');
		return res.redirect('/register');
	}else if(registrationUserPasswordConfirmation===""){
		throw new CustomError(400, `You didn't fill in the password confirmation field. Please try again.`, 'registrationError', 'registrationRoute');
		return res.redirect('/register');
	}else if(registrationUserPassword===registrationUserPasswordConfirmation){
		const registrationDetails = {userName: req.body.registrationUserName, userEmail: req.body.registrationUserEmail};
		const registrationPassword = req.body.registrationUserPassword;
		const registeredUser = await User.register(registrationDetails, registrationPassword);
		let migrationSummary = {listsMigrated: 0, itemsMigrated: 0};
		const wasGuest = isGuestSession(req.session);
		if(wasGuest){
			migrationSummary = await runGuestSessionMutation(req, (session)=> migrateGuestDataToUser(session, registeredUser));
		}
		req.login(registeredUser, (e)=>{
			if(e){
				return next(e);
			}
			if(wasGuest){
				req.session.clearGuestStorage = true;
			}
			if(migrationSummary.listsMigrated || migrationSummary.itemsMigrated){
				req.flash('success', `${migrationSummary.listsMigrated} list${migrationSummary.listsMigrated===1?'':'s'} and ${migrationSummary.itemsMigrated} item${migrationSummary.itemsMigrated===1?'':'s'} migrated from guest mode.`);
			}
			req.flash('registrationSuccess', 'Welcome aboard and happy list-keeping!');
			res.redirect('/lists');
		});
	}else if(registrationUserPassword!==registrationUserPasswordConfirmation){
		throw new CustomError(400, `Your password and password confirmation entries do not match. Please try again.`, 'registrationError', 'registrationRoute');
		return res.redirect('/register');
	}else{
		throw new CustomError(500, `Something somewhere somehow went wrong. Sorry about that! Please try again in a few hours.`, 'registrationError', 'registrationRoute');
		return res.redirect('/register');
	};
}));

// Show login page
router.get('/login', tryCatch(async(req,res)=>{
	if(req.user){
		res.redirect('/lists');
	}else{
		res.render('pages/login', {req});
	};
}));

// Process login submission
router.post('/login', (req,res,next)=>{
	passport.authenticate('local', async(err,user,info)=>{
		try{
			if(err){
				return next(err);
			}
			if(!user){
				req.flash('loginError', info?.message || 'Invalid email or password. Please try again.');
				return res.redirect('/login');
			}
			let migrationSummary = {listsMigrated: 0, itemsMigrated: 0};
			const wasGuest = isGuestSession(req.session);
			if(wasGuest){
				migrationSummary = await runGuestSessionMutation(req, (session)=> migrateGuestDataToUser(session, user));
			}
			req.login(user, (loginErr)=>{
				if(loginErr){
					return next(loginErr);
				}
				if(wasGuest){
					req.session.clearGuestStorage = true;
				}
				req.flash('loginSuccess', `Welcome back, ${getUserFirstName(req)}! Good to see you again. :)`);
				if(migrationSummary.listsMigrated || migrationSummary.itemsMigrated){
					req.flash('success', `We moved ${migrationSummary.listsMigrated} list${migrationSummary.listsMigrated===1?'':'s'} and ${migrationSummary.itemsMigrated} item${migrationSummary.itemsMigrated===1?'':'s'} from guest mode into your account.`);
				}
				if(req.app.locals.originalUrl){
					const originalUrl = req.app.locals.originalUrl;
					req.app.locals.originalUrl = undefined;
					return res.redirect(originalUrl);
				}
				return res.redirect('/lists');
			});
		}catch(handlerError){
			next(handlerError);
		}
	})(req,res,next);
});

// Log user out
router.get('/logout', tryCatch(async(req,res,next)=>{
	req.app.locals.originalUrl = req.get('referer');
	if(isGuestSession(req.session)){
		await runGuestSessionMutation(req, (session)=>{
			clearGuestSession(session);
		});
		return res.redirect('/login');
	}
	req.logout((err)=>{
		if(err){
			return next(err);
		}
		res.redirect('/login');
	});
}));

// Update userName, userEmail and/or password
router.post('/user/update', requireNonGuest, tryCatch(async(req,res)=>{
	const previousUrl = req.get('referer');
	const userId = req.user._id;
	const currentEmail = req.user.userEmail;
	const {newUserName, newUserEmail, userCurrentPassword, userNewPassword} = req.body;
	if(!newUserName && !newUserEmail && !userCurrentPassword && !userNewPassword){
		req.flash('error', "You didn't enter anything into the form! Please try again.");
		await doAfterFailureCondition(res, previousUrl);
	}else if((!!newUserName || !!newUserEmail)&&(!userCurrentPassword &&!userNewPassword)){
		await doUserUpdate(req, userId, newUserName, newUserEmail);
		req.flash('success', 'Success! Your profile has been updated.');
		await doAfterSuccessCondition(res, req.user.userEmail, newUserEmail, previousUrl);
	}else if((!newUserName && !newUserEmail)&&(!!userCurrentPassword && !!userNewPassword)){
		await doPasswordUpdate(req, userCurrentPassword, userNewPassword);
		req.flash('success', 'Success! Your password has been updated.');
		await doAfterSuccessCondition(res, req.user.userEmail, newUserEmail, previousUrl);
	}else if(!userCurrentPassword && !!userNewPassword){
		req.flash('error', "You forgot to enter your current password! Please enter your current password and click 'Update!' again.");
		await doAfterFailureCondition(res, previousUrl);
	}else if(!!userCurrentPassword && !userNewPassword){
		req.flash('error', "You forgot to enter your new password! Please enter your new password and click 'Update!' again.");
		await doAfterFailureCondition(res, previousUrl);
	}else if((!!newUserName || !!newUserEmail) && (!!userCurrentPassword && !!userNewPassword)){
		await doUserUpdate(req, userId, newUserName, newUserEmail);
		await doPasswordUpdate(req, userCurrentPassword, userNewPassword);
		if(isNewUserNameDifferent(req, newUserName)==false && isNewUserEmailDifferent(req, newUserEmail)==false){
			req.flash('success', 'Success! Your password has been updated.');
		}else{
			req.flash('success', 'Success! Your profile and password have both been updated.');
		}
		await doAfterSuccessCondition(res, currentEmail, newUserEmail, previousUrl);
	};
}));

// Update desktop item location and rotation
router.post('/user/desktop', tryCatch(async(req,res)=>{
	if(isGuestSession(req.session)){
		await runGuestSessionMutation(req, (session)=>{
			updateGuestDesktopItems(session, req.body || {});
		});
		return res.json({ success: true });
	}
	let xPosition=req.body.itemXPosition;
	let yPosition=req.body.itemYPosition;
	let rotation=req.body.itemRotation;
	if(xPosition===null){
		xPosition=0;
	};
	if(yPosition===null){
		yPosition===0;
	};
	const user = await User.findById(req.user._id);
	const itemId = req.body.itemId;
	user.desktopItems[itemId].xPosition=xPosition;
	user.desktopItems[itemId].yPosition=yPosition;
	if(itemId==='calculator'){
		user.desktopItems[itemId].rotation=rotation;
	};
	await user.save();
	res.json({ success: true });
}));

module.exports = router;
