'use strict';

angular.module('adf.widget.scm')
  .controller('MarkdownPreviewEditController', function (repositories, SCM, $scope, $sce) {
    const vm = this;
    vm.repositories = repositories;

    // tooltips
    $scope.repositoryTooltip = $sce.trustAsHtml('Select the repository. If none is shown, check your scm configuration.');
    $scope.branchTooltip = $sce.trustAsHtml('Select the branch.');
    $scope.pathToMarkdownTooltip = $sce.trustAsHtml('Add <b>NO</b> leading slash to the file path. The path is <b>case sensitive</b>.');

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
