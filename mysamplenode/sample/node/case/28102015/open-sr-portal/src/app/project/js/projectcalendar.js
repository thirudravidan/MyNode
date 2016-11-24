var myDatePicker;
var splholidaysfields=[];
var weekoffs=[];
var holidaysfields=[];
var calLocID;
var calendarType='';
apps.controller('projectcalendarCtrl', function ($cookies,$rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod, $q) {	 
	$rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
	$rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
	AjaxMethod.getPageLevelACl();
	$scope.dateRange =[];
	calendarType='ProjectCalendar';
	$scope.$on('$destroy', function() {
		calendarType ='';
	});

    $scope.getProjectLocation = function () {
        AjaxMethod.postMethod('calendar/getProjectWeekoffDetails', {"projectID":$rootScope.selProjectID}).then(function(response){  
            $scope.locationName = response[0].location_name;
            $scope.weekoff = JSON.parse(response[0].weekoff_days);
            var weekDays='';
            $scope.weekoff.forEach(function(val,key){
                weekDays += (weekDays === '') ? '' : ',';
                weekDays += (val === 0) ? 'Sunday' : (val === 1) ? 'Monday' : (val === 2) ? 'Tuesday' : (val === 3) ? 'Wednesday' : (val === 4) ? 'Thursday' : (val === 5) ? 'Friday' :'Saturday';
            });
            $scope.weekoffDays =weekDays;
        });
    };

    $scope.getLocationHolidayDet =function (){
		AjaxMethod.postMethod('calendar/getProjectLocationHolidayDet', {"projectID":$rootScope.selProjectID}).then(function(response){  
			var res=response[0];
			weekoffs=[];
			holidaysfields =[];
			if (res !== undefined) {
				calLocID =res.cal_loc_id_pk;
				weekoffs = JSON.parse(res.weekoff_days == null ? '[]' : res.weekoff_days);       
				if (res.hasOwnProperty('CHT')) {
					$.each(res.CHT, function (i, rec) {
						var holidayDet = {};
						holidayDet.date=new Date(Date.parse(rec.holiday_date));
						holidayDet.data={};
						holidayDet.data.message=rec.holiday_name;
						holidaysfields.push(holidayDet);
					});
				}
			}
			specialworkingdays=[];
			selectweek=[];
			$.each(weekoffs, function (j, rec) {
				selectweek.push(parseInt(rec,10));				
			});
			$scope.getSpecialWorkingDetails();			
		});

    };

	$scope.getSpecialWorkingDetails =function (){
		AjaxMethod.postMethod('calendar/getSpecialWorkingDays', {"projectID":$rootScope.selProjectID}).then(function(response){  
			var res=response[0];
			$scope.workingdayMasID=0;
			if (res !== undefined) {
				$scope.workingdayMasID=res.splworking_id_pk;
				if (res.hasOwnProperty('SWT')) {
					angular.forEach(res.SWT, function(value, key) {						
						var specialdayDet = {};
						specialdayDet.date=new Date(Date.parse(value.special_date));
						specialdayDet.data={};
						specialdayDet.data.message=value.comments;
						specialworkingdays.push(specialdayDet);
					});
				}				
			}
			$scope.loadCalendar();
		});
	};

	$scope.savespecialWorkingDays =function (){
		var param={};
		param.splMasID=$scope.workingdayMasID;
		param.specialDay=specialworkingdays;
		param.userID=$rootScope.loggedUserDet.user_id_pk;
		param.projectID=$rootScope.selProjectID;
		AjaxMethod.postMethod('calendar/insertSpecialWorking', param).then(function(response){  
			if (response.status) {
				successMsg("Project Calendar", "Special Working Days created Successfully");
				$scope.getLocationHolidayDet();
			}
		});
	};

	$scope.loadCalendar=function (){
        myDatePicker = $('#holidaypicker').glDatePicker({
            cssName: 'default',
            showAlways: true,
            allowMonthSelect: false,
            allowYearSelect: false,
            selectableYears: [2016],
            // selectableDOW: [0,6],
            specialDates: holidaysfields,
            // selectableDates: [{date: new Date(2016, 3-1, 4) },{date: new Date(2016, 3-1, 12) }],
            onClick: function (target, cell, date, data) {
           target.val(date.getFullYear() + ' - ' + date.getMonth() + ' - ' + date.getDate());

                var tp = target.position().top;
                var lft = Math.round(((date.getDay() + 1) * cell.width())) + "px";

                $($(target.parent().find('[gldp-el=mydate]')).find('div')).each(function () {
                    if ($(this).index() >= 10) {
                        if ($(this).data().data.date.getTime() == date.getTime()) {
                            zind = Math.round((Math.round(($(this).index() - 9) / 7)) * cell.height());
                        }
                    }
                });

                $('.editable-popup').css({ "top": (tp + zind + 35) + "px", "left": lft });
                $('.editable-popup').fadeIn('slow');
                $('.editable-popup').addClass('in');

                var el = '<div class="editable-input" style="position: relative;">';
                el += '<input type="text" class="form-control input-sm" placeholder="required" maxlength="100" style="padding-right: 24px;" /></div>';
                el += '<div class="editable-buttons">';
                el += '<button type="button" class="btn btn-primary btn-sm editable-submit">';
                el += '<i class="glyphicon glyphicon-ok"></i>';
                el += '</button>';
                el += '<button type="button" class="btn btn-default btn-sm editable-cancel">';
                el += '<i class="glyphicon glyphicon-remove"></i>';
                el += '</button>';
                el += '</div>';

                $('.editable-popup').find('.popover-content').html(el);
                if (data != null) {
                    $('.editable-popup').find('.editable-input input').val(data.message);
                }
                $('.editable-popup').find('.editable-cancel').click(function () {
                    $('.editable-popup').removeClass('in');
                    $('.editable-popup').fadeOut('slow', function () {
                        $('.editable-popup').find('.popover-content').html('');
                    });
                });

                $('.editable-popup').find('.editable-submit').click(function () {
                    var inp = $('.editable-popup').find('.editable-input input');
                    if ($.trim(inp.val()) === '') {              
                        $(inp).css("border-color", "#b94a48");
                        return;
                    }
                    else {         
                        $(inp).css("border-color", "#ccc");
                    }

                    var obj = {}; var isnew = true;
				$.each(specialworkingdays, function (idx, rec) {
                            if (rec.date._val().time == date._val().time) {
                                isnew = false;
                                obj = rec;
                            }
                        });

                        obj.date = date;
                        obj.data = {};
                        obj.data.message = inp.val();
                        if (isnew === true) {
                            specialworkingdays.push(obj);
                        }

                    /*if ($.inArray(date.getDay(), weekoffs) > -1) {
                        console.log('Special working days');
                        $.each(specialworkingdays, function (idx, rec) {
                            if (rec.date._val().time == date._val().time) {
                                isnew = false;
                                obj = rec;
                            }
                        });

                        obj.date = date;
                        obj.data = {};
                        obj.data.message = inp.val();
                        if (isnew === true) {
                            specialworkingdays.push(obj);
                        }
                    }
                    else {
                        console.log('holidaysfields working days');
                        $.each(holidaysfields, function (idx, rec) {
                            if (rec.date._val().time == date._val().time) {
                                isnew = false;
                                obj = rec;
                            }
                        });

                        obj.date = date;
                        obj.data = {};
                        obj.data.message = inp.val();
                        if (isnew === true) {
                            holidaysfields.push(obj);
                        }
                        $.extend(myDatePicker.options, { specialDates: holidaysfields });
                        myDatePicker.render();
                    }*/

                    $('.editable-popup').removeClass('in');
                    $('.editable-popup').fadeOut('slow');

                    showProjectholidaylist(myDatePicker.options.firstDate._val());
                });
            }

        }).glDatePicker(true);
        myDatePicker.show();
        showProjectholidaylist(myDatePicker.options.firstDate._val());
	};

});

