'use strict';

angular.module('adf.widget.scm')
  .controller('MarkdownPreviewEditController', function (repositories, SCM) {
    var vm = this;
    vm.repositories = repositories;

    vm.getBranchesByRepositoryId = function (repositoryId) {
      if (repositoryId) {
        SCM.getBranchesByRepositoryId(repositoryId).then(function (result) {
          if (result.branch) {
            vm.branches = result.branch;
          }
        });
      }
    };

  });
