// Run this file in a terminal window with "node [relative file path]"
// Currently not working. Seems to be a timing issue
const mongoose = require('mongoose');
const hmsTime = require('../utilities/hmsTime.js');
const objectId = mongoose.Schema.Types.ObjectId;
const User = require('../models/user-model.js');
const ToDoList = require('../models/to-do-list-model');
const ToDoListItem = require('../models/to-do-list-item-model');

mongoose.connect('mongodb://localhost:27017/toDoListApp')
	.then(()=>{console.log(`${hmsTime()}: Mongo connection open.`)})
	.catch(error=>{console.log(`${hmsTime()}: Mongo error: ${error}`)});

const userSeeds = [
	{
		userName: 'Jerry Smith',
		userEmail: 'jerrysmith@example.com',
		userAccountCreationDate: '2023-04-04 09:19:05'
	},
	{
		userName: 'Larry Jones',
		userEmail: 'larryjones@example.com',
		userAccountCreationDate: '2023-03-03 07:14:05'
	},
	{
		userName: 'Harry Brown',
		userEmail: 'harrybrown@example.com',
		userAccountCreationDate: '2022-08-07 12:54:05'
	},
	{
		userName: 'Terry Jenkins',
		userEmail: 'terryjenkins@example.com',
		userAccountCreationDate: '2021-07-21 11:15:05'
	}
];

let allUsers = [];
let toDoListSeeds = [];
let allToDoLists = [];
let toDoListItemSeeds = [];

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

const getAllToDoLists = async()=>{
	allToDoLists = await ToDoList.find();
}

const seedToDoListItems = async()=>{
	await ToDoListItem.deleteMany({})
		.then(res => {
				console.log(res)
		})
		.catch(e => {
				console.log(e)
		})
	await ToDoListItem.insertMany(toDoListItemSeeds)
		.then(res => {
				console.log(res)
		})
		.catch(e => {
				console.log(e)
		})
};

const seedUsers = async()=>{
	await User.deleteMany({})
		.then(res => {
			console.log(res)
	})
		.catch(e => {
			console.log(e)
	});
	await User.insertMany(userSeeds)
			.then(res => {
					console.log(res)
			})
			.catch(e => {
					console.log(e)
			});
}

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

const getToDoListsArrayThenSeedToDoListItems = async()=>{
	await getAllToDoLists();
	toDoListItemSeeds = [
		{
			itemText: 'Feed the cat',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[0]._id
		},
		{
			itemText: 'Walk the dog',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[0]._id
		},
		{
			itemText: 'Cook dinner',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[0]._id
		},
		{
			itemText: 'Get groceries',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[0]._id
		},
		{
			itemText: 'File TPS reports',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[1]._id
		},
		{
			itemText: 'Teach Bob how to file my TPS reports for me',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[1]._id
		},
		{
			itemText: 'Make sure Bob has filed my TPS reports',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[1]._id
		},
		{
			itemText: 'Complain to HR about TPS reports',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[1]._id
		},
		{
			itemText: 'Go for a hike',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[2]._id
		},
		{
			itemText: 'File taxes',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[2]._id
		},
		{
			itemText: 'Return library books',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[2]._id
		},
		{
			itemText: 'Stop at grocery store',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[2]._id
		},
		{
			itemText: 'Update TPS report database',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[3]._id
		},
		{
			itemText: 'Send TPS update to Karen',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[3]._id
		},
		{
			itemText: 'Make sure Karen received TPS report update',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[3]._id
		},
		{
			itemText: 'Complain to HR about TPS reports',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[3]._id
		},
		{
			itemText: 'Mend hole in sweater',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[4]._id
		},
		{
			itemText: 'Take unused clothes donation to thrift store',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[4]._id
		},
		{
			itemText: 'Get oil changed in car',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[4]._id
		},
		{
			itemText: 'Go to local humane society to find a cat to adopt',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[4]._id
		},
		{
			itemText: 'Put together list of all TPS report complaints received',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[5]._id
		},
		{
			itemText: 'Send TPS report complaints list to CEO',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[5]._id
		},
		{
			itemText: 'Make sure CEO received TPS report complaint list',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[5]._id
		},
		{
			itemText: 'Start planning for yearly office holiday party',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[5]._id
		},
		{
			itemText: 'Take work shirts and pants to dry cleaners',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[6]._id
		},
		{
			itemText: 'Post online about dog I found yesterday',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[6]._id
		},
		{
			itemText: 'Get dog food for dog I found yesterday',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[6]._id
		},
		{
			itemText: 'Take dog I found to the veterinarian',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[6]._id
		},
		{
			itemText: 'Look over TPS report complaints list from Harry',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[7]._id
		},
		{
			itemText: 'Schedule a meeting with management to discuss doubling the TPS report requirement',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '4',
			itemIsCompleted: false,
			itemOwner: allToDoLists[7]._id
		},
		{
			itemText: 'Ask Harry to send out email to employees notifying them of new TPS report requirements',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '3',
			itemIsCompleted: false,
			itemOwner: allToDoLists[7]._id
		},
		{
			itemText: 'Talk to management about quelling employee uprising related to new TPS report requirement',
			itemDueDate: '2023-04-13 10:19:05',
			itemPriority: '5',
			itemIsCompleted: false,
			itemOwner: allToDoLists[7]._id
		}
	];
	await seedToDoListItems();
};

const seedUsersListsAndListItems = async()=>{
	await seedUsers();
	await getUsersArrayThenSeedToDoLists();
	await getToDoListsArrayThenSeedToDoListItems();
};

seedUsersListsAndListItems();
