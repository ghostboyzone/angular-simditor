'use strict';


angular.module('ghostapp', [
	'angular-simditor'
])
.config(['simditorConfig',function(simditorConfig) {
	simditorConfig.placeholder = '这里输入文字...';
}])
.controller('TestCtrl', ['$scope', function($scope){
}]);