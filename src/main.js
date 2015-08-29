/// <reference path="../typings/angularjs/angular.d.ts" />
var ngChosenExample;
(function (ngChosenExample) {
    "use strict";
    angular.module("ngChosenExample", [
        "ngChosen"
    ]);
    var ExampleController = (function () {
        function ExampleController($timeout) {
            var _this = this;
            this.$timeout = $timeout;
            this.selectedCountries = [];
            this.$timeout(function () {
                _this.countries = [{ name: "Uruguay" }, { name: "Argentina" }];
            }, 2000);
            this.$timeout(function () {
                _this.selectedCountry = _this.countries[0];
                _this.selectedCountries.push(_this.countries[1]);
            }, 5000);
        }
        ExampleController.prototype.click = function () {
            console.log(this.selectedCountries);
            console.log(this.selectedCountry);
        };
        ExampleController.$inject = ["$timeout"];
        return ExampleController;
    })();
    ngChosenExample.ExampleController = ExampleController;
    angular.module("ngChosenExample").controller("ExampleController", ExampleController);
})(ngChosenExample || (ngChosenExample = {}));
//# sourceMappingURL=main.js.map