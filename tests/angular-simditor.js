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
        ngSimditor.directive('ngSimditor', ['$timeout', 'simditorConfig', function($timeout, simditorConfig) {
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

                    var nowContent = '';

                    $scope.$watch('content', function(value, old){
                        if(typeof value !== 'undefined' && value != nowContent){
                            editor.setValue(value);
                        }
                    });

                    editor.on('valuechanged', function(e){
                        if($scope.content != editor.getValue()){
                            $timeout(function(){
                                $scope.content = nowContent = editor.getValue();
                            });
                        }
                    });
                }
            };
        }]);
    })();
}).call(this);
