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
      name: '课程安排',
      url: '/manage/schedule',
      icon: 'icon-calendar',
    },
    { 
      name: '课程进度',
      url: '/manage/progress',
      icon: 'icon-tag',
    },
    {
      name: '学生列表',
      url: '/manage/student',
      icon: 'icon-people',
    },
    {
      name: '教师列表',
      url: '/manage/teacher',
      icon: 'icon-folder',
    }
  ],
};
