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
	logUserIn,
	isLoggedIn
} = require('../utilities/middleware.js');
const {
	CustomError,
	tryCatch
} = require('../utilities/errorHandling');
const {
	isGuestSession,
	getGuestUser,
	getGuestLists,
	getGuestListById,
	getGuestItems,
	createGuestList,
	updateGuestList,
	deleteGuestList,
	runGuestSessionMutation,
	waitForGuestQueue
} = require('../utilities/guestMode');

// Show a user's to do lists
router.get('/lists', isLoggedIn, tryCatch(async(req,res,next)=>{
	if(isGuestSession(req.session)){
		await waitForGuestQueue(req);
		const user = JSON.parse(JSON.stringify(getGuestUser(req.session)));
		const toDoLists = getGuestLists(req.session).map((list)=>({
			...list,
			listCreationDate: new Date(list.listCreationDate)
		}));
		return res.render('pages/toDoLists', {toDoLists, user});
	}
	const user = req.user;
	const userId = req.user._id;
	const toDoLists = await ToDoList.find({listOwner: userId});
	res.render('pages/toDoLists', {toDoLists, user});
}));

// Show a list
router.get('/list/:listId', isLoggedIn, tryCatch(async(req,res,next)=>{
	const listId = req.params.listId;
	if(isGuestSession(req.session)){
		await waitForGuestQueue(req);
		const list = getGuestListById(req.session, listId);
		if(!list){
			req.flash('error', `Sorry! That list doesn't exist.`);
			return res.redirect('/lists');
		}
		const user = JSON.parse(JSON.stringify(getGuestUser(req.session)));
		const listForView = {
			...list,
			listCreationDate: new Date(list.listCreationDate)
		};
		const listItems = getGuestItems(req.session, listId).map((item)=>({
			...item,
			itemDueDate: new Date(item.itemDueDate)
		}));
		return res.render('pages/toDoList', {listId, list: listForView, listItems, user});
	}
	const list = await ToDoList.findOne({_id: `${listId}`});
	const user = req.user;
	if(true===true){
		const listItems = await ToDoListItem.find({itemOwner: `${listId}`});
		res.render('pages/toDoList', {listId, list, listItems, user});
	}else{
		req.flash('error', `Sorry! That list doesn't exist.`);
		res.redirect('/lists');
	}
}));

// Create a new list
router.post('/lists', isLoggedIn, tryCatch(async(req,res,next)=>{
	if(isGuestSession(req.session)){
		await runGuestSessionMutation(req, (session)=>{
			createGuestList(session, req.body || {});
		});
		return res.redirect('/lists');
	}
	const newList = {
		listName: req.body.toDoListsListNameText,
		listCategory: req.body.toDoListsListCategory,
		listOwner: req.body.toDoListsListOwner
	};
	const newListAdded = await new ToDoList(newList);
	await newListAdded.save();
	res.redirect('/lists');
}));

// Edit a list document
router.post('/lists/edit/:listId', isLoggedIn, tryCatch(async(req,res)=>{
	const listId = req.params.listId;
	if(isGuestSession(req.session)){
		const updated = await runGuestSessionMutation(req, (session)=>{
			return updateGuestList(session, listId, req.body || {});
		});
		if(!updated){
			req.flash('error', `Sorry! That list doesn't exist.`);
		}
		return res.redirect('/lists');
	}
	const list = await ToDoList.findById(`${listId}`);
	const updatedList = {
		listName: req.body.toDoListsEditListNameText,
		listCategory: req.body.toDoListsEditListCategory
	};
	const updatedListAdded = await list.updateOne(updatedList);
	res.redirect('/lists');
}));

// Delete a list document
router.post('/lists/delete/:listId', isLoggedIn, async(req,res)=>{
	const listId = req.params.listId;
	if(isGuestSession(req.session)){
		const deleted = await runGuestSessionMutation(req, (session)=>{
			return deleteGuestList(session, listId);
		});
		if(!deleted){
			req.flash('error', `Sorry! That list doesn't exist.`);
		}
		return res.redirect('/lists');
	}
	const list = await ToDoList.findByIdAndDelete(`${listId}`);
	res.redirect('/lists');
});

module.exports = router;
