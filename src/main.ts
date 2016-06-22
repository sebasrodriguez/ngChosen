/// <reference path="../typings/angularjs/angular.d.ts" />
namespace ngChosenExample {
    "use strict";

    angular.module("ngChosenExample", [
        "ngChosen"
    ]);

    export class ExampleController {
        public selectedCountries: Array<any> = [];
        public selectedCountry: any;
        public countries: Array<any>;
        public selectText: string = "Choose a country...";
        public isDisabled: boolean = true;
        public isVisible: boolean = true;

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

        public maxSelected(): void {
            console.log("max selected");
        }

        public addCountry(): void {
            this.countries.push({ name: Date.now().toString() });
        }

        public toggleDisability(): void {
            this.isDisabled = !this.isDisabled;
            console.log(this.isDisabled);
        }

        public clearCountries(): void {
            this.selectedCountries = [];
            console.log("cleared countries: ", this.selectedCountries);
        }

        public updated(): void {
            console.log("dropdown updated");
        }
    }

    angular.module("ngChosenExample").controller("ExampleController", ExampleController);
}
