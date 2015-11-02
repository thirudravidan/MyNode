'use strict';
apps.controller('calendarCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location) {	 
   // $scope.alerter = CommonCode;
    //$scope.alerter.show('Hello World');
   // $scope.alerter.starttimer();
    
    $scope.frmData = {}; 
	$scope.data = {}; 
	$scope.EdtData = {};
	$scope.dashboardlist =[];
	var data = [];
    $('#dvshow').hide();
  //   $scope.rows = []; 
  //   $scope.counter = 1;
  //   $scope.addRow = function() {  
  //   $scope.rows.push($scope.counter);
  //   $scope.counter++;
  // }  
  
  // var datasocket = {};
  // socket.emit('chat message', 'test');

  $scope.editcalendarSettings =function(obj) { 
        $('#ddlrulename').attr('disabled', true); 
        $scope.frmData.id=obj._id;
        $scope.frmData.ddlrulename=obj.RuleType;
        $scope.frmData.ddlruletype=obj.RuleCondition;
        $scope.frmData.ddlduration=obj.Schedule;
        $scope.frmData.ddlalert=obj.Action;
        $scope.frmData.ddltemplate=obj.Template;  
        $('#calendarSettings').modal('show'); 
    };

  $scope.saveCalendarsettings =function()
    {    
        //chk condition for Rule Type 
        $http.post('caseTracker/calendar/chkcalendarRule', $scope.frmData).success(function(data) { 
            if(data === 1)
            {
                successMsg('Calendar Settings', 'Rule Created Already for this Type'); 
                return false;
            }
            else
            {
                var insPath = 'createCalendarsettings'; 
                         $http.post('caseTracker/calendar/'+insPath, $scope.frmData).success(function(data) { 
                            if (data.errorMessage !== null) {  
                                $scope.frmData={};
                            } else { 
                                 successMsg('Calendar Settings', 'Calendar Settings Created successfully');
                               // alert('success'); 
                                 $scope.frmData = {}; // clear the form so our user is ready to enter another
                                //location.reload(true);
                            }
                            })
                             .error(function(data) {
                                console.log('Error: ' + data);
                            }); 
            }
        })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
    };

 $scope.updatecalendarSettings =function()
    {     
        var updPath = 'updateCalendarsettings'; 
        $http.post('caseTracker/calendar/'+updPath, $scope.frmData).success(function(data) {
       // console.log(data) ;
                if (data.errorMessage !== null) { 
                $scope.frmData={}; 
                } else {
                    successMsg('Calendar Settings', 'Updated Successfully'); 
                     //alert('success'); 
                     $scope.frmData = {}; // clear the form so our user is ready to enter another
                     location.reload(true);
                }
                })
                 .error(function(data) {
                    console.log('Error: ' + data);
                }); 
    };

    $scope.deletecalendarSettings =function(obj)
    {       
        $scope.frmData.id = obj._id;
        $scope.frmData.Status = 1; 
        var delPath = 'deletecalendarSettings'; 
         $http.post('caseTracker/calendar/'+delPath, $scope.frmData).success(function(data) { 
            if (data.errorMessage !== null) {
            $scope.frmData={};  
            } else {
                successMsg('Calendar Settings', 'Deleted Successfully');  
                $scope.frmData = {}; // clear the form so our user is ready to enter another
                location.reload(true); 
                $scope.data.splice($scope.frmData, 1);
            }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


    $scope.Datainit = function (page,type) { 
		$scope.listPromise = $http.post('caseTracker/calendar/'+page, {}).success(function(response) {
			 
        var data = response; 
			$scope.data = data; 
			if($scope.data.length > 0){
				$('#norecords').hide();
			}  
			$scope.tableParams.reload();
		});
	};
    /* jshint ignore:start */
	$scope.tableParams = new ngTableParams({
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
			if(orderedData.length === 0)
				$('#norecords').hide();				
			params.total(orderedData.length); // set total for recalc pagination
			$scope.fdata = orderedData;
			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    /* jshint ignore:end */
    $scope.savecalendarEvents =function()
    {   
        if($('#ddleventtype').val() === 'Callback')
        { 
            if(!$scope.frmData.subject) 
            { 
                successMsg('Calendar Events', 'Please Enter the Title'); 
                $('#subject').focus();
                return false;
            }
            else if(!$scope.frmData.scheduledate)
            {  
                successMsg('Calendar Events', 'Please select Schedule Date'); 
                $('#scheduledate').focus();
                return false;
            }
            else if(!$scope.frmData.scheduletime)
            { 
                successMsg('Calendar Events', 'Please select Schedule Time'); 
                $('#scheduletime').focus();
                return false;
            }
            else if(!$scope.frmData.Description)
            { 
                successMsg('Calendar Events', 'Please enter the Description'); 
                $('#Description').focus();
                return false;
            }
            else
            {
                $scope.frmData.startdate=$scope.frmData.scheduledate;
                $scope.frmData.starttime=$scope.frmData.scheduletime;
                $scope.frmData.enddate=$scope.frmData.scheduledate;
                $scope.frmData.endtime=$scope.frmData.scheduletime; 
            }
        }
        else if($('#ddleventtype').val() === 'Meeting')
        {
            if(!$scope.frmData.startdate) 
            { 
                successMsg('Calendar Events', 'Please Select Start Date'); 
                $('#subject').focus();
                return false;
            }
            else if(!$scope.frmData.starttime)
            {
                successMsg('Calendar Events', 'Please select Start Time'); 
                $('#starttime').focus();
                return false;
            }
            else if(!$scope.frmData.enddate)
            { 
                successMsg('Calendar Events', 'Please select End Date'); 
                $('#enddate').focus();
                return false;
            }
            else if(!$scope.frmData.endtime)
            { 
                successMsg('Calendar Events', 'Please select End Time'); 
                $('#endtime').focus();
                return false;
            }
            else if(!$scope.frmData.participants)
            { 
                successMsg('Calendar Events', 'Please enter the Participants'); 
                $('#participants').focus();
                return false;
            }
            else if(!$scope.frmData.subject)
            { 
                successMsg('Calendar Events', 'Please enter the Subject'); 
                $('#subject').focus();
                return false;
            }
            else if(!$scope.frmData.occurence)
            { 
                successMsg('Calendar Events', 'Please enter the Occurence'); 
                $('#occurence').focus();
                return false;
            } 
        } 
    		var insPath = 'createEvents'; 
    	 	$http.post('caseTracker/calendar/'+insPath, $scope.frmData).success(function(data) { 
					if (data.errorMessage === null) { 
                    $scope.frmData={}; 
					} else {
                        successMsg('Calendar Events', 'Event Created successfully'); 
						$scope.frmData = {}; // clear the form so our user is ready to enter another
						//location.reload(true);
					}
					})
					.error(function(data) {
						console.log('Error: ' + data);
					}); 
    }; 
    $scope.updateCallback =function()
    {  
    	var updPath = 'updatecallbackEvents'; 
    	 $http.post('caseTracker/calendar/'+updPath, $scope.frmData).success(function(data) { 
			if (data.errorMessage === null) { 
            $scope.frmData={}; 
			} else {
                successMsg('Calendar Events', 'Callback Updated successfully'); 
				$scope.frmData = {}; // clear the form so our user is ready to enter another
				location.reload(true);
			}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    };
    $scope.updateMeeting =function()
    {  
    	var updPath = 'updatemeetingEvents';
    	console.log($scope.frmData);
    	 $http.post('caseTracker/calendar/'+updPath, $scope.frmData).success(function(data) {  
			if (data.errorMessage === null) {  
                $scope.frmData={};
			} else {
                successMsg('Calendar Events', 'Meeting Updated successfully');  
				$scope.frmData = {}; // clear the form so our user is ready to enter another
				location.reload(true);
			}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    };

    $scope.deleteEvents =function(obj)
    {       
    	$scope.frmData.id = obj._id;
    	$scope.frmData.Status = 1; 
    	var delPath = 'deleteEvents'; 
    	 $http.post('caseTracker/calendar/'+delPath, $scope.frmData).success(function(data) {  
			if (data.errorMessage === null) { 
            $scope.frmData={}; 
			} else {
                successMsg('Calendar Events', 'Deleted successfully');  
				$scope.frmData = {}; // clear the form so our user is ready to enter another
				location.reload(true); 
				$scope.data.splice($scope.frmData, 1);
			}
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    };

    $scope.dateTimeControls=function() {  
        try {
            var d = new Date();
            var currDate = d.getDate();
            var currMonth = d.getMonth() + 1;
            var currYear = d.getFullYear();
            currDate=(parseInt(currDate,10) < 10)?'0'+currDate:currDate;
            currMonth=(parseInt(currMonth,10) < 10) ?'0'+currMonth:currMonth;
            var dateStr = currMonth + '/' + currDate + '/' + currYear;  
            $('#scheduledate').val(dateStr);
            $('#scheduledate').datepicker({ format: 'mm/dd/yyyy' });

            $('#startdate').val(dateStr);
            $('#startdate').datepicker({ format: 'mm/dd/yyyy' });

            $('#enddate').val(dateStr);
            $('#enddate').datepicker({ format: 'mm/dd/yyyy' });

            $('#startdat').val(dateStr);
            $('#startdat').datepicker({ format: 'mm/dd/yyyy' });

            $('#enddat').val(dateStr);
            $('#enddat').datepicker({ format: 'mm/dd/yyyy' });
            //To show the time 30 minutes ahead
            var thirtyMinutesLater = new Date(d.getTime() + (31 * 60 * 1000));
            
            $('.scheduletime').timepicker({
                defaultTime: thirtyMinutesLater,
                minuteStep: 1,
                showInputs: false,
                disableFocus: false
            }); 
        } catch(e) {
           // stackTrace(e);
        } 
	};
    $scope.editEvents =function(obj) { 
        if(obj.Eventtype === 'callback' || obj.Eventtype === 'Callback') 
        {
        	$('#eventcallbackModel').modal('show');
        	$scope.frmData.id=obj._id;
        	$scope.frmData.startdate=obj.startdate;
        	$scope.frmData.starttime=obj.starttime;
        	$scope.frmData.enddate=obj.startdate;
        	$scope.frmData.endtime=obj.starttime;
        	$scope.frmData.desc=obj.Description;
        }
        else{
        	$('#eventmeetingModel').modal('show');
        	$scope.frmData.id=obj._id;
        	$scope.frmData.startdate=obj.startdate;
        	$scope.frmData.starttime=obj.starttime;
        	$scope.frmData.enddate=obj.enddate;
        	$scope.frmData.endtime=obj.endtime;
        	$scope.frmData.Participants=obj.participants;
        	$scope.frmData.Occurence=obj.occurence;
        }       
    };
 
	$('#ddleventtype').change(function () { 
		var end = this.value;
        var firstDropVal = $('#ddleventtype').val(); 
        $('#dvshow').show();
        if(firstDropVal === 'Callback')
        { 
        	$('#callback').show();
        	$('#meeting').hide(); 
        }
        else if(firstDropVal === 'Meeting')
        {	 
        	$('#callback').hide();
        	$('#meeting').show(); 
        } 
    });
});

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
 


//functionality to format the time
//  function formatConversion() {
//      try{ 
//         //Convert time 24 hour format 
//         //var time = $scope.scheduleTime;
//         var hrs = Number(time.match(/^(\d+)/)[1]);
//         var mnts = Number(time.match(/:(\d+)/)[1]);
//         var format = time.match(/\s(.*)$/)[1];
//         if (format ==== 'PM' && hrs < 12)
//         {hrs = hrs + 12;} 
//         if (format ==== 'AM' && hrs === 12)
//         {hrs = hrs - 12;} 
//         var hours = hrs.toString();
//         var minutes = mnts.toString();
//         if (hrs < 10) {
//           hours = '0' + hours;
//         }
//         if (mnts < 10) {
//           minute1 = '0' + minutes;
//         }
//         return hours + ':' + minutes; 
//     }
//     catch(e)
//     {
//        // stackTrace(e);
//     }  
// }

