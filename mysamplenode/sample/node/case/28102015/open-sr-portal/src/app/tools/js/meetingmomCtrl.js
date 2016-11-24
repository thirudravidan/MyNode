apps.controller('meetingmomCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q, Upload) {    
    AjaxMethod.getPageLevelACl();
    $('.dtpicker').datepicker({format: 'yyyy-mm-dd'});
    $scope.showErrOpt = false;    
    $scope.frmLoad = {};
    $scope.frmData = {}; 
    $scope.data = [];
    $scope.frmDiscuss = {};
    $scope.frmAIData = {};
    $scope.frmJoinee = {};
    $scope.userList = [];
    $scope.statuses = {1:'Yet To Start',2:'In Progress',3:'Completed'};
    $scope.editorOptions = {
        language: 'en',
        uiColor: '#000000'
    };
    //$scopeTimings = {'12:00 AM','12:30 AM','01:00 AM','01:30 AM','02:00 AM','02:30 AM','03:00 AM','03:30 AM','04:00 AM','04:30 AM','05:00 AM','05:30 AM','06:00 AM','06:30 AM','07:00 AM','07:30 AM','08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM'};

    $scope.loadUser = function(query) {
        return AjaxMethod.postMethod('user/getTokenUser',{'query':query});
    };

    $scope.getAllUser = function(query) {
        AjaxMethod.postMethod('user/getAllUser', {}).then(function(response){
            $scope.userList = response;
            console.log($scope.userList);
        });
    };

    $scope.saveMeeting = function() {
        console.log($scope.frmData.tags);
        Upload.upload({ 
            url: 'caseTracker/mom/uploadMOMDoc',
            data: {file: $scope.files}
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
        }).success(function (data, status, headers, config) {
            // console.log(JSON.stringify(data));
            // console.log(alasql("SELECT name FROM ? ", [$scope.files]));
            $scope.frmData.files = [];
            if($scope.files && $scope.files.length > 0) {
                $scope.frmData.files = alasql("SELECT name FROM ? ", [$scope.files]);
            }
            $scope.frmData.startDate =$("#startDate").val();
            $scope.frmData.endDate =$("#endDate").val();
            $scope.frmData.userID =$rootScope.loggedUserDet.user_id_pk;
            console.log($scope.frmData);
            var insPath = 'createMom';
            if($scope.frmData.id) { insPath = 'updateMom'; }
            AjaxMethod.postMethod('mom/'+insPath, $scope.frmData).then( function (data) {
                if (data) {
                    if($scope.frmData.id) {
                        $scope.frmData = {};
                        successMsg('MOM', 'Meeting Updated successfully'); 
                    } else {
                        $scope.frmData = {};
                        successMsg('MOM', 'Meeting Created successfully');
                    }
                    $scope.Datainit('getMOMmeeting','i');
                }
                //AjaxMethod.collapseToggle('collapse');
            });
        });
    };

    $scope.Datainit = function (page,type) { 
        AjaxMethod.postMethod('mom/'+page, {}).then(function(response){
            var data = response; 
            $scope.data = data; 
            console.log(response);
            $scope.tableParams.reload();
        });
    };

    $scope.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 10, // count per page
        filter: $scope.searchtxt // Filter Text
    }, {
        counts: [],
        total: $scope.data.length, // length of data
        getData: function ($defer, params) {
            var filteredData = $scope.searchtxt ?
            $filter('filter')($scope.data, $scope.searchtxt) :
                $scope.data;
            var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                $scope.data; 
            params.total(orderedData.length); // set total for recalc pagination
            return orderedData;            
        }
    });

    $scope.editMom = function (momDet) {
        //momcomments momtimezone momendtime momenddate momstarttime momstartdate momlocation momtitle tags
        $scope.frmData.id = momDet.meeting_mas_id_pk;
        $scope.frmData.momtitle = momDet.meeting_title;
        $scope.frmData.momlocation = momDet.meeting_location;
        $scope.frmData.momstartdate = moment(momDet.start_date_time).format("YYYY-MM-DD");
        $scope.frmData.momstarttime = moment(momDet.start_date_time).format("hh:mm A");
        $scope.frmData.momenddate = moment(momDet.end_date_time).format("YYYY-MM-DD");
        $scope.frmData.momendtime = moment(momDet.end_date_time).format("hh:mm A");
        $scope.frmData.momtimezone = momDet.timezone;
        $scope.frmData.momcomments = momDet.comments;
        $scope.frmData.status = (momDet.status === 1)?true:false;
        $scope.frmData.tags = [];
        if(momDet.t2) {
            angular.forEach(momDet.t2, function (value, key) {
                if(value.t4) {
                    $scope.frmData.tags.push({'id':value.t4.user_id_pk,'name':value.t4.first_name+' '+value.t4.last_name,'email':value.t4.email});
                } else {
                    $scope.frmData.tags.push({'name':value.email_id});
                }
            });
        }
        $scope.frmData.inviteList = $scope.frmData.tags;
        console.log($scope.frmData);

    };

    $scope.viewMom = function (momDet) {
        $scope.actionitemData = [];
        AjaxMethod.postMethod('mom/getActionItem', {'mid':momDet.meeting_mas_id_pk}).then(function(response){
            $scope.actionitemData = response;
        });
        $scope.momDetails = momDet;
        $scope.momDetails.discussion = [];
        if($scope.momDetails.meeting_discussion !== null && $scope.momDetails.meeting_discussion !== '') {
            $scope.momDetails.discussion = $scope.momDetails.meeting_discussion.split('||');
        }
    };

    $scope.updateMomDiscusss = function (id) {
        $scope.frmDiscuss.id = id;
        AjaxMethod.postMethod('mom/updateMomDiscusss', $scope.frmDiscuss).then(function(response){
            $scope.momDetails.discussion.push($scope.frmDiscuss.discussNotes);
            $scope.frmDiscuss = {};
        });
    }; 

    $scope.setPresent = function(val,pid,index) {
        AjaxMethod.postMethod('mom/setPresent', {'id':pid,'pstatus':val}).then(function(response){
            $scope.momDetails.t2[index].present = val;
        });
    };

    $scope.getBindData = function (val,type) {
        var uname = '';
        if(type === 'status') {
            return $scope.statuses[val];
        } else if(type === 'user') {
            uname = $filter('filter')($scope.userList, {'id': parseInt(val,10)}, true)[0];
            return uname.name;
        } else if(type === 'email') {
            uname = $filter('filter')($scope.userList, {'id': parseInt(val,10)}, true)[0];
            return uname.email;
        }
    }; 
 
    $scope.saveActionItem = function (id,form) {
        $scope.frmAIData.mid = id;
        var insPath = 'createActionItem';
        if($scope.frmAIData.id) { insPath = 'updateActionItem'; }
        $scope.$broadcast('show-errors-check-validity');
        if (form.$valid) {
            //$scope.frmAIData.username = $scope.frmAIData.userId.name;
            //$scope.frmAIData.email = $scope.frmAIData.userId.email;
            //$scope.frmAIData.userId = $scope.frmAIData.userId.id;
            AjaxMethod.postMethod('mom/'+insPath, $scope.frmAIData).then(function(response){
                if (response) {
                    if($scope.frmAIData.id) {
                        $scope.actionitemData[$scope.frmAIData.rindex].action_items_trans_id_pk=$scope.frmAIData.id;
                        $scope.actionitemData[$scope.frmAIData.rindex].ai_notes = $scope.frmAIData.ainotes;
                        $scope.actionitemData[$scope.frmAIData.rindex].due_date = $scope.frmAIData.due_date;
                        $scope.actionitemData[$scope.frmAIData.rindex].status = $scope.frmAIData.status;
                        $scope.actionitemData[$scope.frmAIData.rindex].reminder_days = $scope.frmAIData.remainder;
                        $scope.actionitemData[$scope.frmAIData.rindex].user_id_fk = $scope.frmAIData.userId[0].id;
                        $scope.actionitemData[$scope.frmAIData.rindex].meeting_mas_id_fk = id;
                        $scope.frmAIData = {};
                        $scope.$broadcast('show-errors-reset');
                        successMsg('Action Item', 'Action Item Updated successfully'); 
                    } else {
                        $scope.actionitemData.push({'action_items_trans_id_pk':response.insertId,'ai_notes':$scope.frmAIData.ainotes,'due_date':$scope.frmAIData.due_date,'status':$scope.frmAIData.status,'reminder_days':$scope.frmAIData.reminder,'user_id_fk':$scope.frmAIData.userId[0].id,'meeting_mas_id_fk':id});
                        $scope.frmAIData = {};
                        $scope.$broadcast('show-errors-reset');
                        successMsg('Action Item', 'Action Item Created successfully');
                    }
                }
            });
        }
    }; 

    $scope.addJoinee = function (id) {
        $scope.frmJoinee.mid = id;
        AjaxMethod.postMethod('mom/addJoinee', $scope.frmJoinee).then(function(response){
            angular.forEach($scope.frmJoinee.userids, function (value, key) {
                $scope.momDetails.t2.push({'meeting_joinee_id_pk':response.insertId,'meeting_mas_id_fk':id,'accepted':0,'user_id_fk':value.id,'present':1});
            });
            $scope.frmJoinee = {};
        });
    }; 

    $scope.editActionItem = function (AIDet,index) {
        $('#ainotes').focus();
        //momcomments momtimezone momendtime momenddate momstarttime momstartdate momlocation momtitle tags
        $scope.frmAIData.id = AIDet.action_items_trans_id_pk;
        $scope.frmAIData.ainotes = AIDet.ai_notes;
        $scope.frmAIData.due_date = moment(AIDet.due_date).format("YYYY-MM-DD");
        $scope.frmAIData.status = AIDet.status;
        $scope.frmAIData.remainder = AIDet.reminder_days;
        $scope.frmAIData.momtitle = AIDet.ai_notes;
        $scope.frmAIData.userId = AIDet.user_id_fk;
        $scope.frmAIData.mid = AIDet.meeting_mas_id_fk;
        $scope.frmAIData.rindex = index;
        console.log($scope.frmData);
        $scope.frmAIData.userId = [];
        if(AIDet.user_id_fk) {
            udet = $filter('filter')($scope.userList, {'id': parseInt(AIDet.user_id_fk,10)}, true)[0];
            $scope.frmAIData.userId.push({'id':udet.id,'name':udet.name,'email':udet.email});
        }

    };

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
                AjaxMethod.postMethod('training/'+insPath, $scope.frmData).then(function(data){
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

    $scope.updateStatus = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'resource_details_id_pk', data.resource_details_id_pk); 
        if(index >= 0) {
            $scope.data[index].interview_status = (data.interview_status === 1)?0:1;
            $scope.tableParams.reload();
        }
    };

    $scope.getArrayIndexForKey =  function(arr, key, val){
        for(var i = 0; i < arr.length; i++){
            if(arr[i][key] === val){
                return i;
            }
        }
        return -1;
    };

    $scope.clearfrm = function() {
        $scope.frmData = {};
    };


    //Action Item Section Starts
    //============================




}).controller('PanelController', function(){
    this.tab = 1; // setting the first tab as active to begin with.

    // changing the content based on what tab is clicked.
    this.selectTab = function(setTab) {
        this.tab = setTab;
    };

    // adding the removing the active tab for the tab triggers to change the look of them.
    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
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

apps.directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                format: 'yyyy-mm-dd',
                autoclose: true
            })
            .on('changeDate', function(ev){
                ngModel.$setViewValue(ev.target.value);
                scope.$apply(function () {
                    ngModel.$setViewValue(ev.target.value);
                });
            });
        }
    };
});
apps.directive('enforceMaxTagsOld', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngCtrl) {
      var maxTags = attrs.maxTags ? parseInt(attrs.maxTags, '10') : null;

      ngCtrl.$parsers.push(function(value) {
        if (value && maxTags && value.length > maxTags) {
          value.splice(value.length - 1, 1);
        }
        return value;
      });
    }
  };
});