function showProjectholidaylist(_val) {
    var mon = _val.month;
    var year = _val.year;
    $('.holidaylist').html('');
    var specialDates=[];
    $.each(holidaysfields, function (i, rec) {
        if (mon === rec.date.getMonth() && year === rec.date.getFullYear()) {

        var hdddate = rec.date.getDate() + '-' + (parseInt(rec.date.getMonth(),10) + 1) + '-' + rec.date.getFullYear();
		var isSpecial=false;
		if (specialworkingdays.length > 0) {	
			$.each(specialworkingdays, function (j, recspl) {
				if (mon === recspl.date.getMonth() && year === recspl.date.getFullYear()) {
					var splddate = recspl.date.getDate() + '-' + (parseInt(recspl.date.getMonth(),10) + 1) + '-' + recspl.date.getFullYear();
					if (splddate === hdddate) {
						isSpecial =true;
						specialDates.push(splddate);
						$('.holidaylist').append("<span class='date'>" + splddate + "</span><br />");
						$('.holidaylist').append("<span class='message clor_y'>Holiday ("+rec.data.message+") Converted to " + recspl.data.message + "</span><i title='Click to remove Special Working Day' data='" + j + "' class='glyphicon glyphicon-remove work'></i><br /><br />");
					}
				}
			});

			if (!isSpecial) {
				$('.holidaylist').append("<span class='date'>" + hdddate + "</span>");
				// $('.holidaylist').append("<span class='message'>" + rec.data.message + "</span><i title='Click to remove Holiday' data='" + i + "' class='glyphicon glyphicon-remove'></i>");
				$('.holidaylist').append("<span class='message clor_g'>" + rec.data.message + "</span>");
			}
			}else{
				$('.holidaylist').append("<span class='date'>" + hdddate + "</span>");
				// $('.holidaylist').append("<span class='message'>" + rec.data.message + "</span><i title='Click to remove Holiday' data='" + i + "' class='glyphicon glyphicon-remove'></i>");
				$('.holidaylist').append("<span class='message clor_g'>" + rec.data.message + "</span>");
			}
			}
    });

    if (specialworkingdays.length > 0) {
        $.each(specialworkingdays, function (j, rec) {
            if (mon === rec.date.getMonth() && year === rec.date.getFullYear()) {
                var ddate = rec.date.getDate() + '-' + (parseInt(rec.date.getMonth(),10) + 1) + '-' + rec.date.getFullYear();
                if (specialDates.length >0) {
					$.each(specialDates, function (i, splDate) {
						if (splDate !== ddate) {
							$('.holidaylist').append("<span class='date'>" + ddate + "</span><br />");
							$('.holidaylist').append("<span class='message'>" + rec.data.message + "</span><i title='Click to remove Special Working Day' data='" + j + "' class='glyphicon glyphicon-remove work'></i><br /><br />");
						}
					});
                }else{
					$('.holidaylist').append("<span class='date'>" + ddate + "</span><br />");
					$('.holidaylist').append("<span class='message clor_y'>" + rec.data.message + "</span><i title='Click to remove Special Working Day' data='" + j + "' class='glyphicon glyphicon-remove work'></i><br /><br />");
                }
				
            }
        });
    }

    $('.holidaylist .glyphicon-remove').click(function () {
        var index = $(this).attr('data');

        if ($(this).hasClass('work')) {
            specialworkingdays.splice(index, 1);
        }
        else {
            holidaysfields.splice(index, 1);
            $.extend(myDatePicker.options, { specialDates: holidaysfields });
            myDatePicker.render();
        }

        showProjectholidaylist(myDatePicker.options.firstDate._val());
    });
}

function selectableweek() {
    selectweek = [];
    /* $('.weekdays input[type=checkbox]').prop('checked', false);
    $.each(weekoffs, function (i, rec) {
        $('.weekdays input[type=checkbox]').each(function () {
            if ($(this).val() == rec) {
                $(this).prop('checked', true);
            }
        });
    });*/

	$.each(weekoffs, function (j, rec) {
		for (var i =0; i <= 6; i++) {
			if (i === parseInt(rec,10)) {
				selectweek.push(i);
			}
		}
	});
/*$('.weekdays input[type=checkbox]').each(function () {
    if ($(this).is(':checked') === false) {
    weekoffs.push(parseInt($(this).val(),10));


    }else{            
        selectweek.push(parseInt($(this).val(),10));
    }
});*/
}