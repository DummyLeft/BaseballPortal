# Sisyphus Portal

## Installation

``` bash
# clone the repo
$ git clone git@github.prod.hulu.com:AudiencePlatform/SisyphusPortal.git my-project

# go into app's directory
$ cd my-project

# install app's dependencies
$ npm install
```

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

### Deploy in development mode

``` bash
# dev server  with hot reload at http://localhost.hulu.com:3000
$ REACT_APP_ENV=staging npm start
```

Navigate to [http://localhost.hulu.com:3000](http://localhost.hulu.com:3000). The app will automatically reload if you change any of the source files.

### Deploy in production mode

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with staging backend
$ REACT_APP_ENV=staging npm run build

# start server using node express
$ BIND_PATH=3000 node app.js
```

Navigate to [http://localhost.hulu.com:3000](http://localhost.hulu.com:3000).

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
Sisyphus#v1.0.0
├── public/          #static files
│   ├── assets/      #assets
│   └── index.html   #html temlpate
│
├── src/             #project root
│   ├── containers/  #container source
│   ├── scss/        #user scss/css source
│   ├── views/       #views source
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── _nav.js      #sidebar config
│   └── routes.js    #routes config
├── app.js           #node entry
└── package.json
```
