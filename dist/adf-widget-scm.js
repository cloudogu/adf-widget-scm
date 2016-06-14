(function(window, undefined) {'use strict';
/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm', ['adf.provider', 'highcharts-ng'])
  .config(["dashboardProvider", function(dashboardProvider){

    // category for widget add dialog
    var category = 'SCM-Manager';

    var edit = {
      templateUrl: '{widgetsPath}/scm/src/edit/edit.html',
      controller: 'ScmEditController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        repositories: ["SCM", function(SCM){
          return SCM.getRepositories();
        }]
      }
    };

    var resolveRepository = function(SCM, config){
      var result = null;
      if (config.repository){
        result = SCM.getRepository(config.repository);
      }
      return result;
    };
    resolveRepository.$inject = ["SCM", "config"];

    dashboardProvider
      .widget('scm-commits-by-author', {
        title: 'SCM Commits By Author',
        description: 'SCM-Manager pie chart for commit count by author',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/charts/chart.html',
        controller: 'CommitsByAuthorController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commitsByAuthor: ["SCM", "config", function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommitsByAuthor(config.repository);
            }
            return result;
          }]
        },
        edit: edit
      })
      .widget('scm-commits-by-month', {
        title: 'SCM Commits By Month',
        description: 'SCM-Manager line chart for commit count by month',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/charts/chart.html',
        controller: 'CommitsByMonthController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commitsByMonth: ["SCM", "config", function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommitsByMonth(config.repository);
            }
            return result;
          }]
        },
        edit: edit
      })
      .widget('scm-commits-last-commits', {
        title: 'SCM Commits line chart',
        description: 'SCM-Manager line char for the last 50 commits',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/charts/chart.html',
        controller: 'LastCommitsController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commits: ["SCM", "config", function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommits(config.repository, 50);
            }
            return result;
          }]
        },
        edit: edit
      })
      .widget('scm-commits', {
        title: 'SCM Commits',
        description: 'SCM-Manager commits',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/commits/view.html',
        controller: 'CommitsController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commits: ["SCM", "config", function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommits(config.repository, 10);
            }
            return result;
          }]
        },
        edit: edit
      });
  }]);

angular.module("adf.widget.scm").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/scm/src/charts/chart.html","<div><div ng-if=!config.repository class=\"alert alert-info\">Please configure a repository</div><div ng-if=config.repository><highchart config=vm.chartConfig></highchart></div></div>");
$templateCache.put("{widgetsPath}/scm/src/commits/view.html","<div><div ng-if=!config.repository class=\"alert alert-info\">Please configure a repository</div><div ng-if=config.repository><ul class=media-list><li class=media ng-repeat=\"commit in vm.commits\"><div ng-if=vm.gravatarHash(commit) class=media-left><img class=\"media-object img-thumbnail\" ng-src=\"http://www.gravatar.com/avatar/{{vm.gravatarHash(commit)}}?s=64&d=identicon\"></div><div class=media-body><p>{{commit.description}}</p><small>{{commit.author.name}}, {{commit.date | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/scm/src/edit/edit.html","<form role=form><div class=form-group><label for=repository>Repository</label><select name=repository id=repository class=form-control ng-model=config.repository><option ng-repeat=\"repository in vm.repositories | orderBy: \'name\'\" value={{repository.id}}>{{repository.name}}</option></select></div></form>");}]);
/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm')
  .controller('ScmEditController', ["repositories", function(repositories){
    var vm = this;

    vm.repositories = repositories;
  }]);

/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm')
  .controller('CommitsController', ["config", "repository", "commits", function(config, repository, commits){
    var vm = this;

    vm.repository = repository;
    vm.commits = commits;

    vm.gravatarHash = function(commit){
      var hash;
      if (commit.properties){
        for (var i=0; i<commit.properties.length; i++){
          if (commit.properties[0].key === 'gravatar-hash'){
            hash = commit.properties[0].value;
            break;
          }
        }
      }
      return hash;
    };
  }]);

