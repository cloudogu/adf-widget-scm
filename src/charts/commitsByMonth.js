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
  .controller('CommitsByMonthController', function(config, repository, commitsByMonth){
    var vm = this;

    function parseDate(input) {
      var parts = input.split('-');
      return Date.UTC(parseInt(parts[0]), parseInt(parts[1]), 1);
    }

    if (repository && commitsByMonth) {
      var seriesData = [];
      angular.forEach(commitsByMonth.month, function(entry){
        if (entry.value !== '1970-01' ){
          seriesData.push([parseDate(entry.value), entry.count]);
        }
      });

      console.log(seriesData);

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
  });
