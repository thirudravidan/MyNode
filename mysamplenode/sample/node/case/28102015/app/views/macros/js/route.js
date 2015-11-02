'use strict';
apps.config(function($routeProvider) {
    $routeProvider
    .when('/getmacro', {
        templateUrl: 'macros/view/macro.ejs',
        // controller: 'userCtrl'
    });
    
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});