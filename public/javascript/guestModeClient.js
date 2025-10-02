export const GUEST_MODE_STORAGE_KEY = 'guestModeData';
export const GUEST_MODE_ALERT_SESSION_KEY = 'guestModeAlertDismissed';

const hasStorage = (type)=>{
	try{
		const storage = window[type];
		if(!storage){
			return false;
		}
		const testKey = '__storage_test__';
		storage.setItem(testKey, testKey);
		storage.removeItem(testKey);
		return true;
	}catch(e){
		return false;
	}
};

export const readGuestData = ()=>{
	if(typeof window === 'undefined' || !hasStorage('localStorage')){
		return null;
	}
	const raw = window.localStorage.getItem(GUEST_MODE_STORAGE_KEY);
	if(!raw){
		return null;
	}
	try{
		return JSON.parse(raw);
	}catch(e){
		return null;
	}
};

export const writeGuestData = (data)=>{
	if(typeof window === 'undefined' || !hasStorage('localStorage')){
		return;
	}
	if(data === null || data === undefined){
		window.localStorage.removeItem(GUEST_MODE_STORAGE_KEY);
		return;
	}
	window.localStorage.setItem(GUEST_MODE_STORAGE_KEY, JSON.stringify(data));
};

export const markGuestAlertDismissed = ()=>{
	if(typeof window === 'undefined' || !hasStorage('sessionStorage')){
		return;
	}
	window.sessionStorage.setItem(GUEST_MODE_ALERT_SESSION_KEY, 'true');
};

export const isGuestAlertDismissed = ()=>{
	if(typeof window === 'undefined' || !hasStorage('sessionStorage')){
		return false;
	}
	return window.sessionStorage.getItem(GUEST_MODE_ALERT_SESSION_KEY) === 'true';
};
