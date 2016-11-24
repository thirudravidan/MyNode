var myDatePicker;
var selectWeek =[];
var selectedYear=[];
var isLoaded=false;
var holidaysfields;
var specialworkingdays;
var calLocID=0;
var weekoffs =[];

apps.controller('calenderCtrl', function ($rootScope, $scope,$route,$http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {	 
 if($rootScope.isPathChg==='pathChange'){
    $rootScope.isPathChg = '';
    window.location.reload();
 }
 $scope.frmData={};
 $scope.selectedWeekOffDays=[0,6];
 $scope.isshowCalendar =false;
 $scope.isYearSelect =true;
 $scope.weekDays = [{
                "id": 0,
                "value": "Sun"
                }, 
                {
                "id": 1,
                "value": "Mon"
                }, 
                {
                "id": 2,
                "value": "Tue"
                },
                {
                "id": 3,
                "value": "Wed"
                }, {
                "id": 4,
                "value": "Thu"
                }, {
                "id": 5,
                "value": "Fri"
                },{
                "id": 6,
                "value": "Sat"
                }];
selectWeek = $scope.selectedWeekOffDays;
 $scope.years={};
    
$scope.getYears =function (){
    // for (var i=2016; i< 2017; i++) {
    //     $scope.years[i] =i;            
    // }
    for (var i=golobalconfigs.startYear; i< golobalconfigs.endYear; i++) {
        $scope.years[i] =i;            
    }
};

$scope.$on('$destroy', function() {
   isLoaded =false;
});

$scope.loadLocations=function(){
    AjaxMethod.postMethod('project/getLocations', {}).then(function(response){  
        if (response !== null) {  
            $scope.LocationDetails=response;

        } 
    });
};

$scope.changeYear=function(selyear){
    // alert( $scope.frmData.selectedYear);
    $scope.isshowCalendar =true;
    selectedYear =[];
    
    // selectedYear.push(parseInt($scope.frmData.selectedYear,10));
    selectedYear.push(parseInt(selyear,10));
    $scope.getLocationCalendarDetails();
    // $scope.loadCalendar();
    // $scope.changeWeekOffDays();
    // $scope.loadCalendar();  
    
     // $scope.loadCalendar();
     // $scope.changeWeekOffDays();
    if (isLoaded) {
        // console.log(selectedYear);
        // console.log(selectweek);
        // console.log(holidaysfields);
         $.extend(myDatePicker.options, {
                cssName: 'default',
                showAlways: true,
                allowMonthSelect: false,
                allowYearSelect: false,
                selectableYears: selectedYear,
                selectableDOW: selectweek,
                specialDates: holidaysfields
         });

         // myDatePicker.options.selectableYears = [2017];
        myDatePicker.render();
        myDatePicker.show();
        showholidaylist(myDatePicker.options.firstDate._val());
        $scope.changeWeekOffDays();
    }else{
        $scope.loadCalendar();
        $scope.changeWeekOffDays();
    }
    $('#Calendercontent').show();
    
};

$scope.changeLocation=function(selLoc){
    $scope.isYearSelect =false;
    $scope.isshowCalendar =false;
    $scope.frmData.selectedYear='';
    if (selLoc === undefined) {
        $scope.isYearSelect =true;
    }
};

$scope.insertHolidays =function (){
    var param={};
    param.calMasID=calLocID;
    param.locationID =$scope.frmData.seleLocation;
    param.calYear = $scope.frmData.selectedYear;
    param.weekOffDays=JSON.stringify(weekoffs);
    param.holidayDate=holidaysfields;
    param.userID=$rootScope.loggedUserDet.user_id_pk;
    AjaxMethod.postMethod('calendar/saveLocationHolidays', param).then(function(response){
       if (response.status) {
            successMsg("Calendar", "Calendar created Successfully");
            $scope.changeYear();
            $location.path("/projectplan");
       }
    });
};

$scope.changeWeekOffDays =function (){
    $(document).ready(function () {        
        $('.weekdays input[type=checkbox]').change(function () {
            selectableweek();

            $.extend(myDatePicker.options, {
                selectableDOW: selectweek
            });

            myDatePicker.render();
        });
    });
};

$scope.getLocationCalendarDetails =function (){

    var param={};
    param.locationID =$scope.frmData.seleLocation;
    param.selectedYear =$scope.frmData.selectedYear;
    
    var res=ajaxServiceCall("caseTracker/calendar/getLocationCalendar", "POST", JSON.stringify(param))[0];
    // if (true) {};
    // weekoffs = JSON.parse(res.weekoff_days == null ? '[]' : calender.WeekOff);
    weekoffs=[];
     holidaysfields =[];
    if (res !== undefined) {
        calLocID =res.cal_loc_id_pk;
        weekoffs = JSON.parse(res.weekoff_days == null ? '[]' : res.weekoff_days);       
        if (res.hasOwnProperty('CH')) {
             $.each(res.CH, function (i, rec) {
                var holidayDet = {};
                holidayDet.date=new Date(Date.parse(rec.holiday_date));
                holidayDet.data={};
                holidayDet.data.message=rec.holiday_name;
                holidaysfields.push(holidayDet);
             });
        }
    }
    
    specialworkingdays=[];

    $('.weekdays input[type=checkbox]').prop('checked', false);

    $.each(weekoffs, function (i, rec) {
        $('.weekdays input[type=checkbox]').each(function () {
            if ($(this).val() == rec) {
                $(this).prop('checked', true);
            }
        });
    });
    selectableweek();
};

$scope.loadCalendar=function (){
    

    // $(document).ready(function () {        
        isLoaded =true;
        console.log('selectedYear',selectedYear);
        // selectedyear.push(parseInt($('#ddlYear').val()))
        myDatePicker = $('#holidaypicker').glDatePicker({
            cssName: 'default',
            showAlways: true,
            allowMonthSelect: false,
            allowYearSelect: false,
            selectableYears: selectedYear,
            selectableDOW: selectweek,
            specialDates: holidaysfields,
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

                    if ($.inArray(date.getDay(), weekoffs) > -1) {
                        console.log('Special working days');
                        // $.each(specialworkingdays, function (idx, rec) {
                        //     if (rec.date._val().time == date._val().time) {
                        //         isnew = false;
                        //         obj = rec;
                        //     }
                        // });

                        // obj.date = date;
                        // obj.data = {};
                        // obj.data.message = inp.val();
                        // if (isnew === true) {
                        //     specialworkingdays.push(obj);
                        // }
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
                    }

                    $('.editable-popup').removeClass('in');
                    $('.editable-popup').fadeOut('slow');

                    showholidaylist(myDatePicker.options.firstDate._val());
                });
            }
        }).glDatePicker(true);
        myDatePicker.show();
        showholidaylist(myDatePicker.options.firstDate._val());
    // });
};

});

