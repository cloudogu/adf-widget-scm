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



angular.module('adf.widget.scm', ['adf.provider', 'chart.js', 'ngSanitize', 'btford.markdown'])
  .config(["dashboardProvider", function (dashboardProvider) {

    // category for widget add dialog
    var category = 'SCM-Manager';

    var edit = {
      templateUrl: '{widgetsPath}/scm/src/edit/edit.html',
      controller: 'ScmEditController',
      controllerAs: 'vm',
      resolve: {
        /** @ngInject **/
        repositories: ["SCM", function (SCM) {
          return SCM.getRepositories();
        }]
      }
    };

    var resolveRepository = function (SCM, config) {
      var result = null;
      if (config.repository) {
        result = SCM.getRepository(config.repository);
      }
      return result;
    };
    resolveRepository.$inject = ["SCM", "config"];

    dashboardProvider
      .widget('scm-commits-by-author', {
        title: 'SCM Commits By Author',
        description: 'Displays pie chart for commit count by author',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/charts/pie-chart.html',
        controller: 'CommitsByAuthorController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commitsByAuthor: ["SCM", "config", function (SCM, config) {
            var result = null;
            if (config.repository) {
              result = SCM.getCommitsByAuthor(config.repository);
            }
            return result;
          }]
        },
        edit: edit
      })
      .widget('scm-commits-by-month', {
        title: 'SCM Commits By Month',
        description: 'Displays line chart for commit count by month',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/charts/line-chart.html',
        controller: 'CommitsByMonthController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commitsByMonth: ["SCM", "config", function (SCM, config) {
            var result = null;
            if (config.repository) {
              result = SCM.getCommitsByMonth(config.repository);
            }
            return result;
          }]
        },
        edit: edit
      })
      .widget('scm-commits-last-commits', {
        title: 'SCM Last Commit Chart',
        description: 'Displays line chart for the last 50 commits',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/charts/line-chart.html',
        controller: 'LastCommitsController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commits: ["SCM", "config", function (SCM, config) {
            var result = null;
            if (config.repository) {
              result = SCM.getCommits(config.repository, 50);
            }
            return result;
          }]
        },
        edit: edit
      })
      .widget('scm-commits', {
        title: 'SCM Commits',
        description: 'Displays last commits',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/commits/view.html',
        controller: 'CommitsController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commits: ["SCM", "config", function (SCM, config) {
            var result = null;
            if (config.repository) {
              result = SCM.getCommits(config.repository, 10);
            }
            return result;
          }]
        },
        edit: edit
      })
       .widget('scm-activities', {
        title: 'SCM Activities',
        description: 'SCM Activities for all repositories',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/activities/activityView.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          activities: ["SCM", function(SCM){
            var result = null;
            result = SCM.getActivities();
            return result;
         }]
     }})
      .widget('scm-markdown-content', {
        title: 'SCM Markdown Content',
        description: 'Displays a Markdown Content Preview',
        category: category,
        templateUrl: '{widgetsPath}/scm/src/markdownPreview/view.html',
        controller: 'MarkdownPreviewController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          fileContent: ["SCM", "config", function (SCM, config) {
            var result = null;
            if (config.repository && config.path) {
              result = SCM.getFileContent(config.repository, config.path);
            }
            return result;
          }]
        },
        edit: {
          templateUrl: '{widgetsPath}/scm/src/markdownPreview/edit.html',
          controller: 'MarkdownPreviewEditController',
          controllerAs: 'vm',
          resolve: {
            /** @ngInject **/
            repositories: ["SCM", function (SCM) {
              return SCM.getRepositories();
            }]
          }
        }
      });
  }]);

