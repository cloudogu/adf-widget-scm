'use strict';

angular.module('adf.widget.scm')
  .controller('MarkdownPreviewEditController', function (repositories, SCM, $scope, $sce) {
    var vm = this;
    vm.repositories = repositories;

    // tooltip for project
    $scope.pathToMarkdownFileTooltip = $sce.trustAsHtml('The path where the Markdown file can be found within the repository (e.g. "docs/File.md").');
    $scope.branchesTooltip = $sce.trustAsHtml('Select the branch where the desired Markdown file can be found.');
    $scope.repositoryTooltip = $sce.trustAsHtml('Select the repository where the desired Markdown file can be found.');


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
