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

The widget is build with the help of [node](https://nodejs.org/), [yarn](https://yarnpkg.com/), [bower](http://bower.io/) and [gulp](http://gulpjs.com/). For a install instruction for node please have a look [here](https://docs.npmjs.com/getting-started/installing-node).

#### Installing bower and gulp

```bash
yarn install -g bower
yarn install -g gulp
```

#### Installing dependencies

```bash
yarn install
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