angular.module("adf.widget.scm").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/scm/src/activities/activityView.html","<div><div ng-if=!vm.activities class=\"alert alert-info\">There are no activities for your available repositories.</div><div ng-if=\"vm.status == 404 || vm.status == 500\" class=\"alert alert-danger\"><b>Error {{vm.status}}:</b> The endpoint could not be reached, this could mean that the activity plugin is not installed.</div><div ng-if=vm.activities><ul class=media-list><li class=media ng-repeat=\"activity in vm.activities\"><div ng-if=vm.gravatarHash(activity) class=media-left><img class=\"media-object img-thumbnail\" ng-src=\"http://www.gravatar.com/avatar/{{vm.gravatarHash(activity)}}?s=64&d=identicon\"></div><div class=media-body><b>{{activity.repoName}}</b><p ng-bind-html=activity.changeset.description></p><small>{{activity.changeset.author.name}}, {{activity.changeset.date | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");
$templateCache.put("{widgetsPath}/scm/src/edit/edit.html","<form role=form><div class=form-group><label for=repository>Repository</label><select name=repository id=repository class=form-control ng-model=config.repository><option ng-repeat=\"repository in vm.repositories | orderBy: \'name\'\" value={{repository.id}}>{{repository.name}}</option></select></div></form>");
$templateCache.put("{widgetsPath}/scm/src/charts/line-chart.html","<div><div class=\"alert alert-info\" ng-if=!vm.chart>Please insert a repository path in the widget configuration</div><div ng-if=\"vm.repository.status == 404 || vm.repository.status == 500\" class=\"alert alert-danger\"><b>Error {{vm.repository.status}}</b> the endpoint could not be reached, this could mean that the selected repository does not exist or that the statistics plugin is not installed</div><div ng-if=vm.chart><canvas id=line class=\"chart chart-line\" chart-data=vm.chart.data chart-labels=vm.chart.labels chart-series=vm.chart.series chart-options=vm.chart.options></canvas></div></div>");
$templateCache.put("{widgetsPath}/scm/src/charts/pie-chart.html","<div><div class=\"alert alert-info\" ng-if=!vm.chart>Please insert a repository path in the widget configuration</div><div ng-if=\"vm.repository.status == 404 || vm.repository.status == 500\" class=\"alert alert-danger\"><b>Error {{vm.repository.status}}</b> the endpoint could not be reached, this could mean that the selected repository does not exist or that the statistics plugin is not installed</div><div ng-if=vm.chart><canvas id=pie class=\"chart chart-pie\" chart-legend=true chart-data=vm.chart.data chart-labels=vm.chart.labels chart-options=vm.chart.options></canvas></div></div>");
$templateCache.put("{widgetsPath}/scm/src/markdownPreview/edit.html","<form role=form><div class=form-group><p><label for=repository>Repository</label><select name=repository id=repository class=form-control ng-model=config.repository ng-init=vm.getBranchesByRepositoryId(config.repository) ng-change=vm.getBranchesByRepositoryId(config.repository)><option ng-repeat=\"repository in vm.repositories | orderBy: \'name\'\" value={{repository.id}}>{{repository.name}}</option></select></p><p ng-if=vm.branches><label for=branch>Branch</label><select name=branch id=branch class=form-control ng-model=config.branch><option ng-repeat=\"branch in vm.branches| orderBy: \'name\'\" value={{branch.id}}>{{branch.name}}</option></select></p><label for=path>Path to Markdown File</label> <input type=text class=form-control id=path ng-model=config.path></div></form>");
$templateCache.put("{widgetsPath}/scm/src/markdownPreview/view.html","<style>\n  div.markdownContent{\n    overflow: auto;\n    width: 100%;\n  }\n</style><div class=\"alert alert-info\" ng-if=!vm.fileContent>Please configure a specific file</div><div ng-if=vm.fileContent btf-markdown=vm.fileContent class=markdownContent></div><div class=\"alert alert-danger\" ng-if=\"vm.fileContent.status == 500 || vm.fileContent.status == 404\"><b>Error {{vm.fileContent.status}}</b> Markdown-File not found. Please check your configuration and try again.</div>");
$templateCache.put("{widgetsPath}/scm/src/commits/view.html","<div><div ng-if=!config.repository class=\"alert alert-info\">Please configure a repository</div><div ng-if=\"vm.repository.status == 404 || vm.repository.status == 500\" class=\"alert alert-danger\"><b>Error {{vm.repository.status}}</b> the endpoint could not be reached, this could mean that the selected repository does not exist</div><div ng-if=config.repository><ul class=media-list><li class=media ng-repeat=\"commit in vm.commits\"><div ng-if=vm.gravatarHash(commit) class=media-left><img class=\"media-object img-thumbnail\" ng-src=\"http://www.gravatar.com/avatar/{{vm.gravatarHash(commit)}}?s=64&d=identicon\"></div><div class=media-body><p ng-bind-html=commit.description></p><small>{{commit.author.name}}, {{commit.date | date: \'yyyy-MM-dd HH:mm\'}}</small></div></li></ul></div></div>");}]);
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
        .controller('CommitsController', ["$sce", "config", "repository", "commits", "SCM", function ($sce, config, repository, commits, SCM) {
            var vm = this;

            vm.repository = repository;

            // allow html descriptions
            angular.forEach(commits, function (commit) {
                commit.description = $sce.trustAsHtml(commit.description);
            });
            vm.commits = commits;

            vm.gravatarHash = function (commit) {
                return SCM.getGravatarHash(commit.properties);
            };
        }]);



angular.module('adf.widget.scm')
  .controller('MarkdownPreviewEditController', ["repositories", "SCM", function (repositories, SCM) {
    var vm = this;
    vm.repositories = repositories;

    vm.getBranchesByRepositoryId = function (repositoryId) {
      if (repositoryId) {
        SCM.getBranchesByRepositoryId(repositoryId).then(function (result) {
          // catch repositories without branch support
          if (result.status == 400)  {
            vm.branches = null;
          }else{
            vm.branches = result.branch;
          }
        });
      }
    };

  }]);



