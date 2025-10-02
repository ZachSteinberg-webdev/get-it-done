const { randomUUID } = require('crypto');
const ToDoList = require('../models/to-do-list-model');
const ToDoListItem = require('../models/to-do-list-item-model');

const guestSessionQueues = new Map();

const waitForGuestQueue = async(req)=>{
	if(!req || !req.sessionID){
		return;
	}
	const pending = guestSessionQueues.get(req.sessionID);
	if(pending){
		try{
			await pending.catch(()=>{});
		}finally{/* no-op */}
	}
};

const GUEST_USER_ID = 'guest-user';
const DEFAULT_USER_NAME = 'Guest User';
const DEFAULT_LIST_NAME = 'Untitled list';
const DEFAULT_ITEM_TEXT = 'Untitled item';
const LOCAL_STORAGE_KEYS = Object.freeze({
	root: 'guestModeData'
});

const DEFAULT_DESKTOP_ITEMS = Object.freeze({
	calculator: { xPosition: 0, yPosition: 0, rotation: -10 },
	stainRing: { xPosition: 0, yPosition: 0 },
	coffeeCup: { xPosition: 0, yPosition: 0 },
	pen: { xPosition: 0, yPosition: 0 }
});

const LIST_CATEGORIES = new Set(['personal', 'professional']);
const ITEM_PRIORITIES = new Set(['1', '2', '3', '4', '5']);

const toNumberOrDefault = (value, fallback = 0)=>{
	if(typeof value === 'number' && Number.isFinite(value)){
		return value;
	}
	if(typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))){
		return Number(value);
	}
	return fallback;
};

const sanitizeString = (value, fallback, { maxLength = 150, allowEmpty = false } = {})=>{
	if(typeof value !== 'string'){
		return allowEmpty ? '' : fallback;
	}
	const trimmed = value.trim();
	if(!allowEmpty && trimmed.length === 0){
		return fallback;
	}
	return trimmed.slice(0, maxLength);
};

const sanitizeBoolean = (value)=>{
	if(typeof value === 'boolean'){
		return value;
	}
	if(typeof value === 'string'){
		return ['true', 'on', '1', 'yes'].includes(value.toLowerCase());
	}
	return Boolean(value);
};

const toIsoDateString = (value)=>{
	if(value instanceof Date && !Number.isNaN(value.valueOf())){
		return value.toISOString();
	}
	if(typeof value === 'string'){
		const parsed = new Date(value);
		if(!Number.isNaN(parsed.valueOf())){
			return parsed.toISOString();
		}
	}
	return new Date().toISOString();
};

const toDate = (value)=>{
	const parsed = new Date(value);
	if(Number.isNaN(parsed.valueOf())){
		return new Date();
	}
	return parsed;
};

const normalizeDesktopItems = (desktopItems = {})=>{
	const normalized = { ...DEFAULT_DESKTOP_ITEMS };
	for(const [key, defaults] of Object.entries(DEFAULT_DESKTOP_ITEMS)){
		const source = desktopItems[key] || {};
		const cleaned = {};
		for(const subKey of Object.keys(defaults)){
			cleaned[subKey] = toNumberOrDefault(source[subKey], defaults[subKey]);
		}
		normalized[key] = cleaned;
	}
	return normalized;
};

const buildGuestUser = (rawUser = {})=>({
	_id: GUEST_USER_ID,
	userName: sanitizeString(rawUser.userName, DEFAULT_USER_NAME, { maxLength: 100, allowEmpty: false }),
	userEmail: null,
	desktopItems: normalizeDesktopItems(rawUser.desktopItems)
});

const sanitizeList = (rawList = {}, ownerId)=>{
	const listOwner = ownerId || GUEST_USER_ID;
	const listName = sanitizeString(rawList.listName ?? rawList.toDoListsListNameText, DEFAULT_LIST_NAME, { maxLength: 100, allowEmpty: false });
	const listCategoryRaw = rawList.listCategory ?? rawList.toDoListsListCategory;
	const listCategory = LIST_CATEGORIES.has((listCategoryRaw || '').toLowerCase()) ? listCategoryRaw.toLowerCase() : 'personal';
	return {
		_id: typeof rawList._id === 'string' && rawList._id.trim() ? rawList._id.trim() : randomUUID(),
		listName,
		listCategory,
		listOwner,
		listCreationDate: toIsoDateString(rawList.listCreationDate)
	};
};

