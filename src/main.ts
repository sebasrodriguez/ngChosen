/// <reference path="../typings/angularjs/angular.d.ts" />
module ngChosenExample {
    "use strict";

    angular.module("ngChosenExample", [
        "ngChosen"
    ]);

    export class ExampleController {
        public selectedCountries: Array<any> = [];
        public selectedCountry: any;
        public countries: Array<any>;
        public selectText: string = "Choose a country...";

        static $inject = ["$timeout"];
        constructor(private $timeout: ng.ITimeoutService) {
            this.$timeout(() => {
                this.countries = [{ name: "Uruguay" }, { name: "Argentina" }];
            }, 2000);

            this.$timeout(() => {
                this.selectedCountry = this.countries[0];
                this.selectedCountries.push(this.countries[1]);
            }, 5000);
        }

        public click(): void {
            console.log(this.selectedCountries);
            console.log(this.selectedCountry);
        }
    }

    angular.module("ngChosenExample").controller("ExampleController", ExampleController);
}