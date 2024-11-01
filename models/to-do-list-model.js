const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const toDoListSchema = new mongoose.Schema({
	listName:{
		type: String,
		required: [true, 'You must provide a name for your new list. Please try again.'],
		trim: true
	},
	listCategory:{
		type: String,
		required: [true, 'You must select an option from the category drop-down menu. Please try again.'],
		lowercase: true,
		enum:['personal', 'professional']
	},
	listCreationDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	listOwner: {
		type: objectId,
		required: true,
		ref: 'User'
	}
});

const ToDoList = mongoose.model('ToDoList', toDoListSchema);

module.exports = ToDoList;
