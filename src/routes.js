import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Group = React.lazy(() => import('./views/Manage/Group'));
const GroupDetail = React.lazy(() => import('./views/Manage/GroupDetail'));
const Ingestion = React.lazy(() => import('./views/Manage/Ingestion'));
const IngestionDetail = React.lazy(() => import('./views/Manage/IngestionDetail'));
const Field = React.lazy(() => import('./views/Manage/Field'));
const FieldDetail = React.lazy(() => import('./views/Manage/FieldDetail'));
const Location = React.lazy(() => import('./views/Manage/Location'));
const LocationDetail = React.lazy(() => import('./views/Manage/LocationDetail'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/manage/group', exact: true, name: 'Group', component: Group},
  { path: '/manage/group/detail/:id', name: 'GroupDetail', component: GroupDetail },
  { path: '/manage/ingestion', exact: true, name: 'Ingestion', component: Ingestion},
  { path: '/manage/ingestion/detail/:id', name: 'IngestionDetail', component: IngestionDetail },
  { path: '/manage/field', exact: true, name: 'Field', component: Field},
  { path: '/manage/field/detail/:id', name: 'FieldDetail', component: FieldDetail },
  { path: '/manage/location', exact: true, name: 'Location', component: Location },
  { path: '/manage/location/detail/:id', name: 'LocationDetail', component: LocationDetail },
];

export default routes;
