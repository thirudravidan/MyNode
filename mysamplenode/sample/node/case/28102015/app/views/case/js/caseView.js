'use strict';

apps
.controller('caseviewController', ['$scope', '$rootScope', '$builder', '$validator', 'AjaxMethod', 'ngTableParams', '$routeParams', '$filter', '$injector', function($scope, $rootScope, $builder, $validator, AjaxMethod, ngTableParams, $routeParams, $filter, $injector) {
    var checkbox, textbox, email;
    $scope.showCust = false;
    
    $scope.viewCaseEdit = function(caseId) {
        if(caseId) {
            $scope.casetracker = {};
            $scope.casetracker.caseId = $routeParams.caseId;
            AjaxMethod.postMethod('case/getCaseById', $scope.casetracker).then(function(response){
                var caseRes = response[0];
                var resultRes = [];
                angular.forEach(caseRes, function(resValue, key) {
                    $scope.resultValue = {};
                    $scope.resultValue.label = key;
                    $scope.resultValue.value = resValue;
                    resultRes.push($scope.resultValue);
                });
                return resultRes;
            });
        } else {
            return false;
        }
    };

	$scope.loadForm = function() {
        $scope.frmData = {};
        $scope.frmData.formId = $routeParams.formId;
        $builder.forms.default.splice(0, $builder.forms.default.length); // Reset the from builder form objects
        AjaxMethod.postMethod('category/getCatlist').then(function(response){
            $scope.dropdownList = response.category;
            $rootScope.mailList = response.email;
            $rootScope.dropdownList = $scope.dropdownList;
            AjaxMethod.postMethod('formBuilder/getFormView', $scope.frmData).then(function(response){
                if(response) {
                    angular.forEach(response[0].formBuild, function(value, key) {
                        if(value.preForm) {
                            if(value.options.length>0) {
                                value.component = 'dropDown';
                                if(value.preOptions) 
                                    value.options = $scope.preOptionLoad(value.preOptions, $scope.dropdownList);
                                else 
                                    value.preOptions = 0;
                                $builder.addFormObject('default', value);                                
                            }
                            //$scope.loadPreForm(value); // Method Call for load predefined Forms                       
                        } else if(value.component === 'emailTemplate') {
                            value.options = alasql('SELECT _id as id, eTitle as label FROM ? WHERE eStatus=1', [$rootScope.mailList]);
                            $builder.addFormObject('default', value);
                        } else if(value.component === 'agentList') {
                            value.component = 'dropDown';
                            $scope.agentList().then(function(result){
                                value.options = result;
                                $builder.addFormObject('default', value);
                            });
                        } else {
                            if(value.preOptions)
                                value.options = $scope.preOptionLoad(value.preOptions, $scope.dropdownList);

                            $builder.addFormObject('default', value);
                            $scope.getFormBuild(value.preOptions, $builder);
                        }
                    });
                }
            });
        });
	};


    $rootScope.loadDependencyOptions = function(value, id){
        if(value.preForm) 
            $scope.loadPreForm(value); // Method Call for load predefined Forms       
        $scope.getFormBuild(value);
        //console.log($scope.input[value.index]);
        //$rootScope.showView = (value.preOptions === 9 && value.inputText === 84)? true : false;
    };

    $scope.loadPreForm = function(value) { // Load Predefined Form
        var preInputIndex = false;
        preInputIndex = '(input['+value.index+'].value)?false:true';
        if(value.inputText) {
            AjaxMethod.postMethod('formBuilder/getFormView', {formId:parseInt(value.preFormList)}).then(function(preResponse){
                $scope.preFormList = preResponse[0].formBuild;
                angular.forEach(preResponse[0].formBuild, function(preValue, preKey) {
                    var alreadyForm = $filter('filter')($builder.forms.default, {label:preValue.label})[0];
                    if(!alreadyForm) {
                        preValue.hideOptions = preInputIndex;
                        if(preValue.preOptions) 
                            preValue.options = $scope.preOptionLoad(preValue.preOptions, $scope.dropdownList);
                        else 
                            preValue.preOptions = 0;
                        if(preValue.component === 'agentList') {
                            preValue.component = 'dropDown';
                            $scope.agentList().then(function(result){
                                preValue.options = result;
                                $builder.addFormObject('default', preValue);
                            });
                        } else {
                            $builder.addFormObject('default', preValue);
                        }
                    }
                });
            });
        } else {
            if($scope.preFormList) {
                angular.forEach($scope.preFormList, function(preValue, preKey) {
                    var alreadyForm = $filter('filter')($builder.forms.default, {label:preValue.label})[0];
                    if(alreadyForm) {
                        $builder.removeFormObject('default', alreadyForm.index);
                    }
                });
            }
        }
    };

    $scope.getFormBuild = function (parent) {
        var parentId = parent.preOptions;
        var dupFlag = false;
        if(parentId) {
            var addDependency = alasql('SELECT _id as id, name as label, field_name, type, parentId FROM ? WHERE status=1 and type=0 and parentId='+parentId+' and _id!=0', [$rootScope.dropdownList]);
            if(addDependency[0]) {
                var componentObject = {
                    'component' : 'dropDown',
                    'editable' : true,
                    'label' : addDependency[0].label,
                    'description' : '',
                    'placeholder' : 'Select '+addDependency[0].label,
                    'options' : $scope.getCatList(addDependency[0].id, parent.inputText),
                    'required' : true,
                    'validation' : '/.*/',
                    'preOptions' : addDependency[0].id,
                    'dependency' : addDependency[0].parentId,
                    'functionCall' : ''
                };
                angular.forEach($builder.forms.default, function (value, key){
                    if(value.preOptions === addDependency[0].id) {
                        dupFlag = true;
                        $builder.forms.default.splice(key, 1, componentObject);
                        return $scope.getFormBuild(value);
                    }
                });
                if(!dupFlag) {
                    if(addDependency.length > 0) {
                        $builder.insertFormObject('default', parent.index+1, componentObject);
                        return true;
                    } else {
                        return true;
                    }
                }
            }
        }
    };

    $scope.agentList = function() {
        var agentList = [];
        return AjaxMethod.postMethod('user/getAgentDrop').then(function(response){
            angular.forEach(response, function(value, key) {
                agentList.push({id:value.empID, label:value.firstName + ' ' + value.lastName});
            });
            return agentList;
        });
    };

    /*$scope.loadEmailTemplate = function() {
        var mailList = [];
        return AjaxMethod.postMethod('emailtemplate/getMaillist').then(function(response){
            angular.forEach(response, function(value, key) {
                mailList.push({id:value._id, label:value.eTitle});
            });
            return mailList;
        });
    };*/
    $scope.preOptionLoad = function(preOptions, dropdownList) {
        if(preOptions) 
            return alasql('SELECT _id as id, name as label, field_name, type, parentId FROM ? WHERE status=1 and type='+preOptions+' and _id!=0', [dropdownList]);
        else 
            return [];
    };

    $scope.viewCustomer = function() { 
        if($routeParams.customerId) {
            $scope.showCust = true;
            $scope.editUsr = {};
            $scope.editUsr.id = $routeParams.customerId;
            AjaxMethod.postMethod('customer/getcustomerByID', $scope.editUsr).then(function(response){
                var usrRes = response;
                $scope.frmData.id = usrRes._id;
                $scope.frmData.custname = usrRes.firstName + ' ' + usrRes.lastName;
                $scope.frmData.Email = usrRes.Email;
                $scope.input.push({label:'customerId', value:$scope.frmData.id});
            });
        } else {
            return false;
        }
    };

    $scope.getCategoryList = function () {
        AjaxMethod.postMethod('category/getCatlist').then(function(response){
            $scope.dropdownList = response.category;
            $rootScope.dropdownList = response.category;
        });
    };

    $scope.getData = function(value) {
        return value.replace(/[\s]/g,'');
    };

    $scope.getCatList = function (typeId, parentId) {
        return alasql('SELECT _id as id, name as label, field_name, type, parentId FROM ? WHERE status=1 and type='+typeId+' and parentId='+parentId+' and _id!=0', [$rootScope.dropdownList]);
    };

    $scope.getCatListValue = function(value, key){
        if(value) {
            if (angular.isNumber(value) && !$scope.showFields(key) && (key!=='caseId' || key!=='customerId')) {
                if($scope.dropdownList) { 
                    $scope.showCatValue = alasql('SELECT _id as id, name as label FROM ? WHERE status=1 and _id='+value, [$scope.dropdownList]);
                    if($scope.showCatValue[0]) {
                        value = $scope.showCatValue[0].label;
                    }
                } else {
                    value = value;    
                }
            } else {
                value = value;
            }
        }
        return value;
    };

    $scope.showFields = function (value) {
        var returnRes = false;
        var showfields = ['_id','Email Response','Case Notes','Subject Header Suffix','Schedule Callback','Request Type','customerId','Email Template','Callback Number','Reason For Callback','From DateTime','To DateTime','Callback Owner'];
        var filter = $filter('filter')(showfields, value);
        if(filter.length > 0)
            returnRes = true;
        
        return returnRes;
    };
    
    $scope.submit = function() {
        return $validator.validate($scope, 'default').success(function() {
            $scope.postData = {};
            $scope.input.push({label:'customerId', value:$scope.frmData.id});
            angular.forEach($scope.input, function(value, key) {
                $scope.postData[value.label] = value.value;
            });
            AjaxMethod.postMethod('case/createCase', $scope.postData).then(function(response){                
                if(response)
                    successMsg('Create Case', 'Case Created successfully');
                else
                    successMsg('Create Case', 'Case Creation unSuccessfully');
            });
            return console.log('success');
        }).error(function() {
            return console.log('error');
        });
    };
    
    $scope.frmsearch = {};
    $scope.srch = { searchtxt: '' };
    $scope.data = [];
    $scope.fulldata = [];
    var data = [];
    $scope.dataInit = function (page,type) {
        //$scope.loading = true;
        if(type === 'c') {
            $scope.frmsearch = {};
            data = $scope.fulldata;
            $scope.data = $scope.fulldata;
            $scope.clearData();
            $scope.tableParams.reload();
        } else if(type === 's') {
            $scope.frmsearch = {};
            data = $scope.fulldata;
            $scope.data = $scope.fulldata;
            $scope.searchData();
            $scope.tableParams.reload();
        } else {
            $scope.srch.searchtxt = '';
            $scope.frmsearch.empID = 12345;
            AjaxMethod.postMethod('case/'+page, $scope.frmsearch).then(function(response){
                $scope.data = [];
                var dataL = {};
                data = response;
                if(type === 'i') $scope.fulldata = data;
                $scope.data = data;
                $scope.colsName = {};
                angular.forEach(data[0], function (value, key) {
                    $scope.colsName[$scope.getData(key)] = key;
                });
                $scope.tableParams.reload();
            });
        }  
    };
    /* jshint ignore:start */
    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: $scope.srch.searchtxt // Filter Text
    }, {
        counts: [],
        total: $scope.data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.data, params.orderBy()) :
                    $scope.data;
            orderedData = params.filter() ?
                    $filter('filter')(orderedData, params.filter()) :
                    orderedData;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            //$scope.loading = false;
        }
    });
    /* jshint ignore:end */
    
    $scope.searchData = function () {
        //$scope.loading = true;
        var filter = $scope.srch.searchtxt;
        $scope.tableParams.filter(filter, $scope.data);

    };

    $scope.clearData = function(){
        $scope.srch.searchtxt = '';
        $scope.searchData();
    };

}]);
