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
  .controller('CommitsByMonthController', function (config, repository, commitsByMonth) {
    var vm = this;
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
        }
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
  });
