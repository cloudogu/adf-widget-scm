

'use strict';

angular.module('adf.widget.scm')
  .controller('MarkdownPreviewController', function(repository,fileContent){
    var vm = this;
    vm.repository = repository;
    vm.fileContent = fileContent;
  });
