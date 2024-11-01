const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const toDoListItemSchema = new mongoose.Schema({
	itemText: {
		type: String,
		required: [true, `You must provide a brief description of the item you want to add to this to-do list. Please try again.`],
		trim: true,
		max: 150
	},
	itemDueDate: {
		type: Date,
		required: [true, `You must provide a due date in the future for this to-do item. Please try again.`],
		default: (Date.now + 6.048e+8),
		min: Date.now-86400
	},
	itemPriority: {
		type: String,
		lowercase: true,
		required: [true, `You must specify a priority level (1-5) by selecting the appropriate star rating. Please try again.`],
		enum:['1', '2', '3', '4', '5']
	},
	itemIsCompleted: {
		type: Boolean,
		required: true,
		default: false
	},
	itemOwner: {
		type: objectId,
		required: true,
		ref: 'ToDoList'
	}
});

const ToDoListItem = mongoose.model('ToDoListItem', toDoListItemSchema);

module.exports = ToDoListItem;
