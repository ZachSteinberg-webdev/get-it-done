const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const PassportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../models/user-model.js');
const flash = require('connect-flash');
const cookierParser = require('cookie-parser');

const logUserIn = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'});

const getUserFirstName = (req)=>{
	let firstName = "";
	if(req.user.userName.includes(" ")){
		spaceIndex = req.user.userName.indexOf(" ");
		firstName = req.user.userName.slice(0, spaceIndex);
		return firstName;
	}else{
		firstName = req.user.userName;
		return firstName;
	};
};

const isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		req.app.locals.originalUrl = req.originalUrl;
		req.flash('error', `You must be logged in to do that.`);
		res.redirect('/login');
	};
};

// User settings and password change
const doUserUpdate = async(requestObjectArg, userIdArg, newUserNameArg, newUserEmailArg)=>{
	const newUserNameInUserUpdate = newUserNameArg || requestObjectArg.user.userName;
	const newUserEmailInUserUpdate = newUserEmailArg || requestObjectArg.user.userEmail;
	const updatedUserData = {
		userName: newUserNameInUserUpdate,
		userEmail: newUserEmailInUserUpdate
	};
	const updateUser = async(updatedUserDataArg)=>{
		const user = await User.findById(userIdArg);
		await user.updateOne(updatedUserDataArg);
		return;
	};
	await updateUser(updatedUserData);
	return;
};

const isNewUserNameDifferent = (requestObjectArg, newUserNameArg)=>{
	if(requestObjectArg.user.userName == (newUserNameArg || "")){
		return false;
	};
};

const isNewUserEmailDifferent = (requestObjectArg, newUserEmailArg)=>{
	if(requestObjectArg.user.userEmail == (newUserEmailArg || "")){
		return false;
	};
};

const doPasswordUpdate = async(requestObjectArg, userCurrentPasswordArg, userNewPasswordArg)=>{
	await requestObjectArg.user.changePassword(userCurrentPasswordArg, userNewPasswordArg);
	return;
};

const doAfterSuccessCondition = async(responseObjectArg, currentEmailArg, newEmailArg, previousUrlArg)=>{
	if((currentEmailArg==newEmailArg)||(newEmailArg=="")){
		responseObjectArg.redirect(`${previousUrlArg}`);
	}else{
		responseObjectArg.redirect('/login');
	};
};

const doAfterFailureCondition = async(responseObjectArg, previousUrlArg)=>{
	responseObjectArg.redirect(`${previousUrlArg}`);
};

module.exports = {
	logUserIn,
	getUserFirstName,
	isLoggedIn,
	doAfterSuccessCondition,
	doAfterFailureCondition,
	doUserUpdate,
	doPasswordUpdate,
	isNewUserNameDifferent,
	isNewUserEmailDifferent
};