angular.module('adf.widget.scm')
  .controller('MarkdownPreviewController', ["repository", "fileContent", function (repository, fileContent) {
    var vm = this;
    vm.repository = repository;
    vm.fileContent = fileContent;
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
  .controller('LastCommitsController', ["$filter", "config", "repository", "commits", function ($filter, config, repository, commits) {
    var vm = this;
    vm.repository = repository;

    if (repository && commits) {
      vm.chart = createChart();
    }

    function createChart() {
      var options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              display: true,
              position: 'left',
              ticks: {fixedStepSize: 1},
              scaleLabel: {
                display: true,
                labelString: 'Commits'
              }
            }
          ]
        },
        legend: {
          display: true,
          position: "bottom"
        },
        responsive: true
      };
      var chartData = [];
      var chart = {
        labels: [],
        data: [chartData],
        series: ["Commits"],
        class: "chart-line",
        options: options
      };

      var data = {};
      angular.forEach(commits, function (commit) {
        var date = new Date(commit.date);
        var key = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
        var entry = data[key];
        if (entry) {
          entry.count += 1;
        } else {
          data[key] = {
            date: key,
            count: 1
          };
        }
      });

      angular.forEach(data, function (entry) {
        chart.labels.push(entry.date);
        chartData.push(entry.count);
      });

      chart.labels.reverse();
      chartData.reverse();

      return chart;
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
  .controller('CommitsByMonthController', ["config", "repository", "commitsByMonth", function (config, repository, commitsByMonth) {
    var vm = this;
    vm.repository = repository;

    if (commitsByMonth) {
      vm.chart = createChart();
    }

    function createChart() {
      var chartData = [];
      var options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              display: true,
              position: 'left',
              ticks: {fixedStepSize: 1},
              scaleLabel: {
                display: true,
                labelString: 'Commits'
              }
            }
          ]
        },
        legend: {
          display: true,
          position: "bottom"
        },
        responsive: true
      };
      var chart = {
        labels: [],
        data: [chartData],
        series: ["Commits"],
        class: "chart-line",
        options: options
      };

      angular.forEach(commitsByMonth.month, function (month) {
        chart.labels.push(month.value);
        chartData.push(month.count);
      });

      return chart;
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
  .controller('CommitsByAuthorController', ["config", "repository", "commitsByAuthor", function (config, repository, commitsByAuthor) {
    var vm = this;
    vm.repository = repository;

    if (repository && commitsByAuthor) {
      vm.chart = createChart();
    }

    function createChart() {
      var data = {};

      angular.forEach(commitsByAuthor.author, function (entry) {
        var author = entry.value;
        data[author] = entry.count;
      });

      var options = {
        legend: {
          display: true,
          position: "bottom"
        },
        responsive: true
      };

      var chart = {
        labels: [],
        data: [],
        series: ["Commits"],
        class: "chart-pie",
        options: options
      };

      angular.forEach(data, function (count, author) {
        chart.labels.push(author);
        chart.data.push(count);
      });

      return chart;
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
        .controller('ActivitiesController', ["$sce", "activities", "SCM", function ($sce, activities, SCM) {
            var vm = this;
            vm.status = activities.status;

            // allow html descriptions
            angular.forEach(activities.activities, function (activity) {
                activity.changeset.description = $sce.trustAsHtml(activity.changeset.description);
                activity.repoName = activity["repository-name"];
            });

            // handling and displaying only 15 activities
            if (activities.activities) {
                vm.activities = activities.activities.slice(0, 15);
            }

            vm.gravatarHash = function (activity) {
                return SCM.getGravatarHash(activity.changeset.properties);
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
  .factory('SCM', ["scmEndpoint", "$http", function (scmEndpoint, $http) {

    function request(url) {
      return $http.get(scmEndpoint + url).then(function (response) {
        if (response.status == 200) {
          return response.data;
        }
      }, function (error) {
        return error;
      });
    }

    function getRepositories() {
      return request('repositories.json');
    }

    function getRepository(id) {
      return request('repositories/' + id + '.json');
    }

    function getCommitsByAuthor(id) {
      return request('plugins/statistic/' + id + '/commits-per-author.json');
    }

    function getCommitsByMonth(id) {
      return request('plugins/statistic/' + id + '/commits-per-month.json');
    }

    function getCommits(id, limit) {
      return request('repositories/' + id + '/changesets.json?limit=' + limit).then(function (data) {
        return data.changesets;
      });
    }


    function getActivities(){
      return request('activity.json');
  }

    function getFileContent(id, filePath) {
      return request('repositories/' + id + '/content?path=' + filePath);
    }

    function getBranchesByRepositoryId(id) {
      return request('repositories/' + id + '/branches');
    }

    function getGravatarHash(properties) {
        var hash;
      if (properties){
        for (var i=0; i<properties.length; i++){
          if (properties[0].key === 'gravatar-hash'){
               hash = properties[0].value;
            break;
          }
        }
      }
      return hash;
    }
    
    return {
      getRepositories: getRepositories,
      getRepository: getRepository,
      getCommitsByAuthor: getCommitsByAuthor,
      getCommitsByMonth: getCommitsByMonth,
      getCommits: getCommits,
      getActivities: getActivities,
      getFileContent: getFileContent,
      getBranchesByRepositoryId: getBranchesByRepositoryId,
      getGravatarHash: getGravatarHash
    };
  }]);
})(window);