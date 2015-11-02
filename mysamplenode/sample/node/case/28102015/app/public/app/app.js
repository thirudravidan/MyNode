'use strict';

var apps = angular.module('formBuilder', ['header', 'ngRoute', 'ngTable', 'ngAnimate', 'ngDragDrop', 'ngSanitize', 'pascalprecht.translate', 'builder', 'builder.components', 'validator.rules', 'ui.calendar'])
.run(function($rootScope, $builder) {
	$rootScope.Data = [];
	$rootScope.Data.Version = '1.0.0.1';
    /*$builder.registerComponent('dropDown', {
        group: 'predefined',
        label: 'Select Box',
        description: 'description',
        placeholder: 'placeholder',
        required: false,
        options: [],
        preOptions : '',
        preOptionsList: [],
        dependency : '',
        dependencyOptions: [],
        functionCall : '',
        templateUrl: 'layout/directive-template/dropdown.html',
        popoverTemplateUrl: 'layout/popover-template/dropdown.html'
    });*/
})
.controller('projectController', function($scope, $rootScope){
	$scope.project = '';
	$scope.loadProject = function(project){
		$scope.project = project+'.png';
	};
});