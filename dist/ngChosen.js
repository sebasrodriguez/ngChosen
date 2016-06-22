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
                onChange: "&",
                onMaxSelected: "&",
                noResultsText: "@",
                selectText: "@",
                datasource: "=",
                placeholder: "@",
                allowSingleDeselect: "@",
                disableSearch: "@",
                enableSplitWordSearch: "&",
                maxSelectedOptions: "=",
                ngModel: "=",
                ngDisabled: "="
            };
            this.link = function (scope, element, attributes, ngModelCtrl) {
                var elem = element;
                var options = {
                    placeholder_text_multiple: scope.selectText,
                    placeholder_text_single: scope.selectText,
                    no_results_text: scope.noResultsText,
                    allow_single_deselect: scope.allowSingleDeselect,
                    disable_search: scope.disableSearch,
                    enable_split_word_search: scope.enableSplitWordSearch(),
                    max_selected_options: scope.maxSelectedOptions
                };
                var ngDisabledWatch;
                var ngModelWatch;
                var datasourceWatch;
                elem.addClass("ng-chosen").chosen(options);
                _this.configureEvents(elem, scope);
                if (elem.attr("datasource") !== undefined) {
                    datasourceWatch = scope.$watchCollection("datasource", function (newValue, oldValue) {
                        if (angular.isUndefined(newValue)) {
                            _this.updateState(elem, true, true, true);
                        }
                        else if (_this.isEmpty(newValue)) {
                            _this.updateState(elem, false, true, true);
                        }
                        else {
                            _this.updateState(elem, false, (!angular.isUndefined(scope.ngDisabled) && scope.ngDisable), false);
                        }
                    });
                }
                else {
                    _this.updateState(elem, false, (!angular.isUndefined(scope.ngDisabled) && scope.ngDisable), false);
                }
                if (scope.ngDisabled !== undefined) {
                    ngDisabledWatch = scope.$watch("ngDisabled", function (newValue, oldValue) {
                        if (!angular.isUndefined(newValue) && newValue !== oldValue) {
                            _this.updateState(elem, false, newValue, false);
                        }
                    }, true);
                }
                if (scope.ngModel !== undefined) {
                    ngModelWatch = scope.$watch("ngModel", function (newValue, oldValue) {
                        if (!angular.isUndefined(newValue) && newValue !== oldValue) {
                            _this.triggerUpdate(elem);
                        }
                    }, true);
                }
                scope.$on("$destroy", function () {
                    if (ngDisabledWatch) {
                        ngDisabledWatch();
                    }
                    if (ngModelWatch) {
                        ngModelWatch();
                    }
                    if (datasourceWatch) {
                        datasourceWatch();
                    }
                });
                attributes.$observe("selectText", function (newValue) {
                    _this.updatePlaceholder(elem, newValue);
                    _this.triggerUpdate(elem);
                });
                if (ngModelCtrl) {
                    var origRender = ngModelCtrl.$render;
                    ngModelCtrl.$render = function () {
                        origRender();
                        _this.triggerUpdate(elem);
                    };
                    if (attributes.multiple) {
                        scope.$watch(function () {
                            ngModelCtrl.$viewValue;
                        }, ngModelCtrl.$render, true);
                    }
                }
            };
        }
        AngularChosenDirective.prototype.updateState = function (element, loading, disabled, showNoResultsText) {
            element.toggleClass("loading", loading).attr("disabled", disabled);
            var selectText = element.attr("select-text");
            var noResultsText = element.attr("no-results-text");
            this.updatePlaceholder(element, showNoResultsText ? noResultsText : selectText);
            this.triggerUpdate(element);
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
        AngularChosenDirective.prototype.triggerUpdate = function (element) {
            if (element) {
                element.trigger("chosen:updated");
            }
        };
        AngularChosenDirective.prototype.updatePlaceholder = function (element, text) {
            element.attr("data-placeholder", text);
        };
        AngularChosenDirective.prototype.configureEvents = function (element, scope) {
            element.chosen().change(function () {
                if (scope.onChange) {
                    scope.onChange();
                }
            });
            element.chosen().on("chosen:maxselected", function () {
                if (scope.onMaxSelected) {
                    scope.onMaxSelected();
                }
            });
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
