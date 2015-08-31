/// <reference path="../typings/angularjs/angular.d.ts" />
module ngChosen {
	"use strict";

	class AngularChosenDirective implements ng.IDirective {
		private updateState(element: any, loading: boolean, disabled: boolean, showNoResultsText: boolean): void {
			element.toggleClass("loading", loading).attr("disabled", disabled);
			var data: any = element.data("chosen");
			if (data) {
				if (showNoResultsText) {
					element.attr("data-placeholder", data.results_none_found);
				} else {
					element.attr("data-placeholder", data.defaultText);
				}
			}
			this.triggerUpdate(element);
		}

		private isEmpty(object: any): boolean {
			if (angular.isArray(object)) {
				return object.length === 0;
			} else if (angular.isObject(object)) {
				var key;
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

        restrict = "A";
        require = "?ngModel";
        scope = {
			placeholder: "@",
			noResultsText: "@",
			datasource: "=",
			allowSingleDeselect: "@",
			disableSearch: "@"
        };
        link = (scope: any, element: any, attributes: any, ngModelCtrl: ng.INgModelController) => {
			var elem = element;
			elem.addClass("ng-chosen").chosen({
				no_results_text: scope.noResultsText,
				allow_single_deselect: scope.allowSingleDeselect,
				disable_search: scope.disableSearch
			});

			// Save default text for later retrieval
			var chosen: any = elem.data("chosen");
			chosen.defaultText = chosen.default_text;
			elem.data("chosen", chosen);

			scope.$watchCollection("datasource", (newValue, oldValue) => {
				if (angular.isUndefined(newValue)) {
					this.updateState(elem, true, true, true);
				} else if (this.isEmpty(newValue)) {
					this.updateState(elem, false, true, true);
				} else {
					this.updateState(elem, false, false, false);
				}
			});

			if (ngModelCtrl) {
				var origRender = ngModelCtrl.$render;
				ngModelCtrl.$render = () => {
					origRender();
					this.triggerUpdate(elem);
				};
				if (attributes.multiple) {
					scope.$watch(function() {
						ngModelCtrl.$viewValue;
					}, ngModelCtrl.$render, true);
				}
			}
        }
    }

    /*@ngInject*/
    function directive(): ng.IDirective {
        return new AngularChosenDirective();
    }

    angular.module("ngChosen", []);
    angular.module("ngChosen").directive("ngChosen", directive);
}