function showholidaylist(_val) {
    var mon = _val.month;
    var year = _val.year;
    $('.holidaylist').html('');
    $.each(holidaysfields, function (i, rec) {
        if (mon === rec.date.getMonth() && year === rec.date.getFullYear()) {

            var ddate = rec.date.getDate() + '-' + (parseInt(rec.date.getMonth(),10) + 1) + '-' + rec.date.getFullYear();
            $('.holidaylist').append("<span class='date'>" + ddate + "</span>");
            $('.holidaylist').append("<span class='message'>" + rec.data.message + "</span><i title='Click to remove Holiday' data='" + i + "' class='glyphicon glyphicon-remove'></i>");
        }
    });

    if (specialworkingdays.length > 0) {

        $('.holidaylist').append('<span class="hdr">Project Preference Working Days</span><br /><br />');

        $.each(specialworkingdays, function (i, rec) {
            if (mon === rec.date.getMonth() && year === rec.date.getFullYear()) {
                var ddate = rec.date.getDate() + '-' + (parseInt(rec.date.getMonth(),10) + 1) + '-' + rec.date.getFullYear();
                $('.holidaylist').append("<span class='date'>" + ddate + "</span><br />");
                $('.holidaylist').append("<span class='message'>" + rec.data.message + "</span><i title='Click to remove Holiday' data='" + i + "' class='glyphicon glyphicon-remove work'></i><br /><br />");
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

        showholidaylist(myDatePicker.options.firstDate._val());
    });
}

apps.directive('yearcalendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                format: " yyyy", // Notice the Extra space at the beginning
                viewMode: "years", 
                minViewMode: "years",
                autoclose: true
            })
            .on('changeDate', function(ev){
                console.log(ev);
                ngModel.$setViewValue(ev.target.value);
                scope.$apply(function () {
                    ngModel.$setViewValue(ev.target.value);
                });
            });
        }
    };
}).directive("checkboxGroup", function() {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                // Determine initial checked boxes
                if (scope.selectedWeekOffDays.indexOf(scope.item.id) !== -1) {
                    elem[0].checked = true;
                }

                // Update array on click
                elem.bind('click', function() {
                    var index = scope.selectedWeekOffDays.indexOf(scope.item.id);
                    // Add if checked
                    if (elem[0].checked) {
                        if (index === -1){
                            scope.selectedWeekOffDays.push(scope.item.id);
                        } 
                    }
                    // Remove if unchecked
                    else {
                        if (index !== -1) {
                                scope.selectedWeekOffDays.splice(index, 1);
                            }
                    }
                    // Sort and update DOM display
                    scope.$apply(scope.selectedWeekOffDays.sort(function(a, b) {
                        return a - b;
                    }));
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

function selectableweek() {
    selectweek = [],weekoffs =[];
    $('.weekdays input[type=checkbox]').each(function () {
        if ($(this).is(':checked') === false) {
            selectweek.push(parseInt($(this).val(),10));

        }else{            
            weekoffs.push(parseInt($(this).val(),10));
        }
    });
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

