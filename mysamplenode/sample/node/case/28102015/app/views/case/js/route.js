'use strict';
apps.config(function($routeProvider) {
    $routeProvider
    .when('/case/casetracker/:formId', {
        templateUrl: 'case/view/createCase.ejs',
        controller: 'caseviewController'
    })
    .when('/case/casetrackerlist', {
        templateUrl: 'case/view/caseList.ejs',
        controller: 'caseviewController'
    })
    .when('/case/casetracker/:formId/:customerId', {
        templateUrl: 'case/view/createCase.ejs',
        controller: 'caseviewController'
    })
    .when('/case/caseedit/:formId/:caseId', {
        templateUrl: 'case/view/createCase.ejs',
        controller: 'caseviewController'
    });
    // route for the 404 page
    /*.otherwise({
        templateUrl: 'formbuilder/view/index.ejs',
        controller: 'FromBuilderController'
    });*/
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});