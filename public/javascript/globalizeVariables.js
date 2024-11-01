// Globalizes any variables passed in by adding them to the Window object
// Variables to be globalized must be passed in together as an object
const globalizeVariables = function(variables) {
	Object.entries(variables).forEach(([name, value]) => window[name] = value);
};

export {globalizeVariables};
