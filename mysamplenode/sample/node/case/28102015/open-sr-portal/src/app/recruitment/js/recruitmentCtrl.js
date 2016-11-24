
apps.controller('recruitmentCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q, $window) {    
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    AjaxMethod.getPageLevelACl();
    $('.dtpicker').datepicker({format: 'yyyy-mm-dd'});
    $scope.showErrOpt = false; 
    $scope.searchtxt = '';
    $scope.data = '';  
    $scope.frmLoad = {};
    $scope.frmData = {}; 
    $scope.assessment = {};
    $scope.data = [];
    $scope.projectDetails = [];
    $scope.frmData.education = [];
    $scope.frmData.experiences = [];
    $scope.dailyAttendance = moment().format('MM/DD/YYYY');

    $scope.statuses = [
        {value: 1, text: 'Not Selected'},
        {value: 2, text: 'Selected'}
    ]; 

    $scope.defaultSet = function () {
        AjaxMethod.postMethod('recruitment/defaultSet').then(function(response){
            $scope.frmLoad.position = response;
        });
    };

    $scope.loadDefault = function (){
        AjaxMethod.postMethod('recruitment/getFormDefault', {}).then(function(response){  
            if (response !== null) {  
                $scope.projectDetails=response.projectMas;
                $scope.locationDetails=response.locationMas;
                $scope.divisionDetails=response.divisionMas;
            } 
        });
    };

    $scope.Datainit = function (page,type) {
        var data = '';
            // alert('cs:'+ type);
        if (type === 'c') {
            // alert('c:'+ type);
            $scope.frmsearch = {};
            data = $scope.fulldata;
            $scope.data = $scope.fulldata;
            $scope.clearData();
            $scope.tableParams.reload();
        } else if (type === 's') {
            // alert('s:'+ type);
            data = $scope.fulldata;
            $scope.data = $scope.fulldata;
            $scope.searchData();
            $scope.tableParams.reload();
        } else {
            $scope.frmsearch = {};
            AjaxMethod.postMethod('recruitment/'+page,{'projectID' : $rootScope.selProjectID}).then(function(response){
                data  = response;
                $scope.data = response;
                if (type == 'i') {$scope.fulldata = data;}
                $scope.tableParams.reload();
            });
        }
    };

    $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 6,          // count per page
        filter: $scope.srch // Filter Text
    }, {
        counts: [],
        total: $scope.data.length, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.data, params.orderBy()) :
                    $scope.data;
            orderedData = params.filter() ?
                    $filter('filter')(orderedData, params.filter()) :
                    orderedData;
            params.total(orderedData.length);
            $scope.fdata = orderedData;
            if(orderedData.length > 0) {
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
            //$scope.loading = false;
        }
    });

    $scope.searchData = function () {
      var filter = {};
      filter = $scope.frmsearch;
      angular.extend($scope.tableParams.filter(), filter);
    };

    $scope.searchDatas = function () {
        console.log($scope.frmsearch);
        var filter = $scope.frmsearch;
        $scope.tableParams.filter('sk@gmailco.com', $scope.data);

    };

    $scope.clearData = function () {
        $scope.frmsearch = {};
        $scope.searchData();
    };

    $scope.checkValid = function(data, field) {
        if(data === "" || !data) {
            return "required";
        }
    };

    /* Create Resource Starts */
    $scope.addExp = function() {
        $scope.inserted = {
            id: $scope.frmData.experiences.length+1,
            company: '',
            experience: 0,
            duration: 0 
        };
        $scope.frmData.experiences.push($scope.inserted);
    };

    $scope.addEdu = function() {
        $scope.inserted = {
            id: $scope.frmData.education.length+1,
            qualification: '',
            university: '',
            grade: 0,
            duration: 0
        };
        $scope.frmData.education.push($scope.inserted);
    };

    $scope.remove = function(id, dataSet) { 
        $scope.frmData[dataSet].splice(id, 1);
    };

    $scope.cancelNewRow = function(id, key, index){
        if(id[0] === 'n') {
            $scope.capexTrans[key].splice(index, 1);
        } 
    };

    $scope.createRecruitment = function() {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmRecruit.$valid) {
            if($scope.frmData.education.length > 0) {
                AjaxMethod.postMethod('recruitment/createRecruit', $scope.frmData).then( function (data) {
                    if (data) {
                        if (!data) {  
                            successMsg('Recruitment', 'Recruitment unable to Save the Record');
                        } else {
                            $scope.frmData = {};
                            $scope.frmData.education = {};
                            $scope.frmData.experiences = {};
                            successMsg('Recruitment', 'Recruitment Created successfully'); 
                        }
                    }
                });
            } else {
                $scope.showErrOpt = true;
            }
        }
    };
    /* Create Resource Ends */

    /* Client Form Starts*/
    $scope.recruitClient = function (page, userId) {
        AjaxMethod.postMethod('recruitment/'+page).then(function(response){
            var data = response; 
            $scope.data = data; 
            $scope.tableParams.reload();
        });
    };
    
    $scope.editClientStatus = function (uDet) {
        $scope.frmData = {};
        $scope.frmData.fname = uDet.resource_first_name+' '+uDet.resource_last_name;
        $scope.frmData.contact = uDet.resource_phone_no;
        $scope.frmData.interviewDate = uDet.client_interview_date;
        $scope.frmData.resource_details_id_fk = uDet.resource_details_id_fk;
        $scope.frmData.project_id_fk = uDet.project_id_fk;
        //$scope.frmData.cstatus = uDet.client_interview_status;
        //$scope.frmData.comments = uDet.client_comments;
    };

    $scope.updClientStatus = function() { 
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmclientStatus.$valid) {
            AjaxMethod.postMethod('recruitment/updClientStatus', $scope.frmData).then( function (data) {
                if (data) {
                    successMsg('Recruitment Client', 'Record updated successfully');
                    //$scope.clearfrm();
                    //$location.path('/recruit-client');
                    $window.location.reload();
                    $scope.$apply();
                }
            });
        }
    };
    /* Client Form Starts*/


    /* Add Resource Details Starts */
    $scope.chgSelectionStatus = function(trainingDet,interview_status) {
        var msg = 'Enable status "'+trainingDet.resource_first_name+'". Are you sure?';
        if(interview_status === 1){
            msg = 'Disable status "'+trainingDet.resource_first_name+'". Are you sure?';
        }
        BootstrapDialog.confirm(msg, function(result){
            if(result) {
                var insPath = 'updateSelectStatus';
                $scope.frmData.resource_details_id_pk = trainingDet.resource_details_id_pk; 
                $scope.frmData.interview_status = interview_status; 
                AjaxMethod.postMethod('recruitment/'+insPath, $scope.frmData).then(function(data){
                    if (data) {
                        if(interview_status === 1){
                            successMsg('Selection', 'Status Disabled successfully');
                        }
                        else{
                            successMsg('Selection', 'Status Enabled successfully');
                        }
                        $scope.updateStatus($scope.frmData);
                        $scope.frmData = {}; // clear the form so our user is ready to enter another
                    } 
                });
            }
        });        
    };

    $scope.chgRecStatus = function(val,id,index) {
        var msg = 'Change Status as selected. Are you sure?';
        if(val === 1){
            msg = 'Change status as not selected. Are you sure?';
        }
        var insPath = 'saveStatus';
        $scope.frmData.resource_details_id_pk = id; 
        $scope.frmData.interview_status = val; 
        AjaxMethod.postMethod('recruitment/'+insPath, $scope.frmData).then(function(data){
            if (data) {
                successMsg('Recruitment Status', 'Recruitment Status');
                $scope.data[index].interview_status = val;
                $scope.tableParams.reload();
                $scope.frmData = {}; 
            } 
        });
    };

    $scope.updateStatus = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'resource_details_id_pk', data.resource_details_id_pk); 
        if(index >= 0) {
            $scope.data[index].interview_status = (data.interview_status === 1)?0:1;
            $scope.tableParams.reload();
        }
    };
  
    /* Add Resource Details Ends */

    /* Form A Controllers Starts */

    $scope.clientSchedule = function (flag) {
        if(parseInt(flag,10) === 1) {
            $scope.frmData.iDateFlag = false;
        } else {
            $scope.frmData.iDateFlag = true;
        }        
    };

    $scope.createRtforma = function(frmData) { 
        var insPath = 'creatertformaUnit';
        $scope.frmData.rtdoj =$("#rtdoj").val();
        $scope.frmData.rtclientinterviewdate =$("#rtclientinterviewdate").val();
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.recuritFormA.$valid) {
            AjaxMethod.postMethod('recruitment/'+insPath,$scope.frmData).then( function (data) {
                if (!data) {  
                    successMsg('Form A', 'Recruitment unable to Save the Record');
                } else {
                    $scope.frmData = {};
                    successMsg('Form A', 'Recruitment Created successfully');
                    $scope.Datainit('getRecruitement');
                    AjaxMethod.collapseToggle('collapse');
                }
            });
        }
    };

    $scope.DataRecSel = function (page, userId) {
        AjaxMethod.postMethod('recruitment/'+page, {userId: userId}).then(function(response){
            $scope.frmData = response;
            if($scope.frmData.totExp === 0) {
                $scope.frmData.exp = 0;
            } else {
                $scope.frmData.exp = 1;
            } 
        });
    };
    /* Form A Controller Ends */

    /* Form B Controllers Starts */
    $scope.createRtformb = function() {
        $scope.frmData.resource_details_id_fk =  $scope.details.resource_details_id_fk; 
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.recuritmentformb.$valid) {
            $scope.frmData.agentdetails =$scope.details;
            $scope.frmData.projectID = $rootScope.selProjectID;
            AjaxMethod.postMethod('recruitment/updateFormB', $scope.frmData).then( function (data) {
                if (data) {
                    successMsg('Form B', 'Recruitment updated successfully');
                    $scope.loadRecruitment('getRecuritementFormb','All');
                    AjaxMethod.collapseToggle('collapse');
                }
            });
        }
    };

    $scope.loadRecruitment = function (page,type) {
        AjaxMethod.postMethod('recruitment/'+page,{'projectID' : $rootScope.selProjectID}).then(function(response){
            $scope.data=response;
            $scope.tableParams.reload();
        });
    };

    $scope.editRecruit = function (recruitDet) {
        $scope.details = recruitDet;
        $scope.frmData.emp_id = recruitDet.emp_id;
        $scope.frmData.work_email_id = recruitDet.work_email_id;
    };
    
    /* Form B Controllers Ends */

    $scope.getArrayIndexForKey =  function(arr, key, val){
        for(var i = 0; i < arr.length; i++){
            if(arr[i][key] === val){
                return i;
            }
        }
        return -1;
    };

    $scope.reset = function() {
        $scope.$broadcast('show-errors-reset');
    };

    $scope.clearfrm = function() {
        $scope.reset();
        $scope.frmData = {};
    };

    /* Form D Controller Starts*/

    $scope.rowDet = {};

    $scope.months = {
      "1": "01 - Jan",
      "2": "02 - Feb",
      "3": "03 - Mar",
      "4": "04 - Apr",
      "5": "05 - May",
      "6": "06 - Jun",
      "7": "07 - Jul",
      "8": "08 - Aug",
      "9": "09 - Sep",
      "10": "10 - Oct",
      "11": "11 - Nov",
      "12": "12 - Dec"
    };

    $scope.years={};
    
    $scope.getYears =function (){
        for (var i=golobalconfigs.startYear; i<= golobalconfigs.endYear; i++) {
            $scope.years[i] =i;            
        }
    };

    $scope.loadFromD = function () {
        $scope.getYears();
        $scope.selectedMonth = (moment().month()+1).toString();
        $scope.selectedYear = moment().year().toString();
        $scope.day = moment();
        $rootScope.calDate = {};
        $scope.dRange();
        $scope.getAttendanceMaster();
        AjaxMethod.postMethod('recruitment/getScoreSet', {'prjId':$rootScope.selProjectID}).then(function (response) {
            if(Object.keys(response).length > 0) {
                $scope.data = response.resource;
                $scope.assessment.category = response.assessment;
                if($scope.data.length > 0){
                    $('#norecords').hide();
                }  
                $scope.tableParams.reload();
                $scope.ressetScores();
            }
        });
    };

    $scope.dRange = function () {
        $scope.dateRange = []; 
        var selDate = $scope.selectedMonth+'/01/'+$scope.selectedYear;
        var dt = new Date(selDate);

        // GET THE MONTH AND YEAR OF THE SELECTED DATE.
        var month = dt.getMonth(),
            year = dt.getFullYear(),
            day = dt.getDay();

        var FirstDay = new Date(year, month, 1);
        var LastDay = new Date(year, month + 1, 0);
        for(var i=1; i<=moment(LastDay).date(); i++) {
            var newdate=new Date(year, month, i);
            $scope.dateRange.push({'day':i,'date':moment(newdate).format("YYYY-MM-DD"),'formatteddate':moment(newdate).format("DD-MM-YYYY"),'wday':moment(FirstDay).day(i).format("e")});
            // $scope.dateRange.push({'day':i,'date':moment(FirstDay).day(i).format("YYYY-MM-DD"),'wday':moment(FirstDay).day(i).format("e")});
        }
    };

    $scope.monthChange=function(selmon){
        $scope.selectedMonth =selmon;        
        $scope.getData();
    };  

     $scope.yearChange=function(selyear){
        $scope.selectedYear =selyear;        
        $scope.getData();
    };  

    $scope.getData=function (){
        $scope.dRange();
        $scope.editAssessment($scope.assessment.resource);
        $scope.generateAttendanceData();
    };

    $scope.getAttendanceMaster =function(){
        AjaxMethod.postMethod('recruitment/getattendanceMas', {}).then(function (response) {
            $scope.attendanceMasDet =response;
        });
    };

    $scope.generateAttendanceData = function (){
        $scope.attendanceDetails =[];
        $scope.dateRange.forEach(function (value, key) {
            $scope.attendancedet ={};
            var isDate =false;
            var dataIndex;
            if ($rootScope.attendanceDetails !== undefined) {
                $rootScope.attendanceDetails.forEach(function (val, ind) {
                    var attdt =moment(val.date).format('YYYY-MM-DD');
                    if (value.date === attdt) {
                        isDate=true;
                        dataIndex=ind;
                    }
                });
            }            
            $scope.attendancedet.attandance_trans_pk =(isDate) ? $rootScope.attendanceDetails[dataIndex].attandance_trans_pk : 0;
            $scope.attendancedet.option_id_fk =(isDate) ? $rootScope.attendanceDetails[dataIndex].option_id_fk : 0;
            $scope.attendancedet.comments =(isDate) ? $rootScope.attendanceDetails[dataIndex].comments : '';
            $scope.attendancedet.date =(isDate) ? moment($rootScope.attendanceDetails[dataIndex].date).format('YYYY-MM-DD') : value.date;
            $scope.attendancedet.formatteddate =(isDate) ? moment($rootScope.attendanceDetails[dataIndex].date).format('DD-MM-YYYY') : value.formatteddate;    
            $scope.attendanceDetails.push($scope.attendancedet);        
        }); 
       $('.editaclslide').slimScroll();        
    };

    $scope.showAttVal = function(val) {
        var selected = [];
        if($scope.attendanceMasDet.length && val !== undefined) {
            selected = $filter('filter')($scope.attendanceMasDet, {'option_id_pk': val});
            return (selected.length && val !== '') ? selected[0]['option_name'] : 'None';
        } else {
            return 'None';
        }
    };

    $scope.saveAttendance=function (data,atttransID,attDate){
        var param={};
        param.transID =atttransID;
        param.attDate =attDate;
        param.optID =data.option_id_pk;
        param.comment =data.comments;
        param.resId = $scope.assessment.resource;
        AjaxMethod.postMethod('recruitment/saveAttendance', param).then(function (response) {
        });
    };

     $scope.checkValid = function(data, field) {
        if(data === "" || !data) {
            return "required";
        }
    };

    $scope.ressetScores = function () {
        $scope.assessment.category.category.forEach(function (value, key) {
            $scope.rowDet[value.catId] = {};
            $scope.assessment.category.subCat.forEach(function (subVal, subKey) {
                $scope.rowDet[value.catId][subVal.subId] = 0;
            });
        });
    };

    $scope.getAllEmpAttendance = function (){
        AjaxMethod.postMethod('recruitment/getAttendance',{'projectId': $rootScope.selProjectID}).then(function(response){
            console.log(response);
        });
    };

    $scope.getAttandanceByDay = function (){
        AjaxMethod.postMethod('recruitment/getAttandanceByDay',{'projectId': $rootScope.selProjectID,'selDay':$scope.dailyAttendance}).then(function(response){
            console.log(response);
            $scope.attDetails = response;
        });
    };

    // save edits
    $scope.saveAttandanceByDay = function() {
        var results = [], resObj = {};
        var sCnt = $scope.attDetails.length;
        console.log($scope.attDetails);
        for (var i = sCnt; i--;) {
            var attRes = $scope.attDetails[i];
            param={
                'transID' : (attRes.t3[0].attandance_trans_pk !== undefined)?attRes.t3[0].attandance_trans_pk:0,
                'prjId' : attRes.project_id_fk,
                'optID' : attRes.t3[0].option_id_fk,
                'comment' : attRes.t3[0].comments,
                'attDate' : $scope.dailyAttendance,
                'resId' : attRes.resource_details_id_fk,
                'resName' : attRes.t2.resource_first_name + ' ' + attRes.t2.resource_last_name
            };
            results.push(param);    
        }
        AjaxMethod.postMethod('recruitment/saveAttendanceGroup',results).then(function(response){
            console.log(response);
        });
    };

    $scope.editAssessment = function (resDet) {
        $scope.assessment.resource = resDet;
        var postData = {resId:resDet}, subId = '', subValue = '', tempVal = {};
        $scope.ressetScores();$rootScope.calDate = {};
        AjaxMethod.postMethod('recruitment/getAssessment', postData).then(function (response) {
            response = response[0];
            if(response.hasOwnProperty('rps') && response.rps.length > 0) {
                response.rps.forEach(function (value, key) {
                    $scope.rowDet[value.assessment_ctgy_id_fk][value.assessment_subctgy_id_fk] = value.score_percentage;
                });
            }
            if(response.hasOwnProperty('rpa') && response.rpa.length > 0) {
                $rootScope.attendanceDetails =response.rpa;
                
                // response.rpa.forEach(function (value, key) {
                //     var indexId = moment(value.date);
                //     indexId = indexId.date()+'-'+(indexId.month()+1)+'-'+indexId.week();
                //     $rootScope.calDate[indexId] = (value.status === 1)? true : false;
                //     var dateFormat = moment(value.date).format('YYYY-MM-DD');
                //     $scope.attendence[dateFormat] = {date: dateFormat, status:value.status};
                // });
            }
        });
        $scope.generateAttendanceData();
    };

    $scope.saveScores = function (data, index, resource, catId) {
        var subData = $filter('filter')($scope.assessment.category.subCat, {catId: parseInt(catId, 10)}, true);
        var postData = {data:data, subData:subData, catId: catId, resId: resource};
        AjaxMethod.postMethod('recruitment/insertScoreSet', postData).then(function (response) {
            //console.log(response);
        });
    };
    $scope.attendence = {};

    $rootScope.storeDate = function (date, indexId) {
        var dateFormat = moment(date.date).format('YYYY-MM-DD');
        $scope.attendence[dateFormat] = {date: dateFormat, status:$rootScope.calDate[indexId]};
    };

    $scope.saveAttendence = function () {
        var postData = {data:$scope.attendence, resId: $scope.assessment.resource};
        AjaxMethod.postMethod('recruitment/insertAttendence', postData).then(function (response) {
            // console.log(response);
            if(response) {
                successMsg('Form D', 'Attendence Created successfully');
            }
        });
    };

    $scope.changeDay = function(type) {
        var sdate;
        $scope.isNext = true;
        var currDate = moment().format('MM/DD/YYYY');
        //moment('2010-10-20').isSame('2010-10-20');
        if(type === 'next') {
            sdate = moment($scope.dailyAttendance, "MM/DD/YYYY").add(1, 'day');
        } else if(type === 'prev') {
            sdate = moment($scope.dailyAttendance, "MM/DD/YYYY").subtract(1, 'day');
        } else {
            sdate = moment();
        }
        $scope.dailyAttendance = sdate.format('MM/DD/YYYY');
        if(moment(currDate, "MM/DD/YYYY").isSame($scope.dailyAttendance)) {
            $scope.isNext = true;
        } else {
            $scope.isNext = false;
        }
    };

    //
    
    /* Form D Controller Ends */
}).controller('PanelController', function(){
    this.tab = 1; // setting the first tab as active to begin with.

    this.selectTab = function(setTab) { // changing the content based on what tab is clicked.  
        console.log(setTab);      
        this.tab = setTab;
    };

    this.isSelected = function(checkTab) { // adding the removing the active tab for the tab triggers to change the look of them.
        return this.tab === checkTab;
    };
}).directive("calendar11", function() {
    return {
        restrict: "E",
        templateUrl: "/assets/template/calender.html",
        scope: {
            selected: "="
        },
        link: function(scope) {
            console.log(scope.selected.day());
            scope.selected = _removeTime(scope.selected || moment());
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

            _buildMonth(scope, start, scope.month);

            scope.select = function(day) {
                scope.selected = day.date;  
            };

            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1).date(1));
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };

            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };
    
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month), weekN: date.week() });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        console.log(date);
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                month: month.month()+1,
                year: date.year()
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});

apps.directive('dayCalendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                format: 'mm-dd-yyyy',
                autoclose: true,
                endDate: '+0d'
            })
            .on('changeDate', function(ev){
                ngModel.$setViewValue(ev.target.value);
                var currDate = moment().format('MM/DD/YYYY');
                if(moment(currDate, "MM/DD/YYYY").isSame(ev.target.value)) {
                    scope.isNext = true;
                } else {
                    scope.isNext = false;
                }
                scope.$apply(function () {
                    ngModel.$setViewValue(ev.target.value);
                });
            });
        }
    };
});

function objectFindByKey(array, key, val) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == val) {
            return array[i];
        }
    }
    return null;
}

function successMsg(title,msg) {
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_SUCCESS,
        title: title,
        message: msg,
        buttons: [{
            label: 'Close',
            action: function(dialogItself){
                dialogItself.close();
            }
        }]
    });  
}
