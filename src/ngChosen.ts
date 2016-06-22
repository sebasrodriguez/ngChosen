/// <reference path="../typings/angularjs/angular.d.ts" />
namespace ngChosen {
    "use strict";

    class AngularChosenDirective implements ng.IDirective {
        private updateState(element: any, loading: boolean, disabled: boolean, showNoResultsText: boolean): void {
            element.toggleClass("loading", loading).attr("disabled", disabled);

            let selectText = element.attr("select-text");
            let noResultsText = element.attr("no-results-text");
            this.updatePlaceholder(element, showNoResultsText ? noResultsText : selectText);

            this.triggerUpdate(element);
        }

        private isEmpty(object: any): boolean {
            if (angular.isArray(object)) {
                return object.length === 0;
            } else if (angular.isObject(object)) {
                let key;
                for (key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
            }
            return true;
        }

        private triggerUpdate(element: any): void {
            if (element) {
                element.trigger("chosen:updated");
            }
        }

        private updatePlaceholder(element: any, text: string): void {
            element.attr("data-placeholder", text);
        }

        private configureEvents(element: any, scope: any): void {
            element.chosen().change(() => {
                if (scope.onChange) {
                    scope.onChange();
                }
            });

            element.chosen().on("chosen:maxselected", () => {
                if (scope.onMaxSelected) {
                    scope.onMaxSelected();
                }
            });
        }

        restrict = "A";
        require = "?ngModel";
        scope = {
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
        link = (scope: any, element: any, attributes: any, ngModelCtrl: ng.INgModelController) => {
            let elem = element;
            let options = {
                placeholder_text_multiple: scope.selectText,
                placeholder_text_single: scope.selectText,
                no_results_text: scope.noResultsText,
                allow_single_deselect: scope.allowSingleDeselect,
                disable_search: scope.disableSearch,
                enable_split_word_search: scope.enableSplitWordSearch(),
                max_selected_options: scope.maxSelectedOptions
            };
            let ngDisabledWatch;
            let ngModelWatch;
            let datasourceWatch;

            elem.addClass("ng-chosen").chosen(options);
            this.configureEvents(elem, scope);

            if (elem.attr("datasource") !== undefined) {
                datasourceWatch = scope.$watchCollection("datasource", (newValue, oldValue) => {
                    if (angular.isUndefined(newValue)) {
                        this.updateState(elem, true, true, true);
                    } else if (this.isEmpty(newValue)) {
                        this.updateState(elem, false, true, true);
                    } else {
                        this.updateState(elem, false, (!angular.isUndefined(scope.ngDisabled) && scope.ngDisable), false);
                    }
                });
            } else {
                this.updateState(elem, false, (!angular.isUndefined(scope.ngDisabled) && scope.ngDisable), false);
            }

            if (scope.ngDisabled !== undefined) {
                ngDisabledWatch = scope.$watch("ngDisabled", (newValue, oldValue) => {
                    if (!angular.isUndefined(newValue) && newValue !== oldValue) {
                        this.updateState(elem, false, newValue, false);
                    }
                }, true);
            }

            if (scope.ngModel !== undefined) {
                ngModelWatch = scope.$watch("ngModel", (newValue, oldValue) => {
                    if (!angular.isUndefined(newValue) && newValue !== oldValue) {
                        this.triggerUpdate(elem);
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

            attributes.$observe("selectText", (newValue) => {
                this.updatePlaceholder(elem, newValue);
                this.triggerUpdate(elem);
            });

            if (ngModelCtrl) {
                let origRender = ngModelCtrl.$render;
                ngModelCtrl.$render = () => {
                    origRender();
                    this.triggerUpdate(elem);
                };
                if (attributes.multiple) {
                    scope.$watch(function () {
                        ngModelCtrl.$viewValue;
                    }, ngModelCtrl.$render, true);
                }
            }
        };
    }

    /*@ngInject*/
    function directive(): ng.IDirective {
        return new AngularChosenDirective();
    }

    angular.module("ngChosen", []);
    angular.module("ngChosen").directive("ngChosen", directive);
}
