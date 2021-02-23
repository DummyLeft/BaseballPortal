function getBasicUrl() {
	return 'http://8.140.119.113:8080/';
	// return 'http://localhost:8080/';
}

export const getOverallCount = () => {
	return getBasicUrl() + 'statics/overall';
}

export const getProgressByDate = (date) => {
	return getBasicUrl() + 'progress/query?date=' + date;
}

export const getProgressByGradeAndSubject = (grade, subject) => {
	return getBasicUrl() + 'progress/query_by_grade_and_subject?grade=' + grade + '&subject=' + subject;
}

export const addProgress = (grade, subject, teacher, date, progress) => {
	return getBasicUrl() + 'progress/add?grade=' + grade + '&subject=' + subject + '&teacher=' + teacher + '&date=' + date + '&progress=' + progress;
}

export const getPerformanceByDate = (date) => {
	return getBasicUrl() + 'class_performance/query?date=' + date;
}

export const getStudentPerformance = (id) => {
	return getBasicUrl() + 'class_performance/query_by_student?student_id=' + id;
}

export const addPerformance = (student, date, teacher, score, comment) => {
	return getBasicUrl() + 'class_performance/add?student_id=' + student + '&date=' + date + '&teacher=' + teacher + '&score=' + score + '&comment=' + comment;
}

export const getAllGradeSchedules = () => {
	return getBasicUrl() + 'schedule/all';
}

export const getAllStudents = () => {
	return getBasicUrl() + 'student/all';
}

export const addStudent = (no, name, birthdate, grade) => {
	return getBasicUrl() + 'student/add?no=' + no + '&name=' + name + '&birthdate=' + birthdate + '&grade=' + grade;
}

export const getStudentById = (id) => {
	return getBasicUrl() + 'student/' + id;
}

export const deleteStudent = (id) => {
	return getBasicUrl() + 'student/delete/' + id;
}

export const changeGrade = (id, grade) => {
	return getBasicUrl() + 'student/change_grade/' + id + '/' + grade;
}

export const getAllTeachers = () => {
	return getBasicUrl() + 'teacher/all';
}

export const addTeacher = (name, type='志愿者') => {
	return getBasicUrl() + 'teacher/add?name=' + name + '&type=' + type;
}

export const getTeacherById = (id) => {
	return getBasicUrl() + 'teacher/' + id;
}

export const enableTeacher = (id) => {
	return getBasicUrl() + 'teacher/enable/' + id;
}

export const disableTeacher = (id) => {
	return getBasicUrl() + 'teacher/disable/' + id;
}

export const deleteTeacher = (id) => {
	return getBasicUrl() + 'teacher/delete/' + id;
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
