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
  .factory('SCM', function($http){

    var endpoint = '/api/scm/';

    function data(response){
      return response.data;
    }

    function request(url){
      return $http.get(endpoint + url).then(data);
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
  });
