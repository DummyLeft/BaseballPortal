export const getISOString = (date) => {
	return date.toISOString();
}

export const getCommonDateFormat = (date) => {
	let dateString = 
			date.getFullYear() + "-" + 
			("0" + (date.getMonth() + 1)).slice(-2) + "-" + 
			("0" + date.getDate()).slice(-2);
	return dateString;
}

export const getZeroClockWithCommonFormat = (date) => {
	let dateString = 
			date.getFullYear() + "-" + 
			("0" + (date.getMonth() + 1)).slice(-2) + "-" + 
			("0" + date.getDate()).slice(-2) + 
			"T00:00:00+08:00";
	return dateString;
}

export const getCommonFormat = (date) => {
	let dateString = 
			date.getUTCFullYear() + "/" + 
			("0" + (date.getUTCMonth() + 1)).slice(-2) + "/" + 
			("0" + date.getUTCDate()).slice(-2) + " " + 
			("0" + date.getUTCHours()).slice(-2) + ":" + 
			("0" + date.getUTCMinutes()).slice(-2) + ":" +
			("0" + date.getUTCSeconds()).slice(-2);
	return dateString;
}

export const ts2Date = (ts) => {
	let date = new Date(parseInt(ts));
	return getCommonFormat(date);
}