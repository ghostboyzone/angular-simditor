(function() {
    "use strict";
    (function() {
        var ngSimditor = angular.module('angular-simditor', []);
        ngSimditor.constant('simditorConfig', {
        	placeholder: '这里输入文字...',
        	toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment', '|', 'html'],
        	pasteImage: true,
        	defaultImage: '',
        	upload: {
                url: '/upload'
            },
            allowedTags: ['br', 'a', 'img', 'b', 'strong', 'i', 'u', 'font', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'hr', 'div', 'script', 'style']
		});
        ngSimditor.directive('ngSimditor', ['simditorConfig', function(simditorConfig) {
            // Runs during compile
            return {
                // name: '',
                // priority: 1,
                // terminal: true,
                scope: {
                    content: '='
                }, // {} = isolate, true = child, false/undefined = no change
                // controller: function($scope, $element, $attrs, $transclude) {},
                // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
                restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
                template: '<textarea data-autosave="editor-content" autofocus></textarea>',
                // templateUrl: '',
                replace: true,
                // transclude: true,
                // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
                link: function($scope, iElm, iAttrs, controller) {
                    var editor = new Simditor(
                    	angular.extend({textarea: iElm}, simditorConfig)
                	);
                	editor.setValue($scope.content);
                	editor.on('valuechanged blur focus', function(e){
                		if($scope.content != editor.getValue()){
	                		$scope.$apply(function(){
	                			$scope.content = editor.getValue();
	                			// console.log($scope.content);
	                		});
                		}
        		    });
                }
            };
        }]);
    })();
}).call(this);
