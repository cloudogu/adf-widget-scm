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

angular.module('adf.widget.scm')
  .controller('LastCommitsController', function(config, repository, commits){
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
  });
