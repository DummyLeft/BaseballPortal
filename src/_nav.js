export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      title: true,
      name: 'Manage',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Group',
      url: '/manage/group',
      icon: 'icon-layers',
    },
    {
      name: 'Ingestion',
      url: '/manage/ingestion',
      icon: 'icon-pencil',
    },
    {
      name: 'Field',
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
