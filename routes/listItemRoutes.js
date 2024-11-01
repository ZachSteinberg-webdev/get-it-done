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

// Create a new list item
router.post('/list/:listId', isLoggedIn, tryCatch(async(req,res)=>{
	const listId = req.params.listId;
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
	const listItem = await ToDoListItem.findByIdAndDelete(`${listItemId}`);
	res.redirect(`/list/${listItem.itemOwner}`);
}));

module.exports = router;
