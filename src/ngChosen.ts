/// <reference path="../typings/angularjs/angular.d.ts" />
module ngChosen {
	"use strict";

	class AngularChosenDirective implements ng.IDirective {
		constructor(){
		}

		private loading(element: any, loading:boolean): void {
			element.toggleClass("loading", loading).attr("disabled", loading);
			this.updateChosen(element);
		}

		private isEmpty(object: any): boolean {
			if(angular.isArray(object)) {
				return object.length === 0;
			} else if(angular.isObject(object)) {
				var key;
				for (key in object) {
					if (object.hasOwnProperty(key)) {
						return false;
					}
				}
			}
			return true;
		}

		private updateChosen(element: any): void {
			if(element) {
				element.trigger("chosen:updated");
			}
		}

        restrict = "A";
        require = "?ngModel";
        scope = {
        	placeholder: "@",
        	noResultsText: "@",
        	datasource: "="
        };
        link = (scope: any, element: any, attributes: any, ngModelCtrl: ng.INgModelController) => {
			var elem = element;
			elem.addClass("ng-chosen").chosen({
				no_results_text: scope.noResultsText
			});

			scope.$watchCollection("datasource", (newValue, oldValue) => {
				if(angular.isUndefined(newValue) || this.isEmpty(newValue)){
					this.loading(elem, true);
				} else {
					this.loading(elem, false);
				}
			});

			if (ngModelCtrl) {
				var origRender = ngModelCtrl.$render;
				ngModelCtrl.$render = () => {
					origRender();
					return this.updateChosen(elem);
				};
				if (attributes.multiple) {
					scope.$watch(function() {
						return ngModelCtrl.$viewValue;
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