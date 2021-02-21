export default {
  items: [
    {
      name: '主页',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      title: true,
      name: '教学管理',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: '课程表',
      url: '/manage/group',
      icon: 'icon-layers',
    },
    {
      name: '学生列表',
      url: '/manage/ingestion',
      icon: 'icon-pencil',
    },
    {
      name: '教师列表',
      url: '/manage/field',
      icon: 'icon-tag',
    },
    {
      name: 'Location',
      url: '/manage/location',
      icon: 'icon-location-pin',
    }
  ],
};