apps.directive( 'enforceMaxTags', function () {
    var KEY_BACKSPACE =  8,
        KEY_TAB = 9;

    return {
        require: 'ngModel',
        priority: -10,
        link: function ( $scope, $element, $attrs, ngModelController ) {
            var tagsInputScope = $element.isolateScope(),
                maxTags,
                getTags,
                checkTags,
                maxTagsReached,
                input = $element.find( 'input' ),
                placeholder;

            $attrs.$observe( 'maxTags', function ( _maxTags ) {
                maxTags = _maxTags;
            });

            getTags = function () {
                return ngModelController.$modelValue;
            };

            checkTags = function () {
                var tags = getTags();
                if ( tags && tags.length && tags.length >= maxTags ) {
                    if ( !maxTagsReached ) {
                        // trigger the autocomplete to hide
                        tagsInputScope.events.trigger( 'input-blur' );
                        placeholder = input.attr( 'placeholder' );
                        input.attr( 'placeholder', '' );
                        // use max-width to avoid conflicts with the tiAutosize
                        // directive that ngTagsInput uses
                        input.css( 'max-width', '0' );
                        maxTagsReached = true;
                    }
                } else if ( maxTagsReached ) {
                    input.attr( 'placeholder', placeholder );
                    input.css( 'max-width', '' );
                    maxTagsReached = false;
                }
            };

            $scope.$watchCollection( getTags, checkTags );

            // prevent any keys from being entered into
            // the input when max tags is reached
            input.on( 'keydown', function ( event ) {
                if ( maxTagsReached && event.keyCode !== KEY_BACKSPACE && event.keyCode !== KEY_TAB ) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                }
            });

            // prevent the autocomplete from being triggered
            input.on( 'focus', function ( event ) {
                checkTags();
                if ( maxTagsReached ) {
                    tagsInputScope.hasFocus = true;
                    event.stopImmediatePropagation();
                }
            });
        }
    };
});
/*apps.directive('tokenInput', function ($rootScope,$parse, $http) {
return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            console.log(attr);
            console.log(scope.frmData.inviteList);
            var prepopMailsJson = getElementsAsJson(elem.attr('value'));//getElementsAsJson(elem.attr('value')); 
            $(elem).tokenInput("caseTracker/user/getTokenUser", {
                theme: "facebook",
                allowFreeTagging: false,
                preventDuplicates: true,
                tokenLimit: attr.tokenLimit,
                method: 'POST',
                prePopulate:prepopMailsJson,
                onAdd : function(item){           

                },
                onDelete : function(item){

                }
            });

        }
    };
});*/
