/// <reference path="../typings/angularjs/angular.d.ts" />
var ngChosen;
(function (ngChosen) {
    "use strict";
    var AngularChosenDirective = (function () {
        function AngularChosenDirective() {
            var _this = this;
            this.restrict = "A";
            this.require = "?ngModel";
            this.scope = {
                placeholder: "@",
                noResultsText: "@",
                datasource: "="
            };
            this.link = function (scope, element, attributes, ngModelCtrl) {
                var elem = element;
                elem.addClass("ng-chosen").chosen({
                    no_results_text: scope.noResultsText
                });
                scope.$watchCollection("datasource", function (newValue, oldValue) {
                    if (angular.isUndefined(newValue) || _this.isEmpty(newValue)) {
                        _this.loading(elem, true);
                    }
                    else {
                        _this.loading(elem, false);
                    }
                });
                if (ngModelCtrl) {
                    var origRender = ngModelCtrl.$render;
                    ngModelCtrl.$render = function () {
                        origRender();
                        return _this.updateChosen(elem);
                    };
                    if (attributes.multiple) {
                        scope.$watch(function () {
                            return ngModelCtrl.$viewValue;
                        }, ngModelCtrl.$render, true);
                    }
                }
            };
        }
        AngularChosenDirective.prototype.loading = function (element, loading) {
            element.toggleClass("loading", loading).attr("disabled", loading);
            this.updateChosen(element);
        };
        AngularChosenDirective.prototype.isEmpty = function (object) {
            if (angular.isArray(object)) {
                return object.length === 0;
            }
            else if (angular.isObject(object)) {
                var key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
            }
            return true;
        };
        AngularChosenDirective.prototype.updateChosen = function (element) {
            if (element) {
                element.trigger("chosen:updated");
            }
        };
        return AngularChosenDirective;
    })();
    /*@ngInject*/
    function directive() {
        return new AngularChosenDirective();
    }
    angular.module("ngChosen", []);
    angular.module("ngChosen").directive("ngChosen", directive);
})(ngChosen || (ngChosen = {}));
//# sourceMappingURL=ngChosen.js.map