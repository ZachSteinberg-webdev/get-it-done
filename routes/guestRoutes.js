const express = require('express');
const router = express.Router();
const {
	initializeGuestSession,
	exportGuestData,
	isGuestSession,
	touchGuestSession,
	runGuestSessionMutation
} = require('../utilities/guestMode');
const {
	CustomError,
	tryCatch
} = require('../utilities/errorHandling');

router.post('/guest/start', tryCatch(async(req,res)=>{
	const payload = req.body && typeof req.body === 'object' ? req.body : {};
	const guestData = payload.guestData || {};
	await runGuestSessionMutation(req, (session)=>{
		initializeGuestSession(session, guestData);
	});
	if(req.session.clearGuestStorage){
		delete req.session.clearGuestStorage;
	}
	res.json({
		success: true,
		redirect: '/lists'
	});
}));

router.post('/guest/sync', tryCatch(async(req,res)=>{
	if(!isGuestSession(req.session)){
		return res.status(400).json({ success: false, message: 'Guest session not active.' });
	}
	const payload = req.body && typeof req.body === 'object' ? req.body : {};
	const guestData = payload.guestData || {};
	await runGuestSessionMutation(req, (session)=>{
		initializeGuestSession(session, guestData);
	});
	if(req.session.clearGuestStorage){
		delete req.session.clearGuestStorage;
	}
	res.json({ success: true });
}));

router.get('/guest/state', tryCatch(async(req,res)=>{
	if(!isGuestSession(req.session)){
		return res.status(404).json({ success: false, message: 'Guest session not found.' });
	}
	res.json({ success: true, data: exportGuestData(req.session) });
}));

module.exports = router;
