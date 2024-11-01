const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	userName:{
		type: String,
		required: [true, `You must provide a username. This can be your real name or an alias. It's your choice!`],
		trim: true
	},
	userEmail:{
		type: String,
		required: [true, `You must provide an email address. It will be used as your username when you log in. Please try again.`],
		trim: true,
		unique: true
	},
	userAccountCreationDate: {
		type: Date,
		required: true,
		default: Date.now
	},
	desktopItems: {
		calculator: {
			xPosition: {
				type: Number,
				default: 0
			},
			yPosition: {
				type: Number,
				default: 0
			},
			rotation: {
				type: Number,
				default: -10
			}
		},
		stainRing: {
			xPosition: {
				type: Number,
				default: 0
			},
			yPosition: {
				type: Number,
				default: 0
			}
		},
		coffeeCup: {
			xPosition: {
				type: Number,
				default: 0
			},
			yPosition: {
				type: Number,
				default: 0
			}
		},
		pen: {
			xPosition: {
				type: Number,
				default: 0
			},
			yPosition: {
				type: Number,
				default: 0
			}
		}
	}
});

const options = {
	usernameField: 'userEmail'
}

userSchema.plugin(passportLocalMongoose, options);

const User = mongoose.model('User', userSchema);

module.exports = User;
