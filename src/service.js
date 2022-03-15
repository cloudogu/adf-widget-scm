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
  .factory('SCM', function (scmEndpoint, $http) {

    function request(url) {
      return $http.get(scmEndpoint + url).then(function (response) {
        if (response.status === 200) {
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

    function generateUserShorthand(user){
      var shorthand = 'Unk.';
      if (user.name){
        var username = user.name;
        if (username){
          var containsMultipleNames = username.indexOf(' ');
          if (containsMultipleNames > 0){
            var values = username.split(' ');
            // firstname is the string before the first whitespace
            shorthand = values[0].charAt(0);
            // lastname is the string after the last whitespace
            shorthand = shorthand + values[values.length -1].charAt(0);
          }else{
            shorthand = username[0].charAt(0);
          }
        }
      }
      return shorthand.toUpperCase();
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
      generateUserShorthand: generateUserShorthand
    };
  });
