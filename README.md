# ADF SCM-Manager Widgets

![SCM-Manager Logo](http://download.scm-manager.org/images/logo/scm-manager_logo.jpg)

SCM-Manager widgets for the [angular-dashboard-framework](https://github.com/sdorra/angular-dashboard-framework). The following SCM-Manager widgets are available:

* Pie chart for commit count by author
* Line chart for commit count by month
* Line chart for the last 50 commits
* Table with last 10 commits

The SCM-Manager rest endpoint must be configured with an angular constant e.g.:

```javascript
angular.constant('scmEndpoint', '/api/scm/');
```

The endpoint should be an proxy server which handles cors and authentication for the widgets.

## Build

The widget is build with the help of [node](https://nodejs.org/), [npm](https://www.npmjs.com/), [bower](http://bower.io/) and [gulp](http://gulpjs.com/). For a install instruction for node and npm, please have a look [here](https://docs.npmjs.com/getting-started/installing-node).

#### Installing bower and gulp

```bash
npm install -g bower
npm install -g gulp
```

#### Installing dependencies

```bash
npm install
bower install
```

#### Build

```bash
gulp
```

The compiled and optimized files can be found in the dist directory.

#### Other build goals

Each goal can be used as parameter for the gulp command.

* *clean*: removes the dist folder
* *lint*: checks css and javascript files for common errors
* *serve*: starts an webserver to test the widget

## Usage

Include the script in your index.html and be sure it is loaded after [angular](https://angularjs.org/) and after the [angular-dashboard-framework](https://github.com/sdorra/angular-dashboard-framework).

```html
<script type="text/javascript" src="bower_components/highcharts/adapters/standalone-framework.src.js"></script>
<script type="text/javascript" src="bower_components/highcharts/highcharts.js"></script>
<script type="text/javascript" src="bower_components/highcharts-ng/dist/highcharts-ng.js"></script>
<script type="text/javascript" src="bower_components/adf-widget-scm/dist/adf-widget-scm.min.js"></script>
```

Define a dependency for the module:

```javascript
angular.module('sample', ['adf', 'adf.widget.scm']);
```

### Development

* Build a base64 hash from username:password and put it into the `DEV_BASIC64_AUTH` constant in `src/service.js`.
* In the `sample/index.html` set the constant `scmEndpoint` to whereever your SCM runs.
* run `gulp serve`
* run `google-chrome --disable-web-security --user-data-dir=~/chromeTemp`

A new google-chrome window should appear and if everything is configured correctly the local development server can reach out to scm, 
thus its widgets load data.

