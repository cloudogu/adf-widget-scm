

'use strict';

angular.module('adf.widget.scm')
  .controller('MarkdownPreviewEditController', function(repositories){
    var vm = this;
    vm.repositories = repositories;
    vm.selected = repositories[1];
  });
