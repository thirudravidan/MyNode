
apps.config(function($routeProvider) {
    $routeProvider
    .when('/create-resource', {
        templateUrl: 'recruitment/view/create-resource.tpl.ejs',
        controller: 'recruitmentCtrl'
    })
    .when('/recruit-forma', {
        templateUrl: 'recruitment/view/recruit-forma.tpl.ejs',
        controller: 'recruitmentCtrl'
    })
     .when('/recruit-formb', {
        templateUrl: 'recruitment/view/recruit-formb.tpl.ejs',
        controller: 'recruitmentCtrl'
    })
      .when('/recruit-client', {
        templateUrl: 'recruitment/view/recruit-client.tpl.ejs',
        controller: 'recruitmentCtrl'
    })
    .when('/recruit-formc', {
        templateUrl: 'recruitment/view/recruit-formc.tpl.ejs',
        controller: 'recruitmentCtrl'
    }) 
    .when('/recruit-formd', {
        templateUrl: 'recruitment/view/recruit-formd.tpl.ejs',
        controller: 'recruitmentCtrl'
    })
    .when('/changepassword', {
        templateUrl: 'recruitment/view/changepassword.tpl.ejs',
        controller: 'changepasswordCtrl'
    });
    //$locationProvider.ejsl5Mode(true);
});

