import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Schedule = React.lazy(() => import('./views/Manage/Schedule'));
const Student = React.lazy(() => import('./views/Manage/Student'));
const StudentDetail = React.lazy(() => import('./views/Manage/StudentDetail'));
const Teacher = React.lazy(() => import('./views/Manage/Teacher'));
const TeacherDetail = React.lazy(() => import('./views/Manage/TeacherDetail'));
const Progress = React.lazy(() => import('./views/Manage/Progress'));
const LocationDetail = React.lazy(() => import('./views/Manage/LocationDetail'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: '主页' },
  { path: '/dashboard', name: '主页', component: Dashboard },
  { path: '/manage/schedule', exact: true, name: '课程安排', component: Schedule},
  { path: '/manage/student', exact: true, name: '学生列表', component: Student},
  { path: '/manage/student/detail/:id', name: '学生个人信息', component: StudentDetail },
  { path: '/manage/teacher', exact: true, name: '教师列表', component: Teacher},
  { path: '/manage/teacher/detail/:id', name: '教师个人信息', component: TeacherDetail },
  { path: '/manage/progress', exact: true, name: '课程进度', component: Progress },
  { path: '/manage/location/detail/:id', name: 'LocationDetail', component: LocationDetail },
];

export default routes;
