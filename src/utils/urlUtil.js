function getBasicUrl() {
	// return `http://sisyphus.las.${process.env.REACT_APP_ENV}.hulu.com/`;
	return 'http://localhost:8080/';
}

export const getAllStudents = () => {
	return getBasicUrl() + 'student/all';
}

export const getOverallCount = () => {
	return getBasicUrl() + 'ingestion/overall_count';
}

export const getAllGroups = () => {
	return getBasicUrl() + 'ingestion_group/all';
}

export const getGroupById = (ingestion_group_id) => {
	return getBasicUrl() + 'ingestion_group/' + ingestion_group_id;
}

export const getAllIngestions = () => {
	return getBasicUrl() + 'ingestion/all';
}

export const getIngestionById = (ingestion_id) => {
	return getBasicUrl() + 'ingestion/' + ingestion_id;
}

export const getIngestionListByGroupId = (ingestion_group_id) => {
	return getBasicUrl() + 'ingestion_group/' + ingestion_group_id + '/ingestions';
}

export const getIngestionRunList = (ingestion_id=null, limit=null, order='desc', status='all', timestamp=null) => {
	let conditions = '?' + 
		(ingestion_id == null ? '' : ('ingestion_id=' + ingestion_id + '&')) + 
		(limit == null ? '' : ('limit=' + limit + '&')) + 
		(order == null ? '' : ('order=' + order + '&')) + 
		(status == null ? '' : ('status=' + status + '&')) + 
		(timestamp == null ? '' : ('timestamp=' + timestamp + '&'));

	return getBasicUrl() + 'ingestion_run/list' + conditions;
}

export const getRecentIngestionUpdateCount = (hour=24) => {
	return getBasicUrl() + 'ingestion_run/latest_ingestion_update_count?hour=' + hour;
}

export const getAllFields = () => {
	return getBasicUrl() + 'field/all';
}

export const getFieldById = (field_id) => {
	return getBasicUrl() + 'field/' + field_id;
}

export const getFieldUpdateList = (field_id, limit=null, order='desc', timestamp=null) => {
	let conditions = '?' + 
		(limit == null ? '' : ('limit=' + limit + '&')) + 
		(order == null ? '' : ('order=' + order + '&')) + 
		(timestamp == null ? '' : ('timestamp=' + timestamp + '&'));

	return getBasicUrl() + 'field_updates/' + field_id + '/list' + conditions;
}

export const getAllLocations = () => {
	return getBasicUrl() + 'location/all';
}

export const getLocationById = (location_id) => {
	return getBasicUrl() + 'location/' + location_id;
}

export const getFieldsByLocation = (location_id) => {
	return getBasicUrl() + 'location/' + location_id + '/fields';
}
