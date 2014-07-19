fooforms
========

![Codeship Status](https://www.codeship.io/projects/277fd250-91cd-0131-0d5d-5afe5ff02d17/status)

To ensure all dependencies are installed once repository is pulled down:

npm install (gets all dependencies to get the app up and running)

##Required global dependencies

npm -g i grunt : See http://gruntjs.com/
npm -g i grunt-cli : Allows command line access to grunt. Below is a list of grunt tasks currently available.

##Some grunt tasks available

grunt : Simply starts a file watch task to run tests on changes. Currently does nothing else.
grunt dev : Start the application with nodemon and starts a file watch, running tests on file changes.
grunt skip-test : Same as dev but skips all tests
grunt deploy : for packaging, runs all preprocessors
grunt test : runs some tests. This only runs mocha tests against node code
grunt dbdrop : drop the test database.
grunt dbseed : seed the test database.

##Things that need to be installed globally

npm -g i nodemon : To run application and restart dev server when file changes are made. Is invoked with grunt dev.

npm -g i mocha : For testing

npm -g i yuidocjs : This generates documentation (assuming correct commenting syntax was used. See: http://yui.github.io/yuidoc/). To use, run yuidoc . from root of project.

SASS also needs to be installed. Ruby must be installed to use SASS.
Install ruby and use GEM: gem install sass

UI Testing

npm -g i protractor
webdriver-manager update

May have forgot a few. Will update as I remember them.

##npm script available

npm test : runs frontend unit tests using karma and jasmine
npm run protractor : runs the end to end tests
