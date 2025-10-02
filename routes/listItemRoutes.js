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
	createGuestItem,
	updateGuestItem,
	deleteGuestItem,
	getGuestItemById,
	runGuestSessionMutation
} = require('../utilities/guestMode');

// Create a new list item
router.post('/list/:listId', isLoggedIn, tryCatch(async(req,res)=>{
	const listId = req.params.listId;
	if(isGuestSession(req.session)){
		const created = await runGuestSessionMutation(req, (session)=>{
			return createGuestItem(session, listId, req.body || {});
		});
		if(!created){
			req.flash('error', `Sorry! That list doesn't exist.`);
			return res.redirect('/lists');
		}
		return res.redirect(`/list/${listId}`);
	}
	const newListItem = {
		itemText: req.body.toDoListItemText,
		itemDueDate: req.body.toDoListItemDueDate,
		itemPriority: req.body.toDoListItemPriorityLevel,
		itemOwner: req.body.toDoListItemOwner
	};
	const newListItemAdded = await new ToDoListItem(newListItem);
	await newListItemAdded.save();
	res.redirect(`/list/${listId}`);
}));

// Edit a list item
router.post('/list/edit/:listItemId', isLoggedIn, tryCatch(async(req,res)=>{
	if(Object.keys(req.body).length===0){
		req.body.toDoListItemIsCompleted=false;
	};
	const listItemId = req.params.listItemId;
	if(isGuestSession(req.session)){
		const updated = await runGuestSessionMutation(req, (session)=>{
			return updateGuestItem(session, listItemId, req.body || {});
		});
		if(!updated){
			req.flash('error', `Sorry! That list item doesn't exist.`);
			return res.redirect('/lists');
		}
		return res.redirect(`/list/${updated.itemOwner}`);
	}
	const listItem = await ToDoListItem.findById(`${listItemId}`);
	const updatedListItem = {
		itemText: req.body.toDoListItemText,
		itemDueDate: req.body.toDoListItemDueDate,
		itemPriority: req.body.toDoListItemPriorityLevel,
		itemIsCompleted: req.body.toDoListItemIsCompleted,
		itemOwner: req.body.toDoListItemOwner
	};
	const updatedListItemAdded = await listItem.updateOne(updatedListItem);
	res.redirect(`/list/${listItem.itemOwner}`);
}));

// Delete a list item
router.post('/list/delete/:listItemId', isLoggedIn, tryCatch(async(req,res)=>{
	const listItemId = req.params.listItemId;
	if(isGuestSession(req.session)){
		const result = await runGuestSessionMutation(req, (session)=>{
			const currentItem = getGuestItemById(session, listItemId);
			const ownerId = currentItem ? currentItem.itemOwner : null;
			const removed = deleteGuestItem(session, listItemId);
			return { owner: ownerId, deleted: removed };
		});
		const owner = result ? result.owner : null;
		if(!owner){
			req.flash('error', `Sorry! That list item doesn't exist.`);
			return res.redirect('/lists');
		}
		return res.redirect(`/list/${owner}`);
	}
	const listItem = await ToDoListItem.findByIdAndDelete(`${listItemId}`);
	res.redirect(`/list/${listItem.itemOwner}`);
}));

module.exports = router;
