'use strict';
apps.config(function($routeProvider) {
    $routeProvider
    .when('/admin/userCreate', {
        templateUrl: 'users/view/userCreate.ejs',
        // controller: 'userCtrl'
    })
    .when('/admin/editUser/:userID', {
        templateUrl: 'users/view/userEdit.ejs',
        // controller: 'userCtrl'
    })
    .when('/admin/userlist', {
        templateUrl: 'users/view/userList.ejs',
        // controller: 'userController'
    })
    .when('/admin/adminCreate', {
        templateUrl: 'users/view/adminCreate.ejs',
        // controller: 'userController'
    })
    .when('/customer/customerCreate', {
        templateUrl: 'users/view/customerCreate.ejs',
        controller: 'customerCtrl'
    })
    .when('/customer/editCustomer/:userID', {
        templateUrl: 'users/view/customerEdit.ejs',
        controller: 'customerCtrl'
    })
    .when('/customer/viewCustomer/:userID', {
        templateUrl: 'users/view/customerView.ejs',
        controller: 'customerViewCtrl'
    })
    .when('/customer/customerList', {
        templateUrl: 'users/view/customerList.ejs',
        controller: 'customerCtrl'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});