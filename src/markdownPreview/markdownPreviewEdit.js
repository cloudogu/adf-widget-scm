'use strict';

angular.module('adf.widget.scm')
  .controller('MarkdownPreviewEditController', function (repositories, SCM, $scope, $sce) {
    var vm = this;
    vm.repositories = repositories;

    // tooltip for project
    $scope.pathToMarkdownFileTooltip = $sce.trustAsHtml('Enter the path relative to the repository root. E.g. <b>docs/File.md</b>.');
    $scope.branchesTooltip = $sce.trustAsHtml('Select a branch.');
    $scope.repositoryTooltip = $sce.trustAsHtml('Select a repository.');

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

  });
