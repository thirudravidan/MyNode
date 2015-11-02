'use strict';

angular.module('header', [])
.directive('myHeader', function() {
    return {
        restrict: 'E',
        transclude: true,   
        scope: {
            enableShow : '=headershow'
        },
        controller: function($scope, $rootScope, $route, $routeParams, $location) {
            
            $scope.usrRole = userDt.role;
            console.log($scope.usrRole);
            $scope.userMainMenu =  [ 
                {pageName:'Home', path:'home', role:['Agent', 'TM', 'TL', 'QA', 'admin'], selected:false, subMenu:[]},                
                {pageName:'Customer', path:'', role:['Agent', 'TM', 'TL', 'QA', 'admin'], selected:false, subMenu:[
                    {pageName:'Create Customer', path:'customer/customerCreate', role:['Agent', 'TM', 'TL', 'QA', 'admin']}, 
                    {pageName:'Customer List', path:'customer/customerList', role:['Agent', 'TM', 'TL', 'QA', 'admin']}]},
                {pageName:'Reports', path:'', role:['Agent', 'TM', 'TL', 'QA', 'admin'], selected:false, subMenu:[
                    {pageName:'Case Ageing Report', path:'reports/agingList', role:['TM', 'TL', 'QA', 'admin']},
                    {pageName:'Callback Report', path:'reports/callbackList', role:['TM', 'TL', 'QA', 'admin']}, 
                    {pageName:'Case Report', path:'case/casetrackerlist', role:['Agent', 'TM', 'TL', 'QA', 'admin']}]},
                    {pageName:'Macro', path:'getmacro', role:['Agent', 'TM', 'TL', 'QA', 'admin'], selected:false, subMenu:[]},                
            ];
            $scope.userDet = userDt;
            $scope.userDet.name = $scope.userDet.firstName + ' ' + $scope.userDet.lastName;
            $scope.changeStatus = function(status) { /* Change Status for the User LoggedIn */
                var scol = '#1EBA28';
                if(status === 2) scol = '#ec9900'; else if(status === 3) scol = '#FF0000'; 
                $('#iUserlog').css( 'color', scol );
            };
            $scope.isCurrentPath = function (path) { /* Activate Current Menu Highlight */
                path = '/'+path;
                return $location.path() === path;
            };
        },
        templateUrl : 'layout/top_menu.ejs'
        //template: '<div class="tabbable"><ul class="nav nav-tabs"><li ng-repeat="pane in panes" ng-class="{active:pane.selected}"><a href="" ng-click="">{{pane.title}}</a></li></ul><div class="tab-content" ng-transclude></div></div>'
    };
})
.directive('myFooter', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function($scope) {
            $scope.footer = '2015 &copy; CSS Corp. All Rights Reserved';
        },
        //template : '<footer class="footer"><div class="container col-lg-12"><p class="text-muted">{{footer}}</p></div></footer>'
        template: '<footer class="site-footer"><div class="text-center" ng-bind-html="footer"><a href="#" class="go-top"><i class="fa fa-angle-up"></i></a></div></footer>'
    };
})
.directive('myCrumb', function() {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            activePage : '=info'
        },
        controller: function($scope) {
            $scope.urlName = 'Home';
            $scope.url = '/dashboard#/home';
        },
        template: function(elem, attr){
            return '<li><a href="{{url}}">{{urlName}}</a></li><li class="active">'+attr.info+'</li>';
        }
    };
})
.directive('myCallback', function() {
    return {
        restrict: 'E', 
        templateUrl: 'calendar/view/callback.ejs'
    };
})
.directive('ngEnter', function () {
    // return function (scope, element, attrs) {
    //     element.bind('keydown keypress', function (event) {
    //         // if (event.which === 13) {
    //         //     scope.$apply(function () {
    //         //         scope.$eval(attrs.customMacros);
    //         //     });
    //         //     event.preventDefault();
    //         // }
    //         alert('In');
    //         // if (event.keyCode === 65 && event.ctrlKey && event.shiftKey && event.altKey) {
    //         //     alert('Pressed!');
    //         // }
    //     });
    // };


 return {
        restrict: 'A',
        transclude: true,
        // scope: {
        //     activePage : '=enetredVal'
        // },  
        // controller: function($scope) {
        //     $scope.testVal = 'Test';
           
        // },      
        link:function (scope, element, attrs){
            console.log(element);
            element.bind('keydown keypress', function (event) {
                
                if (event.keyCode === 65 && event.ctrlKey && event.shiftKey && event.altKey) {
                    // scope.shortCut='tEST';
                    // console.log(scope.shortCut);
                    var value='';
                    if (event.ctrlKey) {
                            value='ctrl+';
                    }

                    if (event.shiftKey && value!=='') {

                        value+='shift+';
                    }
                    else if (event.shiftKey && value ==='') {
                        value='shift+';
                    }

                    if (event.altKey && value!=='') {
                        value+='alt+';
                    }
                    else if (event.altKey && value ==='') {
                        value='alt+';
                    }
                    // value = (event.ctrlKey)?'ctrl+':(event.shiftKey)?(value !== '')? (value+'shift+'):'shift+':(event.shiftKey)?'alt+':''; 
                    value+=String.fromCharCode(event.keyCode);

                    scope.shortCut=value;
                    alert(scope.shortCut);
                }
            });

        }
    };


});
