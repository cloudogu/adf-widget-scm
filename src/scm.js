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

'use strict';

angular.module('adf.widget.scm', ['adf.provider', 'highcharts-ng'])
  .config(function(dashboardProvider){

    var edit = {
      templateUrl: '{widgetsPath}/scm/src/edit/edit.html',
      controller: 'ScmEditController',
      controllerAs: 'vm',
      resolve: {
        repositories: function(SCM){
          return SCM.getRepositories();
        }
      }
    };

    var resolveRepository = function(SCM, config){
      var result = null;
      if (config.repository){
        result = SCM.getRepository(config.repository);
      }
      return result;
    };

    dashboardProvider
      .widget('scm-commits-by-author', {
        title: 'SCM Commits By Author',
        description: 'SCM-Manager pie chart for commit count by author',
        templateUrl: '{widgetsPath}/scm/src/charts/chart.html',
        controller: 'CommitsByAuthorController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commitsByAuthor: function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommitsByAuthor(config.repository);
            }
            return result;
          }
        },
        edit: edit
      })
      .widget('scm-commits-by-month', {
        title: 'SCM Commits By Month',
        description: 'SCM-Manager line chart for commit count by month',
        templateUrl: '{widgetsPath}/scm/src/charts/chart.html',
        controller: 'CommitsByMonthController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commitsByMonth: function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommitsByMonth(config.repository);
            }
            return result;
          }
        },
        edit: edit
      })
      .widget('scm-commits-last-commits', {
        title: 'SCM Commits line chart',
        description: 'SCM-Manager line char for the last 50 commits',
        templateUrl: '{widgetsPath}/scm/src/charts/chart.html',
        controller: 'LastCommitsController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commits: function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommits(config.repository, 50);
            }
            return result;
          }
        },
        edit: edit
      })
      .widget('scm-commits', {
        title: 'SCM Commits',
        description: 'SCM-Manager commits',
        templateUrl: '{widgetsPath}/scm/src/commits/view.html',
        controller: 'CommitsController',
        controllerAs: 'vm',
        reload: true,
        resolve: {
          repository: resolveRepository,
          commits: function(SCM, config){
            var result = null;
            if (config.repository){
              result = SCM.getCommits(config.repository, 10);
            }
            return result;
          }
        },
        edit: edit
      });
  });