/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm')
  .controller('LastCommitsController', ["config", "repository", "commits", function(config, repository, commits){
    var vm = this;

    if (repository && commits) {

      var data = {};
      angular.forEach(commits, function(commit){
        var date = new Date(commit.date);
        var key = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var entry = data[key];
        if (entry){
          entry.count += 1;
        } else {
          data[key] = {
            count: 1,
            date: Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
          };
        }
      });

      var seriesData = [];
      angular.forEach(data, function(entry){
        seriesData.push([entry.date, entry.count]);
      });

      if (seriesData.length > 0){
        seriesData.sort(function(a, b){
          return a[0] - b[0];
        });
      }

      vm.chartConfig = {
        chart: {
          type: 'spline'
        },
        title: {
          text: repository.name + ' last commits'
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            month: '%Y-%m'
          },
          title: {
            text: 'Month'
          }
        },
        yAxis: {
          title: {
            text: 'Commits'
          },
          min: 0
        },
        series: [{
          name: repository.name,
          data: seriesData
        }]
      };
    }
  }]);

/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm')
  .controller('CommitsByMonthController', ["config", "repository", "commitsByMonth", function(config, repository, commitsByMonth){
    var vm = this;

    function parseDate(input) {
      var parts = input.split('-');
      return Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
    }

    if (repository && commitsByMonth) {
      var seriesData = [];
      angular.forEach(commitsByMonth.month, function(entry){
        if (entry.value !== '1970-01' ){
          seriesData.push([parseDate(entry.value), entry.count]);
        }
      });

      vm.chartConfig = {
        chart: {
          type: 'spline'
        },
        title: {
          text: repository.name + ' commit history'
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            month: '%Y-%m'
          },
          title: {
            text: 'Month'
          }
        },
        yAxis: {
          title: {
            text: 'Commits'
          },
          min: 0
        },
        series: [{
          name: repository.name,
          data: seriesData
        }]
      };
    }
  }]);

/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm')
  .controller('CommitsByAuthorController', ["config", "repository", "commitsByAuthor", function(config, repository, commitsByAuthor){
    var vm = this;

    if (repository && commitsByAuthor) {
      var seriesData = [];
      angular.forEach(commitsByAuthor.author, function(entry){
        seriesData.push({
          name: entry.value,
          y: entry.count
        });
      });

      if (seriesData.length > 0){
        seriesData.sort(function(a, b){
          return b.y - a.y;
        });
        seriesData[0].sliced = true;
        seriesData[0].selected = true;
      }

      vm.chartConfig = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: repository.name
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          type: 'pie',
          name: repository.name,
          data: seriesData
        }]
      };
    }
  }]);

/*
 * The MIT License
 *
 * Copyright (c) 2016, Sebastian Sdorra
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */



angular.module('adf.widget.scm')
  .factory('SCM', ["scmEndpoint", "$http", function(scmEndpoint, $http){
    
    function data(response){
      return response.data;
    }

    function request(url){
      return $http.get(scmEndpoint + url).then(data);
    }

    function getRepositories(){
      return request('repositories.json');
    }

    function getRepository(id){
      return request('repositories/' + id + '.json');
    }

    function getCommitsByAuthor(id){
      return request('plugins/statistic/' + id + '/commits-per-author.json');
    }

    function getCommitsByMonth(id){
      return request('plugins/statistic/' + id + '/commits-per-month.json');
    }

    function getCommits(id, limit){
      return request('repositories/' + id + '/changesets.json?limit=' + limit).then(function(data){
        return data.changesets;
      });
    }

    return {
      getRepositories: getRepositories,
      getRepository: getRepository,
      getCommitsByAuthor: getCommitsByAuthor,
      getCommitsByMonth: getCommitsByMonth,
      getCommits: getCommits
    };
  }]);
})(window);