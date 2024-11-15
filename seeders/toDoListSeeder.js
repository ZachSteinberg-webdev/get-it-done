// Run this file in a terminal window with "node [relative file path]"
// The three seeder files should be run in order of userSeeds.js > toDoListSeeds.js > toDoListItemSeeds.js
// toDoListSeeder.js relies on the "_id" field values generated by userSeeder.js
// toDoListItemSeeder.js relies on the "_id" field values generated by toDoListSeeder.js
const mongoose = require('mongoose');
const hmsTime = require('../utilities/hmsTime.js');
const objectId = mongoose.Schema.Types.ObjectId;
const User = require('../models/user-model');
const ToDoList = require('../models/to-do-list-model');
const ToDoListItem = require('../models/to-do-list-item-model');

mongoose.connect('mongodb://localhost:27017/toDoListApp')
	.then(()=>{console.log(`${hmsTime()}: Mongo connection open.`)})
	.catch(error=>{console.log(`${hmsTime()}: Mongo error: ${error}`)});

let allUsers = [];
let toDoListSeeds = [];

const getAllUsers = async()=>{
	allUsers = await User.find();
}

const seedToDoLists = async()=>{
	await ToDoList.deleteMany({})
		.then(res => {
				console.log(res)
		})
		.catch(e => {
				console.log(e)
		})
	await ToDoList.insertMany(toDoListSeeds)
		.then(res => {
				console.log(res)
		})
		.catch(e => {
				console.log(e)
		})
};

const getUsersArrayThenSeedToDoLists = async()=>{
	await getAllUsers();
	toDoListSeeds = [
		{
			listName: 'Things to get done at home',
			listCategory: 'personal',
			listCreationDate: '2023-04-04 10:19:05',
			listOwner: allUsers[0]._id
		},
		{
			listName: 'Things to get done at work',
			listCategory: 'professional',
			listCreationDate: '2023-04-04 10:21:05',
			listOwner: allUsers[0]._id
		},
		{
			listName: 'Stuff I need to do',
			listCategory: 'personal',
			listCreationDate: '2023-04-04 10:54:05',
			listOwner: allUsers[1]._id
		},
		{
			listName: 'Work stuff',
			listCategory: 'professional',
			listCreationDate: '2023-03-04 12:50:05',
			listOwner: allUsers[1]._id
		},
		{
			listName: 'Items to accomplish',
			listCategory: 'personal',
			listCreationDate: '2023-02-14 11:54:05',
			listOwner: allUsers[2]._id
		},
		{
			listName: 'Work tasks',
			listCategory: 'professional',
			listCreationDate: '2023-01-14 01:34:05',
			listOwner: allUsers[2]._id
		},
		{
			listName: 'Tasks to complete',
			listCategory: 'personal',
			listCreationDate: '2022-01-24 10:24:05',
			listOwner: allUsers[3]._id
		},
		{
			listName: 'Tasks to do at work',
			listCategory: 'professional',
			listCreationDate: '2022-11-24 08:27:05',
			listOwner: allUsers[3]._id
		}
	];
	await seedToDoLists();
}

getUsersArrayThenSeedToDoLists();