const sanitizeItem = (rawItem = {}, listIds)=>{
	const owner = typeof rawItem.itemOwner === 'string' && rawItem.itemOwner.trim() ? rawItem.itemOwner.trim() : null;
	if(!owner || (Array.isArray(listIds) && !listIds.includes(owner))){
		return null;
	}
	const itemText = sanitizeString(rawItem.itemText ?? rawItem.toDoListItemText, DEFAULT_ITEM_TEXT, { maxLength: 150, allowEmpty: false });
	const itemPriorityRaw = rawItem.itemPriority ?? rawItem.toDoListItemPriorityLevel;
	const itemPriority = ITEM_PRIORITIES.has(String(itemPriorityRaw)) ? String(itemPriorityRaw) : '3';
	const itemDueDate = toIsoDateString(rawItem.itemDueDate ?? rawItem.toDoListItemDueDate);
	const itemIsCompleted = sanitizeBoolean(rawItem.itemIsCompleted ?? rawItem.toDoListItemIsCompleted);
	return {
		_id: typeof rawItem._id === 'string' && rawItem._id.trim() ? rawItem._id.trim() : randomUUID(),
		itemText,
		itemPriority,
		itemDueDate,
		itemIsCompleted,
		itemOwner: owner
	};
};

const parseGuestPayload = (payload = {})=>{
	const user = buildGuestUser(payload.user);
	const listsSource = Array.isArray(payload.lists) ? payload.lists : [];
	const lists = listsSource.map((list)=>sanitizeList(list, user._id));
	const listIds = lists.map((list)=>list._id);
	const itemsSource = Array.isArray(payload.items) ? payload.items : [];
	const items = itemsSource.map((item)=>sanitizeItem(item, listIds)).filter(Boolean);
	return {
		user,
		lists,
		items,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
};

const ensureGuestSession = (session)=>{
	if(!session.guest || !session.isGuest){
		session.isGuest = true;
		session.guest = parseGuestPayload({});
		touchGuestSession(session);
	}
};

const initializeGuestSession = (session, payload = {})=>{
	const parsed = parseGuestPayload(payload);
	session.isGuest = true;
	session.guest = parsed;
	touchGuestSession(session);
	return session.guest;
};

const touchGuestSession = (session)=>{
	if(session?.guest){
		session.guest.updatedAt = new Date().toISOString();
		if(typeof session.guestVersion === 'number'){
			session.guestVersion += 1;
		}else{
			session.guestVersion = 1;
		}
	}
};

const getGuestUser = (session)=>{
	ensureGuestSession(session);
	return session.guest.user;
};

const getGuestLists = (session)=>{
	ensureGuestSession(session);
	return session.guest.lists;
};

const getGuestListById = (session, listId)=>{
	ensureGuestSession(session);
	return session.guest.lists.find((list)=>list._id === listId) || null;
};

const getGuestItems = (session, listId)=>{
	ensureGuestSession(session);
	return session.guest.items.filter((item)=>item.itemOwner === listId);
};

const getGuestItemById = (session, itemId)=>{
	ensureGuestSession(session);
	return session.guest.items.find((item)=>item._id === itemId) || null;
};

const createGuestList = (session, body)=>{
	ensureGuestSession(session);
	const ownerId = session.guest.user._id;
	const sanitized = sanitizeList(body, ownerId);
	session.guest.lists.push(sanitized);
	touchGuestSession(session);
	return sanitized;
};

const updateGuestList = (session, listId, body)=>{
	ensureGuestSession(session);
	const target = getGuestListById(session, listId);
	if(!target){
		return null;
	}
	if(body.toDoListsEditListNameText || body.listName){
		target.listName = sanitizeString(body.toDoListsEditListNameText ?? body.listName, target.listName, { maxLength: 100, allowEmpty: false });
	}
	if(body.toDoListsEditListCategory || body.listCategory){
		const maybeCategory = (body.toDoListsEditListCategory ?? body.listCategory ?? '').toLowerCase();
		if(LIST_CATEGORIES.has(maybeCategory)){
			target.listCategory = maybeCategory;
		}
	}
	touchGuestSession(session);
	return target;
};

const deleteGuestList = (session, listId)=>{
	ensureGuestSession(session);
	const beforeLength = session.guest.lists.length;
	session.guest.lists = session.guest.lists.filter((list)=>list._id !== listId);
	session.guest.items = session.guest.items.filter((item)=>item.itemOwner !== listId);
	const deleted = beforeLength !== session.guest.lists.length;
	if(deleted){
		touchGuestSession(session);
	}
	return deleted;
};

const createGuestItem = (session, listId, body)=>{
	ensureGuestSession(session);
	const listExists = !!getGuestListById(session, listId);
	if(!listExists){
		return null;
	}
	const sanitized = sanitizeItem({ ...body, itemOwner: listId }, [listId]);
	if(!sanitized){
		return null;
	}
	session.guest.items.push(sanitized);
	touchGuestSession(session);
	return sanitized;
};

const updateGuestItem = (session, itemId, body)=>{
	ensureGuestSession(session);
	const target = getGuestItemById(session, itemId);
	if(!target){
		return null;
	}
	if(body.toDoListItemText || body.itemText){
		target.itemText = sanitizeString(body.toDoListItemText ?? body.itemText, target.itemText, { maxLength: 150, allowEmpty: false });
	}
	if(body.toDoListItemDueDate || body.itemDueDate){
		target.itemDueDate = toIsoDateString(body.toDoListItemDueDate ?? body.itemDueDate);
	}
	if(body.toDoListItemPriorityLevel || body.itemPriority){
		const maybePriority = String(body.toDoListItemPriorityLevel ?? body.itemPriority);
		if(ITEM_PRIORITIES.has(maybePriority)){
			target.itemPriority = maybePriority;
		}
	}
	if(Object.prototype.hasOwnProperty.call(body, 'toDoListItemIsCompleted') || Object.prototype.hasOwnProperty.call(body, 'itemIsCompleted')){
		target.itemIsCompleted = sanitizeBoolean(body.toDoListItemIsCompleted ?? body.itemIsCompleted);
	}else if(body.toDoListItemIsCompleted === undefined && Object.keys(body).length === 0){
		// Checkbox unchecked path, treat as false
		target.itemIsCompleted = false;
	}
	if(body.toDoListItemOwner || body.itemOwner){
		const owner = (body.toDoListItemOwner ?? body.itemOwner ?? '').trim();
		if(owner && getGuestListById(session, owner)){
			target.itemOwner = owner;
		}
	}
	touchGuestSession(session);
	return target;
};

const deleteGuestItem = (session, itemId)=>{
	ensureGuestSession(session);
	const beforeLength = session.guest.items.length;
	session.guest.items = session.guest.items.filter((item)=>item._id !== itemId);
	const deleted = beforeLength !== session.guest.items.length;
	if(deleted){
		touchGuestSession(session);
	}
	return deleted;
};

const updateGuestDesktopItems = (session, { itemId, itemXPosition, itemYPosition, itemRotation })=>{
	ensureGuestSession(session);
	const user = session.guest.user;
	if(!user.desktopItems[itemId]){
		return null;
	}
	user.desktopItems[itemId].xPosition = toNumberOrDefault(itemXPosition, user.desktopItems[itemId].xPosition);
	user.desktopItems[itemId].yPosition = toNumberOrDefault(itemYPosition, user.desktopItems[itemId].yPosition);
	if(Object.prototype.hasOwnProperty.call(user.desktopItems[itemId], 'rotation')){
		user.desktopItems[itemId].rotation = toNumberOrDefault(itemRotation, user.desktopItems[itemId].rotation);
	}
	touchGuestSession(session);
	return user.desktopItems[itemId];
};

const exportGuestData = (session)=>{
	ensureGuestSession(session);
	return {
		user: session.guest.user,
		lists: session.guest.lists,
		items: session.guest.items,
		updatedAt: session.guest.updatedAt
	};
};

const clearGuestSession = (target)=>{
	if(!target){
		return;
	}
	const session = target.session || target;
	if(session){
		delete session.guest;
		delete session.isGuest;
		if(typeof session.guestVersion === 'number'){
			session.guestVersion += 1;
		}else{
			session.guestVersion = 1;
		}
	}
};

const isGuestSession = (session)=>Boolean(session && session.isGuest);

const migrateGuestDataToUser = async(session, user)=>{
	if(!isGuestSession(session) || !session.guest || !user){
		return { listsMigrated: 0, itemsMigrated: 0 };
	}
	const guestData = session.guest;
	const listIdMap = new Map();
	let listsMigrated = 0;
	let itemsMigrated = 0;
	for(const guestList of guestData.lists){
		const listDocument = new ToDoList({
			listName: guestList.listName,
			listCategory: guestList.listCategory,
			listOwner: user._id,
			listCreationDate: toDate(guestList.listCreationDate)
		});
		await listDocument.save();
		listsMigrated+=1;
		listIdMap.set(guestList._id, listDocument._id);
	}
	for(const guestItem of guestData.items){
		const mappedListId = listIdMap.get(guestItem.itemOwner);
		if(!mappedListId){
			continue;
		}
		const itemDocument = new ToDoListItem({
			itemText: guestItem.itemText,
			itemPriority: guestItem.itemPriority,
			itemDueDate: toDate(guestItem.itemDueDate),
			itemIsCompleted: Boolean(guestItem.itemIsCompleted),
			itemOwner: mappedListId
		});
		await itemDocument.save();
		itemsMigrated+=1;
	}
	if(user.desktopItems){
		user.desktopItems = normalizeDesktopItems(guestData.user.desktopItems);
		await user.save();
	}
	clearGuestSession(session);
	return { listsMigrated, itemsMigrated };
};

const isRecoverableSessionError = (error)=>{
	if(!error){
		return false;
	}
	const message = String(error.message || error).toLowerCase();
	return message.includes('session') && (message.includes('not found') || message.includes('destroyed'));
};

const reloadSession = async(req)=>{
	if(!req?.session || typeof req.session.reload !== 'function'){
		return;
	}
	await new Promise((resolve,reject)=>{
		req.session.reload((err)=>{
			if(err && !isRecoverableSessionError(err)){
				return reject(err);
			}
			return resolve();
		});
	});
};

const saveSession = async(req)=>{
	if(!req?.session || typeof req.session.save !== 'function'){
		return;
	}
	await new Promise((resolve,reject)=>{
		req.session.save((err)=>{
			if(err && !isRecoverableSessionError(err)){
				return reject(err);
			}
			return resolve();
		});
	});
};

const runGuestSessionMutation = async(req, mutator)=>{
	if(typeof mutator !== 'function'){
		throw new Error('Guest session mutation must be a function.');
	}
	if(!req || !req.session || !isGuestSession(req.session)){
		return mutator(req?.session);
	}
	const sessionID = req.sessionID;
	const previous = guestSessionQueues.get(sessionID) || Promise.resolve();
	const current = previous.catch(()=>{}).then(async()=>{
		await reloadSession(req);
		ensureGuestSession(req.session);
		const result = await mutator(req.session);
		await saveSession(req);
		return result;
	});
	guestSessionQueues.set(sessionID, current);
	try{
		return await current;
	}finally{
		if(guestSessionQueues.get(sessionID) === current){
			guestSessionQueues.delete(sessionID);
		}
	}
};

module.exports = {
	GUEST_USER_ID,
	DEFAULT_DESKTOP_ITEMS,
	LOCAL_STORAGE_KEYS,
	isGuestSession,
	initializeGuestSession,
	ensureGuestSession,
	getGuestUser,
	getGuestLists,
	getGuestListById,
	getGuestItems,
	getGuestItemById,
	createGuestList,
	updateGuestList,
	deleteGuestList,
	createGuestItem,
	updateGuestItem,
	deleteGuestItem,
	updateGuestDesktopItems,
	exportGuestData,
	clearGuestSession,
	touchGuestSession,
	migrateGuestDataToUser,
	runGuestSessionMutation,
	waitForGuestQueue
};
